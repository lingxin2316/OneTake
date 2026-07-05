package com.albumcleaner.prototype.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

object AppColors {
    val Primary = Color(0xFF2563EB)
    val Delete = Color(0xFFEF4444)
    val Favorite = Color(0xFFF59E0B)
    val Undo = Color(0xFF14B8A6)
    val Stage = Color(0xFF7C3AED)
}

data class ThemeColors(
    val PrimarySoft: Color,
    val Ink: Color,
    val Muted: Color,
    val Subtle: Color,
    val Line: Color,
    val Bg: Color,
    val Card: Color,
    val StageSoft: Color,
    val SurfaceOverlay: Color
)

val lightThemeColors = ThemeColors(
    PrimarySoft = Color(0xFFDBEAFE),
    Ink = Color(0xFF111827),
    Muted = Color(0xFF6B7280),
    Subtle = Color(0xFF9CA3AF),
    Line = Color(0xFFE5E7EB),
    Bg = Color(0xFFF3F5F8),
    Card = Color.White,
    StageSoft = Color(0xFFEDE9FE),
    SurfaceOverlay = Color(0x14000000)
)

val darkThemeColors = ThemeColors(
    PrimarySoft = Color(0xFF1E40AF),
    Ink = Color(0xFFF9FAFB),
    Muted = Color(0xFF9CA3AF),
    Subtle = Color(0xFF6B7280),
    Line = Color(0xFF374151),
    Bg = Color(0xFF111827),
    Card = Color(0xFF1F2937),
    StageSoft = Color(0xFF4C1D95),
    SurfaceOverlay = Color(0x14FFFFFF)
)

val LocalThemeColors = staticCompositionLocalOf<ThemeColors> {
    error("LocalThemeColors not provided")
}

val LightScheme = lightColorScheme(
    primary = AppColors.Primary,
    surface = lightThemeColors.Card,
    background = lightThemeColors.Bg,
    onSurface = lightThemeColors.Ink
)

val DarkScheme = darkColorScheme(
    primary = AppColors.Primary,
    surface = darkThemeColors.Card,
    background = darkThemeColors.Bg,
    onSurface = darkThemeColors.Ink
)

@Composable
fun AlbumCleanerTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colors = if (darkTheme) darkThemeColors else lightThemeColors
    val scheme = if (darkTheme) DarkScheme else LightScheme

    CompositionLocalProvider(LocalThemeColors provides colors) {
        MaterialTheme(
            colorScheme = scheme,
            content = content
        )
    }
}

@Composable
fun themeColors(): ThemeColors = LocalThemeColors.current
