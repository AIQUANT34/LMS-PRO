import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose'
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
    ) {}

    async findByEmail(email: string){
        return this.userModel.findOne({ email})
    }

    async create(data: any){
        return this.userModel.create(data);
    }

  async applyInstructor(userId: string) {
    console.log("user id", userId)
    const user = await this.userModel.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  if (user.role !== 'student') {
    throw new Error('Only students can apply');
  }

  if (user.instructorRequest === 'pending') {
    throw new Error('Already applied');
  }

  user.instructorRequest = 'pending';
  await user.save();

  return {
    message: 'Instructor request submitted. Waiting for admin approval.',
  };
}

    async verifyInstructor(userId: string) {
        return this.userModel.findByIdAndUpdate(
            userId,
            { isVerifiedInstructor: true },
            { new: true },
        );
    }
}
