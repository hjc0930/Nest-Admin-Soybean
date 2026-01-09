# 企业级测试规范指南

## 概述

本规范定义了企业级测试标准和流程，确保系统的质量、可靠性和可维护性。

## 测试覆盖率标准

### 企业级覆盖率阈值

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 70,      // 分支覆盖率 70%
    functions: 75,     // 函数覆盖率 75%
    lines: 80,         // 行覆盖率 80%
    statements: 80,    // 语句覆盖率 80%
  },
  // 核心业务模块更高要求
  './src/module/system/**/*.ts': {
    branches: 75,
    functions: 80,
    lines: 85,
    statements: 85,
  },
  './src/security/**/*.ts': {
    branches: 80,
    functions: 85,
    lines: 90,
    statements: 90,
  },
}
```

### 覆盖率报告格式

- HTML 报告：用于本地查看
- LCOV 报告：用于 CI/CD 集成
- JSON 报告：用于自动化分析
- Clover XML：用于 IDE 集成

## 测试分层架构

### 测试金字塔

```
        ┌─────────┐
        │  E2E    │  10% - 端到端测试
        │  Tests  │
       ─┴─────────┴─
      ┌─────────────┐
      │ Integration │  20% - 集成测试
      │   Tests     │
     ─┴─────────────┴─
    ┌─────────────────┐
    │   Unit Tests    │  70% - 单元测试
    │                 │
    └─────────────────┘
```

### 各层测试职责

| 测试类型 | 职责 | 执行频率 | 执行时间 |
|---------|------|---------|---------|
| 单元测试 | 测试单个函数/类 | 每次提交 | < 5分钟 |
| 集成测试 | 测试模块间交互 | PR 创建时 | < 15分钟 |
| E2E 测试 | 测试完整流程 | 合并前 | < 30分钟 |

## 测试文件组织

### 统一测试目录

```
server/test/
├── unit/                    # 单元测试 (70%)
│   ├── config/              # 配置模块测试
│   ├── core/                # 核心模块测试
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   └── interceptors/
│   ├── infrastructure/      # 基础设施测试
│   │   ├── cache/
│   │   ├── prisma/
│   │   └── repository/
│   ├── module/              # 业务模块测试
│   │   ├── main/
│   │   ├── monitor/
│   │   ├── system/
│   │   └── upload/
│   ├── observability/       # 可观测性测试
│   ├── resilience/          # 弹性模块测试
│   ├── security/            # 安全模块测试
│   ├── shared/              # 共享模块测试
│   │   ├── dto/
│   │   ├── response/
│   │   ├── utils/
│   │   └── validators/
│   └── tenant/              # 租户模块测试
├── integration/             # 集成测试 (20%)
│   ├── auth/
│   ├── user/
│   ├── role/
│   ├── menu/
│   └── tenant/
├── e2e/                     # E2E 测试 (10%)
│   ├── auth.e2e-spec.ts
│   ├── user.e2e-spec.ts
│   ├── role.e2e-spec.ts
│   └── system.e2e-spec.ts
├── fixtures/                # 测试数据工厂
│   ├── user.fixture.ts
│   ├── role.fixture.ts
│   ├── menu.fixture.ts
│   └── tenant.fixture.ts
├── helpers/                 # 测试辅助函数
│   ├── test-helper.ts
│   ├── test-fixtures.ts
│   ├── mock-factory.ts
│   └── assertion-helpers.ts
├── mocks/                   # Mock 实现
│   ├── prisma.mock.ts
│   ├── redis.mock.ts
│   └── config.mock.ts
└── setup.ts                 # 全局测试设置
```

### 文件命名规范

| 测试类型 | 命名格式 | 示例 |
|---------|---------|------|
| 单元测试 | `*.spec.ts` | `user.service.spec.ts` |
| 属性测试 | `*.pbt.spec.ts` | `response-format.pbt.spec.ts` |
| 集成测试 | `*.integration.spec.ts` | `auth.integration.spec.ts` |
| E2E 测试 | `*.e2e-spec.ts` | `auth.e2e-spec.ts` |
| 属性 E2E 测试 | `*.pbt.e2e-spec.ts` | `pagination.pbt.e2e-spec.ts` |

## 属性测试 (Property-Based Testing)

### 核心原则

属性测试用于验证代码在各种输入下的正确性，是企业级测试的重要组成部分。

### 必须使用属性测试的场景

1. **序列化/反序列化** - 必须包含往返测试
2. **数据转换** - 验证不变量
3. **验证器** - 测试边界条件
4. **分页逻辑** - 验证数学属性
5. **响应格式** - 验证结构一致性

### 属性测试模板

```typescript
// test/unit/shared/validators/example.pbt.spec.ts
import * as fc from 'fast-check';

describe('ExampleValidator - Property Tests', () => {
  describe('Property 1: 属性名称', () => {
    /**
     * **Validates: Requirements X.Y**
     * 属性描述
     */
    it('属性测试描述', () => {
      fc.assert(
        fc.property(
          fc.string(), // 生成器
          (input) => {
            // 属性断言
            return someCondition(input);
          }
        ),
        { numRuns: 100 } // 最少 100 次运行
      );
    });
  });
});
```

### 常用属性模式

#### 1. 往返属性 (Round-Trip)

```typescript
// 序列化/反序列化必须可逆
it('serialize then deserialize equals original', () => {
  fc.assert(
    fc.property(fc.anything(), (data) => {
      const serialized = serialize(data);
      const deserialized = deserialize(serialized);
      return deepEqual(data, deserialized);
    })
  );
});
```

#### 2. 不变量属性 (Invariant)

```typescript
// 操作后某些属性保持不变
it('sort preserves array length', () => {
  fc.assert(
    fc.property(fc.array(fc.integer()), (arr) => {
      const sorted = sort(arr);
      return sorted.length === arr.length;
    })
  );
});
```

#### 3. 幂等性属性 (Idempotence)

```typescript
// 多次执行结果相同
it('normalize is idempotent', () => {
  fc.assert(
    fc.property(fc.string(), (str) => {
      const once = normalize(str);
      const twice = normalize(normalize(str));
      return once === twice;
    })
  );
});
```

#### 4. 错误条件属性

```typescript
// 无效输入必须产生错误
it('invalid input throws error', () => {
  fc.assert(
    fc.property(
      fc.string().filter(s => !isValid(s)),
      (invalidInput) => {
        expect(() => process(invalidInput)).toThrow();
        return true;
      }
    )
  );
});
```

## 单元测试规范

### 测试结构

```typescript
describe('ServiceName', () => {
  // 1. 变量声明
  let service: ServiceName;
  let mockDependency: MockType<DependencyService>;

  // 2. 测试设置
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ServiceName,
        { provide: DependencyService, useValue: createMock() },
      ],
    }).compile();

    service = module.get<ServiceName>(ServiceName);
    mockDependency = module.get(DependencyService);
  });

  // 3. 清理
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 4. 测试用例分组
  describe('methodName', () => {
    describe('成功场景', () => {
      it('should return expected result when valid input', async () => {
        // Arrange
        const input = createValidInput();
        mockDependency.method.mockResolvedValue(expectedData);

        // Act
        const result = await service.methodName(input);

        // Assert
        expect(result.code).toBe(200);
        expect(result.data).toEqual(expectedData);
      });
    });

    describe('失败场景', () => {
      it('should return error when invalid input', async () => {
        // Arrange
        const input = createInvalidInput();

        // Act
        const result = await service.methodName(input);

        // Assert
        expect(result.code).toBe(ResponseCode.PARAM_INVALID);
      });
    });

    describe('边界条件', () => {
      it('should handle empty input', async () => {
        // ...
      });

      it('should handle null input', async () => {
        // ...
      });
    });
  });
});
```

### 断言规范

```typescript
// ✅ 好的断言 - 具体且有意义
expect(result.code).toBe(200);
expect(result.data.userName).toBe('admin');
expect(result.data.roles).toHaveLength(2);

// ❌ 避免的断言 - 过于宽泛
expect(result).toBeTruthy();
expect(result.data).toBeDefined();
```

## 集成测试规范

### 测试范围

集成测试验证多个组件之间的交互：

- Controller + Service 交互
- Service + Repository 交互
- 多个 Service 之间的交互
- 中间件和拦截器的集成

### 集成测试模板

```typescript
// test/integration/auth/auth.integration.spec.ts
describe('Auth Integration', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RedisService)
      .useValue(createMockRedis())
      .compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // 清理测试数据
    await prisma.user.deleteMany({ where: { userName: { startsWith: 'test_' } } });
  });

  describe('登录流程', () => {
    it('should complete full login flow', async () => {
      // 1. 创建测试用户
      const user = await createTestUser(prisma);

      // 2. 执行登录
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ userName: user.userName, password: 'test123' });

      // 3. 验证结果
      expect(response.body.code).toBe(200);
      expect(response.body.data.token).toBeDefined();

      // 4. 验证 token 可用
      const profileResponse = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${response.body.data.token}`);

      expect(profileResponse.body.code).toBe(200);
    });
  });
});
```

## E2E 测试规范

### 测试范围

E2E 测试验证完整的用户场景：

- 完整的 API 请求-响应流程
- 认证和授权流程
- 业务流程端到端验证

### E2E 测试模板

```typescript
// test/e2e/user.e2e-spec.ts
describe('User Management (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // 获取管理员 token
    adminToken = await getAdminToken(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('用户 CRUD 流程', () => {
    let createdUserId: number;

    it('POST /system/user - 创建用户', async () => {
      const response = await request(app.getHttpServer())
        .post('/system/user')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userName: 'e2e_test_user',
          nickName: 'E2E测试用户',
          password: 'Test123!',
          deptId: 100,
        });

      expect(response.body.code).toBe(200);
      expect(response.body.data.userId).toBeDefined();
      createdUserId = response.body.data.userId;
    });

    it('GET /system/user/:id - 获取用户详情', async () => {
      const response = await request(app.getHttpServer())
        .get(`/system/user/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.body.code).toBe(200);
      expect(response.body.data.userName).toBe('e2e_test_user');
    });

    it('PUT /system/user/:id - 更新用户', async () => {
      const response = await request(app.getHttpServer())
        .put(`/system/user/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nickName: '更新后的昵称' });

      expect(response.body.code).toBe(200);
    });

    it('DELETE /system/user/:id - 删除用户', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/system/user/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.body.code).toBe(200);
    });
  });
});
```

## 测试数据管理

### Fixture 工厂模式

```typescript
// test/fixtures/user.fixture.ts
import { faker } from '@faker-js/faker/locale/zh_CN';

export interface UserFixtureOptions {
  userName?: string;
  nickName?: string;
  status?: '0' | '1';
  roleIds?: number[];
}

export function createUserFixture(options: UserFixtureOptions = {}) {
  return {
    userName: options.userName ?? faker.internet.userName(),
    nickName: options.nickName ?? faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number('1##########'),
    status: options.status ?? '0',
    password: 'Test123!',
    deptId: 100,
    roleIds: options.roleIds ?? [2],
    createTime: new Date(),
    updateTime: new Date(),
  };
}

export function createAdminUser() {
  return createUserFixture({
    userName: 'admin',
    nickName: '超级管理员',
    roleIds: [1],
  });
}

export function createBatchUsers(count: number) {
  return Array.from({ length: count }, () => createUserFixture());
}
```

### 数据清理策略

```typescript
// test/helpers/cleanup.ts
export async function cleanupTestData(prisma: PrismaService) {
  // 按依赖顺序删除
  await prisma.$transaction([
    prisma.userRole.deleteMany({ where: { userId: { gt: 100 } } }),
    prisma.user.deleteMany({ where: { userId: { gt: 100 } } }),
    prisma.role.deleteMany({ where: { roleId: { gt: 100 } } }),
  ]);
}

// 在测试中使用
afterEach(async () => {
  await cleanupTestData(prisma);
});
```

## Mock 和 Stub 标准

### Mock 工厂

```typescript
// test/mocks/prisma.mock.ts
import { PrismaService } from '@/infrastructure/prisma';

export type MockPrismaService = {
  [K in keyof PrismaService]: jest.Mocked<PrismaService[K]>;
};

export function createMockPrisma(): MockPrismaService {
  return {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    role: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    // ... 其他模型
    $transaction: jest.fn((fn) => fn(createMockPrisma())),
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  } as unknown as MockPrismaService;
}
```

### Redis Mock

```typescript
// test/mocks/redis.mock.ts
export function createMockRedis() {
  const store = new Map<string, string>();

  return {
    get: jest.fn((key: string) => Promise.resolve(store.get(key) ?? null)),
    set: jest.fn((key: string, value: string) => {
      store.set(key, value);
      return Promise.resolve('OK');
    }),
    del: jest.fn((key: string) => {
      store.delete(key);
      return Promise.resolve(1);
    }),
    keys: jest.fn((pattern: string) => {
      const regex = new RegExp(pattern.replace('*', '.*'));
      return Promise.resolve([...store.keys()].filter(k => regex.test(k)));
    }),
    // 清理方法
    _clear: () => store.clear(),
  };
}
```

## API 响应格式测试

### 必须验证的响应格式

每个 API 接口测试必须验证：

1. **响应结构完整性**
   - `code` 字段存在且为数字
   - `msg` 字段存在且为字符串
   - `data` 字段存在

2. **成功响应**
   - `code` 为 200
   - `data` 包含预期数据

3. **分页响应**
   - `data.rows` 为数组
   - `data.total` 为非负整数
   - `data.pageNum` 为正整数
   - `data.pageSize` 为正整数
   - `data.pages` 为非负整数

4. **错误响应**
   - `code` 为对应错误码
   - `msg` 包含错误描述

### 响应格式断言辅助函数

```typescript
// test/helpers/assertion-helpers.ts
export function expectSuccessResponse(response: any, expectedData?: any) {
  expect(response.code).toBe(200);
  expect(response.msg).toBe('操作成功');
  if (expectedData !== undefined) {
    expect(response.data).toEqual(expectedData);
  }
}

export function expectPageResponse(response: any) {
  expect(response.code).toBe(200);
  expect(response.data).toHaveProperty('rows');
  expect(response.data).toHaveProperty('total');
  expect(response.data).toHaveProperty('pageNum');
  expect(response.data).toHaveProperty('pageSize');
  expect(response.data).toHaveProperty('pages');
  expect(Array.isArray(response.data.rows)).toBe(true);
  expect(typeof response.data.total).toBe('number');
}

export function expectErrorResponse(response: any, expectedCode: number) {
  expect(response.code).toBe(expectedCode);
  expect(typeof response.msg).toBe('string');
  expect(response.msg.length).toBeGreaterThan(0);
}
```

## 安全测试

### 认证测试

```typescript
describe('认证安全测试', () => {
  it('should reject request without token', async () => {
    const response = await request(app.getHttpServer())
      .get('/system/user');

    expect(response.body.code).toBe(401);
  });

  it('should reject request with invalid token', async () => {
    const response = await request(app.getHttpServer())
      .get('/system/user')
      .set('Authorization', 'Bearer invalid_token');

    expect(response.body.code).toBe(401);
  });

  it('should reject request with expired token', async () => {
    const expiredToken = generateExpiredToken();
    const response = await request(app.getHttpServer())
      .get('/system/user')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(response.body.code).toBe(401);
  });
});
```

### 授权测试

```typescript
describe('授权安全测试', () => {
  it('should reject access without required permission', async () => {
    const userToken = await getUserToken(app); // 普通用户 token

    const response = await request(app.getHttpServer())
      .delete('/system/user/1')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.body.code).toBe(403);
  });
});
```

### 输入验证测试

```typescript
describe('输入验证安全测试', () => {
  it('should sanitize XSS input', async () => {
    const response = await request(app.getHttpServer())
      .post('/system/user')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        userName: '<script>alert("xss")</script>',
        nickName: 'Test',
      });

    expect(response.body.code).toBe(400);
  });

  it('should prevent SQL injection', async () => {
    const response = await request(app.getHttpServer())
      .get('/system/user')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ userName: "'; DROP TABLE users; --" });

    // 应该正常返回，不会执行注入
    expect(response.body.code).toBe(200);
  });
});
```

## 测试命令

```bash
# 运行所有单元测试
pnpm test

# 运行测试并监听变化
pnpm test:watch

# 运行测试并生成覆盖率报告
pnpm test:cov

# 运行 E2E 测试
pnpm test:e2e

# 运行集成测试
pnpm test:integration

# 运行所有测试
pnpm test:all

# 调试测试
pnpm test:debug

# 运行特定测试文件
pnpm test -- --testPathPattern="user.service"

# 运行属性测试
pnpm test -- --testPathPattern=".pbt.spec"
```

## 最佳实践

### 测试编写原则

1. **测试隔离**: 每个测试应该独立运行，不依赖其他测试的状态
2. **清理资源**: 使用 `afterEach` 和 `afterAll` 清理测试数据
3. **有意义的断言**: 断言应该验证业务逻辑，而不仅仅是代码执行
4. **属性测试优先**: 对于核心逻辑，优先使用属性测试覆盖更多边界情况
5. **Mock 最小化**: 只 mock 必要的外部依赖，保持测试的真实性

### 测试命名规范

```typescript
// ✅ 好的测试名称
it('should return user when valid userId is provided')
it('should throw error when password is too short')
it('should paginate results correctly when pageSize is 10')

// ❌ 避免的测试名称
it('test1')
it('works')
it('should work correctly')
```

### 测试覆盖优先级

1. **高优先级** - 必须 100% 覆盖
   - 认证/授权逻辑
   - 支付/交易逻辑
   - 数据验证逻辑

2. **中优先级** - 目标 80% 覆盖
   - 业务服务层
   - 数据转换逻辑
   - API 控制器

3. **低优先级** - 目标 60% 覆盖
   - 配置模块
   - 工具函数
   - 日志模块

### 持续集成检查清单

- [ ] 所有单元测试通过
- [ ] 所有集成测试通过
- [ ] 所有 E2E 测试通过
- [ ] 覆盖率达到阈值
- [ ] 无新增的 lint 错误
- [ ] 无安全漏洞警告


---

# 前端测试规范指南

## 概述

本规范定义了前端（Vue3 + Naive UI）项目的测试标准和流程。

## 测试框架配置

### 技术栈

- **单元测试**: Vitest + Vue Test Utils
- **组件测试**: Vitest + @vue/test-utils
- **E2E 测试**: Cypress
- **属性测试**: fast-check
- **Mock 工具**: MSW (Mock Service Worker)

### 安装依赖

```bash
# 安装测试依赖
pnpm add -D vitest @vue/test-utils @testing-library/vue jsdom
pnpm add -D @vitest/coverage-v8
pnpm add -D fast-check
pnpm add -D msw
pnpm add -D cypress @cypress/vue
```

### Vitest 配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,ts}', 'test/**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        'test/**',
        '**/*.config.*',
      ],
      thresholds: {
        global: {
          branches: 60,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
    setupFiles: ['./test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
```

## 前端测试目录结构

```
admin-naive-ui/
├── test/
│   ├── unit/                    # 单元测试
│   │   ├── utils/               # 工具函数测试
│   │   ├── hooks/               # Composables 测试
│   │   └── store/               # Pinia Store 测试
│   ├── components/              # 组件测试
│   │   ├── common/
│   │   ├── advanced/
│   │   └── custom/
│   ├── e2e/                     # E2E 测试
│   │   ├── auth.cy.ts
│   │   ├── user.cy.ts
│   │   └── dashboard.cy.ts
│   ├── fixtures/                # 测试数据
│   │   ├── user.fixture.ts
│   │   └── api-responses.ts
│   ├── mocks/                   # Mock 实现
│   │   ├── handlers.ts          # MSW handlers
│   │   └── server.ts            # MSW server
│   └── setup.ts                 # 测试设置
├── cypress/
│   ├── e2e/                     # Cypress E2E 测试
│   ├── fixtures/                # Cypress 测试数据
│   ├── support/                 # Cypress 支持文件
│   └── cypress.config.ts        # Cypress 配置
└── vitest.config.ts             # Vitest 配置
```

## 组件测试规范

### 基本组件测试

```typescript
// test/components/common/Button.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from '@/components/common/Button.vue';

describe('Button 组件', () => {
  it('应该正确渲染默认按钮', () => {
    const wrapper = mount(Button, {
      props: {
        label: '点击我',
      },
    });

    expect(wrapper.text()).toContain('点击我');
    expect(wrapper.classes()).toContain('n-button');
  });

  it('应该在点击时触发 click 事件', async () => {
    const wrapper = mount(Button, {
      props: {
        label: '点击我',
      },
    });

    await wrapper.trigger('click');

    expect(wrapper.emitted('click')).toBeTruthy();
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('应该在 disabled 状态下不触发 click 事件', async () => {
    const wrapper = mount(Button, {
      props: {
        label: '点击我',
        disabled: true,
      },
    });

    await wrapper.trigger('click');

    expect(wrapper.emitted('click')).toBeFalsy();
  });

  it('应该正确应用不同的类型样式', () => {
    const wrapper = mount(Button, {
      props: {
        label: '主要按钮',
        type: 'primary',
      },
    });

    expect(wrapper.classes()).toContain('n-button--primary-type');
  });
});
```

### 带 Pinia Store 的组件测试

```typescript
// test/components/UserProfile.spec.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import UserProfile from '@/components/UserProfile.vue';
import { useUserStore } from '@/store/modules/user';

describe('UserProfile 组件', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('应该显示用户信息', async () => {
    const userStore = useUserStore();
    userStore.userInfo = {
      userId: 1,
      userName: 'admin',
      nickName: '管理员',
      avatar: '/avatar.png',
    };

    const wrapper = mount(UserProfile, {
      global: {
        plugins: [createPinia()],
      },
    });

    expect(wrapper.text()).toContain('管理员');
  });

  it('应该在未登录时显示登录按钮', () => {
    const wrapper = mount(UserProfile, {
      global: {
        plugins: [createPinia()],
      },
    });

    expect(wrapper.find('.login-button').exists()).toBe(true);
  });
});
```

### 带 Vue Router 的组件测试

```typescript
// test/components/Navigation.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import Navigation from '@/components/Navigation.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
    { path: '/about', name: 'about', component: { template: '<div>About</div>' } },
  ],
});

describe('Navigation 组件', () => {
  it('应该渲染导航链接', () => {
    const wrapper = mount(Navigation, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.find('a[href="/"]').exists()).toBe(true);
    expect(wrapper.find('a[href="/about"]').exists()).toBe(true);
  });

  it('应该在点击链接时导航', async () => {
    const wrapper = mount(Navigation, {
      global: {
        plugins: [router],
      },
    });

    await wrapper.find('a[href="/about"]').trigger('click');
    await router.isReady();

    expect(router.currentRoute.value.path).toBe('/about');
  });
});
```

## Composables (Hooks) 测试

```typescript
// test/unit/hooks/useLoading.spec.ts
import { describe, it, expect } from 'vitest';
import { useLoading } from '@/hooks/common/useLoading';

describe('useLoading', () => {
  it('应该初始化为 false', () => {
    const { loading } = useLoading();
    expect(loading.value).toBe(false);
  });

  it('应该能够开始和结束加载状态', () => {
    const { loading, startLoading, endLoading } = useLoading();

    startLoading();
    expect(loading.value).toBe(true);

    endLoading();
    expect(loading.value).toBe(false);
  });

  it('withLoading 应该在执行期间设置加载状态', async () => {
    const { loading, withLoading } = useLoading();
    const states: boolean[] = [];

    const result = await withLoading(async () => {
      states.push(loading.value);
      return 'done';
    });

    expect(states[0]).toBe(true);
    expect(loading.value).toBe(false);
    expect(result).toBe('done');
  });

  it('withLoading 应该在错误时也结束加载状态', async () => {
    const { loading, withLoading } = useLoading();

    await expect(
      withLoading(async () => {
        throw new Error('test error');
      })
    ).rejects.toThrow('test error');

    expect(loading.value).toBe(false);
  });
});
```

## 工具函数测试

### 基本单元测试

```typescript
// test/unit/utils/common.spec.ts
import { describe, it, expect } from 'vitest';
import { formatDate, debounce, throttle } from '@/utils/common';

describe('formatDate', () => {
  it('应该正确格式化日期', () => {
    const date = new Date('2024-01-15T10:30:00');
    expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-01-15');
    expect(formatDate(date, 'YYYY-MM-DD HH:mm:ss')).toBe('2024-01-15 10:30:00');
  });

  it('应该处理无效日期', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
  });
});

describe('debounce', () => {
  it('应该延迟执行函数', async () => {
    let callCount = 0;
    const fn = debounce(() => callCount++, 100);

    fn();
    fn();
    fn();

    expect(callCount).toBe(0);

    await new Promise(resolve => setTimeout(resolve, 150));

    expect(callCount).toBe(1);
  });
});
```

### 属性测试

```typescript
// test/unit/utils/common.pbt.spec.ts
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { formatDate, parseDate } from '@/utils/common';

describe('日期工具函数 - 属性测试', () => {
  describe('Property 1: 日期格式化往返', () => {
    /**
     * **Validates: Requirements 13.3**
     * 对于任意有效日期，格式化后再解析应该得到相同的日期
     */
    it('formatDate 和 parseDate 应该是可逆的', () => {
      fc.assert(
        fc.property(
          fc.date({ min: new Date('2000-01-01'), max: new Date('2100-12-31') }),
          (date) => {
            const formatted = formatDate(date, 'YYYY-MM-DD HH:mm:ss');
            const parsed = parseDate(formatted, 'YYYY-MM-DD HH:mm:ss');
            
            // 比较到秒级别
            return Math.abs(date.getTime() - parsed.getTime()) < 1000;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 2: 格式化输出长度一致', () => {
    /**
     * **Validates: Requirements 13.4**
     * 对于相同格式，输出长度应该一致
     */
    it('相同格式的输出长度应该一致', () => {
      fc.assert(
        fc.property(
          fc.date({ min: new Date('2000-01-01'), max: new Date('2100-12-31') }),
          fc.date({ min: new Date('2000-01-01'), max: new Date('2100-12-31') }),
          (date1, date2) => {
            const format = 'YYYY-MM-DD';
            return formatDate(date1, format).length === formatDate(date2, format).length;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
```

## API 服务测试

### MSW 配置

```typescript
// test/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  // 登录接口
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json();
    
    if (body.userName === 'admin' && body.password === 'admin123') {
      return HttpResponse.json({
        code: 200,
        msg: '登录成功',
        data: {
          token: 'mock-token-12345',
          userInfo: {
            userId: 1,
            userName: 'admin',
            nickName: '管理员',
          },
        },
      });
    }
    
    return HttpResponse.json({
      code: 401,
      msg: '用户名或密码错误',
      data: null,
    });
  }),

  // 用户列表接口
  http.get('/api/system/user/list', () => {
    return HttpResponse.json({
      code: 200,
      msg: '操作成功',
      data: {
        rows: [
          { userId: 1, userName: 'admin', nickName: '管理员' },
          { userId: 2, userName: 'user', nickName: '普通用户' },
        ],
        total: 2,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
      },
    });
  }),
];
```

```typescript
// test/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

```typescript
// test/setup.ts
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### API 服务测试

```typescript
// test/unit/service/auth.spec.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { login, getUserInfo } from '@/service/api/auth';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';

describe('Auth API Service', () => {
  describe('login', () => {
    it('应该在凭证正确时返回 token', async () => {
      const result = await login({
        userName: 'admin',
        password: 'admin123',
      });

      expect(result.code).toBe(200);
      expect(result.data.token).toBeDefined();
    });

    it('应该在凭证错误时返回错误', async () => {
      const result = await login({
        userName: 'admin',
        password: 'wrong',
      });

      expect(result.code).toBe(401);
    });

    it('应该处理网络错误', async () => {
      server.use(
        http.post('/api/auth/login', () => {
          return HttpResponse.error();
        })
      );

      await expect(login({ userName: 'admin', password: 'admin123' }))
        .rejects.toThrow();
    });
  });
});
```

## Cypress E2E 测试

### Cypress 配置

```typescript
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
  },
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
});
```

### E2E 测试示例

```typescript
// cypress/e2e/auth.cy.ts
describe('认证流程', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('应该成功登录', () => {
    cy.get('[data-cy="username"]').type('admin');
    cy.get('[data-cy="password"]').type('admin123');
    cy.get('[data-cy="login-button"]').click();

    cy.url().should('include', '/dashboard');
    cy.get('[data-cy="user-avatar"]').should('be.visible');
  });

  it('应该显示错误消息当密码错误', () => {
    cy.get('[data-cy="username"]').type('admin');
    cy.get('[data-cy="password"]').type('wrongpassword');
    cy.get('[data-cy="login-button"]').click();

    cy.get('.n-message').should('contain', '密码错误');
    cy.url().should('include', '/login');
  });

  it('应该验证必填字段', () => {
    cy.get('[data-cy="login-button"]').click();

    cy.get('.n-form-item-feedback').should('be.visible');
  });
});
```

```typescript
// cypress/e2e/user-management.cy.ts
describe('用户管理', () => {
  beforeEach(() => {
    cy.login('admin', 'admin123'); // 自定义命令
    cy.visit('/system/user');
  });

  it('应该显示用户列表', () => {
    cy.get('[data-cy="user-table"]').should('be.visible');
    cy.get('[data-cy="user-row"]').should('have.length.at.least', 1);
  });

  it('应该能够创建新用户', () => {
    cy.get('[data-cy="add-user-button"]').click();
    
    cy.get('[data-cy="user-form"]').within(() => {
      cy.get('[data-cy="username-input"]').type('newuser');
      cy.get('[data-cy="nickname-input"]').type('新用户');
      cy.get('[data-cy="password-input"]').type('Test123!');
      cy.get('[data-cy="submit-button"]').click();
    });

    cy.get('.n-message').should('contain', '创建成功');
    cy.get('[data-cy="user-table"]').should('contain', 'newuser');
  });

  it('应该能够编辑用户', () => {
    cy.get('[data-cy="user-row"]').first().find('[data-cy="edit-button"]').click();
    
    cy.get('[data-cy="user-form"]').within(() => {
      cy.get('[data-cy="nickname-input"]').clear().type('更新后的昵称');
      cy.get('[data-cy="submit-button"]').click();
    });

    cy.get('.n-message').should('contain', '更新成功');
  });

  it('应该能够删除用户', () => {
    cy.get('[data-cy="user-row"]').last().find('[data-cy="delete-button"]').click();
    cy.get('[data-cy="confirm-button"]').click();

    cy.get('.n-message').should('contain', '删除成功');
  });
});
```

### Cypress 自定义命令

```typescript
// cypress/support/commands.ts
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: { userName: username, password },
  }).then((response) => {
    window.localStorage.setItem('token', response.body.data.token);
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>;
    }
  }
}
```

## 前端测试命令

```bash
# 运行单元测试
pnpm test

# 运行测试并监听变化
pnpm test:watch

# 运行测试并生成覆盖率报告
pnpm test:cov

# 运行 Cypress E2E 测试（交互模式）
pnpm cypress:open

# 运行 Cypress E2E 测试（无头模式）
pnpm cypress:run

# 运行所有测试
pnpm test:all
```

## 前端测试最佳实践

### 组件测试原则

1. **测试用户行为，而非实现细节**
2. **使用 data-cy 属性作为测试选择器**
3. **避免测试第三方组件库的内部实现**
4. **优先使用 @testing-library/vue 的查询方法**

### 测试覆盖优先级

1. **高优先级** - 必须测试
   - 认证相关组件
   - 表单验证逻辑
   - 核心业务组件

2. **中优先级** - 应该测试
   - 通用组件
   - Composables
   - 工具函数

3. **低优先级** - 可选测试
   - 纯展示组件
   - 第三方组件封装

### 测试数据管理

```typescript
// test/fixtures/user.fixture.ts
import { faker } from '@faker-js/faker/locale/zh_CN';

export function createUserFixture(overrides = {}) {
  return {
    userId: faker.number.int({ min: 1, max: 10000 }),
    userName: faker.internet.userName(),
    nickName: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number('1##########'),
    status: '0',
    ...overrides,
  };
}

export function createUserListFixture(count = 10) {
  return Array.from({ length: count }, () => createUserFixture());
}
```
