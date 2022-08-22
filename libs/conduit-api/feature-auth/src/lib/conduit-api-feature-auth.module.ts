import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConduitApiDataAccessCommonModule } from '@realworld-angular-nest-nx/conduit-api/data-access-common';
import { AuthController } from './auth.controller';
import { RegisterUserHandler } from './commands/register-user/register-user.handler';

@Module({
  imports: [ConduitApiDataAccessCommonModule, CqrsModule],
  controllers: [AuthController],
  providers: [RegisterUserHandler],
})
export class ConduitApiFeatureAuthModule {}
