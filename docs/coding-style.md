<!-- category: 工程规范 -->

# 代码风格规范

> 本仓库代码风格基线。与 [.editorconfig](../.editorconfig)（格式）、[文件命名规范](file-naming.md)（命名）配套使用：前者管"长什么样"，本文档管"怎么写"。

**版本：** v1.0 · **生效日期：** 2026-07-03

## 1. 通用原则

1. **可读性优先于巧妙**：优先写出评审者一眼能懂的代码；性能关键路径再加注释说明取舍。
2. **最小变更**：一次提交只解决一件事，避免无关的重构夹带。
3. **不提前抽象**：三处重复再抽工具函数，不为假想需求设计接口。
4. **信任内部边界**：内部调用不需重复校验；只在系统边界（用户输入、外部 API、MediaStore）做防御。
5. **删除而非注释**：确信无用的代码直接删除，git 历史已承载；不要留 `// removed` 残骸。

## 2. Kotlin（Android 主交付物）

### 2.1 基线

遵循 [Kotlin 官方 Coding Conventions](https://kotlinlang.org/docs/coding-conventions.html) + [Android Kotlin Style Guide](https://developer.android.com/kotlin/style-guide)。引入 ktlint/detekt 后以规则文件为准。

- 缩进 4 空格（见 [.editorconfig](../.editorconfig)）。
- 行长上限 120 字符；超长换行时在运算符后断行并续进一级。
- 文件末尾保留一个空行（`insert_final_newline = true`）。

### 2.2 命名

| 元素 | 规则 | 示例 |
|------|------|------|
| 类 / 接口 / 枚举 | PascalCase | `MediaStoreRepository`、`DecisionStore` |
| 函数 / 变量 | camelCase | `loadAlbum()`、`actionBarEnabled` |
| 常量（`const val` / 伴生对象不可变） | SCREAMING_SNAKE_CASE | `MIN_GROUP_SIZE`、`MAX_GROUP_COUNT` |
| 包名 | 全小写，不缩写 | `com.albumcleaner.prototype.data` |
| Composable 函数 | PascalCase | `AlbumViewerScreen`、`CollectionSection` |
| 泛型参数 | 单大写字母或 PascalCase | `T`、`ItemT` |

### 2.3 Compose 专用约定

- `@Composable` 函数名用 PascalCase，描述其呈现的 UI 元素而非动作。
- 状态提升：可组合函数尽量无状态，状态由调用方传入；本地 UI 状态用 `remember { mutableStateOf(...) }`。
- 副作用隔离：异步、订阅、写入数据库等放进 `LaunchedEffect` / `rememberCoroutineScope`，不在组合过程中直接执行。
- 预览：复杂 UI 提供 `@Preview` 函数，命名 `<Composable>Preview`，放于同文件末尾。
- `Modifier` 作为第一个可选参数：`fun Card(modifier: Modifier = Modifier, ...)`。

### 2.4 代码组织

包结构遵循"按层 + 按特性"混合：

```
com.albumcleaner.prototype/
├── MainActivity.kt          # 入口 + 导航 + 顶层状态
└── data/                    # 数据层
    ├── Models.kt            # 领域模型（data class）
    ├── MediaStoreRepository.kt   # 媒体扫描
    ├── DecisionStore.kt     # 决策持久化（Room）
    ├── TrashRepository.kt   # 系统回收站
    ├── AlbumCleanerDatabase.kt   # Room 数据库
    └── FakeAlbumData.kt     # 示例数据（空相册回退）
```

- 一个文件一个顶层类（Repository / Database / Entity 例外可合并到 Models）。
- Repository 类不持有 Context 之外的可变状态；数据库操作走 suspend 函数或 Flow。
- `data class` 只承载数据，不含业务逻辑；逻辑放 Repository。

### 2.5 注释

- 公共 API、非显然的算法、与 PRD 偏差点必须注释，解释**为什么**而非**做什么**。
- KDoc 格式用于公共声明；行内注释用 `//`。
- 不为显而易见的代码加注释（如 `// 自增 i`）。

## 3. TypeScript（Web 原型）

### 3.1 基线

遵循 [TypeScript ESLint 推荐规则](https://typescript-eslint.io/) + [React 官方风格](https://react.dev/learn)。

- 缩进 2 空格。
- 行长上限 100 字符。
- 严格模式：`tsconfig.json` 已启用 `strict`，禁止 `any`，必要时用 `unknown` + 类型守卫。

### 3.2 命名

| 元素 | 规则 | 示例 |
|------|------|------|
| 接口 / 类型 / React 组件 | PascalCase | `MediaItem`、`AlbumCard` |
| 变量 / 函数 | camelCase | `loadGroupedAlbum()` |
| 常量 | SCREAMING_SNAKE_CASE | `MAX_ITEMS` |
| 文件 | 见 [文件命名规范](file-naming.md#3-源码文件按语言约定) | `main.tsx`、`vite.config.ts` |

### 3.3 React 约定

- 组件用函数声明，优先 `function Card()` 而非 `const Card = () =>`。
- Props 用 `type` 或 `interface`，命名 `<Component>Props`。
- 列表渲染的 `key` 用稳定 ID，不用数组下标。
- 副作用依赖数组必须完整，启用 `react-hooks/exhaustive-deps` 规则。

## 4. XML / Gradle

- Android 资源文件 snake_case：`activity_main.xml`、`ic_trash.xml`。
- 资源 ID `snake_case`：`@+id/group_card`。
- Gradle DSL 用 Kotlin（`.kts`），依赖坐标统一小写，版本号集中在 `build.gradle.kts` 顶部或 `libs.versions.toml`（引入后）。

## 5. 提交前自检

PR 提交前对照 [PR 模板](../.github/PULL_REQUEST_TEMPLATE.md) 自检清单：

- [ ] 改动 Android：本地 `./gradlew :app:assembleDebug` 通过
- [ ] 改动 Web 原型：本地 `npm run typecheck && npm run build` 通过
- [ ] 无未使用的 import、未引用的私有成员
- [ ] 公共 API 变更已更新对应文档
- [ ] 任务状态变更已同步 `docs/android-task-list.md`
