import * as fc from 'fast-check';
import { TenantContext } from './tenant.context';
import {
  createTenantMiddleware,
  addTenantFilter,
  setTenantId,
  setTenantIdForMany,
  validateTenantOwnership,
  hasTenantField,
  TENANT_MODELS,
} from './tenant.middleware';
import { Prisma } from '@prisma/client';

/**
 * 多租户中间件属性测试
 *
 * 使用 fast-check 进行属性测试，验证租户隔离的核心不变量
 */
describe('Tenant Middleware Property-Based Tests', () => {
  // 生成有效的租户ID（6位数字字符串）
  const tenantIdArb = fc.stringMatching(/^[0-9]{6}$/);

  // 生成非超级租户ID（不是 000000）
  const normalTenantIdArb = tenantIdArb.filter((id) => id !== '000000');

  // 生成租户模型名称
  const tenantModelArb = fc.constantFrom(...TENANT_MODELS);

  // 生成非租户模型名称
  const nonTenantModelArb = fc.constantFrom('GenTable', 'GenTableColumn', 'SysTenant', 'SysTenantPackage');

  describe('Property: 租户过滤不变量', () => {
    it('对于任意普通租户和租户模型，查询必须包含租户过滤', async () => {
      await fc.assert(
        fc.asyncProperty(normalTenantIdArb, tenantModelArb, async (tenantId, model) => {
          const result = await TenantContext.run({ tenantId }, async () => {
            return addTenantFilter(model, { where: {} });
          });

          // 不变量：结果必须包含租户ID过滤
          expect(result.where.tenantId).toBe(tenantId);
        }),
        { numRuns: 100 },
      );
    });

    it('对于任意租户和非租户模型，查询不应包含租户过滤', async () => {
      await fc.assert(
        fc.asyncProperty(tenantIdArb, nonTenantModelArb, async (tenantId, model) => {
          const result = await TenantContext.run({ tenantId }, async () => {
            return addTenantFilter(model, { where: { status: '0' } });
          });

          // 不变量：非租户模型不应有租户过滤
          expect(result.where.tenantId).toBeUndefined();
        }),
        { numRuns: 50 },
      );
    });

    it('超级租户（000000）查询任何租户模型都不添加过滤', async () => {
      await fc.assert(
        fc.asyncProperty(tenantModelArb, async (model) => {
          const result = await TenantContext.run({ tenantId: '000000' }, async () => {
            return addTenantFilter(model, { where: {} });
          });

          // 不变量：超级租户不添加租户过滤
          expect(result.where.tenantId).toBeUndefined();
        }),
        { numRuns: 50 },
      );
    });

    it('设置 ignoreTenant 后，任何租户查询都不添加过滤', async () => {
      await fc.assert(
        fc.asyncProperty(normalTenantIdArb, tenantModelArb, async (tenantId, model) => {
          const result = await TenantContext.run({ tenantId, ignoreTenant: true }, async () => {
            return addTenantFilter(model, { where: {} });
          });

          // 不变量：ignoreTenant 时不添加租户过滤
          expect(result.where.tenantId).toBeUndefined();
        }),
        { numRuns: 50 },
      );
    });
  });

  describe('Property: 数据创建租户设置', () => {
    it('对于任意普通租户创建租户模型数据，必须设置租户ID', async () => {
      await fc.assert(
        fc.asyncProperty(
          normalTenantIdArb,
          tenantModelArb,
          fc.record({ userName: fc.string(), nickName: fc.string() }),
          async (tenantId, model, data) => {
            const result = await TenantContext.run({ tenantId }, async () => {
              return setTenantId(model, { data });
            });

            // 不变量：创建数据必须包含租户ID
            expect(result.data.tenantId).toBe(tenantId);
          },
        ),
        { numRuns: 100 },
      );
    });

    it('创建时已有租户ID的数据，不应被覆盖', async () => {
      await fc.assert(
        fc.asyncProperty(normalTenantIdArb, normalTenantIdArb, tenantModelArb, async (contextTenantId, dataTenantId, model) => {
          // 确保两个租户ID不同
          fc.pre(contextTenantId !== dataTenantId);

          const result = await TenantContext.run({ tenantId: contextTenantId }, async () => {
            return setTenantId(model, { data: { userName: 'test', tenantId: dataTenantId } });
          });

          // 不变量：已有的租户ID不应被覆盖
          expect(result.data.tenantId).toBe(dataTenantId);
        }),
        { numRuns: 50 },
      );
    });

    it('批量创建时，所有记录都设置正确的租户ID', async () => {
      await fc.assert(
        fc.asyncProperty(
          normalTenantIdArb,
          tenantModelArb,
          fc.array(fc.record({ userName: fc.string() }), { minLength: 1, maxLength: 10 }),
          async (tenantId, model, dataArray) => {
            const result = await TenantContext.run({ tenantId }, async () => {
              return setTenantIdForMany(model, { data: dataArray });
            });

            // 不变量：所有记录都必须有租户ID
            result.data.forEach((item: any) => {
              expect(item.tenantId).toBe(tenantId);
            });
          },
        ),
        { numRuns: 50 },
      );
    });
  });

  describe('Property: 数据访问验证', () => {
    it('普通租户只能访问自己租户的数据', async () => {
      await fc.assert(
        fc.asyncProperty(normalTenantIdArb, normalTenantIdArb, tenantModelArb, async (contextTenantId, dataTenantId, model) => {
          const data = { id: 1, userName: 'test', tenantId: dataTenantId };

          const result = await TenantContext.run({ tenantId: contextTenantId }, async () => {
            return validateTenantOwnership(model, data);
          });

          if (contextTenantId === dataTenantId) {
            // 不变量：相同租户可以访问
            expect(result).toEqual(data);
          } else {
            // 不变量：不同租户返回 null
            expect(result).toBeNull();
          }
        }),
        { numRuns: 100 },
      );
    });

    it('超级租户可以访问任何租户的数据', async () => {
      await fc.assert(
        fc.asyncProperty(normalTenantIdArb, tenantModelArb, async (dataTenantId, model) => {
          const data = { id: 1, userName: 'test', tenantId: dataTenantId };

          const result = await TenantContext.run({ tenantId: '000000' }, async () => {
            return validateTenantOwnership(model, data);
          });

          // 不变量：超级租户可以访问任何数据
          expect(result).toEqual(data);
        }),
        { numRuns: 50 },
      );
    });

    it('ignoreTenant 时可以访问任何租户的数据', async () => {
      await fc.assert(
        fc.asyncProperty(normalTenantIdArb, normalTenantIdArb, tenantModelArb, async (contextTenantId, dataTenantId, model) => {
          const data = { id: 1, userName: 'test', tenantId: dataTenantId };

          const result = await TenantContext.run({ tenantId: contextTenantId, ignoreTenant: true }, async () => {
            return validateTenantOwnership(model, data);
          });

          // 不变量：ignoreTenant 时可以访问任何数据
          expect(result).toEqual(data);
        }),
        { numRuns: 50 },
      );
    });
  });

  describe('Property: 中间件行为一致性', () => {
    it('中间件对所有查询操作行为一致', async () => {
      const queryActions: Prisma.PrismaAction[] = ['findMany', 'findFirst', 'findFirstOrThrow', 'count', 'aggregate', 'groupBy'];

      await fc.assert(
        fc.asyncProperty(normalTenantIdArb, tenantModelArb, fc.constantFrom(...queryActions), async (tenantId, model, action) => {
          const middleware = createTenantMiddleware();
          const nextFn = jest.fn().mockResolvedValue([]);

          await TenantContext.run({ tenantId }, async () => {
            const params: Prisma.MiddlewareParams = {
              model: model as Prisma.ModelName,
              action,
              args: { where: {} },
              dataPath: [],
              runInTransaction: false,
            };
            await middleware(params, nextFn);

            // 不变量：所有查询操作都添加租户过滤
            expect(params.args.where.tenantId).toBe(tenantId);
          });
        }),
        { numRuns: 100 },
      );
    });

    it('中间件对所有修改操作行为一致', async () => {
      const modifyActions: Prisma.PrismaAction[] = ['update', 'delete', 'updateMany', 'deleteMany'];

      await fc.assert(
        fc.asyncProperty(normalTenantIdArb, tenantModelArb, fc.constantFrom(...modifyActions), async (tenantId, model, action) => {
          const middleware = createTenantMiddleware();
          const nextFn = jest.fn().mockResolvedValue({ count: 1 });

          await TenantContext.run({ tenantId }, async () => {
            const params: Prisma.MiddlewareParams = {
              model: model as Prisma.ModelName,
              action,
              args: { where: { id: 1 }, data: { status: '1' } },
              dataPath: [],
              runInTransaction: false,
            };
            await middleware(params, nextFn);

            // 不变量：所有修改操作都添加租户过滤
            expect(params.args.where.tenantId).toBe(tenantId);
          });
        }),
        { numRuns: 100 },
      );
    });
  });

  describe('Property: 模型分类正确性', () => {
    it('hasTenantField 对所有 TENANT_MODELS 返回 true', async () => {
      await fc.assert(
        fc.asyncProperty(tenantModelArb, async (model) => {
          expect(hasTenantField(model)).toBe(true);
        }),
        { numRuns: 50 },
      );
    });

    it('hasTenantField 对非租户模型返回 false', async () => {
      await fc.assert(
        fc.asyncProperty(nonTenantModelArb, async (model) => {
          expect(hasTenantField(model)).toBe(false);
        }),
        { numRuns: 50 },
      );
    });
  });

  describe('Property: 边界条件', () => {
    it('空 where 条件时正确添加租户过滤', async () => {
      await fc.assert(
        fc.asyncProperty(normalTenantIdArb, tenantModelArb, async (tenantId, model) => {
          const result = await TenantContext.run({ tenantId }, async () => {
            return addTenantFilter(model, {});
          });

          expect(result.where).toBeDefined();
          expect(result.where.tenantId).toBe(tenantId);
        }),
        { numRuns: 50 },
      );
    });

    it('null args 时正确处理', async () => {
      await fc.assert(
        fc.asyncProperty(normalTenantIdArb, tenantModelArb, async (tenantId, model) => {
          const result = await TenantContext.run({ tenantId }, async () => {
            return addTenantFilter(model, null);
          });

          expect(result.where).toBeDefined();
          expect(result.where.tenantId).toBe(tenantId);
        }),
        { numRuns: 50 },
      );
    });

    it('undefined args 时正确处理', async () => {
      await fc.assert(
        fc.asyncProperty(normalTenantIdArb, tenantModelArb, async (tenantId, model) => {
          const result = await TenantContext.run({ tenantId }, async () => {
            return addTenantFilter(model, undefined);
          });

          expect(result.where).toBeDefined();
          expect(result.where.tenantId).toBe(tenantId);
        }),
        { numRuns: 50 },
      );
    });
  });

  describe('Property: 租户隔离安全性', () => {
    it('任意两个不同租户之间数据完全隔离', async () => {
      await fc.assert(
        fc.asyncProperty(normalTenantIdArb, normalTenantIdArb, tenantModelArb, async (tenantA, tenantB, model) => {
          // 确保两个租户不同
          fc.pre(tenantA !== tenantB);

          // 租户 A 的查询条件
          const queryA = await TenantContext.run({ tenantId: tenantA }, async () => {
            return addTenantFilter(model, { where: {} });
          });

          // 租户 B 的查询条件
          const queryB = await TenantContext.run({ tenantId: tenantB }, async () => {
            return addTenantFilter(model, { where: {} });
          });

          // 不变量：两个租户的查询条件必须不同
          expect(queryA.where.tenantId).not.toBe(queryB.where.tenantId);
          expect(queryA.where.tenantId).toBe(tenantA);
          expect(queryB.where.tenantId).toBe(tenantB);
        }),
        { numRuns: 100 },
      );
    });

    it('租户 A 创建的数据不会被设置为租户 B 的数据', async () => {
      await fc.assert(
        fc.asyncProperty(normalTenantIdArb, normalTenantIdArb, tenantModelArb, async (tenantA, tenantB, model) => {
          fc.pre(tenantA !== tenantB);

          const result = await TenantContext.run({ tenantId: tenantA }, async () => {
            return setTenantId(model, { data: { userName: 'test' } });
          });

          // 不变量：创建的数据租户ID必须是当前上下文的租户
          expect(result.data.tenantId).toBe(tenantA);
          expect(result.data.tenantId).not.toBe(tenantB);
        }),
        { numRuns: 100 },
      );
    });
  });
});
