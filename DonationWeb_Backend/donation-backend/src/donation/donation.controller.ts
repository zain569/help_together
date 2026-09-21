import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Headers } from '@nestjs/common';
import type { Request } from 'express';
import { DonationService } from './donation.service.js';
import { CreateDonationDto } from './dto/create-donation.dto.js';
import { UpdateDonationDto } from './dto/update-donation.dto.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../campaigns/guards/roles.guard.js';
import { Roles } from '../campaigns/guards/roles.decorator.js';
import { UserRole } from '../user/user.entity.js';
import { StripeService } from '../stripe/stripe.service.js';
import Stripe from 'stripe';

@Controller('donation')
export class DonationController {
  constructor(
    private readonly donationService: DonationService,
    private readonly stripeService: StripeService,
  ) { }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createDonationDto: CreateDonationDto, @Req() request: Request) {
    const user = (request as Request & { user: { id: string; role: UserRole } }).user;
    return this.donationService.create(createDonationDto, user.id, user.role);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.donationService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: Request) {
    const user = (request as Request & { user: { id: string; role: UserRole } }).user;
    return this.donationService.findOne(id, user.id, user.role);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Get('mydonation/:id')
  myDontions(@Param('id') id: string, @Req() request: Request) {
    const user = (request as Request & { user: { id: string } }).user;
    return this.donationService.myDonations(user.id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.donationService.remove(id);
  }

  //stripe Webhook
  @Post('stripe-webhook')
  async stripeWebhook(
    @Req() request: Request,
    @Headers('stripe-signature') signature: string | undefined
  ) {

    if (!signature) {
      return {
        received: false,
      };
    }

    const rawBody = (request as Request & { rawBody: Buffer }).rawBody;
    const event = this.stripeService.constructWebhookEvent(
      rawBody,
      signature,
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const donationId = session.metadata?.donationId;

      const paymentIntentId = session.payment_intent;

      if (donationId) {
        await this.donationService.markAsSucceeded(
          donationId,
          String(paymentIntentId),
        );
      };
    } else if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session;

      const donationId = session.metadata?.donationId;

      if (donationId) {
        await this.donationService.markAsFailed(
          donationId,
        );
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      const donationId = paymentIntent.metadata?.donationId;

      await this.donationService.markAsFailed(
        donationId,
      )
    }

    return {
      received: true,
    }
  }
}
