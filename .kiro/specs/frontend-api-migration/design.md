# Design Document: Frontend API Migration

## Overview

本设计文档描述如何将前端项目完全迁移到使用 `@hey-api/openapi-ts` 自动生成的 API 代码。核心思路是配置生成的 API 客户端使用项目现有的 `request` 函数，这样：

1. 前端页面直接使用生成的 API 函数（如 `authControllerLoginV1`）
2. 生成的 API 函数内部自动使用现有的 `request` 函数
3. 每次后端接口更新，只需运行 `pnpm openapi-ts` 重新生成即可

### 当前状态

- 项目已配置 `@hey-api/openapi-ts` 生成 API 代码到 `src/service/api-gen`
- 生成的代码包含：
  - `sdk.gen.ts`: 所有 API 函数
  - `types.gen.ts`: 所有请求/响应类型定义
  - `client.gen.ts`: 默认客户端配置（使用 fetch）
  - `client/`: 客户端核心实现
- 手写 API 位于 `src/service/api` 目录
- 现有请求层 `src/service/request` 包含完整的认证、加密、防重复提交、错误处理等功能

### 目标状态

- 配置生成的 API 客户端使用现有 `request` 函数
- 前端页面直接导入并使用生成的 API 函数
- 删除 `src/service/api` 目录下的所有手写 API
- 保持所有现有功能（认证、加密、错误处理等）正常工作
- 接口更新时只需重新运行生成脚本

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Components                       │
│                    (Vue Components / Stores)                     │
│                                                                  │
│  import { authControllerLoginV1 } from '@/service/api-gen'      │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Generated API Functions                       │
│              (src/service/api-gen/sdk.gen.ts)                   │
│                                                                  │
│  authControllerLoginV1()  userControllerGetInfoV1()  ...        │
│  (自动生成，使用配置的自定义客户端)                               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Custom Client Adapter                         │
│              (src/service/api-gen/client.ts)                    │
│                                                                  │
│  将 @hey-api/openapi-ts 的请求格式转换为 request 函数格式        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Existing Request Layer                        │
│              (src/service/request/index.ts)                     │
│                                                                  │
│  - Token 认证                                                    │
│  - ClientId / Content-Language 头                               │
│  - AES+RSA 加密                                                  │
│  - 防重复提交                                                    │
│  - 错误处理 / 登出 / Token 刷新                                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Generated Types                               │
│              (src/service/api-gen/types.gen.ts)                 │
│                                                                  │
│  AuthLoginRequestDto, LoginTokenResponseDto, ...                │
└─────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Custom Client Adapter (`src/service/api-gen/client.ts`)

创建自定义客户端适配器，将 `@hey-api/openapi-ts` 的请求格式转换为现有 `request` 函数的格式。这个文件不会被自动生成覆盖。

```typescript
// src/service/api-gen/client.ts
import type { Client, Config, RequestOptions } from './client/types.gen';
import { request } from '../request';

/**
 * 自定义客户端配置
 * 将 @hey-api/openapi-ts 的请求转换为使用现有 request 函数
 */
const customClient: Client = {
  async request<T>(options: RequestOptions): Promise<T> {
    const { url, method, body, headers, query, path } = options;
    
    // 构建完整 URL（处理路径参数）
    let finalUrl = url;
    if (path) {
      Object.entries(path).forEach(([key, value]) => {
        finalUrl = finalUrl.replace(`{${key}}`, String(value));
      });
    }
    
    // 提取自定义请求头配置
    const customHeaders: Record<string, any> = {};
    if (headers) {
      // 处理特殊的请求头标记
      if ('isToken' in headers) customHeaders.isToken = headers.isToken;
      if ('isEncrypt' in headers) customHeaders.isEncrypt = headers.isEncrypt;
      if ('repeatSubmit' in headers) customHeaders.repeatSubmit = headers.repeatSubmit;
    }
    
    // 调用现有 request 函数
    const result = await request<T>({
      url: finalUrl,
      method: method?.toLowerCase() as any,
      data: body,
      params: query,
      headers: customHeaders,
    });
    
    return result.data as T;
  },
  
  // 实现其他必要的方法
  get: async (options) => customClient.request({ ...options, method: 'GET' }),
  post: async (options) => customClient.request({ ...options, method: 'POST' }),
  put: async (options) => customClient.request({ ...options, method: 'PUT' }),
  delete: async (options) => customClient.request({ ...options, method: 'DELETE' }),
  patch: async (options) => customClient.request({ ...options, method: 'PATCH' }),
  
  getConfig: () => ({}),
  setConfig: (config: Config) => config,
  interceptors: {
    request: { use: () => {}, eject: () => {} },
    response: { use: () => {}, eject: () => {} },
    error: { use: () => {}, eject: () => {} },
  },
} as unknown as Client;

export { customClient as client };
```

### 2. Client Configuration Override (`src/service/api-gen/client.gen.ts`)

修改生成的客户端配置文件，使其导出自定义客户端。由于这个文件会被重新生成覆盖，我们需要在 `openapi-ts.config.ts` 中配置使用自定义客户端。

**方案 A: 使用 client 插件配置（推荐）**

```typescript
// admin-naive-ui/openapi-ts.config.ts
import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: '../server/public/openApi.json',
  output: {
    path: 'src/service/api-gen',
    format: 'prettier',
  },
  plugins: [
    '@hey-api/typescript',
    {
      name: '@hey-api/sdk',
      asClass: false,
      // 配置使用自定义客户端
      client: '../client', // 指向 src/service/api-gen/client.ts
    },
  ],
});
```

**方案 B: 运行时配置客户端**

如果插件不支持自定义客户端路径，可以在应用启动时配置：

```typescript
// src/service/api-gen/setup.ts
import { client } from './client.gen';
import { request } from '../request';

// 配置客户端使用自定义 fetch 函数
client.setConfig({
  fetch: async (url, init) => {
    const result = await request({
      url: url.toString(),
      method: init?.method?.toLowerCase() as any,
      data: init?.body ? JSON.parse(init.body as string) : undefined,
      headers: init?.headers as any,
    });
    
    // 将 request 的响应转换为 Response 对象
    return new Response(JSON.stringify(result.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  },
});

export { client };
```

### 3. Component Usage Pattern

组件直接使用生成的 API 函数：

```typescript
// Before (手写 API)
import { fetchLogin, fetchGetUserInfo } from '@/service/api';
const { data } = await fetchLogin(loginData);

// After (生成的 API)
import { authControllerLoginV1, userControllerGetInfoV1 } from '@/service/api-gen';
import type { AuthLoginRequestDto } from '@/service/api-gen';

const loginData: AuthLoginRequestDto = { 
  username, 
  password, 
  code, 
  uuid,
  tenantId,
};

// 直接调用生成的函数
const { data } = await authControllerLoginV1({ 
  body: loginData,
  headers: {
    isToken: false,
    isEncrypt: true,
    repeatSubmit: false,
  },
});
```

### 4. Special Request Headers

对于需要特殊处理的请求（如登录需要加密），通过 `headers` 参数传递配置：

```typescript
// 登录请求 - 需要加密，不需要 Token
const { data } = await authControllerLoginV1({
  body: loginData,
  headers: {
    isToken: false,      // 不添加 Token
    isEncrypt: true,     // 启用加密
    repeatSubmit: false, // 禁用防重复提交
  },
});

// 普通请求 - 使用默认配置
const { data } = await userControllerGetInfoV1();
```

### 5. API Function Naming Convention

生成的 API 函数命名遵循 OpenAPI 规范：

- 格式: `{controllerName}Controller{ActionName}V1`
- 示例:
  - `authControllerLoginV1` - 登录
  - `authControllerLogoutV1` - 登出
  - `userControllerGetInfoV1` - 获取用户信息
  - `menuControllerFindAllV1` - 获取菜单列表
  - `roleControllerCreateV1` - 创建角色

## Data Models

### Request/Response Types

所有类型定义由 `@hey-api/openapi-ts` 自动生成，位于 `src/service/api-gen/types.gen.ts`。

主要类型示例：

```typescript
// 登录请求 (来自 types.gen.ts)
export type AuthLoginRequestDto = {
  username: string;
  password: string;
  code?: string;
  uuid?: string;
  tenantId?: string;
  clientId?: string;
  grantType?: string;
};

// 登录响应 (来自 types.gen.ts)
export type LoginTokenResponseDto = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
};

// 用户信息响应 (来自 types.gen.ts)
export type CurrentUserInfoResponseDto = {
  user?: UserResponseDto;
  roles?: string[];
  permissions?: string[];
};
```

### API Response Wrapper

后端响应格式（由现有 request 函数处理）：

```typescript
interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
  rows?: T[];  // 分页数据
  total?: number;
}
```

现有 `request` 函数的 `transformBackendResponse` 会自动提取 `data` 字段或保留分页数据。

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Request Headers Injection

*For any* API request sent through the Generated_API client, the request headers SHALL contain:
- `Authorization` header with Bearer token (when user is logged in)
- `Clientid` header with the configured client ID
- `Content-Language` header with the current locale

**Validates: Requirements 1.1, 1.2**

### Property 2: Response Data Extraction

*For any* successful API response with `code === 200`, the client SHALL extract and return the `data` field. *For any* paginated response, the client SHALL preserve the `rows` array and pagination metadata.

**Validates: Requirements 6.1, 6.2**

### Property 3: Error Propagation

*For any* API response with `code !== 200` or HTTP error status, the client SHALL throw an exception that can be caught by the caller using try-catch.

**Validates: Requirements 6.4**

### Property 4: Encryption Round-Trip

*For any* request marked for encryption, the request body SHALL be encrypted using AES+RSA hybrid encryption, and the server SHALL be able to decrypt and process the original data.

**Validates: Requirements 1.3**

## Error Handling

### Error Types

错误处理完全由现有 `request` 函数负责：

1. **Network Errors**: 网络连接失败、超时等
2. **HTTP Errors**: 4xx/5xx 状态码
3. **Business Errors**: 后端返回的业务错误（code !== 200）
4. **Authentication Errors**: Token 过期、未授权等

### Error Handling Strategy

现有 `request` 函数已实现完整的错误处理，自定义客户端适配器会透传这些功能：

```typescript
// 现有 request 函数的错误处理逻辑
{
  onBackendFail(response, instance) {
    // 处理登出错误码
    const logoutCodes = import.meta.env.VITE_SERVICE_LOGOUT_CODES?.split(',') || [];
    if (logoutCodes.includes(responseCode)) {
      authStore.resetStore();
      return null;
    }
    
    // 处理 Token 过期
    const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
    if (expiredTokenCodes.includes(responseCode)) {
      // 刷新 Token 并重试
      const success = await handleExpiredRequest(flatRequest.state);
      if (success) {
        return instance.request(response.config);
      }
    }
    
    return null;
  },
  
  onError(error) {
    // 显示错误消息
    showErrorMsg(flatRequest.state, message);
  }
}
```

### Usage Pattern

```typescript
// 使用 try-catch 处理错误
try {
  const { data } = await authControllerLoginV1({ body: loginData });
  // 成功处理
} catch (error) {
  // 错误消息已由 request 函数显示
  // 这里可以做其他处理（如重置表单等）
}
```

## Testing Strategy

### Unit Tests

单元测试用于验证特定示例和边界情况：

1. **Custom Client Adapter Tests**
   - 验证请求参数正确转换
   - 验证响应数据正确返回
   - 验证错误正确传播

2. **Type Compatibility Tests**
   - 验证生成的类型与后端 DTO 一致

### Integration Tests

集成测试用于验证端到端流程：

1. **Authentication Flow**
   - 登录 → 获取用户信息 → 登出

2. **CRUD Operations**
   - 创建 → 读取 → 更新 → 删除

### Testing Framework

- **Unit Tests**: Vitest
- **Integration Tests**: Vitest + MSW (Mock Service Worker)

### Test Examples

```typescript
// 自定义客户端适配器测试示例
import { describe, it, expect, vi } from 'vitest';
import { client } from '@/service/api-gen/client';
import { request } from '@/service/request';

vi.mock('@/service/request', () => ({
  request: vi.fn(),
}));

describe('Custom Client Adapter', () => {
  it('should convert request options correctly', async () => {
    const mockResponse = { data: { token: 'test-token' } };
    vi.mocked(request).mockResolvedValue(mockResponse);
    
    await client.post({
      url: '/api/v1/auth/login',
      body: { username: 'admin', password: 'password' },
      headers: { isToken: false, isEncrypt: true },
    });
    
    expect(request).toHaveBeenCalledWith({
      url: '/api/v1/auth/login',
      method: 'post',
      data: { username: 'admin', password: 'password' },
      headers: { isToken: false, isEncrypt: true },
    });
  });
});
```

## Migration Steps

### Step 1: Create Custom Client Adapter

创建 `src/service/api-gen/client.ts` 文件，实现自定义客户端适配器。

### Step 2: Update OpenAPI-TS Configuration

更新 `openapi-ts.config.ts`，配置使用自定义客户端。

### Step 3: Regenerate API Code

运行 `pnpm openapi-ts` 重新生成 API 代码。

### Step 4: Update Component Imports

更新所有组件，将手写 API 导入改为生成的 API 导入：

```typescript
// Before
import { fetchLogin } from '@/service/api';

// After
import { authControllerLoginV1 } from '@/service/api-gen';
```

### Step 5: Delete Manual API Files

删除 `src/service/api` 目录下的所有手写 API 文件。

### Step 6: Verify Functionality

验证所有功能正常工作，包括认证、加密、错误处理等。

## Regeneration Workflow

每次后端接口更新后，只需执行以下步骤：

1. 确保后端 `openApi.json` 已更新
2. 运行 `pnpm openapi-ts`
3. 自定义客户端适配器 (`client.ts`) 不会被覆盖
4. 新的 API 函数和类型自动可用
