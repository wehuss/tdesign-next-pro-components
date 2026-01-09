/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // 新功能
        "fix", // Bug 修复
        "docs", // 文档变更
        "style", // 代码格式（不影响代码运行的变动）
        "refactor", // 重构（既不增加功能，也不修复 bug）
        "perf", // 性能优化
        "test", // 测试相关
        "build", // 构建系统或外部依赖变更
        "ci", // CI 配置变更
        "chore", // 其他不修改 src 或 test 的变更
        "revert", // 回滚
        "release", // 发布
      ],
    ],
    "subject-case": [0],
    "header-max-length": [2, "always", 100],
  },
};
