import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@realworld-angular-nest-nx/conduit-api/data-access-common';
import { from, Observable } from 'rxjs';

@Injectable()
export class AuthenticationService {
  constructor(private prisma: PrismaService) {}

  registerUser(
    username: string,
    email: string,
    rawPassword: string
  ): Observable<User> {
    const createUser$ = from(
      this.prisma.user.create({
        data: {
          email,
          username,
          password: rawPassword,
          bio: '',
          image: '',
        },
      })
    );

    return createUser$;
  }
}
