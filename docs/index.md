# OneTake 文档中心

> OneTake 相册清理工具的文档导航入口，按**产品与需求 / 工程规范 / 开发指南 / 历史归档**四分类组织，便于 AI 助手溯源与人类查阅。

---

## 一、产品与需求

定义"做什么"和"为什么"——产品决策、范围界定、用户价值。

| 文档 | 简介 |
|------|------|
| [产品需求文档](prd.md) | PRD 主文档：功能边界、MVP 范围、交互逻辑、V1.0 实现偏差说明 |

## 二、工程规范

定义"怎么做"的标准——编码、流程、质量保障。

| 文档 | 简介 |
|------|------|
| [Git 流程规范](git-workflow.md) | 分支策略、Conventional Commits、PR 流程、发布流程 |
| [代码风格规范](coding-style.md) | Kotlin/TS 编码约定、Compose 规范、包结构、命名规则 |
| [文件命名规范](file-naming.md) | 文档/源码/目录命名规则、引用规范、变更流程 |

## 三、开发指南

实操层面的"怎么做"——环境搭建、功能实现、常见问题。

| 文档 | 简介 |
|------|------|
| [Android 开发任务清单](android-task-list.md) | Sprint 1-5 任务三态标注（[x]/[~]/[ ]），与源码同步核实 |
| [Android Studio 安装与运行指南](android-studio-setup.md) | 从零搭建开发环境，含依赖配置与版本要求 |
| [Android UI 还原规范](android-ui-spec.md) | 设计稿到 Compose 的还原标准，含组件规范与视觉校验点 |

## 四、历史归档

记录决策过程和阶段成果——复盘、追溯、审计。

| 文档 | 简介 |
|------|------|
| [阶段二 UI 预览检查记录](phase-2-ui-review.md) | Web 原型验收记录，含 UI 还原规范产出说明 |
| [阶段三 Android 开发准备方案](phase-3-android-prep.md) | Android 工程立项方案，含技术选型与项目结构规划 |

---

## 交叉引用图谱

```
PRD ──→ android-task-list.md（任务级状态同步）
PRD ──→ android-ui-spec.md（UI 规范溯源）
git-workflow.md ──→ android-task-list.md（PR 自检清单）
coding-style.md ──→ .editorconfig（格式约束）
coding-style.md ──→ file-naming.md（命名约束）
file-naming.md ──→ git-workflow.md（重命名流程）
phase-2-ui-review.md ──→ android-ui-spec.md（产出物引用）
phase-3-android-prep.md ──→ android-task-list.md（后续建议）
```

## 文档更新规则

1. 新增文档时在本节对应的分类下添加条目；
2. 修改文档时检查交叉引用是否需要同步；
3. 删除文档时同步更新本节索引。

**最后更新：** 2026-07-04
