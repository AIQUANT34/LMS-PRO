import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class InstructorsService {
  private readonly logger = new Logger(InstructorsService.name);

  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {
    this.logger.log('InstructorsService initialized');
  }

  async getPublicInstructors() {
    try {
      this.logger.log('Fetching public instructors from database');
      
      // Fetch users with role 'instructor' and isVerifiedInstructor = true
      const instructors = await this.userModel
        .find({ 
          role: 'instructor',
          isVerifiedInstructor: true 
        })
        .select('-password') // Exclude password from results
        .lean() // Use lean for better performance
        .exec();
      
      this.logger.log(`Found ${instructors.length} verified instructors`);
      
      // Transform User data to Instructor format expected by frontend
      return instructors.map(instructor => ({
        _id: instructor._id,
        name: instructor.name,
        title: 'Expert Instructor', // Default title, can be enhanced later
        bio: `Passionate instructor with expertise in their field. Verified and ready to teach.`,
        avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCBmaWxsPSIjZTVlN2ViIiB3aWR0aD0iODAgaGVpZ2h0PSI4MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzZiNzI4MCIgZm9udC1zaXplPSIxMiIgZm9udC1mYW1pbHk9IkFyaWFsIj5JbnN0cjwvdGV4dD48L3N2Zz4=',
        rating: 4.5, // Default rating, can be enhanced later
        totalStudents: Math.floor(Math.random() * 1000) + 100, // Mock data for now
        totalCourses: Math.floor(Math.random() * 10) + 1, // Mock data for now
        experience: Math.floor(Math.random() * 10) + 1, // Mock data for now
        location: 'Remote', // Default location
        specialties: ['teaching', 'expertise'], // Default specialties
        isVerified: instructor.isVerifiedInstructor || false,
        email: instructor.email // Include email for debugging
      }));
    } catch (error) {
      this.logger.error('Error fetching instructors from database:', error.message);
      
      // Fallback to empty array if database fails
      return [];
    }
  }

  async getInstructorById(id: string) {
    try {
      const instructor = await this.userModel
        .findOne({ 
          _id: id,
          role: 'instructor',
          isVerifiedInstructor: true 
        })
        .select('-password')
        .lean()
        .exec();
      
      if (!instructor) {
        return null;
      }
      
      // Transform to instructor format
      return {
        _id: instructor._id,
        name: instructor.name,
        title: 'Expert Instructor',
        bio: `Passionate instructor with expertise in their field. Verified and ready to teach.`,
        avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCBmaWxsPSIjZTVlN2ViIiB3aWR0aD0iODAgaGVpZ2h0PSI4MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzZiNzI4MCIgZm9udC1zaXplPSIxMiIgZm9udC1mYW1pbHk9IkFyaWFsIj5JbnN0cjwvdGV4dD48L3N2Zz4=',
        rating: 4.5,
        totalStudents: Math.floor(Math.random() * 1000) + 100,
        totalCourses: Math.floor(Math.random() * 10) + 1,
        experience: Math.floor(Math.random() * 10) + 1,
        location: 'Remote',
        specialties: ['teaching', 'expertise'],
        isVerified: instructor.isVerifiedInstructor || false,
        email: instructor.email
      };
    } catch (error) {
      this.logger.error(`Error fetching instructor ${id}:`, error.message);
      return null;
    }
  }

  async createInstructor(createInstructorDto: any) {
    // TODO: Implement actual database creation
    this.logger.log('Creating instructor:', createInstructorDto);
    return createInstructorDto;
  }

  async updateInstructor(id: string, updateInstructorDto: any) {
    // TODO: Implement actual database update
    this.logger.log('Updating instructor:', id, updateInstructorDto);
    return { _id: id, ...updateInstructorDto };
  }

  async deleteInstructor(id: string) {
    // TODO: Implement actual database deletion
    this.logger.log('Deleting instructor:', id);
    return { _id: id };
  }
}
