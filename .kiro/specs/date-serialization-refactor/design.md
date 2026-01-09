# Design Document: 日期序列化重构

## Overview

本设计文档描述如何将项目中的日期格式化方案从 Service 层手动调用 `FormatDateFields()` 改造为使用 `class-transformer` 装饰器在序列化层自动处理。

核心思路：
1. 创建 `@DateFormat()` 装饰器，基于 `class-transformer` 的 `@Transform` 实现
2. 在 Response DTO 基类中应用装饰器，子类自动继承
3. 序列化工具函数 `toDto/toDtoList/toDtoPage` 自动触发装饰器转换
4. 清理 Service 层中的 `FormatDateFields` 调用
5. 标记废弃并最终移除 `FormatDateFields` 函数

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Controller Layer                          │
│                    (返回 Result 对象)                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Service Layer                             │
│              (业务逻辑，返回原始数据)                            │
│                                                                  │
│  Before: Result.page(FormatDateFields(list), total, ...)        │
│  After:  Result.page(toDtoList(ResponseDto, list), total, ...)  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Serialization Layer                           │
│           (toDto/toDtoList/toDtoPage 触发转换)                   │
│                                                                  │
│  plainToInstance(cls, plain, { enableImplicitConversion: true }) │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Response DTO                                │
│              (@DateFormat() 装饰器自动格式化)                    │
│                                                                  │
│  class UserResponseDto extends BaseResponseDto {                 │
│    @Expose()                                                     │
│    @DateFormat()  // 自动格式化                                  │
│    loginTime: string;                                            │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. DateFormat 装饰器

```typescript
// server/src/shared/decorators/date-format.decorator.ts

import { Transform, TransformFnParams } from 'class-transformer';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 默认日期格式
 */
export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/**
 * 默认时区
 */
export const DEFAULT_TIMEZONE = 'Asia/Beijing';

/**
 * 日期格式化装饰器
 * 
 * @description 在 DTO 序列化时自动将 Date 对象或 ISO 字符串转换为指定格式
 * 
 * @param format 日期格式，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns PropertyDecorator
 * 
 * @example
 * ```typescript
 * class UserResponseDto {
 *   @Expose()
 *   @DateFormat()
 *   createTime: string;
 * 
 *   @Expose()
 *   @DateFormat('YYYY-MM-DD')
 *   birthDate: string;
 * }
 * ```
 */
export function DateFormat(format: string = DEFAULT_DATE_FORMAT): PropertyDecorator {
  return Transform(({ value }: TransformFnParams) => {
    if (value === null || value === undefined) {
      return value;
    }

    // 处理 Date 对象
    if (value instanceof Date) {
      return dayjs(value).tz(DEFAULT_TIMEZONE).format(format);
    }

    // 处理字符串格式的日期
    if (typeof value === 'string') {
      const dateValue = dayjs(value);
      if (dateValue.isValid()) {
        return dateValue.tz(DEFAULT_TIMEZONE).format(format);
      }
    }

    // 其他情况返回原值
    return value;
  });
}
```

### 2. BaseResponseDto 增强

```typescript
// server/src/shared/dto/base-response.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Exclude } from 'class-transformer';
import { DateFormat } from '../decorators/date-format.decorator';

/**
 * 响应 DTO 基类
 * 
 * @description 所有响应 DTO 应继承此类，自动：
 * 1. 排除敏感字段（delFlag, tenantId, password 等）
 * 2. 格式化日期字段（createTime, updateTime）
 * 
 * @example
 * ```typescript
 * export class UserResponseDto extends BaseResponseDto {
 *   @Expose()
 *   userId: number;
 * 
 *   @Expose()
 *   userName: string;
 * }
 * ```
 */
export class BaseResponseDto {
  @Exclude()
  delFlag?: string;

  @Exclude()
  tenantId?: string;

  @Exclude()
  password?: string;

  @ApiPropertyOptional({ description: '创建者' })
  @Expose()
  createBy?: string;

  @ApiPropertyOptional({ description: '创建时间', example: '2025-01-01 00:00:00' })
  @Expose()
  @DateFormat()
  createTime?: string;

  @ApiPropertyOptional({ description: '更新者' })
  @Expose()
  updateBy?: string;

  @ApiPropertyOptional({ description: '更新时间', example: '2025-01-01 00:00:00' })
  @Expose()
  @DateFormat()
  updateTime?: string;

  @ApiPropertyOptional({ description: '备注' })
  @Expose()
  remark?: string;
}
```

### 3. 序列化工具函数

```typescript
// server/src/shared/utils/serialize.util.ts

import { plainToInstance, ClassConstructor } from 'class-transformer';

/**
 * 将普通对象转换为 DTO 实例
 * 
 * @description 使用 class-transformer 进行转换，自动触发 @DateFormat 等装饰器
 * 
 * @param cls DTO 类
 * @param plain 普通对象
 * @returns DTO 实例
 */
export function toDto<T>(cls: ClassConstructor<T>, plain: object | null | undefined): T | null {
  if (plain === null || plain === undefined) {
    return null;
  }
  return plainToInstance(cls, plain, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });
}

/**
 * 将普通对象数组转换为 DTO 实例数组
 */
export function toDtoList<T>(cls: ClassConstructor<T>, plainList: object[] | null | undefined): T[] {
  if (!plainList || !Array.isArray(plainList)) {
    return [];
  }
  return plainList.map((item) => 
    plainToInstance(cls, item, { 
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    })
  );
}

/**
 * 转换分页数据
 */
export function toDtoPage<T, R extends Record<string, unknown> = Record<string, unknown>>(
  cls: ClassConstructor<T>,
  data: { rows: R[]; total: number } | null | undefined,
): { rows: T[]; total: number } {
  if (!data) {
    return { rows: [], total: 0 };
  }
  return {
    rows: toDtoList(cls, data.rows as object[]),
    total: data.total,
  };
}
```

## Data Models

### 日期字段类型映射

| 数据库类型 | Prisma 类型 | DTO 类型 | 装饰器 |
|-----------|------------|---------|--------|
| DATETIME | DateTime | string | @DateFormat() |
| TIMESTAMP | DateTime | string | @DateFormat() |
| DATE | DateTime | string | @DateFormat('YYYY-MM-DD') |

### 常见日期字段

| 字段名 | 描述 | 格式 |
|-------|------|------|
| createTime | 创建时间 | YYYY-MM-DD HH:mm:ss |
| updateTime | 更新时间 | YYYY-MM-DD HH:mm:ss |
| loginTime | 登录时间 | YYYY-MM-DD HH:mm:ss |
| loginDate | 登录日期 | YYYY-MM-DD HH:mm:ss |
| operTime | 操作时间 | YYYY-MM-DD HH:mm:ss |
| expireTime | 过期时间 | YYYY-MM-DD HH:mm:ss |

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: 日期格式化输出格式一致性

*For any* 有效的日期输入（Date 对象或 ISO 字符串），经过 DateFormat 装饰器处理后，输出应符合 'YYYY-MM-DD HH:mm:ss' 格式（或指定的自定义格式）。

**Validates: Requirements 1.1, 1.3**

### Property 2: 空值保持不变

*For any* null 或 undefined 输入，经过 DateFormat 装饰器处理后，输出应保持原值不变。

**Validates: Requirements 1.2**

### Property 3: 序列化函数触发装饰器转换

*For any* 包含日期字段的对象，调用 toDto/toDtoList/toDtoPage 后，所有使用 @DateFormat() 装饰的字段应被正确格式化。

**Validates: Requirements 3.1, 3.2, 3.3**

### Property 4: 序列化函数向后兼容

*For any* 未使用 @DateFormat() 装饰器的 DTO，序列化函数应正常工作，不改变原有字段值。

**Validates: Requirements 3.4**

## Error Handling

### 无效日期处理

当输入的日期字符串无法解析时，装饰器应返回原值而非抛出异常：

```typescript
// 无效日期字符串
const invalidDate = 'not-a-date';
// 装饰器返回原值 'not-a-date'，不抛出异常
```

### 类型安全

DTO 中的日期字段类型应声明为 `string`（格式化后的类型），而非 `Date`：

```typescript
// 正确
@Expose()
@DateFormat()
createTime: string;

// 错误 - 类型不匹配
@Expose()
@DateFormat()
createTime: Date;
```

## Testing Strategy

### 单元测试

1. **DateFormat 装饰器测试**
   - 测试 Date 对象转换
   - 测试 ISO 字符串转换
   - 测试 null/undefined 处理
   - 测试自定义格式参数
   - 测试时区处理

2. **BaseResponseDto 测试**
   - 测试 createTime 格式化
   - 测试 updateTime 格式化
   - 测试子类继承行为

3. **序列化工具函数测试**
   - 测试 toDto 触发装饰器
   - 测试 toDtoList 批量转换
   - 测试 toDtoPage 分页数据转换

### 属性测试 (Property-Based Testing)

使用 fast-check 库进行属性测试，配置每个测试运行 100 次迭代。

```typescript
// test/unit/shared/decorators/date-format.pbt.spec.ts
import * as fc from 'fast-check';

describe('DateFormat Decorator - Property Tests', () => {
  /**
   * Property 1: 日期格式化输出格式一致性
   * **Validates: Requirements 1.1, 1.3**
   */
  it('should format any valid date to YYYY-MM-DD HH:mm:ss pattern', () => {
    fc.assert(
      fc.property(fc.date(), (date) => {
        const result = formatDate(date);
        return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(result);
      }),
      { numRuns: 100 }
    );
  });
});
```

