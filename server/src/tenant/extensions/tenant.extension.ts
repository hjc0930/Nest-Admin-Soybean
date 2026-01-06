/**
 * @deprecated 请使用 tenant/middleware/tenant.middleware.ts 中的 createTenantMiddleware
 *
 * 此文件保留用于向后兼容，实际的租户隔离逻辑已迁移到中间件实现。
 * PrismaService 现在使用 createTenantMiddleware() 来实现租户隔离。
 *
 * @see ../middleware/tenant.middleware.ts
 */

// 重新导出中间件相关的函数，保持向后兼容
export {
  createTenantMiddleware,
  TENANT_MODELS,
  hasTenantField,
  addTenantFilter,
  setTenantId,
  setTenantIdForMany,
  setTenantIdForUpsert,
  validateTenantOwnership,
} from '../middleware/tenant.middleware';
