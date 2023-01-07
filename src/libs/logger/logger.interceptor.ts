import { GqlExecutionContext } from '@nestjs/graphql';
import { CallHandler, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoggerService } from './logger.service';

export interface Response<T> {
  data: T;
}

export class LoggerInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private readonly log: LoggerService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const info = GqlExecutionContext.create(context).getInfo();
    return next.handle().pipe(
      map(data => {
        if (data.ok) {
          data.error = null;
          this.log.logger().info(`${info.path.typename} => ${info.path.key}() | Success Message ::: ${data.message}`);
        } else {
          const { message, stack, name } = data.error;

          if (message.includes('Error:')) {
            // ! server error & query error
            this.log
              .logger()
              .error(`${info.path.typename} => ${info.path.key}() | Name ::: ${name} | Message ::: ${message}`);
            data.error = `${info.path.typename} => ${info.path.key}() | Name ::: ${name} | 로그 메시지 참고`;
          } else {
            // ! client error
            this.log
              .logger()
              .error(
                `${info.path.typename} => ${info.path.key}() | Message ::: ${message} | Name ::: ${name} | Stack ::: ${stack}`,
              );
            data.error = message;
          }
        }
        return data;
      }),
    );
  }
}
