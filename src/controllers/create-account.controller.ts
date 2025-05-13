import { ConflictException, UsePipes } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { hash } from "bcryptjs";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { PrismaService } from "src/prisma/prisma.service";
import {z} from "zod"



const createAccountBodySchema = z.object({
    name:z.string(),
    email:z.string().email(),
    password:z.string()
})
type CreateAccountBody = z.infer<typeof createAccountBodySchema>
@Controller("/accounts")

export class CreateAccountController {
  constructor(private prisma: PrismaService) {}
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body:CreateAccountBody) {
   
    const {email , name , password } = body

    const userWithSameEmail = await this.prisma.user.findUnique({
        where:{
            email:email
        }
    })

    if(userWithSameEmail){
        throw new ConflictException('User with same email address already exists')
    }

    const hashedPassword = await hash(password,8)
    return this.prisma.user.create({
      data: {
        email,
        name,
        password:hashedPassword,
      },
    });
  }
}
