#!/usr/bin/env node
/**
 * 发布前检查脚本
 * 在发布前运行此脚本确保所有条件满足
 */

import { execSync } from "child_process";
import { readFileSync } from "fs";
import { resolve } from "path";

const root = process.cwd();

console.log("🔍 Running release checks...\n");

const checks = [];

// 1. 检查是否在 main 分支
try {
  const branch = execSync("git branch --show-current", {
    encoding: "utf-8",
  }).trim();
  if (branch !== "main") {
    checks.push({
      name: "Branch check",
      status: "warn",
      message: `Current branch is "${branch}", expected "main"`,
    });
  } else {
    checks.push({
      name: "Branch check",
      status: "pass",
      message: "On main branch",
    });
  }
} catch {
  checks.push({
    name: "Branch check",
    status: "fail",
    message: "Failed to get current branch",
  });
}

// 2. 检查是否有未提交的更改
try {
  const status = execSync("git status --porcelain", {
    encoding: "utf-8",
  }).trim();
  if (status) {
    checks.push({
      name: "Clean working directory",
      status: "fail",
      message: "Uncommitted changes detected",
    });
  } else {
    checks.push({
      name: "Clean working directory",
      status: "pass",
      message: "Working directory is clean",
    });
  }
} catch {
  checks.push({
    name: "Clean working directory",
    status: "fail",
    message: "Failed to check git status",
  });
}

// 3. 检查 package.json 版本号
try {
  const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf-8"));
  checks.push({
    name: "Package version",
    status: "info",
    message: `Current version: ${pkg.version}`,
  });
} catch {
  checks.push({
    name: "Package version",
    status: "fail",
    message: "Failed to read package.json",
  });
}

// 4. 检查是否存在待处理的 changesets
try {
  const output = execSync("npx changeset status 2>&1", { encoding: "utf-8" });
  if (output.includes("No changesets present")) {
    checks.push({
      name: "Changesets",
      status: "info",
      message: "No pending changesets",
    });
  } else {
    checks.push({
      name: "Changesets",
      status: "info",
      message: "Pending changesets found",
    });
  }
} catch {
  checks.push({
    name: "Changesets",
    status: "warn",
    message: "Could not check changeset status",
  });
}

// 5. 检查构建是否成功
try {
  console.log("📦 Running build check...");
  execSync("pnpm run build", { stdio: "pipe" });
  checks.push({ name: "Build", status: "pass", message: "Build successful" });
} catch {
  checks.push({ name: "Build", status: "fail", message: "Build failed" });
}

// 6. 检查类型
try {
  console.log("🔍 Running type check...");
  execSync("pnpm run type-check", { stdio: "pipe" });
  checks.push({
    name: "Type check",
    status: "pass",
    message: "No type errors",
  });
} catch {
  checks.push({
    name: "Type check",
    status: "fail",
    message: "Type errors found",
  });
}

// 打印结果
console.log("\n📋 Release Check Results:\n");
console.log("─".repeat(60));

for (const check of checks) {
  const icon =
    check.status === "pass"
      ? "✅"
      : check.status === "fail"
      ? "❌"
      : check.status === "warn"
      ? "⚠️"
      : "ℹ️";
  console.log(`${icon} ${check.name}: ${check.message}`);
}

console.log("─".repeat(60));

const failures = checks.filter((c) => c.status === "fail");
if (failures.length > 0) {
  console.log(
    `\n❌ ${failures.length} check(s) failed. Please fix the issues before releasing.\n`
  );
  process.exit(1);
} else {
  console.log("\n✅ All checks passed! Ready to release.\n");
  process.exit(0);
}
