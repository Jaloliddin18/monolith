import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { ViewService } from '../view/view.service';
import { Direction, Message } from '../../libs/enums/common.enum';
import {
	AllFurnituresInquiry,
	DesignerFurnituresInquiry,
	FurnitureInput,
	FurnituresInquiry,
} from '../../libs/dto/furniture/furniture.input';
import { Furniture, Furnitures } from '../../libs/dto/furniture/furniture';
import { MemberService } from '../member/member.service';
import { StatisticModifier, T } from '../../libs/types/common';
import { FurnitureStatus } from '../../libs/enums/furniture.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { FurnitureUpdate } from '../../libs/dto/furniture/furniture.update';
import { lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import moment from 'moment';

@Injectable()
export class FurnitureService {
	constructor(
		@InjectModel('Furniture') private readonly furnitureModel: Model<Furniture>,
		private readonly viewService: ViewService,
		private readonly memberService: MemberService,
	) {}

	public async createFurniture(input: FurnitureInput): Promise<Furniture> {
		try {
			const result = await this.furnitureModel.create(input);
			await this.memberService.memberStatsEditor({
				_id: result.memberId,
				targetKey: 'memberDesigns',
				modifier: 1,
			});
			return result;
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getFurniture(
		memberId: ObjectId,
		furnitureId: ObjectId,
	): Promise<Furniture> {
		const search: T = {
			_id: furnitureId,
			furnitureStatus: FurnitureStatus.ACTIVE,
		};
		const targetFurniture: Furniture = await this.furnitureModel
			.findOne(search)
			.lean()
			.exec();
		if (!targetFurniture)
			throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		if (memberId) {
			const viewInput = {
				memberId: memberId,
				viewRefId: furnitureId,
				viewGroup: ViewGroup.FURNITURE,
			};
			const newView = await this.viewService.recordView(viewInput);
			if (newView) {
				await this.furnitureStatsEditor({
					_id: furnitureId,
					targetKey: 'furnitureViews',
					modifier: 1,
				});
				targetFurniture.furnitureViews++;
			}
		}
		targetFurniture.memberData = await this.memberService.getMember(
			null,
			targetFurniture.memberId,
		);
		return targetFurniture;
	}

	public async updateFurniture(
		memberId: ObjectId,
		input: FurnitureUpdate,
	): Promise<Furniture> {
		let { furnitureStatus, discontinuedAt, deletedAt } = input;
		const search: T = {
			_id: input._id,
			memberId: memberId,
			furnitureStatus: FurnitureStatus.ACTIVE,
		};

		if (furnitureStatus === FurnitureStatus.DISCONTINUED)
			discontinuedAt = moment().toDate();
		else if (furnitureStatus === FurnitureStatus.DELETE)
			deletedAt = moment().toDate();
		// registering the furniture discontinued or deleted time

		const result = await this.furnitureModel
			.findOneAndUpdate(search, input, { new: true })
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (deletedAt) {
			await this.memberService.memberStatsEditor({
				_id: memberId,
				targetKey: 'memberDesigns',
				modifier: -1,
			});
		}
		return result;
	}

	public async getFurnitures(
		memberId: ObjectId,
		input: FurnituresInquiry,
	): Promise<Furnitures> {
		const match: T = { furnitureStatus: FurnitureStatus.ACTIVE };
		const sort: T = {
			[input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
		};

		this.shapeMatchQuery(match, input);
		console.log('match:', match);

		const result = await this.furnitureModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length)
			throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}

	private shapeMatchQuery(match: T, input: FurnituresInquiry): void {
		if (!input.search || Object.keys(input.search).length === 0) return;

		const {
			memberId,
			roomList,
			categoryList,
			styleList,
			materialList,
			colorList,
			assemblyDifficultyList,
			options,
			pricesRange,
			dimensionsRange,
			periodsRange,
			text,
		} = input.search;

		if (memberId) match.memberId = shapeIntoMongoObjectId(memberId);
		if (roomList && roomList.length) match.furnitureRoom = { $in: roomList };
		if (categoryList && categoryList.length)
			match.furnitureCategory = { $in: categoryList };
		if (styleList && styleList.length)
			match.furnitureStyle = { $in: styleList };
		if (materialList && materialList.length)
			match.furnitureMaterial = { $in: materialList };
		if (colorList && colorList.length)
			match.furnitureColor = { $in: colorList };
		if (assemblyDifficultyList && assemblyDifficultyList.length)
			match.assemblyDifficulty = { $in: assemblyDifficultyList };

		if (pricesRange)
			match.furniturePrice = { $gte: pricesRange.start, $lte: pricesRange.end };
		if (periodsRange)
			match.createdAt = { $gte: periodsRange.start, $lte: periodsRange.end };

		// Dimensions range — query nested furnitureDimensions fields
		if (dimensionsRange) {
			const { minWidth, maxWidth, minHeight, maxHeight, minDepth, maxDepth } =
				dimensionsRange;
			if (minWidth || maxWidth) {
				match['furnitureDimensions.width'] = {};
				if (minWidth) match['furnitureDimensions.width'].$gte = minWidth;
				if (maxWidth) match['furnitureDimensions.width'].$lte = maxWidth;
			}
			if (minHeight || maxHeight) {
				match['furnitureDimensions.height'] = {};
				if (minHeight) match['furnitureDimensions.height'].$gte = minHeight;
				if (maxHeight) match['furnitureDimensions.height'].$lte = maxHeight;
			}
			if (minDepth || maxDepth) {
				match['furnitureDimensions.depth'] = {};
				if (minDepth) match['furnitureDimensions.depth'].$gte = minDepth;
				if (maxDepth) match['furnitureDimensions.depth'].$lte = maxDepth;
			}
		}

		if (text) match.furnitureTitle = { $regex: new RegExp(text, 'i') };
		if (options) {
			match['$or'] = options.map((ele) => {
				return { [ele]: true };
			});
		}
	}

	public async getDesignerFurnitures(
		memberId: ObjectId,
		input: DesignerFurnituresInquiry,
	): Promise<Furnitures> {
		const { furnitureStatus } = input.search ?? {};
		if (furnitureStatus === FurnitureStatus.DELETE)
			throw new BadRequestException(Message.NOT_ALLOWED_REQUEST);

		const match: T = {
			memberId: memberId,
			furnitureStatus: furnitureStatus ?? { $ne: FurnitureStatus.DELETE },
		};

		const sort: T = {
			[input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
		};

		const result = await this.furnitureModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{
								$skip: (input.page - 1) * input.limit,
							},
							{
								$limit: input.limit,
							},
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length)
			throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}

	public async getAllFurnituresByAdmin(
		input: AllFurnituresInquiry,
	): Promise<Furnitures> {
		const { furnitureStatus, roomList, categoryList } = input.search ?? {};
		const match: T = {};
		const sort: T = {
			[input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
		};

		if (furnitureStatus) match.furnitureStatus = furnitureStatus;
		if (roomList) match.furnitureRoom = { $in: roomList };
		if (categoryList) match.furnitureCategory = { $in: categoryList };

		const result = await this.furnitureModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length)
			throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}

	public async updateFurnitureByAdmin(
		input: FurnitureUpdate,
	): Promise<Furniture> {
		let { furnitureStatus, discontinuedAt, deletedAt } = input;

		const search: T = {
			_id: input._id,
			furnitureStatus: FurnitureStatus.ACTIVE && FurnitureStatus.DISCONTINUED,
		};

		if (furnitureStatus === FurnitureStatus.DISCONTINUED)
			discontinuedAt = moment().toDate();
		else if (furnitureStatus === FurnitureStatus.DELETE)
			deletedAt = moment().toDate();

		const result = await this.furnitureModel
			.findOneAndUpdate(search, input, {
				new: true,
			})
			.exec();

		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (deletedAt) {
			await this.memberService.memberStatsEditor({
				_id: result.memberId,
				targetKey: 'memberDesigns',
				modifier: -1,
			});
		}

		return result;
	}

	public async removeFurnitureByAdmin(
		furnitureId: ObjectId,
	): Promise<Furniture> {
		const search: T = {
			_id: furnitureId,
			furnitureStatus: FurnitureStatus.DELETE,
		};

		const result = await this.furnitureModel.findOneAndDelete(search).exec();

		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

		return result;
	}

	public async furnitureStatsEditor(
		input: StatisticModifier,
	): Promise<Furniture> {
		const { _id, targetKey, modifier } = input;
		return await this.furnitureModel
			.findOneAndUpdate(
				{ _id },
				{ $inc: { [targetKey]: modifier } },
				{ new: true },
			)
			.exec();
	}
}
