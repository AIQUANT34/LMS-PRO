import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AIReviewLogDocument = AIReviewLog & Document;

@Schema({ timestamps: true })
export class AIReviewLog {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userType: 'student' | 'trainer' | 'admin';

  @Prop({ required: true })
  aiFeature: 'tutor' | 'quiz' | 'summary' | 'other';

  @Prop({ required: true })
  input: string;

  @Prop({ required: true })
  aiResponse: string;

  @Prop({ required: true })
  courseId?: string;

  @Prop({ default: false })
  reviewed: boolean;

  @Prop({ default: false })
  flagged: boolean;

  @Prop()
  flagReason?: string;

  @Prop()
  reviewedBy?: string;

  @Prop()
  reviewNotes?: string;

  @Prop({ default: Date.now })
  reviewedAt?: Date;

  @Prop({ default: 1 })
  responseTime: number; // in seconds

  @Prop({ default: 'gemini' })
  aiModel: string;

  @Prop()
  sessionId?: string;
}

export const AIReviewLogSchema = SchemaFactory.createForClass(AIReviewLog);
