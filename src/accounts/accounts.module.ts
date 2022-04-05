import { Module } from '@nestjs/common';
import { SeventvAccountsModule } from './seventv-accounts/seventv-accounts.module';

@Module({
  imports: [SeventvAccountsModule],
})
export class AccountsModule {}
