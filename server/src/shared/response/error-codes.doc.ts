/**
 * 错误码文档生成器
 *
 * @description 用于生成 API 错误码文档，可在 Swagger 中展示
 */

import { ResponseCode, ResponseMessage } from './response.interface';

/**
 * 错误码分类
 */
export enum ErrorCodeCategory {
  SUCCESS = '成功',
  CLIENT_ERROR = '客户端错误 (400-499)',
  SERVER_ERROR = '服务端错误 (500-599)',
  BUSINESS_ERROR = '通用业务错误 (1000-1999)',
  AUTH_ERROR = '认证授权错误 (2000-2999)',
  USER_ERROR = '用户相关错误 (3000-3999)',
  TENANT_ERROR = '租户相关错误 (4000-4999)',
  FILE_ERROR = '文件相关错误 (5000-5999)',
  EXTERNAL_ERROR = '第三方服务错误 (6000-6999)',
}

/**
 * 错误码详细信息
 */
export interface ErrorCodeInfo {
  /** 错误码 */
  code: number;
  /** 错误消息 */
  message: string;
  /** 错误分类 */
  category: ErrorCodeCategory;
  /** 详细说明 */
  description?: string;
  /** 解决方案 */
  solution?: string;
}

/**
 * 获取错误码分类
 */
function getErrorCodeCategory(code: number): ErrorCodeCategory {
  if (code === 200) return ErrorCodeCategory.SUCCESS;
  if (code >= 400 && code < 500) return ErrorCodeCategory.CLIENT_ERROR;
  if (code >= 500 && code < 600) return ErrorCodeCategory.SERVER_ERROR;
  if (code >= 1000 && code < 2000) return ErrorCodeCategory.BUSINESS_ERROR;
  if (code >= 2000 && code < 3000) return ErrorCodeCategory.AUTH_ERROR;
  if (code >= 3000 && code < 4000) return ErrorCodeCategory.USER_ERROR;
  if (code >= 4000 && code < 5000) return ErrorCodeCategory.TENANT_ERROR;
  if (code >= 5000 && code < 6000) return ErrorCodeCategory.FILE_ERROR;
  if (code >= 6000 && code < 7000) return ErrorCodeCategory.EXTERNAL_ERROR;
  return ErrorCodeCategory.BUSINESS_ERROR;
}

/**
 * 错误码详细说明和解决方案
 */
const errorCodeDetails: Partial<Record<ResponseCode, { description?: string; solution?: string }>> = {
  // 成功
  [ResponseCode.SUCCESS]: {
    description: '请求处理成功',
  },

  // 客户端错误
  [ResponseCode.BAD_REQUEST]: {
    description: '请求参数格式错误或缺少必要参数',
    solution: '检查请求参数是否符合接口要求',
  },
  [ResponseCode.UNAUTHORIZED]: {
    description: '未提供有效的认证信息或认证已过期',
    solution: '请重新登录获取新的访问令牌',
  },
  [ResponseCode.FORBIDDEN]: {
    description: '当前用户没有访问该资源的权限',
    solution: '联系管理员分配相应权限',
  },
  [ResponseCode.NOT_FOUND]: {
    description: '请求的资源不存在',
    solution: '检查请求的 URL 是否正确',
  },
  [ResponseCode.TOO_MANY_REQUESTS]: {
    description: '请求频率超过限制',
    solution: '请稍后再试，或联系管理员调整限流配置',
  },

  // 服务端错误
  [ResponseCode.INTERNAL_SERVER_ERROR]: {
    description: '服务器内部发生错误',
    solution: '请联系系统管理员查看服务器日志',
  },
  [ResponseCode.SERVICE_UNAVAILABLE]: {
    description: '服务暂时不可用，可能正在维护中',
    solution: '请稍后再试',
  },

  // 业务错误
  [ResponseCode.PARAM_INVALID]: {
    description: '请求参数验证失败，不符合业务规则',
    solution: '检查参数值是否符合业务要求',
  },
  [ResponseCode.DATA_NOT_FOUND]: {
    description: '请求的数据记录不存在',
    solution: '检查数据 ID 是否正确',
  },
  [ResponseCode.DATA_ALREADY_EXISTS]: {
    description: '数据已存在，不能重复创建',
    solution: '检查是否存在重复数据',
  },
  [ResponseCode.DATA_IN_USE]: {
    description: '数据正在被使用，无法删除或修改',
    solution: '先解除数据的关联关系',
  },

  // 认证错误
  [ResponseCode.TOKEN_INVALID]: {
    description: '提供的令牌无效或格式错误',
    solution: '请重新登录获取新的访问令牌',
  },
  [ResponseCode.TOKEN_EXPIRED]: {
    description: '访问令牌已过期',
    solution: '使用刷新令牌获取新的访问令牌，或重新登录',
  },
  [ResponseCode.ACCOUNT_DISABLED]: {
    description: '账户已被禁用',
    solution: '联系管理员启用账户',
  },
  [ResponseCode.ACCOUNT_LOCKED]: {
    description: '账户已被锁定，可能是登录失败次数过多',
    solution: '等待锁定时间结束或联系管理员解锁',
  },
  [ResponseCode.PASSWORD_ERROR]: {
    description: '密码错误',
    solution: '检查密码是否正确，注意大小写',
  },
  [ResponseCode.CAPTCHA_ERROR]: {
    description: '验证码错误或已过期',
    solution: '刷新验证码后重新输入',
  },
  [ResponseCode.PERMISSION_DENIED]: {
    description: '没有执行该操作的权限',
    solution: '联系管理员分配相应权限',
  },

  // 用户错误
  [ResponseCode.USER_NOT_FOUND]: {
    description: '用户不存在',
    solution: '检查用户名或用户 ID 是否正确',
  },
  [ResponseCode.USER_ALREADY_EXISTS]: {
    description: '用户名已被使用',
    solution: '使用其他用户名',
  },
  [ResponseCode.PASSWORD_WEAK]: {
    description: '密码强度不足，不符合安全要求',
    solution: '密码需包含大小写字母、数字和特殊字符，长度至少8位',
  },
  [ResponseCode.OLD_PASSWORD_ERROR]: {
    description: '原密码错误',
    solution: '检查原密码是否正确',
  },

  // 租户错误
  [ResponseCode.TENANT_NOT_FOUND]: {
    description: '租户不存在',
    solution: '检查租户 ID 是否正确',
  },
  [ResponseCode.TENANT_DISABLED]: {
    description: '租户已被禁用',
    solution: '联系平台管理员启用租户',
  },
  [ResponseCode.TENANT_EXPIRED]: {
    description: '租户服务已过期',
    solution: '联系平台管理员续费',
  },
  [ResponseCode.TENANT_QUOTA_EXCEEDED]: {
    description: '租户配额已超限',
    solution: '联系平台管理员提升配额',
  },

  // 文件错误
  [ResponseCode.FILE_NOT_FOUND]: {
    description: '文件不存在',
    solution: '检查文件路径是否正确',
  },
  [ResponseCode.FILE_TYPE_NOT_ALLOWED]: {
    description: '文件类型不允许上传',
    solution: '检查允许的文件类型列表',
  },
  [ResponseCode.FILE_SIZE_EXCEEDED]: {
    description: '文件大小超过限制',
    solution: '压缩文件或分片上传',
  },
  [ResponseCode.FILE_UPLOAD_FAILED]: {
    description: '文件上传失败',
    solution: '检查网络连接，稍后重试',
  },

  // 第三方服务错误
  [ResponseCode.EXTERNAL_SERVICE_ERROR]: {
    description: '调用外部服务失败',
    solution: '检查外部服务是否可用，稍后重试',
  },
  [ResponseCode.REDIS_ERROR]: {
    description: 'Redis 服务异常',
    solution: '检查 Redis 服务状态',
  },
  [ResponseCode.DATABASE_ERROR]: {
    description: '数据库服务异常',
    solution: '检查数据库服务状态',
  },
};

/**
 * 获取所有错误码信息
 */
export function getAllErrorCodes(): ErrorCodeInfo[] {
  return Object.entries(ResponseCode)
    .filter(([key]) => isNaN(Number(key)))
    .map(([key, code]) => {
      const numCode = code as number;
      const details = errorCodeDetails[numCode as ResponseCode] || {};
      return {
        code: numCode,
        message: ResponseMessage[numCode as ResponseCode] || '未知错误',
        category: getErrorCodeCategory(numCode),
        description: details.description,
        solution: details.solution,
      };
    })
    .sort((a, b) => a.code - b.code);
}

/**
 * 按分类获取错误码
 */
export function getErrorCodesByCategory(): Record<ErrorCodeCategory, ErrorCodeInfo[]> {
  const allCodes = getAllErrorCodes();
  const result: Record<ErrorCodeCategory, ErrorCodeInfo[]> = {
    [ErrorCodeCategory.SUCCESS]: [],
    [ErrorCodeCategory.CLIENT_ERROR]: [],
    [ErrorCodeCategory.SERVER_ERROR]: [],
    [ErrorCodeCategory.BUSINESS_ERROR]: [],
    [ErrorCodeCategory.AUTH_ERROR]: [],
    [ErrorCodeCategory.USER_ERROR]: [],
    [ErrorCodeCategory.TENANT_ERROR]: [],
    [ErrorCodeCategory.FILE_ERROR]: [],
    [ErrorCodeCategory.EXTERNAL_ERROR]: [],
  };

  for (const code of allCodes) {
    result[code.category].push(code);
  }

  return result;
}

/**
 * 生成 Markdown 格式的错误码文档
 */
export function generateErrorCodeMarkdown(): string {
  const codesByCategory = getErrorCodesByCategory();
  let markdown = '# API 错误码文档\n\n';
  markdown += '> 本文档列出了系统中所有的错误码及其含义\n\n';
  markdown += '## 响应格式\n\n';
  markdown += '```json\n';
  markdown += '{\n';
  markdown += '  "code": 200,\n';
  markdown += '  "msg": "操作成功",\n';
  markdown += '  "data": null,\n';
  markdown += '  "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",\n';
  markdown += '  "timestamp": "2025-01-01T00:00:00.000Z"\n';
  markdown += '}\n';
  markdown += '```\n\n';
  markdown += '- `code`: 响应码，200 表示成功，其他表示失败\n';
  markdown += '- `msg`: 响应消息\n';
  markdown += '- `data`: 响应数据\n';
  markdown += '- `requestId`: 请求追踪 ID，可用于日志查询\n';
  markdown += '- `timestamp`: 响应时间戳\n\n';

  for (const [category, codes] of Object.entries(codesByCategory)) {
    if (codes.length === 0) continue;

    markdown += `## ${category}\n\n`;
    markdown += '| 错误码 | 错误消息 | 说明 | 解决方案 |\n';
    markdown += '|--------|----------|------|----------|\n';

    for (const code of codes) {
      const description = code.description || '-';
      const solution = code.solution || '-';
      markdown += `| ${code.code} | ${code.message} | ${description} | ${solution} |\n`;
    }

    markdown += '\n';
  }

  return markdown;
}

/**
 * 生成 JSON 格式的错误码文档
 */
export function generateErrorCodeJson(): object {
  return {
    title: 'API 错误码文档',
    description: '系统中所有的错误码及其含义',
    responseFormat: {
      code: '响应码，200 表示成功，其他表示失败',
      msg: '响应消息',
      data: '响应数据',
      requestId: '请求追踪 ID，可用于日志查询',
      timestamp: '响应时间戳',
    },
    categories: getErrorCodesByCategory(),
  };
}
