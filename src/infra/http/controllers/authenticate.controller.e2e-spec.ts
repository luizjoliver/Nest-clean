import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Authenticate  [E2E]', () => {
  let app: INestApplication
  let prisma: PrismaService
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    await prisma.user.create({
      data: {
        name: 'Jhon doe',
        email: 'jhondoe@gmail.com',
        password: await hash('jhondoe123', 8),
      },
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'jhondoe@gmail.com',
      password: 'jhondoe123',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'jhondoe@gmail.com',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
