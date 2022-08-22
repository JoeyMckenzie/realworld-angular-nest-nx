import { Test } from '@nestjs/testing';
import { from } from 'rxjs';
import { RegisterUserHandler } from './register-user.handler';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '@realworld-angular-nest-nx/conduit-api/data-access-common';
import { AuthenticationResponse } from '@realworld-angular-nest-nx/global';
import stubs from './register-user.handler.stubs';

describe(RegisterUserHandler.name, () => {
  let handler: RegisterUserHandler;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RegisterUserHandler,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    handler = module.get(RegisterUserHandler);
    prismaService = module.get(PrismaService);
  });

  it('should create the handler correctly', (done) => {
    // arrange
    const findFirstSpy = jest
      .spyOn(prismaService.user, 'findFirst')
      .mockResolvedValue(null);

    const createSpy = jest
      .spyOn(prismaService.user, 'create')
      .mockResolvedValue(stubs.user);

    // act
    from(handler.execute(stubs.command)).subscribe(() => {
      // assert
      expect(handler).toBeTruthy();
      expect(findFirstSpy).toHaveBeenCalledTimes(1);
      expect(createSpy).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('should throw an exception when already user exists', (done) => {
    // arrange
    const findFirstSpy = jest
      .spyOn(prismaService.user, 'findFirst')
      .mockResolvedValue(stubs.user);

    const createSpy = jest.spyOn(prismaService.user, 'create');

    // act
    from(handler.execute(stubs.command)).subscribe({
      error: (response: HttpException) => {
        // assert
        expect(findFirstSpy).toHaveBeenCalledTimes(1);
        expect(createSpy).not.toHaveBeenCalled();
        expect(response).not.toBeUndefined();
        expect(response.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        done();
      },
    });
  });

  it('should create the user when none is found', (done) => {
    // arrange
    const findFirstSpy = jest
      .spyOn(prismaService.user, 'findFirst')
      .mockResolvedValue(null);

    const createSpy = jest
      .spyOn(prismaService.user, 'create')
      .mockResolvedValue(stubs.user);

    // act
    from(handler.execute(stubs.command)).subscribe(
      (response: AuthenticationResponse) => {
        // assert
        expect(response).toStrictEqual(stubs.response);
        expect(findFirstSpy).toHaveBeenCalledTimes(1);
        expect(createSpy).toHaveBeenCalledTimes(1);
        done();
      }
    );
  });
});
