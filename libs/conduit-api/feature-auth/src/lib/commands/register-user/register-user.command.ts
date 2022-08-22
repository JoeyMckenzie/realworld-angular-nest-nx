import { ICommand } from '@nestjs/cqrs';
import { RegisterUserRequest } from '@realworld-angular-nest-nx/global';

export class RegisterUserCommand implements ICommand {
  email: string;
  username: string;
  password: string;

  constructor(public request: RegisterUserRequest) {
    this.email = this.request.user.email;
    this.username = this.request.user.username;
    this.password = this.request.user.password;
  }
}
