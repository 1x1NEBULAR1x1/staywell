import { PrismaService } from 'src/lib/prisma/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User, Role, Notification } from '@shared/src/database';
import { CreateNotificationDto, UpdateNotificationDto } from '../dto';
import { Prisma } from '@shared/src/database';

@Injectable()
export class CrudService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Create a notification
   * @param data - The data to create the notification with
   * @returns The created notification
   */
  async create({
    data,
  }: {
    data: CreateNotificationDto;
  }): Promise<Notification> {
    return await this.prisma.notification.create({ data });
  }

  /**
   * Create many notifications
   * @param data - The data to create the notifications with
   */
  async createMany({ data }: { data: CreateNotificationDto[] }) {
    return await this.prisma.notification.createMany({ data });
  }

  /**
   * Find a notification
   * @param id - The id of the notification
   * @param user - The user who is finding the notification
   * @returns The notification
   */
  async find({
    id,
    user,
  }: {
    id: string;
    user: User;
  }): Promise<Notification> {
    // Admins can find all notifications, users can only find their own notifications
    const where: Prisma.NotificationWhereUniqueInput = {
      id,
      ...(user.role !== Role.ADMIN && { user_id: user.id }),
    };
    // If the notification is not found, throw an error
    return (
      (await this.prisma.notification.findUnique({ where })) ??
      (() => {
        throw new NotFoundException('Notification not found');
      })()
    );
  }



  /**
   * Update a notification
   * @param id - The id of the notification
   * @param data - The data to update the notification with
   * @param user - The user who is updating the notification
   * @returns The updated notification
   */
  async update({
    id,
    data,
    user,
  }: {
    id: string;
    data: UpdateNotificationDto;
    user: User;
  }): Promise<Notification> {
    // Check if the notification exists
    await this.find({ id, user });
    // Admins can update all notifications, users can only update their own notifications
    return await this.prisma.notification.update({
      where: { id },
      data: user.role === Role.ADMIN ? data : { is_read: true },
    });
  }

  /**
   * Mark a notification as read
   * @param id - The id of the notification
   * @param user - The user who is marking the notification as read
   * @returns The updated notification
   */
  async markAsRead({
    ids,
    user,
  }: {
    ids: string[];
    user: User;
  }): Promise<{ count: number }> {
    // Mark the notification as read
    try {
      const where: Prisma.NotificationWhereInput = { id: { in: ids } };
      if (user.role !== Role.ADMIN) {
        where.user_id = user.id;
      }
      console.log(ids, user.role);
      const { count } = await this.prisma.notification.updateMany({ where, data: { is_read: true } });
      return { count };
    } catch (error) {
      throw new BadRequestException('Failed to mark notifications as read');
    }
  }

  /**
   * Admin only
   * Delete a notification
   * @param id - The id of the notification
   */
  async delete({ id, user }: { id: string; user: User }) {
    return (await this.find({ id, user })).is_excluded
      ? await this.prisma.notification.delete({ where: { id } })
      : await this.update({ id, data: { is_excluded: true }, user });
  }
}
