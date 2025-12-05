import { Injectable } from '@nestjs/common';
import { StripeService } from '../../lib/providers/stripe/stripe.service';
import {
  BookingStatus,
  NotificationAction,
  NotificationType,
  TransactionStatus,
} from '@shared/src/database';
import { PrismaService } from 'src/lib/prisma';

@Injectable()
export class WebhookService {
  constructor(
    private readonly stripeService: StripeService,
    private readonly prisma: PrismaService,
  ) {}

  async stripe({
    raw_body,
    signature,
  }: {
    raw_body: Buffer;
    signature: string;
  }) {
    const event = await this.stripeService.parseRawBodyAsync(
      raw_body,
      signature,
    );

    if (event.type === 'checkout.session.completed') {
      const metadata = event.data.object.metadata;

      if (metadata && metadata.booking_id && metadata.transaction_id) {
        const transaction = await this.prisma.transaction.findUnique({
          where: { id: metadata.transaction_id },
        });

        if (
          transaction &&
          transaction.transaction_status === TransactionStatus.PENDING
        ) {
          await this.prisma.transaction.update({
            where: { id: transaction.id },
            data: { transaction_status: TransactionStatus.SUCCESS },
          });

          await this.prisma.booking.update({
            where: { transaction_id: transaction.id },
            data: { status: BookingStatus.CONFIRMED },
          });
        }
      }

      await this.prisma.notification.createMany({
        data: [
          {
            type: NotificationType.BOOKING,
            action: NotificationAction.CONFIRM,
            user_id: metadata?.user_id,
            message: `Booking #${metadata?.booking_id} checkout confirmed`,
          },
          {
            type: NotificationType.BOOKING,
            action: NotificationAction.CONFIRM,
            message: `Booking #${metadata?.booking_id} checkout confirmed`,
          },
        ],
      });
    }
  }
}
