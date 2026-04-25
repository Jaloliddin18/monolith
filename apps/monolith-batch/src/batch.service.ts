import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from '../../monolith-api/src/libs/dto/member/member';
import { Furniture } from '../../monolith-api/src/libs/dto/furniture/furniture';
import {
	MemberStatus,
	MemberType,
} from '../../monolith-api/src/libs/enums/member.enum';
import { FurnitureStatus } from '../../monolith-api/src/libs/enums/furniture.enum';
import { Model } from 'mongoose';

@Injectable()
export class BatchService {
	constructor(
		@InjectModel('Furniture') private readonly furnitureModel: Model<Furniture>,
		@InjectModel('Member') private readonly memberModel: Model<Member>,
	) {}
	public async batchRollBack(): Promise<void> {
		await this.furnitureModel
			.updateMany(
				{ furnitureStatus: FurnitureStatus.ACTIVE },
				{ furnitureRank: 0, furnitureTrending: 0, furnitureEngagement: 0 },
			)
			.exec();

		await this.memberModel
			.updateMany(
				{ memberStatus: MemberStatus.ACTIVE, memberType: MemberType.DESIGNER },
				{ memberRank: 0 },
			)
			.exec();
	}

	public async batchTopFurnitures(): Promise<void> {
		const furnitures: Furniture[] = await this.furnitureModel
			.find({
				furnitureStatus: FurnitureStatus.ACTIVE,
				furnitureRank: 0,
			})
			.exec();

		const promisedList = furnitures.map(async (ele: Furniture) => {
			const { _id, furnitureLikes, furnitureViews } = ele;
			const rank = furnitureLikes * 2 + furnitureViews * 1;
			return await this.furnitureModel.findByIdAndUpdate(_id, {
				furnitureRank: rank,
			});
		});
		await Promise.all(promisedList);
	}

	public async batchTopDesigners(): Promise<void> {
		const agents: Member[] = await this.memberModel
			.find({
				memberType: MemberType.DESIGNER,
				memberStatus: MemberStatus.ACTIVE,
				memberRank: 0,
			})
			.exec();

		const promisedList = agents.map(async (ele: Member) => {
			const { _id, memberDesigns, memberLikes, memberViews, memberArticles } =
				ele;
			const rank =
				memberDesigns * 5 +
				memberArticles * 3 +
				memberLikes * 2 +
				memberViews * 1;
			return await this.memberModel.findByIdAndUpdate(_id, {
				memberRank: rank,
			});
		});
		await Promise.all(promisedList);
	}

	public async batchTrendingFurnitures(): Promise<void> {
		const furnitures: Furniture[] = await this.furnitureModel
			.find({
				furnitureStatus: FurnitureStatus.ACTIVE,
				furnitureTrending: 0,
			})
			.exec();

		const promisedList = furnitures.map(async (ele: Furniture) => {
			const { _id, furnitureLikes, furnitureViews } = ele;
			const trending = furnitureViews * 1 + furnitureLikes * 2;
			return await this.furnitureModel.findByIdAndUpdate(_id, { furnitureTrending: trending });
		});
		await Promise.all(promisedList);
	}

	public async batchSuggestedFurnitures(): Promise<void> {
		const furnitures: Furniture[] = await this.furnitureModel
			.find({
				furnitureStatus: FurnitureStatus.ACTIVE,
				furnitureEngagement: 0,
			})
			.exec();

		const promisedList = furnitures.map(async (ele: Furniture) => {
			const { _id, furnitureLikes, furnitureViews, furnitureComments } = ele;
			const engagement = furnitureLikes * 2 + furnitureComments * 3 + furnitureViews * 1;
			return await this.furnitureModel.findByIdAndUpdate(_id, { furnitureEngagement: engagement });
		});
		await Promise.all(promisedList);
	}

	public async batchDiscountExpiry(): Promise<void> {
		const now = new Date();

		// Expire active discounts whose end date has passed
		await this.furnitureModel
			.updateMany(
				{ furnitureOnSale: true, discountEnd: { $lt: now } },
				{ furnitureOnSale: false, furnitureDiscount: 0 },
			)
			.exec();

		// Activate scheduled discounts whose window is now open
		await this.furnitureModel
			.updateMany(
				{
					furnitureOnSale: false,
					furnitureDiscount: { $gt: 0 },
					discountStart: { $lte: now },
					discountEnd: { $gte: now },
				},
				{ furnitureOnSale: true },
			)
			.exec();
	}

	public getHello(): string {
		return 'Welcome to Nestar BATCH server!';
	}
}
