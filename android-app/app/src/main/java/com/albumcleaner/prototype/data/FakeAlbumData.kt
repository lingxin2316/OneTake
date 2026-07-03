package com.albumcleaner.prototype.data

object FakeAlbumData {
    val reviewItems = List(32) { index ->
        MediaItem(
            id = index + 1L,
            displayName = "IMG_20260620_${index + 142}.jpg",
            dateLabel = "2026-06-20 14:${(32 + index).toString().padStart(2, '0')}",
            sizeLabel = "3.2MB",
            sourceType = SourceType.Camera,
            sizeBytes = 3_200_000L,
            takenAtMillis = 1_750_403_520_000L + index * 60_000L,
            relativePath = "DCIM/Camera/"
        )
    }

    val categories = listOf(
        MediaCategory(
            title = "相机拍摄",
            count = 1245,
            sizeLabel = "620MB",
            sourceType = SourceType.Camera,
            groups = listOf(
                MediaGroup("camera-grad", "2026-06-20 毕业典礼", 32, "96MB", SourceType.Camera, reviewItems),
                MediaGroup("camera-weekend", "2026-06-18 周末聚餐", 18, "54MB", SourceType.Camera, reviewItems.take(18)),
                MediaGroup("camera-park", "2026-06-15 公园散步", 24, "72MB", SourceType.Camera, reviewItems.take(24))
            )
        ),
        MediaCategory(
            title = "截图",
            count = 856,
            sizeLabel = "430MB",
            sourceType = SourceType.Screenshot,
            groups = listOf(
                MediaGroup("shot-wechat", "微信截图", 234, "118MB", SourceType.Screenshot, reviewItems),
                MediaGroup("shot-social", "微博截图", 156, "82MB", SourceType.Screenshot, reviewItems),
                MediaGroup("shot-browser", "浏览器截图", 89, "46MB", SourceType.Screenshot, reviewItems)
            )
        ),
        MediaCategory(
            title = "下载图片",
            count = 746,
            sizeLabel = "210MB",
            sourceType = SourceType.Download,
            groups = listOf(
                MediaGroup("download-meme", "表情包/趣图", 312, "88MB", SourceType.Download, reviewItems),
                MediaGroup("download-view", "风景/建筑", 178, "72MB", SourceType.Download, reviewItems),
                MediaGroup("download-doc", "文字/文档", 98, "50MB", SourceType.Download, reviewItems)
            )
        )
    )
}
