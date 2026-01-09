# API 开发规范

## Controller 开发规范

### 基本结构

```typescript
import { Controller, Get, Post, Put, Delete, Query, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Result } from '@/shared/response';

@ApiTags('模块名称')
@Controller('system/module-name')
@ApiBearerAuth('Authorization')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Get()
  @ApiOperation({ summary: '获取列表' })
  @ApiResponse({ status: 200, description: '成功' })
  async list(@Query() query: ListModuleDto) {
    return this.moduleService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取详情' })
  async getById(@Param('id') id: number) {
    return this.moduleService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: '创建' })
  async create(@Body() dto: CreateModuleDto) {
    return this.moduleService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新' })
  async update(@Param('id') id: number, @Body() dto: UpdateModuleDto) {
    return this.moduleService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除' })
  async delete(@Param('id') id: number) {
    return this.moduleService.delete(id);
  }
}
```

### 路由命名规范

- 使用 kebab-case: `/system/user-role`
- RESTful 风格:
  - `GET /users` - 列表
  - `GET /users/:id` - 详情
  - `POST /users` - 创建
  - `PUT /users/:id` - 更新
  - `DELETE /users/:id` - 删除

## Service 开发规范

### 基本结构

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma';
import { Result, ResponseCode } from '@/shared/response';

@Injectable()
export class ModuleService {
  private readonly logger = new Logger(ModuleService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 获取分页列表
   */
  async findAll(query: ListModuleDto) {
    const { skip, take, pageNum, pageSize } = query.toPaginationParams();
    const where = this.buildWhereCondition(query);

    const [rows, total] = await Promise.all([
      this.prisma.module.findMany({
        where,
        skip,
        take,
        orderBy: query.getOrderBy('createTime'),
      }),
      this.prisma.module.count({ where }),
    ]);

    return Result.page(rows, total, pageNum, pageSize);
  }

  /**
   * 根据 ID 获取详情
   */
  async findById(id: number) {
    const data = await this.prisma.module.findUnique({
      where: { id },
    });

    if (!data) {
      return Result.fail(ResponseCode.DATA_NOT_FOUND, '数据不存在');
    }

    return Result.ok(data);
  }

  /**
   * 创建
   */
  async create(dto: CreateModuleDto) {
    try {
      const data = await this.prisma.module.create({
        data: dto,
      });
      return Result.ok(data, '创建成功');
    } catch (error) {
      this.logger.error('创建失败', error);
      return Result.fail(ResponseCode.OPERATION_FAILED, '创建失败');
    }
  }

  /**
   * 更新
   */
  async update(id: number, dto: UpdateModuleDto) {
    const exists = await this.prisma.module.findUnique({ where: { id } });
    if (!exists) {
      return Result.fail(ResponseCode.DATA_NOT_FOUND, '数据不存在');
    }

    const data = await this.prisma.module.update({
      where: { id },
      data: dto,
    });

    return Result.ok(data, '更新成功');
  }

  /**
   * 删除
   */
  async delete(id: number) {
    const exists = await this.prisma.module.findUnique({ where: { id } });
    if (!exists) {
      return Result.fail(ResponseCode.DATA_NOT_FOUND, '数据不存在');
    }

    await this.prisma.module.delete({ where: { id } });
    return Result.ok(null, '删除成功');
  }

  /**
   * 构建查询条件
   */
  private buildWhereCondition(query: ListModuleDto) {
    const where: any = {};

    if (query.name) {
      where.name = { contains: query.name };
    }

    if (query.status) {
      where.status = query.status;
    }

    // 时间范围
    const dateRange = query.getDateRange('createTime');
    if (dateRange) {
      Object.assign(where, dateRange);
    }

    return where;
  }
}
```

## DTO 开发规范

### 请求 DTO

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsEmail, IsInt, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PageQueryDto } from '@/shared/dto';

/**
 * 列表查询 DTO
 */
export class ListModuleDto extends PageQueryDto {
  @ApiPropertyOptional({ description: '名称' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '状态', enum: ['0', '1'] })
  @IsOptional()
  @IsString()
  status?: string;
}

/**
 * 创建 DTO
 */
export class CreateModuleDto {
  @ApiProperty({ description: '名称', example: '示例名称' })
  @IsString()
  @IsNotEmpty({ message: '名称不能为空' })
  name: string;

  @ApiPropertyOptional({ description: '描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '排序', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sort?: number = 0;
}

/**
 * 更新 DTO
 */
export class UpdateModuleDto {
  @ApiPropertyOptional({ description: '名称' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '状态', enum: ['0', '1'] })
  @IsOptional()
  @IsString()
  status?: string;
}
```

### 响应 DTO

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { BaseResponseDto } from '@/shared/dto';

/**
 * 模块响应 DTO
 */
export class ModuleResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '名称' })
  @Expose()
  name: string;

  @ApiPropertyOptional({ description: '描述' })
  @Expose()
  description?: string;

  @ApiProperty({ description: '状态' })
  @Expose()
  status: string;

  @ApiProperty({ description: '创建时间' })
  @Expose()
  createTime: Date;

  // 敏感字段自动排除（继承自 BaseResponseDto）
  // delFlag, tenantId, createBy, updateBy
}
```

## 错误处理规范

### 使用 Result 返回错误

```typescript
// 数据不存在
return Result.fail(ResponseCode.DATA_NOT_FOUND, '用户不存在');

// 参数验证失败
return Result.fail(ResponseCode.PARAM_INVALID, '用户名不能为空');

// 业务逻辑错误
return Result.fail(ResponseCode.BUSINESS_ERROR, '该角色已被分配，无法删除');

// 权限不足
return Result.fail(ResponseCode.PERMISSION_DENIED, '无权访问该资源');
```

### 抛出异常

对于需要中断流程的错误，使用自定义异常：

```typescript
import { BusinessException } from '@/shared/exceptions';

// 业务异常
throw new BusinessException('用户名已存在', ResponseCode.USER_ALREADY_EXISTS);

// 未授权
throw new UnauthorizedException('请先登录');

// 禁止访问
throw new ForbiddenException('无权访问');
```

## 数据验证规范

### 常用验证装饰器

```typescript
import {
  IsString,
  IsInt,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsBoolean,
  IsDate,
  IsUrl,
  IsUUID,
  Min,
  Max,
  MinLength,
  MaxLength,
  Matches,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class ExampleDto {
  // 必填字符串
  @IsString()
  @IsNotEmpty({ message: '名称不能为空' })
  @MinLength(2, { message: '名称至少2个字符' })
  @MaxLength(50, { message: '名称最多50个字符' })
  name: string;

  // 可选邮箱
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  // 数字范围
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  age: number;

  // 枚举值
  @IsEnum(['0', '1'], { message: '状态值无效' })
  status: string;

  // 数组
  @IsArray()
  @ArrayMinSize(1, { message: '至少选择一项' })
  @IsInt({ each: true })
  roleIds: number[];

  // 正则匹配
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone: string;

  // 嵌套对象
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
```

## Swagger 文档规范

### 接口文档

```typescript
@ApiTags('用户管理')
@Controller('system/user')
export class UserController {
  @Get()
  @ApiOperation({ summary: '获取用户列表', description: '支持分页和条件筛选' })
  @ApiQuery({ name: 'pageNum', required: false, description: '页码' })
  @ApiQuery({ name: 'pageSize', required: false, description: '每页条数' })
  @ApiResponse({ status: 200, description: '成功', type: UserListResponseDto })
  @ApiResponse({ status: 401, description: '未授权' })
  async list(@Query() query: ListUserDto) {
    return this.userService.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: '创建用户' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 200, description: '创建成功' })
  @ApiResponse({ status: 400, description: '参数错误' })
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
}
```

### 响应类型定义

```typescript
import { ApiProperty } from '@nestjs/swagger';

class UserListDataDto {
  @ApiProperty({ description: '用户列表', type: [UserResponseDto] })
  rows: UserResponseDto[];

  @ApiProperty({ description: '总数' })
  total: number;

  @ApiProperty({ description: '页码' })
  pageNum: number;

  @ApiProperty({ description: '每页条数' })
  pageSize: number;

  @ApiProperty({ description: '总页数' })
  pages: number;
}

class UserListResponseDto {
  @ApiProperty({ description: '响应码', example: 200 })
  code: number;

  @ApiProperty({ description: '响应消息', example: '操作成功' })
  msg: string;

  @ApiProperty({ description: '响应数据', type: UserListDataDto })
  data: UserListDataDto;
}
```

## 权限控制规范

### 接口权限

```typescript
import { RequirePermission } from '@/core/decorators';

@Controller('system/user')
export class UserController {
  @Get()
  @RequirePermission('system:user:list')
  async list() {}

  @Post()
  @RequirePermission('system:user:add')
  async create() {}

  @Put(':id')
  @RequirePermission('system:user:edit')
  async update() {}

  @Delete(':id')
  @RequirePermission('system:user:remove')
  async delete() {}
}
```

### 公开接口

```typescript
import { NotRequireAuth } from '@/core/decorators';

@Controller('auth')
export class AuthController {
  @Post('login')
  @NotRequireAuth()
  async login() {}

  @Get('captcha')
  @NotRequireAuth()
  async getCaptcha() {}
}
```

## 日志规范

```typescript
import { Logger } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  async create(dto: CreateUserDto) {
    this.logger.log(`创建用户: ${dto.userName}`);
    
    try {
      const user = await this.prisma.user.create({ data: dto });
      this.logger.log(`用户创建成功: ${user.userId}`);
      return Result.ok(user);
    } catch (error) {
      this.logger.error(`用户创建失败: ${error.message}`, error.stack);
      return Result.fail(ResponseCode.OPERATION_FAILED);
    }
  }
}
```
