import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CampaignsModule } from './campaigns/campaigns.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module.js';
import { UserService } from './user/user.service.js';
import { UserModule } from './user/user.module.js';

@Module({
  imports: [
    CampaignsModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = new URL(
          configService.getOrThrow<string>('DATABASE_URL')
        );
        databaseUrl.search = '';

        return {
          type: 'postgres',
          host: databaseUrl.hostname,
          port: Number(databaseUrl.port) || 5432,
          username: decodeURIComponent(databaseUrl.username),
          password: decodeURIComponent(databaseUrl.password),
          database: databaseUrl.pathname.slice(1),
          ssl: true,
          autoLoadEntities: true,
          synchronize: true,
          extra: {
            connectionTimeoutMillis: 30000,
            family: 4
          }
        };
      }
    }),
    AuthModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule { }
