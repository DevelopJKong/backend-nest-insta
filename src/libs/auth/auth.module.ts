import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
<<<<<<< HEAD
import { UsersModule } from "../../users/users.module";

@Module({
  imports: [UsersModule],
=======

@Module({
  imports: [],
>>>>>>> bba244e4316370d6ff519e72f0e31ce1a9583272
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
