import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service.js';

@Module({
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
