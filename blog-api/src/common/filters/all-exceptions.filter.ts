import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

// 全局异常过滤器：统一捕获所有未处理异常并格式化响应
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // HttpException（含 ConflictException/NotFoundException 等）取其状态码，其余一律 500
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // getResponse() 返回字符串或对象；对象时取 .message（ValidationPipe 错误为数组）
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    response.status(status).json({
      code: status,
      message: typeof message === 'string' ? message : (message as any).message,
      data: null,
      path: request.url,       // 出错接口路径，便于调试
      timestamp: new Date().toISOString(),
    });
  }
}
