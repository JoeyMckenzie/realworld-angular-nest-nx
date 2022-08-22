import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { catchError, EMPTY, from, take } from 'rxjs';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger: Logger = new Logger(PrismaService.name);

  constructor() {
    super();
  }

  onModuleInit() {
    from(this.$connect())
      .pipe(
        take(1),
        catchError((e) => {
          this.logger.error(
            `error while connecting to prisma to the database: ${e}`
          );
          return EMPTY;
        })
      )
      .subscribe(() =>
        this.logger.log('prisma client successfully connected to database!')
      );
  }

  onModuleDestroy() {
    from(this.$disconnect())
      .pipe(
        take(1),
        catchError((e) => {
          this.logger.error(`error disposing of database connection: ${e}`);
          return EMPTY;
        })
      )
      .subscribe(() => this.logger.log('prisma client successfully disposed'));
  }
}
