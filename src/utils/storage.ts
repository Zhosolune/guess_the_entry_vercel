/**
 * 游戏状态存储工具
 * 提供本地存储功能，用于保存和加载游戏状态
 */

import { GameState } from '../types/game.types';
import { ErrorHandler, ErrorType, AppError } from './errorHandler';

const STORAGE_KEYS = {
  GAME_STATE: 'guess_the_entry_game_state',
  GAME_STATS: 'guess_the_entry_game_stats',
  EXCLUDED_ENTRIES: 'guess_the_entry_excluded_entries'
} as const;

/**
 * 保存游戏状态到本地存储
 * 
 * @param gameState - 要保存的游戏状态
 * @throws AppError - 保存失败时抛出错误
 */
export async function saveGameState(gameState: GameState): Promise<void> {
  try {
    // 将Set转换为数组以便JSON序列化
    const serializedState = {
      ...gameState,
      revealedChars: Array.from(gameState.revealedChars),
      guessedChars: Array.from(gameState.guessedChars)
    };
    
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(serializedState));
  } catch (error) {
    throw new AppError(
      '保存游戏状态失败',
      ErrorType.STORAGE_ERROR,
      'SAVE_FAILED',
      error
    );
  }
}

/**
 * 从本地存储加载游戏状态
 * 
 * @returns 保存的游戏状态，如果没有则返回null
 * @throws AppError - 加载失败时抛出错误
 */
export async function loadGameState(): Promise<GameState | null> {
  try {
    const savedData = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
    
    if (!savedData) {
      return null;
    }
    
    const parsed = JSON.parse(savedData);
    
    // 将数组转换回Set
    return {
      ...parsed,
      revealedChars: new Set(parsed.revealedChars || []),
      guessedChars: new Set(parsed.guessedChars || [])
    };
  } catch (error) {
    throw new AppError(
      '加载游戏状态失败',
      ErrorType.STORAGE_ERROR,
      'LOAD_FAILED',
      error
    );
  }
}

/**
 * 清除本地存储的游戏状态
 * 
 * @throws AppError - 清除失败时抛出错误
 */
export async function clearGameState(): Promise<void> {
  try {
    localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
  } catch (error) {
    throw new AppError(
      '清除游戏状态失败',
      ErrorType.STORAGE_ERROR,
      'CLEAR_FAILED',
      error
    );
  }
}

/**
 * 保存游戏统计信息
 * 
 * @param stats - 游戏统计信息
 * @throws AppError - 保存失败时抛出错误
 */
export async function saveGameStats(stats: any): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEYS.GAME_STATS, JSON.stringify(stats));
  } catch (error) {
    throw new AppError(
      '保存游戏统计失败',
      ErrorType.STORAGE_ERROR,
      'SAVE_STATS_FAILED',
      error
    );
  }
}

/**
 * 从本地存储加载游戏统计信息
 * 
 * @returns 保存的游戏统计信息，如果没有则返回null
 * @throws AppError - 加载失败时抛出错误
 */
export async function loadGameStats(): Promise<any | null> {
  try {
    const savedData = localStorage.getItem(STORAGE_KEYS.GAME_STATS);
    
    if (!savedData) {
      return null;
    }
    
    return JSON.parse(savedData);
  } catch (error) {
    throw new AppError(
      '加载游戏统计失败',
      ErrorType.STORAGE_ERROR,
      'LOAD_STATS_FAILED',
      error
    );
  }
}

/**
 * 新增已猜过的词条到排除列表
 * 保存在本地存储，去重并忽略空白。
 *
 * @param entry - 词条文本
 * @returns void
 */
export function addExcludedEntry(entry: string): void {
  const name = (entry || '').trim();
  if (!name) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXCLUDED_ENTRIES);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(name)) {
      list.push(name);
      localStorage.setItem(STORAGE_KEYS.EXCLUDED_ENTRIES, JSON.stringify(list));
    }
  } catch (_) {
    // 忽略异常，避免影响游戏流程
  }
}

/**
 * 获取排除列表（本地存储 + 文档）
 * 尝试从 `/deepseek-exclude.txt` 读取文档并与本地列表合并。
 * 文档格式：每行一个词条，空行忽略。
 *
 * @returns 合并后的去重列表
 */
export async function getExcludedEntries(): Promise<string[]> {
  const fromLocal = (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.EXCLUDED_ENTRIES);
      const list: string[] = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (_) {
      return [];
    }
  })();

  let fromDoc: string[] = [];
  try {
    const res = await fetch('/deepseek-exclude.txt', { cache: 'no-store' });
    if (res.ok) {
      const text = await res.text();
      fromDoc = text
        .split(/\r?\n/)
        .map(s => s.trim())
        .filter(s => s.length > 0);
    }
  } catch (_) {
    // 文档缺失或网络错误时忽略
  }

  const merged = new Set<string>([...fromLocal, ...fromDoc]);
  return Array.from(merged);
}

/**
 * 清空本地存储的排除列表
 *
 * @returns void
 */
export function clearExcludedEntries(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.EXCLUDED_ENTRIES);
  } catch (_) {
    // 忽略异常
  }
}