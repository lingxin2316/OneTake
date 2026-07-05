package com.albumcleaner.prototype.data

import org.junit.Test
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Assert.assertNull

class MediaStoreRepositoryTest {

    @Test
    fun testFormatSize() {
        assertEquals("0B", formatSize(0L))
        assertEquals("0B", formatSize(-100L))
        assertEquals("100B", formatSize(100L))
        assertEquals("1.0KB", formatSize(1024L))
        assertEquals("1.5KB", formatSize(1536L))
        assertEquals("1.0MB", formatSize(1024 * 1024L))
        assertEquals("2.5MB", formatSize(2 * 1024 * 1024L + 512 * 1024L))
        assertEquals("1.0GB", formatSize(1024L * 1024L * 1024L))
    }

    @Test
    fun testInferSourceType() {
        assertEquals(SourceType.Screenshot, MediaStoreRepository.inferSourceType("DCIM/Screenshots/", "Screenshot_20260705.png"))
        assertEquals(SourceType.Screenshot, MediaStoreRepository.inferSourceType("", "Screen_Shot_123.jpg"))
        assertEquals(SourceType.Screenshot, MediaStoreRepository.inferSourceType("Pictures/Screenshots/IMG_001.jpg", ""))
        assertEquals(SourceType.Download, MediaStoreRepository.inferSourceType("Download/", "file.pdf"))
        assertEquals(SourceType.Download, MediaStoreRepository.inferSourceType("", "download_file.jpg"))
        assertEquals(SourceType.Download, MediaStoreRepository.inferSourceType("DCIM/Downloads/", "image.png"))
        assertEquals(SourceType.Camera, MediaStoreRepository.inferSourceType("DCIM/Camera/", "IMG_1234.jpg"))
        assertEquals(SourceType.Camera, MediaStoreRepository.inferSourceType("", "IMG_001.jpg"))
        assertEquals(SourceType.Camera, MediaStoreRepository.inferSourceType("Pictures/", "photo.jpg"))
    }

    @Test
    fun testSourceFolder() {
        assertEquals("", MediaStoreRepository.sourceFolder(""))
        assertEquals("", MediaStoreRepository.sourceFolder("/"))
        assertEquals("DCIM", MediaStoreRepository.sourceFolder("DCIM/"))
        assertEquals("DCIM / Camera", MediaStoreRepository.sourceFolder("DCIM/Camera/"))
        assertEquals("Download / Images", MediaStoreRepository.sourceFolder("Download/Images/"))
        assertEquals("Screenshots / image.png", MediaStoreRepository.sourceFolder("Screenshots/image.png"))
        assertEquals("Pictures / Screenshots", MediaStoreRepository.sourceFolder("Pictures/Screenshots/"))
    }

    @Test
    fun testGroupKey() {
        val cameraItem = MediaItem(
            id = 1L, displayName = "IMG_001.jpg", dateLabel = "2026-07-05 10:30",
            sizeLabel = "1MB", sourceType = SourceType.Camera, takenAtMillis = System.currentTimeMillis()
        )
        val screenshotItem = MediaItem(
            id = 2L, displayName = "Screenshot.png", dateLabel = "2026-07-05 10:30",
            sizeLabel = "500KB", sourceType = SourceType.Screenshot, relativePath = "DCIM/Screenshots/"
        )
        val downloadItem = MediaItem(
            id = 3L, displayName = "download.jpg", dateLabel = "2026-07-05 10:30",
            sizeLabel = "2MB", sourceType = SourceType.Download, relativePath = "Download/"
        )

        assertTrue(MediaStoreRepository.groupKey(SourceType.Camera, cameraItem).contains("2026-07"))
        assertTrue(MediaStoreRepository.groupKey(SourceType.Camera, cameraItem).contains("相机拍摄"))
        assertEquals("DCIM / Screenshots", MediaStoreRepository.groupKey(SourceType.Screenshot, screenshotItem))
        assertEquals("Download", MediaStoreRepository.groupKey(SourceType.Download, downloadItem))
    }
}