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
			width: { type: Number, required: true },
			height: { type: Number, required: true },
			depth: { type: Number, required: true },
		},
		furnitureWeight: {
			type: Number,
		},
		// Package dimensions (flat-pack)
		packageDimensions: {
			width: { type: Number },
			height: { type: Number },
			depth: { type: Number },
			weight: { type: Number },
			packages: { type: Number, default: 1 },
		},
		furnitureMaterials: {
			type: [String],
			enum: FurnitureMaterial,
			required: true,
		},
		furnitureColors: {
			type: [String],
			required: true,
		},
		sustainabilityLabels: {
			type: [String],
			enum: SustainabilityLabel,
			default: [SustainabilityLabel.NONE],
		},
		assemblyType: {
			type: String,
			enum: AssemblyType,
			default: AssemblyType.SELF_ASSEMBLY,
		},
		assemblyTime: {
			type: Number, // Minutes
		},
		assemblyDifficulty: {
			type: String,
			enum: AssemblyDifficulty,
			default: AssemblyDifficulty.MEDIUM,
		},
		deliveryMethods: {
			type: [String],
			enum: DeliveryMethod,
			default: [DeliveryMethod.HOME_DELIVERY],
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
		furnitureRating: {
			type: Number,
			default: 0,
		},
		furnitureReviews: {
			type: Number,
			default: 0,
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
