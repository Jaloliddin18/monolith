import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { MemberAuthType, MemberType } from '../../enums/member.enum';

@InputType()
export class MemberInput {
	@IsNotEmpty() // should be not empty
	@Length(3, 12) // member nick length min 3, max 12 characters
	@Field(() => String) // return string value
	memberNick: string;

	@IsNotEmpty()
	@Length(5, 12)
	@Field(() => String)
	memberPassword: string;

	@IsNotEmpty()
	@Field(() => String)
	memberPhone: string;

	@IsOptional()
	@Field(() => MemberType, { nullable: true }) // bosh bolishi mumkin
	memberType?: MemberType;

	@IsOptional()
	@Field(() => MemberAuthType, { nullable: true }) // bosh bolishi mumkin
	memberAuthType?: MemberAuthType;
}

@InputType()
export class LoginInput {
	@IsNotEmpty() // should be not empty
	@Length(3, 12) // member nick length min 3, max 12 characters
	@Field(() => String) // return string value
	memberNick: string;

	@IsNotEmpty()
	@Length(5, 12)
	@Field(() => String)
	memberPassword: string;
}
