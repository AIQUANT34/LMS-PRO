import { Controller, Post, Put, Get, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateCourseDto, UpdateCourseDto, ReviewDecisionDto } from './dto/course.dto';

@Controller('courses')
export class CoursesController {
    constructor(private coursesService: CoursesService) {}

    // Create course (instructor only)
    @Post()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('instructor')
    async createCourse(
        @Body() body: CreateCourseDto,
        @Req() req,
    ){
        return this.coursesService.createCourse(body, req.user);
    }

    // Update course (owner only)
    @Put(':id')
    @UseGuards(JwtGuard)
    async updateCourse(
        @Param('id') courseId: string,
        @Body() body: UpdateCourseDto,
        @Req() req,
    ){
        return this.coursesService.updateCourse(courseId, body, req.user);
    }

    // Submit for review (owner only)
    @Post(':id/submit-review')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('instructor')
    async submitForReview(
        @Param('id') courseId: string,
        @Req() req,
    ){
        return this.coursesService.submitForReview(courseId, req.user);
    }

    // Review course (admin only)
    @Post(':id/review')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('admin')
    async reviewCourse(
        @Param('id') courseId: string,
        @Body() body: ReviewDecisionDto,
        @Req() req,
    ){
        return this.coursesService.reviewCourse(courseId, body.decision, body.reason || '', req.user);
    }

    // Archive course (owner/admin)
    @Post(':id/archive')
    @UseGuards(JwtGuard)
    async archiveCourse(
        @Param('id') courseId: string,
        @Req() req,
    ){
        return this.coursesService.archiveCourse(courseId, req.user);
    }

        // Move published course to draft (owner/admin)
        @Post(':id/move-draft')
        @UseGuards(JwtGuard, RolesGuard)
        @Roles('instructor', 'admin')
        async moveToDraft(
            @Param('id') courseId: string,
            @Req() req,
        ){
            return this.coursesService.moveToDraft(courseId, req.user);
        }

    // Delete course (soft delete, owner/admin)
    @Delete(':id')
    @UseGuards(JwtGuard)
    async deleteCourse(
        @Param('id') courseId: string,
        @Req() req,
    ){
        return this.coursesService.deleteCourse(courseId, req.user);
    }

    // Get instructor's courses (instructor/admin)
    @Get('instructor')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('instructor', 'admin')
    async getInstructorCourses(@Req() req){
        return this.coursesService.getInstructorCourses(req.user);
    }

    // Get public courses (public)
    @Get('public')
    async getPublicCourses(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('category') category?: string,
        @Query('level') level?: string,
    ){
        return this.coursesService.getPublicCourses(
            parseInt(page),
            parseInt(limit),
            category,
            level
        );
    }

    // Get single course details (public for published, owner for others)
    @Get(':id')
    async getCourse(@Param('id') courseId: string, 
    @Req() req
){
        const user = req.user || null;
        // Implementation depends on whether it's public or private view
        // For now, return basic course info
        return this.coursesService.getCourseById(courseId, user);
    }

}
