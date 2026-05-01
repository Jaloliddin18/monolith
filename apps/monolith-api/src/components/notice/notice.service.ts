import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Notice, Notices } from '../../libs/dto/notice/notice';
import { NoticeInput, NoticesInquiry, NoticeUpdate } from '../../libs/dto/notice/notice.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { NoticeCategory, NoticeStatus } from '../../libs/enums/notice.enum';
import { lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { T } from '../../libs/types/common';
import { MemberService } from '../member/member.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../../libs/enums/notification.enum';

@Injectable()
export class NoticeService {
	constructor(
		@InjectModel('Notice')
		private readonly noticeModel: Model<Notice>,
		private readonly memberService: MemberService,
		private readonly notificationService: NotificationService,
	) {}

	public async createNoticeByAdmin(input: NoticeInput, memberId: ObjectId): Promise<Notice> {
		input.memberId = memberId;
		try {
			const notice = await this.noticeModel.create(input);
			if (input.noticeStatus === NoticeStatus.ACTIVE && input.noticeCategory === NoticeCategory.ANNOUNCEMENT) {
				await this.sendAnnouncementNotifications(notice, memberId);
			}
			return notice;
		} catch (err) {
			console.error('Error, NoticeService.createNoticeByAdmin:', err instanceof Error ? err.message : String(err));
			throw new BadRequestException(Message.BAD_REQUEST);
		}
	}

	public async getNotices(input: NoticesInquiry): Promise<Notices> {
		const { noticeCategory } = input.search;
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

	public async updateNoticeByAdmin(input: NoticeUpdate, memberId: ObjectId): Promise<Notice> {
		const { _id } = input;
		const before = await this.noticeModel.findById(shapeIntoMongoObjectId(_id)).exec();
		const result = await this.noticeModel
			.findOneAndUpdate({ _id: shapeIntoMongoObjectId(_id) }, input, { new: true })
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (
			before?.noticeStatus !== NoticeStatus.ACTIVE &&
			result.noticeStatus === NoticeStatus.ACTIVE &&
			result.noticeCategory === NoticeCategory.ANNOUNCEMENT
		) {
			await this.sendAnnouncementNotifications(result, memberId);
		}
		return result;
	}

	public async getNoticeById(noticeId: string): Promise<Notice> {
		const result = await this.noticeModel
			.findOne({ _id: shapeIntoMongoObjectId(noticeId), noticeStatus: NoticeStatus.ACTIVE })
			.exec();
		if (!result) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result;
	}

	public async removeNoticeByAdmin(noticeId: ObjectId): Promise<Notice> {
		const result = await this.noticeModel
			.findOneAndDelete({ _id: noticeId, noticeStatus: NoticeStatus.DELETE })
			.exec();
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
		return result;
	}

	private async sendAnnouncementNotifications(notice: Notice, authorId: ObjectId): Promise<void> {
		try {
			const receiverIds = await this.memberService.getAllActiveMemberIds();
			await this.notificationService.createManyNotifications({
				notificationType: NotificationType.ANNOUNCEMENT,
				notificationTitle: notice.noticeTitle,
				notificationDesc: `New announcement: ${notice.noticeTitle}`,
				authorId,
				receiverIds,
				noticeId: notice._id as ObjectId,
			});
		} catch (err) {
			console.error(
				'Failed to send announcement notifications:',
				err instanceof Error ? err.message : String(err),
			);
		}
	}
}
