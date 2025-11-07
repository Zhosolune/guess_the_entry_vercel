import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ThemeContextValue, ThemeMode } from './types';

/**
 * ThemeContext：全局主题管理（支持系统偏好、持久化与无闪烁初始化）
 *
 * 功能描述：
 * - 管理主题模式（light/dark/system），并解析出实际展示主题
 * - 首次加载时读取 localStorage 并检测系统偏好
 * - 监听系统偏好变化（当模式为 system 时自动切换）
 * - 将解析后的主题类名添加到 `document.documentElement`，与 Tailwind `darkMode:"class"` 对齐
 * - 持久化用户选择到 localStorage，键为 `theme_mode`
 *
 * 无障碍：
 * - 上层组件的开关按钮可使用 role="switch"、aria-checked、aria-pressed，结合本 Context 状态
 */

const STORAGE_KEY = 'theme_mode';

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * 解析系统偏好为实际主题
 * @returns 'light' | 'dark'
 */
function getSystemTheme(): 'light' | 'dark' {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch (_) {
    return 'light';
  }
}

/**
 * ThemeProvider 组件：提供全局主题上下文
 *
 * @param children - React 子元素
 * @returns 包裹后的主题上下文 Provider
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as ThemeMode) || 'system';
    return saved;
  });

  const resolvedTheme = useMemo<'light' | 'dark'>(() => {
    if (mode === 'system') return getSystemTheme();
    return mode;
  }, [mode]);

  /**
   * 将解析后的主题类应用到 html 元素，保证样式与 Tailwind 的 dark 变体生效。
   */
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('light', 'dark');
    html.classList.add(resolvedTheme);
    // 暗色下明确 color-scheme，便于浏览器内置控件配色
    html.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  /**
   * 监听系统主题变化，仅在模式为 system 时更新。
   */
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (mode === 'system') {
        const next = media.matches ? 'dark' : 'light';
        const html = document.documentElement;
        html.classList.remove('light', 'dark');
        html.classList.add(next);
        html.style.colorScheme = next;
      }
    };
    try {
      media.addEventListener('change', handler);
      return () => media.removeEventListener('change', handler);
    } catch (_) {
      // 老浏览器兼容（不会影响现代环境）
      media.addListener?.(handler);
      return () => media.removeListener?.(handler);
    }
  }, [mode]);

  /**
   * 切换明暗主题（会将模式从 system 切换到具体模式）
   */
  const toggleTheme = (): void => {
    const next: ThemeMode = resolvedTheme === 'light' ? 'dark' : 'light';
    setMode(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  /**
   * 显式设置主题模式（含 system）
   */
  const setModeSafe = (next: ThemeMode): void => {
    setMode(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  const value: ThemeContextValue = {
    theme: resolvedTheme,
    mode,
    isDark: resolvedTheme === 'dark',
    toggleTheme,
    setMode: setModeSafe,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * 使用主题上下文的 Hook
 * @returns ThemeContextValue
 * @throws 当未在 ThemeProvider 内使用时抛错
 */
export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeContext 必须在 <ThemeProvider> 内使用');
  }
  return ctx;
}