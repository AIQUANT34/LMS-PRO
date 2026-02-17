import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

//to convert this class into a mongoose schema, we use @Schema decorator

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    enum: ['student', 'instructor', 'admin'],
    default: 'student',
  })
  role: string;

  @Prop({ default: false })
  isVerifiedInstructor: boolean;

  @Prop({
    enum: ['none', 'pending', 'approved', 'rejected'],
    default: 'none',
  })
  instructorRequest: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
