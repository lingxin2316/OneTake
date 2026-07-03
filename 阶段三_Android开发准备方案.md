# 阶段三：Android 开发准备方案

日期：2026-06-27

目标：把已经人工确认可接受的高保真原型，拆成真实 Android MVP 可开发、可验收、可迭代的实现方案。

---

## 1. 阶段定位

阶段二已经完成“所见即所得”的视觉方向确认。阶段三不再继续扩大原型范围，而是做真实 Android 开发前的工程准备：

- 固化 MVP 页面范围；
- 固化数据模型和交互状态；
- 明确 Android 权限、MediaStore、回收站和本地数据库边界；
- 拆分 Compose 组件；
- 产出第一轮开发任务顺序。

暂存图片放大浏览、社交预览、AI 分类、重复图片检测、OCR、照片压缩仍然延后，不进入第一版真实开发。

---

## 2. MVP 页面范围

第一批必须还原：

| 页面 | 原型入口 | Android 路由建议 | 说明 |
|---|---|---|---|
| 首页分组列表 | HomePage | `home` | 展示相机拍摄、截图、下载图片等基础分组 |
| 卡片决策页 | CardSwipePage | `review/{groupId}` | 核心四向手势、钉住、暂存、撤回 |
| 设置页 | SettingsPage | `settings` | 底部辅助操作栏开关、删除提醒开关等 |

第二批跟随实现：

| 页面 | Android 路由建议 | 说明 |
|---|---|---|
| 精选集页 | `collections` | 仅应用内整理夹，不同步系统收藏 |
| 暂存筛选页 | `staging` | 批量保留、删除、移出暂存 |
| 统计页 | `stats` | 删除数量和释放空间统计 |
| 新手引导页 | `guide` | 首次启动展示四向手势说明 |

---

## 3. 核心数据模型

建议先使用 Room 保存应用内状态，MediaStore 保存真实媒体引用。

```kotlin
data class MediaItem(
    val id: Long,
    val uri: String,
    val displayName: String,
    val mimeType: String,
    val bucketName: String?,
    val sourceType: SourceType,
    val dateTaken: Long?,
    val sizeBytes: Long,
    val width: Int?,
    val height: Int?
)

enum class SourceType {
    Camera,
    Screenshot,
    Download,
    Other
}

data class MediaGroup(
    val id: String,
    val title: String,
    val sourceType: SourceType,
    val itemCount: Int,
    val totalBytes: Long,
    val coverUri: String?,
    val items: List<MediaItem>
)

data class CollectionFolder(
    val id: String,
    val name: String,
    val iconName: String,
    val coverUri: String?,
    val itemCount: Int
)

data class ReviewAction(
    val id: String,
    val mediaId: Long,
    val action: ReviewActionType,
    val groupId: String,
    val collectionId: String? = null,
    val createdAt: Long
)

enum class ReviewActionType {
    Delete,
    Skip,
    AddToCollection,
    Stage
}
```

本地持久化建议：

| 表 | 用途 |
|---|---|
| `collection_folder` | 精选集/整理夹定义 |
| `collection_item` | 媒体和精选集的引用关系 |
| `staged_item` | 暂存栏媒体引用 |
| `review_action` | 当前小组内撤回栈和统计基础 |
| `user_setting` | 删除提醒、辅助操作栏等偏好 |

---

## 4. 关键交互状态

### 4.1 卡片决策状态

```kotlin
data class ReviewUiState(
    val groupId: String,
    val groupTitle: String,
    val items: List<MediaItem>,
    val currentIndex: Int,
    val stagedIds: Set<Long>,
    val undoStack: List<ReviewAction>,
    val isDeleteTipVisible: Boolean,
    val isCollectionSheetVisible: Boolean,
    val toastMessage: String?,
    val actionBarEnabled: Boolean,
    val deleteTipDisabled: Boolean
)
```

事件建议：

| 事件 | 结果 |
|---|---|
| `SwipeUp` | 首次删除弹轻提示；之后移入系统回收站并进入下一张 |
| `SwipeDown` | 打开精选集 BottomSheet，选择后进入下一张 |
| `SwipeLeft` | 跳过并进入下一张 |
| `SwipeRight` | 撤回上一操作；空栈显示轻提示 |
| `TapPin` | 加入暂存，钉住图标变色，并自动进入下一张 |
| `TapUndoButton` | 与右滑撤回一致 |
| `ToggleActionBar` | 设置页开关，默认关闭 |

### 4.2 删除策略

第一版建议：

- Android 11 及以上：优先使用 `MediaStore.createTrashRequest()` 移入系统回收站；
- Android 10 及以下：降级为系统删除确认流或标记为待删除，按实际兼容方案处理；
- 应用内撤回删除：优先从本次操作记录中恢复，能力受 Android 系统回收站 API 限制；
- 首次删除弹轻提示，带“不再提醒”复选框。

---

## 5. Compose 组件拆分

视觉组件：

| 组件 | 说明 |
|---|---|
| `AppScaffold` | 状态栏 inset、底部导航、页面背景 |
| `BottomNavBar` | 首页、精选集、统计、设置 |
| `GroupSummaryCard` | 首页顶部待整理统计卡 |
| `MediaCategoryCard` | 相机拍摄/截图/下载图片分类卡 |
| `MediaGroupRow` | 展开后的子分组行 |
| `PhotoThumb` | 真实 MediaStore 缩略图，统一圆角和裁剪 |
| `ReviewPhotoCard` | 决策页主照片卡 |
| `PinButton` | 未钉住描边，钉住后紫色填充 |
| `StagingBar` | 卡片页底部暂存栏 |
| `CollectionSheet` | 加入精选集 BottomSheet |
| `DeleteTipDialog` | 首次删除轻提示 |
| `AppToastHost` | 撤回成功/空撤回轻提示 |
| `SettingsRow` | 设置项行和开关 |

交互组件：

| 组件 | 说明 |
|---|---|
| `SwipeDecisionBox` | 识别四向滑动，阈值 60dp |
| `ReviewActionBar` | 设置开启后显示的辅助按钮栏 |
| `ThumbnailStrip` | 决策页顶部横向缩略图 |

---

## 6. Android 权限和媒体读取

建议按 Android 版本分支处理：

| Android 版本 | 权限建议 |
|---|---|
| Android 13+ | `READ_MEDIA_IMAGES`，如支持视频再加 `READ_MEDIA_VIDEO` |
| Android 10-12 | `READ_EXTERNAL_STORAGE` |
| Android 10+ 删除/移入回收站 | 使用 MediaStore 写入请求或 TrashRequest |

首版扫描策略：

1. 读取图片媒体，不先处理视频；
2. 按 `bucketName`、`relativePath`、`dateTaken`、`mimeType` 做基础分组；
3. 相机拍摄：优先 `DCIM/Camera` 或系统 bucket；
4. 截图：优先 `Screenshots` bucket 或路径关键词；
5. 下载图片：优先 `Download` bucket 或路径关键词；
6. 不做内容识别、不做云端上传。

---

## 7. 第一轮开发顺序

### Sprint 1：工程骨架

- 创建 Android 项目，技术栈建议 Kotlin + Jetpack Compose + Room + Coil；
- 建立主题 Token：颜色、字号、圆角、阴影、间距；
- 实现底部导航和三页空状态：首页、卡片页、设置页；
- 接入假数据，先做到视觉还原。

验收：真实 Android 设备或模拟器中，首页、卡片页、设置页和原型视觉接近。

### Sprint 2：媒体扫描和分组

- 接入媒体权限；
- 读取 MediaStore 图片；
- 生成基础分组；
- 首页使用真实缩略图、数量、体积；
- 点击小组进入卡片决策页。

验收：首页能展示真实相册分组，缩略图不卡顿、不变形。

### Sprint 3：卡片决策核心

- 实现四向手势；
- 实现删除首次提示；
- 实现跳过、加入精选集、钉住暂存；
- 实现撤回栈和 toast；
- 辅助按钮栏默认关闭，设置页可开启。

验收：用户可以连续处理一个小组，误操作可撤回，钉住后自动进入下一张。

### Sprint 4：精选集和暂存

- Room 保存精选集；
- 加入精选集 BottomSheet；
- 暂存栏和暂存筛选页；
- 暂存页支持批量移出、保留、删除。

验收：精选集是应用内整理夹，暂存图片可批量处理。

### Sprint 5：稳定性和发布准备

- 处理权限拒绝、空相册、读取失败、删除失败；
- 补充窄屏适配和横竖屏策略；
- 增加基础埋点或本地统计；
- 准备内部测试包。

验收：核心流程不崩溃，常见异常有明确提示。

---

## 8. 第一版验收标准

必须满足：

- 首页、卡片决策页、设置页与当前高保真原型大体一致；
- 360dp 宽度下文字不重叠、主要按钮可点击；
- 四向手势阈值稳定，误触率可接受；
- 删除前首次轻提示出现，勾选“不再提醒”后不再弹；
- 钉住图标未钉住时只有线，钉住时有颜色；
- 钉住后自动进入下一张；
- 撤回成功有 toast，空撤回也有 toast；
- 精选集文案明确为“应用内整理夹/精选集”，不暗示系统收藏同步；
- 底部辅助操作栏默认关闭，可在设置打开。

暂不验收：

- AI 分类；
- 重复图片检测；
- OCR；
- 暂存图片放大浏览；
- 社交发布预览；
- 图片压缩。

---

## 9. 当前推荐下一步

建议下一步直接开始 Sprint 1：创建真实 Android Compose 工程骨架，并先用假数据还原首页、卡片页、设置页。

如果暂时不创建 Android 工程，则下一步可以先补一份 `Android_开发任务清单.md`，把 Sprint 1 到 Sprint 5 拆成可勾选任务。
