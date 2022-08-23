import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  AuthenticationResponse,
  LoginUserRequest,
  omit,
  RegisterUserRequest,
} from '@realworld-angular-nest-nx/global';
import { Observable, from, map } from 'rxjs';
import { RegisterUserCommand } from './commands/register-user/register-user.command';
import { Response, Request } from 'express';
import { LoginUserCommand } from './commands/login-user/login-user.command';
import { GetCurrentUserQuery } from './queries/get-current-user/get-current-user.query';
import { JwtAuthGuard } from './jwt.strategy';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post('users')
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

  @Post('users/login')
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

  @UseGuards(JwtAuthGuard)
  @Get('user')
  getUser(
    @Req() request: Request,
    @Res() response: Response
  ): Observable<Response> {
    const userId = request.user?.['userId'] ?? '';

    this.logger.log(`received current user request for user ID ${userId}`);

    return from(
      this.queryBus.execute(
        new GetCurrentUserQuery(request.user?.['userId'] ?? '')
      )
    ).pipe(
      map((authResponse: AuthenticationResponse) =>
        response
          .status(authResponse.statusCode ?? HttpStatus.OK)
          .send(omit(authResponse, 'statusCode'))
      )
    );
  }
}
