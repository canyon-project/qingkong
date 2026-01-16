# Railway 部署配置

## 问题
`v8-debug` 和 `v8-profiler` 在 Node.js 22 上无法编译，这些是 `node-inspector` 的可选依赖。

## 解决方案

已在 `package.json` 中使用 `pnpm.overrides` 将这些包替换为 `noop` 包，这样它们就不会尝试编译了。

如果仍然遇到问题，可以在 Railway 的环境变量中设置：

```
SKIP_OPTIONAL_DEPENDENCIES=true
```

或者在 Railway 的构建命令中使用：

```bash
pnpm install --frozen-lockfile --prefer-offline || true && pnpm db:generate && pnpm build
```
