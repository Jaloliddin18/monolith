import { Module } from '@nestjs/common';
import { MonolithBatchController } from './monolith-batch.controller';
import { MonolithBatchService } from './monolith-batch.service';

@Module({
  imports: [],
  controllers: [MonolithBatchController],
  providers: [MonolithBatchService],
})
export class MonolithBatchModule {}
