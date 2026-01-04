import { Prisma } from '@prisma/client';
import { TenantContext } from './tenant.context';

/**
 * 需要租户隔离的模型列表
 */
export const TENANT_MODELS = [
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

/**
 * 检查模型是否需要租户过滤
 */
export function hasTenantField(model: string): boolean {
  return TENANT_MODELS.includes(model);
}

/**
 * 添加租户过滤条件
 */
export function addTenantFilter(model: string, args: any): any {
  if (!hasTenantField(model)) {
    return args;
  }

  if (TenantContext.isIgnoreTenant() || TenantContext.isSuperTenant()) {
    return args;
  }

  const tenantId = TenantContext.getTenantId();
  if (!tenantId) {
    return args;
  }

  args = args || {};
  args.where = args.where || {};

  // 处理复杂的 where 条件
  if (args.where.AND) {
    args.where.AND.push({ tenantId });
  } else if (args.where.OR) {
    args.where = {
      AND: [{ tenantId }, { OR: args.where.OR }],
    };
  } else {
    args.where.tenantId = tenantId;
  }

  return args;
}

/**
 * 创建时设置租户ID
 */
export function setTenantId(model: string, args: any): any {
  if (!hasTenantField(model)) {
    return args;
  }

  const tenantId = TenantContext.getTenantId();
  if (!tenantId) {
    return args;
  }

  args = args || {};
  args.data = args.data || {};

  if (!args.data.tenantId) {
    args.data.tenantId = tenantId;
  }

  return args;
}

/**
 * 批量创建时设置租户ID
 */
export function setTenantIdForMany(model: string, args: any): any {
  if (!hasTenantField(model)) {
    return args;
  }

  const tenantId = TenantContext.getTenantId();
  if (!tenantId) {
    return args;
  }

  args = args || {};
  if (Array.isArray(args.data)) {
    args.data = args.data.map((item: any) => ({
      ...item,
      tenantId: item.tenantId || tenantId,
    }));
  }

  return args;
}

/**
 * upsert 时设置租户ID
 */
export function setTenantIdForUpsert(model: string, args: any): any {
  if (!hasTenantField(model)) {
    return args;
  }

  const tenantId = TenantContext.getTenantId();
  if (!tenantId) {
    return args;
  }

  args = args || {};

  // 设置 create 数据的租户ID
  if (args.create && !args.create.tenantId) {
    args.create.tenantId = tenantId;
  }

  // 添加 where 条件的租户过滤
  args = addTenantFilter(model, args);

  return args;
}

/**
 * 验证查询结果是否属于当前租户 (用于 findUnique)
 */
export function validateTenantOwnership(model: string, result: any): any {
  if (!result || !hasTenantField(model)) {
    return result;
  }

  if (TenantContext.isIgnoreTenant() || TenantContext.isSuperTenant()) {
    return result;
  }

  const currentTenantId = TenantContext.getTenantId();
  if (!currentTenantId) {
    return result;
  }

  if (result.tenantId && result.tenantId !== currentTenantId) {
    return null;
  }

  return result;
}

/**
 * 需要添加租户过滤的查询操作
 */
const FILTER_ACTIONS = [
  'findMany',
  'findFirst',
  'findFirstOrThrow',
  'count',
  'aggregate',
  'groupBy',
  'updateMany',
  'deleteMany',
];

/**
 * 需要添加租户过滤的更新/删除操作
 */
const MODIFY_ACTIONS = ['update', 'delete'];

/**
 * 需要设置租户ID的创建操作
 */
const CREATE_ACTIONS = ['create'];

/**
 * 创建 Prisma 租户中间件
 *
 * 该中间件会自动为需要租户隔离的模型添加租户过滤条件，
 * 并在创建数据时自动设置租户ID。
 *
 * @returns Prisma 中间件
 */
export function createTenantMiddleware(): Prisma.Middleware {
  return async (
    params: Prisma.MiddlewareParams,
    next: (params: Prisma.MiddlewareParams) => Promise<unknown>,
  ) => {
    const { model, action, args } = params;

    if (!model) {
      return next(params);
    }

    // 查询操作：添加租户过滤
    if (FILTER_ACTIONS.includes(action)) {
      params.args = addTenantFilter(model, args);
    }
    // 更新/删除操作：添加租户过滤
    else if (MODIFY_ACTIONS.includes(action)) {
      params.args = addTenantFilter(model, args);
    }
    // 创建操作：设置租户ID
    else if (CREATE_ACTIONS.includes(action)) {
      params.args = setTenantId(model, args);
    }
    // 批量创建：设置租户ID
    else if (action === 'createMany') {
      params.args = setTenantIdForMany(model, args);
    }
    // upsert：设置租户ID并添加过滤
    else if (action === 'upsert') {
      params.args = setTenantIdForUpsert(model, args);
    }
    // findUnique：执行后验证租户归属
    else if (action === 'findUnique') {
      const result = await next(params);
      return validateTenantOwnership(model, result);
    }

    return next(params);
  };
}
