/**
 * Cypress E2E 支持文件
 *
 * @description
 * 配置全局命令和钩子
 *
 * @requirements 12.2
 */

// 导入自定义命令
import './commands';

// 全局钩子
beforeEach(() => {
  // 清除本地存储
  cy.clearLocalStorage();
});

// 处理未捕获的异常
Cypress.on('uncaught:exception', (err, runnable) => {
  // 返回 false 以防止 Cypress 失败测试
  console.error('Uncaught exception:', err.message);
  return false;
});
