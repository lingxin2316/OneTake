# Git 流程规范

**版本：** v1.0  
**生效日期：** 2026-07-03  
**适用仓库：** [lingxin2316/OneTake](https://github.com/lingxin2316/OneTake)

> 本规范由以下配置文件强制执行，文档与配置不一致时以配置为准：
> - [.commitlintrc.json](file:///c:/Users/13790/projects/OneTake/.commitlintrc.json) — 提交信息校验规则
> - [.github/workflows/ci.yml](file:///c:/Users/13790/projects/OneTake/.github/workflows/ci.yml) — 持续集成
> - [.github/workflows/commitlint.yml](file:///c:/Users/13790/projects/OneTake/.github/workflows/commitlint.yml) — 提交信息校验
> - [.github/workflows/release.yml](file:///c:/Users/13790/projects/OneTake/.github/workflows/release.yml) — 发布流程
> - [.github/PULL_REQUEST_TEMPLATE.md](file:///c:/Users/13790/projects/OneTake/.github/PULL_REQUEST_TEMPLATE.md) — PR 模板
> - [.gitignore](file:///c:/Users/13790/projects/OneTake/.gitignore) — 忽略规则

---

## 一、分支策略

### 1.1 分支模型

采用轻量主干开发（Trunk-based Development）：

| 分支 | 命名 | 用途 | 保护 |
|---|---|---|---|
| `main` | 固定 | 生产主干，始终可发布 | 禁止直推，仅通过 PR 合入；CI 必须通过 |
| 功能分支 | `feat/<简述>` | 新功能开发 | 从 `main` 切出 |
| 修复分支 | `fix/<简述>` | 缺陷修复 | 从 `main` 切出 |
| 文档分支 | `docs/<简述>` | 文档变更 | 从 `main` 切出 |
| 发布分支 | `release/v<x.y.z>` | 版本收尾（可选） | 从 `main` 切出 |

### 1.2 分支命名示例

```
feat/dark-theme
fix/undo-stack-overflow
docs/sync-readme
chore/upgrade-gradle
```

### 1.3 分支生命周期

1. 从最新 `main` 切出：`git checkout -b feat/xxx`
2. 开发期间可多次提交、多次推送到远端同名分支
3. 完成后提 PR → 通过 CI 与评审 → Squash merge 到 `main`
4. 合入后删除远端与本地分支

---

## 二、提交信息规范（Conventional Commits）

### 2.1 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

- `type` 必填，小写
- `scope` 可选，标注影响范围（如 `android`、`web`、`ci`、`docs`）
- `subject` 必填，祈使语气，首字母小写，不加句号
- `header` 总长度 ≤ 72 字符
- `body` 可选，说明"为什么"而非"做了什么"
- `footer` 可选，标注 BREAKING CHANGE 或关联 Issue

### 2.2 合法 type（11 种）

| type | 用途 |
|---|---|
| `feat` | 新功能 |
| `fix` | 缺陷修复 |
| `docs` | 文档变更 |
| `style` | 代码格式（不影响逻辑，如空格、分号） |
| `refactor` | 重构（既非新增功能也非修复） |
| `perf` | 性能优化 |
| `test` | 新增或修改测试 |
| `build` | 构建系统或依赖变更（如 build.gradle、package.json） |
| `ci` | CI 配置变更 |
| `chore` | 杂项（不修改 src 也不修改测试的其它变更） |
| `revert` | 回滚某次提交 |

### 2.3 示例

```
feat(android): 新增深色主题与跟随系统切换
fix(android): 修复撤回栈越界导致崩溃
docs: 同步 README 与代码真实状态
ci: 拆分 Android 与 Web 为并行 job
chore: 初始化 OneTake 项目仓库
revert: feat(android): 新增深色主题
```

### 2.4 校验机制

- PR 的所有提交信息由 [commitlint.yml](file:///c:/Users/13790/projects/OneTake/.github/workflows/commitlint.yml) 自动校验
- 不符合规范的提交会导致 PR 检查失败，无法合入

---

## 三、Pull Request 流程

### 3.1 标准流程

```
1. git checkout main && git pull
2. git checkout -b feat/xxx
3. 编码 → git add <具体文件> → git commit -m "feat(android): xxx"
4. git push -u origin feat/xxx
5. 在 GitHub 创建 PR（base: main ← compare: feat/xxx）
6. 等待 CI 全部通过 + 自检清单完成
7. 评审通过后 Squash merge
8. 删除分支
```

### 3.2 PR 自检清单（来自 [PR 模板](file:///c:/Users/13790/projects/OneTake/.github/PULL_REQUEST_TEMPLATE.md)）

- [ ] 提交信息符合 Conventional Commits
- [ ] 本地 `./gradlew :app:assembleDebug` 通过（Android 改动）
- [ ] 本地 `npm run typecheck && npm run build` 通过（Web 改动）
- [ ] 已同步 `android-app/README.md` 与 `android-task-list.md`（如有任务状态变更）
- [ ] 已同步 `prd.md`（如有功能边界/范围变更）

### 3.3 合入策略

- **默认 Squash merge**：将 PR 内多个提交压成单个，保持 `main` 历史线性
- 合入提交信息沿用 PR 标题（需符合 Conventional Commits）

---

## 四、CI 检查项

每次 push 到 `main` 或提 PR 时，[ci.yml](file:///c:/Users/13790/projects/OneTake/.github/workflows/ci.yml) 自动运行两个并行 job：

### 4.1 Android job

| 步骤 | 命令 | 失败后果 |
|---|---|---|
| 环境 | JDK 17 + Android SDK + Gradle 缓存 | — |
| 签名 | 自动生成 debug.keystore（如缺失） | — |
| 构建 | `./gradlew :app:assembleDebug` | ❌ 阻断 |
| 静态检查 | `./gradlew :app:lintDebug` | ❌ 阻断 |
| 单元测试 | `./gradlew :app:testDebugUnitTest` | ❌ 阻断 |
| 产物 | 上传 APK + lint 报告（保留 14 天） | — |

### 4.2 Web job

| 步骤 | 命令 | 失败后果 |
|---|---|---|
| 环境 | Node 20 + npm 缓存 | — |
| 依赖 | `npm ci` | ❌ 阻断 |
| 类型检查 | `npm run typecheck` | ❌ 阻断 |
| 构建 | `npm run build` | ❌ 阻断 |
| 产物 | 上传 dist（保留 7 天） | — |

### 4.3 提交信息校验

PR 触发 [commitlint.yml](file:///c:/Users/13790/projects/OneTake/.github/workflows/commitlint.yml)，校验所有提交信息符合第二章规范。

---

## 五、发布流程

### 5.1 版本号规范（语义化版本）

```
v<MAJOR>.<MINOR>.<PATCH>
```

| 位 | 何时递增 | 示例 |
|---|---|---|
| MAJOR | 不兼容的 API 变更 | `v1.0.0` → `v2.0.0` |
| MINOR | 向下兼容的新功能 | `v1.0.0` → `v1.1.0` |
| PATCH | 向下兼容的缺陷修复 | `v1.0.0` → `v1.0.1` |

预发布版本：`v1.0.0-rc.1`、`v1.0.0-beta.2`

### 5.2 发布操作

```
1. 确认 main 处于可发布状态（CI 绿）
2. git checkout main && git pull
3. git tag -a v1.0.0 -m "release: v1.0.0 MVP"
4. git push origin v1.0.0
```

推送 `v*.*.*` 标签后，[release.yml](file:///c:/Users/13790/projects/OneTake/.github/workflows/release.yml) 自动：

1. 构建 debug 签名 APK（内测包）
2. 重命名为 `OneTake-v1.0.0.apk`
3. 创建 GitHub Release，自动生成变更日志
4. 上传 APK 作为 Release 附件

### 5.3 升级到生产签名（待办）

当前 Release 使用 debug 签名（可安装测试，不可上架）。生产发布需：

1. 在 GitHub 仓库 **Settings → Secrets and variables → Actions** 配置：
   - `RELEASE_KEYSTORE_BASE64`（keystore 文件 base64 编码）
   - `RELEASE_KEYSTORE_PASSWORD`
   - `RELEASE_KEY_ALIAS`
   - `RELEASE_KEY_PASSWORD`
2. 修改 [release.yml](file:///c:/Users/13790/projects/OneTake/.github/workflows/release.yml)：`assembleDebug` → `assembleRelease`，并在构建前解码注入 keystore
3. 移除 release.yml 中的"内测包"提示文案

---

## 六、本地环境配置

### 6.1 首次安装

```powershell
winget install --id Git.Git -e --source winget --accept-source-agreements --accept-package-agreements
```

安装后**新开终端**才会生效 PATH；已开终端需手动：

```powershell
$env:PATH += ";C:\Program Files\Git\cmd"
```

### 6.2 身份配置

```powershell
git config user.name "lingxin2316"
git config user.email "lingxin2316@users.noreply.github.com"
```

> 邮箱使用 GitHub noreply 格式，避免暴露真实邮箱。建议配置为 `--global`（本仓库已配为 local）。

### 6.3 行尾设置

```powershell
git config core.autocrlf false
```

本仓库已设为 `false`（保留原始换行符，避免 CRLF 污染 diff）。

### 6.4 凭证管理

Git for Windows 自带 Git Credential Manager（GCM）。首次 push 时浏览器弹出 GitHub OAuth，授权后凭证缓存到系统，后续无需重复登录。

---

## 七、.gitignore 关键规则

| 规则 | 说明 |
|---|---|
| `node_modules/`、`dist/`、`.vite/` | Web 依赖与产物 |
| `android-app/.gradle/`、`android-app/**/build/` | Gradle 缓存与构建产物 |
| `android-app/.kotlin/` | Kotlin 编译器缓存 |
| `*.keystore`、`*.jks` | 签名密钥（**例外：`!debug.keystore` 保留调试密钥以统一本地与 CI 签名**） |
| `local.properties` | 本地 SDK 路径 |
| `.idea/`、`*.iml` | IDE 配置 |
| `.workbuddy/` | 本地 AI 助手记忆 |
| `*.mp4`、`微信图片*.jpg` | 误存的本地媒体 |

---

## 八、常用命令速查

```powershell
# 分支
git checkout -b feat/xxx          # 新建并切换
git push -u origin feat/xxx       # 首次推送并跟踪
git branch -d feat/xxx            # 删除本地分支
git push origin --delete feat/xxx # 删除远端分支

# 提交
git add <file1> <file2>           # 暂存指定文件（避免 git add . 误入）
git commit -m "feat(android): xxx"
git commit --amend                # 修改最近一次提交（未 push 时）

# 同步
git fetch --all --prune
git pull --rebase origin main     # 拉取并 rebase，保持线性历史

# 发布
git tag -a v1.0.0 -m "release: v1.0.0"
git push origin v1.0.0

# 状态
git status
git log --oneline -10
git diff --stat
```

---

## 九、违规处理

| 场景 | 处理 |
|---|---|
| 提交信息不符合 Conventional Commits | commitlint 阻断 PR，修改后重推 |
| 直推 `main` | 分支保护规则禁止（建议在 GitHub 设置中启用） |
| CI 失败 | 修复后推送同名分支，CI 自动重跑 |
| 误提交大文件/密钥 | 立即 `git rm --cached`，必要时用 `git filter-repo` 清理历史并强推（需评审） |
| 误提交到错误分支 | `git reset --soft HEAD~1` 回退提交，切到正确分支重做 |

---

*本规范随项目演进持续更新，重大变更通过 PR 评审后合入。*
