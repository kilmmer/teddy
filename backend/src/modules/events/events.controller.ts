import {
  Controller,
  Sse,
  MessageEvent,
  Logger,
  Query,
  OnModuleInit,
} from '@nestjs/common';

import amqp from 'amqp-connection-manager';
import { Observable, Subject } from 'rxjs';
import { map, filter } from 'rxjs/operators';

interface ClientCreatedEventData {
  id: string; // ID real do cliente
  name: string;
  email: string;
  salary: string;
  company: string;
  timestamp: Date;
}

@Controller('events')
export class EventsController implements OnModuleInit {
  private readonly logger = new Logger(EventsController.name);
  private readonly eventSubject = new Subject<{ type: string; data: any }>();

  async onModuleInit() {
    this.logger.log('Conectando ao RabbitMQ...');
    const connection = amqp.connect(
      `amqp://${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
    );
    const channel = connection.createChannel();
    const queue = 'clients_queue';

    await channel.assertQueue(queue, { durable: true });

    void channel.consume(queue, (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());

        this.eventSubject.next({
          type: data.pattern,
          data: data.data,
        });

        channel.ack(msg);
      }
    });
  }

  @Sse()
  sseEvents(@Query('eventType') eventType: string): Observable<MessageEvent> {
    this.logger.log(`Cliente conectado ao SSE para evento: ${eventType}`);
    return this.eventSubject.asObservable().pipe(
      filter((event) => event.type === eventType),
      map((event) => {
        return new MessageEvent(event.type, {
          data: JSON.stringify(event.data),
        });
      }),
    );
  }
}
