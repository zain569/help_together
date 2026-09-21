import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(
      process.env.STRIPE_SECRET_KEY!,
    )
  }
  async createCheckoutSession(
    amount: number,
    donationId: string,
  ) {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',

      line_items: [
        {
          price_data: {
            currency: 'pkr',

            product_data: {
              name: 'Donation',
            },

            unit_amount: Math.round(amount * 100),
          },
          quantity: 1
        },
      ],

      metadata: {
        donationId,
      },

      success_url: `${process.env.FRONTEND_URL}/payment-success`,

      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`
    });

    return {
      sessionId: session.id,
      checkoutUrl: session.url,
    }
  };

  constructWebhookEvent(
    payload: Buffer,
    signature: string,
  ){
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  }
}
