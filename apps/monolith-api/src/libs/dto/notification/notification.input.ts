import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, IsUUID, Length, Min } from 'class-validator';
import { Direction } from '../../enums/common.enum';

@InputType()
export class SubscribeInput {
	@IsNotEmpty()
	@IsEmail()
	@Length(5, 254)
	@Field(() => String)
	subscriberEmail: string;
}

@InputType()
export class UnsubscribeInput {
	@IsNotEmpty()
	@IsString()
	@IsUUID('4')
	@Field(() => String)
	unsubscribeToken: string;
}

@InputType()
export class GetSubscribersInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(['createdAt', 'updatedAt'])
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;
}
