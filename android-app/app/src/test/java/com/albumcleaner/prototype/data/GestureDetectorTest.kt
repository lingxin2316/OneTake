package com.albumcleaner.prototype.data

import androidx.compose.ui.geometry.Offset
import org.junit.Test
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull

class GestureDetectorTest {

    @Test
    fun testNoActionBelowThreshold() {
        assertNull(GestureDetector.detectAction(Offset(59f, 0f)))
        assertNull(GestureDetector.detectAction(Offset(0f, 59f)))
        assertNull(GestureDetector.detectAction(Offset(30f, 30f)))
        assertNull(GestureDetector.detectAction(Offset(0f, 0f)))
        assertNull(GestureDetector.detectAction(Offset(-59f, 0f)))
    }

    @Test
    fun testDeleteAction() {
        assertEquals(ReviewActionType.Delete, GestureDetector.detectAction(Offset(0f, -60f)))
        assertEquals(ReviewActionType.Delete, GestureDetector.detectAction(Offset(20f, -100f)))
        assertEquals(ReviewActionType.Delete, GestureDetector.detectAction(Offset(-20f, -80f)))
        assertEquals(ReviewActionType.Delete, GestureDetector.detectAction(Offset(0f, -1000f)))
    }

    @Test
    fun testAddToCollectionAction() {
        assertEquals(ReviewActionType.AddToCollection, GestureDetector.detectAction(Offset(0f, 60f)))
        assertEquals(ReviewActionType.AddToCollection, GestureDetector.detectAction(Offset(20f, 100f)))
        assertEquals(ReviewActionType.AddToCollection, GestureDetector.detectAction(Offset(-20f, 80f)))
        assertEquals(ReviewActionType.AddToCollection, GestureDetector.detectAction(Offset(0f, 1000f)))
    }

    @Test
    fun testUndoAction() {
        assertEquals(ReviewActionType.Undo, GestureDetector.detectAction(Offset(60f, 0f)))
        assertEquals(ReviewActionType.Undo, GestureDetector.detectAction(Offset(100f, 20f)))
        assertEquals(ReviewActionType.Undo, GestureDetector.detectAction(Offset(80f, -20f)))
        assertEquals(ReviewActionType.Undo, GestureDetector.detectAction(Offset(1000f, 0f)))
    }

    @Test
    fun testSkipAction() {
        assertEquals(ReviewActionType.Skip, GestureDetector.detectAction(Offset(-60f, 0f)))
        assertEquals(ReviewActionType.Skip, GestureDetector.detectAction(Offset(-100f, 20f)))
        assertEquals(ReviewActionType.Skip, GestureDetector.detectAction(Offset(-80f, -20f)))
        assertEquals(ReviewActionType.Skip, GestureDetector.detectAction(Offset(-1000f, 0f)))
    }

    @Test
    fun testDiagonalSwipes() {
        assertEquals(ReviewActionType.Delete, GestureDetector.detectAction(Offset(30f, -80f)))
        assertEquals(ReviewActionType.AddToCollection, GestureDetector.detectAction(Offset(30f, 80f)))
        assertEquals(ReviewActionType.Undo, GestureDetector.detectAction(Offset(80f, 30f)))
        assertEquals(ReviewActionType.Skip, GestureDetector.detectAction(Offset(-80f, 30f)))
        assertEquals(ReviewActionType.Delete, GestureDetector.detectAction(Offset(-30f, -80f)))
        assertEquals(ReviewActionType.AddToCollection, GestureDetector.detectAction(Offset(-30f, 80f)))
        assertEquals(ReviewActionType.Undo, GestureDetector.detectAction(Offset(80f, -30f)))
        assertEquals(ReviewActionType.Skip, GestureDetector.detectAction(Offset(-80f, -30f)))
    }

    @Test
    fun testExactThreshold() {
        assertEquals(ReviewActionType.Delete, GestureDetector.detectAction(Offset(0f, -60f)))
        assertEquals(ReviewActionType.Undo, GestureDetector.detectAction(Offset(60f, 0f)))
    }
}