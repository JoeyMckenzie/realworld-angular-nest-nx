import { Test } from '@nestjs/testing';
import { from, of } from 'rxjs';
import { LoginUserHandler } from './login-user.handler';
import { HttpStatus } from '@nestjs/common';
import {
  AuthenticationResponse,
  LoginUserRequest,
} from '@realworld-angular-nest-nx/global';
import {
  mockAuthService,
  mockTokenService,
  mockUserService,
  response,
  user,
} from '../test-stubs';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { LoginUserCommand } from './login-user.command';

const request = new LoginUserRequest(user.email, user.password);

const command = new LoginUserCommand(request);

describe(LoginUserHandler.name, () => {
  let handler: LoginUserHandler;
  let userService: UserService;
  let authService: AuthService;
  let tokenService: TokenService;

  let getExistingUserSpy: jest.SpyInstance;
  let verifyPasswordSpy: jest.SpyInstance;
  let generateTokenSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LoginUserHandler,
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

    handler = module.get(LoginUserHandler);
    userService = module.get(UserService);
    authService = module.get(AuthService);
    tokenService = module.get(TokenService);

    getExistingUserSpy = jest.spyOn(userService, 'getUserByEmailOrUsername');
    generateTokenSpy = jest.spyOn(tokenService, 'generateToken');
    verifyPasswordSpy = jest.spyOn(authService, 'validatePassword');
  });

  afterEach(() => {
    getExistingUserSpy.mockReset();
    generateTokenSpy.mockReset();
    verifyPasswordSpy.mockReset();
  });

  it('should login the user when user exists and password is valid', (done) => {
    // arrange
    getExistingUserSpy.mockReturnValue(of(user));

    generateTokenSpy.mockReturnValue(response.user.token);

    verifyPasswordSpy.mockReturnValue(true);

    // act
    from(handler.execute(command)).subscribe(
      (response: AuthenticationResponse) => {
        // assert
        expect(response).toStrictEqual(response);
        expect(getExistingUserSpy).toHaveBeenCalledTimes(1);
        expect(verifyPasswordSpy).toHaveBeenCalledTimes(1);
        expect(generateTokenSpy).toHaveBeenCalledTimes(1);
        done();
      }
    );
  });

  it('should should return an error when user exists and password is invalid', (done) => {
    // arrange
    getExistingUserSpy.mockReturnValue(of(user));

    generateTokenSpy.mockReturnValue(response.user.token);

    verifyPasswordSpy.mockReturnValue(false);

    // act
    from(handler.execute(command)).subscribe(
      (response: AuthenticationResponse) => {
        // assert
        expect(response).not.toBeUndefined;
        expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(getExistingUserSpy).toHaveBeenCalledTimes(1);
        expect(verifyPasswordSpy).toHaveBeenCalledTimes(1);
        expect(generateTokenSpy).toHaveBeenCalledTimes(0);
        done();
      }
    );
  });

  it('should return an error when user does not exist', (done) => {
    // arrange
    getExistingUserSpy.mockReturnValue(of(undefined));

    // act
    from(handler.execute(command)).subscribe(
      (response: AuthenticationResponse) => {
        // assert
        expect(response).not.toBeUndefined();
        expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
        expect(getExistingUserSpy).toHaveBeenCalledTimes(1);
        expect(verifyPasswordSpy).toHaveBeenCalledTimes(0);
        expect(generateTokenSpy).toHaveBeenCalledTimes(0);
        done();
      }
    );
  });

  it('should return an error when downstream services are exceptional', (done) => {
    // arrange
    getExistingUserSpy.mockReturnValue(of(user));

    verifyPasswordSpy.mockImplementationOnce(() => {
      throw new Error('stub error');
    });

    // act
    from(handler.execute(command)).subscribe(
      (response: AuthenticationResponse) => {
        // assert
        expect(response).not.toBeUndefined();
        expect(response.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(getExistingUserSpy).toHaveBeenCalledTimes(1);
        expect(verifyPasswordSpy).toHaveBeenCalledTimes(1);
        expect(generateTokenSpy).toHaveBeenCalledTimes(0);
        done();
      }
    );
  });
});
