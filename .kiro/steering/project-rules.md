# Nest-Admin-Soybean 项目规范

## 项目概述

这是一个基于 Vue3 + NestJS 的企业级后台管理系统，采用多租户架构。

- **后端**: NestJS + Prisma + Redis + MySQL
- **前端**: Vue3 + Naive UI + TypeScript + Vite
- **测试框架**: Jest + fast-check (属性测试) + Vitest (单元测试) + Cypress (E2E 测试)
- **语言**: 全程用中文回答我

## 目录结构规范

### 后端 (server/)

```
server/
├── src/
│   ├── config/          # 配置模块
│   ├── core/            # 核心功能 (装饰器、过滤器、守卫、拦截器、中间件)
│   ├── infrastructure/  # 基础设施 (缓存、数据加载器、日志、Prisma、仓储)
│   ├── module/          # 业务模块
│   │   ├── main/        # 主模块 (认证)
│   │   ├── monitor/     # 监控模块
│   │   ├── system/      # 系统管理模块
│   │   └── upload/      # 上传模块
│   ├── observability/   # 可观测性 (审计、健康检查、指标)
│   ├── resilience/      # 弹性模块 (熔断器)
│   ├── security/        # 安全模块 (加密、登录)
│   ├── shared/          # 共享模块 (常量、DTO、实体、枚举、异常、响应、工具、验证器)
│   ├── tenant/          # 多租户模块
│   └── test-utils/      # 测试工具
├── test/                # 测试文件 (统一存放)
│   ├── e2e/             # E2E 测试
│   ├── integration/     # 集成测试
│   ├── unit/            # 单元测试
│   ├── fixtures/        # 测试数据
│   └── helpers/         # 测试辅助函数
└── prisma/              # Prisma 配置和迁移
```

### 前端 (admin-naive-ui/)

```
admin-naive-ui/
├── src/
│   ├── components/      # 组件
│   ├── hooks/           # 组合式函数
│   ├── layouts/         # 布局
│   ├── locales/         # 国际化
│   ├── router/          # 路由
│   ├── service/         # API 服务
│   ├── store/           # 状态管理
│   ├── typings/         # 类型定义
│   ├── utils/           # 工具函数
│   └── views/           # 页面视图
└── packages/            # 内部包
```

## 测试文件规范

### 测试文件位置

**所有测试文件统一放在 `server/test/` 目录下**，按测试类型分类：

- `test/unit/` - 单元测试
- `test/integration/` - 集成测试
- `test/e2e/` - E2E 测试

### 测试文件命名

- 单元测试: `*.spec.ts`
- 属性测试: `*.pbt.spec.ts`
- E2E 测试: `*.e2e-spec.ts`
- 属性 E2E 测试: `*.pbt.e2e-spec.ts`

### 测试命令

```bash
# 运行单元测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm test:cov

# 运行 E2E 测试
pnpm test:e2e

# 运行集成测试
pnpm test:integration
```

## API 响应格式规范

### 统一响应结构

所有 API 必须使用 `Result` 类返回统一格式：

```typescript
interface IResponse<T> {
  code: number;      // 响应码
  msg: string;       // 响应消息
  data: T | null;    // 响应数据
  requestId?: string; // 请求追踪 ID
  timestamp?: string; // 时间戳
}
```

### 响应码规范

- `200` - 成功
- `400-499` - 客户端错误
- `500-599` - 服务端错误
- `1000-1999` - 通用业务错误
- `2000-2999` - 认证授权错误
- `3000-3999` - 用户相关错误
- `4000-4999` - 租户相关错误
- `5000-5999` - 文件相关错误
- `6000-6999` - 第三方服务错误

### 使用示例

```typescript
// 成功响应
return Result.ok(data);
return Result.ok(data, '创建成功');

// 失败响应
return Result.fail(ResponseCode.USER_NOT_FOUND);
return Result.fail(ResponseCode.PARAM_INVALID, '用户名不能为空');

// 分页响应
return Result.page(rows, total, pageNum, pageSize);
```

## 分页规范

### 分页参数

```typescript
class PageQueryDto {
  pageNum?: number = 1;      // 页码（从1开始）
  pageSize?: number = 10;    // 每页条数（最大100）
  orderByColumn?: string;    // 排序字段
  isAsc?: 'asc' | 'desc';    // 排序方向
}
```

### 分页响应

```typescript
interface IPaginatedData<T> {
  rows: T[];        // 数据列表
  total: number;    // 总记录数
  pageNum: number;  // 当前页码
  pageSize: number; // 每页条数
  pages: number;    // 总页数
}
```

## 代码风格规范

### TypeScript

- 使用单引号
- 语句末尾加分号
- 缩进使用 2 空格
- 行宽限制 120 字符
- 使用尾随逗号

### 命名规范

- 类名: PascalCase (如 `UserService`)
- 方法/变量: camelCase (如 `getUserById`)
- 常量: UPPER_SNAKE_CASE (如 `MAX_PAGE_SIZE`)
- 文件名: kebab-case (如 `user-service.ts`)

### Controller 规范

```typescript
@Controller('system/user')
@ApiBearerAuth('Authorization')
@ApiTags('用户管理')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: '获取用户列表' })
  async list(@Query() query: ListUserDto) {
    return this.userService.findAll(query);
  }
}
```

### Service 规范

```typescript
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  async findAll(query: ListUserDto): Promise<Result<IPaginatedData<User>>> {
    const { skip, take } = query.toPaginationParams();
    const [rows, total] = await Promise.all([
      this.prisma.user.findMany({ skip, take }),
      this.prisma.user.count(),
    ]);
    return Result.page(rows, total, query.pageNum, query.pageSize);
  }
}
```

## DTO 规范

### 请求 DTO

- 继承 `PageQueryDto` 用于分页查询
- 使用 `class-validator` 装饰器进行验证
- 使用 `@ApiProperty` 添加 Swagger 文档

```typescript
export class CreateUserDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiPropertyOptional({ description: '邮箱' })
  @IsOptional()
  @IsEmail()
  email?: string;
}
```

### 响应 DTO

- 继承 `BaseResponseDto` 自动排除敏感字段
- 使用 `@Exclude()` 排除不需要返回的字段

```typescript
export class UserResponseDto extends BaseResponseDto {
  @ApiProperty({ description: '用户ID' })
  userId: number;

  @ApiProperty({ description: '用户名' })
  userName: string;

  @Exclude()
  password: string; // 不返回密码
}
```

## 多租户规范

- 所有业务表必须包含 `tenantId` 字段
- 使用 `@TenantAware()` 装饰器自动注入租户上下文
- 查询时自动过滤租户数据

## 安全规范

- 所有接口默认需要认证 (`@ApiBearerAuth`)
- 使用 `@NotRequireAuth()` 标记公开接口
- 敏感操作需要权限验证 (`@RequirePermission`)
- 密码使用 bcrypt 加密存储
