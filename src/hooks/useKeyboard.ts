import { useEffect, useCallback } from 'react';

/**
 * 键盘事件处理Hook
 * 处理游戏中的键盘输入事件
 */
export const useKeyboard = (onGuess: (char: string) => void) => {
  /**
   * 处理键盘事件
   */
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null;
    const tagName = target?.tagName?.toLowerCase() ?? '';
    const isEditable = target?.getAttribute('contenteditable') === 'true';

    // 在输入框/文本域/可编辑区域中不拦截，避免影响打字
    if (tagName === 'input' || tagName === 'textarea' || isEditable) {
      return;
    }

    // 中文输入法组合键时不拦截
    // 使用标准 KeyboardEvent 的 isComposing 进行组合输入检测
    if (event.isComposing) {
      return;
    }

    const key = event.key;
    
    // 忽略非字符键
    if (key.length !== 1) return;
    
    // 忽略控制键
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    
    // 只允许中文字符和英文字母
    const isValidChar = /[\u4e00-\u9fa5a-zA-Z]/.test(key);
    if (!isValidChar) return;
    
    // 转换为小写
    const char = key.toLowerCase();
    
    // 触发猜测
    onGuess(char);
  }, [onGuess]);

  /**
   * 绑定键盘事件
   */
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return {
    handleKeyPress
  };
};