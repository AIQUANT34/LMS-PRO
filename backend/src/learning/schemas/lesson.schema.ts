import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LessonDocument = Lesson & Document;

@Schema({ timestamps: true })
export class Lesson {

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  moduleId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ enum: ['video', 'text', 'quiz'], required: true })
  type: string;

  @Prop()
  content: string;

  @Prop()
  videoUrl: string;

  @Prop()
  videoDuration: number;

  @Prop()
  transcription: string;

  @Prop({ default: 0 })
  durationMinutes: number;

  @Prop({ default: false })
  isFree: boolean;

  @Prop({ default: false })
  isPreview: boolean;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: 0 })
  sequence: number;

  @Prop({
    type: [
      {
        title: String,
        url: String
      }
    ]
  })
  resources: { title: string; url: string }[];

  @Prop({ default: 0 })
  estimatedReadingTime: number;

  @Prop({
    type: {
      metaTitle: String,
      metaDescription: String
    }
  })
  seo: {
    metaTitle: string;
    metaDescription: string;
  };

  @Prop({ default: false })
  isDeleted: boolean;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
LessonSchema.index({ courseId: 1, moduleId: 1, sequence: 1 });
