import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CoursesService } from '../courses.service';
import { Course, CourseDocument } from '../schemas/course.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CourseOwnerGuard implements CanActivate {
  constructor(
    @InjectModel(Course.name)
    private courseModel: Model<CourseDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const courseId = request.params.id;

    if(!courseId) return true;

    const course = await this.courseModel.findById(courseId);

    if(!course) {
      throw new NotFoundException('Course not found');
    }

    // allow admin
    if(user.role === 'admin'){
      request.course = course;
      return true;
    }
    //allow only instructor owner
    if(course.instructorId.toString() !== user.userId){
      throw new ForbiddenException('only course owner can modify this course')
    }
    request.course = course;
    return true;
  }
}