package com.albumcleaner.prototype.data

import androidx.compose.ui.geometry.Offset
import kotlin.math.abs

object GestureDetector {
    private const val MIN_SWIPE_DISTANCE = 60f

    fun detectAction(offset: Offset): ReviewActionType? {
        if (maxOf(abs(offset.x), abs(offset.y)) < MIN_SWIPE_DISTANCE) return null
        return if (abs(offset.x) > abs(offset.y)) {
            if (offset.x > 0) ReviewActionType.Undo else ReviewActionType.Skip
        } else {
            if (offset.y > 0) ReviewActionType.AddToCollection else ReviewActionType.Delete
        }
    }
}