import { useThemeContext } from '../theme/ThemeContext';

/**
 * useTheme：向后兼容的主题 Hook
 *
 * 功能描述：
 * - 代理 ThemeContext，提供与旧版一致的返回结构
 * - 暴露 `theme`、`isDark` 与 `toggleTheme`
 *
 * 返回值说明：
 * - theme: 当前实际生效主题（light|dark）
 * - isDark: 是否暗色
 * - toggleTheme: 切换明暗主题
 */
export function useTheme() {
  const { theme, isDark, toggleTheme } = useThemeContext();
  return { theme, isDark, toggleTheme } as const;
}