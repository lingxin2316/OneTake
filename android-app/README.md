# AlbumCleanerPrototype Android

这是相册整理工具的 Android Compose 工程，当前已推进至 Sprint 4（部分），MVP 主流程（扫描→分组→手势决策→系统回收站→Room 持久化）在代码层打通。

## 当前状态

> 以下清单依据 `app/src/main/` 源码核实，与 `../docs/Android_开发任务清单.md` 中的勾选状态保持同步。

### 已完成（代码层验证通过）

**Sprint 1 — 工程骨架与假数据 UI**

- Kotlin + Jetpack Compose 项目结构；
- 首页分组列表 UI（含真实相册与示例数据双模式）；
- 卡片决策页 UI（四向手势 + 钉住 + 缩略图横幅 + 暂存栏）；
- 设置页辅助操作栏开关；
- 底部导航（首页 / 精选集 / 最近 / 设置）；
- 钉住加入暂存并自动进入下一张；
- 右滑撤回与空撤回 toast；
- 首次删除轻提示（支持"不再提醒"勾选）；
- 精选集 BottomSheet；
- 暂存栏展开与横向缩略图。

**Sprint 2 — 真实媒体扫描**

- Android 13+ 申请 `READ_MEDIA_IMAGES`、Android 12- 申请 `READ_EXTERNAL_STORAGE`；
- 读取 MediaStore 图片列表（`MediaStoreRepository`，上限 3000 张）；
- 生成 `MediaItem`；
- 按来源分为相机拍摄 / 截图 / 下载图片（基于 `RELATIVE_PATH` 与文件名推断）；
- 按日期/路径生成小组（`MIN_GROUP_SIZE=8`、`MAX_GROUP_COUNT=12`，小组归并为"其他"）；
- 首页替换为真实数量、体积、缩略图；
- 处理权限拒绝（`NeedsPermission` 态）与空相册（`Empty` 态回退示例数据）。

**Sprint 3 — 卡片决策真实操作（大部分）**

- 接入真实缩略图加载（Coil `AsyncImage`）；
- 四向手势接真实媒体项；
- 跳过 / 加入精选集 / 钉住写入本地数据库（`DecisionStore`）；
- 删除接入系统回收站（`TrashRepository`，Android R+ `MediaStore.createTrashRequest`）；
- 删除失败时显示错误提示（低版本回退为本地决策记录 + toast）；
- 撤回删除 / 跳过 / 精选集 / 暂存（含系统回收站恢复 `IntentSender`）。

**Sprint 4 — 精选集与暂存（部分）**

- 建立 Room 数据库（`AlbumCleanerDatabase`，version 2）；
- `staged_item` 表；
- 暂存筛选页（全选 / 取消选择 / 批量加入精选 / 批量移除）；
- 精选相册浏览页（`AlbumViewerScreen`，含上一张/下一张与缩略图条）。

### 未完成 / 已知缺口

- **设置页持久化**：`actionBarEnabled` 与 `skipDeleteTip` 当前为内存状态，未写入 Room，重启后丢失；
- **精选集 schema 不完整**：缺 `collection_folder`、`collection_item`、`review_action` 三张表，当前用 `decision_record` 模拟精选集，不支持自定义名称/图标/封面；
- **暂存页批量删除**：仅支持"移除（出暂存）"，不支持"批量删除（入系统回收站）"；
- **深色主题**：`AppTheme` 仅含 `lightColorScheme`，PRD MVP 要求的浅/深双主题未实现；
- **真机/模拟器端到端验证**：仅确认 Gradle 构建通过，运行时行为未在日志中确认；
- **Sprint 5 稳定性全部项**：多宽度视觉检查、深色模式策略、权限兜底文案、回收站兼容性测试、大相册性能测试、内测包均未启动；
- **测试覆盖**：项目当前 0 单元测试 / 0 Instrumented 测试；
- **发布预览入口已隐藏**：`PublishPreviewScreen` 代码保留作为 V1.5 储备，入口已从精选集页移除（详见 PRD 第十章 Open Issues #8）。

## 打开方式

1. 使用 Android Studio 打开 `android-app` 目录（即本项目下的 `android-app/`）。
2. 等待 Gradle Sync。
3. 选择 `app` 运行到模拟器或真机。

## 本机验证状态

已验证 Android Debug 构建可正常通过：

```bash
cd android-app
./gradlew :app:assembleDebug
```

产出 APK 位于 `app/build/outputs/apk/debug/app-debug.apk`。

Web 原型构建验证：

```bash
npm run typecheck
npm run build
```

## 技术栈版本

| 组件 | 版本 |
|------|------|
| AGP | 8.13.0 |
| Gradle | 8.13 |
| Kotlin | 2.0.21 |
| Compose BOM | 2024.12.01 |
| compileSdk | 35 |
| Build-Tools | 37.0.0 |
| JDK | 17 |

## 下一步

- 补齐 Sprint 3 剩余项：设置页持久化（`UserSettings` 表）；
- 补齐 Sprint 4：`collection_folder` / `collection_item` schema 重构；
- 启动 Sprint 5 稳定性收尾：多宽度视觉检查、深色模式、性能测试、内测包；
- 引入单元测试覆盖 `MediaStoreRepository` 分组逻辑与 `detectAction` 手势判定。
