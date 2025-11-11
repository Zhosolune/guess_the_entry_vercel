import React from 'react';

interface DesktopLayoutProps {
  children: React.ReactNode;
}

/**
 * 桌面端布局包装组件
 * 目前与移动端一致，但覆盖桌面端搜索栏高度变量为 64px；后续可在此扩展更宽的内容容器或多栏布局。
 *
 * 参数：
 * - children: React.ReactNode - 要渲染的内部内容块
 * 返回：React.ReactElement - 包裹后的布局结构
 * 异常：无
 */
export const DesktopLayout: React.FC<DesktopLayoutProps> = ({ children }) => {
  return (
    <div className="desktop-layout flex flex-col h-full overflow-hidden">{children}</div>
  );
};

DesktopLayout.displayName = 'DesktopLayout';