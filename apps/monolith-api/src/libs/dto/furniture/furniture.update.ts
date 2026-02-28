import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';

import type { ObjectId } from 'mongoose';
import {
	AssemblyDifficulty,
	AssemblyType,
	DeliveryMethod,
	FurnitureCategory,
	FurnitureColor,
	FurnitureMaterial,
	FurnitureRoom,
	FurnitureStatus,
	FurnitureStyle,
	SustainabilityLabel,
} from '../../enums/furniture.enum';

@InputType()
class FurnitureDimensionsUpdate {
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
export class FurnitureUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Length(3, 100)
	@Field(() => String, { nullable: true })
	furnitureTitle?: string;

	@IsOptional()
	@Field(() => FurnitureRoom, { nullable: true })
	furnitureRoom?: FurnitureRoom;

	@IsOptional()
	@Field(() => FurnitureCategory, { nullable: true })
	furnitureCategory?: FurnitureCategory;

	@IsOptional()
	@Field(() => FurnitureStyle, { nullable: true })
	furnitureStyle?: FurnitureStyle;

	@IsOptional()
	@Field(() => FurnitureStatus, { nullable: true })
	furnitureStatus?: FurnitureStatus;

	@IsOptional()
	@Field(() => Number, { nullable: true })
	furniturePrice?: number;

	@IsOptional()
	@Field(() => Number, { nullable: true })
	furnitureLastChancePrice?: number;

	@IsOptional()
	@Field(() => FurnitureDimensionsUpdate, { nullable: true })
	furnitureDimensions?: FurnitureDimensionsUpdate;

	@IsOptional()
	@Field(() => Number, { nullable: true })
	furnitureWeight?: number;

	@IsOptional()
	@Field(() => FurnitureMaterial, { nullable: true })
	furnitureMaterial?: FurnitureMaterial;

	@IsOptional()
	@Field(() => FurnitureColor, { nullable: true })
	furnitureColor?: FurnitureColor;

	@IsOptional()
	@Field(() => SustainabilityLabel, { nullable: true })
	sustainabilityLabel?: SustainabilityLabel;

	@IsOptional()
	@Field(() => AssemblyType, { nullable: true })
	assemblyType?: AssemblyType;

	@IsOptional()
	@Field(() => Number, { nullable: true })
	assemblyTime?: number;

	@IsOptional()
	@Field(() => AssemblyDifficulty, { nullable: true })
	assemblyDifficulty?: AssemblyDifficulty;

	@IsOptional()
	@Field(() => DeliveryMethod, { nullable: true })
	deliveryMethod?: DeliveryMethod;

	@IsOptional()
	@Field(() => [String], { nullable: true })
	furnitureImages?: string[];

	@IsOptional()
	@Field(() => String, { nullable: true })
	furnitureVideo?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	furniture3DModel?: string;

	@IsOptional()
	@Length(5, 500)
	@Field(() => String, { nullable: true })
	furnitureDesc?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	assemblyInstructions?: string;

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

	discontinuedAt?: Date;

	deletedAt?: Date;
}
