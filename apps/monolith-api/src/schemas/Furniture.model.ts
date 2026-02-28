import { Schema } from 'mongoose';
import {
	FurnitureRoom,
	FurnitureCategory,
	FurnitureStyle,
	FurnitureStatus,
	FurnitureMaterial,
	AssemblyType,
	AssemblyDifficulty,
	DeliveryMethod,
	SustainabilityLabel,
} from '../libs/enums/furniture.enum';
const FurnitureSchema = new Schema(
	{
		furnitureTitle: {
			type: String,
			required: true,
		},
		furnitureRoom: {
			type: String,
			enum: FurnitureRoom,
			required: true,
		},
		furnitureCategory: {
			type: String,
			enum: FurnitureCategory,
			required: true,
		},
		furnitureStyle: {
			type: String,
			enum: FurnitureStyle,
			required: true,
		},
		furnitureStatus: {
			type: String,
			enum: FurnitureStatus,
			default: FurnitureStatus.ACTIVE,
		},
		furniturePrice: {
			type: Number,
			required: true,
		},
		furnitureLastChancePrice: {
			type: Number, // Clearance price
		},
		furnitureDimensions: {
			width: { type: Number },
			height: { type: Number },
			depth: { type: Number },
		},
		furnitureWeight: {
			type: Number,
			required: true,
		},

		furnitureMaterial: {
			type: String,
			enum: FurnitureMaterial,
			required: true,
		},
		furnitureColor: {
			type: String,
			required: true,
		},
		sustainabilityLabel: {
			type: String,
			enum: SustainabilityLabel,
			default: SustainabilityLabel.NONE,
		},
		assemblyType: {
			type: String,
			enum: AssemblyType,
			default: AssemblyType.SELF_ASSEMBLY,
			required: true,
		},
		assemblyTime: {
			type: Number, // Minutes
			required: true,
		},
		assemblyDifficulty: {
			type: String,
			enum: AssemblyDifficulty,
			default: AssemblyDifficulty.MEDIUM,
		},
		deliveryMethod: {
			type: String,
			enum: DeliveryMethod,
			default: DeliveryMethod.HOME_DELIVERY,
			required: true,
		},
		furnitureImages: {
			type: [String],
			required: true,
		},
		furnitureVideo: {
			type: String,
		},
		furniture3DModel: {
			type: String, // AR/3D view URL
		},
		furnitureDesc: {
			type: String,
		},
		assemblyInstructions: {
			type: String, // PDF URL
		},
		furnitureViews: {
			type: Number,
			default: 0,
		},
		furnitureLikes: {
			type: Number,
			default: 0,
		},
		furnitureComments: {
			type: Number,
			default: 0,
		},
		furnitureRank: {
			type: Number,
			default: 0,
		},
		furnitureRent: {
			type: Boolean,
			default: false,
		},
		furnitureDiscount: {
			type: Number, // Percentage (0-100)
			default: 0,
			min: 0,
			max: 100,
		},
		discountStart: {
			type: Date,
		},
		discountEnd: {
			type: Date,
		},
		furnitureOnSale: {
			type: Boolean,
			default: false,
		},
		furnitureBestseller: {
			type: Boolean,
			default: false,
		},
		launchedAt: {
			type: Date,
		},
		discontinuedAt: {
			type: Date,
		},
		deletedAt: {
			type: Date,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},
	},
	{ timestamps: true, collection: 'furnitures' },
);

FurnitureSchema.index(
	{
		furnitureRoom: 1,
		furnitureCategory: 1,
		furnitureTitle: 1,
		furniturePrice: 1,
	},
	{ unique: true },
);
// Compound index for browsing
FurnitureSchema.index({
	furnitureRoom: 1,
	furnitureCategory: 1,
	furnitureStatus: 1,
});
// Search index
FurnitureSchema.index({ furnitureTitle: 'text', furnitureDesc: 'text' });

export default FurnitureSchema;
