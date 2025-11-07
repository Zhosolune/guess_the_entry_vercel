/**
 * 主题系统类型定义
 */

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
  /** 当前展示的主题（解析 system 后的实际值） */
  theme: 'light' | 'dark';
  /** 当前模式：light/dark/system */
  mode: ThemeMode;
  /** 是否暗色主题（基于解析后的实际值） */
  isDark: boolean;
  /** 切换明暗主题（不影响 system 监听） */
  toggleTheme: () => void;
  /** 设置主题模式（支持 system） */
  setMode: (mode: ThemeMode) => void;
}