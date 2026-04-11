import { Controller, Get, Logger } from '@nestjs/common';
import { BatchService } from './batch.service';
import { Cron, Timeout } from '@nestjs/schedule';
import {
	BATCH_ROLLBACK,
	BATCH_TOP_FURNITURES,
	BATCH_TOP_DESIGNERS,
} from './lib/config';

@Controller()
export class BatchController {
	private logger: Logger = new Logger('BatchController');
	constructor(private readonly batchService: BatchService) {}

	@Timeout(1000)
	handleTimeout() {
		this.logger.debug('BATCH SERVER READY');
	}

	@Cron('00 00 01 * * *', { name: BATCH_ROLLBACK })
	public async bacthRollBack() {
		try {
			this.logger['context'] = BATCH_ROLLBACK;
			this.logger.debug('EXECUTED');
			await this.batchService.batchRollBack();
		} catch (err) {
			this.logger.error(err);
		}
	}

	@Cron('20 00 01 * * *', { name: BATCH_TOP_FURNITURES })
	public async batchTopFurnitures() {
		try {
			this.logger['context'] = BATCH_TOP_FURNITURES;
			this.logger.debug('EXECUTED');
			await this.batchService.batchTopFurnitures();
		} catch (err) {
			this.logger.error(err);
		}
	}

	@Cron('40 00 01 * * *', { name: BATCH_TOP_DESIGNERS })
	public async batchTopDesigners() {
		try {
			this.logger['context'] = BATCH_TOP_DESIGNERS;
			this.logger.debug('EXECUTED');
			await this.batchService.batchTopDesigners();
		} catch (err) {
			this.logger.error(err);
		}
	}

	@Get()
	getHello(): string {
		return this.batchService.getHello();
	}
}
