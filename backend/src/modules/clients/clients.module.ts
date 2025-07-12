import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';
import { MessagingModule } from 'src/message_queue/mq.module';

@Module({
  imports: [TypeOrmModule.forFeature([Client]), MessagingModule],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
