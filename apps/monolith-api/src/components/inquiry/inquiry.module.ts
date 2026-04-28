import { Module } from '@nestjs/common';
import { InquiryResolver } from './inquiry.resolver';
import { InquiryService } from './inquiry.service';
import { MongooseModule } from '@nestjs/mongoose';
import InquirySchema from '../../schemas/Inquiry.model';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Inquiry', schema: InquirySchema }]),
		AuthModule,
	],
	providers: [InquiryResolver, InquiryService],
	exports: [InquiryService],
})
export class InquiryModule {}
