import { NestFactory } from '@nestjs/core';
import { MonolithBatchModule } from './monolith-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(MonolithBatchModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
