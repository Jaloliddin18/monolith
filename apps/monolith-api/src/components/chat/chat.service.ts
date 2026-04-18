import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';

interface ChatMessage {
	role: string;
	content: string;
}

const BASE_SYSTEM_PROMPT =
	'You are a friendly furniture assistant for Monolith, a luxury furniture marketplace. ' +
	'You help users find furniture by room, style, material and budget. Give interior design advice. ' +
	'Keep responses concise, warm and professional. ' +
	'If asked about specific products suggest browsing /furniture. ' +
	'Never make up prices or specific product details.';

@Injectable()
export class ChatService {
	constructor(
		@InjectModel('Furniture') private readonly furnitureModel: Model<any>,
	) {}

	async sendMessage(message: string, history: ChatMessage[]): Promise<string> {
		const apiKey = process.env.GROQ_API_KEY;
		if (!apiKey) throw new InternalServerErrorException('GROQ_API_KEY is not configured');

		// Fetch active products to inject into system prompt
		const furnitures = await this.furnitureModel
			.find({ furnitureStatus: 'ACTIVE' })
			.limit(20)
			.select('furnitureTitle furniturePrice furnitureRoom furnitureStyle furnitureCategory furnitureMaterial furnitureColor')
			.lean();

		const productContext = furnitures
			.map(
				(f: any) =>
					`- **${f.furnitureTitle}** | Room: ${f.furnitureRoom} | Style: ${f.furnitureStyle} | Material: ${f.furnitureMaterial} | Color: ${f.furnitureColor} | Price: $${f.furniturePrice}`,
			)
			.join('\n');

		const systemPrompt =
			BASE_SYSTEM_PROMPT +
			`\n\nCurrently available products in our catalog:\n${productContext}\n` +
			`When recommending products use real names and details from the list above. ` +
			`Include material, color, style and price in your response. ` +
			`Do NOT include any links or URLs. ` +
			`Instead describe the product features to help the user decide. ` +
			`Use **product name** bold markdown for product names. ` +
			`Use bullet points for multiple recommendations.`;

		const messages = [
			{ role: 'system', content: systemPrompt },
			...history.map((m) => ({ role: m.role, content: m.content })),
			{ role: 'user', content: message },
		];

		try {
			const response = await axios.post(
				'https://api.groq.com/openai/v1/chat/completions',
				{
					model: 'llama-3.3-70b-versatile',
					messages,
					max_tokens: 500,
					temperature: 0.7,
				},
				{
					headers: {
						Authorization: `Bearer ${apiKey}`,
						'Content-Type': 'application/json',
					},
				},
			);

			return response.data.choices[0].message.content as string;
		} catch (err: any) {
			console.error('[ChatService] Groq API error:', {
				status: err?.response?.status,
				statusText: err?.response?.statusText,
				data: err?.response?.data,
				message: err.message,
			});
			const detail = err?.response?.data?.error?.message ?? err.message;
			throw new InternalServerErrorException(`Groq API error: ${detail}`);
		}
	}
}
