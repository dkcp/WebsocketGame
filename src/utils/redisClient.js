import { createClient } from 'redis';

const redisClient = createClient({
	url: `redis://default:9utjYyCnZZz9KFNW02MYOsONYbnRrSpg@redis-18232.c340.ap-northeast-2-1.ec2.redns.redis-cloud.com:18232`
});

redisClient.on('connect', () => {
	console.info('Redis connected!');
});
redisClient.on('error', err => {
	console.error('Redis Client Error', err);
});

const initRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
}

const cleanupRedis = async () => {
    if (redisClient.isOpen) {
        await redisClient.quit();
    }
}

const getRedis = async (key) => {
    initRedis();
    const value = await redisClient.get(key);

    return value;
}

const setRedis = async (key, value) => {
    initRedis();
    await redisClient.set(key, value);
}

export { redisClient, getRedis, setRedis, initRedis, cleanupRedis };