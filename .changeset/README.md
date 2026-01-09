# 版本管理指南

本项目使用 **standard-version** 从 Git 提交消息自动生成 CHANGELOG。

## 简单使用

只需按照规范写 commit message，然后运行发布命令即可：

```bash
# 发布补丁版本 (0.1.0 -> 0.1.1)
pnpm version:patch

# 发布次要版本 (0.1.0 -> 0.2.0)
pnpm version:minor

# 发布主要版本 (0.1.0 -> 1.0.0)
pnpm version:major
```

## Commit 规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范编写提交消息：

```
<type>(<scope>): <subject>
```

### 类型说明

| Type     | 说明      | 版本影响 |
| -------- | --------- | -------- |
| feat     | 新功能    | minor    |
| fix      | Bug 修复  | patch    |
| docs     | 文档更新  | -        |
| style    | 代码格式  | -        |
| refactor | 重构      | -        |
| perf     | 性能优化  | patch    |
| test     | 测试      | -        |
| chore    | 构建/工具 | -        |
| revert   | 回滚      | patch    |
| build    | 构建系统  | -        |
| ci       | CI 配置   | -        |

### 破坏性变更

在 commit body 或 footer 中添加 `BREAKING CHANGE:` 会触发 major 版本更新：

```
feat(ProTable): change columns prop type

BREAKING CHANGE: columns prop now requires ProColumn[] instead of Column[]
```

## 常用命令

| 命令                 | 说明                          |
| -------------------- | ----------------------------- |
| `pnpm version:patch` | 发布补丁版本 (Bug 修复)       |
| `pnpm version:minor` | 发布次要版本 (新功能)         |
| `pnpm version:major` | 发布主要版本 (破坏性变更)     |
| `pnpm version:alpha` | 发布 alpha 预发布版本         |
| `pnpm version:beta`  | 发布 beta 预发布版本          |
| `pnpm changelog`     | 仅生成 CHANGELOG (不更新版本) |
| `pnpm release:dry`   | 预览发布 (不实际执行)         |
| `pnpm release`       | 构建并发布到 npm              |

## 工作流程

### 日常开发

```bash
# 1. 开发功能
git add .
git commit -m "feat(ProTable): add autoFill prop"

# 2. 修复 Bug
git add .
git commit -m "fix(ProForm): resolve validation issue"
```

### 发布版本

```bash
# 1. 预览发布内容
pnpm release:dry

# 2. 执行发布 (自动: 更新版本号 + 生成 CHANGELOG + 创建 Git tag)
pnpm version:patch  # 或 version:minor, version:major

# 3. 推送到远程
git push --follow-tags origin main

# 4. 发布到 npm
pnpm release
```

## 示例

### Commit 示例

```bash
# 新功能
git commit -m "feat(ProTable): add column resize support"

# Bug 修复
git commit -m "fix(ProForm): fix date picker value binding"

# 带 scope 的提交
git commit -m "docs(readme): update installation guide"

# 破坏性变更
git commit -m "feat(ProTable)!: rename onRowClick to onClickRow"
```

### 生成的 CHANGELOG 示例

```markdown
## [0.2.0](https://github.com/user/repo/compare/v0.1.0...v0.2.0) (2026-01-09)

### Features

- **ProTable:** add autoFill prop for auto-height ([abc1234](https://github.com/user/repo/commit/abc1234))
- **ProForm:** add drawer form component ([def5678](https://github.com/user/repo/commit/def5678))

### Bug Fixes

- **ProTable:** fix sorting issue with nested data ([ghi9012](https://github.com/user/repo/commit/ghi9012))
```
