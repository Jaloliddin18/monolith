import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { ViewService } from '../view/view.service';
import { Message } from '../../libs/enums/common.enum';
import { FurnitureInput } from '../../libs/dto/furniture/furniture.input';
import { Furniture } from '../../libs/dto/furniture/furniture';
import { MemberService } from '../member/member.service';
import { StatisticModifier, T } from '../../libs/types/common';
import { FurnitureStatus } from '../../libs/enums/furniture.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { FurnitureUpdate } from '../../libs/dto/furniture/furniture.update';
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
}
