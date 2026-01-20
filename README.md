# PicProcessor - 在线图片处理器

PicProcessor 是一个纯前端的在线图片处理工具，旨在为用户提供安全、快捷、免费的图片处理服务。所有图片处理逻辑均在浏览器本地完成，无需上传至服务器，充分保护用户隐私。

## ✨ 主要功能

- **格式转换**：支持 JPG, PNG, WebP 格式之间的相互转换。
- **图片压缩**：高效的图片压缩算法，在保持画质的同时大幅减小文件体积。
- **批量处理**：支持拖拽上传多张图片，一键批量转换/压缩。
- **隐私安全**：纯前端实现，所有操作在本地进行，数据不上云。
- **深色模式**：完美适配深色模式，提供舒适的视觉体验。
- **预览功能**：支持处理前后效果对比，支持下载前预览。

## 🛠️ 技术栈

- **框架**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **构建工具**: [Vite](https://vitejs.dev/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **UI 组件**: [Radix UI](https://www.radix-ui.com/) (Headless UI) + [Lucide React](https://lucide.dev/) (Icons)
- **图片处理**: [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression)

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-username/wewbImage.git
cd wewbImage
```

### 2. 安装依赖

```bash
npm install
# 或者
yarn install
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173` 即可查看项目。

## 📦 构建与部署

### 构建生产版本

```bash
npm run build
```

构建完成后，生成的静态文件位于 `dist` 目录中。

### 部署

由于是纯静态网站，您可以将其部署到任何静态网站托管服务，如：

- **Nginx**: 将 `dist` 目录内容上传至服务器，并配置 Nginx 指向该目录。
- **Vercel / Netlify / GitHub Pages**: 直接连接代码仓库即可自动部署。

#### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name picprocessor.ztztb.cn;

    location / {
        root /usr/share/nginx/html; # 指向 dist 目录
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}
```

## 📝 备案信息

如果您计划部署在中国大陆的服务器上，请确保完成以下备案：

1. **ICP 备案**: 必需，联系您的云服务商进行备案。
2. **公安联网备案**: 必需，ICP 备案通过后 30 天内完成。

请在 `src/components/Footer.tsx` 中更新您的备案号信息。

## 📄 许可证

MIT License © 2024 HarmonyOS 万少
