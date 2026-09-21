import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CampaignsModule } from './campaigns/campaigns.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { DonationModule } from './donation/donation.module.js';
import { AdminModule } from './admin/admin.module.js';
import { CausesModule } from './causes/causes.module.js';
import { ServiceGiftsModule } from './service-gifts/service-gifts.module.js';
import { ContactModule } from './contact/contact.module.js';
import { FaqModule } from './faq/faq.module.js';
import { TestimonialModule } from './testimonial/testimonial.module.js';
import { CloudinaryModule } from './cloudinary/cloudinary.module.js';
import { StripeModule } from './stripe/stripe.module.js';

@Module({
  imports: [
    CampaignsModule,
    UserModule,
    AuthModule,
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
    DonationModule,
    AdminModule,
    CausesModule,
    ServiceGiftsModule,
    ContactModule,
    FaqModule,
    TestimonialModule,
    CloudinaryModule,
    StripeModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
