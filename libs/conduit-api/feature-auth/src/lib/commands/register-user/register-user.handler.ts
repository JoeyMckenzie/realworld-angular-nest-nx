import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpStatus, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { RegisterUserCommand } from './register-user.command';
import {
  AuthenticationResponse,
  UserDto,
  ofErrors,
} from '@realworld-angular-nest-nx/global';
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  private readonly logger = new Logger(RegisterUserHandler.name);

  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService
  ) {}

  execute(command: RegisterUserCommand): Promise<AuthenticationResponse> {
    const createUserIfNoneExists$ = this.userService
      .getUserByEmailOrUsername(command.email, command.username)
      .pipe(
        switchMap((existingUser) => {
          if (existingUser) {
            this.logger.error('user already exists, will bypass');
            return ofErrors<AuthenticationResponse>(
              {
                user: ['user with email or username already exists'],
              },
              HttpStatus.CONFLICT
            );
          }

          this.logger.log(
            `creating user account for ${command.email}, attempting to hash password`
          );

          const { password, salt } =
            this.authService.generateHashedPasswordWithSalt(command.password);

          this.logger.log('password hashed successfully, creating user');

          return this.userService
            .createUser(command.username, command.email, password, salt)
            .pipe(
              map((user) => {
                const token = this.tokenService.generateToken(
                  user.id,
                  user.username,
                  user.email
                );

                const mappedUser: UserDto = {
                  username: user.username,
                  email: user.email,
                  bio: user.bio,
                  image: user.image,
                  token,
                };

                return { user: mappedUser } as AuthenticationResponse;
              })
            );
        }),
        catchError((error) => {
          this.logger.error(error);
          return ofErrors<AuthenticationResponse>(
            {
              errors: [error.toString()],
            },
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        })
      );

    return firstValueFrom(createUserIfNoneExists$);
  }
}
