# 发布指南

本项目使用 **standard-version** + **GitHub Actions** 进行自动化版本管理和发布。

## 快速发布

```bash
# 1. 确保代码已提交，在 main 分支
git checkout main
git pull origin main

# 2. 更新版本（自动更新 CHANGELOG + 创建 Git tag）
pnpm version:patch   # 补丁版本 0.0.1 -> 0.0.2
# 或 pnpm version:minor  次要版本 0.0.1 -> 0.1.0
# 或 pnpm version:major  主要版本 0.0.1 -> 1.0.0

# 3. 推送代码和 tag（触发自动发布）
git push --follow-tags origin main
```

推送 tag 后，GitHub Actions 会自动：

1. ✅ 构建项目
2. ✅ 创建 GitHub Release（附带 CHANGELOG）
3. ✅ 发布到 npm

## 详细流程

### 本地发布流程

```
┌─────────────────────────────────────┐
│ 1. pnpm version:patch/minor/major  │
│    - 更新 package.json 版本号       │
│    - 生成/更新 CHANGELOG.md         │
│    - 创建 Git commit                │
│    - 创建 Git tag (v0.x.x)         │
└────────────────┬────────────────────┘
                 ▼
┌─────────────────────────────────────┐
│ 2. git push --follow-tags origin   │
│    推送代码和 tag 到 GitHub         │
└────────────────┬────────────────────┘
                 ▼
┌─────────────────────────────────────┐
│ 3. GitHub Actions 自动触发          │
│    - 构建项目                       │
│    - 创建 GitHub Release            │
│    - 发布到 npm                     │
└─────────────────────────────────────┘
```

### GitHub Actions 工作流

| 工作流  | 触发条件           | 执行内容                            |
| ------- | ------------------ | ----------------------------------- |
| CI      | PR 或 push 到 main | Lint, Type Check, Build, Test       |
| Release | push tag `v*`      | 构建, 创建 GitHub Release, 发布 npm |

## 配置要求

### 1. 配置 NPM_TOKEN

在 GitHub 仓库设置中添加 Secret：

1. 访问 [npm](https://www.npmjs.com/) → Access Tokens → Generate New Token
2. 选择 **Automation** 类型
3. 在 GitHub 仓库 → Settings → Secrets and variables → Actions
4. 添加 `NPM_TOKEN`，值为上一步生成的 token

### 2. GitHub Token

`GITHUB_TOKEN` 由 GitHub Actions 自动提供，无需额外配置。

## 常用命令

| 命令                 | 说明                      |
| -------------------- | ------------------------- |
| `pnpm version:patch` | 发布补丁版本 (Bug 修复)   |
| `pnpm version:minor` | 发布次要版本 (新功能)     |
| `pnpm version:major` | 发布主要版本 (破坏性变更) |
| `pnpm version:alpha` | 发布 alpha 预发布版本     |
| `pnpm version:beta`  | 发布 beta 预发布版本      |
| `pnpm changelog`     | 仅生成 CHANGELOG          |
| `pnpm release:dry`   | 预览发布内容              |

## 预发布版本

```bash
# Alpha 版本 (0.1.0 -> 0.1.1-alpha.0)
pnpm version:alpha
git push --follow-tags origin main

# Beta 版本 (0.1.0 -> 0.1.1-beta.0)
pnpm version:beta
git push --follow-tags origin main
```

用户安装预发布版本：

```bash
npm install tdesign-pro-components@alpha
npm install tdesign-pro-components@beta
```

## Commit 规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>
```

### 类型说明

| Type     | 说明      | 版本影响 |
| -------- | --------- | -------- |
| feat     | 新功能    | minor    |
| fix      | Bug 修复  | patch    |
| perf     | 性能优化  | patch    |
| docs     | 文档更新  | -        |
| style    | 代码格式  | -        |
| refactor | 重构      | -        |
| test     | 测试      | -        |
| chore    | 构建/工具 | -        |
| ci       | CI 配置   | -        |
| build    | 构建系统  | -        |
| revert   | 回滚      | patch    |

### 破坏性变更

在 commit 消息中添加 `BREAKING CHANGE:` 触发 major 版本：

```bash
git commit -m "feat(ProTable)!: rename onRowClick to onClickRow

BREAKING CHANGE: onRowClick prop has been renamed to onClickRow"
```

## 手动发布到 npm

如果需要手动发布（不通过 GitHub Actions）：

```bash
# 1. 构建
pnpm build

# 2. 发布
npm publish --access public
```

## 故障排除

### Release workflow 失败

1. **NPM_TOKEN 未配置**：检查 GitHub Secrets
2. **包名已存在**：检查 npm 上是否已有同名包
3. **版本号已存在**：确保版本号未被使用

### CHANGELOG 未生成

确保 commit message 符合 Conventional Commits 规范。

### Tag 未推送

```bash
# 推送所有 tag
git push origin --tags

# 推送特定 tag
git push origin v0.1.0
```
