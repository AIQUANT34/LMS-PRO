import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VideoHistoryDocument = VideoHistory & Document;

@Schema({ timestamps: true })
export class VideoHistory {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Lesson', required: true, index: true })
  lessonId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ required: true })
  currentTime: number; // in seconds

  @Prop({ required: true })
  videoDuration: number;

  @Prop()
  lastWatchedAt: Date;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ default: 0 })
  quality: string; // 480p, 720p, 1080p

  @Prop({ default: false })
  isSubtitlesEnabled: boolean;

  @Prop()
  watchRate: number; // 1x, 1.25x, 1.5x, 2x
}

export const VideoHistorySchema = SchemaFactory.createForClass(VideoHistory);
VideoHistorySchema.index({ userId: 1, lessonId: 1 }, { unique: true });
