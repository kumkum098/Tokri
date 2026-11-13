import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import type { Redis } from 'ioredis';
import type { Server, ServerOptions } from 'socket.io';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter> | null = null;

  async connectToRedis(redisClient: Redis): Promise<void> {
    const pubClient = redisClient.duplicate();
    const subClient = redisClient.duplicate();
    await Promise.all([pubClient.ping(), subClient.ping()]);
    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  override createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(port, options);
    const adapterConstructor = this.adapterConstructor;
    if (!adapterConstructor) {
      throw new Error('Redis Socket.IO adapter is not initialized');
    }
    server.adapter(adapterConstructor);
    return server;
  }
}
