import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../../libs/dto/member/member';
import { Furniture } from '../../libs/dto/furniture/furniture';
import { AdminStats, CategoryCount, MonthCount, RoomCount } from '../../libs/dto/stats/stats';
import { MemberType } from '../../libs/enums/member.enum';

@Injectable()
export class StatsService {
	constructor(
		@InjectModel('Member') private readonly memberModel: Model<Member>,
		@InjectModel('Furniture') private readonly furnitureModel: Model<Furniture>,
		@InjectModel('BoardArticle') private readonly boardArticleModel: Model<any>,
		@InjectModel('Subscriber') private readonly subscriberModel: Model<any>,
	) {}

	public async getAdminStats(): Promise<AdminStats> {
		const [
			totalMembers,
			totalDesigners,
			totalFurnitures,
			totalArticles,
			totalSubscribers,
			viewsAgg,
			likesAgg,
			topViewedFurnitures,
			topLikedFurnitures,
			topDesigners,
			recentMembers,
			furnitureByCategory,
			furnitureByRoom,
			memberGrowth,
		] = await Promise.all([
			this.memberModel.countDocuments({ memberType: { $ne: MemberType.ADMIN } }),
			this.memberModel.countDocuments({ memberType: MemberType.DESIGNER }),
			this.furnitureModel.countDocuments({ furnitureStatus: { $ne: 'DELETE' } }),
			this.boardArticleModel.countDocuments({ articleStatus: { $ne: 'DELETE' } }),
			this.subscriberModel.countDocuments({ isActive: true }),

			this.furnitureModel.aggregate([
				{ $group: { _id: null, total: { $sum: '$furnitureViews' } } },
			]),

			this.furnitureModel.aggregate([
				{ $group: { _id: null, total: { $sum: '$furnitureLikes' } } },
			]),

			this.furnitureModel
				.find({ furnitureStatus: { $ne: 'DELETE' } })
				.sort({ furnitureViews: -1 })
				.limit(5)
				.lean(),

			this.furnitureModel
				.find({ furnitureStatus: { $ne: 'DELETE' } })
				.sort({ furnitureLikes: -1 })
				.limit(5)
				.lean(),

			this.memberModel
				.find({ memberType: MemberType.DESIGNER })
				.sort({ memberRank: -1 })
				.limit(5)
				.lean(),

			this.memberModel
				.find({ memberType: { $ne: MemberType.ADMIN } })
				.sort({ createdAt: -1 })
				.limit(10)
				.lean(),

			this.furnitureModel.aggregate([
				{ $match: { furnitureStatus: { $ne: 'DELETE' } } },
				{ $group: { _id: '$furnitureCategory', count: { $sum: 1 } } },
				{ $project: { category: '$_id', count: 1, _id: 0 } },
				{ $sort: { count: -1 } },
			]),

			this.furnitureModel.aggregate([
				{ $match: { furnitureStatus: { $ne: 'DELETE' } } },
				{ $group: { _id: '$furnitureRoom', count: { $sum: 1 } } },
				{ $project: { room: '$_id', count: 1, _id: 0 } },
				{ $sort: { count: -1 } },
			]),

			this.memberModel.aggregate([
				{
					$match: {
						memberType: { $ne: MemberType.ADMIN },
						createdAt: {
							$gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
						},
					},
				},
				{
					$group: {
						_id: {
							$dateToString: { format: '%Y-%m', date: '$createdAt' },
						},
						count: { $sum: 1 },
					},
				},
				{ $project: { month: '$_id', count: 1, _id: 0 } },
				{ $sort: { month: 1 } },
			]),
		]);

		return {
			totalMembers,
			totalDesigners,
			totalFurnitures,
			totalArticles,
			totalSubscribers,
			totalViews: viewsAgg[0]?.total ?? 0,
			totalLikes: likesAgg[0]?.total ?? 0,
			topViewedFurnitures: topViewedFurnitures as any,
			topLikedFurnitures: topLikedFurnitures as any,
			topDesigners: topDesigners as any,
			recentMembers: recentMembers as any,
			furnitureByCategory: furnitureByCategory as CategoryCount[],
			furnitureByRoom: furnitureByRoom as RoomCount[],
			memberGrowth: memberGrowth as MonthCount[],
		};
	}
}
