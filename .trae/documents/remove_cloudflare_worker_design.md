# 设计文档 - 移除 Cloudflare Worker 并实现前端直连 DeepSeek

## 架构设计

### 核心变更
从“后端代理模式”迁移到“前端直连模式（配合 Vercel Rewrite）”。

- **旧架构**：前端发送业务参数 -> Cloudflare Worker (组装 Prompt, 持有 Key) -> DeepSeek
- **新架构**：前端 (组装 Prompt, 持有 Key) -> Vercel Rewrite (解决 CORS) -> DeepSeek

### 模块设计

#### 1. API 代理配置 (vercel.json)
为了绕过浏览器对 DeepSeek API 的 CORS 限制，利用 Vercel 的 Rewrite 功能。
```json
{
  "rewrites": [
    { "source": "/api/deepseek-proxy/(.*)", "destination": "https://api.deepseek.com/$1" },
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

#### 2. 前端服务层 (src/services/deepseek.ts)
重写 `generateEntry` 方法：
1. **获取配置**：从 `localStorage` 或环境变量读取 `apiKey`。
2. **构造 Prompt**：
   - System: 定义角色（猜词游戏出题官），输出格式（JSON）。
   - User: 指定领域、排除词条、语言要求。
3. **发起请求**：
   - URL: `/api/deepseek-proxy/chat/completions` (开发环境需配置 Vite proxy)
   - Headers: `Authorization: Bearer <KEY>`
   - Body: 
     ```json
     {
       "model": "deepseek-chat",
       "messages": [...],
       "response_format": { "type": "json_object" }
     }
     ```
4. **响应处理**：解析 JSON 字符串，验证字段，转换为 `ApiResponse`。

#### 3. 状态与 UI (src/components/SettingsDrawer.tsx)
- 新增 `apiKey` 状态管理。
- 在设置面板添加输入框，支持查看/隐藏 Key。
- 添加说明：“您的 Key 仅存储在本地浏览器中，直接用于请求 DeepSeek API。”

### Prompt 设计

**System Prompt:**
```text
你是一个中文猜词游戏的出题官。请根据用户指定的“领域”生成一个词条（Entry）和一段简短的百科解释（Encyclopedia）。
要求：
1. 返回格式必须为标准 JSON，不要包含 Markdown 代码块标记。
2. JSON 结构：
{
  "entry": "词条名（不含标点）",
  "encyclopedia": "百科解释（50-100字，不能包含词条名本身，用'它'代替）",
  "metadata": {
    "category": "领域英文名",
    "difficulty": "easy/medium/hard"
  }
}
3. 词条应当是该领域内广为人知的概念或事物。
4. 排除列表中的词条不要再次生成。
```

**User Prompt:**
```text
领域：{category}
排除词条：{excludedEntries}
请生成一个新的词条。
```

## 安全性考量
- API Key 存储在 LocalStorage，不上传到任何服务器（除了转发给 DeepSeek）。
- 提示用户 Key 的使用范围。

## 开发环境配置
在 `vite.config.ts` 中配置代理，以便本地开发也能通过 `/api/deepseek-proxy` 访问。
