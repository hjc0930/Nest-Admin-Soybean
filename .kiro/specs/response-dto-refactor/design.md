# Design Document: Response DTO Refactor

## Overview

本设计将现有的 VO（View Object）模式重构为 Response DTO 模式，通过 `class-transformer` 库实现响应数据的自动序列化和敏感字段过滤。设计需要与现有的 `Result` 响应封装和 `ResponseInterceptor` 兼容。

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Request Flow                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Client Request                                                  │
│       │                                                          │
│       ▼                                                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐  │
│  │ Controller  │───▶│   Service   │───▶│    Repository       │  │
│  │             │    │             │    │  (Prisma Query)     │  │
│  └─────────────┘    └─────────────┘    └─────────────────────┘  │
│       │                   │                      │               │
│       │                   │                      │               │
│       ▼                   ▼                      ▼               │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Response Flow                             ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │                                                              ││
│  │  Raw Data (Prisma Entity)                                    ││
│  │       │                                                      ││
│  │       ▼                                                      ││
│  │  ┌─────────────────────┐                                     ││
│  │  │  plainToInstance()  │  ← 转换为 Response DTO 实例         ││
│  │  │  (in Service)       │                                     ││
│  │  └─────────────────────┘                                     ││
│  │       │                                                      ││
│  │       ▼                                                      ││
│  │  ┌─────────────────────┐                                     ││
│  │  │    Result.ok()      │  ← 包装为统一响应格式               ││
│  │  └─────────────────────┘                                     ││
│  │       │                                                      ││
│  │       ▼                                                      ││
│  │  ┌─────────────────────┐                                     ││
│  │  │ ResponseInterceptor │  ← 添加 requestId, timestamp        ││
│  │  └─────────────────────┘                                     ││
│  │       │                                                      ││
│  │       ▼                                                      ││
│  │  ┌─────────────────────┐                                     ││
│  │  │ClassSerializer      │  ← 根据 @Exclude/@Expose 过滤字段  ││
│  │  │Interceptor          │                                     ││
│  │  └─────────────────────┘                                     ││
│  │       │                                                      ││
│  │       ▼                                                      ││
│  │  Client Response (Filtered JSON)                             ││
│  │                                                              ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. 目录结构

```
src/module/system/config/
├── dto/
│   ├── requests/                      # 请求 DTO
│   │   ├── create-config.request.dto.ts
│   │   ├── update-config.request.dto.ts
│   │   ├── list-config.request.dto.ts
│   │   └── index.ts
│   ├── responses/                     # 响应 DTO (替代 vo/)
│   │   ├── config.response.dto.ts
│   │   └── index.ts
│   └── index.ts                       # 统一导出
├── config.controller.ts
├── config.service.ts
└── config.module.ts
```

### 2. 基础 Response DTO 类

```typescript
// src/shared/dto/base.response.dto.ts
import { Exclude } from 'class-transformer';

/**
 * 基础响应 DTO
 * 统一排除敏感字段
 */
export abstract class BaseResponseDto {
  @Exclude()
  delFlag?: string;

  @Exclude()
  tenantId?: number;

  @Exclude()
  createBy?: string;

  @Exclude()
  updateBy?: string;
}
```

### 3. Config Response DTO

```typescript
// src/module/system/config/dto/responses/config.response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseResponseDto } from 'src/shared/dto/base.response.dto';

export class ConfigResponseDto extends BaseResponseDto {
  @Expose()
  @ApiProperty({ description: '参数配置ID' })
  configId: number;

  @Expose()
  @ApiProperty({ description: '参数名称' })
  configName: string;

  @Expose()
  @ApiProperty({ description: '参数键名' })
  configKey: string;

  @Expose()
  @ApiProperty({ description: '参数键值' })
  configValue: string;

  @Expose()
  @ApiProperty({ description: '系统内置' })
  configType: string;

  @Expose()
  @ApiProperty({ description: '备注' })
  remark: string;

  @Expose()
  @ApiProperty({ description: '创建时间' })
  createTime: Date;

  @Expose()
  @ApiProperty({ description: '更新时间' })
  updateTime: Date;
}

export class ConfigListResponseDto {
  @ApiProperty({ description: '配置列表', type: [ConfigResponseDto] })
  rows: ConfigResponseDto[];

  @ApiProperty({ description: '总数量' })
  total: number;
}
```

### 4. 序列化工具函数

```typescript
// src/shared/utils/serialize.util.ts
import { plainToInstance, ClassConstructor } from 'class-transformer';

/**
 * 将普通对象转换为 DTO 实例
 * @param cls DTO 类
 * @param plain 普通对象
 * @param options 转换选项
 */
export function toDto<T>(cls: ClassConstructor<T>, plain: object): T {
  return plainToInstance(cls, plain, {
    excludeExtraneousValues: true, // 只保留 @Expose 标记的字段
  });
}

/**
 * 将普通对象数组转换为 DTO 实例数组
 */
export function toDtoList<T>(cls: ClassConstructor<T>, plainList: object[]): T[] {
  return plainList.map(item => toDto(cls, item));
}

/**
 * 转换分页数据
 */
export function toDtoPage<T>(
  cls: ClassConstructor<T>,
  data: { rows: object[]; total: number }
): { rows: T[]; total: number } {
  return {
    rows: toDtoList(cls, data.rows),
    total: data.total,
  };
}
```

### 5. Service 层使用示例

```typescript
// config.service.ts
import { toDto, toDtoPage } from 'src/shared/utils/serialize.util';
import { ConfigResponseDto, ConfigListResponseDto } from './dto/responses';

async findAll(query: ListConfigDto) {
  const { list, total } = await this.configRepo.findPageWithFilter(where, query.skip, query.take);
  
  return Result.ok(toDtoPage(ConfigResponseDto, {
    rows: FormatDateFields(list),
    total,
  }));
}

async findOne(configId: number) {
  const data = await this.configRepo.findById(configId);
  return Result.ok(toDto(ConfigResponseDto, data));
}
```

## Data Models

### 敏感字段定义

| 字段名 | 说明 | 处理方式 |
|--------|------|----------|
| password | 密码 | @Exclude |
| delFlag | 删除标记 | @Exclude |
| tenantId | 租户ID | @Exclude |
| createBy | 创建人 | @Exclude |
| updateBy | 更新人 | @Exclude |

### DTO 命名规范

| 类型 | 命名格式 | 示例 |
|------|----------|------|
| 创建请求 | `Create{Entity}RequestDto` | `CreateConfigRequestDto` |
| 更新请求 | `Update{Entity}RequestDto` | `UpdateConfigRequestDto` |
| 查询请求 | `List{Entity}RequestDto` | `ListConfigRequestDto` |
| 单个响应 | `{Entity}ResponseDto` | `ConfigResponseDto` |
| 列表响应 | `{Entity}ListResponseDto` | `ConfigListResponseDto` |

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: 序列化过滤属性

*For any* 包含 @Exclude 装饰器标记字段的 Response DTO 实例，当使用 `plainToInstance` 配合 `excludeExtraneousValues: true` 转换后，结果对象中不应包含被 @Exclude 标记的字段。

**Validates: Requirements 1.2, 1.3, 5.2**

### Property 2: 数据转换完整性属性

*For any* 原始数据对象和对应的 Response DTO 类，使用 `toDto()` 或 `toDtoList()` 转换后，所有被 @Expose 标记的字段值应与原始数据中的对应字段值相等。

**Validates: Requirements 4.1, 4.2**

## Error Handling

| 场景 | 处理方式 |
|------|----------|
| 原始数据为 null | 返回 null，不进行转换 |
| 原始数据字段缺失 | 对应 DTO 字段为 undefined |
| 类型不匹配 | class-transformer 自动处理类型转换 |

## Testing Strategy

### 单元测试

1. **序列化工具测试**
   - 测试 `toDto()` 正确转换单个对象
   - 测试 `toDtoList()` 正确转换数组
   - 测试 `toDtoPage()` 正确转换分页数据
   - 测试敏感字段被正确过滤

2. **Response DTO 测试**
   - 测试 @Expose 字段被保留
   - 测试 @Exclude 字段被移除
   - 测试继承 BaseResponseDto 的字段过滤

### 属性测试

使用 `fast-check` 进行属性测试：

1. **Property 1 测试**: 生成随机对象，验证 @Exclude 字段被过滤
2. **Property 2 测试**: 生成随机对象，验证 @Expose 字段值保持不变

### 集成测试

1. 测试完整的请求-响应流程
2. 验证 API 响应不包含敏感字段
3. 验证 Swagger 文档正确生成
