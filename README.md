# 猜词条游戏 - 互动文字猜测游戏

一个基于React + TypeScript开发的互动文字猜测游戏，玩家需要通过输入汉字来揭示被遮盖的词条和百科内容。

## 🎮 游戏介绍

这是一个富有挑战性的文字游戏，玩家需要：
- 🎯 通过输入单个汉字进行猜测
- 🔍 揭示被遮盖的词条和百科内容
- ⚡ 在尽可能少的尝试次数和时间内完成游戏
- 📚 涵盖多个知识领域：自然、天文、地理、动漫、影视、游戏、体育、历史、ACGN等

## ✨ 核心功能

### 🎯 游戏机制
- **遮盖系统**：词条和百科内容初始被完全遮盖（显示为"■"）
- **智能猜测**：输入汉字后自动揭示所有匹配位置
- **坟场系统**：错误猜测的字符会被记录到"坟场"区域
- **胜利条件**：完全揭示词条内容即可获胜

### 📊 数据记录
- **实时计时**：精确到秒的游戏耗时
- **尝试统计**：记录总猜测次数
- **游戏汇总**：结束时显示完整数据统计
- **最佳记录**：保存最快完成时间和最少尝试次数

### 🎲 词条生成
- **多领域支持**：涵盖自然、天文、地理、动漫、影视、游戏、体育、历史、ACGN等领域
- **随机选项**：提供随机领域选择
- **API集成**：前端直接调用DeepSeek API（支持Vercel Rewrite解决CORS）
- **降级方案**：API不可用时使用本地预设词条

### 📱 移动端优化
- **响应式设计**：适配所有主流移动设备
- **触摸优化**：针对触摸操作优化的交互体验
- **字体适配**：确保文字大小在移动设备上清晰可读

### 🎨 视觉设计
- **现代界面**：清晰直观的游戏界面设计
- **状态区分**：不同状态的文字使用不同视觉样式
- **动画效果**：平滑的过渡动画增强用户体验
- **专业配色**：现代化的配色方案

## 🛠️ 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite
- **样式方案**：Tailwind CSS
- **状态管理**：React Hooks + useState
- **路由管理**：React Router DOM
- **UI组件**：Lucide React (图标) + Sonner (通知)
- **HTTP客户端**：Axios
- **错误处理**：自定义错误处理系统
- **数据存储**：localStorage (游戏状态持久化)

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0

### 配置环境变量

在项目根目录创建 `.env` 文件（参考 `.env.example`）：

```bash
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

**说明：**
- **本地开发**：`VITE_DEEPSEEK_API_KEY` 用于本地代理注入 Key。
- **线上部署**：需要在 Vercel 部署设置中添加 `DEEPSEEK_API_KEY` 环境变量。

### 安装依赖
```bash
npm install
```

### 开发环境
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```

### 代码检查
```bash
npm run check
```

## 📁 项目结构

```
src/
├── components/          # React组件
│   ├── GameBoard/      # 游戏主面板
│   ├── GameStart/      # 游戏开始界面
│   ├── Graveyard/      # 坟场组件
│   └── VictoryModal/   # 胜利弹窗
├── hooks/              # 自定义React Hooks
│   ├── useGameState.ts # 游戏状态管理
│   ├── useKeyboard.ts  # 键盘输入处理
│   └── useTimer.ts     # 计时器功能
├── services/           # 服务层
│   ├── deepseek.ts    # DeepSeek API服务
│   └── storage.ts     # 本地存储服务
├── types/             # TypeScript类型定义
│   └── game.types.ts  # 游戏相关类型
├── utils/             # 工具函数
│   └── errorHandler.ts # 错误处理工具
└── App.tsx           # 主应用组件
```

## 🔧 配置说明

### 环境变量
创建 `.env` 文件并配置以下变量：

```env
# DeepSeek API配置（通过Cloudflare Worker代理）
VITE_API_BASE_URL=https://your-worker.your-subdomain.workers.dev
```

### API配置
项目使用Cloudflare Worker作为代理来调用DeepSeek API，需要在worker中实现以下端点：

- `POST /api/generate-entry` - 生成词条
- `GET /api/health` - 健康检查

## 🎯 游戏流程

1. **选择领域**：玩家选择知识领域或随机选项
2. **生成词条**：系统生成该领域的词条和百科内容
3. **开始游戏**：词条内容被完全遮盖，显示为"■"
4. **输入猜测**：玩家输入单个汉字进行猜测
5. **揭示内容**：如果词条或百科中包含该字，则揭示所有匹配位置
6. **记录错误**：如果不包含，将字符添加到坟场
7. **胜利检测**：当词条内容完全揭示时判定胜利
8. **数据统计**：显示游戏耗时、尝试次数等统计信息

## 🛡️ 错误处理

项目实现了完善的错误处理机制：

- **网络错误**：自动重试机制，失败后使用降级方案
- **API错误**：详细的错误分类和用户友好的提示
- **输入验证**：严格的输入格式和字符验证
- **存储错误**：localStorage异常处理
- **降级方案**：API不可用时使用本地预设词条

## 📱 部署说明

### Cloudflare Pages 部署 (推荐) ⭐
**免费 + 自动部署 + 国内高速访问**

- 📖 [完整部署指南](./docs/CLOUDFLARE_DEPLOYMENT.md) - 详细步骤和配置说明
- 🚀 [快速开始](./docs/DEPLOYMENT_QUICK_START.md) - 5 分钟快速部署

**优势**:
- ✅ 完全免费,无限带宽
- ✅ 国内访问速度极佳
- ✅ GitHub 自动部署
- ✅ 全球 CDN 加速

### Vercel 部署
1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量
3. 自动部署设置

### 其他平台
支持任何静态文件托管服务，构建后的文件在 `dist/` 目录中。

## 🔍 开发指南

### 代码规范
- 使用TypeScript进行类型安全的开发
- 遵循React Hooks最佳实践
- 组件保持单一职责原则
- 使用函数式组件和自定义Hooks

### 性能优化
- 使用React.memo进行组件记忆化
- 使用useMemo和useCallback优化渲染
- 实现错误边界处理
- 优化移动端性能

### 测试建议
- 测试不同领域的词条生成
- 验证移动端适配性
- 测试网络异常情况
- 验证游戏状态持久化

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

## 🎮 游戏截图

*游戏界面截图将在这里展示*

---

**享受游戏吧！🎯**

## 🎨 主题系统

- 基础：Tailwind 配置为 `darkMode: "class"`，通过在 `html` 添加 `dark` 类启用暗色模式。
- 设计令牌：在 `theme.config.js` 中集中管理颜色、半径、动效等设计令牌；CSS 根变量在 `src/index.css` 的 `@layer base` 中定义。
- 变量命名：
  - `--color-surface` 页面与卡片背景
  - `--color-border` 边框与分隔线
  - `--color-text` 正文文字
  - `--color-text-muted` 次级文字
  - `--color-primary` 主题主色（含 `hover/active` 变量）
- 初始加载：`index.html` 内置了预渲染前的主题初始化脚本，基于 `localStorage` 与系统偏好，避免闪烁。
- 全局状态：`src/theme/ThemeContext.tsx` 提供 `ThemeProvider` 与 `useThemeContext`；现有 `src/hooks/useTheme.ts` 兼容透传。
- 使用示例：
  - 组件：用 `text-[var(--color-text)]`、`bg-[var(--color-surface)]`、`border-[var(--color-border)]` 等替代 `text-gray-*`。
  - 按钮：使用 `.btn-primary`、`.btn-flat`、`.btn-secondary`（均基于变量）。
  - 切换：在需要的地方调用 `const { isDark, toggleTheme } = useTheme();`
- 系统偏好：优先使用用户设置（localStorage 保存），未设置时自动跟随系统；用户切换后立即覆盖系统偏好。
- 无障碍：主题切换按钮使用 `role="switch"` 与 `aria-checked`，确保可访问性。

### 自定义主题
- 修改 `theme.config.js` 的设计令牌后，`index.css` 根变量会统一生效。
- 若需新增变量，优先在 `@layer base` 下添加并在组件中使用 `var(--...)` 引用。

### 注意事项
- 避免在组件中使用硬编码的灰度类（如 `text-gray-600`），统一改用变量驱动。
- 暗色模式下样式通过 `html.dark` 根变量生效，不再需要组件级 `@apply` 覆盖。