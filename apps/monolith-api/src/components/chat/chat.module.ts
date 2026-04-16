import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import FurnitureSchema from '../../schemas/Furniture.model';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Furniture', schema: FurnitureSchema }]),
	],
	controllers: [ChatController],
	providers: [ChatService],
})
export class ChatModule {}
