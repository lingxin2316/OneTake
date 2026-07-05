package com.albumcleaner.prototype.data

import android.content.Context

data class StoredDecision(
    val id: Long,
    val mediaId: Long,
    val action: ReviewActionType,
    val displayName: String,
    val uri: String,
    val createdAtMillis: Long
) {
    fun toStagedItem(paletteIndex: Int): StagedItem = StagedItem(
        mediaId = mediaId,
        paletteIndex = paletteIndex,
        uri = uri,
        displayName = displayName
    )
}

data class UserSettings(
    val actionBarEnabled: Boolean,
    val skipDeleteTip: Boolean,
    val darkMode: String = "system"
)

enum class DarkMode {
    System, Light, Dark;

    companion object {
        fun fromString(value: String): DarkMode = when (value.lowercase()) {
            "light" -> Light
            "dark" -> Dark
            else -> System
        }
    }

    fun toStringValue(): String = when (this) {
        System -> "system"
        Light -> "light"
        Dark -> "dark"
    }
}

class DecisionStore(context: Context) {
    private val database = AlbumCleanerDatabase.get(context)
    private val reviewActionDao = database.reviewActionDao()
    private val collectionFolderDao = database.collectionFolderDao()
    private val collectionItemDao = database.collectionItemDao()
    private val stagedDao = database.stagedItemDao()
    private val settingsDao = database.userSettingsDao()

    private val defaultSettings = UserSettings(actionBarEnabled = false, skipDeleteTip = false, darkMode = "system")
    private val defaultCollectionName = "精选集"

    suspend fun add(item: MediaItem, action: ReviewActionType) {
        reviewActionDao.insert(
            ReviewActionEntity(
                mediaId = item.id,
                action = action.name,
                displayName = item.displayName,
                uri = item.uri,
                createdAtMillis = System.currentTimeMillis()
            )
        )
    }

    suspend fun all(): List<StoredDecision> {
        return reviewActionDao.getAll().map { it.toStoredDecision() }
    }

    suspend fun count(): Int = reviewActionDao.count()

    suspend fun latest(limit: Int = 20): List<StoredDecision> {
        return reviewActionDao.latest(limit).map { it.toStoredDecision() }
    }

    suspend fun undoLatest(): StoredDecision? {
        val latest = reviewActionDao.latest(1).firstOrNull() ?: return null
        reviewActionDao.deleteById(latest.id)
        if (latest.action == ReviewActionType.Stage.name) {
            stagedDao.remove(latest.mediaId)
        }
        if (latest.action == ReviewActionType.AddToCollection.name) {
            removeFromDefaultCollection(latest.mediaId)
        }
        return latest.toStoredDecision()
    }

    suspend fun removeDecision(id: Long) {
        reviewActionDao.deleteById(id)
    }

    suspend fun clearDecisions() {
        reviewActionDao.clear()
    }

    suspend fun addStaged(item: MediaItem) {
        stagedDao.upsert(
            StagedItemEntity(
                mediaId = item.id,
                paletteIndex = item.id.toInt(),
                uri = item.uri,
                displayName = item.displayName,
                createdAtMillis = System.currentTimeMillis()
            )
        )
        add(item, ReviewActionType.Stage)
    }

    suspend fun stagedItems(): List<StagedItem> {
        return stagedDao.getAll().map {
            StagedItem(
                mediaId = it.mediaId,
                paletteIndex = it.paletteIndex,
                uri = it.uri,
                displayName = it.displayName
            )
        }
    }

    suspend fun addStagedToCollection(items: List<StagedItem>, collectionId: Long? = null) {
        val targetId = collectionId ?: getOrCreateDefaultCollection()
        val now = System.currentTimeMillis()
        val entities = items.map { item ->
            CollectionItemEntity(
                collectionId = targetId,
                mediaId = item.mediaId,
                displayName = item.displayName,
                uri = item.uri,
                addedAtMillis = now
            )
        }
        collectionItemDao.upsertAll(entities)
        items.forEach { item ->
            reviewActionDao.insert(
                ReviewActionEntity(
                    mediaId = item.mediaId,
                    action = ReviewActionType.AddToCollection.name,
                    displayName = item.displayName,
                    uri = item.uri,
                    createdAtMillis = now
                )
            )
        }
        updateCollectionCoverIfNeeded(targetId)
    }

    suspend fun removeStaged(mediaId: Long) {
        stagedDao.remove(mediaId)
    }

    suspend fun clearStaged() {
        stagedDao.clear()
    }

    suspend fun recordBatchDecision(items: List<StagedItem>, action: ReviewActionType) {
        val now = System.currentTimeMillis()
        val entities = items.map {
            ReviewActionEntity(
                mediaId = it.mediaId,
                action = action.name,
                displayName = it.displayName,
                uri = it.uri,
                createdAtMillis = now
            )
        }
        reviewActionDao.insertAll(entities)
    }

    suspend fun getSettings(): UserSettings {
        val entity = settingsDao.get()
        return entity?.toUserSettings() ?: defaultSettings
    }

    suspend fun saveSettings(settings: UserSettings) {
        settingsDao.upsert(settings.toEntity())
    }

    suspend fun getAllCollections(): List<CollectionFolder> {
        val folders = collectionFolderDao.getAll()
        return folders.map { folder ->
            val count = collectionItemDao.countByCollectionId(folder.id)
            folder.toCollectionFolder(count)
        }
    }

    suspend fun getOrCreateDefaultCollection(): Long {
        val existing = collectionFolderDao.getDefault()
        if (existing != null) return existing.id
        val now = System.currentTimeMillis()
        return collectionFolderDao.upsert(
            CollectionFolderEntity(
                name = defaultCollectionName,
                iconRes = "star",
                isDefault = true,
                sortOrder = 0,
                createdAtMillis = now,
                updatedAtMillis = now
            )
        )
    }

    suspend fun createCollection(name: String, iconRes: String = "image"): Long {
        val allFolders = collectionFolderDao.getAll()
        val now = System.currentTimeMillis()
        return collectionFolderDao.upsert(
            CollectionFolderEntity(
                name = name,
                iconRes = iconRes,
                sortOrder = allFolders.size,
                createdAtMillis = now,
                updatedAtMillis = now
            )
        )
    }

    suspend fun renameCollection(id: Long, name: String) {
        collectionFolderDao.updateName(id, name, System.currentTimeMillis())
    }

    suspend fun deleteCollection(id: Long) {
        collectionItemDao.clearByCollectionId(id)
        collectionFolderDao.delete(id)
    }

    suspend fun getCollectionItems(collectionId: Long): List<CollectionItem> {
        return collectionItemDao.getByCollectionId(collectionId).map { it.toCollectionItem() }
    }

    suspend fun getCollectionItemsAsStaged(collectionId: Long): List<StagedItem> {
        return getCollectionItems(collectionId).mapIndexed { index, item ->
            item.toStagedItem(index)
        }
    }

    suspend fun removeFromCollection(collectionId: Long, mediaId: Long) {
        collectionItemDao.remove(collectionId, mediaId)
        updateCollectionCoverIfNeeded(collectionId)
    }

    private suspend fun removeFromDefaultCollection(mediaId: Long) {
        val default = collectionFolderDao.getDefault() ?: return
        collectionItemDao.remove(default.id, mediaId)
        updateCollectionCoverIfNeeded(default.id)
    }

    private suspend fun updateCollectionCoverIfNeeded(collectionId: Long) {
        val items = collectionItemDao.getByCollectionId(collectionId)
        if (items.isNotEmpty()) {
            val coverUri = items.first().uri
            collectionFolderDao.updateCover(collectionId, coverUri, System.currentTimeMillis())
        }
    }

    private fun UserSettingsEntity.toUserSettings(): UserSettings {
        return UserSettings(
            actionBarEnabled = actionBarEnabled,
            skipDeleteTip = skipDeleteTip,
            darkMode = darkMode
        )
    }

    private fun UserSettings.toEntity(): UserSettingsEntity {
        return UserSettingsEntity(
            id = 1,
            actionBarEnabled = actionBarEnabled,
            skipDeleteTip = skipDeleteTip,
            darkMode = darkMode
        )
    }

    private fun ReviewActionEntity.toStoredDecision(): StoredDecision {
        val actionType = runCatching {
            ReviewActionType.valueOf(action)
        }.getOrElse { ReviewActionType.Skip }
        return StoredDecision(
            id = id,
            mediaId = mediaId,
            action = actionType,
            displayName = displayName,
            uri = uri,
            createdAtMillis = createdAtMillis
        )
    }

    private fun CollectionFolderEntity.toCollectionFolder(itemCount: Int): CollectionFolder {
        return CollectionFolder(
            id = id,
            name = name,
            iconRes = iconRes,
            coverUri = coverUri,
            itemCount = itemCount,
            isDefault = isDefault,
            createdAtMillis = createdAtMillis,
            updatedAtMillis = updatedAtMillis
        )
    }

    private fun CollectionItemEntity.toCollectionItem(): CollectionItem {
        return CollectionItem(
            collectionId = collectionId,
            mediaId = mediaId,
            displayName = displayName,
            uri = uri,
            addedAtMillis = addedAtMillis
        )
    }
}