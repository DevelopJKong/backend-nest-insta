import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { UsersModule } from "./users/users.module";
import { LoggerModule } from "./libs/logger/logger.module";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";

@Module({
  imports: [
    // ! 피리즈마 설정 모듈
    PrismaModule,
    // ! ENV 설정 모듈
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === "dev" ? ".env.dev" : ".env.test",
      ignoreEnvFile: process.env.NODE_ENV === "prod",
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid("dev", "prod").required()
      })
    }),
    // ! GraphQL 설정 모듈
    GraphQLModule.forRoot<ApolloDriverConfig>({
      installSubscriptionHandlers: true,
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req, connection }) => {
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
    UsersModule, // ! 유저 모듈
  ],
  providers: []
})
export class AppModule {
}
