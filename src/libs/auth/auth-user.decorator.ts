import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const AuthUser = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  const gqlContext = GqlExecutionContext.create(context).getContext();
  const user = gqlContext['user'];
  return user;
});
