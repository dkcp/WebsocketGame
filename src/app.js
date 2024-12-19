import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';
import { createClient } from 'redis';

const app = express();
const server = createServer(app);
const PORT = 3000;

export const redisClient = createClient({
	url: `redis://default:9utjYyCnZZz9KFNW02MYOsONYbnRrSpg@redis-18232.c340.ap-northeast-2-1.ec2.redns.redis-cloud.com:18232`
});

redisClient.on('connect', () => {
	console.info('Redis connected!');
});
redisClient.on('error', err => {
	console.error('Redis Client Error', err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
initSocket(server);

app.get('/', (req, res) => {
	res.send('<h1>WebSocketGame default API </h1>');
});

server.listen(PORT, async () => {
	console.log(`Server is running on port ${PORT}`);

	try {
		const assets = await loadGameAssets();
	} catch (error) {
		console.error('Failed to load game assets:', error);
	}
});
