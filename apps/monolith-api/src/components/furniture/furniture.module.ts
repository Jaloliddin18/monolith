import { Module } from '@nestjs/common';
import { FurnitureResolver } from './furniture.resolver';
import { FurnitureService } from './furniture.service';

@Module({
  providers: [FurnitureResolver, FurnitureService]
})
export class FurnitureModule {}
