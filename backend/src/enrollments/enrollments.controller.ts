import { Controller, Param, Get, Post, Req, UseGuards } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';

@Controller('enrollments')
export class EnrollmentsController {
    constructor(
        private readonly enrollmentsService: EnrollmentsService,
    ){}

    //student enroll in course
    @Post(':courseId')
    //it protect route with jwt
    @UseGuards(JwtGuard)
    
    async enroll(
        @Param('courseId') courseId: string,
        @Req() req,
    ){
        return this.enrollmentsService.enrollCourse(
            req.user._id,
            courseId,
        )
    }

    //get logged-in user's enrollments
    @Get('my-courses')
    async getMyCourses(@Req() req){
        const userId = req.user._id;

        return this.enrollmentsService.getMyEnrollments(userId)
    }
}
