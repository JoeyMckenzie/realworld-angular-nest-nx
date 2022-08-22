import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  AuthenticationResponse,
  RegisterUserRequest,
} from '@realworld-angular-nest-nx/global';
import { Observable, from } from 'rxjs';
import { RegisterUserCommand } from './commands/register-user/register-user.command';

@Controller('users')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  registerUser(
    @Body() request: RegisterUserRequest
  ): Observable<AuthenticationResponse> {
    this.logger.log(`received registration request for ${request.user.email}`);
    return from(this.commandBus.execute(new RegisterUserCommand(request)));
  }
}
