import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ViewService } from '../view/view.service';
import { Message } from '../../libs/enums/common.enum';
import { FurnitureInput } from '../../libs/dto/furniture/furniture.input';
import { Furniture } from '../../libs/dto/furniture/furniture';
import { MemberService } from '../member/member.service';

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
}
