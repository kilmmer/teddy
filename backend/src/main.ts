import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    origin: '*', // Permite todas as origens, ajuste conforme necessário
  });

  app.enableShutdownHooks(); // Habilita ganchos de desligamento, se necessário

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
