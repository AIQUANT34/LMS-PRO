import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LectureDocument = Lecture & Document;

@Schema({ timestamps: true })
export class Lecture {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  videoUrl: string;

  @Prop()
  videoDuration: number; // in seconds

  @Prop()
  thumbnailUrl: string;

  @Prop({ type: [Object], default: [] })
  resourceFiles: Array<{
    name: string;
    url: string;
    type: string; // 'pdf', 'image', 'document'
    size: number;
  }>;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: false })
  isPreview: boolean; // Free preview video

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  trainerId: Types.ObjectId;

  // Video metadata
  @Prop({ type: Object })
  videoMetadata: {
    duration: number;
    format: string;
    size: number;
    resolution: string;
    bitrate?: number;
  };

  // Engagement metrics
  @Prop({ type: Object, default: { views: 0, completionRate: 0 } })
  metrics: {
    views: number;
    completionRate: number;
    averageWatchTime: number;
  };

  // Subtitles/Captions
  @Prop({ type: [Object], default: [] })
  subtitles: Array<{
    language: string;
    url: string;
    format: string; // 'srt', 'vtt'
  }>;

  // Quiz/Questions for this lecture
  @Prop({ type: [Object], default: [] })
  quiz: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
    timestamp?: number; // When to show the question during video
  }>;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const LectureSchema = SchemaFactory.createForClass(Lecture);

// Indexes for better performance
LectureSchema.index({ courseId: 1, order: 1 });
LectureSchema.index({ trainerId: 1 });
LectureSchema.index({ isPublished: 1 });
LectureSchema.index({ isPreview: 1 });
