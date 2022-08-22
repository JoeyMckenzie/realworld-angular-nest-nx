import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConduitApiDataAccessCommonModule } from '@realworld-angular-nest-nx/conduit-api/data-access-common';
import { AuthController } from './auth.controller';
import { LoginUserHandler } from './commands/login-user/login-user.handler';
import { RegisterUserHandler } from './commands/register-user/register-user.handler';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { UserService } from './services/user.service';

@Module({
  imports: [ConduitApiDataAccessCommonModule, CqrsModule],
  controllers: [AuthController],
  providers: [
    RegisterUserHandler,
    LoginUserHandler,
    AuthService,
    TokenService,
    UserService,
  ],
})
export class ConduitApiFeatureAuthModule {}
