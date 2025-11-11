import React, { memo } from 'react';

interface GameInfoBarProps {
  /**
   * 游戏时间（格式化后的字符串）
   */
  formattedTime: string;
  /**
   * 尝试次数
   */
  attempts: number;
  /**
   * 游戏进度百分比
   */
  gameProgress: number;
}

/**
 * 游戏信息栏组件
 * 显示游戏状态信息：时间、尝试次数、进度百分比
 * 高度固定，位于顶部栏下方
 */
export const GameInfoBar: React.FC<GameInfoBarProps> = memo(({ 
  formattedTime,
  attempts,
  gameProgress
}) => {
  return (
    <div className="fixed left-0 right-0 top-[var(--topbar-h)] z-40 bg-[var(--color-surface)] px-4 py-1 h-[var(--infobar-h)]">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-center gap-6 text-sm text-[var(--color-text-muted)]">
          <div className="flex items-center gap-1">
            <span className="font-medium">时间:</span>
            <span className="">{formattedTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">尝试:</span>
            <span className="">{attempts}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">进度:</span>
            <span className="">{gameProgress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
});

// 添加显示名称用于调试
GameInfoBar.displayName = 'GameInfoBar';