import { HttpStatus } from '@nestjs/common';
import { Observable, of } from 'rxjs';

export type ApiErrors = string[];

export type ErrorCollection = {
  [key: string]: string[];
};

export function ofErrors<TResponse extends ErrorResponse>(
  errors: ErrorCollection,
  statusCode: HttpStatus
): Observable<TResponse> {
  return of({
    errors,
    statusCode,
  } as TResponse);
}

export interface ErrorResponse {
  errors?: ErrorCollection;
  statusCode?: HttpStatus;
}

export interface ApiError {
  message: string[];
  error: string;
  statusCode: number;
}
