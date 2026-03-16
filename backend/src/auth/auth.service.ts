import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async createAdmin(data: any) {
    const { name, email, password } = data;

    const exists = await this.userModel.findOne({ email });
    if (exists) {
      throw new BadRequestException('User already exists');
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hash,
      role: 'admin',
    });

    return {
      message: 'Admin created successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    };
  }

  //register user logic

  async register(data: any) {
    //here i have removed role else
    //via postman anyone become admin
    const { name, email, password } = data;

    //check if user exists
    const exists = await this.userModel.findOne({ email });
    if (exists) {
      throw new BadRequestException('User already exists');
    }

    //hash password
    const hash = await bcrypt.hash(password, 10);

    //save user
    const user = await this.userModel.create({
      name,
      email,
      password: hash,
    });

    return {
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    };
  }

  //login user logic

  async login(data: any) {
    console.log('Login attempt with data:', data);
    const { email, password } = data;

    const user = await this.userModel.findOne({ email });
    console.log('Found user:', user);

    if (!user) {
      console.log('User not found');
      throw new BadRequestException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      console.log('Password does not match');
      throw new BadRequestException('Invalid credentials');
    }

    const payload = {
      sub: user._id, //sub is standard field for user id in jwt payload
      role: user.role,
      email: user.email,
    };

    const token = this.jwtService.sign(payload);
    console.log('JWT token generated');

    // Fetch full user document from database to include verification fields
    const fullUser = await this.userModel.findById(user._id.toString());
    console.log('Full user data:', fullUser);
    
    if (!fullUser) {
      throw new BadRequestException('User not found');
    }

    const response = {
      message: 'Login successful',
      token,

      user: {
        id: user._id?.toString(),
        name: user.name, // Keep original field name for compatibility
        email: user.email,
        role: user.role,
        isVerifiedTrainer: fullUser.isVerifiedTrainer || false,
        trainerRequest: fullUser.trainerRequest || 'none',
      },
    };
    
    console.log('Login response:', response);
    return response;
  }

  // New method to get full user profile with verification fields
  async getFullUserProfile(userId: string) {
    const fullUser = await this.userModel.findById(userId);
    
    if (!fullUser) {
      throw new BadRequestException('User not found');
    }

    return {
      id: fullUser._id?.toString(),
      name: fullUser.name,
      email: fullUser.email,
      role: fullUser.role,
      isVerifiedTrainer: fullUser.isVerifiedTrainer || false,
      trainerRequest: fullUser.trainerRequest || 'none',
    };
  }
}
