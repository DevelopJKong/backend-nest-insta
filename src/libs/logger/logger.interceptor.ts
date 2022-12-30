import { GqlExecutionContext } from '@nestjs/graphql';
import { CallHandler, Logger, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { tap, Observable } from 'rxjs';

export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<void> {
    const req = GqlExecutionContext.create(context).getContext().req;
    const method = req.method;
    const url = req.url;
    const userAgent = req.get('user-agent') || '';
    const clientIp = req.ip;

    const now = Date.now();
    return next.handle().pipe(tap(() => Logger.log(`${method} ${url} ${userAgent} ${clientIp} ${Date.now() - now}ms`)));
  }
}
