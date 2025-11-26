# 需求文档 - 移除 Cloudflare Worker 并实现前端直连 DeepSeek

## 介绍

本项目目前依赖 Cloudflare Worker 作为后端代理来调用 DeepSeek API。为了简化架构和部署流程，需要移除 Cloudflare Worker，改为前端直接调用 DeepSeek API（通过 Vercel Rewrite 解决跨域问题），并允许用户自定义 API Key。

## 需求

### 需求 1 - 移除 Cloudflare Worker 相关内容

**用户故事：** 作为开发者，我希望移除项目中所有关于 Cloudflare Worker 的文档和配置，以免混淆。

#### 验收标准
1. 删除 `docs/CLOUDFLARE_DEPLOYMENT.md` 文件。
2. 检查并移除其他文档中关于 Cloudflare Worker 的提及。
3. 移除代码中默认的 Worker URL 配置。

### 需求 2 - 支持用户自定义 API Key

**用户故事：** 作为玩家，我希望在设置界面输入我的 DeepSeek API Key，以便游戏能正常生成词条。

#### 验收标准
1. 在“设置”抽屉（SettingsDrawer）中增加“API 设置”区域。
2. 提供一个输入框用于输入 DeepSeek API Key。
3. API Key 需要持久化存储（LocalStorage），并注意安全性（掩码显示）。
4. 支持通过环境变量 `VITE_DEEPSEEK_API_KEY` 提供默认 Key。

### 需求 3 - 前端直接调用 DeepSeek API

**用户故事：** 作为系统，应当直接（或通过轻量级转发）调用 DeepSeek 官方 API，而不是通过专有的 Worker 服务。

#### 验收标准
1. 重构 `src/services/deepseek.ts`。
2. 使用 OpenAI 兼容格式调用 DeepSeek API (`/chat/completions`)。
3. 构造 Prompt 以生成符合游戏要求的 JSON 数据。
4. 使用 Vercel Rewrite 机制解决浏览器 CORS 问题。
5. 保持原有的错误处理和降级机制（当 API 调用失败时使用本地词条）。

### 需求 4 - 更新部署配置

**用户故事：** 作为开发者，我希望部署配置能自动处理 API 转发。

#### 验收标准
1. 更新 `vercel.json`，配置指向 `https://api.deepseek.com` 的 Rewrite 规则。
