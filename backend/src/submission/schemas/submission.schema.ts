import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Assessment } from '../../assessments/schemas/assessment.schema'

export type SubmissionDocument = Submission & Document;

@Schema({ timestamps: true })
export class Submission {

  @Prop({ type: Types.ObjectId, ref: Assessment.name, required: true })
  assessmentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  studentId: Types.ObjectId;

  @Prop()
  fileUrl: string;

  @Prop()
  textAnswer: string;

  @Prop({
    enum: ['submitted', 'reviewed'],
    default: 'submitted'
  })
  status: string;

  @Prop()
  score: number;

  @Prop({default: ''})
  feedback?: string;

  @Prop ()
  reviewedAt?: Date;
  
  @Prop({ type: Types.ObjectId })
  reviewedBy: Types.ObjectId;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);