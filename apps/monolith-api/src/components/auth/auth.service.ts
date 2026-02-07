import { Injectable } from '@nestjs/common';
import * as bycript from 'bcryptjs';
import { Member } from '../../libs/dto/member/member';
import { T } from '../../libs/types/common';
import { JwtService } from '@nestjs/jwt';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Injectable()
export class AuthService {
	public async hashPasword(memberPassword: string): Promise<string> {
		const salt = await bycript.genSalt();
		return await bycript.hash(memberPassword, salt);
	}
	public async comparePasswords(
		password: string,
		hashedPassword: string,
	): Promise<boolean> {
		return await bycript.compare(password, hashedPassword);
	}
}
