import { ConflictException } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Controller("/accounts")

export class CreateAccountService {
  constructor(private prisma: PrismaService) {}
  @Post()
  @HttpCode(201)
  async handle(@Body() body) {
   
    const {email , name , password } = body

    const userWithSameEmail = await this.prisma.user.findUnique({
        where:{
            email:email
        }
    })

    if(userWithSameEmail){
        throw new ConflictException('User with same email address already exists')
    }

    return this.prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });
  }
}
