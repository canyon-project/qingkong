# PWA 图标生成指南

## 方法一：使用浏览器生成（推荐，最简单）

1. 打开 `public/generate-icons.html` 文件
2. 在浏览器中打开该文件
3. 点击"下载全部"按钮
4. 将下载的文件保存到 `public` 目录

**优点**：无需安装任何依赖，直接在浏览器中生成

## 方法二：使用 Node.js 脚本

### 安装依赖

```bash
pnpm add -D canvas
```

### 运行脚本

```bash
pnpm run generate-icons
```

**注意**：`canvas` 包需要系统级依赖，在某些系统上可能需要额外配置。

## 方法三：手动创建

如果你有设计工具（Figma、Photoshop 等），可以：

1. 创建一个 512x512 的设计
2. 导出为 PNG 格式
3. 创建两个尺寸：
   - `icon-192.png` (192x192)
   - `icon-512.png` (512x512)
4. 保存到 `public` 目录

## 图标设计说明

当前图标设计包含：
- 红色背景 (#FF2442)
- 白色日历图标
- 日期数字 "16"
- "晴空" 文字

你可以根据需要修改设计。

## 验证图标

生成图标后，确保：
- ✅ `public/icon-192.png` 存在
- ✅ `public/icon-512.png` 存在
- ✅ 文件大小合理（通常几 KB 到几十 KB）
- ✅ 在浏览器中打开 `manifest.json` 可以正常显示

## 快速开始

**最简单的方法**：直接在浏览器中打开 `public/generate-icons.html` 并下载图标！
