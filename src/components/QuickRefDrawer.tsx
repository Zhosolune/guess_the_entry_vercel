import React from 'react';
import { Graveyard } from './Graveyard/Graveyard';
import CorrectPanel from './CorrectPanel/CorrectPanel';

export interface QuickRefDrawerProps {
  /** 是否显示抽屉 */
  isOpen: boolean;
  /** 关闭抽屉回调 */
  onClose: () => void;
  /** 坟场数据（错误字符列表） */
  graveyard: string[];
  /** 已猜对字符集合 */
  guessedChars: Set<string>;
}

/**
 * 速查表抽屉组件
 * 
 * 功能描述：
 * - 以抽屉形式显示“坟场”与“已猜对字符”两块内容；默认隐藏，通过按钮或关闭图标切换。
 * 
 * 参数说明：
 * - isOpen: 是否显示抽屉。
 * - onClose: 关闭抽屉的回调函数。
 * - graveyard: 传入坟场的错误字符数组。
 * - guessedChars: 传入已猜对字符的集合。
 * 
 * 返回值说明：
 * - React 元素，用于呈现底部抽屉；当未打开时仍渲染但通过 transform 隐藏。
 * 
 * 异常说明：
 * - 本组件不抛出异常；交互错误通过控制台输出或父组件处理。
 */
export const QuickRefDrawer: React.FC<QuickRefDrawerProps> = ({ isOpen, onClose, graveyard, guessedChars }) => {
  /**
   * 关闭按钮点击处理
   * 
   * 功能描述：
   * - 在触发关闭前主动移除当前按钮焦点，避免后续容器设置 `aria-hidden` 时其后代仍保留焦点引发可访问性告警。
   * 
   * 参数说明：
   * - e: 鼠标点击事件对象，类型为 React.MouseEvent<HTMLButtonElement>。
   * 
   * 返回值说明：
   * - 无返回值（void）。
   * 
   * 异常说明：
   * - 本函数不抛出异常；如出现异常将被忽略，不影响 `onClose` 的执行。
   */
  const handleCloseClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    try {
      // 先移除关闭按钮的焦点，避免 aria-hidden 与保留焦点冲突
      e.currentTarget.blur();
    } catch {
      // 忽略可能的运行时异常
    }
    onClose();
  };
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-hidden={!isOpen}
      className={`fixed bottom-0 inset-x-0 z-40 transform transition-transform duration-200 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div className="bg-[var(--color-bg-card)] border-t border-[var(--color-border)] shadow-lg">
        <div className="flex items-center justify-between px-4 py-2">
          <h2 className="text-sm font-medium text-[var(--color-text)]">速查表</h2>
          <button
            type="button"
            aria-label="关闭速查表"
            title="关闭"
            onClick={handleCloseClick}
            className="inline-flex items-center p-2 text-[var(--color-text)] hover:text-[var(--color-primary)] focus:outline-none"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 内容区：滚动容器（提升 PC 端高度） */}
        <div className="max-h-[65vh] md:max-h-[75vh] overflow-y-auto py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Graveyard graveyard={graveyard} />
            <CorrectPanel guessedChars={guessedChars} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickRefDrawer;