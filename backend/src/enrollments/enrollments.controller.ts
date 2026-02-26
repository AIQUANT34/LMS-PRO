import { Controller, Param, Get, Post, Req, UseGuards, Body } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';

@Controller('enrollments')
export class EnrollmentsController {
    constructor(
        private readonly enrollmentsService: EnrollmentsService,
    ){}

    // COMPLETE COURSE FIRST (static route first)
    @Post('complete')
    @UseGuards(JwtGuard)
    async completeCourse(
        @Req() req,
        @Body('userId') userId: string,
        @Body('courseId') courseId: string,
    ) {
        return this.enrollmentsService.completeCourse(req.user.userId, courseId);
    }

    // THEN dynamic route
    @Post(':courseId')
    @UseGuards(JwtGuard)
    async enroll(
        @Param('courseId') courseId: string,
        @Req() req,
    ){
        return this.enrollmentsService.enrollCourse(
            req.user.userId,
            courseId,
        )
    }

    @Get('my-courses')
    @UseGuards(JwtGuard)
    async getMyCourses(@Req() req){
        return this.enrollmentsService.getMyEnrollments(req.user.userId)
    }
}
