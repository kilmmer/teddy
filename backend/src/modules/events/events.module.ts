import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { MessagingModule } from 'src/message_queue/mq.module';

@Module({
  imports: [MessagingModule],
  controllers: [EventsController],
})
export class EventsModule {}
