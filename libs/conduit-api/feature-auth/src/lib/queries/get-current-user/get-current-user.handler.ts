import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { HttpStatus, Logger } from '@nestjs/common';
import { firstValueFrom, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import {
  AuthenticationResponse,
  UserDto,
  ofErrors,
} from '@realworld-angular-nest-nx/global';
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user.service';
import { GetCurrentUserQuery } from './get-current-user.query';

@QueryHandler(GetCurrentUserQuery)
export class GetCurrentUserHandler
  implements IQueryHandler<GetCurrentUserQuery>
{
  private readonly logger = new Logger(GetCurrentUserHandler.name);

  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService
  ) {}

  execute(query: GetCurrentUserQuery): Promise<AuthenticationResponse> {
    const getCurrentUser$ = this.userService.getById(query.userId).pipe(
      switchMap((existingUser) => {
        if (!existingUser) {
          this.logger.error('user was not found');
          return ofErrors<AuthenticationResponse>(
            {
              user: 'user does not exist',
            },
            HttpStatus.NOT_FOUND
          );
        }

        this.logger.log(`generating new token for user ${query.userId}`);

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

        return of({ user: mappedUser } as AuthenticationResponse);
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

    return firstValueFrom(getCurrentUser$);
  }
}
