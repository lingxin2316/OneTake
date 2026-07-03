package com.albumcleaner.prototype.data

import android.content.ContentUris
import android.content.Context
import android.os.Build
import android.provider.MediaStore
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class MediaStoreRepository(private val context: Context) {
    fun loadCategories(limit: Int = 3_000): List<MediaCategory> {
        val items = loadImages(limit)
        if (items.isEmpty()) return emptyList()

        return SourceType.entries.mapNotNull { sourceType ->
            val sourceItems = items.filter { it.sourceType == sourceType }
            if (sourceItems.isEmpty()) return@mapNotNull null

            MediaCategory(
                title = sourceTitle(sourceType),
                count = sourceItems.size,
                sizeLabel = formatSize(sourceItems.sumOf { it.sizeBytes }),
                sourceType = sourceType,
                groups = buildGroups(sourceType, sourceItems)
            )
        }
    }

    private fun loadImages(limit: Int): List<MediaItem> {
        val collection = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            MediaStore.Images.Media.getContentUri(MediaStore.VOLUME_EXTERNAL)
        } else {
            MediaStore.Images.Media.EXTERNAL_CONTENT_URI
        }

        val projection = arrayOf(
            MediaStore.Images.Media._ID,
            MediaStore.Images.Media.DISPLAY_NAME,
            MediaStore.Images.Media.SIZE,
            MediaStore.Images.Media.DATE_TAKEN,
            MediaStore.Images.Media.DATE_ADDED,
            MediaStore.Images.Media.RELATIVE_PATH
        )

        val sortOrder = "${MediaStore.Images.Media.DATE_ADDED} DESC"
        val dateFormat = SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.getDefault())

        context.contentResolver.query(collection, projection, null, null, sortOrder)?.use { cursor ->
            val idColumn = cursor.getColumnIndexOrThrow(MediaStore.Images.Media._ID)
            val nameColumn = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DISPLAY_NAME)
            val sizeColumn = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.SIZE)
            val takenColumn = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATE_TAKEN)
            val addedColumn = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATE_ADDED)
            val pathColumn = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.RELATIVE_PATH)

            val items = mutableListOf<MediaItem>()
            while (cursor.moveToNext() && items.size < limit) {
                val id = cursor.getLong(idColumn)
                val displayName = cursor.getString(nameColumn).orEmpty().ifBlank { "IMG_$id" }
                val sizeBytes = cursor.getLong(sizeColumn).coerceAtLeast(0L)
                val takenAt = cursor.getLong(takenColumn)
                val addedAt = cursor.getLong(addedColumn) * 1000L
                val timestamp = if (takenAt > 0L) takenAt else addedAt
                val relativePath = cursor.getString(pathColumn).orEmpty()
                val uri = ContentUris.withAppendedId(collection, id).toString()

                items.add(
                    MediaItem(
                        id = id,
                        displayName = displayName,
                        dateLabel = dateFormat.format(Date(timestamp)),
                        sizeLabel = formatSize(sizeBytes),
                        sourceType = inferSourceType(relativePath, displayName),
                        uri = uri,
                        sizeBytes = sizeBytes,
                        takenAtMillis = timestamp,
                        relativePath = relativePath
                    )
                )
            }
            return items
        }

        return emptyList()
    }

    private fun buildGroups(sourceType: SourceType, items: List<MediaItem>): List<MediaGroup> {
        val grouped = items
            .groupBy { groupKey(sourceType, it) }
            .entries
            .sortedWith(compareByDescending<Map.Entry<String, List<MediaItem>>> { it.value.size }.thenBy { it.key })

        val largeGroups = grouped.filter { it.value.size >= MIN_GROUP_SIZE }
        val smallGroups = grouped.filter { it.value.size < MIN_GROUP_SIZE }
        val mergedGroups = buildList<Map.Entry<String, List<MediaItem>>> {
            addAll(largeGroups)
            if (smallGroups.isNotEmpty()) {
                add(
                    SimpleEntry(
                        key = "其他${sourceTitle(sourceType)}",
                        value = smallGroups.flatMap { it.value }.sortedByDescending { it.takenAtMillis }
                    )
                )
            }
        }

        return mergedGroups.take(MAX_GROUP_COUNT).mapIndexed { index, entry ->
            val groupItems = entry.value
            MediaGroup(
                id = "${sourceType.name.lowercase(Locale.US)}-$index",
                title = entry.key,
                count = groupItems.size,
                sizeLabel = formatSize(groupItems.sumOf { it.sizeBytes }),
                sourceType = sourceType,
                items = groupItems
            )
        }
    }

    private fun groupKey(sourceType: SourceType, item: MediaItem): String {
        return when (sourceType) {
            SourceType.Camera -> "${item.dateLabel.take(7).ifBlank { "未知月份" }} 相机拍摄"
            SourceType.Screenshot -> sourceFolder(item.relativePath).ifBlank { "截图" }
            SourceType.Download -> sourceFolder(item.relativePath).ifBlank { "下载图片" }
        }
    }

    private fun sourceFolder(relativePath: String): String {
        val parts = relativePath.trim('/').split('/').filter { it.isNotBlank() }
        return parts.takeLast(2).joinToString(" / ")
    }

    private fun inferSourceType(relativePath: String, displayName: String): SourceType {
        val marker = "${relativePath.lowercase(Locale.US)} ${displayName.lowercase(Locale.US)}"
        return when {
            "screenshot" in marker || "screenshots" in marker || "screen_shot" in marker -> SourceType.Screenshot
            "download" in marker || "downloads" in marker -> SourceType.Download
            else -> SourceType.Camera
        }
    }

    private fun sourceTitle(type: SourceType): String = when (type) {
        SourceType.Camera -> "相机拍摄"
        SourceType.Screenshot -> "截图"
        SourceType.Download -> "下载图片"
    }

    private data class SimpleEntry(
        override val key: String,
        override val value: List<MediaItem>
    ) : Map.Entry<String, List<MediaItem>>

    private companion object {
        const val MIN_GROUP_SIZE = 8
        const val MAX_GROUP_COUNT = 12
    }
}

fun formatSize(bytes: Long): String {
    if (bytes <= 0L) return "0B"
    val units = listOf("B", "KB", "MB", "GB")
    var value = bytes.toDouble()
    var unitIndex = 0
    while (value >= 1024.0 && unitIndex < units.lastIndex) {
        value /= 1024.0
        unitIndex += 1
    }
    return if (unitIndex == 0) {
        "${value.toLong()}${units[unitIndex]}"
    } else {
        String.format(Locale.US, "%.1f%s", value, units[unitIndex])
    }
}
