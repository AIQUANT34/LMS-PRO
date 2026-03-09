import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Course } from 'src/courses/schemas/course.schema';

export type AssessmentDocument = Assessment & Document;

@Schema({ timestamps: true })
export class Assessment {

  @Prop({ type: Types.ObjectId, ref: Course.name, required: true })
  courseId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: 100 })
  maxScore: number;

  @Prop()
  dueDate: Date;

  @Prop({
    enum: ['draft', 'published'],
    default: 'draft'
  })
  status: string;

  @Prop({ type: Types.ObjectId, required: true })
  instructorId: Types.ObjectId;
}

export const AssessmentSchema = SchemaFactory.createForClass(Assessment);