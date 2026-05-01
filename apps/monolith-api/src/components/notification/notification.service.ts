import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import {
	Subscriber,
	Subscribers,
} from '../../libs/dto/notification/notification';
import { AppNotification, AppNotifications } from '../../libs/dto/notification/app-notification';
import {
	GetSubscribersInquiry,
	MarkNotificationReadInput,
	SubscribeInput,
	UnsubscribeInput,
} from '../../libs/dto/notification/notification.input';
import { MailService } from './mail.service';
import { Direction, Message } from '../../libs/enums/common.enum';
import { NotificationStatus, NotificationType } from '../../libs/enums/notification.enum';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Injectable()
export class NotificationService {
	constructor(
		@InjectModel('Subscriber')
		private readonly subscriberModel: Model<Subscriber>,

		@InjectModel('Notification')
		private readonly notificationModel: Model<AppNotification>,

		private readonly mailService: MailService,
	) {}

	/** NEWSLETTER **/

	public async subscribeNewsletter(input: SubscribeInput): Promise<Subscriber> {
		const existing = await this.subscriberModel.findOne({
			subscriberEmail: input.subscriberEmail,
		});

		if (existing) {
			if (existing.isActive) {
				throw new BadRequestException(Message.ALREADY_SUBSCRIBED);
			}
			existing.isActive = true;
			existing.unsubscribeToken = randomUUID();
			await existing.save();
			await this.mailService.sendWelcomeEmail(
				existing.subscriberEmail,
				existing.unsubscribeToken,
			);
			return existing;
		}

		const unsubscribeToken = randomUUID();
		try {
			const subscriber = await this.subscriberModel.create({
				subscriberEmail: input.subscriberEmail,
				unsubscribeToken,
			});
			await this.mailService.sendWelcomeEmail(
				subscriber.subscriberEmail,
				unsubscribeToken,
			);
			return subscriber;
		} catch (err: unknown) {
			console.error(
				'Error, NotificationService.subscribeNewsletter:',
				err instanceof Error ? err.message : String(err),
			);
			throw new BadRequestException(Message.BAD_REQUEST);
		}
	}

	public async unsubscribeNewsletter(
		input: UnsubscribeInput,
	): Promise<Subscriber> {
		const subscriber = await this.subscriberModel.findOne({
			unsubscribeToken: input.unsubscribeToken,
		});
		if (!subscriber)
			throw new BadRequestException(Message.INVALID_UNSUBSCRIBE_TOKEN);

		subscriber.isActive = false;
		await subscriber.save();
		await this.mailService.sendUnsubscribeConfirmation(
			subscriber.subscriberEmail,
		);
		return subscriber;
	}

	public async getSubscribers(
		input: GetSubscribersInquiry,
	): Promise<Subscribers> {
		const {
			page,
			limit,
			sort = 'createdAt',
			direction = Direction.DESC,
		} = input;
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

	/** IN-APP NOTIFICATIONS **/

	public async createManyNotifications(data: {
		notificationType: NotificationType;
		notificationTitle: string;
		notificationDesc: string;
		authorId: ObjectId;
		receiverIds: ObjectId[];
		noticeId?: ObjectId;
	}): Promise<void> {
		if (!data.receiverIds.length) return;
		const docs = data.receiverIds.map((receiverId) => ({
			notificationType: data.notificationType,
			notificationStatus: NotificationStatus.WAIT,
			notificationTitle: data.notificationTitle,
			notificationDesc: data.notificationDesc,
			authorId: data.authorId,
			receiverId,
			noticeId: data.noticeId,
		}));
		await this.notificationModel.insertMany(docs);
	}

	public async getMyNotifications(receiverId: ObjectId): Promise<AppNotifications> {
		const list = await this.notificationModel
			.find({ receiverId })
			.sort({ createdAt: -1 })
			.limit(50)
			.exec();
		const total = await this.notificationModel.countDocuments({ receiverId });
		return { list: list as any, metaCounter: [{ total }] };
	}

	public async getUnreadCount(receiverId: ObjectId): Promise<number> {
		return this.notificationModel.countDocuments({
			receiverId,
			notificationStatus: NotificationStatus.WAIT,
		});
	}

	public async markAsRead(input: MarkNotificationReadInput, receiverId: ObjectId): Promise<AppNotification> {
		const notificationId = shapeIntoMongoObjectId(input.notificationId);
		const result = await this.notificationModel
			.findOneAndUpdate(
				{ _id: notificationId, receiverId },
				{ notificationStatus: NotificationStatus.READ },
				{ new: true },
			)
			.exec();
		if (!result) throw new BadRequestException(Message.BAD_REQUEST);
		return result as any;
	}

	public async markAllAsRead(receiverId: ObjectId): Promise<boolean> {
		await this.notificationModel.updateMany(
			{ receiverId, notificationStatus: NotificationStatus.WAIT },
			{ notificationStatus: NotificationStatus.READ },
		);
		return true;
	}
}
