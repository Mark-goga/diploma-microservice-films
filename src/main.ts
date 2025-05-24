import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import {
  ExceptionFilter,
  GrpcPrismaExceptionFilter,
  GrpcValidationPipe,
  PROTO_PATH,
} from '@lib/src';
import { Logger } from 'nestjs-pino';
import { FILM_PACKAGE_NAME } from '@proto/films/films';
import { CONFIG } from '@common/constants';
import { REVIEW_PACKAGE_NAME } from '@proto/review/review';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: [
          join(__dirname, `${PROTO_PATH}/films/films.proto`),
          join(__dirname, `${PROTO_PATH}/review/review.proto`),
        ],
        package: [FILM_PACKAGE_NAME, REVIEW_PACKAGE_NAME],
        loader: {
          includeDirs: [join(__dirname, PROTO_PATH)],
        },
        url: CONFIG.APP_URL,
      },
    },
  );

  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new ExceptionFilter());
  app.useGlobalFilters(new GrpcPrismaExceptionFilter());

  app.useGlobalPipes(new GrpcValidationPipe());
  await app.listen();
}

bootstrap();
