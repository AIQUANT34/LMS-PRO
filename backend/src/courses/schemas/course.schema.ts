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

    @Prop()
    videoIntro: string;

    price: number;
        @Prop({type: [Object], default: []})
        curriculum: Array<any>;


    @Prop({default: 0})
    originalPrice: number;

    @Prop()
    language: string;

    @Prop()
    level: string; // beginner, intermediate, advanced

    @Prop()
    duration: number; // in minutes

    @Prop({ default: 0 })
    totalLessons: number;

    @Prop({ default: 0 })
    totalDuration: number; //in minutes

    @Prop({type: [Object]})
    assignments: Array<{
        title: string;
        description: string;
        dueDate?: Date;
        maxScore: number;
    }>;

    //who created this course
    @Prop({type: Types.ObjectId, ref: User.name , required: true})
    instructorId: Types.ObjectId;

    //Course status: draft | pending_review | published | rejected | archived
    @Prop({enum: ['draft', 'pending_review', 'published', 'rejected', 'archived'], default: 'draft'})
    status: string;

    @Prop()
    rejectionReason: string;

    @Prop({default: false})
    isDeleted: boolean;

    @Prop({type: Object, default: { average: 0, count: 0 }})
    ratings: {
        average: number;
        count: number;
    };

    @Prop({default: 0})
    enrollmentCount: number;

    @Prop({default: 0})
    totalRevenue: number;

    @Prop({type: Object})
    seo: {
        metaTitle: string;
        metaDescription: string;
        keywords: string[];
    };

    @Prop({
        type: [{
          userId: {type: Types.ObjectId, ref: User.name },
          rating: Number,
          comment: String,
          createdAt: { type: Date, default: Date.now }
    }],
    default: []
})
    reviews: Array<{
        userId: Types.ObjectId;
        rating: number;
        comment: string;
        createdAt: Date;
    }>;

}

export const CourseSchema = SchemaFactory.createForClass(Course);