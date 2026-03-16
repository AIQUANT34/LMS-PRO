import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Course, CourseDocument } from './schemas/course.schema';
import { Model } from 'mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name)
    private courseModel: Model<CourseDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  //trainer control logic: check if user is trainer for a course
  async isTrainer(courseId: string, user: any): Promise<boolean> {
    const course = await this.courseModel.findById(courseId);
    if (!course || course.isDeleted) return false;
    // Trainer is the course owner
    return (
      course.trainerId.toString() === user.userId || user.role === 'admin'
    );
  }

  async moveToDraft(courseId: string, user: any) {
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    if (
      course.trainerId.toString() !== user.userId &&
      user.role !== 'admin'
    ) {
      throw new ForbiddenException(
        'You can only move your own courses to draft',
      );
    }
    if (course.status !== 'published' && course.status !== 'rejected') {
      throw new BadRequestException(
        'Only published courses can be moved to draft',
      );
    }
    course.status = 'draft';
    await course.save();
    return {
      message: 'Course moved to draft successfully',
      course,
    };
  }

  async createCourse(data: CreateCourseDto, user: any) {
    console.log('=== COURSE CREATION DEBUG ===');
    console.log('Request user:', user);
    console.log('User role:', user?.role);
    console.log('User userId:', user?.userId);
    
    // Fetch full user data to get verification fields
    const fullUser = await this.userModel.findById(user.userId);
    console.log('Full user from DB:', fullUser);
    console.log('isVerifiedTrainer:', fullUser?.isVerifiedTrainer);
    console.log('trainerRequest:', fullUser?.trainerRequest);
    
    if (!fullUser) {
      throw new ForbiddenException('User not found');
    }
    
    // Only verified trainers can create courses
    if (fullUser.role !== 'trainer') {
      throw new ForbiddenException('Only trainers can create courses');
    }

    // Check if trainer is verified
    if (!fullUser.isVerifiedTrainer) {
      console.log('TRAINER NOT VERIFIED - throwing error');
      throw new ForbiddenException('Trainer account must be approved by admin before creating courses');
    }

    const course = await this.courseModel.create({
      ...data,
      trainerId: user.userId,
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

    if (
      course.trainerId.toString() !== user.userId &&
      user.role !== 'admin'
    ) {
      throw new ForbiddenException('You can only edit your own courses');
    }

    // Prevent status changes by non-admins
    if (data.status && user.role !== 'admin') {
      delete data.status;
    }

    const updatedCourse = await this.courseModel.findByIdAndUpdate(
      courseId,
      { ...data },
      { new: true },
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

    if (course.trainerId.toString() !== user.userId) {
      throw new ForbiddenException('You can only submit your own courses');
    }

    if (course.status !== 'draft' && course.status !== 'rejected') {
      throw new BadRequestException(
        'Course must be in draft or rejected status',
      );
    }

    course.status = 'pending_review';
    await course.save();

    return {
      message: 'Course submitted for review',
      course,
    };
  }

  async reviewCourse(
    courseId: string,
    decision: 'approve' | 'reject',
    reason: string,
    user: any,
  ) {
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
      message: `Course ${decision === 'approve' ? 'approved' : 'rejected'} successfully`,
      course,
    };
  }

  async getTrainerCourses(user: any) {
    if (user.role !== 'trainer' && user.role !== 'admin') {
      throw new ForbiddenException('Access denied');
    }

    const filter = user.role === 'admin' ? {} : { trainerId: user.userId };

    const courses = await this.courseModel
      .find({
        ...filter,
        isDeleted: false,
      })
      .sort({ createdAt: -1 });

    return {
      courses,
      count: courses.length,
    };
  }

  async getPublicCourses(
    page = 1,
    limit = 10,
    category?: string,
    level?: string,
  ) {
    const filter: any = {
      status: 'published',
      isDeleted: false,
    };

    if (category) filter.category = category;
    if (level) filter.level = level;

    const courses = await this.courseModel
      .find(filter)
      .populate('trainerId', 'name email avatar') // Populate trainer fields
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

    if (
      course.trainerId.toString() !== user.userId &&
      user.role !== 'admin'
    ) {
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
    const course = await this.courseModel
      .findById(courseId)
      .populate('trainerId', 'name email');

    if (!course || course.isDeleted) {
      throw new NotFoundException('Course not found');
    }

    // Only published courses are visible to non-owners
    if (
      course.status !== 'published' &&
      (!user ||
        (course.trainerId.toString() !== user.userId &&
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

    if (
      course.trainerId.toString() !== user.userId &&
      user.role !== 'admin'
    ) {
      throw new ForbiddenException('You can only delete your own courses');
    }

    course.isDeleted = true;
    await course.save();

    return {
      message: 'Course deleted successfully',
    };
  }
}
