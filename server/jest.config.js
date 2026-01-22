/**
 * Jest 配置文件
 *
 * @description
 * 企业级测试配置，包含覆盖率阈值和测试环境设置
 * 支持单元测试、集成测试和E2E测试
 */
module.exports = {
  // 模块文件扩展名
  moduleFileExtensions: ['js', 'json', 'ts'],

  // 根目录
  rootDir: '.',

  // 测试文件匹配模式 - 支持 src/ 和 test/unit/ 目录下的测试
  testRegex: '(src|test/unit)/.*\\.(spec|pbt\\.spec)\\.ts$',

  // 转换器配置
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        isolatedModules: true,
        useESM: true,
      },
    ],
  },

  // 模块路径映射
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
    '^test/(.*)$': '<rootDir>/test/$1',
    // Mock @faker-js/faker 以避免 ESM 问题
    '^@faker-js/faker$': '<rootDir>/test/mocks/faker.mock.ts',
  },

  // Jest 模块解析
  modulePathIgnorePatterns: ['<rootDir>/dist/'],

  // 支持从test目录中的spec文件导入src中的文件
  // TypeScript会处理相对路径解析

  // 覆盖率收集配置
  collectCoverageFrom: [
    'src/**/*.ts',
    // 排除入口文件
    '!src/main.ts',
    // 排除模块定义文件
    '!src/**/*.module.ts',
    // 排除 DTO 和类型定义
    '!src/**/dto/**',
    '!src/**/types/**',
    '!src/**/*.d.ts',
    // 排除测试工具
    '!src/test-utils/**',
    // 排除配置文件
    '!src/config/index.ts',
    '!src/config/types/**',
    // 排除测试文件
    '!src/**/*.spec.ts',
    '!src/**/*.pbt.spec.ts',
  ],

  // 覆盖率输出目录
  coverageDirectory: './coverage',

  // 测试环境
  testEnvironment: 'node',

  // 企业级覆盖率阈值配置
  // 全局阈值: 行覆盖率 80%, 分支覆盖率 70%, 函数覆盖率 75%
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 80,
      statements: 80,
    },
    // 核心业务模块 - 更高要求
    './src/module/system/**/*.ts': {
      branches: 75,
      functions: 80,
      lines: 85,
      statements: 85,
    },
    // 安全模块 - 最高要求
    './src/security/**/*.ts': {
      branches: 80,
      functions: 85,
      lines: 90,
      statements: 90,
    },
  },

  // 覆盖率报告格式 - 多格式输出
  coverageReporters: [
    'text',           // 控制台文本输出
    'text-summary',   // 控制台摘要
    'lcov',           // CI/CD 集成
    'html',           // 本地查看
    'json',           // 自动化分析
    'clover',         // IDE 集成
  ],

  // 测试超时时间（毫秒）
  testTimeout: 30000,

  // 详细输出
  verbose: true,

  // 清除 Mock
  clearMocks: true,

  // 恢复 Mock
  restoreMocks: true,

  // 测试前执行的设置文件
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],

  // 忽略的路径
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // 转换忽略模式
  transformIgnorePatterns: [
    '/node_modules/',
  ],

  // 模块路径
  modulePaths: ['<rootDir>'],
};
