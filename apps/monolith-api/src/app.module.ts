import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { ComponentsModule } from './components/components.module';
import { DatabaseModule } from './database/database.module';
import { T } from './libs/types/common';
import { SocketModule } from './socket/socket.module';
import { ThrottlerModule } from '@nestjs/throttler';

const logger = new Logger('GraphQL');

@Module({
	imports: [
		ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
		ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
		GraphQLModule.forRoot({
			driver: ApolloDriver,
			playground: process.env.NODE_ENV !== 'production',
			uploads: false,
			autoSchemaFile: true,
			csrfPrevention: false,
			formatError: (error: T) => {
				const graphQlFormattedError = {
					code: error?.extensions.code,
					message:
						error?.extensions?.exception?.response?.message ||
						error?.extensions?.response?.message ||
						error?.message,
				};
				logger.error(
					'GRAPHQL GLOBAL ERR:',
					JSON.stringify(graphQlFormattedError),
				);
				return graphQlFormattedError;
			},
		}),
		ComponentsModule,
		DatabaseModule,
		SocketModule,
	],
	controllers: [AppController],
	providers: [AppService, AppResolver],
})
export class AppModule {}
