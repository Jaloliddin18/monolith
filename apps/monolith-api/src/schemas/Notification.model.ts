import { Schema } from 'mongoose';
import {
	NotificationGroup,
	NotificationStatus,
	NotificationType,
} from '../libs/enums/notification.enum';

const NotificationSchema = new Schema(
	{
		notificationType: {
			type: String,
			enum: NotificationType,
			required: true,
		},

		notificationStatus: {
			type: String,
			enum: NotificationStatus,
			default: NotificationStatus.WAIT,
		},

		notificationGroup: {
			type: String,
			enum: NotificationGroup,
		},

		notificationTitle: {
			type: String,
			required: true,
		},

		notificationDesc: {
			type: String,
		},

		authorId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		receiverId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		furnitureId: {
			type: Schema.Types.ObjectId,
			ref: 'Furniture',
		},

		articleId: {
			type: Schema.Types.ObjectId,
			ref: 'BoardArticle',
		},

		noticeId: {
			type: Schema.Types.ObjectId,
			ref: 'Notice',
		},
	},
	{ timestamps: true, collection: 'notifications' },
);

export default NotificationSchema;
