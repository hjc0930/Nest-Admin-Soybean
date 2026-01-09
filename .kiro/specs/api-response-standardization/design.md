# Design Document: API 响应格式标准化

## Overview

本设计文档描述如何系统性地修复 server 端所有 API 接口的响应格式不一致问题。通过统一使用 Result 类、DTO 转换、日期格式化等方式，确保所有接口遵循统一的响应标准。

## Architecture

### 响应处理流程

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Controller │───▶│   Service   │───▶│  Repository │───▶│   Prisma    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │ 数据处理流程 │
                   └─────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
   │FormatDate   │ │ toDto/      │ │ Result.ok/  │
   │Fields()     │ │ toDtoList() │ │ page/fail() │
   └─────────────┘ └─────────────┘ └─────────────┘
          │               │               │
          └───────────────┼───────────────┘
                          ▼
                   ┌─────────────┐
                   │   Response  │
                   │ {code,msg,  │
                   │  data}      │
                   └─────────────┘
```

### 标准响应格式

```typescript
// 成功响应
{
  code: 200,
  msg: "操作成功",
  data: T | null
}

// 分页响应
{
  code: 200,
  msg: "操作成功",
  data: {
    rows: T[],
    total: number,
    pageNum: number,
    pageSize: number,
    pages: number
  }
}

// 错误响应
{
  code: number,  // 错误码
  msg: string,   // 错误消息
  data: null
}
```

## Components and Interfaces

### 1. Result 类 (已存在)

```typescript
// server/src/shared/response/result.ts
class Result<T> {
  static ok<T>(data?: T, msg?: string): Result<T>;
  static fail<T>(code: ResponseCode, msg?: string, data?: T): Result<T>;
  static page<T>(rows: T[], total: number, pageNum?: number, pageSize?: number): Result<IPaginatedData<T>>;
}
```

### 2. DTO 转换工具 (已存在)

```typescript
// server/src/shared/utils/serialize.util.ts
function toDto<T>(cls: ClassConstructor<T>, plain: object): T | null;
function toDtoList<T>(cls: ClassConstructor<T>, plainList: object[]): T[];
function toDtoPage<T>(cls: ClassConstructor<T>, data: { rows: R[]; total: number }): { rows: T[]; total: number };
```

### 3. 日期格式化工具 (已存在)

```typescript
// server/src/shared/utils/index.ts
function FormatDateFields<T>(data: T): T;
function FormatDate(date: Date | null): string | null;
```

### 4. BaseResponseDto (已存在)

```typescript
// server/src/shared/dto/base.response.dto.ts
abstract class BaseResponseDto {
  @Exclude() delFlag?: string;
  @Exclude() tenantId?: number;
  @Exclude() createBy?: string;
  @Exclude() updateBy?: string;
}
```

## Data Models

### 标准 Service 方法返回模式

#### 模式 1: 单个对象查询

```typescript
async findOne(id: number) {
  const data = await this.repository.findById(id);
  return Result.ok(toDto(ResponseDto, FormatDateFields(data)));
}
```

#### 模式 2: 列表查询

```typescript
async findAll(query: ListDto) {
  const list = await this.repository.findAll(query);
  return Result.ok(toDtoList(ResponseDto, FormatDateFields(list)));
}
```

#### 模式 3: 分页查询

```typescript
async findPage(query: PageQueryDto) {
  const { list, total } = await this.repository.findPage(query);
  const rows = toDtoList(ResponseDto, FormatDateFields(list));
  return Result.page(rows, total, query.pageNum, query.pageSize);
}
```

#### 模式 4: 创建/更新/删除

```typescript
async create(dto: CreateDto) {
  await this.repository.create(dto);
  return Result.ok();
}

async update(dto: UpdateDto) {
  await this.repository.update(dto);
  return Result.ok();
}

async remove(ids: number[]) {
  await this.repository.softDeleteBatch(ids);
  return Result.ok();
}
```

#### 模式 5: 下拉选择列表

```typescript
async optionselect() {
  const list = await this.repository.findForSelect();
  return Result.ok(toDtoList(OptionResponseDto, list));
}
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: 分页响应格式完整性

*For any* 分页查询请求，Result.page() 返回的响应必须包含完整的分页信息：rows（数据数组）、total（总记录数）、pageNum（当前页码）、pageSize（每页条数）、pages（总页数），且 pages = Math.ceil(total / pageSize)。

**Validates: Requirements 1.1, 1.2**

### Property 2: 敏感字段排除

*For any* 包含敏感字段（password, delFlag, tenantId, createBy, updateBy）的数据对象，经过 DTO 转换后，返回的响应数据中不应包含这些敏感字段。

**Validates: Requirements 2.4**

### Property 3: 日期格式化一致性

*For any* 包含 Date 类型字段的数据对象，经过 FormatDateFields() 处理后，所有日期字段应转换为字符串格式，且 null 值保持不变。

**Validates: Requirements 3.1, 3.2, 3.3**

### Property 4: optionselect 响应精简性

*For any* optionselect 类型的 API 响应，返回的数据应只包含必要的标识字段（如 id/xxxId）和显示字段（如 name/label/xxxName），不应包含其他业务字段。

**Validates: Requirements 6.1, 6.2**

## Error Handling

### 错误响应标准

1. **业务错误**: 使用 `Result.fail(ResponseCode.XXX, '错误消息')` 返回
2. **数据不存在**: 使用 `Result.fail(ResponseCode.DATA_NOT_FOUND, '数据不存在')` 返回
3. **参数验证失败**: 使用 `Result.fail(ResponseCode.PARAM_INVALID, '具体错误信息')` 返回
4. **系统异常**: 使用 `Result.fail(ResponseCode.INTERNAL_SERVER_ERROR, '系统错误')` 返回

### 异常处理模式

```typescript
try {
  // 业务逻辑
  return Result.ok(data);
} catch (error) {
  this.logger.error('操作失败', error);
  return Result.fail(ResponseCode.OPERATION_FAILED, '操作失败');
}
```

## Testing Strategy

### 单元测试

1. **Result 类测试**: 验证 `ok()`, `fail()`, `page()` 方法的正确性
2. **DTO 转换测试**: 验证 `toDto()`, `toDtoList()`, `toDtoPage()` 的转换逻辑
3. **日期格式化测试**: 验证 `FormatDateFields()` 的格式化逻辑

### 属性测试 (Property-Based Testing)

使用 fast-check 库进行属性测试：

1. **分页响应格式测试**: 生成随机分页参数，验证响应格式完整性
2. **敏感字段排除测试**: 生成包含敏感字段的随机对象，验证转换后字段被排除
3. **日期格式化测试**: 生成随机日期，验证格式化结果

### E2E 测试

1. **API 响应格式测试**: 验证所有 API 返回统一的响应结构
2. **分页接口测试**: 验证分页接口返回完整的分页信息

### 测试框架

- **单元测试**: Jest
- **属性测试**: fast-check
- **E2E 测试**: Jest + supertest
