import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { View } from '../../libs/dto/view/view';
import { ViewInput } from '../../libs/dto/view/view.input';
import { T } from '../../libs/types/common';
import { OrdinaryInquiry } from '../../libs/dto/furniture/furniture.input';
import { Furnitures } from '../../libs/dto/furniture/furniture';
import { ViewGroup } from '../../libs/enums/view.enum';
import { lookupVisit } from '../../libs/config';

@Injectable()
export class ViewService {
	constructor(@InjectModel('View') private readonly viewModel: Model<View>) {}

	public async recordView(input: ViewInput): Promise<View | null> {
		const viewExist = await this.checkViewExistane(input);
		if (!viewExist) {
			console.log('- New View Insertion -');
			return await this.viewModel.create(input);
		} else return null;
	}

	private async checkViewExistane(input: ViewInput): Promise<View> {
		const { memberId, viewRefId } = input;
		const search: T = { memberId: memberId, viewRefId: viewRefId };
		return await this.viewModel.findOne(search).exec();
	}

	public async getVisitedFurnitures(
		memberId: ObjectId,
		input: OrdinaryInquiry,
	): Promise<Furnitures> {
		const { page, limit } = input;
		const match: T = {
			viewGroup: ViewGroup.FURNITURE,
			memberId: memberId,
		};

		const data: T = await this.viewModel
			.aggregate([
				{ $match: match },
				{ $sort: { updatedAt: -1 } },
				// all liked properties by user from the latest liked one by sort
				{
					$lookup: {
						from: 'furnitures',
						localField: 'viewRefId',
						foreignField: '_id',
						as: 'visitedFurniture',
					},
				},
				{ $unwind: '$visitedFurniture' },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupVisit,
							{ $unwind: '$visitedFurniture.memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		console.log('data:', data);
		const result: Furnitures = {
			list: [],
			metaCounter: data[0]?.metaCounter || [],
		};
		console.log('result:', result);
		if (data[0]?.list) {
			result.list = data[0].list.map((ele) => ele.visitedFurniture);
		}
		return result;
	}
}
