import { Module } from '@nestjs/common';
import { PrismaModule } from '@database/prisma/prisma.module';
import { LoggerModule } from 'nestjs-pino';
import { CONFIG } from '@common/constants';
import { FilmsModule } from '@modules/films/films.module';
import { ReviewModule } from '@modules/review/review.module';

@Module({
  imports: [
    PrismaModule,
    LoggerModule.forRootAsync({
      useFactory: () => {
        const isProduction = CONFIG.NODE_ENV === 'production';
        return {
          pinoHttp: {
            transport: isProduction
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                  },
                  level: 'debug',
                },
          },
        };
      },
    }),
    FilmsModule,
    ReviewModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
