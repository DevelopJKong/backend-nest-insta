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
import { CommonModule } from './common/common.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

const TOKEN_KEY = 'x-jwt' as const;
@Module({
  imports: [
    // ! 피리즈마 설정 모듈
    PrismaModule,
    // ! ENV 설정 모듈
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.development' : '.env',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        PRIVATE_KEY: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_BUCKET_NAME: Joi.string().required(),
      }),
    }),
    EventEmitterModule.forRoot({
      // set this to `true` to use wildcards
      wildcard: false,
      // the delimiter used to segment namespaces
      delimiter: '.',
      // set this to `true` if you want to emit the newListener event
      newListener: false,
      // set this to `true` if you want to emit the removeListener event
      removeListener: false,
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 15,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: false,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
    }),
    // ! GraphQL 설정 모듈
    GraphQLModule.forRoot<ApolloDriverConfig>({
      fieldResolverEnhancers: ['interceptors'],
      installSubscriptionHandlers: true,
      driver: ApolloDriver,
      autoSchemaFile: true,
      subscriptions: {
        'subscriptions-transport-ws': {
          onConnect: (connectionParams: { [TOKEN_KEY]: string }) => {
            const { [TOKEN_KEY]: token } = connectionParams;
            if (!token) throw new Error('Missing auth token!');
            return {
              token: connectionParams[TOKEN_KEY],
            };
          },
        },
      },
      context: ({ req }) => {
        return {
          token: req.headers[TOKEN_KEY],
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
    CommonModule,
  ],
  providers: [],
})
export class AppModule {}
