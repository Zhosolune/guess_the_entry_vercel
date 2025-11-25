# 快速部署指南

> 5 分钟快速部署到 Cloudflare Pages

## 🚀 快速开始

### 1️⃣ 准备工作 (1 分钟)

```bash
# 确保代码已推送到 GitHub
git add .
git commit -m "准备部署"
git push origin main
```

### 2️⃣ 部署 Worker API (2 分钟)

```bash
# 进入 cloudflare 目录
cd cloudflare

# 安装依赖
npm install

# 部署到 Cloudflare Workers
npx wrangler deploy

# 复制输出的 Worker URL,例如:
# https://guess-game-api-prod.your-subdomain.workers.dev
```

### 3️⃣ 部署前端网站 (2 分钟)

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 点击 **Workers & Pages** → **Create application** → **Pages**
3. 连接 GitHub 仓库 `guess_the_entry_web`
4. 配置构建设置:

| 配置项 | 值 |
|--------|-----|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Environment variable | `NODE_VERSION` = `18` |
| Environment variable | `VITE_API_BASE_URL` = `你的Worker URL` |

5. 点击 **Save and Deploy**

### 4️⃣ 完成! 🎉

等待 2-3 分钟,你的网站就部署好了!

访问: `https://guess-the-entry-web.pages.dev`

---

## 📝 配置摘要

### Worker 部署命令
```bash
cd cloudflare
npx wrangler deploy
```

### Pages 环境变量
```bash
NODE_VERSION=18
VITE_API_BASE_URL=https://your-worker.workers.dev
```

### 自动部署
推送代码到 GitHub → 自动部署 ✅

---

## ❓ 遇到问题?

查看 [完整部署文档](./CLOUDFLARE_DEPLOYMENT.md)

---

**就是这么简单! 🚀**
