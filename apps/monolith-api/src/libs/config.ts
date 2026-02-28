import { ObjectId } from 'bson';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export const availableDesignerSorts = [
	'createdAt',
	'updatedAt',
	'memberLikes',
	'memberViews',
	'memberRank',
];

export const availableMemberSort = [
	'createdAt',
	'updatedAt',
	'memberLikes',
	'memberViews',
];

export const availableOptions = [
	'furnitureRent',
	'furnitureOnSale',
	'furnitureBestseller',
];

export const availableFurnitureSorts = [
	'createdAt',
	'updatedAt',
	'furnitureLikes',
	'furnitureViews',
	'furnitureRank',
	'furniturePrice',
];

// IMAGE CONFIGURATION
export const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
export const getSerialForImage = (filename: string) => {
	const ext = path.parse(filename).ext;
	return uuidv4() + ext;
};

export const shapeIntoMongoObjectId = (target: any) => {
	return typeof target === 'string' ? new ObjectId(target) : target;
};

export const lookupMember = {
	$lookup: {
		from: 'members',
		localField: 'memberId',
		foreignField: '_id',
		as: 'memberData',
	},
};
