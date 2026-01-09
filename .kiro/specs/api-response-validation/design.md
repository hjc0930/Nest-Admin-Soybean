# Design Document: API Response Validation

## Overview

本设计文档定义了对 Nest-Admin-Soybean 项目所有 API 接口返回格式和功能进行系统性验证的测试架构。采用属性测试 (Property-Based Testing) 和单元测试相结合的方式，确保 API 响应格式的一致性和正确性。

## Architecture

```
server/test/
├── unit/
│   └── shared/
│       └── response/
│           ├── result.spec.ts           # Result 类单元测试
│           └── result.pbt.spec.ts       # Result 类属性测试
├── e2e/
│   ├── response-format.pbt.e2e-spec.ts  # 响应格式属性测试 (已存在)
│   ├── pagination-format.pbt.e2e-spec.ts # 分页格式属性测试 (已存在)
│   ├── auth.e2e-spec.ts                 # 认证接口测试 (已存在)
│   └── crud-operations.pbt.e2e-spec.ts  # CRUD 操作属性测试
└── helpers/
    └── test-helper.ts                   # 测试辅助函数
```

## Components and Interfaces

### 1. Result 类测试组件

```typescript
// 测试 Result 类的核心方法
interface ResultTestSuite {
  // 成功响应测试
  testOk(): void;
  // 失败响应测试
  testFail(): void;
  // 分页响应测试
  testPage(): void;
  // 条件响应测试
  testWhen(): void;
  // Promise 响应测试
  testFromPromise(): void;
}
```

### 2. API 响应格式验证组件

```typescript
// 验证 API 响应格式的接口
interface ResponseFormatValidator {
  // 验证基本响应结构
  validateStructure(response: any): boolean;
  // 验证成功响应
  validateSuccess(response: any): boolean;
  // 验证错误响应
  validateError(response: any): boolean;
  // 验证分页响应
  validatePagination(response: any): boolean;
}
```

### 3. 测试辅助函数

```typescript
// 测试辅助接口
interface TestHelper {
  // 初始化测试应用
  init(): Promise<void>;
  // 获取认证 token
  login(): Promise<string>;
  // 发送请求
  getRequest(): supertest.SuperTest<supertest.Test>;
  // 清理测试数据
  cleanup(): Promise<void>;
}
```

## Data Models

### 统一响应结构

```typescript
interface IResponse<T = any> {
  code: number;      // 响应码
  msg: string;       // 响应消息
  data: T | null;    // 响应数据
  requestId?: string; // 请求追踪 ID
  timestamp?: string; // 时间戳
}
```

### 分页响应结构

```typescript
interface IPaginatedData<T> {
  rows: T[];        // 数据列表
  total: number;    // 总记录数
  pageNum: number;  // 当前页码
  pageSize: number; // 每页条数
  pages: number;    // 总页数
}
```

### 响应码枚举

```typescript
enum ResponseCode {
  SUCCESS = 200,
  BUSINESS_ERROR = 1000,
  PARAM_INVALID = 1001,
  DATA_NOT_FOUND = 1002,
  TOKEN_INVALID = 2001,
  TOKEN_EXPIRED = 2002,
  USER_NOT_FOUND = 3001,
  // ... 其他错误码
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Response Structure Consistency

*For any* API endpoint response, the response body SHALL contain `code` (number), `msg` (string), and `data` (any or null) fields.

**Validates: Requirements 1.1, 1.2, 1.3**

### Property 2: Success Response Code Consistency

*For any* successful API operation, the response code SHALL be 200.

**Validates: Requirements 1.4**

### Property 3: Error Response Format Consistency

*For any* failed API operation due to business logic, the response SHALL contain a non-200 code and a descriptive msg field.

**Validates: Requirements 1.5**

### Property 4: Pagination Structure Consistency

*For any* paginated API endpoint, the response data SHALL contain `rows` (array), `total` (number), `pageNum` (number), `pageSize` (number), and `pages` (number) fields.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

### Property 5: Pagination Size Constraint

*For any* paginated API request with pageSize N, the returned rows array length SHALL NOT exceed N.

**Validates: Requirements 2.5**

### Property 6: Result.ok() Code Consistency

*For any* data passed to Result.ok(), the returned Result SHALL have code 200 and the data field SHALL equal the input data.

**Validates: Requirements 3.1**

### Property 7: Result.fail() Error Propagation

*For any* error code and message passed to Result.fail(), the returned Result SHALL have the specified code and msg.

**Validates: Requirements 3.2**

### Property 8: Result.page() Pagination Format

*For any* valid pagination parameters (rows, total, pageNum, pageSize), Result.page() SHALL return a properly formatted pagination response with calculated pages field.

**Validates: Requirements 3.3**

### Property 9: Result.fromPromise() Success Handling

*For any* resolved Promise, Result.fromPromise() SHALL return a Result with code 200.

**Validates: Requirements 3.6**

### Property 10: Result.fromPromise() Error Handling

*For any* rejected Promise, Result.fromPromise() SHALL return a Result with non-200 code.

**Validates: Requirements 3.7**

### Property 11: ResponseCode Message Mapping

*For any* ResponseCode enum value, there SHALL exist a corresponding message in the ResponseMessage map.

**Validates: Requirements 4.5**

### Property 12: Invalid Token Error Code

*For any* API request with invalid or expired token, the response code SHALL be 2001 (TOKEN_INVALID) or 2002 (TOKEN_EXPIRED).

**Validates: Requirements 5.4**

### Property 13: Invalid Credentials Error Code

*For any* login attempt with invalid credentials, the response code SHALL be in the authentication error range (2001-2008).

**Validates: Requirements 5.2**

### Property 14: CRUD Create Operation

*For any* valid create request, the API SHALL return code 200 with the created resource data.

**Validates: Requirements 6.4**

### Property 15: CRUD Update Operation

*For any* valid update request on an existing resource, the API SHALL return code 200 with the updated resource data.

**Validates: Requirements 6.5**

### Property 16: CRUD Delete Operation

*For any* valid delete request on an existing resource, the API SHALL return code 200.

**Validates: Requirements 6.6**

## Error Handling

### 测试错误处理策略

1. **网络错误**: 测试应该在网络错误时重试或跳过
2. **数据库错误**: 使用事务回滚确保测试隔离
3. **认证错误**: 在测试前确保获取有效 token
4. **超时错误**: 设置合理的超时时间 (30s)

### 错误码验证

```typescript
// 验证错误码范围
function isValidErrorCode(code: number, category: string): boolean {
  switch (category) {
    case 'auth':
      return code >= 2001 && code <= 2008;
    case 'user':
      return code >= 3001 && code <= 3999;
    case 'business':
      return code >= 1000 && code <= 1999;
    default:
      return code !== 200;
  }
}
```

## Testing Strategy

### 测试类型

1. **单元测试**: 测试 Result 类的各个方法
2. **属性测试**: 使用 fast-check 验证响应格式的通用属性
3. **E2E 测试**: 测试完整的 API 请求-响应流程

### 测试框架

- **Jest**: 测试运行器
- **fast-check**: 属性测试库
- **supertest**: HTTP 请求测试

### 覆盖率目标

- 行覆盖率: 90%
- 分支覆盖率: 90%
- 函数覆盖率: 90%
- 语句覆盖率: 90%

### 测试配置

```javascript
// jest.config.js 覆盖率阈值
coverageThreshold: {
  global: {
    branches: 90,
    functions: 90,
    lines: 90,
    statements: 90,
  },
}
```

### 属性测试配置

```typescript
// 每个属性测试运行 100 次
fc.assert(
  fc.property(...),
  { numRuns: 100 }
);
```

### 测试数据管理

1. 使用 fixtures 提供测试数据
2. 每个测试后清理创建的数据
3. 使用事务确保测试隔离
