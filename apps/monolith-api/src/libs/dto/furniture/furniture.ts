import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import {
	AssemblyDifficulty,
	AssemblyType,
	DeliveryMethod,
	FurnitureCategory,
	FurnitureMaterial,
	FurnitureRoom,
	FurnitureStatus,
	FurnitureStyle,
	SustainabilityLabel,
} from '../../enums/furniture.enum';
import { Member, TotalCounter } from '../member/member';

@ObjectType()
export class FurnitureDimensions {
	@Field(() => Number, { nullable: true })
	width?: number;

	@Field(() => Number, { nullable: true })
	height?: number;

	@Field(() => Number, { nullable: true })
	depth?: number;
}

@ObjectType()
export class Furniture {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	furnitureTitle: string;

	@Field(() => FurnitureRoom)
	furnitureRoom: FurnitureRoom;

	@Field(() => FurnitureCategory)
	furnitureCategory: FurnitureCategory;

	@Field(() => FurnitureStyle)
	furnitureStyle: FurnitureStyle;

	@Field(() => FurnitureStatus)
	furnitureStatus: FurnitureStatus;

	@Field(() => FurnitureMaterial)
	furnitureMaterial: FurnitureMaterial;

	@Field(() => SustainabilityLabel)
	sustainabilityLabel: SustainabilityLabel;

	@Field(() => AssemblyType)
	assemblyType: AssemblyType;

	@Field(() => AssemblyDifficulty)
	assemblyDifficulty: AssemblyDifficulty;

	@Field(() => DeliveryMethod)
	deliveryMethod: DeliveryMethod;

	@Field(() => Number)
	furniturePrice: number;

	@Field(() => Number, { nullable: true })
	furnitureLastChancePrice?: number;

	@Field(() => FurnitureDimensions, { nullable: true })
	furnitureDimensions?: FurnitureDimensions;

	@Field(() => Number)
	furnitureWeight: number;

	@Field(() => String)
	furnitureColor: string;

	@Field(() => Number)
	assemblyTime: number;

	@Field(() => [String])
	furnitureImages: string[];

	@Field(() => String, { nullable: true })
	furnitureVideo?: string;

	@Field(() => String, { nullable: true })
	furniture3DModel?: string;

	@Field(() => String, { nullable: true })
	furnitureDesc?: string;

	@Field(() => String, { nullable: true })
	assemblyInstructions?: string;

	@Field(() => Int)
	furnitureViews: number;

	@Field(() => Int)
	furnitureLikes: number;

	@Field(() => Int)
	furnitureComments: number;

	@Field(() => Int)
	furnitureRank: number;

	@Field(() => Boolean)
	furnitureRent: boolean;

	@Field(() => Date, { nullable: true })
	launchedAt?: Date;

	@Field(() => Date, { nullable: true })
	discontinuedAt?: Date;

	@Field(() => Date, { nullable: true })
	deletedAt?: Date;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Member, { nullable: true })
	memberData?: Member;
}

@ObjectType()
export class Furnitures {
	@Field(() => [Furniture])
	list: Furniture[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
