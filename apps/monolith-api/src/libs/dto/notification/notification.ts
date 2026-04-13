import { Field, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { TotalCounter } from '../member/member';

@ObjectType()
export class Subscriber {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	subscriberEmail: string;

	@Field(() => Boolean)
	isActive: boolean;

	@Field(() => String)
	unsubscribeToken: string;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}

@ObjectType()
export class Subscribers {
	@Field(() => [Subscriber])
	list: Subscriber[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
