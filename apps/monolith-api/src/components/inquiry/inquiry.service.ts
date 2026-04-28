import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Inquiry, Inquiries } from '../../libs/dto/inquiry/inquiry';
import { InquiriesInquiry, InquiryInput, InquiryResponse } from '../../libs/dto/inquiry/inquiry.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { InquiryStatus } from '../../libs/enums/inquiry.enum';
import { lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { T } from '../../libs/types/common';

@Injectable()
export class InquiryService {
	constructor(
		@InjectModel('Inquiry')
		private readonly inquiryModel: Model<Inquiry>,
	) {}

	public async createInquiry(input: InquiryInput, memberId: ObjectId): Promise<Inquiry> {
		input.memberId = memberId;
		try {
			return await this.inquiryModel.create(input);
		} catch (err) {
			console.error('Error, InquiryService.createInquiry:', err.message);
			throw new BadRequestException(Message.BAD_REQUEST);
		}
	}

	public async getMyInquiries(memberId: ObjectId, input: InquiriesInquiry): Promise<Inquiries> {
		const { inquiryStatus } = input.search;
		const match: T = { memberId: memberId };
		const sort: T = {
			[input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
		};

		if (inquiryStatus) match.inquiryStatus = inquiryStatus;

		const result = await this.inquiryModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}

	public async closeInquiry(inquiryId: ObjectId, memberId: ObjectId): Promise<Inquiry> {
		const result = await this.inquiryModel
			.findOneAndUpdate(
				{
					_id: inquiryId,
					memberId: memberId,
					inquiryStatus: { $in: [InquiryStatus.PENDING, InquiryStatus.ANSWERED] },
				},
				{ inquiryStatus: InquiryStatus.CLOSED },
				{ new: true },
			)
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
		return result;
	}

	public async getAllInquiriesByAdmin(input: InquiriesInquiry): Promise<Inquiries> {
		const { inquiryStatus } = input.search;
		const match: T = {};
		const sort: T = {
			[input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
		};

		if (inquiryStatus) match.inquiryStatus = inquiryStatus;

		const result = await this.inquiryModel
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

	public async respondToInquiry(input: InquiryResponse): Promise<Inquiry> {
		const inquiryId = shapeIntoMongoObjectId(input.inquiryId);
		const result = await this.inquiryModel
			.findOneAndUpdate(
				{ _id: inquiryId, inquiryStatus: { $ne: InquiryStatus.CLOSED } },
				{
					inquiryStatus: InquiryStatus.ANSWERED,
					inquiryResponse: input.inquiryResponse,
					respondedAt: new Date(),
				},
				{ new: true },
			)
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
		return result;
	}
}
