import mongoose, { Schema } from 'mongoose';
import { InquiryStatus } from '../libs/enums/inquiry.enum';

const InquirySchema = new Schema(
	{
		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		inquiryTitle: {
			type: String,
			required: true,
		},

		inquiryContent: {
			type: String,
			required: true,
		},

		inquiryStatus: {
			type: String,
			enum: InquiryStatus,
			default: InquiryStatus.PENDING,
		},

		inquiryResponse: {
			type: String,
		},

		respondedAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'inquiries' },
);

export default InquirySchema;
