import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { FurnitureModule } from './furniture/furniture.module';

@Module({
  imports: [MemberModule, FurnitureModule]
})
export class ComponentsModule {}
