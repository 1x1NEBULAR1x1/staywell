import {
  Controller,
  Post,
  Headers,
  RawBodyRequest,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('stripe')
  async stripe(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    return await this.webhookService.stripe({
      raw_body:
        req.rawBody ??
        (() => {
          throw new BadRequestException('Request raw body is required');
        })(),
      signature,
    });
  }
}
