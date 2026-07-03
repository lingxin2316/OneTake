# 文件命名规范

> 本仓库统一遵循的文件与目录命名约定。新增文件前请对照本文档，保持命名一致性。

## 1. 总体原则

1. **文件名一律使用 ASCII 字符**，禁止中文、空格、全角符号（git mv 已将历史中文文档全部改为英文）。
2. **小写 kebab-case 为默认规则**：全小写字母，单词间以连字符 `-` 分隔，例如 `android-task-list.md`。
3. 命名应**见名知义**，避免缩写到只有作者自己能看懂；专有名词（如 `Android`、`PRD`、`UI`）在文档名中统一小写化（`android`、`prd`、`ui`）。
4. 文件名不含版本号、日期或作者前缀；版本信息写在文档正文头部，由 git 历史承载变更轨迹。

## 2. 各类文件命名细则

| 文件类型 | 规则 | 示例 |
|---------|------|------|
| Markdown 文档（`docs/`） | kebab-case，全小写 | `prd.md`、`git-workflow.md`、`phase-2-ui-review.md` |
| 根级配置文件 | 沿用工具约定（点文件） | `.gitignore`、`.editorconfig`、`.commitlintrc.json` |
| GitHub 工作流 | kebab-case | `.github/workflows/ci.yml`、`release.yml` |
| GitHub 模板 | 全大写下划线（GitHub 约定） | `PULL_REQUEST_TEMPLATE.md` |
| Web 原型源码 | 见下「源码文件」 | `main.tsx`、`vite.config.ts` |
| 资源图片 | kebab-case | `icon-trash.svg` |

## 3. 源码文件（按语言约定）

源码文件遵循各语言社区惯例，**不强制 kebab-case**：

| 语言 | 规则 | 示例 |
|------|------|------|
| Kotlin / Java | PascalCase（类名与文件名一致） | `MainActivity.kt`、`MediaStoreRepository.kt` |
| TypeScript / JavaScript | camelCase（模块文件）/ kebab-case（配置） | `main.tsx`、`vite.config.ts` |
| XML（Android 资源） | snake_case | `styles.xml`、`activity_main.xml` |
| Gradle 脚本 | 工具约定 | `build.gradle.kts`、`settings.gradle.kts` |
| Shell | kebab-case | `build-debug.sh` |

## 4. 目录结构约定

```
OneTake/
├── android-app/          # Android Compose 工程（Kotlin）
├── prototype/            # Web 原型（Vite + React + TS）
├── docs/                 # 所有 Markdown 文档（kebab-case）
├── pitch/                # 黑客松路演材料（slides/ + pptx）
├── .github/
│   ├── workflows/        # CI/CD（ci.yml / release.yml / commitlint.yml）
│   └── PULL_REQUEST_TEMPLATE.md
├── .gitignore
├── .editorconfig
├── .commitlintrc.json
├── README.md
└── LICENSE
```

- `docs/` 下文档统一 kebab-case，避免在文档间相互引用时出现路径编码问题。
- 每个一级目录承担单一职责，跨模块资产不放在根目录。

## 5. 文档间引用规则

在 Markdown 中引用本仓库内其他文档时，使用**相对路径 + 反引号**：

```markdown
详见 [任务清单](android-task-list.md) 或 `git-workflow.md` 第 3 章。
```

- 同目录下直接用文件名，跨目录用相对路径（如 `../docs/prd.md`）。
- 引用路径在文件重命名后必须同步更新（见下「变更流程」）。

## 6. 变更流程

1. 重命名文档优先使用 `git mv`，保留文件历史。
2. 重命名后用 `Grep` 检索旧文件名，更新所有交叉引用。
3. PR 自检清单已包含「同步文档引用」项，提交前确认无断链。
