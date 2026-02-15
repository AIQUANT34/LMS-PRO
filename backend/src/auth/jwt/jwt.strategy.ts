import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    //whenever we use constructor 
    //ensure u import ConfigModule in auth.module.ts file
    //to save from DI error
    constructor(config: ConfigService){
    
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('JWT_SECRET'),
        });
    }

    async validate (payload: any){
        return {
            userId: payload.sub,
            email : payload.email,
            role : payload.role,
        }; //attached to req.user
    }
}