import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Get, UseGuards, Req } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from './jwt/jwt.guard';
import { RolesGuard } from './roles/roles.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('create-admin')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('admin')
     async createAdmin(@Body() dto: any) {
      return this.authService.createAdmin(dto);
}

    @Post('register')
    register(@Body() body: any){
        return this.authService.register(body);
    } 
    
    @Post('login')
    login(@Body() body: any){
        return this.authService.login(body);
    }


    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Req() req) {
        return req.user;
    }

}
