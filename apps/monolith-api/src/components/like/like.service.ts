import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Like, LikedByMe } from '../../libs/dto/like/like';
import { Message } from '../../libs/enums/common.enum';
import { LikeInput } from '../../libs/dto/like/like.input';
import { T } from '../../libs/types/common';
import { OrdinaryInquiry } from '../../libs/dto/furniture/furniture.input';
import { Furnitures } from '../../libs/dto/furniture/furniture';
import { LikeGroup } from '../../libs/enums/like.enum';
import { lookupFavorite } from '../../libs/config';

@Injectable()
export class LikeService {
	constructor(@InjectModel('Like') private readonly likeModel: Model<Like>) {}

	public async toggleLike(input: LikeInput): Promise<number> {
		const search: T = { memberId: input.memberId, likeRefId: input.likeRefId },
			exist = await this.likeModel.findOne(search).exec();
		let modifier = 1;

		if (exist) {
			await this.likeModel.findOneAndDelete(search).exec();
			modifier = -1;
		} else {
			try {
				await this.likeModel.create(input);
			} catch (err) {
				console.log('Error, Service.model:', err.message);
				throw new BadRequestException(Message.CREATE_FAILED);
			}
		}
		console.log(`- Like modifier ${modifier} -`);
		return modifier;
	}

	public async checkLikeExistance(input: LikeInput): Promise<LikedByMe[]> {
		const { memberId, likeRefId } = input;
		const result = await this.likeModel
			.findOne({ memberId: memberId, likeRefId: likeRefId })
			.exec();
		return result
			? [{ memberId: memberId, likeRefId: likeRefId, myFavorite: true }]
			: [];
	}

	public async getFavoriteFurnitures(
		memberId: ObjectId,
		input: OrdinaryInquiry,
	): Promise<Furnitures> {
		const { page, limit } = input;
		const match: T = { likeGroup: LikeGroup.FURNITURE, memberId: memberId };

		const data: T = await this.likeModel
			.aggregate([
				{ $match: match },
				{ $sort: { updatedAt: -1 } },
				{
					$lookup: {
						from: 'furnitures',
						localField: 'likeRefId',
						foreignField: '_id',
						as: 'favoriteFurniture',
					},
				},
				{ $unwind: '$favoriteFurniture' },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupFavorite,
							{ $unwind: '$favoriteFurniture.memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		const result: Furnitures = { list: [], metaCounter: data[0].metaCounter };
		result.list = data[0].list.map(
			(ele: { favoriteFurniture: any }) => ele.favoriteFurniture,
		);
		return result;
	}
}
