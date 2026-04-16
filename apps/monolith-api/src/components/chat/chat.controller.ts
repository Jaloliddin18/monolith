import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

class ChatMessageDto {
	message: string;
	history: Array<{ role: string; content: string }>;
}

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Post('message')
	async message(@Body() body: ChatMessageDto): Promise<{ reply: string }> {
		console.log('[ChatController] POST /chat/message received:', {
			message: body.message,
			historyLength: (body.history ?? []).length,
		});
		try {
			const reply = await this.chatService.sendMessage(body.message, body.history ?? []);
			console.log('[ChatController] Reply sent successfully');
			return { reply };
		} catch (err: any) {
			console.error('[ChatController] Error:', err.message);
			throw err;
		}
	}
}
