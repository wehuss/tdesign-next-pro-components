# 发布指南

本项目使用 [Changesets](https://github.com/changesets/changesets) 进行版本管理和发布。

## 版本管理流程

### 1. 添加 Changeset

当你的 PR 包含需要发布的更改时，请运行：

```bash
pnpm changeset:add
```

这将创建一个新的 changeset 文件，描述你的更改：

- **patch**: Bug 修复、小改动（0.0.x）
- **minor**: 新功能、向后兼容的变更（0.x.0）
- **major**: 破坏性变更（x.0.0）

### 2. 提交 Changeset

将生成的 `.changeset/*.md` 文件提交到你的 PR 中。

### 3. 版本更新

当 PR 合并到 main 分支后，CI 会自动：

1. 创建一个 "Version Packages" PR，汇总所有 changesets
2. 合并该 PR 后自动发布到 npm

## 手动发布

如需手动发布，请按以下步骤操作：

```bash
# 1. 运行发布前检查
pnpm release:check

# 2. 更新版本号和 CHANGELOG
pnpm changeset:version

# 3. 提交版本更改
git add .
git commit -m "chore: version packages"

# 4. 发布到 npm
pnpm release
```

## 预发布版本

### Alpha 版本

```bash
pnpm version:alpha
pnpm publish:alpha
```

### Beta 版本

```bash
pnpm version:beta
pnpm publish:beta
```

## Commit 规范

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

### 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型

| Type     | 说明                   |
| -------- | ---------------------- |
| feat     | 新功能                 |
| fix      | Bug 修复               |
| docs     | 文档变更               |
| style    | 代码格式（不影响功能） |
| refactor | 重构                   |
| perf     | 性能优化               |
| test     | 测试相关               |
| build    | 构建系统变更           |
| ci       | CI 配置变更            |
| chore    | 其他变更               |
| revert   | 回滚                   |
| release  | 发布                   |

### 示例

```
feat(ProTable): add autoFill prop for auto-height

fix(ProForm): resolve form validation issue

docs: update README with new examples
```

## 查看版本状态

查看当前待发布的 changesets：

```bash
pnpm changeset:status
```

## 常见问题

### Q: 什么时候需要添加 changeset？

当你的更改会影响到库的使用者时，需要添加 changeset。以下情况通常需要：

- 新增功能
- 修复 Bug
- API 变更
- 性能优化

以下情况通常不需要：

- 仅更新文档
- 仅更新开发工具配置
- 仅更新测试代码

### Q: 如何选择版本类型？

- **patch**: 向后兼容的 Bug 修复
- **minor**: 向后兼容的新功能
- **major**: 破坏性变更（需要用户修改代码才能升级）

### Q: commit 被拒绝了怎么办？

如果 commit 因为格式不符合规范被拒绝，请检查：

1. type 是否为允许的类型（feat, fix, docs 等）
2. 格式是否正确：`type(scope): subject`
3. subject 是否以小写字母开头
