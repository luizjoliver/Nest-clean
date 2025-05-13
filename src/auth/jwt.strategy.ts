import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt"
import { TypeEnv } from "src/env";
import { z } from "zod";

const TokenPayloadSchema = z.object({
    sub:z.string()
})

export type UserPayload = z.infer<typeof TokenPayloadSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
   
   
    constructor(config:ConfigService<TypeEnv,true>){
        const publicKey = config.get("JWT_PUBLIC_KEY",{infer:true})

        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:Buffer.from(publicKey,'base64'),
            algorithms:['RS256']
            
        })
    }

     async validate(payload:UserPayload ) {

      return TokenPayloadSchema.parse(payload)
    }
}