import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import type { ObjectId } from 'mongoose';
import { InquiryStatus } from '../../enums/inquiry.enum';
import { Direction } from '../../enums/common.enum';
import { availableInquirySorts } from '../../config';

@InputType()
export class InquiryInput {
	@IsNotEmpty()
	@Length(3, 100)
	@Field(() => String)
	inquiryTitle: string;

	@IsNotEmpty()
	@Length(20, 5000)
	@Field(() => String)
	inquiryContent: string;

	memberId?: ObjectId;
}

@InputType()
export class InquiryResponse {
	@IsNotEmpty()
	@Field(() => String)
	inquiryId: string;

	@IsNotEmpty()
	@Length(3, 5000)
	@Field(() => String)
	inquiryResponse: string;
}

@InputType()
class IISearch {
	@IsOptional()
	@Field(() => InquiryStatus, { nullable: true })
	inquiryStatus?: InquiryStatus;
}

@InputType()
export class InquiriesInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableInquirySorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => IISearch)
	search: IISearch;
}
