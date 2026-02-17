import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type CourseDocument = Course & Document;

@Schema({timestamps: true})
export class Course {

    @Prop({required: true})
    title: string;

    @Prop({required: true})
    description: string;

    @Prop()
    thumbnail: string;

    //who created this course 
    // connect course to instructor
    @Prop({type: Types.ObjectId, ref: User.name , required: true})
    instructorId: Types.ObjectId;

    //Course status: draft | pending | published
    @Prop({enum: ['draft', 'pending', 'published'], default: 'draft'})
    status: string;
   

    @Prop({default: 0})
    price: number;


}

export const CourseSchema = SchemaFactory.createForClass(Course);