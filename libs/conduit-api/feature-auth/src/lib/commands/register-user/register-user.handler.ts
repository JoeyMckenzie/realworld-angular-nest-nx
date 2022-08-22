import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { firstValueFrom, from } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { RegisterUserCommand } from './register-user.command';
import { PrismaService } from '@realworld-angular-nest-nx/conduit-api/data-access-common';
import {
  AuthenticationResponse,
  UserDto,
} from '@realworld-angular-nest-nx/global';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  private readonly logger = new Logger(RegisterUserHandler.name);

  constructor(private readonly prisma: PrismaService) {}

  execute(command: RegisterUserCommand): Promise<AuthenticationResponse> {
    const existingUser$ = from(
      this.prisma.user.findFirst({
        where: {
          email: command.email,
        },
      })
    );

    const createUser$ = from(
      this.prisma.user.create({
        data: {
          username: command.username,
          email: command.email,
          password: command.password,
        },
      })
    ).pipe(
      map((user) => {
        const mappedUser: UserDto = {
          username: user.username,
          email: user.email,
          bio: user.bio,
          image: user.image,
          token: '',
        };

        return { user: mappedUser } as AuthenticationResponse;
      })
    );

    const createUserIfNoneExists$ = existingUser$.pipe(
      switchMap((existingUser) => {
        if (!existingUser) {
          throw new HttpException(
            { email: [`user with email ${command.email} already exists`] },
            HttpStatus.BAD_REQUEST
          );
        }

        this.logger.log(`creating user account for ${command.email}`);

        return createUser$;
      }),
      catchError((error) => {
        this.logger.error(`error while creating user ${command.email}`);
        this.logger.error(error);
        throw error;
      })
    );

    return firstValueFrom(createUserIfNoneExists$);
  }
}
