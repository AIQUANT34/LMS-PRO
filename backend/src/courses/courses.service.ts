import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Course, CourseDocument } from './schemas/course.schema';
import { Model } from 'mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';

@Injectable()
export class CoursesService {



    constructor(
        @InjectModel(Course.name)
        private courseModel: Model<CourseDocument>,

    ){}


    //instructor control logic: check if user is trainer for a course
    async isInstructor(courseId: string, user: any): Promise<boolean> {
        const course = await this.courseModel.findById(courseId);
        if (!course) return false;
        // For now, instructor is the trainer. Extend logic if needed.
        return course.instructorId.toString() === user.userId;
    }


    async moveToDraft(courseId: string, user: any) {
        const course = await this.courseModel.findById(courseId);
        if (!course) {
            throw new NotFoundException('Course not found');
        }
        if (course.instructorId.toString() !== user.userId && user.role !== 'admin') {
            throw new ForbiddenException('You can only move your own courses to draft');
        }
        if (course.status !== 'published') {
            throw new BadRequestException('Only published courses can be moved to draft');
        }
        course.status = 'draft';
        await course.save();
        return {
            message: 'Course moved to draft successfully',
            course,
        };
    }

    async createCourse(data: CreateCourseDto, user: any){
        //only instructor can create course
        if(user.role !== 'instructor'){
            throw new ForbiddenException('Only instructors can create courses');
        }

        const course = await this.courseModel.create({
            ...data,
            instructorId: user.userId,
            status: 'draft',
        });

        return {
            message: 'Course created successfully',
            course,
        };
    }

    async updateCourse(courseId: string, data: UpdateCourseDto, user: any) {
        const course = await this.courseModel.findById(courseId);

        if (!course) {
            throw new NotFoundException('Course not found');
        }

        if (course.instructorId.toString() !== user.userId && user.role !== 'admin') {
            throw new ForbiddenException('You can only edit your own courses');
        }

        // Prevent status changes by non-admins
        if (data.status && user.role !== 'admin') {
            delete data.status;
        }

        const updatedCourse = await this.courseModel.findByIdAndUpdate(
            courseId,
            { ...data },
            { new: true }
        );

        return {
            message: 'Course updated successfully',
            course: updatedCourse,
        };
    }

    async submitForReview(courseId: string, user: any) {
        const course = await this.courseModel.findById(courseId);

        if (!course) {
            throw new NotFoundException('Course not found');
        }

        if (course.instructorId.toString() !== user.userId) {
            throw new ForbiddenException('You can only submit your own courses');
        }

        if (course.status !== 'draft' && course.status !== 'rejected') {
            throw new BadRequestException('Course must be in draft or rejected status');
        }

        course.status = 'pending_review';
        await course.save();

        return {
            message: 'Course submitted for review',
            course,
        };
    }

    async reviewCourse(courseId: string, decision: 'approve' | 'reject', reason: string, user: any) {
        if (user.role !== 'admin') {
            throw new ForbiddenException('Only admins can review courses');
        }

        const course = await this.courseModel.findById(courseId);

        if (!course) {
            throw new NotFoundException('Course not found');
        }

        if (course.status !== 'pending_review') {
            throw new BadRequestException('Course must be in pending review status');
        }

        course.status = decision === 'approve' ? 'published' : 'rejected';
        if (decision === 'reject') {
            course.rejectionReason = reason;
        }

        await course.save();

        return {
            message: `Course ${decision}d successfully`,
            course,
        };
    }

    async getInstructorCourses(user: any) {
        if (user.role !== 'instructor' && user.role !== 'admin') {
            throw new ForbiddenException('Access denied');
        }

        const filter = user.role === 'admin' ? {} : { instructorId: user.userId };

        const courses = await this.courseModel.find({
            ...filter,
            isDeleted: false
        }).sort({ createdAt: -1 });

        return {
            courses,
            count: courses.length,
        };
    }

    async getPublicCourses(page = 1, limit = 10, category?: string, level?: string) {
        const filter: any = {
            status: 'published',
            isDeleted: false
        };

        if (category) filter.category = category;
        if (level) filter.level = level;

        const courses = await this.courseModel
            .find(filter)
            .populate('instructorId', 'name')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await this.courseModel.countDocuments(filter);

        return {
            courses,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    async archiveCourse(courseId: string, user: any) {
        const course = await this.courseModel.findById(courseId);

        if (!course) {
            throw new NotFoundException('Course not found');
        }

        if (course.instructorId.toString() !== user.userId && user.role !== 'admin') {
            throw new ForbiddenException('You can only archive your own courses');
        }

        course.status = 'archived';
        await course.save();

        return {
            message: 'Course archived successfully',
            course,
        };
    }

    async getCourseById(courseId: string, user?: any) {
        const course = await this.courseModel.findById(courseId).populate('instructorId', 'name email');

        if (!course || course.isDeleted) {
            throw new NotFoundException('Course not found');
        }

        // Only published courses are visible to non-owners
       if (
    course.status !== 'published' &&
    (!user ||
     (course.instructorId.toString() !== user.userId &&
      user.role !== 'admin'))
) {
    throw new ForbiddenException('Course not available');
}

        return course;
    }
    async deleteCourse(courseId: string, user: any) {
        const course = await this.courseModel.findById(courseId);

        if (!course) {
            throw new NotFoundException('Course not found');
        }

        if (course.instructorId.toString() !== user.userId && user.role !== 'admin') {
            throw new ForbiddenException('You can only delete your own courses');
        }

        course.isDeleted = true;
        await course.save();

        return {
            message: 'Course deleted successfully',
        };
    }

}