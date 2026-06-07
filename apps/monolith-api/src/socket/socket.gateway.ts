import { Logger } from '@nestjs/common';
import {
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'ws';
import * as WebSocket from 'ws';
import { AuthService } from '../components/auth/auth.service';
import { Member } from '../libs/dto/member/member';
import * as url from 'url';
import { AppNotification } from '../libs/dto/notification/app-notification';

interface MessagePayload {
	event: string;
	text: string;
	memberData: Member;
}

interface InfoPayload {
	event: string;
	totalClients: number;
	memberData: Member;
	action: string;
}

interface NotificationPayload {
	event: 'notification';
	receiverId: string;
	notificationId: string;
}

@WebSocketGateway({ transports: ['websocket'], secure: false })
export class SocketGateway implements OnGatewayInit {
	private logger: Logger = new Logger('SocketEventsGateway');
	private clientAuthMap = new Map<WebSocket, Member>();
	private messageList: MessagePayload[] = [];

	constructor(private authService: AuthService) {}

	@WebSocketServer()
	server: Server;

	public afterInit(server: Server) {
		this.logger.verbose(
			`WebSocket Server Initialized & total [${this.getOnlineCount()}]`,
		);
	}

	private getOnlineCount(): number {
		const memberIds = new Set<string>();
		let guestCount = 0;

		this.clientAuthMap.forEach((member) => {
			if (member?._id) {
				memberIds.add(String(member._id));
			} else {
				guestCount++;
			}
		});

		return memberIds.size + guestCount;
	}

	private async retrieveAuth(req: any): Promise<Member> {
		try {
			const parseUrl = url.parse(req.url, true);
			const { token } = parseUrl.query;
			return await this.authService.verifyToken(token as string);
		} catch (err) {
			return null;
		}
	}

	public async handleConnection(client: WebSocket, req: any) {
		const authMember = await this.retrieveAuth(req);
		this.clientAuthMap.set(client, authMember);
		const totalClients = this.getOnlineCount();

		const clientNick: string = authMember?.memberNick ?? 'Guest';

		this.logger.verbose(
			`Connection [${clientNick}] & total [${totalClients}]`,
		);

		const infoMsg: InfoPayload = {
			event: 'info',
			totalClients,
			memberData: authMember,
			action: 'joined',
		};
		this.emitMessage(infoMsg);
		client.send(
			JSON.stringify({ event: 'getMessages', list: this.messageList }),
		);
	}
	public handleDisconnect(client: WebSocket) {
		const authMember = this.clientAuthMap.get(client);
		this.clientAuthMap.delete(client);
		const totalClients = this.getOnlineCount();

		const clientNick: string = authMember?.memberNick ?? 'Guest';
		this.logger.verbose(
			`Disconnection [${clientNick}] & total [${totalClients}]`,
		);

		const infoMsg: InfoPayload = {
			event: 'info',
			totalClients,
			memberData: authMember,
			action: 'left',
		};
		this.broadCastMessage(client, infoMsg);
	}

	@SubscribeMessage('message')
	public async handleMessage(
		client: WebSocket,
		payload: string,
	): Promise<void> {
		const authMember = this.clientAuthMap.get(client);
		const newMessage: MessagePayload = {
			event: 'message',
			text: payload,
			memberData: authMember,
		};

		const clientNick: string = authMember?.memberNick ?? 'Guest';
		this.logger.verbose(`NEW MESSAGE [${clientNick}]: ${payload}`);

		this.messageList.push(newMessage);
		if (this.messageList.length > 5)
			this.messageList.splice(0, this.messageList.length - 5);

		this.emitMessage(newMessage);
	}

	private broadCastMessage(sender: WebSocket, message: InfoPayload) {
		this.server.clients.forEach((client) => {
			if (client !== sender && client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(message));
			}
		});
	}

	private emitMessage(message: InfoPayload | MessagePayload) {
		this.server.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(message));
			}
		});
	}

	public emitNotifications(notifications: AppNotification[]): void {
		if (!notifications.length) return;

		const payloadsByReceiver = new Map<string, NotificationPayload[]>();

		notifications.forEach((notification) => {
			const receiverId = String(notification.receiverId);
			const payloads = payloadsByReceiver.get(receiverId) ?? [];
			payloads.push({
				event: 'notification',
				receiverId,
				notificationId: String(notification._id),
			});
			payloadsByReceiver.set(receiverId, payloads);
		});

		this.server.clients.forEach((client) => {
			if (client.readyState !== WebSocket.OPEN) return;
			const authMember = this.clientAuthMap.get(client as unknown as WebSocket);
			if (!authMember?._id) return;

			const payloads = payloadsByReceiver.get(String(authMember._id));
			if (!payloads?.length) return;

			payloads.forEach((payload) => {
				client.send(JSON.stringify(payload));
			});
		});
	}
}
