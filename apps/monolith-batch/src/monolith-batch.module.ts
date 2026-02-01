import { Module } from '@nestjs/common';
import { MonolithBatchController } from './monolith-batch.controller';
import { MonolithBatchService } from './monolith-batch.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [MonolithBatchController],
  providers: [MonolithBatchService],
})
export class MonolithBatchModule {}
