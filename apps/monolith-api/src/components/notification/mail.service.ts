import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
	private readonly logger = new Logger(MailService.name);
	private transporter: nodemailer.Transporter;

	constructor() {
		// DEBUG: print loaded env vars so we can confirm ConfigModule picked them up
		console.log('[MailService] ENV CHECK:', {
			MAIL_HOST: process.env.MAIL_HOST,
			MAIL_PORT: process.env.MAIL_PORT,
			MAIL_USER: process.env.MAIL_USER,
			MAIL_PASS: process.env.MAIL_PASS ? '***set***' : 'NOT SET',
			MAIL_FROM: process.env.MAIL_FROM,
			FRONTEND_URL: process.env.FRONTEND_URL,
		});

		const requiredVars = ['MAIL_HOST', 'MAIL_PORT', 'MAIL_USER', 'MAIL_PASS', 'MAIL_FROM', 'FRONTEND_URL'];
		const missing = requiredVars.filter((v) => !process.env[v]);
		if (missing.length > 0) {
			this.logger.warn(`MailService: missing env vars [${missing.join(', ')}] — emails will not be sent`);
		}

		this.transporter = nodemailer.createTransport({
			host: process.env.MAIL_HOST,
			port: parseInt(process.env.MAIL_PORT ?? '587', 10),
			secure: false,
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS,
			},
		});
	}

	async sendWelcomeEmail(to: string, unsubscribeToken: string): Promise<void> {
		const unsubscribeUrl = `${process.env.FRONTEND_URL}/unsubscribe?token=${unsubscribeToken}`;
		console.log('[MailService] sendWelcomeEmail → to:', to, '| from:', process.env.MAIL_FROM);
		try {
			const info = await this.transporter.sendMail({
				from: process.env.MAIL_FROM,
				to,
				subject: 'Welcome to Monolith Newsletter!',
				html: `
          <h2>Thank you for subscribing!</h2>
          <p>You'll receive updates on new blog posts and sale products.</p>
          <p style="margin-top:24px;font-size:12px;color:#999;">
            Don't want these emails?
            <a href="${unsubscribeUrl}">Unsubscribe here</a>
          </p>
        `,
			});
			console.log('[MailService] sendWelcomeEmail SUCCESS — messageId:', info.messageId);
		} catch (err: unknown) {
			console.error('[MailService] sendWelcomeEmail FAILED — full error:', err);
			this.logger.error('sendWelcomeEmail failed', err instanceof Error ? err.message : String(err));
		}
	}

	async sendUnsubscribeConfirmation(to: string): Promise<void> {
		try {
			await this.transporter.sendMail({
				from: process.env.MAIL_FROM,
				to,
				subject: 'You have been unsubscribed',
				html: `
          <h2>Unsubscribe confirmed</h2>
          <p>You have been successfully removed from our mailing list.</p>
        `,
			});
		} catch (err: unknown) {
			this.logger.error('sendUnsubscribeConfirmation failed', err instanceof Error ? err.message : String(err));
		}
	}
}
