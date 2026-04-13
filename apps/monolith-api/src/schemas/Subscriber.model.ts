import { Schema } from 'mongoose';

const SubscriberSchema = new Schema(
	{
		subscriberEmail: {
			type: String,
			required: true,
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
		},
	},
	{ timestamps: true, collection: 'subscribers' },
);

SubscriberSchema.index({ subscriberEmail: 1 }, { unique: true });
SubscriberSchema.index({ unsubscribeToken: 1 }, { unique: true });

export default SubscriberSchema;
