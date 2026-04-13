import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import SubscriberSchema from '../../schemas/Subscriber.model';
import { NotificationResolver } from './notification.resolver';
import { NotificationService } from './notification.service';
import { MailService } from './mail.service';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Subscriber', schema: SubscriberSchema }]),
		AuthModule,
	],
	providers: [NotificationResolver, NotificationService, MailService],
	exports: [MailService],
})
export class NotificationModule {}
