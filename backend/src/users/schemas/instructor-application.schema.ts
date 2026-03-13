import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InstructorApplicationDocument = InstructorApplication & Document;

@Schema({ timestamps: true })
export class InstructorApplication {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  timezone: string;

  @Prop({ type: [Object], default: [] })
  expertise: string[];

  @Prop({ required: true })
  experience: string;

  @Prop({ type: [Object], default: [] })
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;

  @Prop({ required: true })
  currentOccupation: string;

  @Prop()
  linkedinProfile: string;

  @Prop()
  website: string;

  @Prop({ required: true })
  teachingExperience: string;

  @Prop({ required: true })
  teachingStyle: string;

  @Prop({ required: true })
  targetAudience: string;

  @Prop({ type: [Object], default: [] })
  courseIdeas: Array<{
    title: string;
    description: string;
  }>;

  @Prop({ required: true })
  motivation: string;

  @Prop()
  teachingDemoUrl: string;

  @Prop({ required: true })
  termsAccepted: boolean;

  @Prop({ required: true })
  dataConsent: boolean;

  @Prop()
  marketingConsent: boolean;

  @Prop({ enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status: string;

  @Prop()
  rejectionReason: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reviewedBy: Types.ObjectId;

  @Prop()
  reviewedAt: Date;

  @Prop({ type: Object, default: {} })
  adminNotes: {
    strengths: string[];
    concerns: string[];
    recommendations: string[];
  };
}

export const InstructorApplicationSchema = SchemaFactory.createForClass(InstructorApplication);

// Indexes for better performance
InstructorApplicationSchema.index({ userId: 1 });
InstructorApplicationSchema.index({ status: 1 });
InstructorApplicationSchema.index({ email: 1 });
InstructorApplicationSchema.index({ createdAt: -1 });
