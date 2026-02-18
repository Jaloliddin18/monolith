import { Resolver } from '@nestjs/graphql';
import { FurnitureService } from './furniture.service';

@Resolver()
export class FurnitureResolver {
	constructor(private readonly furnitureService: FurnitureService) {}
}
