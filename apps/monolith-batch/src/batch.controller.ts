import { Controller, Get } from '@nestjs/common';
import { BatchService as BatchService } from './batch.service';

@Controller()
export class BatchController {
	constructor(private readonly monolithBatchService: BatchService) {}

	@Get()
	getHello(): string {
		return this.monolithBatchService.getHello();
	}
}
