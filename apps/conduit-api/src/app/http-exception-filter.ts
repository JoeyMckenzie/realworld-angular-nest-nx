import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { ErrorResponse } from '@realworld-angular-nest-nx/global';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const exceptionContext = host.switchToHttp();

    const response = exceptionContext.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      errors: exception.getResponse(),
    } as ErrorResponse);
  }
}
