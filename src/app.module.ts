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
import { PhotosModule } from './photos/photos.module';
import { CommentsModule } from './comments/comments.module';
import { UploadsModule } from './uploads/uploads.module';
import { MessagesModule } from './messages/messages.module';
@Module({
  imports: [
    // ! 피리즈마 설정 모듈
    PrismaModule,
    // ! ENV 설정 모듈
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        PRIVATE_KEY: Joi.string().required(),
      }),
    }),

    // ! GraphQL 설정 모듈
    GraphQLModule.forRoot<ApolloDriverConfig>({
      installSubscriptionHandlers: true,
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req, connection }) => {
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
    UploadsModule.forRoot({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucketName: process.env.AWS_BUCKET_NAME,
    }), // ! 업로드 모듈
    UsersModule, // ! 유저 모듈
    AuthModule, // ! 인증 모듈
    PhotosModule, // ! 포토 모듈
    CommentsModule, // ! 댓글 모듈
    MessagesModule,
  ],
  providers: [],
})
export class AppModule {}
