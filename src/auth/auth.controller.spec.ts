import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import * as request from 'supertest';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const prismaService = moduleRef.get<PrismaService>(PrismaService);
    await prismaService.user.deleteMany({});
  });

  it('/register (POST)', async () => {
    await request(app.getHttpServer()).post('/auth/register').expect(400);

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'test_account',
        password: 'test_account_password',
      })
      .expect(201);
  });
});
