import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from '../users/schemas/user.schema';    


@Injectable()
export class AuthService {
   constructor(
    private jwtService: JwtService,

    @InjectModel(User.name)
    private userModel: Model<User>,
   ){}

   //register user logic

   async register(data: any){
    //here i have removed role else 
      //via postman anyone become admin
    const { name, email, password } = data;

    //check if user exists
    const exists = await this.userModel.findOne({email});
    if(exists){
        throw new BadRequestException('User already exists, please login!');
    }

    //hash password
    const hash = await bcrypt.hash(password, 10);

    //save user
    const user = await this.userModel.create({
        name,
        email,
        password: hash,
        role: 'student', //default role
    });

    return{
        message: 'User registered successfully',
        userId: user._id
    };
   }


    //login user logic

   async login(data: any){
     const { email, password } = data;

     const user = await this.userModel.findOne({email})

     if(!user){
        throw new BadRequestException('Invalid credentials');
     }

     const isMatch = await bcrypt.compare(password, user.password);
     
     if(!isMatch){
        throw new BadRequestException('Invalid credentials');
     }

     const payload = {
        id: user._id,
        role: user.role,
        email: user.email,
     };

     const token = this.jwtService.sign(payload);

     return {
        message: 'Login successful',
        token,
        
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
     };
   }

}
