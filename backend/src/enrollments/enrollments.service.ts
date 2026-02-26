import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enrollment, EnrollmentDocument } from './schemas/enrollment.schema';
import { CertificatesService } from 'src/certificates/certificates.service';

@Injectable()
export class EnrollmentsService {

    constructor(
        @InjectModel(Enrollment.name)
        private enrollmentModel: Model<EnrollmentDocument>,
        private certificatesService: CertificatesService,
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

    async completeCourse(userId: string, courseId: string) {

    // Find enrollment
    const enrollment = await this.enrollmentModel
        .findOne({
            user: userId,
            course: courseId,
        })
        .populate('user')
        .populate({
            path: 'course',
            populate: {
                path: 'instructorId',
                model: 'User',
            },
        })

    if (!enrollment) {
        throw new Error('Enrollment not found');
    }

    // Prevent duplicate completion
    if (enrollment.status === 'completed') {
        return {
            message: 'Course already completed',
        };
    }

    // Mark as completed
    enrollment.status = 'completed';
    enrollment.progress = 100;

    await enrollment.save();

    // Generate certificate
    const certificate =
        await this.certificatesService.generateCertificate({
            userId: enrollment.user._id.toString(),
            courseId: enrollment.course._id.toString(),
            studentName: enrollment.user['name'], // ensure your user has name field
            courseName: enrollment.course['title'], // ensure course has title field
            InstructorName: enrollment.course['instructorId']['name'],
        });

    return {
        message: 'Course completed successfully',
        certificate,
    };
}

}
