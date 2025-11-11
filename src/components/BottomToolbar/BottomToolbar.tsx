import React, { memo, useCallback } from 'react';

interface BottomToolbarProps {
  /**
   * 提示按钮点击回调
   */
  onHintClick?: () => void;
  /**
   * 速查表按钮点击回调
   */
  onToggleQuickRef?: () => void;
  /**
   * 是否禁用按钮
   */
  disabled?: boolean;
}

/**
 * 底部工具按钮栏组件
 * 包含提示和速查表按钮，具有吸底效果
 * 高度固定，位于屏幕最下方
 */
export const BottomToolbar: React.FC<BottomToolbarProps> = memo(({
  onHintClick,
  onToggleQuickRef,
  disabled = false
}) => {
  /**
   * 处理提示按钮点击
   */
  const handleHintClick = useCallback(() => {
    if (onHintClick) {
      onHintClick();
    }
  }, [onHintClick]);

  /**
   * 处理速查表按钮点击
   */
  const handleQuickRefClick = useCallback(() => {
    if (onToggleQuickRef) {
      onToggleQuickRef();
    }
  }, [onToggleQuickRef]);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-surface)] px-4 h-[var(--bottombar-h)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-center items-center gap-6">
          <button
            type="button"
            aria-label="提示"
            title="提示"
            onClick={handleHintClick}
            disabled={disabled}
            className="inline-flex items-center p-0 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] focus:outline-none gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* 灯泡图标 */}
            <svg className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor">
              <path d="M11 24h10v2H11z"></path>
              <path d="M13 28h6v2h-6z"></path>
              <path d="M16 2A10 10 0 0 0 6 12a9.19 9.19 0 0 0 3.46 7.62c1 .93 1.54 1.46 1.54 2.38h2c0-1.84-1.11-2.87-2.19-3.86A7.2 7.2 0 0 1 8 12a8 8 0 0 1 16 0a7.2 7.2 0 0 1-2.82 6.14c-1.07 1-2.18 2-2.18 3.86h2c0-.92.53-1.45 1.54-2.39A9.18 9.18 0 0 0 26 12A10 10 0 0 0 16 2z"></path>
            </svg>
            提示
          </button>

          <button
            type="button"
            onClick={handleQuickRefClick}
            disabled={disabled}
            className="inline-flex items-center p-0 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] focus:outline-none gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            title="速查表"
            aria-label="速查表"
          >
            {/* 文档/记事本图标 */}
            <svg className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor">
              <path d="M26 2H8a2 2 0 0 0-2 2v4H4v2h2v5H4v2h2v5H4v2h2v4a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm0 26H8v-4h2v-2H8v-5h2v-2H8v-5h2V8H8V4h18z"></path>
              <path d="M14 8h8v2h-8z"></path>
              <path d="M14 15h8v2h-8z"></path>
              <path d="M14 22h8v2h-8z"></path>
            </svg>
            速查表
          </button>
        </div>
      </div>
    </div>
  );
});

// 添加显示名称用于调试
BottomToolbar.displayName = 'BottomToolbar';