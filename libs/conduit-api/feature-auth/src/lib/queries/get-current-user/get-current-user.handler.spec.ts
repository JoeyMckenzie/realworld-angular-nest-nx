import { Test } from '@nestjs/testing';
import { from, tap, firstValueFrom, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { UsersRepository } from '../../services/user.service';
import { GetCurrentUserHandler } from './get-current-user.handler';
import {
  mockUserRepository,
  mockAuthService,
  mockTokenService,
  user,
  response,
} from '../../test-stubs';
import { GetCurrentUserQuery } from './get-current-user.query';
import { HttpStatus } from '@nestjs/common';

describe(GetCurrentUserHandler.name, () => {
  let handler: GetCurrentUserHandler;
  let usersRepository: UsersRepository;
  let tokenService: TokenService;

  let getByIdSpy: jest.SpyInstance;
  let generateTokenSpy: jest.SpyInstance;

  beforeEach(async () => {
    const initTestingModule$ = from(
      Test.createTestingModule({
        providers: [
          GetCurrentUserHandler,
          {
            provide: UsersRepository,
            useValue: mockUserRepository,
          },
          {
            provide: AuthService,
            useValue: mockAuthService,
          },
          {
            provide: TokenService,
            useValue: mockTokenService,
          },
        ],
      }).compile()
    ).pipe(
      tap((module) => {
        handler = module.get(GetCurrentUserHandler);
        usersRepository = module.get(UsersRepository);
        tokenService = module.get(TokenService);

        getByIdSpy = jest.spyOn(usersRepository, 'getUserById');
        generateTokenSpy = jest.spyOn(tokenService, 'generateToken');
      })
    );

    await firstValueFrom(initTestingModule$);
  });

  afterEach(() => {
    getByIdSpy.mockReset();
    generateTokenSpy.mockReset();
  });

  it('should return the user if they exist', (done) => {
    // arrange
    getByIdSpy.mockReturnValue(of(user));

    generateTokenSpy.mockReturnValue(response.user.token);

    // act
    from(handler.execute(new GetCurrentUserQuery('stub-id'))).subscribe(
      (response) => {
        // assert
        expect(response).toStrictEqual(response);
        expect(getByIdSpy).toHaveBeenCalledTimes(1);
        expect(generateTokenSpy).toHaveBeenCalledTimes(1);
        done();
      }
    );
  });

  it('should return an error if no user exists', (done) => {
    // arrange
    getByIdSpy.mockReturnValue(of(undefined));

    // act
    from(handler.execute(new GetCurrentUserQuery('stub-id'))).subscribe(
      (response) => {
        // assert
        expect(response).not.toBeUndefined();
        expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
        expect(getByIdSpy).toHaveBeenCalledTimes(1);
        expect(generateTokenSpy).toHaveBeenCalledTimes(0);
        done();
      }
    );
  });

  it('should return an error if downstream services are exceptional', (done) => {
    // arrange
    getByIdSpy.mockReturnValue(of(user));

    generateTokenSpy.mockImplementationOnce(() => {
      throw new Error('stub error');
    });

    // act
    from(handler.execute(new GetCurrentUserQuery('stub-id'))).subscribe(
      (response) => {
        // assert
        expect(response).not.toBeUndefined();
        expect(response.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(getByIdSpy).toHaveBeenCalledTimes(1);
        expect(generateTokenSpy).toHaveBeenCalledTimes(1);
        done();
      }
    );
  });
});
