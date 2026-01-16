# PWA 设置说明

## 已完成的配置

1. ✅ `public/manifest.json` - PWA 清单文件
2. ✅ `public/sw.js` - Service Worker
3. ✅ `app/components/PWAInstaller.tsx` - 安装提示组件
4. ✅ `app/layout.tsx` - 已添加 PWA metadata

## 需要创建的图标文件

PWA 需要以下图标文件（放在 `public` 目录）：

- `icon-192.png` - 192x192 像素
- `icon-512.png` - 512x512 像素

### 创建图标的方法

1. **使用在线工具**：
   - 访问 https://realfavicongenerator.net/
   - 上传你的应用图标
   - 生成并下载 PWA 图标

2. **使用设计工具**：
   - 使用 Figma、Photoshop 等工具创建
   - 导出为 PNG 格式
   - 尺寸分别为 192x192 和 512x512

3. **临时方案**：
   - 可以使用现有的 favicon.ico
   - 或者创建一个简单的占位图标

## 功能说明

### Service Worker
- 缓存主要页面，提升加载速度
- 支持离线访问（基础功能）

### 安装提示
- 在支持的浏览器中自动显示安装提示
- 用户可以点击"安装应用"添加到主屏幕

### Manifest 配置
- 应用名称：晴空单向历
- 主题色：#FF2442（与应用主色调一致）
- 显示模式：standalone（独立应用模式）

## 测试 PWA

1. **开发环境**：
   ```bash
   pnpm dev
   ```

2. **生产环境**：
   ```bash
   pnpm build
   pnpm start
   ```

3. **在浏览器中测试**：
   - Chrome/Edge: 打开开发者工具 > Application > Manifest
   - 检查 Service Worker 是否注册成功
   - 测试"添加到主屏幕"功能

## iOS Safari 特殊说明

iOS Safari 不支持标准的 PWA 安装提示，但可以通过以下方式安装：

1. 打开网站
2. 点击底部的"分享"按钮
3. 选择"添加到主屏幕"

## 注意事项

- Service Worker 只在 HTTPS 或 localhost 环境下工作
- 生产环境需要 HTTPS 才能完整支持 PWA
- 图标文件必须存在，否则 PWA 可能无法正常工作
