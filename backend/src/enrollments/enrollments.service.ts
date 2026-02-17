import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enrollment, EnrollmentDocument } from './schemas/enrollment.schema';


@Injectable()
export class EnrollmentsService {

    constructor(
        @InjectModel(Enrollment.name)
        private enrollmentModel: Model<EnrollmentDocument>,
    ) {}

    //adding enrollment logic here
    async enrollCourse(userId: string, courseId: string){

        //check if user is already enrolled
        const exists = await this.enrollmentModel.findOne({
            user: userId,
            course: courseId,
        });
        if(exists){
            throw new Error('Already enrolled in this course');
        }

        //create enrollment
        const enrollment = await this.enrollmentModel.create({
            user: userId,
            course: courseId,
            progress: 0,
            status: 'active',
            paymentStatus: 'paid', //for now (later integrate payment)
        })

        return {
            message: 'Enrolled successfully',
            enrollmentId: enrollment._id,
            courseId,  //doubt we return it or not
            userId,
        }
    }

    async getMyEnrollments(userId: string){

        return this.enrollmentModel
        .find({user: userId})
        .populate('course') //fetchcourse details
    }

}
