import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { CreateAccountService } from './controllers/create-account.controller'

@Module({
  imports: [],
  controllers: [CreateAccountService],
  providers: [PrismaService],
})
export class AppModule {}
