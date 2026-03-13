import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Notification {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop()
  relatedId: string;

  @Prop()
  relatedType: string; // course, assignment, assessment, system

  @Prop({ default: false })
  read: boolean;

  @Prop()
  readAt: Date;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type NotificationDocument = Notification & Document;

export const NotificationSchema = SchemaFactory.createForClass(Notification);
