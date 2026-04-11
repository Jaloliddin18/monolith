import { Injectable } from '@nestjs/common';

@Injectable()
export class BatchService {
	getHello(): string {
		return 'This is MONOLITH BATCH Server!';
	}
}
