import { Injectable } from '@nestjs/common';

@Injectable()
export class MonolithBatchService {
  getHello(): string {
    return 'This is MONOLITH Batch Server!';
  }
}
