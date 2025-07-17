import { createClient } from 'redis';

export const connectRedis = async () => {
  try {
    const url = 'redis://localhost:6379';
    const client = createClient({ url });

    client.on('error', (err: any) => {
      console.error('Redis Client Error', err);
    });

    await client.connect();
    console.log('Redis Connected');
    return client;
  } catch (e) {
    console.error('Redis Connection failed', e);
    process.exit(1);
  }
};