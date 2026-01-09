/**
 * MSW Server
 *
 * @description
 * 配置 MSW 服务器用于 Node.js 环境测试
 *
 * @requirements 14.1
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * MSW 服务器实例
 * 用于在 Node.js 环境中拦截网络请求
 */
export const server = setupServer(...handlers);

export default server;
