package com.albumcleaner.prototype.data

import android.content.Context

data class StoredDecision(
    val id: Long,
    val mediaId: Long,
    val action: ReviewActionType,
    val displayName: String,
    val uri: String,
    val createdAtMillis: Long
)

class DecisionStore(context: Context) {
    private val database = AlbumCleanerDatabase.get(context)
    private val decisionDao = database.decisionRecordDao()
    private val stagedDao = database.stagedItemDao()

    suspend fun add(item: MediaItem, action: ReviewActionType) {
        decisionDao.insert(
            DecisionRecordEntity(
                mediaId = item.id,
                action = action.name,
                displayName = item.displayName,
                uri = item.uri,
                createdAtMillis = System.currentTimeMillis()
            )
        )
    }

    suspend fun all(): List<StoredDecision> {
        return decisionDao.getAll().map { it.toStoredDecision() }
    }

    suspend fun count(): Int = decisionDao.count()

    suspend fun latest(limit: Int = 20): List<StoredDecision> {
        return decisionDao.latest(limit).map { it.toStoredDecision() }
    }

    suspend fun undoLatest(): StoredDecision? {
        val latest = decisionDao.latest(1).firstOrNull() ?: return null
        decisionDao.deleteById(latest.id)
        if (latest.action == ReviewActionType.Stage.name) {
            stagedDao.remove(latest.mediaId)
        }
        return latest.toStoredDecision()
    }

    suspend fun removeDecision(id: Long) {
        decisionDao.deleteById(id)
    }

    suspend fun clearDecisions() {
        decisionDao.clear()
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

    suspend fun addStagedToCollection(items: List<StagedItem>) {
        items.forEach { item ->
            decisionDao.insert(
                DecisionRecordEntity(
                    mediaId = item.mediaId,
                    action = ReviewActionType.AddToCollection.name,
                    displayName = item.displayName,
                    uri = item.uri,
                    createdAtMillis = System.currentTimeMillis()
                )
            )
        }
    }

    suspend fun removeStaged(mediaId: Long) {
        stagedDao.remove(mediaId)
    }

    suspend fun clearStaged() {
        stagedDao.clear()
    }

    private fun DecisionRecordEntity.toStoredDecision(): StoredDecision {
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
}
