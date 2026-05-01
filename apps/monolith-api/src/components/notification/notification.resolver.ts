import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Subscriber, Subscribers } from '../../libs/dto/notification/notification';
import { AppNotification, AppNotifications } from '../../libs/dto/notification/app-notification';
import {
	GetSubscribersInquiry,
	MarkNotificationReadInput,
	SubscribeInput,
	UnsubscribeInput,
} from '../../libs/dto/notification/notification.input';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { WithoutGuard } from '../auth/guards/without.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';

@Resolver()
export class NotificationResolver {
	constructor(private readonly notificationService: NotificationService) {}

	/** NEWSLETTER **/

	@UseGuards(WithoutGuard)
	@Mutation(() => Subscriber)
	public async subscribeNewsletter(
		@Args('input') input: SubscribeInput,
	): Promise<Subscriber> {
		return await this.notificationService.subscribeNewsletter(input);
	}

	@UseGuards(WithoutGuard)
	@Mutation(() => Subscriber)
	public async unsubscribeNewsletter(
		@Args('input') input: UnsubscribeInput,
	): Promise<Subscriber> {
		return await this.notificationService.unsubscribeNewsletter(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => Subscribers)
	public async getAllSubscribersByAdmin(
		@Args('input') input: GetSubscribersInquiry,
	): Promise<Subscribers> {
		return await this.notificationService.getSubscribers(input);
	}

	/** IN-APP NOTIFICATIONS **/

	@UseGuards(AuthGuard)
	@Query(() => AppNotifications)
	public async getMyNotifications(
		@AuthMember('_id') memberId: ObjectId,
	): Promise<AppNotifications> {
		return await this.notificationService.getMyNotifications(memberId);
	}

	@UseGuards(AuthGuard)
	@Query(() => Int)
	public async getUnreadCount(
		@AuthMember('_id') memberId: ObjectId,
	): Promise<number> {
		return await this.notificationService.getUnreadCount(memberId);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => AppNotification)
	public async markNotificationRead(
		@Args('input') input: MarkNotificationReadInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<AppNotification> {
		return await this.notificationService.markAsRead(input, memberId);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Boolean)
	public async markAllNotificationsRead(
		@AuthMember('_id') memberId: ObjectId,
	): Promise<boolean> {
		return await this.notificationService.markAllAsRead(memberId);
	}
}
