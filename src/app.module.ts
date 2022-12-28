<<<<<<< HEAD
import { AuthModule } from './libs/auth/auth.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './users/users.module';
import { LoggerModule } from './libs/logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { JwtModule } from './libs/jwt/jwt.module';
=======
import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { UsersModule } from "./users/users.module";
import { LoggerModule } from "./libs/logger/logger.module";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { JwtModule } from "./libs/jwt/jwt.module";
>>>>>>> bba244e4316370d6ff519e72f0e31ce1a9583272

@Module({
  imports: [
    // ! 피리즈마 설정 모듈
    PrismaModule,
    // ! ENV 설정 모듈
    ConfigModule.forRoot({
      isGlobal: true,
<<<<<<< HEAD
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        PRIVATE_KEY: Joi.string().required(),
      }),
=======
      envFilePath: process.env.NODE_ENV === "dev" ? ".env.dev" : ".env.test",
      ignoreEnvFile: process.env.NODE_ENV === "prod",
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid("dev", "prod").required(),
        PRIVATE_KEY: Joi.string().required()
      })
>>>>>>> bba244e4316370d6ff519e72f0e31ce1a9583272
    }),
    // ! GraphQL 설정 모듈
    GraphQLModule.forRoot<ApolloDriverConfig>({
      installSubscriptionHandlers: true,
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req, connection }) => {
<<<<<<< HEAD
        console.log('hello');
        const TOKEN_KEY = 'x-jwt';
        return {
          token: req ? req.headers[TOKEN_KEY] : connection.context[TOKEN_KEY],
        };
      },
    }),
    // ! Logger 설정 모듈
    LoggerModule.forRoot({
      nodeEnv: process.env.NODE_ENV,
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    UsersModule, // ! 유저 모듈
    AuthModule, // ! 인증 모듈
  ],
  providers: [],
})
export class AppModule {}
=======
        const TOKEN_KEY = "x-jwt";
        return {
          token: req ? req.headers[TOKEN_KEY] : connection.context[TOKEN_KEY]
        };
      }
    }),
    // ! Logger 설정 모듈
    LoggerModule.forRoot({
      nodeEnv: process.env.NODE_ENV
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY
    }),
    UsersModule, // ! 유저 모듈
  ],
  providers: []
})
export class AppModule {
}
>>>>>>> bba244e4316370d6ff519e72f0e31ce1a9583272
