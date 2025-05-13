import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Fetch recent questions [E2E]', () => {
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

  test('[GET] /Questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Jhon doe',
        email: 'jhondoe@gmail.com',
        password: '12345',
      },
    })

    const acessToken = jwt.sign({ sub: user.id })

    await prisma.question.createMany({
      data: [
        {
          title: 'pergunta1',
          content: 'conteudo 1',
          slug: 'question-1',
          authorId: user.id,
        },
        {
          title: 'pergunta2',
          content: 'conteudo 2',
          slug: 'question-2',
          authorId: user.id,
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${acessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      questions: [expect.objectContaining({ title: 'pergunta1' })],
    })
  })
})
