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
	public async subscribe(
		@Args('input') input: SubscribeInput,
	): Promise<Subscriber> {
		console.log('Mutation: subscribe');
		return await this.notificationService.subscribe(input);
	}

	@UseGuards(WithoutGuard)
	@Mutation(() => Subscriber)
	public async unsubscribe(
		@Args('input') input: UnsubscribeInput,
	): Promise<Subscriber> {
		console.log('Mutation: unsubscribe');
		return await this.notificationService.unsubscribe(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => Subscribers)
	public async getAllSubscribersByAdmin(
		@Args('input') input: GetSubscribersInquiry,
	): Promise<Subscribers> {
		console.log('Query: getAllSubscribersByAdmin');
		return await this.notificationService.getSubscribers(input);
	}
}
