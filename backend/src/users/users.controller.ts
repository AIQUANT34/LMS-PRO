import { Controller, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @Patch('verify-instructor/:id')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('admin')
    async verifyInstructor(@Param('id') id: string){
        return this.usersService.verifyInstructor(id)
    }

    @Post('apply-instructor')
    @UseGuards(JwtGuard)
    async applyInstructor(@Req() req){
        return this.usersService.applyInstructor(req.user._id)
    }

}

