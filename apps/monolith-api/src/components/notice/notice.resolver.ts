import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NoticeService } from './notice.service';
import { UseGuards } from '@nestjs/common';
import { Notice, Notices } from '../../libs/dto/notice/notice';
import { NoticeInput, NoticesInquiry, NoticeUpdate } from '../../libs/dto/notice/notice.input';
import type { ObjectId } from 'mongoose';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@Resolver()
export class NoticeResolver {
	constructor(private readonly noticeService: NoticeService) {}

	@UseGuards(WithoutGuard)
	@Query((returns) => Notices)
	public async getNotices(
		@Args('input') input: NoticesInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notices> {
		return await this.noticeService.getNotices(input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => Notice)
	public async getNoticeById(
		@Args('noticeId') noticeId: string,
	): Promise<Notice> {
		return await this.noticeService.getNoticeById(noticeId);
	}

	/** ADMIN **/

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Notice)
	public async createNoticeByAdmin(
		@Args('input') input: NoticeInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notice> {
		return await this.noticeService.createNoticeByAdmin(input, memberId);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query((returns) => Notices)
	public async getAllNoticesByAdmin(
		@Args('input') input: NoticesInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notices> {
		return await this.noticeService.getAllNoticesByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Notice)
	public async updateNoticeByAdmin(
		@Args('input') input: NoticeUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notice> {
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.noticeService.updateNoticeByAdmin(input, memberId);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Notice)
	public async removeNoticeByAdmin(
		@Args('noticeId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notice> {
		const noticeId = shapeIntoMongoObjectId(input);
		return await this.noticeService.removeNoticeByAdmin(noticeId);
	}
}
