/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { catchError, EMPTY, from, map, switchMap, take } from 'rxjs';

import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './app/http-exception-filter';

from(NestFactory.create(AppModule))
  .pipe(
    take(1),
    catchError((error) => {
      Logger.error(`error during bootstrap: ${error}`);
      return EMPTY;
    }),
    switchMap((app) => {
      const globalPrefix = 'api';
      const port = process.env.PORT || 3333;

      app.setGlobalPrefix(globalPrefix);
      app.useGlobalPipes(new ValidationPipe());
      app.useGlobalFilters(new HttpExceptionFilter());
      app.enableCors({
        origin: 'http://localhost:4200',
      });

      return from(app.listen(port)).pipe(map(() => [port, globalPrefix]));
    })
  )
  .subscribe(([port, globalPrefix]) => {
    Logger.log(
      `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
    );
  });
