import { ICommand } from '@nestjs/cqrs';
import { LoginUserRequest } from '@realworld-angular-nest-nx/global';

export class LoginUserCommand implements ICommand {
  email: string;
  username: string;
  password: string;

  constructor(public request: LoginUserRequest) {
    this.email = this.request.user.email;
    this.password = this.request.user.password;
  }
}
