import { PrismaService } from "src/lib/prisma/prisma.service";
import { Injectable } from '@nestjs/common'
import { User } from "@shared/src/database";

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) { }

  async last(user: User) {


  }
}