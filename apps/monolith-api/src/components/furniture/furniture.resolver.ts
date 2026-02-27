import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FurnitureService } from './furniture.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { Furniture } from '../../libs/dto/furniture/furniture';
import { FurnitureInput } from '../../libs/dto/furniture/furniture.input';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { FurnitureUpdate } from '../../libs/dto/furniture/furniture.update';

@Resolver()
export class FurnitureResolver {
	constructor(private readonly furnitureService: FurnitureService) {}

	@Roles(MemberType.DESIGNER)
	@UseGuards(RolesGuard)
	@Mutation(() => Furniture)
	public async createFurniture(
		@Args('input') input: FurnitureInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Furniture> {
		console.log('Mutation: createFurniture');
		input.memberId = memberId;
		return await this.furnitureService.createFurniture(input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => Furniture)
	public async getFurniture(
		@Args('furnitureId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Furniture> {
		console.log('Query: getFurniture');
		const furnitureId = shapeIntoMongoObjectId(input);
		return await this.furnitureService.getFurniture(memberId, furnitureId);
	}

	@Roles(MemberType.DESIGNER)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Furniture)
	public async updateFurniture(
		@Args('input') input: FurnitureUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Furniture> {
		console.log('Query: updateProperty');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.furnitureService.updateFurniture(memberId, input);
	}
}
