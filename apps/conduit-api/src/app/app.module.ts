import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ConduitApiFeatureAuthModule } from '@realworld-angular-nest-nx/conduit-api/feature-auth';
import { HttpExceptionFilter } from './http-exception-filter';

@Module({
  imports: [ConfigModule.forRoot(), ConduitApiFeatureAuthModule],
  providers: [
    {
      provide: APP_FILTER,
      useValue: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
