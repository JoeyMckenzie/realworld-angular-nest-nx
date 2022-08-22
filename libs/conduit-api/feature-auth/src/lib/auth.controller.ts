import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  Res,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  AuthenticationResponse,
  LoginUserRequest,
  omit,
  RegisterUserRequest,
} from '@realworld-angular-nest-nx/global';
import { Observable, from, map } from 'rxjs';
import { RegisterUserCommand } from './commands/register-user/register-user.command';
import { Response } from 'express';
import { LoginUserCommand } from './commands/login-user/login-user.command';

@Controller('users')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  registerUser(
    @Body() request: RegisterUserRequest,
    @Res() response: Response
  ): Observable<Response> {
    this.logger.log(`received registration request for ${request.user.email}`);
    return from(this.commandBus.execute(new RegisterUserCommand(request))).pipe(
      map((authResponse: AuthenticationResponse) =>
        response
          .status(authResponse.statusCode ?? HttpStatus.CREATED)
          .send(omit(authResponse, 'statusCode'))
      )
    );
  }

  @Post('login')
  loginUser(
    @Body() request: LoginUserRequest,
    @Res() response: Response
  ): Observable<Response> {
    this.logger.log(`received login request for ${request.user.email}`);
    return from(this.commandBus.execute(new LoginUserCommand(request))).pipe(
      map((authResponse: AuthenticationResponse) =>
        response
          .status(authResponse.statusCode ?? HttpStatus.OK)
          .send(omit(authResponse, 'statusCode'))
      )
    );
  }
}
