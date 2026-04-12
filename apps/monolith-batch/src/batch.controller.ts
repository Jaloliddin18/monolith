import { Controller, Get, Logger } from '@nestjs/common';
import { BatchService } from './batch.service';
import { Cron, Timeout } from '@nestjs/schedule';
import {
	BATCH_ROLLBACK,
	BATCH_TOP_FURNITURES,
	BATCH_TOP_DESIGNERS,
	BATCH_TRENDING_FURNITURES,
	BATCH_SUGGESTED_FURNITURES,
	BATCH_DISCOUNT_EXPIRY,
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

	@Cron('00 01 01 * * *', { name: BATCH_TRENDING_FURNITURES })
	public async batchTrendingFurnitures() {
		try {
			this.logger['context'] = BATCH_TRENDING_FURNITURES;
			this.logger.debug('EXECUTED');
			await this.batchService.batchTrendingFurnitures();
		} catch (err) {
			this.logger.error(err);
		}
	}

	@Cron('20 01 01 * * *', { name: BATCH_SUGGESTED_FURNITURES })
	public async batchSuggestedFurnitures() {
		try {
			this.logger['context'] = BATCH_SUGGESTED_FURNITURES;
			this.logger.debug('EXECUTED');
			await this.batchService.batchSuggestedFurnitures();
		} catch (err) {
			this.logger.error(err);
		}
	}

	@Cron('00 * * * * *', { name: BATCH_DISCOUNT_EXPIRY })
	public async batchDiscountExpiry() {
		try {
			this.logger['context'] = BATCH_DISCOUNT_EXPIRY;
			this.logger.debug('EXECUTED');
			await this.batchService.batchDiscountExpiry();
		} catch (err) {
			this.logger.error(err);
		}
	}

	@Get()
	getHello(): string {
		return this.batchService.getHello();
	}
}
