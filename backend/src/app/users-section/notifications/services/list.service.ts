import { PrismaService } from 'src/lib/prisma';
import { NotificationsFiltersDto } from '../dto';
import { Notification, Prisma, Role, User } from '@shared/src/database';
import { BaseListResult } from '@shared/src/common';
import { Injectable } from '@nestjs/common';
import { NotificationsFilters } from '@shared/src/types/users-section/dto.types';


@Injectable()
export class ListService {
  constructor(private readonly prisma: PrismaService) { }


  customFilters = (options: NotificationsFiltersDto): Prisma.NotificationWhereInput => {
    const { is_read, object_id, action, type } = options;
    const filters: Prisma.NotificationWhereInput = {};
    if (is_read !== undefined) filters.is_read = is_read;
    // user_id is handled separately in the list method
    if (object_id !== undefined) filters.object_id = object_id;
    if (action !== undefined) filters.action = action;
    if (type !== undefined) filters.type = type;
    return filters;
  };

  /**
   * List notifications
   * @param user - The user who is listing the notifications
   * @param filters - Filters to apply to the notifications list
   * @returns The list of notifications
   */
  async list({
    user,
    filters,
  }: {
    user: User;
    filters: NotificationsFilters;
  }): Promise<BaseListResult<Notification>> {
    // Separate user_id from other filters as we handle it specially
    const { user_id: filter_user_id, ...otherFilters } = filters;

    // Build base query options without user_id
    const query_options = this.prisma.buildQuery<Notification>({
      filters: otherFilters,
      customFilters: this.customFilters,
    });

    // Build user_id condition based on role
    let user_id_condition: Prisma.NotificationWhereInput = { user_id: user.id };

    if (user.role === Role.ADMIN) {
      // Admin can see:
      // 1. If filter_user_id is provided, only notifications for that specific user
      // 2. Otherwise, notifications for themselves OR without receiver (user_id: null)
      if (filter_user_id) {
        user_id_condition = { user_id: filter_user_id };
      } else {
        user_id_condition = {
          OR: [
            { user_id: user.id },
            { user_id: null }
          ]
        };
      }
    }
    // Merge conditions
    const { items, total } = await this.prisma.findWithPagination<Notification>({
      model: this.prisma.notification,
      query_options: {
        ...query_options,
        where: {
          ...query_options.where,
          ...user_id_condition
        }
      },
    });

    const { take, skip } = query_options;
    return { items, total, skip, take };
  }
}