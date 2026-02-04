import { registerEnumType } from '@nestjs/graphql';

export enum MemberType {
	USER = 'USER', // Regular customer
	DESIGNER = 'DESIGNER',
	FAMILY = 'FAMILY',
	BUSINESS = 'BUSINESS', //  for Business (B2B)
	ADMIN = 'ADMIN', // Platform administrator
}
registerEnumType(MemberType, { name: 'MemberType' });
export enum MemberStatus {
	ACTIVE = 'ACTIVE',
	BLOCK = 'BLOCK',
	DELETE = 'DELETE',
}
registerEnumType(MemberStatus, { name: 'MemberStatus' });
export enum MemberAuthType {
	PHONE = 'PHONE',
	EMAIL = 'EMAIL',
	TELEGRAM = 'TELEGRAM',
	GOOGLE = 'GOOGLE',
}
registerEnumType(MemberAuthType, { name: 'MemberAuth' });

export enum FamilyTier {
	// Loyalty program
	STANDARD = 'STANDARD',
	SILVER = 'SILVER',
	GOLD = 'GOLD',
}
registerEnumType(FamilyTier, { name: 'FamilyTier' });

export enum BusinessType {
	//B2B categories
	OFFICE = 'OFFICE',
	RESTAURANT = 'RESTAURANT',
	HOTEL = 'HOTEL',
	RETAIL = 'RETAIL',
	HEALTHCARE = 'HEALTHCARE',
	EDUCATION = 'EDUCATION',
	OTHER = 'OTHER',
}
registerEnumType(BusinessType, { name: 'BusinessType' });

export enum PaymentTerms {
	// Payment terms B2B
	IMMEDIATE = 'IMMEDIATE',
	NET_30 = 'NET_30',
	NET_60 = 'NET_60',
}
registerEnumType(PaymentTerms, { name: 'PaymentTerms' });
