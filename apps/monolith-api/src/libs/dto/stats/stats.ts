import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Member } from '../member/member';
import { Furniture } from '../furniture/furniture';

@ObjectType()
export class CategoryCount {
	@Field(() => String)
	category: string;

	@Field(() => Int)
	count: number;
}

@ObjectType()
export class RoomCount {
	@Field(() => String)
	room: string;

	@Field(() => Int)
	count: number;
}

@ObjectType()
export class MonthCount {
	@Field(() => String)
	month: string;

	@Field(() => Int)
	count: number;
}

@ObjectType()
export class AdminStats {
	@Field(() => Int)
	totalMembers: number;

	@Field(() => Int)
	totalDesigners: number;

	@Field(() => Int)
	totalFurnitures: number;

	@Field(() => Int)
	totalArticles: number;

	@Field(() => Int)
	totalSubscribers: number;

	@Field(() => Int)
	totalViews: number;

	@Field(() => Int)
	totalLikes: number;

	@Field(() => [Furniture])
	topViewedFurnitures: Furniture[];

	@Field(() => [Furniture])
	topLikedFurnitures: Furniture[];

	@Field(() => [Member])
	topDesigners: Member[];

	@Field(() => [Member])
	recentMembers: Member[];

	@Field(() => [CategoryCount])
	furnitureByCategory: CategoryCount[];

	@Field(() => [RoomCount])
	furnitureByRoom: RoomCount[];

	@Field(() => [MonthCount])
	memberGrowth: MonthCount[];
}
