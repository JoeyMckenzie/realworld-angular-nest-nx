import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnsubscribeService } from './unsubscribe.service';

@NgModule({
  imports: [CommonModule],
  providers: [UnsubscribeService],
})
export class ConduitWebUtilsCommonModule {}
