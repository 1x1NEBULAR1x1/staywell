import { Injectable } from '@nestjs/common';
import { BaseListResult } from '@shared/src';
import { Prisma, Review } from '@shared/src/database';
import { EXTENDED_REVIEW_INCLUDE, ExtendedReview } from '@shared/src/types/apartments-section';
import { ReviewsFiltersDto } from '../dto';
import { PrismaService } from 'src/lib/prisma';

/**
 * Service for listing and filtering reviews
 */
@Injectable()
export class ListService {
  constructor(private readonly prisma: PrismaService) { }

  customFilters(options: ReviewsFiltersDto) {
    const { apartment_id, user_id, booking_id, min_rating } = options;
    const filters: Prisma.ReviewWhereInput = {};
    if (apartment_id) filters.apartment_id = apartment_id;
    if (booking_id) filters.booking_id = booking_id;
    if (user_id) filters.user_id = user_id;
    if (min_rating) {
      filters.rating = {};
      filters.rating.gte = min_rating;
    }
    return filters;
  }
  /**
   * Find all reviews for a apartment with optional filtering
   * @param apartment_id Apartment ID
   * @param filters Filter options
   * @returns List of filtered reviews and count
   */
  async findAll({ filters }: { filters: ReviewsFiltersDto }): Promise<BaseListResult<ExtendedReview>> {
    const query_options = this.prisma.buildQuery<Review>({
      filters,
      customFilters: this.customFilters,
    });
    const { items, total } = await this.prisma.findWithPagination<ExtendedReview>({
      model: this.prisma.review,
      query_options,
      include: EXTENDED_REVIEW_INCLUDE,
    });
    const { take, skip } = query_options;
    return { items, total, skip, take };
  }
}
