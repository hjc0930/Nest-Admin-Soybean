import { TenantContext } from './tenant.context';
import { createTenantMiddleware } from './tenant.middleware';
import { Prisma } from '@prisma/client';

/**
 * 多租户中间件集成测试
 *
 * 这些测试模拟真实的多租户场景，验证租户隔离是否正确工作
 */
describe('Tenant Middleware Integration Tests', () => {
  let middleware: Prisma.Middleware;
  let capturedParams: Prisma.MiddlewareParams;
  let mockResult: any;

  // 模拟 next 函数，捕获传递给数据库的参数
  const createNextFn = () =>
    jest.fn(async (params: Prisma.MiddlewareParams) => {
      capturedParams = { ...params };
      return mockResult;
    });

  beforeEach(() => {
    middleware = createTenantMiddleware();
    capturedParams = null as any;
    mockResult = [];
  });

  describe('Scenario: 租户数据隔离', () => {
    it('租户 A 查询用户列表时，只能看到自己租户的用户', async () => {
      const nextFn = createNextFn();

      await TenantContext.run({ tenantId: 'tenant_a' }, async () => {
        const params: Prisma.MiddlewareParams = {
          model: 'SysUser',
          action: 'findMany',
          args: { where: { status: '0' } },
          dataPath: [],
          runInTransaction: false,
        };

        await middleware(params, nextFn);
      });

      expect(capturedParams.args.where.tenantId).toBe('tenant_a');
    });

    it('租户 B 查询同一张表时，只能看到自己租户的数据', async () => {
      const nextFn = createNextFn();

      await TenantContext.run({ tenantId: 'tenant_b' }, async () => {
        const params: Prisma.MiddlewareParams = {
          model: 'SysUser',
          action: 'findMany',
          args: { where: { status: '0' } },
          dataPath: [],
          runInTransaction: false,
        };

        await middleware(params, nextFn);
      });

      expect(capturedParams.args.where.tenantId).toBe('tenant_b');
    });

    it('同一请求中切换租户上下文，查询条件应该正确切换', async () => {
      const nextFn = createNextFn();
      const tenantIds: string[] = [];

      // 租户 A 的查询
      await TenantContext.run({ tenantId: 'tenant_a' }, async () => {
        const params: Prisma.MiddlewareParams = {
          model: 'SysUser',
          action: 'findMany',
          args: { where: {} },
          dataPath: [],
          runInTransaction: false,
        };
        await middleware(params, nextFn);
        tenantIds.push(capturedParams.args.where.tenantId);
      });

      // 租户 B 的查询
      await TenantContext.run({ tenantId: 'tenant_b' }, async () => {
        const params: Prisma.MiddlewareParams = {
          model: 'SysUser',
          action: 'findMany',
          args: { where: {} },
          dataPath: [],
          runInTransaction: false,
        };
        await middleware(params, nextFn);
        tenantIds.push(capturedParams.args.where.tenantId);
      });

      expect(tenantIds).toEqual(['tenant_a', 'tenant_b']);
    });
  });

  describe('Scenario: 防止跨租户数据访问', () => {
    it('租户 A 通过 findUnique 查询租户 B 的数据时，应返回 null', async () => {
      // 模拟数据库返回租户 B 的数据
      mockResult = { id: 1, userName: 'user_b', tenantId: 'tenant_b' };
      const nextFn = createNextFn();

      const result = await TenantContext.run({ tenantId: 'tenant_a' }, async () => {
        const params: Prisma.MiddlewareParams = {
          model: 'SysUser',
          action: 'findUnique',
          args: { where: { id: 1 } },
          dataPath: [],
          runInTransaction: false,
        };
        return middleware(params, nextFn);
      });

      expect(result).toBeNull();
    });

    it('租户 A 尝试更新租户 B 的数据时，where 条件会限制只能更新自己的数据', async () => {
      const nextFn = createNextFn();

      await TenantContext.run({ tenantId: 'tenant_a' }, async () => {
        const params: Prisma.MiddlewareParams = {
          model: 'SysUser',
          action: 'update',
          args: {
            where: { id: 999 }, // 假设这是租户 B 的用户 ID
            data: { nickName: 'Hacked!' },
          },
          dataPath: [],
          runInTransaction: false,
        };
        await middleware(params, nextFn);
      });

      // where 条件会包含 tenantId，所以实际上不会更新到租户 B 的数据
      expect(capturedParams.args.where.tenantId).toBe('tenant_a');
    });

    it('租户 A 尝试删除租户 B 的数据时，where 条件会限制只能删除自己的数据', async () => {
      const nextFn = createNextFn();

      await TenantContext.run({ tenantId: 'tenant_a' }, async () => {
        const params: Prisma.MiddlewareParams = {
          model: 'SysUser',
          action: 'delete',
          args: { where: { id: 999 } },
          dataPath: [],
          runInTransaction: false,
        };
        await middleware(params, nextFn);
      });

      expect(capturedParams.args.where.tenantId).toBe('tenant_a');
    });

    it('租户 A 批量删除时，只能删除自己租户的数据', async () => {
      const nextFn = createNextFn();

      await TenantContext.run({ tenantId: 'tenant_a' }, async () => {
        const params: Prisma.MiddlewareParams = {
          model: 'SysUser',
          action: 'deleteMany',
          args: { where: { status: '1' } }, // 删除所有禁用用户
          dataPath: [],
          runInTransaction: false,
        };
        await middleware(params, nextFn);
      });

      expect(capturedParams.args.where.tenantId).toBe('tenant_a');
    });
  });

  describe('Scenario: 数据创建时自动设置租户', () => {
    it('租户 A 创建用户时，自动设置 tenantId', async () => {
      const nextFn = createNextFn();

      await TenantContext.run({ tenantId: 'tenant_a' }, async () => {
        const params: Prisma.MiddlewareParams = {
          model: 'SysUser',
          action: 'create',
          args: {
            data: { userName: 'newuser', nickName: 'New User' },
          },
          dataPath: [],
          runInTransaction: false,
        };
        await middleware(params, nextFn);
      });

      expect(capturedParams.args.data.tenantId).toBe('tenant_a');
    });

    it('租户 A 批量创建用户时，所有记录都设置正确的 tenantId', async () => {
      const nextFn = createNextFn();

      await TenantContext.run({ tenantId: 'tenant_a' }, async () => {
        const params: Prisma.MiddlewareParams = {
          model: 'SysUser',
          action: 'createMany',
          args: {
            data: [
              { userName: 'user1', nickName: 'User 1' },
              { userName: 'user2', nickName: 'User 2' },
              { userName: 'user3', nickName: 'User 3' },
            ],
          },
          dataPath: [],
          runInTransaction: false,
        };
        await middleware(params, nextFn);
      });

      expect(capturedParams.args.data).toHaveLength(3);
      capturedParams.args.data.forEach((item: any) => {
        expect(item.tenantId).toBe('tenant_a');
      });
    });

    it('创建时如果已指定 tenantId，不应覆盖', async () => {
      const nextFn = createNextFn();

      await TenantContext.run({ tenantId: 'tenant_a' }, async () => {
        const params: Prisma.MiddlewareParams = {
          model: 'SysUser',
          action: 'create',
          args: {
            data: { userName: 'admin', nickName: 'Admin', tenantId: 'tenant_b' },
          },
          dataPath: [],
          runInTransaction: false,
        };
        await middleware(params, nextFn);
      });

      // 保留原有的 tenantId
      expect(capturedParams.args.data.tenantId).toBe('tenant_b');
    });
  });

  describe('Scenario: 超级租户权限', () => {
    const SUPER_TENANT_ID = '000000';

    it('超级租户查询时，不添加租户过滤，可以看到所有数据', async () => {
      const nextFn = createNextFn();

      await TenantContext.run({ tenantId: SUPER_TENANT_ID }, async () => {
        const params: Prisma.MiddlewareParams = {
          model: 'SysUser',
          action: 'findMany',
          args: { where: { status: '0' } },
          dataPath: [],
          runInTransaction: false,
        };
        await middleware(params, nextFn);
      });

      expect(capturedParams.args.where.tenantId).toBeUndefined();
    });

    it('超级租户可以通过 findUnique 访问任何租户的数据', async () => {
      mockResult = { id: 1, userName: 'user_b', tenantId: 'tenant_b' };
      const nextFn = createNextFn();

      const result = await TenantContext.run({ tenantId: SUPER_TENANT_ID }, async () => {
        const params: Prisma.MiddlewareParams = {
          model: 'SysUser',
          action: 'findUnique',
          args: { where: { id: 1 } },
          dataPath: [],
          runInTransaction: false,
        };
        return middleware(params, nextFn);
      });

      expect(result).toEqual({ id: 1, userName: 'user_b', tenantId: 'tenant_b' });
    });

    it('超级租户更新数据时，不添加租户过滤', async () => {
      const nextFn = createNextFn();

      await TenantContext.run({ tenantId: SUPER_TENANT_ID }, async () => {
        const params: Prisma.MiddlewareParams = {
          model: 'SysUser',
          action: 'update',
          args: {
            where: { id: 1 },
            data: { status: '1' },
          },
          dataPath: [],
          runInTransaction: false,
        };
        await middleware(params, nextFn);
      });

      expect(capturedParams.args.where.tenantId).toBeUndefined();
    });
  });

  describe('Scenario: 忽略租户过滤', () => {
    it('设置 ignoreTenant 后，查询不添加租户过滤', async () => {
      const nextFn = createNextFn();

      await TenantContext.run({ tenantId: 'tenant_a', ignoreTenant: true }, async () => {
        const params: Prisma.MiddlewareParams = {
          model: 'SysUser',
          action: 'findMany',
          args: { where: { status: '0' } },
          dataPath: [],
          runInTransaction: false,
        };
        await middleware(params, nextFn);
      });

      expect(capturedParams.args.where.tenantId).toBeUndefined();
    });

    it('设置 ignoreTenant 后，可以访问其他租户的数据', async () => {
      mockResult = { id: 1, userName: 'user_b', tenantId: 'tenant_b' };
      const nextFn = createNextFn();

      const result = await TenantContext.run({ tenantId: 'tenant_a', ignoreTenant: true }, async () => {
        const params: Prisma.MiddlewareParams = {
          model: 'SysUser',
          action: 'findUnique',
          args: { where: { id: 1 } },
          dataPath: [],
          runInTransaction: false,
        };
        return middleware(params, nextFn);
      });

      expect(result).toEqual({ id: 1, userName: 'user_b', tenantId: 'tenant_b' });
    });

    it('动态切换 ignoreTenant 状态', async () => {
      const nextFn = createNextFn();
      const results: (string | undefined)[] = [];

      await TenantContext.run({ tenantId: 'tenant_a', ignoreTenant: false }, async () => {
        // 第一次查询：有租户过滤
        const params1: Prisma.MiddlewareParams = {
          model: 'SysUser',
          action: 'findMany',
          args: { where: {} },
          dataPath: [],
          runInTransaction: false,
        };
        await middleware(params1, nextFn);
        results.push(capturedParams.args.where.tenantId);

        // 切换为忽略租户
        TenantContext.setIgnoreTenant(true);

        // 第二次查询：无租户过滤
        const params2: Prisma.MiddlewareParams = {
          model: 'SysUser',
          action: 'findMany',
          args: { where: {} },
          dataPath: [],
          runInTransaction: false,
        };
        await middleware(params2, nextFn);
        results.push(capturedParams.args.where.tenantId);
      });

      expect(results).toEqual(['tenant_a', undefined]);
    });
  });

  describe('Scenario: 复杂查询条件', () => {
    it('带 AND 条件的查询，正确添加租户过滤', async () => {
      const nextFn = createNextFn();

      await TenantContext.run({ tenantId: 'tenant_a' }, async () => {
        const params: Prisma.MiddlewareParams = {
          model: 'SysUser',
          action: 'findMany',
          args: {
            where: {
              AND: [{ status: '0' }, { delFlag: '0' }],
            },
          },
          dataPath: [],
          runInTransaction: false,
        };
        await middleware(params, nextFn);
      });

      expect(capturedParams.args.where.AND).toContainEqual({ tenantId: 'tenant_a' });
    });

    it('带 OR 条件的查询，正确包装租户过滤', async () => {
      const nextFn = createNextFn();

      await TenantContext.run({ tenantId: 'tenant_a' }, async () => {
        const params: Prisma.MiddlewareParams = {
          model: 'SysUser',
          action: 'findMany',
          args: {
            where: {
              OR: [{ userName: 'admin' }, { userName: 'test' }],
            },
          },
          dataPath: [],
          runInTransaction: false,
        };
        await middleware(params, nextFn);
      });

      // OR 条件应该被包装在 AND 中
      expect(capturedParams.args.where.AND).toBeDefined();
      expect(capturedParams.args.where.AND[0]).toEqual({ tenantId: 'tenant_a' });
      expect(capturedParams.args.where.AND[1]).toEqual({
        OR: [{ userName: 'admin' }, { userName: 'test' }],
      });
    });

    it('聚合查询也应用租户过滤', async () => {
      const nextFn = createNextFn();

      await TenantContext.run({ tenantId: 'tenant_a' }, async () => {
        const params: Prisma.MiddlewareParams = {
          model: 'SysUser',
          action: 'count',
          args: { where: { status: '0' } },
          dataPath: [],
          runInTransaction: false,
        };
        await middleware(params, nextFn);
      });

      expect(capturedParams.args.where.tenantId).toBe('tenant_a');
    });

    it('groupBy 查询也应用租户过滤', async () => {
      const nextFn = createNextFn();

      await TenantContext.run({ tenantId: 'tenant_a' }, async () => {
        const params: Prisma.MiddlewareParams = {
          model: 'SysUser',
          action: 'groupBy',
          args: {
            by: ['status'],
            where: {},
            _count: true,
          },
          dataPath: [],
          runInTransaction: false,
        };
        await middleware(params, nextFn);
      });

      expect(capturedParams.args.where.tenantId).toBe('tenant_a');
    });
  });

  describe('Scenario: 非租户模型', () => {
    it('非租户模型（如 GenTable）不添加租户过滤', async () => {
      const nextFn = createNextFn();

      await TenantContext.run({ tenantId: 'tenant_a' }, async () => {
        const params: Prisma.MiddlewareParams = {
          model: 'GenTable',
          action: 'findMany',
          args: { where: { status: '0' } },
          dataPath: [],
          runInTransaction: false,
        };
        await middleware(params, nextFn);
      });

      expect(capturedParams.args.where.tenantId).toBeUndefined();
    });

    it('SysTenant 模型本身不添加租户过滤', async () => {
      const nextFn = createNextFn();

      await TenantContext.run({ tenantId: 'tenant_a' }, async () => {
        const params: Prisma.MiddlewareParams = {
          model: 'SysTenant',
          action: 'findMany',
          args: { where: {} },
          dataPath: [],
          runInTransaction: false,
        };
        await middleware(params, nextFn);
      });

      expect(capturedParams.args.where.tenantId).toBeUndefined();
    });
  });

  describe('Scenario: Upsert 操作', () => {
    it('upsert 创建时设置租户ID，更新时添加租户过滤', async () => {
      const nextFn = createNextFn();

      await TenantContext.run({ tenantId: 'tenant_a' }, async () => {
        const params: Prisma.MiddlewareParams = {
          model: 'SysUser',
          action: 'upsert',
          args: {
            where: { id: 1 },
            create: { userName: 'newuser', nickName: 'New User' },
            update: { nickName: 'Updated User' },
          },
          dataPath: [],
          runInTransaction: false,
        };
        await middleware(params, nextFn);
      });

      expect(capturedParams.args.create.tenantId).toBe('tenant_a');
      expect(capturedParams.args.where.tenantId).toBe('tenant_a');
    });
  });

  describe('Scenario: 无租户上下文', () => {
    it('没有租户上下文时，不添加租户过滤', async () => {
      const nextFn = createNextFn();

      // 不在 TenantContext.run 中执行
      const params: Prisma.MiddlewareParams = {
        model: 'SysUser',
        action: 'findMany',
        args: { where: { status: '0' } },
        dataPath: [],
        runInTransaction: false,
      };
      await middleware(params, nextFn);

      expect(capturedParams.args.where.tenantId).toBeUndefined();
    });

    it('没有租户上下文时，创建数据不设置租户ID', async () => {
      const nextFn = createNextFn();

      const params: Prisma.MiddlewareParams = {
        model: 'SysUser',
        action: 'create',
        args: {
          data: { userName: 'test', nickName: 'Test' },
        },
        dataPath: [],
        runInTransaction: false,
      };
      await middleware(params, nextFn);

      expect(capturedParams.args.data.tenantId).toBeUndefined();
    });
  });

  describe('Scenario: 并发多租户请求', () => {
    it('并发请求时，每个请求使用正确的租户上下文', async () => {
      const nextFn = createNextFn();
      const results: string[] = [];

      // 模拟并发请求
      await Promise.all([
        TenantContext.run({ tenantId: 'tenant_1' }, async () => {
          const params: Prisma.MiddlewareParams = {
            model: 'SysUser',
            action: 'findMany',
            args: { where: {} },
            dataPath: [],
            runInTransaction: false,
          };
          await middleware(params, nextFn);
          results.push(capturedParams.args.where.tenantId);
        }),
        TenantContext.run({ tenantId: 'tenant_2' }, async () => {
          const params: Prisma.MiddlewareParams = {
            model: 'SysUser',
            action: 'findMany',
            args: { where: {} },
            dataPath: [],
            runInTransaction: false,
          };
          await middleware(params, nextFn);
          results.push(capturedParams.args.where.tenantId);
        }),
        TenantContext.run({ tenantId: 'tenant_3' }, async () => {
          const params: Prisma.MiddlewareParams = {
            model: 'SysUser',
            action: 'findMany',
            args: { where: {} },
            dataPath: [],
            runInTransaction: false,
          };
          await middleware(params, nextFn);
          results.push(capturedParams.args.where.tenantId);
        }),
      ]);

      // 所有结果都应该是有效的租户ID
      expect(results).toHaveLength(3);
      results.forEach((tenantId) => {
        expect(['tenant_1', 'tenant_2', 'tenant_3']).toContain(tenantId);
      });
    });
  });

  describe('Scenario: 所有租户模型覆盖', () => {
    const TENANT_MODELS: Prisma.ModelName[] = [
      'SysConfig',
      'SysDept',
      'SysDictData',
      'SysDictType',
      'SysJob',
      'SysLogininfor',
      'SysMenu',
      'SysNotice',
      'SysOperLog',
      'SysPost',
      'SysRole',
      'SysUpload',
      'SysUser',
    ];

    TENANT_MODELS.forEach((model) => {
      it(`${model} 模型应用租户过滤`, async () => {
        const nextFn = createNextFn();

        await TenantContext.run({ tenantId: 'tenant_test' }, async () => {
          const params: Prisma.MiddlewareParams = {
            model,
            action: 'findMany',
            args: { where: {} },
            dataPath: [],
            runInTransaction: false,
          };
          await middleware(params, nextFn);
        });

        expect(capturedParams.args.where.tenantId).toBe('tenant_test');
      });
    });
  });
});
