import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConduitApiDataAccessCommonModule } from '@realworld-angular-nest-nx/conduit-api/data-access-common';
import { AuthController } from './auth.controller';
import { LoginUserHandler } from './commands/login-user/login-user.handler';
import { RegisterUserHandler } from './commands/register-user/register-user.handler';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { UserService } from './services/user.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { GetCurrentUserHandler } from './queries/get-current-user/get-current-user.handler';

@Module({
  imports: [
    ConduitApiDataAccessCommonModule,
    CqrsModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.TOKEN_SECRET,
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUserHandler,
    LoginUserHandler,
    GetCurrentUserHandler,
    AuthService,
    TokenService,
    UserService,
    JwtStrategy,
  ],
})
export class ConduitApiFeatureAuthModule {}
