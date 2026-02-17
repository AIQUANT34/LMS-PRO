import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Course, CourseDocument } from './schemas/course.schema';
import { Model } from 'mongoose';
// import { User } from 'src/users/schemas/user.schema';
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class CoursesService {

    constructor(
        @InjectModel(Course.name)
        private courseModel: Model<CourseDocument>,
        
    ){}

    async createCourse(data: any, user: UserDocument){

        //only instructor can create course
        if(user.role !== 'instructor'){
            throw new ForbiddenException('Only instructors can create courses');
        }

        //staus logic
        const status = user.isVerifiedInstructor ? 'published' : 'pending';

        const course = await this.courseModel.create({
            title: data.title,
            description: data.description,
            price: data.price,
            instructorId: user._id, 
            status: 'draft',
        })

        return this.courseModel.create({
            message: 'Course created successfully',
            courseId: course._id,
            ...data,
            instructorId: user._id,
            status,
        });
    }

}
