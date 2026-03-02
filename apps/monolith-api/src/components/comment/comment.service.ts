import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { FurnitureService } from '../furniture/furniture.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { BoardArticleService } from '../board-article/board-article.service';
import { MemberService } from '../member/member.service';
import { lookupMember } from '../../libs/config';
import { Comment, Comments } from '../../libs/dto/comment/comment';
import {
	CommentInput,
	CommentsInquiry,
} from '../../libs/dto/comment/comment.input';
import { CommentUpdate } from '../../libs/dto/comment/comment.update';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { Message, Direction } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';

@Injectable()
export class CommentService {
	constructor(
		@InjectModel('Comment') private readonly commentModel: Model<Comment>,
		private readonly memberService: MemberService,
		private readonly furnitureService: FurnitureService,
		private readonly boardArticleService: BoardArticleService,
	) {}

	public async createComment(
		memberId: ObjectId,
		input: CommentInput,
	): Promise<Comment> {
		input.memberId = memberId;

		let result = null;

		try {
			result = await this.commentModel.create(input);
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}

		switch (input.commentGroup) {
			case CommentGroup.FURNITURE:
				await this.furnitureService.furnitureStatsEditor({
					_id: input.commentRefId,
					targetKey: 'furnitureComments',
					modifier: 1,
				});
				break;

			case CommentGroup.ARTICLE:
				await this.boardArticleService.boardArticleStatsEditor({
					_id: input.commentRefId,
					targetKey: 'articleComments',
					modifier: 1,
				});
				break;

			case CommentGroup.MEMBER:
				await this.memberService.memberStatsEditor({
					_id: input.commentRefId,
					targetKey: 'memberComments',
					modifier: 1,
				});
				break;
		}
		if (!result) throw new InternalServerErrorException(Message.CREATE_FAILED);
		return result;
	}

	public async updateComment(
		memberId: ObjectId,
		input: CommentUpdate,
	): Promise<Comment> {
		const { _id } = input;
		const result = await this.commentModel
			.findOneAndUpdate(
				{
					_id: _id,
					memberId: memberId,
					commentStatus: CommentStatus.ACTIVE,
				},
				input,
				{ new: true },
			)
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
		return result;
	}

	public async getComments(
		memberId: ObjectId,
		input: CommentsInquiry,
	): Promise<Comments> {
		const { commentRefId } = input.search;
		const match: T = {
			commentRefId: commentRefId,
			commentStatus: CommentStatus.ACTIVE,
		};
		const sort: T = {
			[input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
		};

		const result: Comments[] = await this.commentModel
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
		if (!result) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}
}
