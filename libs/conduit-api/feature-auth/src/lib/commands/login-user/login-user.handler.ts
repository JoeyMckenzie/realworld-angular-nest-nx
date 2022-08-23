import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpStatus, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginUserCommand } from './login-user.command';
import {
  AuthenticationResponse,
  UserDto,
  ofErrors,
  withErrors,
} from '@realworld-angular-nest-nx/global';
import { TokenService } from '../../services/token.service';
import { UsersRepository } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  private readonly logger = new Logger(LoginUserHandler.name);

  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly userRepository: UsersRepository
  ) {}

  execute(command: LoginUserCommand): Promise<AuthenticationResponse> {
    const loginUserIfExists$ = this.userRepository
      .getUserByEmailOrUsername(command.email, command.username)
      .pipe(
        map((existingUser) => {
          if (!existingUser) {
            this.logger.error('user was not found');
            return withErrors<AuthenticationResponse>(
              {
                user: ['user does not exist'],
              },
              HttpStatus.NOT_FOUND
            );
          }

          this.logger.log(
            `retrieving user account for ${command.email}, verifying password`
          );

          const isValidPassword = this.authService.validatePassword(
            command.password,
            existingUser.password,
            existingUser.salt
          );

          if (!isValidPassword) {
            this.logger.error('login attempt was invalid');
            return withErrors<AuthenticationResponse>(
              {
                user: ['invalid password for user'],
              },
              HttpStatus.UNAUTHORIZED
            );
          }

          const token = this.tokenService.generateToken(
            existingUser.id,
            existingUser.username,
            existingUser.email
          );

          const mappedUser: UserDto = {
            username: existingUser.username,
            email: existingUser.email,
            bio: existingUser.bio,
            image: existingUser.image,
            token,
          };

          return { user: mappedUser } as AuthenticationResponse;
        }),
        catchError((error) => {
          this.logger.error(error);
          return ofErrors<AuthenticationResponse>(
            {
              message: error.toString(),
            },
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        })
      );

    return firstValueFrom(loginUserIfExists$);
  }
}
