import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProgressDocument = Progress & Document;

@Schema({ timestamps: true })
export class Progress {
  
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true, index: true })
  courseId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Lesson', required: true })
  lessonId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Enrollment', required: true })
  enrollmentId: Types.ObjectId;

  @Prop({ default: false })
  isStarted: boolean;

  @Prop({default: 0})
  completionPercentage:number;
  
  @Prop({ default: false })
  isCompleted: boolean;

  @Prop()
  completedAt: Date;

  @Prop()
  lastAccessedAt: Date;

  @Prop({ type: {
    currentTime: Number,
    duration: Number,
    watchedPercentage: Number,
    lastUpdated: Date
  }, default:{}
 })
  videoProgress: {
    currentTime: number; // in seconds
    duration: number;
    watchedPercentage: number; // 0-100
    lastUpdated: Date;
  };

  @Prop({ default: false })
  isQuizPassed: boolean;

  @Prop()
  quizScore: number;

  @Prop()
  quizAttempts: number;

  @Prop({ default: 0 })
  timeSpentSeconds: number; // Total time spent on lesson

  @Prop({ default: false })
  certificateEarned: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
ProgressSchema.index({ userId: 1, courseId: 1 });
ProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });
ProgressSchema.index({ enrollmentId: 1, lessonId: 1 });