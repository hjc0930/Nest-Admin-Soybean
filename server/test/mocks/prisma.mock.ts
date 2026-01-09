/**
 * Prisma Mock 服务
 *
 * @description
 * 提供类型安全的 Prisma 服务 Mock 实现
 * 用于单元测试中隔离数据库依赖
 *
 * @requirements 5.1, 5.2
 */

import { PrismaClient } from '@prisma/client';

/**
 * Mock 方法类型
 */
export type MockMethod = jest.Mock<any, any>;

/**
 * 模型 Mock 类型
 */
export interface ModelMock {
  findUnique: MockMethod;
  findUniqueOrThrow: MockMethod;
  findFirst: MockMethod;
  findFirstOrThrow: MockMethod;
  findMany: MockMethod;
  create: MockMethod;
  createMany: MockMethod;
  update: MockMethod;
  updateMany: MockMethod;
  upsert: MockMethod;
  delete: MockMethod;
  deleteMany: MockMethod;
  count: MockMethod;
  aggregate: MockMethod;
  groupBy: MockMethod;
}

/**
 * 创建模型 Mock
 */
export const createModelMock = (): ModelMock => ({
  findUnique: jest.fn(),
  findUniqueOrThrow: jest.fn(),
  findFirst: jest.fn(),
  findFirstOrThrow: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  createMany: jest.fn(),
  update: jest.fn(),
  updateMany: jest.fn(),
  upsert: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
  count: jest.fn(),
  aggregate: jest.fn(),
  groupBy: jest.fn(),
});

/**
 * Prisma Mock 类型
 */
export interface MockPrismaService {
  // 用户相关
  sysUser: ModelMock;
  sysUserRole: ModelMock;
  sysUserPost: ModelMock;

  // 角色相关
  sysRole: ModelMock;
  sysRoleMenu: ModelMock;
  sysRoleDept: ModelMock;

  // 菜单相关
  sysMenu: ModelMock;

  // 部门相关
  sysDept: ModelMock;

  // 岗位相关
  sysPost: ModelMock;

  // 租户相关
  sysTenant: ModelMock;
  sysTenantPackage: ModelMock;

  // 字典相关
  sysDictType: ModelMock;
  sysDictData: ModelMock;

  // 配置相关
  sysConfig: ModelMock;

  // 日志相关
  sysOperLog: ModelMock;
  sysLoginLog: ModelMock;

  // 通知相关
  sysNotice: ModelMock;

  // 事务方法
  $transaction: MockMethod;
  $connect: MockMethod;
  $disconnect: MockMethod;
  $executeRaw: MockMethod;
  $queryRaw: MockMethod;

  // 重置所有 Mock
  _resetAll: () => void;
}

/**
 * 创建 Prisma Mock 服务
 *
 * @returns MockPrismaService 实例
 *
 * @example
 * ```typescript
 * const mockPrisma = createMockPrisma();
 * mockPrisma.sysUser.findUnique.mockResolvedValue(mockUser);
 * ```
 */
export const createMockPrisma = (): MockPrismaService => {
  const mock: MockPrismaService = {
    // 用户相关
    sysUser: createModelMock(),
    sysUserRole: createModelMock(),
    sysUserPost: createModelMock(),

    // 角色相关
    sysRole: createModelMock(),
    sysRoleMenu: createModelMock(),
    sysRoleDept: createModelMock(),

    // 菜单相关
    sysMenu: createModelMock(),

    // 部门相关
    sysDept: createModelMock(),

    // 岗位相关
    sysPost: createModelMock(),

    // 租户相关
    sysTenant: createModelMock(),
    sysTenantPackage: createModelMock(),

    // 字典相关
    sysDictType: createModelMock(),
    sysDictData: createModelMock(),

    // 配置相关
    sysConfig: createModelMock(),

    // 日志相关
    sysOperLog: createModelMock(),
    sysLoginLog: createModelMock(),

    // 通知相关
    sysNotice: createModelMock(),

    // 事务方法
    $transaction: jest.fn((callback) => {
      if (typeof callback === 'function') {
        return callback(mock);
      }
      return Promise.all(callback);
    }),
    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),
    $executeRaw: jest.fn().mockResolvedValue(0),
    $queryRaw: jest.fn().mockResolvedValue([]),

    // 重置所有 Mock
    _resetAll: () => {
      Object.keys(mock).forEach((key) => {
        const value = mock[key as keyof MockPrismaService];
        if (typeof value === 'object' && value !== null) {
          Object.values(value).forEach((method) => {
            if (typeof method === 'function' && 'mockReset' in method) {
              (method as MockMethod).mockReset();
            }
          });
        } else if (typeof value === 'function' && 'mockReset' in value) {
          (value as MockMethod).mockReset();
        }
      });
    },
  };

  return mock;
};

/**
 * 创建带有默认返回值的 Prisma Mock
 *
 * @param defaults 默认返回值配置
 * @returns 配置好的 MockPrismaService
 */
export const createMockPrismaWithDefaults = (
  defaults: Partial<Record<keyof MockPrismaService, Partial<Record<keyof ModelMock, any>>>>,
): MockPrismaService => {
  const mock = createMockPrisma();

  Object.entries(defaults).forEach(([modelName, methods]) => {
    const model = mock[modelName as keyof MockPrismaService];
    if (model && typeof model === 'object') {
      Object.entries(methods as Record<string, any>).forEach(([methodName, returnValue]) => {
        const method = (model as ModelMock)[methodName as keyof ModelMock];
        if (method && typeof method.mockResolvedValue === 'function') {
          method.mockResolvedValue(returnValue);
        }
      });
    }
  });

  return mock;
};

/**
 * 类型守卫：检查是否为 MockPrismaService
 */
export const isMockPrismaService = (obj: any): obj is MockPrismaService => {
  return obj && typeof obj._resetAll === 'function';
};

export default createMockPrisma;
