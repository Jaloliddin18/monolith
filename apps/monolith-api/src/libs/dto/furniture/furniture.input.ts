import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import {
	AssemblyType,
	DeliveryMethod,
	FurnitureCategory,
	FurnitureMaterial,
	FurnitureRoom,
	FurnitureStyle,
} from '../../enums/furniture.enum';
import { ObjectId } from 'mongoose';

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
	@Field(() => Date, { nullable: true })
	launchedAt?: Date;

	@IsOptional()
	@Field(() => FurnitureDimensionsInput, { nullable: true })
	furnitureDimensions?: FurnitureDimensionsInput;
}
