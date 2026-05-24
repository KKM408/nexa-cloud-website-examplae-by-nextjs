import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 允许前端跨域访问本后端
  app.enableCors({ origin: 'http://localhost:3000' });
  app.setGlobalPrefix('api');

  // 全局注册数据验证管道，作用于所有 Controller 的入参
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动过滤掉 DTO 中未声明的多余字段
      transform: true, // 自动将请求参数转换为 DTO 类实例（如字符串转数字）
      forbidNonWhitelisted: true, // 发现多余字段时直接抛出 400 错误，而不是静默过滤
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
