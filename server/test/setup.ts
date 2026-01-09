/**
 * Jest 测试设置文件
 *
 * @description
 * 在所有测试运行前执行的全局设置
 * 企业级测试配置，包含环境变量、Mock 重置和数据清理
 */

// 导入 reflect-metadata 以支持 class-transformer 装饰器
import 'reflect-metadata';

// 设置测试环境变量
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing';
process.env.JWT_EXPIRES_IN = '1h';
process.env.DATABASE_URL = 'mysql://test:test@localhost:3306/test_db';
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';

// 设置测试超时时间
jest.setTimeout(30000);

// Mock 状态存储（用于验证 Mock 重置）
const mockStateRegistry = new Map<string, any>();

/**
 * 注册 Mock 状态
 */
export function registerMockState(name: string, mock: any): void {
  mockStateRegistry.set(name, mock);
}

/**
 * 获取 Mock 状态
 */
export function getMockState(name: string): any {
  return mockStateRegistry.get(name);
}

/**
 * 重置所有注册的 Mock 状态
 */
export function resetAllMockStates(): void {
  mockStateRegistry.forEach((mock, name) => {
    if (typeof mock.mockReset === 'function') {
      mock.mockReset();
    }
    if (typeof mock._clear === 'function') {
      mock._clear();
    }
  });
}

// 全局 Mock 设置
beforeAll(() => {
  // 禁用控制台输出（可选）
  // jest.spyOn(console, 'log').mockImplementation(() => {});
  // jest.spyOn(console, 'warn').mockImplementation(() => {});
  // jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  // 恢复控制台输出
  jest.restoreAllMocks();
  // 清理 Mock 状态注册表
  mockStateRegistry.clear();
});

// 每个测试后清理
afterEach(() => {
  // 清除所有 Mock 调用记录
  jest.clearAllMocks();
  // 重置所有注册的 Mock 状态
  resetAllMockStates();
});

// 全局错误处理
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// 导出测试工具函数
export { mockStateRegistry };
