package com.albumcleaner.prototype.data

import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import kotlinx.coroutines.runBlocking

@RunWith(AndroidJUnit4::class)
class DecisionStoreTest {
    private lateinit var database: AlbumCleanerDatabase
    private lateinit var store: DecisionStore

    @Before
    fun setup() {
        database = Room.inMemoryDatabaseBuilder(
            ApplicationProvider.getApplicationContext(),
            AlbumCleanerDatabase::class.java
        ).allowMainThreadQueries().build()
        store = DecisionStore(ApplicationProvider.getApplicationContext())
    }

    @After
    fun teardown() {
        database.close()
    }

    @Test
    fun testAddAndGetDecision() = runBlocking {
        val item = MediaItem(
            id = 1L,
            displayName = "test.jpg",
            dateLabel = "2026-07-05",
            sizeLabel = "100KB",
            sourceType = SourceType.Camera,
            uri = "content://media/external/images/media/1",
            sizeBytes = 102400L,
            takenAtMillis = System.currentTimeMillis()
        )

        store.add(item, ReviewActionType.Delete)

        val decisions = store.all()
        assertEquals(1, decisions.size)
        assertEquals(1L, decisions[0].mediaId)
        assertEquals("test.jpg", decisions[0].displayName)
        assertEquals(ReviewActionType.Delete, decisions[0].action)
    }

    @Test
    fun testLatestDecisions() = runBlocking {
        repeat(5) { i ->
            store.add(
                MediaItem(
                    id = i.toLong(),
                    displayName = "img$i.jpg",
                    dateLabel = "2026-07-05",
                    sizeLabel = "100KB",
                    sourceType = SourceType.Camera
                ),
                ReviewActionType.Skip
            )
        }

        val latest = store.latest(3)
        assertEquals(3, latest.size)
        assertEquals(4L, latest[0].mediaId)
        assertEquals(3L, latest[1].mediaId)
        assertEquals(2L, latest[2].mediaId)
    }

    @Test
    fun testRemoveDecision() = runBlocking {
        store.add(
            MediaItem(id = 1L, displayName = "test.jpg", dateLabel = "2026-07-05", sizeLabel = "100KB", sourceType = SourceType.Camera),
            ReviewActionType.Delete
        )
        val decision = store.all().first()

        store.removeDecision(decision.id)

        assertEquals(0, store.all().size)
    }

    @Test
    fun testClearDecisions() = runBlocking {
        repeat(3) { i ->
            store.add(
                MediaItem(id = i.toLong(), displayName = "img$i.jpg", dateLabel = "2026-07-05", sizeLabel = "100KB", sourceType = SourceType.Camera),
                ReviewActionType.Skip
            )
        }

        store.clearDecisions()

        assertEquals(0, store.all().size)
    }

    @Test
    fun testStagedItems() = runBlocking {
        val item = MediaItem(
            id = 1L,
            displayName = "staged.jpg",
            dateLabel = "2026-07-05",
            sizeLabel = "200KB",
            sourceType = SourceType.Camera,
            uri = "content://media/external/images/media/1"
        )

        store.addStaged(item)
        val staged = store.stagedItems()

        assertEquals(1, staged.size)
        assertEquals(1L, staged[0].mediaId)
        assertEquals("staged.jpg", staged[0].displayName)

        store.removeStaged(1L)
        assertEquals(0, store.stagedItems().size)
    }

    @Test
    fun testSettingsPersistence() = runBlocking {
        val settings = store.getSettings()
        assertFalse(settings.actionBarEnabled)
        assertFalse(settings.skipDeleteTip)

        store.saveSettings(UserSettings(actionBarEnabled = true, skipDeleteTip = true))

        val loaded = store.getSettings()
        assertTrue(loaded.actionBarEnabled)
        assertTrue(loaded.skipDeleteTip)
    }

    @Test
    fun testBatchDecision() = runBlocking {
        val items = listOf(
            StagedItem(mediaId = 1L, paletteIndex = 0, uri = "uri1", displayName = "a.jpg"),
            StagedItem(mediaId = 2L, paletteIndex = 1, uri = "uri2", displayName = "b.jpg")
        )

        store.recordBatchDecision(items, ReviewActionType.Delete)

        val decisions = store.all()
        assertEquals(2, decisions.size)
        assertTrue(decisions.all { it.action == ReviewActionType.Delete })
    }
}