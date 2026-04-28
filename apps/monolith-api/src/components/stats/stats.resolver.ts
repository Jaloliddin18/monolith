import { Query, Resolver } from '@nestjs/graphql';
import { StatsService } from './stats.service';
import { AdminStats } from '../../libs/dto/stats/stats';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberType } from '../../libs/enums/member.enum';

@Resolver()
export class StatsResolver {
	constructor(private readonly statsService: StatsService) {}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => AdminStats)
	public async getAdminStats(): Promise<AdminStats> {
		return this.statsService.getAdminStats();
	}
}
