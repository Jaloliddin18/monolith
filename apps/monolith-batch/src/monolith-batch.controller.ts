import { Controller, Get } from '@nestjs/common';
import { MonolithBatchService } from './monolith-batch.service';

@Controller()
export class MonolithBatchController {
  constructor(private readonly monolithBatchService: MonolithBatchService) {}

  @Get()
  getHello(): string {
    return this.monolithBatchService.getHello();
  }
}
