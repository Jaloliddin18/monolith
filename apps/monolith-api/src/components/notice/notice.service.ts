import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Notice, Notices } from '../../libs/dto/notice/notice';
import { NoticeInput, NoticesInquiry, NoticeUpdate } from '../../libs/dto/notice/notice.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { NoticeStatus } from '../../libs/enums/notice.enum';
import { lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { T } from '../../libs/types/common';
import { MemberService } from '../member/member.service';

@Injectable()
export class NoticeService {
	constructor(
		@InjectModel('Notice')
		private readonly noticeModel: Model<Notice>,
		private readonly memberService: MemberService,
	) {}

	public async createNoticeByAdmin(input: NoticeInput, memberId: ObjectId): Promise<Notice> {
		input.memberId = memberId;
		try {
			return await this.noticeModel.create(input);
		} catch (err) {
			console.error('Error, NoticeService.createNoticeByAdmin:', err.message);
			throw new BadRequestException(Message.BAD_REQUEST);
		}
	}

	public async getNotices(input: NoticesInquiry): Promise<Notices> {
		const { noticeCategory, noticeStatus } = input.search;
		const match: T = { noticeStatus: NoticeStatus.ACTIVE };
		const sort: T = {
			[input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
		};

		if (noticeCategory) match.noticeCategory = noticeCategory;

		const result = await this.noticeModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupMember,
							{ $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}

	public async getAllNoticesByAdmin(input: NoticesInquiry): Promise<Notices> {
		const { noticeCategory, noticeStatus, text } = input.search;
		const match: T = {};
		const sort: T = {
			[input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
		};

		if (noticeCategory) match.noticeCategory = noticeCategory;
		if (noticeStatus) match.noticeStatus = noticeStatus;
		if (text) match.noticeTitle = { $regex: new RegExp(text, 'i') };

		const result = await this.noticeModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupMember,
							{ $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}

	public async updateNoticeByAdmin(input: NoticeUpdate): Promise<Notice> {
		const { _id } = input;
		const result = await this.noticeModel
			.findOneAndUpdate({ _id: shapeIntoMongoObjectId(_id) }, input, { new: true })
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
		return result;
	}

	public async removeNoticeByAdmin(noticeId: ObjectId): Promise<Notice> {
		const result = await this.noticeModel
			.findOneAndDelete({ _id: noticeId, noticeStatus: NoticeStatus.DELETE })
			.exec();
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
		return result;
	}
}
