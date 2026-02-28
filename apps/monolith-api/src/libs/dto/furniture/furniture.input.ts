import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import {
	AssemblyType,
	DeliveryMethod,
	FurnitureCategory,
	FurnitureMaterial,
	FurnitureRoom,
	FurnitureStyle,
} from '../../enums/furniture.enum';
import type { ObjectId } from 'mongoose';
import { availableFurnitureSorts, availableOptions } from '../../config';
import { Direction } from '../../enums/common.enum';

@InputType()
class FurnitureDimensionsInput {
	@IsOptional()
	@Field(() => Number, { nullable: true })
	width?: number;

	@IsOptional()
	@Field(() => Number, { nullable: true })
	height?: number;

	@IsOptional()
	@Field(() => Number, { nullable: true })
	depth?: number;
}

@InputType()
export class FurnitureInput {
	@IsNotEmpty()
	@Length(3, 100)
	@Field(() => String)
	furnitureTitle: string;

	@IsNotEmpty()
	@Field(() => FurnitureRoom)
	furnitureRoom: FurnitureRoom;

	@IsNotEmpty()
	@Field(() => FurnitureCategory)
	furnitureCategory: FurnitureCategory;

	@IsNotEmpty()
	@Field(() => FurnitureStyle)
	furnitureStyle: FurnitureStyle;

	@IsNotEmpty()
	@Field(() => Number)
	furniturePrice: number;

	@IsNotEmpty()
	@Field(() => Number)
	furnitureWeight: number;

	@IsNotEmpty()
	@Field(() => FurnitureMaterial)
	furnitureMaterial: FurnitureMaterial;

	@IsNotEmpty()
	@Field(() => String)
	furnitureColor: string;

	@IsNotEmpty()
	@Field(() => AssemblyType)
	assemblyType: AssemblyType;

	@IsNotEmpty()
	@Field(() => Number)
	assemblyTime: number;

	@IsNotEmpty()
	@Field(() => DeliveryMethod)
	deliveryMethod: DeliveryMethod;

	@IsNotEmpty()
	@Field(() => [String])
	furnitureImages: string[];

	@IsOptional()
	@Length(5, 500)
	@Field(() => String, { nullable: true })
	furnitureDesc?: string;

	memberId?: ObjectId;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	furnitureRent?: boolean;

	@IsOptional()
	@Field(() => Number, { nullable: true })
	furnitureDiscount?: number;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	discountStart?: Date;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	discountEnd?: Date;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	furnitureOnSale?: boolean;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	furnitureBestseller?: boolean;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	launchedAt?: Date;

	@IsOptional()
	@Field(() => FurnitureDimensionsInput, { nullable: true })
	furnitureDimensions?: FurnitureDimensionsInput;
}

@InputType()
export class PricesRange {
	@Field(() => Int)
	start: number;

	@Field(() => Int)
	end: number;
}

@InputType()
export class PeriodsRange {
	@Field(() => Date)
	start: Date;

	@Field(() => Date)
	end: Date;
}

@InputType()
export class FIsearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	memberId?: ObjectId;

	@IsOptional()
	@Field(() => [FurnitureRoom], { nullable: true })
	roomList?: FurnitureRoom[];

	@IsOptional()
	@Field(() => [FurnitureCategory], { nullable: true })
	categoryList?: FurnitureCategory[];

	@IsOptional()
	@Field(() => [FurnitureStyle], { nullable: true })
	styleList?: FurnitureStyle[];

	@IsOptional()
	@Field(() => [FurnitureMaterial], { nullable: true })
	materialList?: FurnitureMaterial[];

	@IsOptional()
	@IsIn(availableOptions, { each: true })
	@Field(() => [String], { nullable: true })
	options?: string[];

	@IsOptional()
	@Field(() => PricesRange, { nullable: true })
	pricesRange?: PricesRange;

	@IsOptional()
	@Field(() => PeriodsRange, { nullable: true })
	periodsRange?: PeriodsRange;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

@InputType()
export class FurnituresInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableFurnitureSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsOptional()
	@Field(() => FIsearch, { nullable: true })
	search?: FIsearch;
}
