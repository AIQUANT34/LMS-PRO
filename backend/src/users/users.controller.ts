import { Controller, Param, Patch, Post, Req, UseGuards, Body, Get, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Patch('verify-instructor/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  async verifyInstructor(@Param('id') id: string) {
    return this.usersService.verifyInstructor(id);
  }

  @Post('apply-instructor')
  @UseGuards(JwtGuard)
  async applyInstructor(@Req() req, @Body() applicationData: any) {
    return this.usersService.applyInstructor(req.user.userId, applicationData);
  }

  @Get('instructor-application/:userId')
  @UseGuards(JwtGuard)
  async getInstructorApplication(@Param('userId') userId: string, @Req() req) {
    return this.usersService.getInstructorApplication(userId, req.user.userId);
  }

  @Patch('instructor-application/:id/review')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  async reviewInstructorApplication(
    @Param('id') id: string,
    @Body() reviewData: { status: string; rejectionReason?: string; adminNotes?: any },
    @Req() req
  ) {
    return this.usersService.reviewInstructorApplication(id, reviewData, req.user.userId);
  }

  @Get('instructor-applications')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  async getAllInstructorApplications() {
    return this.usersService.getAllInstructorApplications();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getUserById(@Param('id') id: string, @Req() req: Request & { user: { userId: string; role: string } }) {
    // Users can only get their own profile (except admins)
    if (req.user.userId !== id && req.user.role !== 'admin') {
      throw new BadRequestException('You can only access your own profile');
    }
    return this.usersService.findById(id);
  }

  @Get()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Post(':id/profile-picture')
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: './uploads/profile-pictures',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = extname(file.originalname);
          const request = req as Request & { user: { userId: string } };
          cb(null, `${request.user.userId}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    })
  )
  async uploadProfilePicture(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request & { user: { userId: string; role: string } }
  ) {
    // Users can only upload their own profile picture (except admins)
    if (req.user.userId !== id && req.user.role !== 'admin') {
      throw new BadRequestException('You can only upload your own profile picture');
    }

    const profilePictureUrl = `http://localhost:3001/uploads/profile-pictures/${file.filename}`;
    await this.usersService.updateProfilePicture(id, profilePictureUrl);
    
    return {
      message: 'Profile picture uploaded successfully',
      profilePictureUrl,
    };
  }

  @Get(':id/profile-picture')
  async getProfilePicture(@Param('id') id: string) {
    try {
      const user = await this.usersService.findById(id);
      if (!user || !user.avatar) {
        throw new BadRequestException('Profile picture not found');
      }
      return { profilePictureUrl: user.avatar };
    } catch (error) {
      throw new BadRequestException('Invalid user ID format');
    }
  }

  @Post('change-password')
  @UseGuards(JwtGuard)
  async changePassword(
    @Body() passwordData: { currentPassword: string; newPassword: string },
    @Req() req: Request & { user: { userId: string } }
  ) {
    return this.usersService.changePassword(req.user.userId, passwordData);
  }
}
