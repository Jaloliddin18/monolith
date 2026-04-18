import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ChatService } from './chat.service';

class ChatMessageDto {
	message: string;
	history: Array<{ role: string; content: string }>;
}

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Throttle({ default: { ttl: 60000, limit: 20 } })
	@Post('message')
	async message(@Body() body: ChatMessageDto): Promise<{ reply: string }> {
		try {
			const reply = await this.chatService.sendMessage(body.message, body.history ?? []);
			return { reply };
		} catch (err: any) {
			console.error('[ChatController] Error:', err.message);
			throw err;
		}
	}
}
