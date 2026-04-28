import { Field, ObjectType } from '@nestjs/graphql';
import { InquiryStatus } from '../../enums/inquiry.enum';
import type { ObjectId } from 'mongoose';
import { Member, TotalCounter } from '../member/member';

@ObjectType()
export class Inquiry {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => String)
	inquiryTitle: string;

	@Field(() => String)
	inquiryContent: string;

	@Field(() => InquiryStatus)
	inquiryStatus: InquiryStatus;

	@Field(() => String, { nullable: true })
	inquiryResponse?: string;

	@Field(() => Date, { nullable: true })
	respondedAt?: Date;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	/** from aggregation **/
	@Field(() => Member, { nullable: true })
	memberData?: Member;
}

@ObjectType()
export class Inquiries {
	@Field(() => [Inquiry])
	list: Inquiry[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
