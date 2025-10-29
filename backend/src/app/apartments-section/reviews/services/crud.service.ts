import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { Role, User, SAFE_USER_SELECT } from '@shared/src';
import { CreateReviewDto, UpdateReviewDto } from '../dto';

/**
 * Service for handling CRUD operations for reviews
 */
@Injectable()
export class CrudService {
  constructor(private readonly prisma: PrismaService) {}

  private async checkReview({
    apartment_id,
    booking_id,
    user_id,
  }: {
    user_id: string;
    apartment_id: string;
    booking_id: string;
  }) {
    const existing_review = await this.prisma.review.findFirst({
      where: {
        user_id: user_id,
        apartment_id: apartment_id,
        booking_id: booking_id,
      },
    });

    if (existing_review)
      throw new ConflictException(
        'User already reviewed this apartment from this booking',
      );
  }
  /**
   * Create a new review
   * @param createReviewDto Data for creating a review
   * @returns Created review
   */
  async create({ data, user }: { data: CreateReviewDto; user: User }) {
    const user_id = user.role === Role.ADMIN ? data.user_id : user.id;
    // Check if user already reviewed this apartment from this booking
    await this.checkReview({ ...data, user_id });
    return await this.prisma.review.create({
      data: data,
      select: { apartment: true, user: { select: SAFE_USER_SELECT } },
    });
  }

  /**
   * Find one review by ID
   * @param id Review ID
   * @returns Review data
   */
  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: { select: SAFE_USER_SELECT },
        apartment: true,
      },
    });
    if (!review) throw new NotFoundException(`Review with ID ${id} not found`);
    return review;
  }
  /**
   * Update a review
   * @param id Review ID
   * @param updateReviewDto Data for updating the review
   * @returns Updated review
   */
  async update({
    data,
    id,
    user,
  }: {
    id: string;
    data: UpdateReviewDto;
    user: User;
  }) {
    await this.findOne(id);
    const user_id = user.role === Role.ADMIN ? data.user_id : user.id;
    return this.prisma.review.update({
      where: { id },
      data: { ...data, user_id },
      select: {
        user: { select: SAFE_USER_SELECT },
        apartment: true,
      },
    });
  }
  /**
   * Remove a review
   * @param id Review ID
   * @returns Deleted review
   */
  async remove({ id, user }: { id: string; user: User }) {
    const where = user.role === Role.ADMIN ? { id } : { id, user_id: user.id };
    return !(await this.findOne(id)).is_excluded
      ? await this.update({ id, user, data: { is_excluded: false } })
      : await this.prisma.review.delete({ where });
  }
}
