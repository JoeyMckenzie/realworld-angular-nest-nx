import { ErrorResponse } from './error.responses';

export interface AuthenticationResponse extends ErrorResponse {
  readonly user: UserDto;
}

export interface UserDto {
  readonly email: string;
  readonly username: string;
  readonly token: string;
  readonly bio: string;
  readonly image: string;
}
