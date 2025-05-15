import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create Questions [E2E]', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[POST] /Questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Jhon doe',
        email: 'jhondoe@gmail.com',
        password: '12345',
      },
    })

    const acessToken = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${acessToken}`)
      .send({
        title: 'pergunta 1',
        content: 'contéudo pergunta1',
      })

    expect(response.statusCode).toBe(201)

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'pergunta 1',
      },
    })

    expect(questionOnDatabase).toBeTruthy()
  })
})
