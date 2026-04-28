import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InquiryService } from './inquiry.service';
import { UseGuards } from '@nestjs/common';
import { Inquiry, Inquiries } from '../../libs/dto/inquiry/inquiry';
import { InquiriesInquiry, InquiryInput, InquiryResponse } from '../../libs/dto/inquiry/inquiry.input';
import type { ObjectId } from 'mongoose';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@Resolver()
export class InquiryResolver {
	constructor(private readonly inquiryService: InquiryService) {}

	@UseGuards(AuthGuard)
	@Mutation((returns) => Inquiry)
	public async createInquiry(
		@Args('input') input: InquiryInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Inquiry> {
		return await this.inquiryService.createInquiry(input, memberId);
	}

	@UseGuards(AuthGuard)
	@Query((returns) => Inquiries)
	public async getMyInquiries(
		@Args('input') input: InquiriesInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Inquiries> {
		return await this.inquiryService.getMyInquiries(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Mutation((returns) => Inquiry)
	public async closeInquiry(
		@Args('inquiryId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Inquiry> {
		const inquiryId = shapeIntoMongoObjectId(input);
		return await this.inquiryService.closeInquiry(inquiryId, memberId);
	}

	/** ADMIN **/

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query((returns) => Inquiries)
	public async getAllInquiriesByAdmin(
		@Args('input') input: InquiriesInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Inquiries> {
		return await this.inquiryService.getAllInquiriesByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Inquiry)
	public async respondToInquiry(
		@Args('input') input: InquiryResponse,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Inquiry> {
		return await this.inquiryService.respondToInquiry(input);
	}
}
