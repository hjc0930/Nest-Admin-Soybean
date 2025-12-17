import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { BusinessException } from '../exceptions/business.exception';

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: number = status;
    let message = 'Internal server error';
    let data: any = null;

    if (exception instanceof BusinessException) {
      const resp = exception.getResponse() as any;
      status = HttpStatus.OK;
      code = resp.code ?? status;
      message = resp.message ?? message;
      data = resp.data ?? null;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      code = status;
      const resp = exception.getResponse();
      if (typeof resp === 'object' && resp !== null) {
        const body: any = resp as any;
        message = Array.isArray(body.message) ? body.message[0] : (body.message ?? (body || message));
        data = body.data ?? null;
      } else if (typeof resp === 'string') {
        message = resp;
      }
    } else if (exception instanceof Error) {
      message = exception.message || message;
      this.logger.error({ message: exception.message, stack: exception.stack, path: request.url, method: request.method });
    }

    const isDev = process.env.NODE_ENV === 'development';
    const payload: any = { code, msg: message, data };
    if (isDev && exception instanceof Error) {
      payload.timestamp = new Date().toISOString();
      payload.path = request.url;
      payload.method = request.method;
      payload.stack = exception.stack;
    }

    if (status >= 500) {
      this.logger.error({ status, code, message, path: request.url, method: request.method });
    }

    response.status(status).json(payload);
  }
}
