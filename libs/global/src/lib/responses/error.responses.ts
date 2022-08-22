export type ApiErrors = string[];

export type ErrorCollection = {
  [key: string]: string[];
};

export interface ErrorResponse {
  errors: ErrorCollection;
}

export interface ApiError {
  message: string[];
  error: string;
  statusCode: number;
}
