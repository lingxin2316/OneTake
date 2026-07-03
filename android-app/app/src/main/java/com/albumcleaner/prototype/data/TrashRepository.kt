package com.albumcleaner.prototype.data

import android.app.PendingIntent
import android.content.Context
import android.net.Uri
import android.os.Build
import android.provider.MediaStore

class TrashRepository(private val context: Context) {
    fun createTrashRequest(item: MediaItem): PendingIntent? {
        return createTrashRequest(item.uri, trashed = true)
    }

    fun createRestoreRequest(item: StoredDecision): PendingIntent? {
        return createTrashRequest(item.uri, trashed = false)
    }

    private fun createTrashRequest(uriValue: String, trashed: Boolean): PendingIntent? {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R || uriValue.isBlank()) return null
        val uri = Uri.parse(uriValue)
        return MediaStore.createTrashRequest(context.contentResolver, listOf(uri), trashed)
    }
}
