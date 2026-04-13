import { Schema } from 'mongoose';

const SubscriberSchema = new Schema(
	{
		subscriberEmail: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		unsubscribeToken: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{ timestamps: true, collection: 'subscribers' },
);

export default SubscriberSchema;
