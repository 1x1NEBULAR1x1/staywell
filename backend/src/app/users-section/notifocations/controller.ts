import { Controller, Get, Post, UseGuards } from '@nestjs/common'
import { NotificationsService } from './service';
import { Auth, JwtAuthGuard } from 'src/lib/common';
import { User } from '@shared/src/database'

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) { }


  @Get('/last')
  @UseGuards(JwtAuthGuard)
  async last(@Auth() user: User) {
  }

}