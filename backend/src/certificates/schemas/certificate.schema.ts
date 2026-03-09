import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CertificateDocument = Certificate & Document;

@Schema({ timestamps: true })
export class Certificate {

  @Prop({ required: true, unique: true })
  certificateId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ required: true })
  studentName: string;

  @Prop({ required: true })
  courseName: string;

  @Prop({ required: true })
  completionDate: Date;

  @Prop({ required: true })
  InstructorName: string;

  @Prop()
  certificateUrl: string;

  @Prop()
  qrCodeUrl: string;

  @Prop({ unique: true })
  certificateReference: string;

  @Prop({ default: false })
  isApproved: boolean;
  
  @Prop()
  blockchainTxId: string;

  @Prop()
  completionHash: string;
}

export const CertificateSchema =
  SchemaFactory.createForClass(Certificate);