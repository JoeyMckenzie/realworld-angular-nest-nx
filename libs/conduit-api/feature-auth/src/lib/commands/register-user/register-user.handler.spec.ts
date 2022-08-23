import { Test } from '@nestjs/testing';
import { from, of } from 'rxjs';
import { RegisterUserHandler } from './register-user.handler';
import { HttpStatus } from '@nestjs/common';
import {
  AuthenticationResponse,
  RegisterUserRequest,
} from '@realworld-angular-nest-nx/global';
import {
  mockAuthService,
  mockTokenService,
  mockUserService,
  response,
  user,
} from '../../test-stubs';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { RegisterUserCommand } from './register-user.command';

const request = new RegisterUserRequest(
  user.username,
  user.email,
  user.password
);

const command = new RegisterUserCommand(request);

describe(RegisterUserHandler.name, () => {
  let handler: RegisterUserHandler;
  let userService: UserService;
  let authService: AuthService;
  let tokenService: TokenService;

  let getExistingUserSpy: jest.SpyInstance;
  let generatePasswordSpy: jest.SpyInstance;
  let createUserSpy: jest.SpyInstance;
  let generateTokenSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RegisterUserHandler,
        {
          provide: UserService,
          useValue: mockUserService,
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
    }).compile();

    handler = module.get(RegisterUserHandler);
    userService = module.get(UserService);
    authService = module.get(AuthService);
    tokenService = module.get(TokenService);

    getExistingUserSpy = jest.spyOn(userService, 'getUserByEmailOrUsername');
    createUserSpy = jest.spyOn(userService, 'createUser');
    generateTokenSpy = jest.spyOn(tokenService, 'generateToken');
    generatePasswordSpy = jest.spyOn(
      authService,
      'generateHashedPasswordWithSalt'
    );
  });

  afterEach(() => {
    getExistingUserSpy.mockReset();
    createUserSpy.mockReset();
    generateTokenSpy.mockReset();
    generatePasswordSpy.mockReset();
  });

  it('should create the user when none is found', (done) => {
    // arrange
    getExistingUserSpy.mockReturnValue(of(undefined));
    createUserSpy.mockReturnValue(of(user));
    generateTokenSpy.mockReturnValue(response.user.token);
    generatePasswordSpy.mockReturnValue({
      password: user.password,
      salt: user.salt,
    });

    // act
    from(handler.execute(command)).subscribe(
      (response: AuthenticationResponse) => {
        // assert
        expect(response).toStrictEqual(response);
        expect(getExistingUserSpy).toHaveBeenCalledTimes(1);
        expect(generatePasswordSpy).toHaveBeenCalledTimes(1);
        expect(createUserSpy).toHaveBeenCalledTimes(1);
        expect(generateTokenSpy).toHaveBeenCalledTimes(1);
        done();
      }
    );
  });

  it('should return an error when already user exists', (done) => {
    // arrange
    getExistingUserSpy.mockReturnValue(of(user));

    // act
    from(handler.execute(command)).subscribe(
      (response: AuthenticationResponse) => {
        // assert
        expect(response).not.toBeUndefined();
        expect(response.statusCode).toBe(HttpStatus.CONFLICT);
        expect(getExistingUserSpy).toHaveBeenCalledTimes(1);
        expect(generatePasswordSpy).toHaveBeenCalledTimes(0);
        expect(createUserSpy).toHaveBeenCalledTimes(0);
        expect(generateTokenSpy).toHaveBeenCalledTimes(0);
        done();
      }
    );
  });

  it('should return an error when downstream services are exceptional', (done) => {
    // arrange
    getExistingUserSpy.mockReturnValue(of(undefined));

    generatePasswordSpy.mockImplementationOnce(() => {
      throw new Error('stub error');
    });

    // act
    from(handler.execute(command)).subscribe(
      (response: AuthenticationResponse) => {
        // assert
        expect(response).not.toBeUndefined();
        expect(response.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(getExistingUserSpy).toHaveBeenCalledTimes(1);
        expect(generatePasswordSpy).toHaveBeenCalledTimes(1);
        expect(createUserSpy).toHaveBeenCalledTimes(0);
        expect(generateTokenSpy).toHaveBeenCalledTimes(0);
        done();
      }
    );
  });
});
