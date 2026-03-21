import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Assignment {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  courseId: string;

  @Prop()
  trainerId: string;

  @Prop()
  dueDate: Date;

  @Prop()
  points: number;

  @Prop()
  type: string;

  @Prop()
  attachments: Array<{
    name: string;
    url: string;
  }>;

  @Prop({ default: 'pending' })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type AssignmentDocument = Assignment & Document;

export const AssignmentSchema = SchemaFactory.createForClass(Assignment);
