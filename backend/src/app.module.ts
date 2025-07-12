import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ClientsModule as CustomersModule } from './modules/clients/clients.module';
import { UsersModule } from './modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventsModule } from './modules/events/events.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MessagingModule } from './message_queue/mq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production', // JAMAIS true em produção!
      migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
      migrationsRun: false,
    }),
    JwtModule.register({
      secret: 't3ddy_t3st@2025',
      signOptions: { expiresIn: '60s' },
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        port: parseInt(configService.get<string>('REDIS_PORT') || '6379', 10),
        ttl: 300, // Tempo de vida do cache em segundos (ex: 5 minutos)
        // password: configService.get<string>('REDIS_PASSWORD'), // Se o Redis tiver senha
      }),
      inject: [ConfigService],
      isGlobal: true, // Torna o cache acessível globalmente
    }),
    AuthModule,
    CustomersModule,
    UsersModule,
    EventsModule,
    EventEmitterModule.forRoot(),
    MessagingModule, // Importa o módulo de mensagens
  ],
})
export class AppModule {}
