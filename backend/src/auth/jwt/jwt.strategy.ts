import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  //whenever we use constructor
  //ensure u import ConfigModule in auth.module.ts file
  //to save from Dependency Injection error
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    }; 
    //after return nest js attaches this to req.user
    //so then controller can access via: req.user.userId
  }
}
