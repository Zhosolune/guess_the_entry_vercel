import { useEffect, useMemo, useState } from 'react';

/**
 * 设备画像检测 Hook
 * 综合视口尺寸、交互能力（触控/悬停）与 UA Client Hints，输出稳定的移动端判定。
 *
 * 参数：无
 * 返回：
 * - isMobile: 是否判定为移动形态（小视口 或 触控无悬停 或 UA-CH 提示为移动端）
 * - isSmallViewport: 视口是否小于等于 768px
 * - hasTouch: 是否存在触控点（maxTouchPoints>0）
 * - noHover: 是否不支持悬停（any-hover:none）
 * - uaMobile: UA Client Hints 提示是否为移动端（Chromium）
 *
 * 异常：无（在不支持 matchMedia 的环境下，相关能力标志按默认 false 处理）
 */
export function useDeviceProfile(): {
  isMobile: boolean;
  isSmallViewport: boolean;
  hasTouch: boolean;
  noHover: boolean;
  uaMobile: boolean;
} {
  const [isSmallViewport, setIsSmallViewport] = useState<boolean>(() => typeof window !== 'undefined' ? window.matchMedia('(max-width: 767.98px)').matches : false);
  const [noHover, setNoHover] = useState<boolean>(() => typeof window !== 'undefined' ? window.matchMedia('(any-hover: none)').matches : false);
  const [hasTouch, setHasTouch] = useState<boolean>(() => typeof navigator !== 'undefined' ? navigator.maxTouchPoints > 0 : false);
  const [uaMobile, setUaMobile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mqlWidth = window.matchMedia('(max-width: 767.98px)');
    const mqlHover = window.matchMedia('(any-hover: none)');

    const onWidth = (e: MediaQueryListEvent) => setIsSmallViewport(e.matches);
    const onHover = (e: MediaQueryListEvent) => setNoHover(e.matches);

    mqlWidth.addEventListener('change', onWidth);
    mqlHover.addEventListener('change', onHover);

    const onTouchPoints = () => setHasTouch(typeof navigator !== 'undefined' ? navigator.maxTouchPoints > 0 : false);
    window.addEventListener('pointerdown', onTouchPoints, { once: true });

    try {
      const uad: any = (navigator as any).userAgentData;
      if (uad && typeof uad.mobile === 'boolean') {
        setUaMobile(uad.mobile);
      }
    } catch {
      // ignore
    }

    return () => {
      mqlWidth.removeEventListener('change', onWidth);
      mqlHover.removeEventListener('change', onHover);
    };
  }, []);

  const isMobile = useMemo<boolean>(() => {
    return isSmallViewport || (hasTouch && noHover) || uaMobile;
  }, [isSmallViewport, hasTouch, noHover, uaMobile]);

  return { isMobile, isSmallViewport, hasTouch, noHover, uaMobile };
}