import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { ViewService } from '../view/view.service';

@Injectable()
export class FurnitureService {
	constructor(
		@InjectModel('Furniture') private readonly furnitureModel: Model<null>,
		private readonly authService: AuthService,
		private readonly viewService: ViewService,
	) {}
}
