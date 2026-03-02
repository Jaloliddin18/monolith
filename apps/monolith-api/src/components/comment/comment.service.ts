import { Injectable } from '@nestjs/common';
import { FurnitureService } from '../furniture/furniture.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BoardArticleService } from '../board-article/board-article.service';
import { MemberService } from '../member/member.service';

@Injectable()
export class CommentService {
	constructor(
		@InjectModel('Comment') private readonly commentModel: Model<Comment>,
		private readonly memberService: MemberService,
		private readonly furnitureService: FurnitureService,
		private readonly boardArticleService: BoardArticleService,
	) {}
}
