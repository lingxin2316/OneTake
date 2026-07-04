# OneTake

相册清理工具 —— 通过四向手势快速整理手机相册，将冗余照片一键送入系统回收站。黑客松项目。

## 项目结构

```
OneTake/
├── android-app/   # Android Compose 工程（MVP 主交付物）
├── prototype/     # Web 原型（UI 设计验证）
├── docs/          # 产品与工程文档
├── pitch/         # 路演材料
└── .github/       # CI/CD 工作流与 PR 模板
```

## 快速开始

### Android 工程

```bash
cd android-app
./gradlew :app:assembleDebug
```

产出 APK：`android-app/app/build/outputs/apk/debug/app-debug.apk`。

环境要求：JDK 17、AGP 8.13.0、compileSdk 35。详见 [Android Studio 安装与运行指南](docs/android-studio-setup.md)。

### Web 原型

```bash
cd prototype
npm ci
npm run typecheck
npm run build
```

## 文档索引

完整文档见 [docs/index.md](docs/index.md)，按四分类组织：

### 产品与需求
| 文档 | 说明 |
|------|------|
| [产品需求文档](docs/prd.md) | 功能边界、MVP 范围与 V1.0 实现偏差说明 |

### 工程规范
| 文档 | 说明 |
|------|------|
| [Git 流程规范](docs/git-workflow.md) | 分支策略、Conventional Commits、PR 与发布流程 |
| [代码风格规范](docs/coding-style.md) | Kotlin/TS 代码风格、Compose 约定、包结构 |
| [文件命名规范](docs/file-naming.md) | 文件与目录命名约定 |

### 开发指南
| 文档 | 说明 |
|------|------|
| [Android 开发任务清单](docs/android-task-list.md) | Sprint 1-5 任务三态标注 |
| [Android UI 还原规范](docs/android-ui-spec.md) | 设计稿到 Compose 的还原标准 |
| [Android Studio 安装与运行指南](docs/android-studio-setup.md) | 从零搭建开发环境 |

### 历史归档
| 文档 | 说明 |
|------|------|
| [阶段二 UI 预览检查记录](docs/phase-2-ui-review.md) | Web 原型验收记录 |
| [阶段三 Android 开发准备方案](docs/phase-3-android-prep.md) | Android 工程立项方案 |

## 技术栈

| 层 | 技术 |
|----|------|
| Android UI | Kotlin 2.0.21 + Jetpack Compose（BOM 2024.12.01） |
| 数据持久化 | Room 2.6.1 |
| 图片加载 | Coil 2.7.0 |
| 媒体访问 | MediaStore |
| Web 原型 | Vite + React + TypeScript |
| CI/CD | GitHub Actions |

## 当前状态

MVP 主流程（扫描 → 分组 → 手势决策 → 系统回收站 → Room 持久化）在代码层打通，推进至 Sprint 4（部分）。详细进度见 [android-app/README.md](android-app/README.md)。

## 贡献

欢迎参与贡献，请先阅读 [贡献指南](CONTRIBUTING.md)。

## 开源协议

[MIT](LICENSE)
