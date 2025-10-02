import { PrismaService } from "src/lib/prisma";
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@shared/src/database";

@Injectable()
export class CheckService {
  constructor(private readonly prisma: PrismaService) { }

  async checkConflict(number?: number) {
    if (
      number &&
      (await this.prisma.apartment.findUnique({ where: { number } }))
    )
      throw new ConflictException("Apartment with same number already exists");
  }

  async checkNotFound(where: Prisma.ApartmentWhereUniqueInput) {
    const apartment = await this.prisma.apartment.findUnique({ where });
    if (!apartment) throw new NotFoundException("Apartment not found");
    return apartment;
  }
}
