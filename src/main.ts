import { NestFactory } from '@nestjs/core';
require('dotenv').config({ path: `../${process.env.NODE_ENV}.env` });
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
