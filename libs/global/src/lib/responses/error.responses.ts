import { HttpStatus } from '@nestjs/common';
import { Observable, of } from 'rxjs';

export type ErrorCollection = {
  [key: string]: string | string[];
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

export function withErrors<TResponse extends ErrorResponse>(
  errors: ErrorCollection,
  statusCode: HttpStatus
): TResponse {
  return {
    errors,
    statusCode,
  } as TResponse;
}

export interface ErrorResponse {
  errors?: ErrorCollection;
  statusCode?: HttpStatus;
}
