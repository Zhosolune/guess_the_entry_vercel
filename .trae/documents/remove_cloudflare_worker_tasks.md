# 实施计划

- [ ] 1. 移除 Cloudflare Worker 相关文件
    - 删除 `docs/CLOUDFLARE_DEPLOYMENT.md`
    - 清理 `docs/ai_message.md` 中过时的部署信息（可选，仅标记）
- [ ] 2. 配置 Vercel Rewrites 和 Vite Proxy
    - 修改 `vercel.json` 添加 `/api/deepseek-proxy` 转发规则
    - 修改 `vite.config.ts` 添加本地开发代理
- [ ] 3. 更新设置 UI
    - 修改 `src/utils/storage.ts` 添加 API Key 的存储键
    - 修改 `src/components/SettingsDrawer.tsx` 添加 API Key 输入框
- [ ] 4. 重构 DeepSeek 服务
    - 修改 `src/services/deepseek.ts`
    - 实现 Prompt 构造逻辑
    - 实现直接 API 调用逻辑
    - 适配错误处理逻辑
- [ ] 5. 验证与测试
    - 本地测试 API 调用
    - 验证排除词条功能
    - 验证降级逻辑
