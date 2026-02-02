import { Module } from '@nestjs/common';
import { FurnitureResolver } from './furniture.resolver';

@Module({
  providers: [FurnitureResolver]
})
export class FurnitureModule {}
