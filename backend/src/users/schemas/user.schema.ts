import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

//to convert this class into a mongoose schema, we use @Schema decorator

export interface UserPreferences {
  language?: string;
  timezone?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;
  twoFactorAuth?: boolean;
  sessionTimeout?: number;
  theme?: string;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    enum: ['student', 'trainer', 'admin'],
    default: 'student',
  })
  role: string;

  @Prop({ default: false })
  isVerifiedTrainer: boolean;

  @Prop({
    enum: ['none', 'pending', 'approved', 'rejected'],
    default: 'none',
  })
  trainerRequest: string;

  @Prop()
  avatar?: string;

  @Prop()
  phone?: string;

  @Prop()
  bio?: string;

  @Prop()
  location?: string;

  @Prop()
  department?: string;

  @Prop()
  lastLogin?: Date;

  @Prop()
  lastPasswordChange?: Date;

  @Prop()
  passwordExpiry?: Date;

  @Prop({ default: 0 })
  failedLoginAttempts?: number;

  @Prop({ default: false })
  accountLocked?: boolean;

  @Prop({ default: false })
  twoFactorEnabled?: boolean;

  @Prop({ type: Object })
  preferences?: UserPreferences;
}

export const UserSchema = SchemaFactory.createForClass(User);
