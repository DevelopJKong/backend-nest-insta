import { GqlExecutionContext } from '@nestjs/graphql';
import { CallHandler, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoggerService } from './logger.service';
import * as chalk from 'chalk';
interface ITypeName {
  SUBSCRIPTION: string;
  QUERY: string;
  MUTATION: string;
}

const TYPE_NAME = {
  SUBSCRIPTION: 'Subscription',
  QUERY: 'Query',
  MUTATION: 'Mutation',
} as ITypeName;

export interface Response<T> {
  data: T;
}

export class LoggerInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private readonly log: LoggerService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const info = GqlExecutionContext.create(context).getInfo();
    const colorSuccessTypeName = chalk.yellow(`${info.path.typename}`);
    const colorMethod = chalk.cyan(`${info.path.key}()`);
    if (info.path.typename === TYPE_NAME.SUBSCRIPTION) {
      this.log.logger().info(`${colorSuccessTypeName} => ${colorMethod} | ${chalk.green('Subscription 호출 성공')}`);
      return next.handle();
    }

    return next.handle().pipe(
      map(data => {
        if (data.ok) {
          data.error = null;
          this.log
            .logger()
            .info(`${colorSuccessTypeName} => ${colorMethod} | Success Message ::: ${chalk.green(data.message)}`);
        } else {
          const { message, stack, name } = data.error;
          const colorErrorTypeName = chalk.red(`${info.path.typename}`);
          const colorErrorMethod = chalk.yellow(`${info.path.key}()`);
          const colorMessage = chalk.red(`${message}`);
          const colorName = chalk.red(`${name}`);
          const colorStack = chalk.red(`${stack}`);
          if (message.includes('Error:')) {
            // ! server error & query error
            this.log
              .logger()
              .error(`${colorErrorTypeName} => ${colorErrorMethod} | Name ::: ${name} | Message ::: ${colorMessage}`);
            data.error = `${info.path.typename} => ${info.path.key}() | Name ::: ${name} | 로그 메시지 참고`;
          } else {
            // ! client error
            this.log
              .logger()
              .error(
                `${colorErrorTypeName} => ${colorErrorMethod} | Message ::: ${colorMessage} | Name ::: ${colorName} | Stack ::: ${colorStack}`,
              );
            data.error = message;
          }
        }
        return data;
      }),
    );
  }
}
