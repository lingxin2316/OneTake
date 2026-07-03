# 贡献指南

感谢参与 OneTake！本指南说明如何在本仓库中高效协作。首次贡献前请通读本文档。

## 1. 行为准则

请保持友善、尊重、建设性。聚焦问题本身，不针对个人。不接受任何形式的骚扰或贬低言论。

## 2. 开发环境

### 2.1 通用要求

- Git（建议 2.40+）
- JDK 17（Android 编译必需，推荐 Temurin / Zulu）

### 2.2 Android 工程

详见 [Android Studio 安装与运行指南](docs/android-studio-setup.md)。核心版本：

| 组件 | 版本 |
|------|------|
| AGP | 8.13.0 |
| Gradle | 8.13 |
| Kotlin | 2.0.21 |
| Compose BOM | 2024.12.01 |
| compileSdk | 35 |
| minSdk | 26 |

```bash
cd android-app
./gradlew :app:assembleDebug
```

### 2.3 Web 原型

- Node.js 18+（推荐 LTS）

```bash
cd prototype
npm ci
npm run typecheck
npm run build
```

## 3. 工作流

遵循 [Git 流程规范](docs/git-workflow.md)。要点：

### 3.1 分支

采用轻量主干开发，所有变更经 PR 合入 `main`，禁止直推：

```bash
git checkout main && git pull
git checkout -b feat/<简述>     # 或 fix/ docs/ chore/
```

分支命名示例：`feat/dark-theme`、`fix/undo-crash`、`docs/sync-readme`。

### 3.2 提交信息

遵循 [Conventional Commits](https://www.conventionalcommits.org/)，由 [.commitlintrc.json](.commitlintrc.json) 强制校验：

```
<type>(<scope>): <subject>

<body>

<footer>
```

- **type**：`feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore` `revert`
- **scope**（可选）：`android` `web` `ci` `docs` 等
- **subject**：祈使句，首字母小写，≤72 字符

示例：

```
feat(android): 设置页 UserSettings 持久化
fix(android): 修复撤回栈溢出导致的崩溃
docs: 同步 PRD 与任务清单状态
```

### 3.3 提交 PR

1. 推送到远端同名分支。
2. 在 PR 中填写 [PR 模板](.github/PULL_REQUEST_TEMPLATE.md) 的变更说明与自检清单。
3. 等待 CI（Android 构建 + Lint + 单测、Web typecheck + build、commitlint）全部通过。
4. 评审通过后 **Squash merge** 到 `main`，随后删除分支。

## 4. 代码风格

详见 [代码风格规范](docs/coding-style.md)，要点：

- 格式由 [.editorconfig](.editorconfig) 约束（缩进 / 换行 / 编码）。
- 命名遵循 [文件命名规范](docs/file-naming.md)：文档 kebab-case，Kotlin PascalCase，TS camelCase。
- 一处只做一件事，不夹带无关重构。
- 不为假想需求提前抽象；不为不会发生的场景加防御。

## 5. 测试期望

- 改动 `MediaStoreRepository` 分组逻辑、`DecisionStore` 持久化、`detectAction` 手势判定等关键路径时，**必须**补单元测试。
- 改动 UI 时本地跑通构建即可；涉及交互逻辑的改动鼓励补 Compose UI 测试。
- CI 当前执行 `testDebugUnitTest`，新增测试应能在该任务下通过。

## 6. 报告问题与建议

- 缺陷 / 功能请求：使用 [.github/ISSUE_TEMPLATE/](.github/ISSUE_TEMPLATE/) 中的结构化模板。
- 使用疑问 / 想法探讨：到 [Discussions](https://github.com/lingxin2316/OneTake/discussions)。
- 安全漏洞：请**勿**在公开 Issue 中披露，邮件联系仓库 owner。

## 7. 文档同步

OneTake 重视文档与代码的一致性（这是历史教训）。提交 PR 时：

- 功能边界变更 → 同步 [PRD](docs/prd.md)（含第十章 Open Issues / 第十一章实现偏差说明）。
- 任务状态变更 → 同步 [android-task-list.md](docs/android-task-list.md) 与 [android-app/README.md](android-app/README.md)。
- 文档间相互引用的重命名 → 用 Grep 检索并更新所有交叉引用。

PR 模板的自检清单已包含以上项，提交前逐项确认。

## 8. 依赖更新

依赖更新由 [Dependabot](.github/dependabot.yml) 每周自动提 PR。合并依赖 PR 前：

- 确认 CI 全绿。
- Android 依赖升级后本地 `./gradlew :app:assembleDebug` 验证；大版本升级（如 Kotlin / Compose BOM）需在 PR 描述中说明影响。
- 如升级会破坏稳定性，可关闭 PR 并在描述中记录原因。
