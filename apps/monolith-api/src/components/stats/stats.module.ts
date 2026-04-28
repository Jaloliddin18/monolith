import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsResolver } from './stats.resolver';
import { StatsService } from './stats.service';
import MemberSchema from '../../schemas/Member.model';
import FurnitureSchema from '../../schemas/Furniture.model';
import BoardArticleSchema from '../../schemas/BoardArticle.model';
import SubscriberSchema from '../../schemas/Subscriber.model';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Member', schema: MemberSchema },
			{ name: 'Furniture', schema: FurnitureSchema },
			{ name: 'BoardArticle', schema: BoardArticleSchema },
			{ name: 'Subscriber', schema: SubscriberSchema },
		]),
		AuthModule,
	],
	providers: [StatsResolver, StatsService],
})
export class StatsModule {}
