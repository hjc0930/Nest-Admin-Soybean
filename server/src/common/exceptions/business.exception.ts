import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * 业务异常类
 * 用于统一处理业务逻辑异常,返回给前端友好的错误信息
 */
export class BusinessException extends HttpException {
  constructor(
    public readonly code: number,
    public readonly message: string,
    public readonly data?: any,
  ) {
    super(
      {
        code,
        message,
        data: data ?? null,
      },
      HttpStatus.OK, // 业务异常统一返回 200 状态码,通过 code 字段区分
    );
  }

  static throw(code: number, message: string, data?: any): never {
    throw new BusinessException(code, message, data);
  }
}

/**
 * 常用业务异常码
 */
export enum BusinessErrorCode {
  // 通用错误 (10000-19999)
  SYSTEM_ERROR = 10000,
  PARAM_ERROR = 10001,
  NOT_FOUND = 10002,
  UNAUTHORIZED = 10003,
  FORBIDDEN = 10004,

  // 用户相关 (20000-29999)
  USER_NOT_FOUND = 20000,
  USER_EXIST = 20001,
  USER_DISABLED = 20002,
  PASSWORD_ERROR = 20003,
  PASSWORD_WEAK = 20004,

  // 租户相关 (30000-39999)
  TENANT_NOT_FOUND = 30000,
  TENANT_EXPIRED = 30001,
  TENANT_DISABLED = 30002,

  // 数据相关 (40000-49999)
  DATA_EXIST = 40000,
  DATA_NOT_FOUND = 40001,
  DATA_IN_USE = 40002,
}
