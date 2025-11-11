import React, { useState, memo, useCallback } from 'react';
import { toast } from 'sonner';

interface SearchInputProps {
  /**
   * 输入框值
   */
  value: string;
  /**
   * 输入框值变化回调
   */
  onChange: (value: string) => void;
  /**
   * 表单提交回调
   */
  onSubmit: () => void;
  /**
   * 是否禁用输入
   */
  disabled?: boolean;
  /**
   * 是否显示提交按钮
   */
  showSubmitButton?: boolean;
}

/**
 * 搜索输入框组件
 * 处理用户输入和猜测提交
 * 保持与原有GameBoard中输入框相同的逻辑和样式
 */
export const SearchInput: React.FC<SearchInputProps> = memo(({
  value,
  onChange,
  onSubmit,
  disabled = false,
  showSubmitButton = true
}) => {
  /**
   * 处理输入框变化
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  /**
   * 处理表单提交
   */
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  }, [onSubmit]);

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed left-0 right-0 top-[calc(var(--topbar-h)+var(--infobar-h))] z-30 px-4 pt-3 bg-[var(--color-surface)] h-[var(--searchbar-h)]"
    >
      <div className="container mx-auto max-w-4xl">
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder="来猜~"
            className="form-input flex-1"
            disabled={disabled}
            autoFocus
          />
          {showSubmitButton && (
            <button
              type="submit"
              disabled={disabled || !value}
              className="btn-primary btn-compact-mobile"
            >
              确认
            </button>
          )}
        </div>
      </div>
    </form>
  );
});

// 添加显示名称用于调试
SearchInput.displayName = 'SearchInput';