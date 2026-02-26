import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export type EnrollmentDocument = Enrollment & Document

@Schema({ timestamps: true})
export class Enrollment {

    //student who enrolled
    @Prop({type: Types.ObjectId, ref: 'User', required: true})
    user: Types.ObjectId;

    //course enrolled in
    @Prop({type: Types.ObjectId, ref: 'Course', required: true})
    course: Types.ObjectId;

    //Progress of the course (0-100%)
    @Prop({default: 0})
    progress: number;

    //Enrollment status: active | completed | cancelled
    @Prop({enum: ['active', 'completed', 'cancelled'], default: 'active'})
    status: string;

    //Payment status: pending | paid | failed
    @Prop({enum: ['pending', 'paid', 'failed'], default: 'pending'})
    paymentStatus: string;

    //Payment details (could be expanded to include transaction ID, amount, etc.)
    @Prop()
    paymentDetails: string;

}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);