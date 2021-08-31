import { CacheModule as LocalCacheModule, Module } from '@nestjs/common';
import * as RedisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    LocalCacheModule.register({
      store: RedisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
  exports: [
    LocalCacheModule
  ]
})
export class CacheModule {}
