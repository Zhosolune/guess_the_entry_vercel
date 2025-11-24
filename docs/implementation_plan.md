# 领域名称映射规范化实施计划

## 问题描述

当前项目中领域名称映射存在以下问题:

1. **"随机"被当作独立领域**: 当前实现中,"随机"有自己的排除词桶 `excludedByCategory['random']`,这不符合预期
2. **领域映射分散**: [normalizeCategoryKey()](file:///e:/myProjects_Trae/guess_the_entry_web/src/utils/stateManager.ts#586-602) 函数在 [stateManager.ts](file:///e:/myProjects_Trae/guess_the_entry_web/src/utils/stateManager.ts) 中定义,缺乏统一管理
3. **"随机"逻辑错误**:
   - 现状: "随机"作为一个领域,有独立的排除词列表
   - 期望: "随机"应该从现有领域(自然、天文、地理等)中随机选择一个,使用该领域的排除词

## 用户需求

> [!IMPORTANT] > **核心需求**: "随机"领域并不是指词条随机生成,而是指在已有的领域内随机选择一个。它的排除词也不应该是"随机"领域的排除词,而是根据随机到的实际领域选择对应的排除词列表。计分板相关内容也是同理。

## Proposed Changes

### 1. 创建统一的领域映射模块

#### [NEW] [categoryMapper.ts](file:///e:/myProjects_Trae/guess_the_entry_web/src/utils/categoryMapper.ts)

**目的**: 集中管理所有领域相关的映射和工具函数

**内容**:

- 定义实际游戏领域列表 `ACTUAL_CATEGORIES` (不含"随机")
- 中文 ↔ 英文映射函数 `toEnglishKey()` / `toChineseName()`
- 随机选择领域函数 `selectRandomCategory()`
- 验证领域函数 `isActualCategory()`

---

### 2. 修改类型定义

#### [MODIFY] [game.types.ts](file:///e:/myProjects_Trae/guess_the_entry_web/src/types/game.types.ts#L6-L16)

**变更**:

- 保持 [GameCategory](file:///e:/myProjects_Trae/guess_the_entry_web/src/types/game.types.ts#6-17) 类型不变(包含"随机")
- 新增 `ActualGameCategory` 类型(不含"随机",仅实际领域)

**原因**:

- [GameCategory](file:///e:/myProjects_Trae/guess_the_entry_web/src/types/game.types.ts#6-17) 用于用户界面选择
- `ActualGameCategory` 用于内部逻辑(排除词、统计等)

---

### 3. 重构 DeepSeek API 服务

#### [MODIFY] [deepseek.ts](file:///e:/myProjects_Trae/guess_the_entry_web/src/services/deepseek.ts#L99-L154)

**变更**:

```typescript
export async function generateEntry(
  category: string
): Promise<ApiResponse<EntryData>> {
  // 1. 如果是"随机",先选择一个实际领域
  const actualCategory =
    category === "随机" ? selectRandomCategory() : category;

  // 2. 使用实际领域获取排除词
  const excludeEntries = await getExcludedEntries(actualCategory);

  // 3. 构建请求体时使用实际领域
  const requestBody = {
    category: toEnglishKey(actualCategory),
    language: "chinese",
    includeEncyclopedia: true,
    excludeEntries,
  };

  // 4. 返回的数据中标记实际领域
  // ...
}
```

**关键变化**:

- 在 API 调用前就确定实际领域
- 使用实际领域的排除词列表
- 不再有 `excludedByCategory['random']` 桶

---

### 4. 重构状态管理器

#### [MODIFY] [stateManager.ts](file:///e:/myProjects_Trae/guess_the_entry_web/src/utils/stateManager.ts)

**变更 1**: 移除 [normalizeCategoryKey()](file:///e:/myProjects_Trae/guess_the_entry_web/src/utils/stateManager.ts#586-602) 函数

- 替换为 `categoryMapper.ts` 中的 `toEnglishKey()`

**变更 2**: 修改 [getExcludedEntries()](file:///e:/myProjects_Trae/guess_the_entry_web/src/utils/stateManager.ts#470-492)

```typescript
export async function getExcludedEntries(
  category: GameCategory | string
): Promise<string[]> {
  const state = await initState();

  // 如果是"随机",返回空数组(因为还未确定实际领域)
  if (category === "随机") {
    return [];
  }

  const key = toEnglishKey(category);
  const bucket = state.excludedByCategory?.[key] ?? [];
  return bucket;
}
```

**变更 3**: 修改 [addExcludedEntry()](file:///e:/myProjects_Trae/guess_the_entry_web/src/utils/stateManager.ts#436-469)

```typescript
export async function addExcludedEntry(
  entry: string,
  category: GameCategory
): Promise<void> {
  // 不允许添加到"随机"桶
  if (category === "随机") {
    console.warn('Cannot add excluded entry to "随机" category');
    return;
  }

  const categoryKey = toEnglishKey(category);
  // ... 其余逻辑不变
}
```

---

### 5. 修改游戏状态管理

#### [MODIFY] [useGameState.ts](file:///e:/myProjects_Trae/guess_the_entry_web/src/hooks/useGameState.ts)

**变更 1**: `initializeGame()` 函数

```typescript
const initializeGame = useCallback(async (category: GameCategory) => {
  try {
    setGameState(prev => ({ ...prev, isLoading: true, error: null }));

    // 🔑 关键: 如果是"随机",先选择实际领域
    const actualCategory = category === '随机'
      ? selectRandomCategory()
      : category;

    // 使用实际领域生成词条
    const response = await generateEntry(actualCategory);

    const newGameState: GameState = {
      gameId: Date.now().toString(),
      gameStatus: 'playing',
      category: actualCategory, // ⭐ 存储实际领域,而非"随机"
      currentEntry: entryData,
      // ...
    };

    // ...
  }
}, []);
```

**变更 2**: 移除 `effectiveCategory` 计算逻辑

- 因为 `gameState.category` 已经是实际领域,不需要再从 `metadata.category` 获取
- 简化胜利后的统计和排除词添加逻辑

---

### 6. 修改计分板

#### [MODIFY] [ScoreboardDrawer.tsx](file:///e:/myProjects_Trae/guess_the_entry_web/src/components/ScoreboardDrawer.tsx#L87)

**变更**: 使用 `ACTUAL_CATEGORIES` 而非过滤"随机"

```typescript
// 旧代码
const keys = useMemo(
  () => Object.keys(CATEGORIES).filter((k) => k !== "随机"),
  []
);

// 新代码
import { ACTUAL_CATEGORIES } from "../utils/categoryMapper";
const keys = useMemo(() => ACTUAL_CATEGORIES, []);
```

---

### 7. 更新常量定义

#### [MODIFY] [game.constants.ts](file:///e:/myProjects_Trae/guess_the_entry_web/src/constants/game.constants.ts)

**变更**: 添加注释说明"随机"的特殊性

```typescript
/**
 * 可选项字典:以中文类型为键,值为显示文案
 * 注意:"随机"仅用于UI选择,内部逻辑会转换为实际领域
 */
export const CATEGORIES: Record<GameCategory, string> = {
  // ... 保持不变
};

/**
 * 实际游戏领域(不含"随机")
 * 从 categoryMapper 导出,统一管理
 */
export { ACTUAL_CATEGORIES } from "../utils/categoryMapper";
```

---

## Verification Plan

### Automated Tests

由于项目当前没有自动化测试,我们将通过以下方式验证:

#### 1. 类型检查

```bash
npm run check
```

**预期**: TypeScript 编译通过,无类型错误

#### 2. 构建验证

```bash
npm run build
```

**预期**: 构建成功,无错误和警告

---

## 风险评估

### 数据迁移

> [!WARNING] > **现有用户数据**: 如果用户的 `excludedByCategory` 中已经有 `random` 键,需要处理

**解决方案**: 在 [initState()](file:///e:/myProjects_Trae/guess_the_entry_web/src/utils/stateManager.ts#205-269) 中添加迁移逻辑,将 `random` 桶中的词条分散到各实际领域(或直接删除)

### 向后兼容性

> [!CAUTION] > **API 响应**: 确保 `metadata.category` 字段不再被依赖

**解决方案**: 移除所有 `effectiveCategory` 相关逻辑,直接使用 `gameState.category`

---

## 实施顺序

1. ✅ 创建 `categoryMapper.ts` 模块
2. ✅ 修改类型定义 [game.types.ts](file:///e:/myProjects_Trae/guess_the_entry_web/src/types/game.types.ts)
3. ✅ 重构 [deepseek.ts](file:///e:/myProjects_Trae/guess_the_entry_web/src/services/deepseek.ts)
4. ✅ 重构 [stateManager.ts](file:///e:/myProjects_Trae/guess_the_entry_web/src/utils/stateManager.ts)
5. ✅ 修改 [useGameState.ts](file:///e:/myProjects_Trae/guess_the_entry_web/src/hooks/useGameState.ts)
6. ✅ 更新 [ScoreboardDrawer.tsx](file:///e:/myProjects_Trae/guess_the_entry_web/src/components/ScoreboardDrawer.tsx)
7. ✅ 更新 [game.constants.ts](file:///e:/myProjects_Trae/guess_the_entry_web/src/constants/game.constants.ts)
8. ✅ 添加数据迁移逻辑
9. ✅ 运行验证测试

---

_计划创建时间: 2025-11-24_
