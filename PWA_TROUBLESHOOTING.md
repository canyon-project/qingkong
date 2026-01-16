# PWA 安装问题排查指南

## 手机无法安装 PWA 的常见原因

### 1. iOS Safari（iPhone/iPad）

**问题**：iOS Safari 不支持标准的 PWA 安装提示

**解决方案**：
1. 打开网站
2. 点击底部的"分享"按钮（方框+箭头图标）
3. 向下滚动，找到"添加到主屏幕"
4. 点击"添加到主屏幕"
5. 确认添加

**注意**：
- iOS Safari 不会显示自动安装提示
- 必须手动通过分享菜单添加
- 已添加的 PWA 会以独立应用模式运行

### 2. Android Chrome

**问题**：可能没有显示安装提示

**解决方案**：
1. 等待安装提示弹窗出现（通常在访问几次后）
2. 或者点击浏览器菜单（三个点）
3. 选择"添加到主屏幕"或"安装应用"

**检查清单**：
- ✅ 网站必须使用 HTTPS（localhost 除外）
- ✅ manifest.json 必须可访问
- ✅ Service Worker 必须注册成功
- ✅ 图标文件必须存在

### 3. HTTPS 要求

**问题**：PWA 需要 HTTPS（生产环境）

**解决方案**：
- 开发环境：localhost 可以使用 HTTP
- 生产环境：必须使用 HTTPS
- 可以使用 Let's Encrypt 免费 SSL 证书

### 4. Manifest.json 问题

**检查项**：
- ✅ 文件路径：`/manifest.json`
- ✅ 文件格式：有效的 JSON
- ✅ 包含必需的字段：name, icons, start_url
- ✅ 图标路径正确

**测试方法**：
在浏览器中访问：`https://你的域名/manifest.json`

### 5. Service Worker 问题

**检查项**：
- ✅ 文件路径：`/sw.js`
- ✅ 文件可访问
- ✅ 注册成功（查看浏览器控制台）

**测试方法**：
1. 打开浏览器开发者工具
2. 查看 Application > Service Workers
3. 应该看到 Service Worker 已注册

### 6. 图标文件问题

**检查项**：
- ✅ `icon-192.png` 存在
- ✅ `icon-512.png` 存在
- ✅ 文件可访问
- ✅ 文件格式正确（PNG）

**测试方法**：
在浏览器中访问：
- `https://你的域名/icon-192.png`
- `https://你的域名/icon-512.png`

## 调试步骤

### 1. 检查浏览器控制台

打开开发者工具，查看是否有错误：
- Service Worker 注册错误
- Manifest 加载错误
- 图标加载错误

### 2. 检查 Application 面板

Chrome DevTools > Application：
- **Manifest**：查看 manifest 是否正确加载
- **Service Workers**：查看 Service Worker 状态
- **Storage**：查看缓存情况

### 3. 测试 PWA 安装条件

使用 Chrome DevTools > Lighthouse：
- 运行 PWA 审计
- 查看哪些条件未满足

## 常见错误

### "Manifest 无法加载"
- 检查 manifest.json 路径
- 检查 JSON 格式是否正确
- 检查服务器配置

### "Service Worker 注册失败"
- 检查 sw.js 文件路径
- 检查文件权限
- 检查 HTTPS（生产环境）

### "图标无法加载"
- 检查图标文件是否存在
- 检查文件路径是否正确
- 检查文件格式

## 快速测试

### 开发环境
```bash
pnpm dev
```
访问：`http://localhost:3000`

### 生产环境
```bash
pnpm build
pnpm start
```
访问：`https://你的域名`

## 各平台支持情况

| 平台 | 浏览器 | 支持情况 |
|------|--------|----------|
| iOS | Safari | ✅ 支持（需手动添加） |
| iOS | Chrome | ❌ 不支持 |
| Android | Chrome | ✅ 完全支持 |
| Android | Firefox | ✅ 支持 |
| Android | Samsung Internet | ✅ 支持 |
| Desktop | Chrome | ✅ 完全支持 |
| Desktop | Edge | ✅ 完全支持 |

## 需要帮助？

如果以上方法都无法解决问题，请检查：
1. 浏览器版本是否过旧
2. 是否在 HTTPS 环境下（生产环境）
3. 浏览器控制台的错误信息
4. Network 面板中的资源加载情况
