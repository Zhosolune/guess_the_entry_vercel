# Cloudflare Pages 部署指南

本文档详细介绍如何将「猜词条游戏」部署到 Cloudflare Pages,实现免费托管、自动部署和国内高速访问。

## 📋 目录

- [前置准备](#前置准备)
- [部署步骤](#部署步骤)
- [环境变量配置](#环境变量配置)
- [自定义域名](#自定义域名可选)
- [常见问题](#常见问题)
- [后续更新](#后续更新)

---

## 🎯 前置准备

### 1. 账号准备
- ✅ **Cloudflare 账号**: 访问 [cloudflare.com](https://dash.cloudflare.com/sign-up) 注册(免费)
- ✅ **GitHub 账号**: 确保你的代码已推送到 GitHub 仓库

### 2. 确认项目状态
确保你的项目:
- ✅ 已推送到 GitHub 仓库
- ✅ 包含 `package.json` 和构建脚本
- ✅ 本地构建测试通过

```bash
# 本地测试构建
npm install
npm run build

# 确认 dist 目录生成成功
ls dist
```

---

## 🚀 部署步骤

### 步骤 1: 登录 Cloudflare Dashboard

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 使用你的账号登录
3. 在左侧菜单中找到 **Workers & Pages**

![Cloudflare Dashboard](https://developers.cloudflare.com/assets/pages-home_hu4e148242e0c3e7c2d2740f8a98d0bacd_367763_1999x1123_resize_q75_box-1f86072d.jpg)

---

### 步骤 2: 创建 Pages 项目

1. 点击 **Create application** 按钮
2. 选择 **Pages** 标签
3. 点击 **Connect to Git**

![Create Pages](https://developers.cloudflare.com/assets/pages-create_hu9c2c24b8c3e7d8e8c8c8c8c8c8c8c8c8_123456_1999x1123_resize_q75_box.jpg)

---

### 步骤 3: 连接 GitHub 仓库

1. 选择 **GitHub** 作为 Git 提供商
2. 授权 Cloudflare 访问你的 GitHub 账号
3. 在仓库列表中找到 `guess_the_entry_web` (或你的仓库名)
4. 点击 **Begin setup**

> **提示**: 如果看不到仓库,点击 **Configure GitHub** 重新授权

---

### 步骤 4: 配置构建设置

在 **Set up builds and deployments** 页面,填写以下信息:

#### 基本设置
- **Project name**: `guess-the-entry-web` (或自定义名称)
- **Production branch**: `main` (或 `master`,根据你的主分支名称)

#### 构建设置
| 配置项 | 值 |
|--------|-----|
| **Framework preset** | 选择 `Vite` (或 `None` 手动配置) |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` (保持默认) |

#### 环境变量 (重要!)
点击 **Add variable** 添加以下环境变量:

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NODE_VERSION` | `18` | Node.js 版本 |
| `VITE_API_BASE_URL` | `https://your-worker.workers.dev` | 你的 Cloudflare Worker API 地址 |

> **⚠️ 重要**: 将 `VITE_API_BASE_URL` 替换为你实际的 Cloudflare Worker 地址!

![Build Settings](https://developers.cloudflare.com/assets/pages-build-settings_hu123456_1999x1123_resize_q75_box.jpg)

---

### 步骤 5: 开始部署

1. 检查所有配置是否正确
2. 点击 **Save and Deploy** 按钮
3. 等待构建完成(通常需要 2-5 分钟)

你会看到构建日志实时输出:
```
Cloning repository...
Installing dependencies...
Running build command...
Deploying to Cloudflare's global network...
✅ Success! Deployed to https://guess-the-entry-web.pages.dev
```

---

### 步骤 6: 访问你的网站

部署成功后,你会获得一个 Cloudflare Pages 域名:
```
https://guess-the-entry-web.pages.dev
```

🎉 **恭喜!你的网站已经上线了!**

---

## 🔧 环境变量配置

### 查看/修改环境变量

1. 进入你的 Pages 项目
2. 点击 **Settings** 标签
3. 找到 **Environment variables** 部分
4. 可以为不同环境配置不同的变量:
   - **Production**: 生产环境(主分支)
   - **Preview**: 预览环境(其他分支/PR)

### 必需的环境变量

```bash
# Node.js 版本
NODE_VERSION=18

# API 基础 URL (替换为你的实际地址)
VITE_API_BASE_URL=https://guess-game-api-prod.your-subdomain.workers.dev
```

### 获取 Cloudflare Worker 地址

如果你还没有部署 Cloudflare Worker:

1. 进入 `cloudflare` 目录
2. 运行部署命令:
```bash
cd cloudflare
npm install
npx wrangler deploy
```
3. 部署成功后会显示 Worker URL,复制这个 URL 作为 `VITE_API_BASE_URL`

---

## 🌐 自定义域名(可选)

### 添加自定义域名

1. 在 Pages 项目中,点击 **Custom domains** 标签
2. 点击 **Set up a custom domain**
3. 输入你的域名(例如: `game.yourdomain.com`)
4. 按照提示添加 DNS 记录

### DNS 配置

如果你的域名在 Cloudflare:
- 系统会自动添加 DNS 记录
- 等待几分钟即可生效

如果域名在其他服务商:
- 添加 CNAME 记录指向 `guess-the-entry-web.pages.dev`
- 等待 DNS 传播(可能需要几小时)

---

## 🔄 后续更新

### 自动部署

配置完成后,每次你向 GitHub 推送代码:

1. **推送到主分支** → 自动部署到生产环境
2. **推送到其他分支** → 自动创建预览部署
3. **创建 Pull Request** → 自动生成预览链接

```bash
# 本地开发完成后
git add .
git commit -m "feat: 添加新功能"
git push origin main

# Cloudflare Pages 会自动检测并部署!
```

### 查看部署历史

1. 进入 Pages 项目
2. 点击 **Deployments** 标签
3. 查看所有部署记录和状态

### 回滚到之前的版本

1. 在 **Deployments** 页面找到要回滚的版本
2. 点击 **...** 菜单
3. 选择 **Rollback to this deployment**

---

## ❓ 常见问题

### Q1: 构建失败怎么办?

**检查构建日志**:
1. 进入 **Deployments** 标签
2. 点击失败的部署
3. 查看详细错误信息

**常见原因**:
- ❌ Node 版本不匹配 → 设置 `NODE_VERSION=18`
- ❌ 依赖安装失败 → 检查 `package.json`
- ❌ 构建命令错误 → 确认 `npm run build` 可用
- ❌ 环境变量缺失 → 检查 `VITE_API_BASE_URL`

### Q2: 网站可以访问,但 API 调用失败?

**检查环境变量**:
```bash
# 确保 VITE_API_BASE_URL 配置正确
# 在浏览器控制台检查:
console.log(import.meta.env.VITE_API_BASE_URL)
```

**检查 Worker 状态**:
1. 访问你的 Worker URL
2. 测试 `/api/health` 端点
3. 确认 Worker 正常运行

### Q3: 国内访问速度慢?

Cloudflare Pages 在国内访问通常很快,如果遇到速度问题:

1. **检查 DNS**: 使用 `114.114.114.114` 或 `223.5.5.5`
2. **清除缓存**: 在 Pages 设置中清除缓存
3. **使用自定义域名**: 可能比 `.pages.dev` 更快

### Q4: 如何查看访问统计?

1. 进入 Pages 项目
2. 点击 **Analytics** 标签
3. 查看访问量、带宽等数据

### Q5: 预览部署的 URL 是什么?

每个分支和 PR 都会生成唯一的预览 URL:
```
https://<commit-hash>.guess-the-entry-web.pages.dev
```

在 PR 评论中会自动显示预览链接。

---

## 🎯 部署检查清单

部署前确认:
- [ ] GitHub 仓库已推送最新代码
- [ ] 本地 `npm run build` 测试通过
- [ ] Cloudflare Worker 已部署并获取 URL
- [ ] 已准备好 Cloudflare 账号

部署时配置:
- [ ] 选择正确的 GitHub 仓库
- [ ] 构建命令设置为 `npm run build`
- [ ] 输出目录设置为 `dist`
- [ ] 添加 `NODE_VERSION=18` 环境变量
- [ ] 添加 `VITE_API_BASE_URL` 环境变量

部署后验证:
- [ ] 网站可以正常访问
- [ ] 游戏功能正常(选择领域、开始游戏)
- [ ] API 调用成功(检查浏览器控制台)
- [ ] 移动端显示正常
- [ ] 国内访问速度满意

---

## 📚 相关资源

- [Cloudflare Pages 官方文档](https://developers.cloudflare.com/pages/)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [项目 README](../README.md)

---

## 🆘 需要帮助?

如果遇到问题:
1. 查看 [Cloudflare Community](https://community.cloudflare.com/)
2. 检查 [GitHub Issues](https://github.com/Zhosolune/guess_the_entry/issues)
3. 联系项目维护者

---

**祝你部署顺利! 🚀**

如果部署成功,别忘了分享你的网站链接! 🎉
