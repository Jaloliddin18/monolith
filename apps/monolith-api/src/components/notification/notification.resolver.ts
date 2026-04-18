import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Subscriber, Subscribers } from '../../libs/dto/notification/notification';
import { GetSubscribersInquiry, SubscribeInput, UnsubscribeInput } from '../../libs/dto/notification/notification.input';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { WithoutGuard } from '../auth/guards/without.guard';

@Resolver()
export class NotificationResolver {
	constructor(private readonly notificationService: NotificationService) {}

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
}
