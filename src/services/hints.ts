import { EntryData } from '../types/game.types';

export type HintType = 'message' | 'character' | 'position';

export interface Hint {
  /** 提示类型 */
  type: HintType;
  /** 文案提示（可选） */
  message?: string;
  /** 被建议的字符列表（可选） */
  revealedChars?: string[];
}

export interface HintContext {
  /** 当前词条数据 */
  entryData: EntryData;
  /** 已猜测字符集合 */
  guessedChars: Set<string>;
  /** 已揭示字符集合 */
  revealedChars: Set<string>;
  /** 当前尝试次数 */
  attempts: number;
}

export interface HintService {
  /**
   * 获取提示信息
   * @param context 提示上下文
   * @returns 提示结果
   */
  getHint(context: HintContext): Promise<Hint>;
}

/**
 * 请求提示（占位实现）
 *
 * 功能描述：
 * - 根据当前上下文返回一个占位提示，用于后续替换为真实策略或服务调用。
 *
 * 参数说明：
 * - context: HintContext 提示所需的上下文信息（词条、集合、次数）。
 *
 * 返回值说明：
 * - Promise<Hint> 返回一个基础的文案提示，暂不包含具体字符揭示。
 *
 * 异常说明：
 * - 本实现不主动抛出异常；如需要，可在未来接入时抛出网络或业务异常。
 */
export async function requestHint(context: HintContext): Promise<Hint> {
  const { entryData, attempts } = context;
  const title = entryData.entry.slice(0, 1);
  // 最小可用占位：根据尝试次数给出不同语气的文案
  const message = attempts < 3
    ? `提示功能待实现，可先关注首字“${title}”。`
    : `提示功能待实现，尝试次数较多，考虑换思路。`;
  return {
    type: 'message',
    message
  };
}