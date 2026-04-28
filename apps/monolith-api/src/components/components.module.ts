import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { FurnitureModule } from './furniture/furniture.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { ViewModule } from './view/view.module';
import { FollowModule } from './follow/follow.module';
import { BoardArticleModule } from './board-article/board-article.module';
import { NotificationModule } from './notification/notification.module';
import { ChatModule } from './chat/chat.module';
import { StatsModule } from './stats/stats.module';
import { NoticeModule } from './notice/notice.module';
import { InquiryModule } from './inquiry/inquiry.module';

@Module({
	imports: [
		MemberModule,
		FurnitureModule,
		AuthModule,
		CommentModule,
		LikeModule,
		ViewModule,
		FollowModule,
		BoardArticleModule,
		NotificationModule,
		ChatModule,
		StatsModule,
		NoticeModule,
		InquiryModule,
	],
})
export class ComponentsModule {}
