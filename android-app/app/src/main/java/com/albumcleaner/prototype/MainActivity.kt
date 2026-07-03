package com.albumcleaner.prototype

import android.Manifest
import android.app.Activity
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.IntentSenderRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.ArrowBack
import androidx.compose.material.icons.automirrored.outlined.Redo
import androidx.compose.material.icons.automirrored.outlined.Undo
import androidx.compose.material.icons.outlined.Add
import androidx.compose.material.icons.outlined.BarChart
import androidx.compose.material.icons.outlined.CameraAlt
import androidx.compose.material.icons.outlined.Delete
import androidx.compose.material.icons.outlined.Download
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Image
import androidx.compose.material.icons.outlined.Inbox
import androidx.compose.material.icons.outlined.PushPin
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material.icons.outlined.Star
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import coil.compose.AsyncImage
import com.albumcleaner.prototype.data.DecisionStore
import com.albumcleaner.prototype.data.FakeAlbumData
import com.albumcleaner.prototype.data.MediaCategory
import com.albumcleaner.prototype.data.MediaGroup
import com.albumcleaner.prototype.data.MediaItem
import com.albumcleaner.prototype.data.MediaStoreRepository
import com.albumcleaner.prototype.data.ReviewAction
import com.albumcleaner.prototype.data.ReviewActionType
import com.albumcleaner.prototype.data.SourceType
import com.albumcleaner.prototype.data.StagedItem
import com.albumcleaner.prototype.data.StoredDecision
import com.albumcleaner.prototype.data.TrashRepository
import com.albumcleaner.prototype.data.formatSize
import com.albumcleaner.prototype.ui.theme.AlbumCleanerTheme
import com.albumcleaner.prototype.ui.theme.AppColors
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import kotlin.math.abs
import kotlin.math.roundToInt

private enum class AppPage { Home, Review, Collections, AlbumViewer, PublishPreview, Stats, Settings }
private enum class LibraryStatus { Checking, NeedsPermission, Loading, Ready, Empty }

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { AlbumCleanerTheme { AlbumCleanerApp() } }
    }
}

@Composable
private fun AlbumCleanerApp() {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val store = remember { DecisionStore(context) }
    val trash = remember { TrashRepository(context) }
    val stagedItems = remember { mutableStateListOf<StagedItem>() }

    var page by remember { mutableStateOf(AppPage.Home) }
    var status by remember { mutableStateOf(LibraryStatus.Checking) }
    var actionBarEnabled by remember { mutableStateOf(false) }
    var categories by remember { mutableStateOf(FakeAlbumData.categories) }
    var activeItems by remember { mutableStateOf(FakeAlbumData.reviewItems) }
    var activeGroupTitle by remember { mutableStateOf("2026-06-20 毕业典礼") }
    var decisions by remember { mutableStateOf(emptyList<StoredDecision>()) }
    var latestDecisions by remember { mutableStateOf(emptyList<StoredDecision>()) }
    var decisionCount by remember { mutableIntStateOf(0) }
    var viewerTitle by remember { mutableStateOf("相册浏览") }
    var viewerItems by remember { mutableStateOf(emptyList<StagedItem>()) }
    var viewerStartIndex by remember { mutableIntStateOf(0) }
    var publishItems by remember { mutableStateOf(emptyList<StagedItem>()) }
    var pendingTrashItem by remember { mutableStateOf<MediaItem?>(null) }
    var pendingRestoreDecision by remember { mutableStateOf<StoredDecision?>(null) }
    var localDeleteSignal by remember { mutableStateOf<Long?>(null) }
    var toast by remember { mutableStateOf<String?>(null) }

    suspend fun refreshLocalState() {
        decisions = withContext(Dispatchers.IO) { store.all() }
        latestDecisions = withContext(Dispatchers.IO) { store.latest() }
        decisionCount = decisions.size
        val restored = withContext(Dispatchers.IO) { store.stagedItems() }
        stagedItems.clear()
        stagedItems.addAll(restored)
    }

    fun loadMedia() {
        status = LibraryStatus.Loading
        scope.launch {
            val loaded = withContext(Dispatchers.IO) { MediaStoreRepository(context).loadCategories() }
            if (loaded.isEmpty()) {
                categories = FakeAlbumData.categories
                activeItems = FakeAlbumData.reviewItems
                activeGroupTitle = "示例照片"
                status = LibraryStatus.Empty
            } else {
                categories = loaded
                val firstGroup = loaded.firstNotNullOfOrNull { it.groups.firstOrNull() }
                activeItems = firstGroup?.items.orEmpty()
                activeGroupTitle = firstGroup?.title ?: "相册照片"
                status = LibraryStatus.Ready
            }
        }
    }

    fun hasMediaPermission(): Boolean {
        return ContextCompat.checkSelfPermission(context, mediaPermission()) == PackageManager.PERMISSION_GRANTED
    }

    lateinit var restoreLauncher: androidx.activity.result.ActivityResultLauncher<IntentSenderRequest>

    fun undoLatestDecision() {
        val latest = latestDecisions.firstOrNull()
        if (latest == null) {
            toast = "没有可撤回的操作"
            return
        }
        if (latest.action == ReviewActionType.Delete) {
            val request = trash.createRestoreRequest(latest)
            if (request == null) {
                toast = "当前系统无法从回收站恢复"
            } else {
                pendingRestoreDecision = latest
                restoreLauncher.launch(IntentSenderRequest.Builder(request.intentSender).build())
            }
            return
        }
        scope.launch {
            val undone = withContext(Dispatchers.IO) { store.undoLatest() }
            refreshLocalState()
            toast = if (undone == null) "没有可撤回的操作" else "已撤回${actionName(undone.action)}记录"
        }
    }

    val permissionLauncher = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
        if (granted) loadMedia() else status = LibraryStatus.NeedsPermission
    }

    val trashLauncher = rememberLauncherForActivityResult(ActivityResultContracts.StartIntentSenderForResult()) { result ->
        val item = pendingTrashItem
        pendingTrashItem = null
        if (result.resultCode == Activity.RESULT_OK && item != null) {
            scope.launch {
                withContext(Dispatchers.IO) { store.add(item, ReviewActionType.Delete) }
                activeItems = activeItems.filterNot { it.id == item.id }.ifEmpty { FakeAlbumData.reviewItems }
                refreshLocalState()
                loadMedia()
                toast = "已移入系统回收站"
            }
        } else {
            toast = "已取消删除"
        }
    }

    restoreLauncher = rememberLauncherForActivityResult(ActivityResultContracts.StartIntentSenderForResult()) { result ->
        val decision = pendingRestoreDecision
        pendingRestoreDecision = null
        if (result.resultCode == Activity.RESULT_OK && decision != null) {
            scope.launch {
                withContext(Dispatchers.IO) { store.removeDecision(decision.id) }
                refreshLocalState()
                loadMedia()
                toast = "已从系统回收站恢复"
            }
        } else {
            toast = "已取消恢复"
        }
    }

    LaunchedEffect(Unit) {
        refreshLocalState()
        if (hasMediaPermission()) loadMedia() else status = LibraryStatus.NeedsPermission
    }

    Surface(color = AppColors.Bg, modifier = Modifier.fillMaxSize()) {
        when (page) {
            AppPage.Home -> HomeScreen(
                categories = categories,
                status = status,
                onRequestPermission = { permissionLauncher.launch(mediaPermission()) },
                onOpenGroup = {
                    activeItems = it.items
                    activeGroupTitle = it.title
                    page = AppPage.Review
                },
                onNavigate = { page = it }
            )
            AppPage.Review -> ReviewScreen(
                title = activeGroupTitle,
                items = activeItems.ifEmpty { FakeAlbumData.reviewItems },
                actionBarEnabled = actionBarEnabled,
                stagedItems = stagedItems,
                localDeleteSignal = localDeleteSignal,
                onLocalDeleteHandled = { localDeleteSignal = null },
                onBack = { page = AppPage.Home },
                onNavigate = { page = it },
                onStage = { item ->
                    if (stagedItems.none { it.mediaId == item.id }) {
                        stagedItems.add(StagedItem(item.id, item.id.toInt(), item.uri, item.displayName))
                        scope.launch {
                            withContext(Dispatchers.IO) { store.addStaged(item) }
                            refreshLocalState()
                        }
                    }
                },
                onRecordDecision = { item, action ->
                    scope.launch {
                        withContext(Dispatchers.IO) { store.add(item, action) }
                        refreshLocalState()
                    }
                },
                onRequestTrash = { item ->
                    val request = trash.createTrashRequest(item)
                    if (request == null) {
                        scope.launch {
                            withContext(Dispatchers.IO) { store.add(item, ReviewActionType.Delete) }
                            refreshLocalState()
                            localDeleteSignal = item.id
                            toast = "当前系统暂不支持回收站请求，已记录删除决策"
                        }
                    } else {
                        pendingTrashItem = item
                        trashLauncher.launch(IntentSenderRequest.Builder(request.intentSender).build())
                    }
                },
                onRemoveStaged = { id ->
                    stagedItems.removeAll { it.mediaId == id }
                    scope.launch {
                        withContext(Dispatchers.IO) { store.removeStaged(id) }
                        refreshLocalState()
                    }
                }
            )
            AppPage.Collections -> CollectionsScreenV2(
                decisions = decisions,
                stagedItems = stagedItems,
                onRemoveStaged = { id ->
                    stagedItems.removeAll { it.mediaId == id }
                    scope.launch {
                        withContext(Dispatchers.IO) { store.removeStaged(id) }
                        refreshLocalState()
                    }
                },
                onAddStagedToCollection = { selected ->
                    scope.launch {
                        withContext(Dispatchers.IO) { store.addStagedToCollection(selected) }
                        refreshLocalState()
                    }
                },
                onClearDecisions = {
                    scope.launch {
                        withContext(Dispatchers.IO) { store.clearDecisions() }
                        refreshLocalState()
                    }
                },
                onOpenAlbum = { title, items, startIndex ->
                    viewerTitle = title
                    viewerItems = items
                    viewerStartIndex = startIndex
                    page = AppPage.AlbumViewer
                },
                onNavigate = { page = it }
            )
            AppPage.AlbumViewer -> AlbumViewerScreen(
                title = viewerTitle,
                items = viewerItems,
                startIndex = viewerStartIndex,
                onBack = { page = AppPage.Collections },
                onAddToCollection = { item ->
                    scope.launch {
                        withContext(Dispatchers.IO) { store.addStagedToCollection(listOf(item)) }
                        refreshLocalState()
                        toast = "已加入精选"
                    }
                }
            )
            AppPage.PublishPreview -> PublishPreviewScreen(
                items = publishItems.ifEmpty { stagedItems.toList() },
                onBack = { page = AppPage.Collections }
            )
            AppPage.Stats -> RecentActionsScreen(
                categories = categories,
                decisions = latestDecisions,
                onUndoLatest = ::undoLatestDecision,
                onNavigate = { page = it }
            )
            AppPage.Settings -> SettingsScreen(
                status = status,
                decisionCount = decisionCount,
                actionBarEnabled = actionBarEnabled,
                onToggleActionBar = { actionBarEnabled = !actionBarEnabled },
                onReload = { if (hasMediaPermission()) loadMedia() else permissionLauncher.launch(mediaPermission()) },
                onClearDecisions = {
                    scope.launch {
                        withContext(Dispatchers.IO) { store.clearDecisions() }
                        refreshLocalState()
                    }
                },
                onNavigate = { page = it }
            )
        }
    }

    toast?.let { message ->
        LaunchedEffect(message) {
            delay(1600)
            toast = null
        }
        ToastOverlay(message)
    }
}

@Composable
private fun HomeScreen(
    categories: List<MediaCategory>,
    status: LibraryStatus,
    onRequestPermission: () -> Unit,
    onOpenGroup: (MediaGroup) -> Unit,
    onNavigate: (AppPage) -> Unit
) {
    ScreenScaffold(
        active = AppPage.Home,
        title = "相册整理",
        subtitle = statusLabel(status),
        action = {
            IconButton(onClick = { onNavigate(AppPage.Settings) }, modifier = circleButtonModifier()) {
                Icon(Icons.Outlined.Settings, contentDescription = "设置", tint = AppColors.Ink)
            }
        },
        onNavigate = onNavigate
    ) {
        SummaryCard(categories, status)
        if (status == LibraryStatus.NeedsPermission) PermissionCard(onRequestPermission)
        if (status == LibraryStatus.Empty) InfoCard("没有读取到系统照片", "当前显示的是示例数据。你可以稍后在设置里重新扫描。")
        categories.forEach { CategoryCard(it, onOpenGroup) }
    }
}

@Composable
private fun SummaryCard(categories: List<MediaCategory>, status: LibraryStatus) {
    val totalCount = categories.sumOf { it.count }
    val totalBytes = categories.flatMap { it.groups }.flatMap { it.items }.sumOf { it.sizeBytes }
    Column(
        modifier = Modifier
            .padding(16.dp)
            .fillMaxWidth()
            .shadow(12.dp, RoundedCornerShape(24.dp))
            .clip(RoundedCornerShape(24.dp))
            .background(Brush.linearGradient(listOf(Color(0xFF1E3A8A), AppColors.Primary, Color(0xFF38BDF8))))
            .padding(18.dp)
    ) {
        Row(verticalAlignment = Alignment.Top) {
            Column(modifier = Modifier.weight(1f)) {
                Text(if (status == LibraryStatus.Ready) "真实相册" else "待整理", color = Color.White.copy(alpha = 0.86f), fontSize = 13.sp, fontWeight = FontWeight.Bold)
                Text("$totalCount 张", color = Color.White, fontSize = 28.sp, fontWeight = FontWeight.ExtraBold)
            }
            Text(formatSize(totalBytes), color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.ExtraBold, modifier = Modifier.clip(RoundedCornerShape(999.dp)).background(Color.White.copy(alpha = 0.18f)).padding(horizontal = 10.dp, vertical = 6.dp))
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.padding(top = 18.dp)) {
            categories.take(3).forEach {
                Text("${it.title} ${it.count}", color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold, textAlign = androidx.compose.ui.text.style.TextAlign.Center, modifier = Modifier.weight(1f).clip(RoundedCornerShape(12.dp)).background(Color.White.copy(alpha = 0.14f)).padding(vertical = 8.dp))
            }
        }
    }
}

@Composable
private fun PermissionCard(onRequestPermission: () -> Unit) {
    InfoCard("需要照片读取权限", "授权后会读取系统相册图片，按相机、截图、下载图片分组。")
    Button(onClick = onRequestPermission, modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp)) {
        Text("授权并扫描")
    }
}

@Composable
private fun CategoryCard(category: MediaCategory, onOpenGroup: (MediaGroup) -> Unit) {
    var expanded by remember(category.title) { mutableStateOf(category.sourceType == SourceType.Camera) }
    val color = sourceColor(category.sourceType)
    Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 5.dp).fillMaxWidth().shadow(6.dp, RoundedCornerShape(18.dp)).clip(RoundedCornerShape(18.dp)).background(Color.White).border(1.dp, AppColors.Line, RoundedCornerShape(18.dp))) {
        Row(modifier = Modifier.fillMaxWidth().clickable { expanded = !expanded }.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(modifier = Modifier.size(40.dp).clip(RoundedCornerShape(14.dp)).background(color.copy(alpha = 0.10f)), contentAlignment = Alignment.Center) {
                Icon(sourceIcon(category.sourceType), contentDescription = null, tint = color)
            }
            Column(modifier = Modifier.padding(start = 12.dp).weight(1f)) {
                Text(category.title, fontSize = 15.sp, color = AppColors.Ink, fontWeight = FontWeight.ExtraBold)
                Text("${category.count} 张 · ${category.sizeLabel}", fontSize = 12.sp, color = AppColors.Muted)
            }
            Text(if (expanded) "⌄" else "›", color = AppColors.Subtle, fontSize = 20.sp)
        }
        AnimatedVisibility(expanded) {
            Column(modifier = Modifier.border(1.dp, AppColors.Line.copy(alpha = 0.5f))) {
                category.groups.forEachIndexed { index, group ->
                    Row(modifier = Modifier.fillMaxWidth().clickable { onOpenGroup(group) }.padding(horizontal = 16.dp, vertical = 11.dp), verticalAlignment = Alignment.CenterVertically) {
                        PhotoThumb(index, group.items.firstOrNull()?.uri.orEmpty(), Modifier.size(38.dp).clip(RoundedCornerShape(10.dp)))
                        Column(modifier = Modifier.padding(start = 12.dp).weight(1f)) {
                            Text(group.title, color = AppColors.Ink, fontSize = 13.sp, fontWeight = FontWeight.Bold, maxLines = 1, overflow = TextOverflow.Ellipsis)
                            Text("${group.count} 张 · ${group.sizeLabel}", color = AppColors.Subtle, fontSize = 11.sp)
                        }
                        Text("›", color = AppColors.Subtle, fontSize = 18.sp)
                    }
                }
            }
        }
    }
}

@Composable
private fun ReviewScreen(
    title: String,
    items: List<MediaItem>,
    actionBarEnabled: Boolean,
    stagedItems: List<StagedItem>,
    localDeleteSignal: Long?,
    onLocalDeleteHandled: () -> Unit,
    onBack: () -> Unit,
    onNavigate: (AppPage) -> Unit,
    onStage: (MediaItem) -> Unit,
    onRecordDecision: (MediaItem, ReviewActionType) -> Unit,
    onRequestTrash: (MediaItem) -> Unit,
    onRemoveStaged: (Long) -> Unit
) {
    val scope = rememberCoroutineScope()
    var index by remember(items) { mutableIntStateOf(0) }
    val undoStack = remember { mutableStateListOf<ReviewAction>() }
    var showDeleteTip by remember { mutableStateOf(false) }
    var skipDeleteTip by remember { mutableStateOf(false) }
    var showCollections by remember { mutableStateOf(false) }
    var toast by remember { mutableStateOf<String?>(null) }
    var dragOffsetX by remember { mutableFloatStateOf(0f) }
    var dragOffsetY by remember { mutableFloatStateOf(0f) }

    fun showToast(message: String) {
        toast = message
        scope.launch { delay(1400); toast = null }
    }

    fun advance(action: ReviewActionType, record: Boolean = true) {
        val item = items[index]
        undoStack.add(ReviewAction(item.id, index, action))
        if (record) onRecordDecision(item, action)
        index = (index + 1).coerceAtMost(items.lastIndex)
        dragOffsetX = 0f
        dragOffsetY = 0f
    }

    fun undo() {
        val last = undoStack.removeLastOrNull()
        if (last == null) {
            showToast("没有可撤回的操作")
            return
        }
        if (last.type == ReviewActionType.Stage) onRemoveStaged(last.mediaId)
        index = last.photoIndex
        showToast("已撤回${actionName(last.type)}")
    }

    fun deleteAction() {
        if (!skipDeleteTip) showDeleteTip = true else onRequestTrash(items[index])
    }

    val current = items[index]
    val isPinned = stagedItems.any { it.mediaId == current.id }

    LaunchedEffect(localDeleteSignal) {
        if (localDeleteSignal == current.id) {
            advance(ReviewActionType.Delete, record = false)
            onLocalDeleteHandled()
        }
    }

    Column(modifier = Modifier.fillMaxSize().background(AppColors.Bg).statusBarsPadding()) {
        ReviewHeader(title, index + 1, items.size, onBack)
        ThumbnailStrip(items, index)
        Box(modifier = Modifier.weight(1f).fillMaxWidth().padding(18.dp), contentAlignment = Alignment.Center) {
            DirectionHints()
            Box(modifier = Modifier.fillMaxWidth(0.82f).fillMaxHeight(0.76f).offset { IntOffset(dragOffsetX.roundToInt(), dragOffsetY.roundToInt()) }.shadow(12.dp, RoundedCornerShape(26.dp)).clip(RoundedCornerShape(26.dp)).background(Color.White).pointerInput(index) {
                detectDragGestures(
                    onDragEnd = {
                        val action = detectAction(Offset(dragOffsetX, dragOffsetY))
                        dragOffsetX = 0f
                        dragOffsetY = 0f
                        when (action) {
                            ReviewActionType.Delete -> deleteAction()
                            ReviewActionType.Skip -> advance(ReviewActionType.Skip)
                            ReviewActionType.Undo -> undo()
                            ReviewActionType.AddToCollection -> showCollections = true
                            ReviewActionType.Stage, null -> Unit
                        }
                    },
                    onDrag = { change, dragAmount ->
                        change.consume()
                        dragOffsetX += dragAmount.x
                        dragOffsetY += dragAmount.y
                    }
                )
            }) {
                Column(modifier = Modifier.fillMaxSize()) {
                    Box(modifier = Modifier.weight(1f).fillMaxWidth()) {
                        PhotoThumb(index, current.uri, Modifier.fillMaxSize())
                        IconButton(onClick = {
                            if (!isPinned) {
                                onStage(current)
                                undoStack.add(ReviewAction(current.id, index, ReviewActionType.Stage))
                                index = (index + 1).coerceAtMost(items.lastIndex)
                            } else onRemoveStaged(current.id)
                        }, modifier = Modifier.align(Alignment.TopEnd).padding(12.dp).size(36.dp).clip(CircleShape).background(if (isPinned) AppColors.Stage else Color.White.copy(alpha = 0.78f)).border(2.dp, AppColors.Stage, CircleShape)) {
                            Icon(Icons.Outlined.PushPin, contentDescription = "钉住", tint = if (isPinned) Color.White else AppColors.Stage, modifier = Modifier.size(17.dp))
                        }
                    }
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(current.displayName, color = AppColors.Ink, fontSize = 14.sp, fontWeight = FontWeight.ExtraBold, maxLines = 1, overflow = TextOverflow.Ellipsis)
                        Text("${current.sizeLabel} · ${current.dateLabel}", color = AppColors.Muted, fontSize = 12.sp)
                    }
                }
            }
        }
        StagingBar(stagedItems, { onNavigate(AppPage.Collections) }, onRemoveStaged)
        if (actionBarEnabled) ReviewActionBar(::deleteAction, { advance(ReviewActionType.Skip) }, { showCollections = true }, ::undo)
    }

    if (showDeleteTip) {
        AlertDialog(
            onDismissRequest = { showDeleteTip = false },
            title = { Text("删除会移入系统回收站") },
            text = {
                Column {
                    Text("确认后会调用系统回收站，撤回时会从系统回收站恢复。", color = AppColors.Muted)
                    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(top = 10.dp)) {
                        Switch(checked = skipDeleteTip, onCheckedChange = { skipDeleteTip = it })
                        Text("不再提醒", color = AppColors.Muted)
                    }
                }
            },
            confirmButton = { TextButton(onClick = { showDeleteTip = false; onRequestTrash(items[index]) }) { Text("继续删除", color = AppColors.Delete) } },
            dismissButton = { TextButton(onClick = { showDeleteTip = false }) { Text("取消") } }
        )
    }

    if (showCollections) {
        CollectionSheet(onClose = { showCollections = false }, onPick = { showCollections = false; advance(ReviewActionType.AddToCollection) })
    }

    toast?.let { ToastOverlay(it, if (actionBarEnabled) 84 else 30) }
}

@Composable
private fun ReviewHeader(title: String, index: Int, total: Int, onBack: () -> Unit) {
    Row(modifier = Modifier.fillMaxWidth().background(Color.White.copy(alpha = 0.94f)).padding(horizontal = 16.dp, vertical = 10.dp), verticalAlignment = Alignment.CenterVertically) {
        IconButton(onClick = onBack, modifier = Modifier.size(34.dp).clip(CircleShape).border(1.dp, AppColors.Line, CircleShape)) {
            Icon(Icons.AutoMirrored.Outlined.ArrowBack, contentDescription = "返回")
        }
        Column(modifier = Modifier.padding(start = 10.dp).weight(1f)) {
            Text(title, color = AppColors.Ink, fontSize = 15.sp, fontWeight = FontWeight.ExtraBold, maxLines = 1, overflow = TextOverflow.Ellipsis)
            Text("$index/$total", color = AppColors.Muted, fontSize = 11.sp)
        }
        Text("${(index * 100 / total)}%", color = AppColors.Primary, fontSize = 12.sp, fontWeight = FontWeight.ExtraBold, modifier = Modifier.clip(RoundedCornerShape(14.dp)).background(AppColors.PrimarySoft).padding(horizontal = 12.dp, vertical = 7.dp))
    }
}

@Composable
private fun ThumbnailStrip(items: List<MediaItem>, currentIndex: Int) {
    Row(modifier = Modifier.fillMaxWidth().background(Color.White.copy(alpha = 0.94f)).padding(vertical = 12.dp), horizontalArrangement = Arrangement.Center) {
        val start = (currentIndex - 3).coerceAtLeast(0)
        items.drop(start).take(8).forEachIndexed { offset, item ->
            val itemIndex = start + offset
            PhotoThumb(itemIndex, item.uri, Modifier.padding(horizontal = 3.dp).size(30.dp).clip(RoundedCornerShape(5.dp)).border(if (itemIndex == currentIndex) 2.dp else 0.dp, AppColors.Primary, RoundedCornerShape(5.dp)))
        }
    }
}

@Composable
private fun BoxScope.DirectionHints() {
    Text("上划删除", color = AppColors.Subtle.copy(alpha = 0.72f), fontSize = 10.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.align(Alignment.TopCenter).padding(top = 4.dp))
    Text("下划加入精选集", color = AppColors.Subtle.copy(alpha = 0.72f), fontSize = 10.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.align(Alignment.BottomCenter).padding(bottom = 4.dp))
    Text("跳过", color = AppColors.Subtle.copy(alpha = 0.72f), fontSize = 10.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.align(Alignment.CenterStart))
    Text("撤回", color = AppColors.Subtle.copy(alpha = 0.72f), fontSize = 10.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.align(Alignment.CenterEnd))
}

@Composable
private fun StagingBar(stagedItems: List<StagedItem>, onOpen: () -> Unit, onRemove: (Long) -> Unit) {
    var expanded by remember { mutableStateOf(false) }
    Column(modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp).fillMaxWidth().shadow(6.dp, RoundedCornerShape(18.dp)).clip(RoundedCornerShape(18.dp)).background(Color.White).border(1.dp, AppColors.Line, RoundedCornerShape(18.dp))) {
        Row(modifier = Modifier.fillMaxWidth().height(46.dp).clickable { expanded = !expanded }.padding(horizontal = 14.dp), verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.Outlined.Inbox, contentDescription = null, tint = AppColors.Stage, modifier = Modifier.size(18.dp))
            Text("暂存栏", color = AppColors.Ink, fontSize = 13.sp, fontWeight = FontWeight.ExtraBold, modifier = Modifier.padding(start = 6.dp))
            if (stagedItems.isNotEmpty()) Text("${stagedItems.size}", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.ExtraBold, modifier = Modifier.padding(start = 6.dp).clip(RoundedCornerShape(999.dp)).background(AppColors.Stage).padding(horizontal = 7.dp, vertical = 2.dp))
            Spacer(Modifier.weight(1f))
            if (expanded) Text("进入筛选", color = AppColors.Primary, fontSize = 11.sp, modifier = Modifier.clickable { onOpen() }.clip(RoundedCornerShape(6.dp)).background(AppColors.Primary.copy(alpha = 0.08f)).padding(horizontal = 8.dp, vertical = 3.dp))
        }
        AnimatedVisibility(expanded) {
            if (stagedItems.isEmpty()) {
                EmptyCollectionText("点击卡片右上角钉住图标将照片添加到暂存栏")
            } else {
                ThumbGrid {
                    stagedItems.forEach {
                        Box {
                            PhotoThumb(it.paletteIndex, it.uri, Modifier.size(44.dp).clip(RoundedCornerShape(8.dp)))
                            Box(modifier = Modifier.align(Alignment.TopEnd).offset(x = 4.dp, y = (-4).dp).size(16.dp).clip(CircleShape).background(AppColors.Delete).clickable { onRemove(it.mediaId) }, contentAlignment = Alignment.Center) {
                                Text("×", color = Color.White, fontSize = 10.sp)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ReviewActionBar(onDelete: () -> Unit, onSkip: () -> Unit, onFavorite: () -> Unit, onUndo: () -> Unit) {
    Row(modifier = Modifier.fillMaxWidth().navigationBarsPadding().padding(bottom = 18.dp), horizontalArrangement = Arrangement.Center) {
        ActionCircle(Icons.Outlined.Delete, AppColors.Delete, onDelete)
        ActionCircle(Icons.AutoMirrored.Outlined.Undo, AppColors.Subtle, onSkip)
        ActionCircle(Icons.Outlined.Star, AppColors.Favorite, onFavorite)
        ActionCircle(Icons.AutoMirrored.Outlined.Redo, AppColors.Undo, onUndo)
    }
}

@Composable
private fun ActionCircle(icon: ImageVector, color: Color, onClick: () -> Unit) {
    IconButton(onClick = onClick, modifier = Modifier.padding(horizontal = 6.dp).size(44.dp).clip(CircleShape).background(Color.White).border(2.dp, color, CircleShape)) {
        Icon(icon, contentDescription = null, tint = color, modifier = Modifier.size(19.dp))
    }
}

@Composable
private fun CollectionSheet(onClose: () -> Unit, onPick: () -> Unit) {
    Box(modifier = Modifier.fillMaxSize().background(Color.Black.copy(alpha = 0.18f)).clickable { onClose() }, contentAlignment = Alignment.BottomCenter) {
        Column(modifier = Modifier.fillMaxWidth().clip(RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)).background(Color.White).padding(20.dp)) {
            Box(modifier = Modifier.align(Alignment.CenterHorizontally).width(42.dp).height(4.dp).clip(RoundedCornerShape(999.dp)).background(AppColors.Line))
            Text("加入精选集", color = AppColors.Ink, fontSize = 17.sp, fontWeight = FontWeight.ExtraBold, modifier = Modifier.padding(top = 16.dp))
            Text("仅在本应用内整理", color = AppColors.Muted, fontSize = 11.sp, modifier = Modifier.padding(top = 4.dp, bottom = 14.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                listOf("精选", "旅行", "家人", "工作").forEachIndexed { index, name ->
                    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.weight(1f).clickable { onPick() }) {
                        Box(modifier = Modifier.size(52.dp).clip(RoundedCornerShape(18.dp)).background(AppColors.PrimarySoft), contentAlignment = Alignment.Center) {
                            Icon(if (index == 0) Icons.Outlined.Star else Icons.Outlined.Image, contentDescription = null, tint = AppColors.Primary)
                        }
                        Text(name, color = AppColors.Ink, fontSize = 12.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(top = 6.dp))
                    }
                }
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.weight(1f)) {
                    Box(modifier = Modifier.size(52.dp).clip(RoundedCornerShape(18.dp)).background(AppColors.StageSoft), contentAlignment = Alignment.Center) {
                        Icon(Icons.Outlined.Add, contentDescription = null, tint = AppColors.Stage)
                    }
                    Text("新建", color = AppColors.Ink, fontSize = 12.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(top = 6.dp))
                }
            }
        }
    }
}

@Composable
private fun CollectionsScreen(
    decisions: List<StoredDecision>,
    stagedItems: List<StagedItem>,
    onRemoveStaged: (Long) -> Unit,
    onAddStagedToCollection: (List<StagedItem>) -> Unit,
    onClearDecisions: () -> Unit,
    onNavigate: (AppPage) -> Unit
) {
    val selectedIds = remember { mutableStateListOf<Long>() }
    var previewItem by remember { mutableStateOf<StagedItem?>(null) }
    var showSharePreview by remember { mutableStateOf(false) }
    val favorites = decisions.filter { it.action == ReviewActionType.AddToCollection }.asReversed()
    val stagedHistory = decisions.filter { it.action == ReviewActionType.Stage }.asReversed()
    fun toggle(id: Long) { if (id in selectedIds) selectedIds.remove(id) else selectedIds.add(id) }
    fun clearSelection() = selectedIds.clear()

    ScreenScaffold(
        active = AppPage.Collections,
        title = "精选集",
        subtitle = "应用内整理",
        action = { TextButton(onClick = onClearDecisions, enabled = decisions.isNotEmpty()) { Text("清空记录") } },
        onNavigate = onNavigate
    ) {
        CollectionSection("暂存栏", "${stagedItems.size} 张当前暂存 · 已选 ${selectedIds.size}", "卡片右上角钉住后会出现在这里") {
            if (stagedItems.isEmpty()) {
                EmptyCollectionText("还没有暂存照片")
            } else {
                Row(modifier = Modifier.padding(bottom = 10.dp).horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    TextButton(onClick = { selectedIds.clear(); selectedIds.addAll(stagedItems.map { it.mediaId }) }, enabled = selectedIds.size < stagedItems.size) { Text("全选") }
                    TextButton(onClick = ::clearSelection, enabled = selectedIds.isNotEmpty()) { Text("取消选择") }
                    TextButton(onClick = { onAddStagedToCollection(stagedItems.filter { it.mediaId in selectedIds }); clearSelection() }, enabled = selectedIds.isNotEmpty()) { Text("加入精选") }
                    TextButton(onClick = { selectedIds.toList().forEach(onRemoveStaged); clearSelection() }, enabled = selectedIds.isNotEmpty()) { Text("移除") }
                }
                ThumbGrid {
                    stagedItems.forEach {
                        CollectionThumb(
                            title = it.displayName.ifBlank { "暂存 #${it.mediaId}" },
                            uri = it.uri,
                            paletteIndex = it.paletteIndex,
                            selected = it.mediaId in selectedIds,
                            actionLabel = "查看",
                            onClick = { toggle(it.mediaId) },
                            onAction = { previewItem = it }
                        )
                    }
                }
            }
        }
        CollectionSection("社交发布预览", "优先预览暂存照片，后续可扩展模板", "暂存照片后可预览发布布局") {
            if (stagedItems.isEmpty()) {
                EmptyCollectionText("还没有可预览的暂存照片")
            } else {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(onClick = { showSharePreview = true }) { Text("预览发布") }
                    TextButton(onClick = { previewItem = stagedItems.firstOrNull() }) { Text("查看首张") }
                }
            }
        }
        DecisionThumbSection("最近加入精选集", "${favorites.size} 次加入记录", "还没有精选集记录", favorites)
        DecisionThumbSection("暂存历史", "${stagedHistory.size} 次暂存记录", "还没有暂存历史", stagedHistory)
    }

    previewItem?.let { item ->
        ImagePreviewDialog(
            title = item.displayName.ifBlank { "暂存照片" },
            uri = item.uri,
            paletteIndex = item.paletteIndex,
            onClose = { previewItem = null }
        )
    }

    if (showSharePreview) {
        SharePreviewDialog(
            stagedItems = stagedItems,
            onClose = { showSharePreview = false }
        )
    }
}

@Composable
private fun CollectionsScreenV2(
    decisions: List<StoredDecision>,
    stagedItems: List<StagedItem>,
    onRemoveStaged: (Long) -> Unit,
    onAddStagedToCollection: (List<StagedItem>) -> Unit,
    onClearDecisions: () -> Unit,
    onOpenAlbum: (String, List<StagedItem>, Int) -> Unit,
    onNavigate: (AppPage) -> Unit
) {
    val selectedIds = remember { mutableStateListOf<Long>() }
    val favorites = decisions.filter { it.action == ReviewActionType.AddToCollection }.asReversed()
    val stagedHistory = decisions.filter { it.action == ReviewActionType.Stage }.asReversed()
    val favoriteItems = favorites.mapIndexed { index, item -> item.toStagedItem(index) }.distinctBy { it.mediaId }
    fun toggle(id: Long) { if (id in selectedIds) selectedIds.remove(id) else selectedIds.add(id) }
    fun clearSelection() = selectedIds.clear()

    ScreenScaffold(
        active = AppPage.Collections,
        title = "精选集",
        subtitle = "暂存、收藏与发布",
        action = { TextButton(onClick = onClearDecisions, enabled = decisions.isNotEmpty()) { Text("清空记录") } },
        onNavigate = onNavigate
    ) {
        CollectionSection("精选相册", "${favoriteItems.size} 张已收藏", "还没有加入精选的照片") {
            if (favoriteItems.isEmpty()) {
                EmptyCollectionText("还没有加入精选的照片")
            } else {
                Button(onClick = { onOpenAlbum("精选相册", favoriteItems, 0) }) { Text("打开相册") }
                ThumbGrid {
                    favoriteItems.take(36).forEachIndexed { index, item ->
                        CollectionThumb(
                            title = item.displayName.ifBlank { "精选 #${item.mediaId}" },
                            uri = item.uri,
                            paletteIndex = item.paletteIndex,
                            selected = false,
                            actionLabel = null,
                            onClick = { onOpenAlbum("精选相册", favoriteItems, index) },
                            onAction = {}
                        )
                    }
                }
            }
        }

        CollectionSection("暂存栏", "${stagedItems.size} 张当前暂存 · 已选 ${selectedIds.size}", "卡片右上角钉住后会出现在这里") {
            if (stagedItems.isEmpty()) {
                EmptyCollectionText("还没有暂存照片")
            } else {
                Row(modifier = Modifier.padding(bottom = 10.dp).horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    TextButton(onClick = { selectedIds.clear(); selectedIds.addAll(stagedItems.map { it.mediaId }) }, enabled = selectedIds.size < stagedItems.size) { Text("全选") }
                    TextButton(onClick = ::clearSelection, enabled = selectedIds.isNotEmpty()) { Text("取消选择") }
                    TextButton(onClick = { onAddStagedToCollection(stagedItems.filter { it.mediaId in selectedIds }); clearSelection() }, enabled = selectedIds.isNotEmpty()) { Text("加入精选") }
                    TextButton(onClick = { selectedIds.toList().forEach(onRemoveStaged); clearSelection() }, enabled = selectedIds.isNotEmpty()) { Text("移除") }
                }
                ThumbGrid {
                    stagedItems.forEachIndexed { index, item ->
                        CollectionThumb(
                            title = item.displayName.ifBlank { "暂存 #${item.mediaId}" },
                            uri = item.uri,
                            paletteIndex = item.paletteIndex,
                            selected = item.mediaId in selectedIds,
                            actionLabel = if (item.mediaId in selectedIds) "取消" else "选择",
                            onClick = { onOpenAlbum("暂存相册", stagedItems, index) },
                            onAction = { toggle(item.mediaId) }
                        )
                    }
                }
            }
        }

        // 发布预览入口已隐藏（V1.5 储备）：PublishPreviewScreen 代码保留，详见 PRD 第十章 Open Issues #8。

        DecisionThumbSectionV2("最近加入精选集", "${favorites.size} 次加入记录", "还没有精选集记录", favorites, onOpenAlbum)
        DecisionThumbSectionV2("暂存历史", "${stagedHistory.size} 次暂存记录", "还没有暂存历史", stagedHistory, onOpenAlbum)
    }
}

@Composable
private fun DecisionThumbSectionV2(
    title: String,
    subtitle: String,
    empty: String,
    items: List<StoredDecision>,
    onOpenAlbum: (String, List<StagedItem>, Int) -> Unit
) {
    val albumItems = items.mapIndexed { index, item -> item.toStagedItem(index) }
    CollectionSection(title, subtitle, empty) {
        if (albumItems.isEmpty()) {
            EmptyCollectionText(empty)
        } else {
            ThumbGrid {
                albumItems.take(24).forEachIndexed { index, item ->
                    CollectionThumb(
                        title = item.displayName.ifBlank { title },
                        uri = item.uri,
                        paletteIndex = item.paletteIndex,
                        selected = false,
                        actionLabel = null,
                        onClick = { onOpenAlbum(title, albumItems, index) },
                        onAction = {}
                    )
                }
            }
        }
    }
}

@Composable
private fun AlbumViewerScreen(
    title: String,
    items: List<StagedItem>,
    startIndex: Int,
    onBack: () -> Unit,
    onAddToCollection: (StagedItem) -> Unit
) {
    var currentIndex by remember(items, startIndex) { mutableIntStateOf(startIndex.coerceIn(0, (items.size - 1).coerceAtLeast(0))) }
    val current = items.getOrNull(currentIndex)
    Column(modifier = Modifier.fillMaxSize().background(Color.Black).statusBarsPadding().navigationBarsPadding()) {
        Row(modifier = Modifier.fillMaxWidth().padding(horizontal = 10.dp, vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onBack) {
                Icon(Icons.AutoMirrored.Outlined.ArrowBack, contentDescription = "返回", tint = Color.White)
            }
            Column(modifier = Modifier.weight(1f)) {
                Text(title, color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.ExtraBold, maxLines = 1, overflow = TextOverflow.Ellipsis)
                Text("${if (items.isEmpty()) 0 else currentIndex + 1}/${items.size}", color = Color.White.copy(alpha = 0.68f), fontSize = 12.sp)
            }
            TextButton(onClick = { current?.let(onAddToCollection) }, enabled = current != null) { Text("加入精选") }
        }

        Box(modifier = Modifier.fillMaxWidth().weight(1f), contentAlignment = Alignment.Center) {
            if (current == null) {
                Text("没有可浏览的照片", color = Color.White.copy(alpha = 0.7f), fontSize = 14.sp)
            } else {
                PhotoThumb(
                    index = current.paletteIndex,
                    uri = current.uri,
                    modifier = Modifier
                        .fillMaxWidth()
                        .fillMaxHeight()
                )
                Row(modifier = Modifier.fillMaxWidth().align(Alignment.Center), horizontalArrangement = Arrangement.SpaceBetween) {
                    IconButton(onClick = { if (currentIndex > 0) currentIndex-- }, enabled = currentIndex > 0) {
                        Icon(Icons.AutoMirrored.Outlined.ArrowBack, contentDescription = "上一张", tint = Color.White)
                    }
                    IconButton(onClick = { if (currentIndex < items.lastIndex) currentIndex++ }, enabled = currentIndex < items.lastIndex) {
                        Icon(Icons.AutoMirrored.Outlined.Redo, contentDescription = "下一张", tint = Color.White)
                    }
                }
            }
        }

        Row(modifier = Modifier.fillMaxWidth().padding(10.dp).horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            items.forEachIndexed { index, item ->
                PhotoThumb(
                    index = item.paletteIndex,
                    uri = item.uri,
                    modifier = Modifier
                        .size(58.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .border(if (index == currentIndex) 2.dp else 0.dp, Color.White, RoundedCornerShape(8.dp))
                        .clickable { currentIndex = index }
                )
            }
        }
    }
}

@Composable
private fun PublishPreviewScreen(items: List<StagedItem>, onBack: () -> Unit) {
    Column(modifier = Modifier.fillMaxSize().background(AppColors.Bg).statusBarsPadding()) {
        Row(modifier = Modifier.fillMaxWidth().background(Color.White).padding(horizontal = 10.dp, vertical = 10.dp), verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onBack) {
                Icon(Icons.AutoMirrored.Outlined.ArrowBack, contentDescription = "返回", tint = AppColors.Ink)
            }
            Column(modifier = Modifier.weight(1f)) {
                Text("发布预览", color = AppColors.Ink, fontSize = 22.sp, fontWeight = FontWeight.ExtraBold)
                Text("${items.size} 张照片 · 自动排版", color = AppColors.Muted, fontSize = 12.sp)
            }
        }
        Column(modifier = Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(16.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
            PublishCollage(items)
            InfoCard("排版策略", publishLayoutText(items.size))
        }
    }
}

@Composable
private fun PublishCollage(items: List<StagedItem>) {
    val visibleItems = items.take(9)
    Column(modifier = Modifier.fillMaxWidth().clip(RoundedCornerShape(18.dp)).background(Color.White).border(1.dp, AppColors.Line, RoundedCornerShape(18.dp)).padding(12.dp)) {
        if (visibleItems.isEmpty()) {
            EmptyCollectionText("还没有可预览的照片")
            return@Column
        }
        when (visibleItems.size) {
            1 -> PublishTile(visibleItems[0], Modifier.fillMaxWidth().height(360.dp), 0)
            2 -> Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
                visibleItems.forEachIndexed { index, item -> PublishTile(item, Modifier.weight(1f).height(300.dp), index) }
            }
            3 -> Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
                PublishTile(visibleItems[0], Modifier.weight(1.25f).height(328.dp), 0)
                Column(verticalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.weight(1f)) {
                    PublishTile(visibleItems[1], Modifier.fillMaxWidth().height(160.dp), 1)
                    PublishTile(visibleItems[2], Modifier.fillMaxWidth().height(160.dp), 2)
                }
            }
            4 -> Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                visibleItems.chunked(2).forEachIndexed { rowIndex, row ->
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
                        row.forEachIndexed { index, item -> PublishTile(item, Modifier.weight(1f).height(164.dp), rowIndex * 2 + index) }
                    }
                }
            }
            else -> Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                visibleItems.chunked(3).forEachIndexed { rowIndex, row ->
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
                        row.forEachIndexed { index, item -> PublishTile(item, Modifier.weight(1f).height(112.dp), rowIndex * 3 + index) }
                        repeat(3 - row.size) { Spacer(modifier = Modifier.weight(1f).height(112.dp)) }
                    }
                }
            }
        }
    }
}

@Composable
private fun PublishTile(item: StagedItem, modifier: Modifier, index: Int) {
    PhotoThumb(
        index = item.paletteIndex + index,
        uri = item.uri,
        modifier = modifier.clip(RoundedCornerShape(10.dp))
    )
}

private fun StoredDecision.toStagedItem(index: Int): StagedItem {
    return StagedItem(mediaId = mediaId, paletteIndex = mediaId.toInt() + index, uri = uri, displayName = displayName)
}

private fun publishLayoutText(count: Int): String = when (count) {
    0 -> "暂无照片"
    1 -> "单图使用大图展示，优先保留视觉冲击力"
    2 -> "双图并排展示，方便发布前比较"
    3 -> "三图采用一大两小，突出第一张"
    4 -> "四图采用 2x2 宫格"
    else -> "多图采用九宫格预览，最多展示前 9 张"
}

@Composable
private fun DecisionThumbSection(title: String, subtitle: String, empty: String, items: List<StoredDecision>) {
    CollectionSection(title, subtitle, empty) {
        if (items.isEmpty()) {
            EmptyCollectionText(empty)
        } else {
            ThumbGrid {
                items.take(24).forEachIndexed { index, item ->
                    CollectionThumb(item.displayName.ifBlank { title }, item.uri, index, false, null, {}, {})
                }
            }
        }
    }
}

@Composable
private fun ImagePreviewDialog(title: String, uri: String, paletteIndex: Int, onClose: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.82f))
            .clickable { onClose() }
            .padding(18.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            PhotoThumb(
                index = paletteIndex,
                uri = uri,
                modifier = Modifier
                    .fillMaxWidth()
                    .fillMaxHeight(0.72f)
                    .clip(RoundedCornerShape(18.dp))
            )
            Text(title, color = Color.White, fontSize = 14.sp, maxLines = 1, overflow = TextOverflow.Ellipsis, modifier = Modifier.padding(top = 14.dp))
            TextButton(onClick = onClose, modifier = Modifier.padding(top = 6.dp)) { Text("关闭") }
        }
    }
}

@Composable
private fun SharePreviewDialog(stagedItems: List<StagedItem>, onClose: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.58f))
            .clickable { onClose() }
            .padding(18.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(22.dp))
                .background(Color.White)
                .padding(18.dp)
        ) {
            Text("发布预览", color = AppColors.Ink, fontSize = 20.sp, fontWeight = FontWeight.ExtraBold)
            Text("暂存照片精选拼图", color = AppColors.Muted, fontSize = 12.sp, modifier = Modifier.padding(top = 4.dp, bottom = 14.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.horizontalScroll(rememberScrollState())) {
                stagedItems.take(6).forEachIndexed { index, item ->
                    PhotoThumb(
                        index = item.paletteIndex + index,
                        uri = item.uri,
                        modifier = Modifier
                            .size(96.dp)
                            .clip(RoundedCornerShape(14.dp))
                    )
                }
            }
            Text("共 ${stagedItems.size} 张，可用于朋友圈/小红书发布前预览。", color = AppColors.Muted, fontSize = 12.sp, modifier = Modifier.padding(top = 14.dp))
            TextButton(onClick = onClose, modifier = Modifier.align(Alignment.End).padding(top = 8.dp)) { Text("关闭") }
        }
    }
}

@Composable
private fun RecentActionsScreen(
    categories: List<MediaCategory>,
    decisions: List<StoredDecision>,
    onUndoLatest: () -> Unit,
    onNavigate: (AppPage) -> Unit
) {
    ScreenScaffold(
        active = AppPage.Stats,
        title = "最近操作",
        subtitle = "本地记录",
        action = { TextButton(onClick = onUndoLatest, enabled = decisions.isNotEmpty()) { Text("撤回最近") } },
        onNavigate = onNavigate
    ) {
        InfoCard("相册索引", statsText(categories))
        CollectionSection("最近 20 条", if (decisions.isEmpty()) "暂无操作记录" else "${decisions.size} 条最近操作", "卡片页操作后会出现在这里") {
            if (decisions.isEmpty()) EmptyCollectionText("还没有操作记录") else Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                decisions.forEachIndexed { index, item -> RecentActionRow(item, index) }
            }
        }
    }
}

@Composable
private fun RecentActionRow(item: StoredDecision, paletteIndex: Int) {
    Row(modifier = Modifier.fillMaxWidth().clip(RoundedCornerShape(12.dp)).background(AppColors.Bg).padding(10.dp), verticalAlignment = Alignment.CenterVertically) {
        PhotoThumb(paletteIndex, item.uri, Modifier.size(48.dp).clip(RoundedCornerShape(8.dp)))
        Column(modifier = Modifier.padding(start = 10.dp).weight(1f)) {
            Text(actionName(item.action), color = AppColors.Ink, fontSize = 13.sp, fontWeight = FontWeight.ExtraBold)
            Text(item.displayName.ifBlank { "媒体 #${item.mediaId}" }, color = AppColors.Muted, fontSize = 12.sp, maxLines = 1, overflow = TextOverflow.Ellipsis)
        }
        Text("#${item.id}", color = AppColors.Subtle, fontSize = 11.sp)
    }
}

@Composable
private fun SettingsScreen(
    status: LibraryStatus,
    decisionCount: Int,
    actionBarEnabled: Boolean,
    onToggleActionBar: () -> Unit,
    onReload: () -> Unit,
    onClearDecisions: () -> Unit,
    onNavigate: (AppPage) -> Unit
) {
    ScreenScaffold(AppPage.Settings, "设置", "偏好与数据", onNavigate = onNavigate) {
        Column(modifier = Modifier.padding(horizontal = 16.dp).fillMaxWidth().clip(RoundedCornerShape(18.dp)).background(Color.White).border(1.dp, AppColors.Line, RoundedCornerShape(18.dp))) {
            SettingsRow("显示辅助操作栏", "默认关闭，打开后卡片页底部显示按钮", actionBarEnabled, onToggleActionBar)
            SettingsRow("删除前轻提示", "首次删除时提醒，可勾选不再提醒", true, {})
            SettingsRow("相册扫描", statusLabel(status), true, onReload)
            SettingsRow("本地决策记录", "已记录 $decisionCount 次操作", decisionCount > 0, onClearDecisions, actionLabel = "清空")
        }
    }
}

@Composable
private fun SettingsRow(title: String, desc: String, checked: Boolean, onToggle: () -> Unit, actionLabel: String? = null) {
    Row(modifier = Modifier.fillMaxWidth().padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
        Column(modifier = Modifier.weight(1f)) {
            Text(title, color = AppColors.Ink, fontSize = 14.sp, fontWeight = FontWeight.ExtraBold)
            Text(desc, color = AppColors.Muted, fontSize = 12.sp, modifier = Modifier.padding(top = 2.dp))
        }
        if (actionLabel == null) Switch(checked = checked, onCheckedChange = { onToggle() }) else TextButton(onClick = onToggle, enabled = checked) { Text(actionLabel) }
    }
}

@Composable
private fun CollectionSection(title: String, subtitle: String, emptyText: String, content: @Composable () -> Unit) {
    Column(
        modifier = Modifier
            .padding(horizontal = 16.dp)
            .fillMaxWidth()
            .clip(RoundedCornerShape(18.dp))
            .background(Color.White)
            .border(1.dp, AppColors.Line, RoundedCornerShape(18.dp))
            .padding(14.dp)
    ) {
        Text(title, color = AppColors.Ink, fontSize = 16.sp, fontWeight = FontWeight.ExtraBold)
        Text(subtitle.ifBlank { emptyText }, color = AppColors.Muted, fontSize = 12.sp, modifier = Modifier.padding(top = 2.dp))
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            content()
        }
    }
}

@Composable
private fun EmptyCollectionText(text: String) {
    Text(text, color = AppColors.Subtle, fontSize = 12.sp, modifier = Modifier.fillMaxWidth().padding(vertical = 10.dp), textAlign = androidx.compose.ui.text.style.TextAlign.Center)
}

@Composable
private fun ThumbGrid(content: @Composable () -> Unit) {
    Row(modifier = Modifier.fillMaxWidth().horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(10.dp)) { content() }
}

@Composable
private fun CollectionThumb(title: String, uri: String, paletteIndex: Int, selected: Boolean, actionLabel: String?, onClick: () -> Unit, onAction: () -> Unit) {
    Column(modifier = Modifier.width(82.dp).clickable { onClick() }) {
        Box {
            PhotoThumb(paletteIndex, uri, Modifier.size(82.dp).clip(RoundedCornerShape(12.dp)).border(if (selected) 3.dp else 0.dp, AppColors.Primary, RoundedCornerShape(12.dp)))
            if (selected) Box(modifier = Modifier.align(Alignment.TopEnd).padding(6.dp).size(20.dp).clip(CircleShape).background(AppColors.Primary), contentAlignment = Alignment.Center) {
                Text("✓", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.ExtraBold)
            }
        }
        Text(title, color = AppColors.Ink, fontSize = 11.sp, maxLines = 1, overflow = TextOverflow.Ellipsis, modifier = Modifier.padding(top = 6.dp))
        if (actionLabel != null) TextButton(onClick = onAction, modifier = Modifier.height(30.dp)) { Text(actionLabel, fontSize = 11.sp) }
    }
}

@Composable
private fun InfoCard(title: String, desc: String) {
    Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp).fillMaxWidth().clip(RoundedCornerShape(18.dp)).background(Color.White).border(1.dp, AppColors.Line, RoundedCornerShape(18.dp)).padding(16.dp)) {
        Text(title, color = AppColors.Ink, fontSize = 15.sp, fontWeight = FontWeight.ExtraBold)
        Text(desc, color = AppColors.Muted, fontSize = 12.sp, modifier = Modifier.padding(top = 4.dp))
    }
}

@Composable
private fun ScreenScaffold(
    active: AppPage,
    title: String,
    subtitle: String,
    action: @Composable (() -> Unit)? = null,
    onNavigate: (AppPage) -> Unit,
    content: @Composable () -> Unit
) {
    Column(modifier = Modifier.fillMaxSize().background(AppColors.Bg).statusBarsPadding()) {
        Row(modifier = Modifier.fillMaxWidth().background(Color.White.copy(alpha = 0.94f)).padding(horizontal = 18.dp, vertical = 14.dp), verticalAlignment = Alignment.CenterVertically) {
            Column(modifier = Modifier.weight(1f)) {
                Text(subtitle, color = AppColors.Muted, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                Text(title, color = AppColors.Ink, fontSize = 24.sp, fontWeight = FontWeight.ExtraBold)
            }
            action?.invoke()
        }
        Column(modifier = Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(bottom = 74.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            content()
        }
    }
    BottomNav(active, onNavigate)
}

@Composable
private fun BottomNav(active: AppPage, onNavigate: (AppPage) -> Unit) {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.BottomCenter) {
        Row(modifier = Modifier.fillMaxWidth().navigationBarsPadding().height(64.dp).background(Color.White.copy(alpha = 0.96f)).border(1.dp, AppColors.Line), horizontalArrangement = Arrangement.SpaceAround, verticalAlignment = Alignment.CenterVertically) {
            NavItem(Icons.Outlined.Home, "首页", active == AppPage.Home) { onNavigate(AppPage.Home) }
            NavItem(Icons.Outlined.Star, "精选集", active == AppPage.Collections) { onNavigate(AppPage.Collections) }
            NavItem(Icons.Outlined.BarChart, "最近", active == AppPage.Stats) { onNavigate(AppPage.Stats) }
            NavItem(Icons.Outlined.Settings, "设置", active == AppPage.Settings) { onNavigate(AppPage.Settings) }
        }
    }
}

@Composable
private fun NavItem(icon: ImageVector, label: String, selected: Boolean, onClick: () -> Unit) {
    Column(modifier = Modifier.clickable { onClick() }.widthIn(min = 68.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        Box(modifier = Modifier.width(34.dp).height(28.dp).clip(RoundedCornerShape(16.dp)).background(if (selected) AppColors.PrimarySoft else Color.Transparent), contentAlignment = Alignment.Center) {
            Icon(icon, contentDescription = label, tint = if (selected) AppColors.Primary else AppColors.Subtle, modifier = Modifier.size(19.dp))
        }
        Text(label, color = if (selected) AppColors.Primary else AppColors.Subtle, fontSize = 10.sp, fontWeight = if (selected) FontWeight.Bold else FontWeight.Medium)
    }
}

@Composable
private fun PhotoThumb(index: Int, uri: String = "", modifier: Modifier = Modifier) {
    val palettes = listOf(
        listOf(Color(0xFF0F766E), Color(0xFF5EEAD4), Color(0xFFF0FDFA)),
        listOf(Color(0xFF1D4ED8), Color(0xFF93C5FD), Color(0xFFEFF6FF)),
        listOf(Color(0xFF7C2D12), Color(0xFFFDBA74), Color(0xFFFFF7ED)),
        listOf(Color(0xFF6D28D9), Color(0xFFC4B5FD), Color(0xFFF5F3FF)),
        listOf(Color(0xFF166534), Color(0xFF86EFAC), Color(0xFFF0FDF4)),
        listOf(Color(0xFFBE123C), Color(0xFFFDA4AF), Color(0xFFFFF1F2)),
        listOf(Color(0xFF334155), Color(0xFFCBD5E1), Color(0xFFF8FAFC))
    )
    val palette = palettes[index % palettes.size]
    Box(modifier = modifier.background(Brush.linearGradient(palette))) {
        if (uri.isNotBlank()) {
            AsyncImage(model = uri, contentDescription = null, contentScale = ContentScale.Crop, modifier = Modifier.fillMaxSize())
        } else {
            Box(modifier = Modifier.align(Alignment.BottomCenter).fillMaxWidth(1.2f).fillMaxHeight(0.42f).clip(RoundedCornerShape(topStartPercent = 50, topEndPercent = 50)).background(Color.White.copy(alpha = 0.22f)))
            Box(modifier = Modifier.align(Alignment.TopEnd).padding(14.dp).size(18.dp).clip(CircleShape).background(Color.White.copy(alpha = 0.58f)))
        }
    }
}

@Composable
private fun ToastOverlay(message: String, bottom: Int = 86) {
    Box(modifier = Modifier.fillMaxSize().padding(bottom = bottom.dp), contentAlignment = Alignment.BottomCenter) {
        Text(message, color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.ExtraBold, modifier = Modifier.clip(RoundedCornerShape(999.dp)).background(Color(0xE60F172A)).padding(horizontal = 16.dp, vertical = 9.dp))
    }
}

private fun circleButtonModifier(): Modifier = Modifier.size(38.dp).shadow(2.dp, CircleShape).clip(CircleShape).background(Color.White).border(1.dp, AppColors.Line, CircleShape)

private fun mediaPermission(): String = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) Manifest.permission.READ_MEDIA_IMAGES else Manifest.permission.READ_EXTERNAL_STORAGE

private fun sourceIcon(type: SourceType): ImageVector = when (type) {
    SourceType.Camera -> Icons.Outlined.CameraAlt
    SourceType.Screenshot -> Icons.Outlined.Image
    SourceType.Download -> Icons.Outlined.Download
}

private fun sourceColor(type: SourceType): Color = when (type) {
    SourceType.Camera -> AppColors.Primary
    SourceType.Screenshot -> AppColors.Stage
    SourceType.Download -> Color(0xFF0F766E)
}

private fun detectAction(offset: Offset): ReviewActionType? {
    if (maxOf(abs(offset.x), abs(offset.y)) < 60f) return null
    return if (abs(offset.x) > abs(offset.y)) {
        if (offset.x > 0) ReviewActionType.Undo else ReviewActionType.Skip
    } else {
        if (offset.y > 0) ReviewActionType.AddToCollection else ReviewActionType.Delete
    }
}

private fun actionName(type: ReviewActionType): String = when (type) {
    ReviewActionType.Delete -> "删除"
    ReviewActionType.Skip -> "跳过"
    ReviewActionType.Undo -> "撤回"
    ReviewActionType.AddToCollection -> "加入精选集"
    ReviewActionType.Stage -> "暂存"
}

private fun statusLabel(status: LibraryStatus): String = when (status) {
    LibraryStatus.Checking -> "检查权限"
    LibraryStatus.NeedsPermission -> "等待授权"
    LibraryStatus.Loading -> "正在扫描"
    LibraryStatus.Ready -> "真实相册"
    LibraryStatus.Empty -> "示例数据"
}

private fun statsText(categories: List<MediaCategory>): String {
    val count = categories.sumOf { it.count }
    val bytes = categories.flatMap { it.groups }.flatMap { it.items }.sumOf { it.sizeBytes }
    return "当前索引 $count 张，约 ${formatSize(bytes)}"
}
