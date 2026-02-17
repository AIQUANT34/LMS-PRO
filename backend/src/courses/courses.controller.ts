import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('courses')
export class CoursesController {
    constructor(private coursesService: CoursesService) {}

    //only uinstructor can create course
    @Post('create')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('instructor')
    async createCourse(
        @Body() body: any, 
        @Req() req,
    ){
        
        return this.coursesService.createCourse(body, req.user)
        
    }

}
