import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Subscriber, Subscribers } from '../../libs/dto/notification/notification';
import { GetSubscribersInquiry, SubscribeInput, UnsubscribeInput } from '../../libs/dto/notification/notification.input';
import { MailService } from './mail.service';
import { Direction, Message } from '../../libs/enums/common.enum';

@Injectable()
export class NotificationService {
	constructor(
		@InjectModel('Subscriber')
		private readonly subscriberModel: Model<Subscriber>,
		private readonly mailService: MailService,
	) {}

	public async subscribe(input: SubscribeInput): Promise<Subscriber> {
		const existing = await this.subscriberModel.findOne({
			subscriberEmail: input.subscriberEmail,
		});

		if (existing) {
			if (existing.isActive) {
				throw new BadRequestException(Message.ALREADY_SUBSCRIBED);
			}
			existing.isActive = true;
			existing.unsubscribeToken = uuidv4();
			await existing.save();
			await this.mailService.sendWelcomeEmail(existing.subscriberEmail, existing.unsubscribeToken);
			return existing;
		}

		const unsubscribeToken = uuidv4();
		try {
			const subscriber = await this.subscriberModel.create({
				subscriberEmail: input.subscriberEmail,
				unsubscribeToken,
			});
			await this.mailService.sendWelcomeEmail(subscriber.subscriberEmail, unsubscribeToken);
			return subscriber;
		} catch (err: unknown) {
			console.log('Error, NotificationService.subscribe:', err instanceof Error ? err.message : String(err));
			throw new BadRequestException(Message.BAD_REQUEST);
		}
	}

	public async unsubscribe(input: UnsubscribeInput): Promise<Subscriber> {
		const subscriber = await this.subscriberModel.findOne({
			unsubscribeToken: input.unsubscribeToken,
		});
		if (!subscriber) throw new BadRequestException(Message.INVALID_UNSUBSCRIBE_TOKEN);

		subscriber.isActive = false;
		await subscriber.save();
		await this.mailService.sendUnsubscribeConfirmation(subscriber.subscriberEmail);
		return subscriber;
	}

	public async getSubscribers(input: GetSubscribersInquiry): Promise<Subscribers> {
		const { page, limit, sort = 'createdAt', direction = Direction.DESC } = input;
		const skip = (page - 1) * limit;

		const [list, total] = await Promise.all([
			this.subscriberModel
				.find({ isActive: true })
				.sort({ [sort]: direction })
				.skip(skip)
				.limit(limit)
				.exec(),
			this.subscriberModel.countDocuments({ isActive: true }),
		]);

		return { list, metaCounter: [{ total }] };
	}
}
