# Android 开发任务清单

日期：2026-06-27  
最后核实：2026-07-03（依据 `app/src/main/` 源码）

> 标注说明：`[x]` 代码层已完成并验证；`[~]` 部分完成有缺口；`[ ]` 未开始。

## Sprint 1：工程骨架与假数据 UI

- [x] 创建 Android 工程目录 `android-app`
- [x] 创建 Gradle Kotlin DSL 配置
- [x] 创建 `app` 模块
- [x] 创建 Manifest 和基础权限声明
- [x] 建立 Compose 主题色 Token
- [x] 建立假数据模型
- [x] 首页分组列表 UI
- [x] 卡片决策页 UI
- [x] 设置页 UI
- [x] 底部导航
- [x] 暂存栏 UI
- [x] 精选集 BottomSheet
- [x] 首次删除轻提示
- [x] 钉住后自动进入下一张
- [x] 右滑撤回与空撤回 toast
- [x] 在 Android Studio 完成 Gradle Sync（`./gradlew :app:assembleDebug` BUILD SUCCESSFUL）
- [ ] 在模拟器或真机运行首屏（构建通过，运行时未在日志中确认）
- [ ] 对照 Web 原型微调首页、卡片页、设置页视觉

## Sprint 2：真实媒体扫描

- [x] Android 13+ 申请 `READ_MEDIA_IMAGES`
- [x] Android 12 及以下申请 `READ_EXTERNAL_STORAGE`
- [x] 读取 MediaStore 图片列表（`MediaStoreRepository`，上限 3000 张）
- [x] 生成 `MediaItem`
- [x] 按来源分为相机拍摄、截图、下载图片（`inferSourceType`）
- [x] 按日期/路径生成小组（`MIN_GROUP_SIZE=8`、`MAX_GROUP_COUNT=12`）
- [x] 首页替换为真实数量、体积、缩略图（Coil `AsyncImage`）
- [x] 处理权限拒绝和空相册状态（`NeedsPermission` / `Empty` 态）

## Sprint 3：卡片决策真实操作

- [x] 接入真实缩略图加载，建议 Coil
- [x] 四向手势接真实媒体项
- [x] 跳过记录写入本地状态
- [x] 加入精选集写入本地数据库
- [x] 钉住写入暂存表
- [x] 删除接入系统回收站能力（`TrashRepository`，Android R+）
- [x] 删除失败时显示错误提示（低版本回退 toast）
- [x] 撤回删除、跳过、精选集、暂存（含系统回收站恢复 IntentSender）
- [ ] 设置页持久化辅助操作栏开关（当前为内存状态）
- [ ] 设置页持久化"不再提醒删除"（当前为内存状态）

## Sprint 4：精选集与暂存

- [x] 建立 Room 数据库（`AlbumCleanerDatabase` v2）
- [ ] `collection_folder` 表
- [ ] `collection_item` 表
- [x] `staged_item` 表
- [ ] `review_action` 表（当前以 `decision_record` 替代）
- [~] 精选集页展示应用内整理夹（基于 `decision_record` 模拟，缺独立 folder 实体）
- [~] 精选集详情页（`AlbumViewerScreen` 浏览页存在，缺 per-folder 管理）
- [x] 暂存筛选页
- [x] 暂存页批量移出
- [ ] 暂存页批量删除（仅移除，未接入系统回收站）
- [x] 暂存页批量加入精选集

## Sprint 5：稳定性与发布准备

- [ ] 360dp 宽度视觉检查
- [ ] 375dp 宽度视觉检查
- [ ] 390dp 宽度视觉检查
- [ ] 412dp 宽度视觉检查
- [ ] 深色模式策略确认（`AppTheme` 仅 `lightColorScheme`，未实现深色）
- [ ] 权限拒绝兜底文案
- [ ] 删除/回收站兼容性测试
- [ ] 大相册性能测试
- [ ] 内部测试包
- [ ] 已知问题清单

## 明确延后

- [ ] AI 分类
- [ ] 重复图片检测
- [ ] OCR
- [ ] 照片压缩
- [ ] 暂存图片放大浏览
- [ ] 社交发布预览（`PublishPreviewScreen` 代码已保留作 V1.5 储备，入口已隐藏，见 PRD 第十章 #8）

## 新增：工程化（2026-07-03）

- [x] `.gitignore` 补齐 `.kotlin/`、`*.keystore`、`.workbuddy/`
- [x] GitHub Actions CI（`.github/workflows/ci.yml`：Android 构建 + lint + 单测框架占位 + Web typecheck/build）
- [x] GitHub Actions Release（`.github/workflows/release.yml`：tag `v*.*.*` 触发，产出 debug 签名内测包并发布 GitHub Release）
- [x] Conventional Commits 校验（`.github/workflows/commitlint.yml` + `.commitlintrc.json`）
- [x] PR 模板（`.github/PULL_REQUEST_TEMPLATE.md`）
