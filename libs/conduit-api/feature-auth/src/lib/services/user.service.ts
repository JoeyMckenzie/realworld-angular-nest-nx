import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@realworld-angular-nest-nx/conduit-api/data-access-common';
import { Observable, from } from 'rxjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  getById(userId: string): Observable<User> {
    const existingUser = this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    return from(existingUser);
  }

  getUserByEmailOrUsername(email: string, username: string): Observable<User> {
    const existingUser = this.prisma.user.findFirst({
      where: {
        username,
        OR: {
          email,
        },
      },
    });

    return from(existingUser);
  }

  getUserByEmailOrUsernameAsPromise(
    email: string,
    username: string
  ): Promise<User> {
    return this.prisma.user.findFirst({
      where: {
        username,
        OR: {
          email,
        },
      },
    });
  }

  createUser(
    username: string,
    email: string,
    password: string,
    salt: string
  ): Observable<User> {
    const createUser = this.prisma.user.create({
      data: {
        email,
        username,
        password,
        salt,
        bio: '',
        image: '',
      },
    });

    return from(createUser);
  }
}
