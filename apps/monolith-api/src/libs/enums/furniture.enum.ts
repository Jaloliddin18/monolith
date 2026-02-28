import { registerEnumType } from '@nestjs/graphql';

// ROOM CATEGORIES (IKEA Navigation)
export enum FurnitureRoom {
	LIVING_ROOM = 'LIVING_ROOM',
	BEDROOM = 'BEDROOM',
	KITCHEN = 'KITCHEN',
	DINING = 'DINING',
	BATHROOM = 'BATHROOM',
	HOME_OFFICE = 'HOME_OFFICE',
	CHILDRENS_ROOM = 'CHILDRENS_ROOM',
	OUTDOOR = 'OUTDOOR',
	HALLWAY = 'HALLWAY',
	LAUNDRY = 'LAUNDRY',
	GARAGE = 'GARAGE',
	GAMING_ROOM = 'GAMING_ROOM',
}
registerEnumType(FurnitureRoom, {
	name: 'FurnitureRoom',
});

// PRODUCT CATEGORIES (Main Categories)
export enum FurnitureCategory {
	SOFAS_ARMCHAIRS = 'SOFAS_ARMCHAIRS',
	CHAIRS = 'CHAIRS',
	TABLES = 'TABLES',
	DESKS = 'DESKS',
	BEDS_MATTRESSES = 'BEDS_MATTRESSES',
	STORAGE_ORGANIZATION = 'STORAGE_ORGANIZATION',
	WARDROBES = 'WARDROBES',
	BOOKCASES_SHELVING = 'BOOKCASES_SHELVING',
	KITCHEN_FURNITURE = 'KITCHEN_FURNITURE',
	LIGHTING = 'LIGHTING',
	TEXTILES = 'TEXTILES',
	RUGS = 'RUGS',
	CURTAINS = 'CURTAINS',
	DECORATION = 'DECORATION',
	COOKWARE = 'COOKWARE',
	OUTDOOR_FURNITURE = 'OUTDOOR_FURNITURE',
}
registerEnumType(FurnitureCategory, {
	name: 'FurnitureCategory',
});

// PRODUCT STATUS (Labels)
export enum FurnitureStatus {
	ACTIVE = 'ACTIVE',
	NEW = 'NEW',
	LIMITED = 'LIMITED',
	LAST_CHANCE = 'LAST_CHANCE',
	DISCONTINUED = 'DISCONTINUED',
	DELETE = 'DELETE',
}
registerEnumType(FurnitureStatus, {
	name: 'FurnitureStatus',
});

// STYLE (Minimalist + High-Tech Focus)
export enum FurnitureStyle {
	MINIMALIST = 'MINIMALIST',
	HIGHTECH = 'HIGHTECH',
	SCANDINAVIAN = 'SCANDINAVIAN',
	MODERN = 'MODERN',
	TRADITIONAL = 'TRADITIONAL',
	INDUSTRIAL = 'INDUSTRIAL',
}
registerEnumType(FurnitureStyle, {
	name: 'FurnitureStyle',
});

// MATERIALS
export enum FurnitureMaterial {
	SOLID_WOOD = 'SOLID_WOOD',
	PARTICLE_BOARD = 'PARTICLE_BOARD',
	MDF = 'MDF',
	METAL = 'METAL',
	GLASS = 'GLASS',
	PLASTIC = 'PLASTIC',
	BAMBOO = 'BAMBOO',
	RATTAN = 'RATTAN',
	FABRIC = 'FABRIC',
	LEATHER = 'LEATHER',
	RECYCLED = 'RECYCLED',
}
registerEnumType(FurnitureMaterial, {
	name: 'FurnitureMaterial',
});

// ASSEMBLY (IKEA Flat-Pack)
export enum AssemblyType {
	SELF_ASSEMBLY = 'SELF_ASSEMBLY',
	EASY_ASSEMBLY = 'EASY_ASSEMBLY',
	PRE_ASSEMBLED = 'PRE_ASSEMBLED',
}
registerEnumType(AssemblyType, {
	name: 'AssemblyType',
});
export enum AssemblyDifficulty {
	EASY = 'EASY',
	MEDIUM = 'MEDIUM',
	COMPLEX = 'COMPLEX',
}
registerEnumType(AssemblyDifficulty, {
	name: 'AssemblyDifficulty',
});

// DELIVERY
export enum DeliveryMethod {
	STORE_PICKUP = 'STORE_PICKUP',
	HOME_DELIVERY = 'HOME_DELIVERY',
	EXPRESS_DELIVERY = 'EXPRESS_DELIVERY',
	WHITE_GLOVE = 'WHITE_GLOVE',
}
registerEnumType(DeliveryMethod, {
	name: 'DeliveryMethod',
});

// SUSTAINABILITY
export enum SustainabilityLabel {
	NONE = 'NONE',
	SUSTAINABLE_MATERIALS = 'SUSTAINABLE_MATERIALS',
	FSC_CERTIFIED = 'FSC_CERTIFIED',
	RECYCLED_CONTENT = 'RECYCLED_CONTENT',
	CIRCULAR_DESIGN = 'CIRCULAR_DESIGN',
}
registerEnumType(SustainabilityLabel, {
	name: 'SustainabilityLabel',
});

// COLORS (IKEA-style color families)
export enum FurnitureColor {
	WHITE = 'WHITE',
	BLACK = 'BLACK',
	GREY = 'GREY',
	BEIGE = 'BEIGE',
	BROWN = 'BROWN',
	BLUE = 'BLUE',
	GREEN = 'GREEN',
	RED = 'RED',
	PINK = 'PINK',
	YELLOW = 'YELLOW',
	ORANGE = 'ORANGE',
	PURPLE = 'PURPLE',
	NATURAL_WOOD = 'NATURAL_WOOD',
	MULTICOLOR = 'MULTICOLOR',
}
registerEnumType(FurnitureColor, {
	name: 'FurnitureColor',
});
