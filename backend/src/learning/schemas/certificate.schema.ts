import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CertificateDocument = Certificate & Document;

@Schema({ timestamps: true })
export class Certificate {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Enrollment', required: true })
  enrollmentId: Types.ObjectId;

  @Prop({ required: true })
  certificateId: string; // Unique certificate identifier

  @Prop({ required: true })
  certificateUrl: string; // URL to certificate PDF

  @Prop()
  issuedAt: Date;

  @Prop()
  expiresAt: Date;

  @Prop({ default: true })
  isValid: boolean;

  @Prop()
  grade: string; // e.g., "A", "B", "C"

  @Prop()
  score: number; // 0-100

  @Prop()
  completionPercentage: number;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);
CertificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });
