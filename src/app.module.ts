import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { BoardsModule } from './boards/boards.module';

@Module({
  imports: [UsersModule, PrismaModule, BoardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
