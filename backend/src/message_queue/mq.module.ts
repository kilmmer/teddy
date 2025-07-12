import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_CLIENT', // Nome do cliente RabbitMQ
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
          ],
          queue: 'clients_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  exports: [ClientsModule], // exporta o módulo, não só o nome
})
export class MessagingModule {}
