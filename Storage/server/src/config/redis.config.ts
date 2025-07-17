import { createClient } from 'redis';

const url = 'redis://localhost:6379';
const redisClient = createClient({ url });

redisClient.on('error', (err: any) => {
  console.error('Redis Client Error', err);
});

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log('Redis Connected');
    }
  } catch (e) {
    console.error('Redis Connection failed', e);
    process.exit(1);
  }
};

export default redisClient;
