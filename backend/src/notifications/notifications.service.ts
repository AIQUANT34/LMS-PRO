import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async createNotification(notificationData: any) {
    const notification = await this.notificationModel.create({
      ...notificationData,
      createdAt: new Date(),
      read: false,
    });

    return notification;
  }

  async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const notifications = await this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('relatedId', 'title type')
      .exec();

    const total = await this.notificationModel.countDocuments({ userId });

    return {
      notifications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.notificationModel.findOneAndUpdate(
      { _id: notificationId, userId },
      { read: true, readAt: new Date() },
      { returnDocument: 'after' },
    );

    return notification;
  }

  async markAllAsRead(userId: string) {
    const result = await this.notificationModel.updateMany(
      { userId, read: false },
      { read: true, readAt: new Date() },
    );

    return {
      modifiedCount: result.modifiedCount,
      message: `${result.modifiedCount} notifications marked as read`,
    };
  }

  async getUnreadCount(userId: string) {
    const count = await this.notificationModel.countDocuments({
      userId,
      read: false,
    });

    return { unreadCount: count };
  }

  async deleteNotification(notificationId: string, userId: string) {
    const notification = await this.notificationModel.findOneAndDelete({
      _id: notificationId,
      userId,
    });

    return notification;
  }

  async createCourseNotifications(courseId: string, type: string, data: any) {
    // This would create notifications for all enrolled students
    // For now, create a sample notification
    return this.createNotification({
      userId: data.userId, // For specific user
      type,
      title: data.title,
      message: data.message,
      relatedId: courseId,
      relatedType: 'course',
    });
  }

  async createAssignmentNotifications(
    assignmentId: string,
    type: string,
    data: any,
  ) {
    return this.createNotification({
      userId: data.userId,
      type,
      title: data.title,
      message: data.message,
      relatedId: assignmentId,
      relatedType: 'assignment',
    });
  }

  async createSystemNotification(
    userId: string,
    title: string,
    message: string,
  ) {
    return this.createNotification({
      userId,
      type: 'system',
      title,
      message,
      relatedId: null,
      relatedType: null,
    });
  }

  async getNotificationsByType(userId: string, type: string) {
    const notifications = await this.notificationModel
      .find({ userId, type })
      .sort({ createdAt: -1 })
      .exec();

    return notifications;
  }
}
