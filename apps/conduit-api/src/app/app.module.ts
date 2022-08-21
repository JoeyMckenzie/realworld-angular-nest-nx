import { Module } from '@nestjs/common';
import { ConduitApiFeatureAuthModule } from '@realworld-angular-nest-nx/conduit-api/feature-auth';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConduitApiFeatureAuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
