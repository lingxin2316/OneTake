package com.albumcleaner.prototype.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

object AppColors {
    val Primary = Color(0xFF2563EB)
    val PrimarySoft = Color(0xFFDBEAFE)
    val Ink = Color(0xFF111827)
    val Muted = Color(0xFF6B7280)
    val Subtle = Color(0xFF9CA3AF)
    val Line = Color(0xFFE5E7EB)
    val Delete = Color(0xFFEF4444)
    val Favorite = Color(0xFFF59E0B)
    val Undo = Color(0xFF14B8A6)
    val Bg = Color(0xFFF3F5F8)
    val Card = Color.White
    val Stage = Color(0xFF7C3AED)
    val StageSoft = Color(0xFFEDE9FE)
}

private val Scheme = lightColorScheme(
    primary = AppColors.Primary,
    surface = AppColors.Card,
    background = AppColors.Bg,
    onSurface = AppColors.Ink
)

@Composable
fun AlbumCleanerTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = Scheme,
        content = content
    )
}
