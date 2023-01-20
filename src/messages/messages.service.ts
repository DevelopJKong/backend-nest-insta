import { Room } from './entities/room.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SeeRoomOutput } from './dtos/see-room.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async seeRooms(userId: number): Promise<SeeRoomOutput> {
    const rooms = await this.prisma.room.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    });
    return {
      ok: true,
      rooms: rooms as Room[],
    };
  }
}
