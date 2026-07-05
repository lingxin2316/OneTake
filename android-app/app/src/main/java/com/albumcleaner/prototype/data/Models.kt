package com.albumcleaner.prototype.data

enum class SourceType {
    Camera,
    Screenshot,
    Download
}

data class MediaItem(
    val id: Long,
    val displayName: String,
    val dateLabel: String,
    val sizeLabel: String,
    val sourceType: SourceType,
    val uri: String = "",
    val sizeBytes: Long = 0L,
    val takenAtMillis: Long = 0L,
    val relativePath: String = ""
)

data class MediaGroup(
    val id: String,
    val title: String,
    val count: Int,
    val sizeLabel: String,
    val sourceType: SourceType,
    val items: List<MediaItem>
)

data class MediaCategory(
    val title: String,
    val count: Int,
    val sizeLabel: String,
    val sourceType: SourceType,
    val groups: List<MediaGroup>
)

data class StagedItem(
    val mediaId: Long,
    val paletteIndex: Int,
    val uri: String = "",
    val displayName: String = ""
)

data class CollectionFolder(
    val id: Long,
    val name: String,
    val iconRes: String = "star",
    val coverUri: String = "",
    val itemCount: Int = 0,
    val isDefault: Boolean = false,
    val createdAtMillis: Long,
    val updatedAtMillis: Long
)

data class CollectionItem(
    val collectionId: Long,
    val mediaId: Long,
    val displayName: String,
    val uri: String,
    val addedAtMillis: Long
) {
    fun toStagedItem(paletteIndex: Int): StagedItem = StagedItem(
        mediaId = mediaId,
        paletteIndex = paletteIndex,
        uri = uri,
        displayName = displayName
    )
}

enum class ReviewActionType {
    Delete,
    Skip,
    Undo,
    AddToCollection,
    Stage
}

data class ReviewAction(
    val mediaId: Long,
    val photoIndex: Int,
    val type: ReviewActionType
)
