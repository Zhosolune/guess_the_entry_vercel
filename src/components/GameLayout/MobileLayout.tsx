import React from 'react';

interface MobileLayoutProps {
  children: React.ReactNode;
}

/**
 * 移动端布局包装组件
 * 提供移动端友好的外层容器：纵向栈、全高、隐藏外层滚动，交由中间文本区滚动。
 *
 * 参数：
 * - children: React.ReactNode - 要渲染的内部内容块（信息栏、搜索、文本区、底部工具栏）
 * 返回：React.ReactElement - 包裹后的布局结构
 * 异常：无
 */
export const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-full ">{children}</div>
  );
};

MobileLayout.displayName = 'MobileLayout';