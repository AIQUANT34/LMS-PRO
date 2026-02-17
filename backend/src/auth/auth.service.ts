import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '../users/schemas/user.schema';    
import { UsersService } from 'src/users/users.service';


@Injectable()
export class AuthService {
   constructor(
    private jwtService: JwtService,
    private usersService: UsersService,

   ){}

  async createAdmin(data: any) {
  const { name, email, password } = data;

  const exists = await this.usersService.findByEmail(email);
  if (exists) {
    throw new BadRequestException('User already exists');
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await this.usersService.create({
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

   async register(data: any){
    //here i have removed role else 
      //via postman anyone become admin
    const { name, email, password} = data;

    //check if user exists
    const exists = await this.usersService.findByEmail(email);
    if(exists){
        throw new BadRequestException('User already exists, please login!');
    }

    //hash password
    const hash = await bcrypt.hash(password, 10);

    //save user
    const user = await this.usersService.create({
        name,
        email,
        password: hash,
        role: 'student', //default role
    });

    return{
        message: 'User registered successfully',
        userId: user._id,
        
        
    };
   }


    //login user logic

   async login(data: any){
     const { email, password } = data;

     const user = await this.usersService.findByEmail(email);

     if(!user){
        throw new BadRequestException('Invalid credentials');
     }

     const isMatch = await bcrypt.compare(password, user.password);
     
     if(!isMatch){
        throw new BadRequestException('Invalid credentials');
     }

     const payload = {
        sub: user._id,  //sub is standard field for user id in jwt payload
        role: user.role,
        email: user.email,
     };

     const token = this.jwtService.sign(payload);

     return {
        message: 'Login successful',
        token,
        
        user: {
            sub: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
     };
   }

}
