import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getRedis, initRedis, redisClient, setRedis } from '../utils/redisClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../../assets');
let gameAssets = {};
let records = {};

const readFileAsync = (filename) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(JSON.parse(data));
        });
    });
};

export const loadGameAssets = async () => {
    try {

        const [stages, items, enemies, itemUnlocks] = await Promise.all([
            readFileAsync('stage.json'),
            readFileAsync('item.json'),
            readFileAsync('enemy.json'),
            readFileAsync('item_unlock.json'),
        ]);
        gameAssets = { stages, items, enemies, itemUnlocks };

        await initRedis();
        await redisClient.flushAll();

        await setRedis('gameAssets', JSON.stringify(gameAssets));
        gameAssets = JSON.parse(await getRedis('gameAssets'));

        await setRedis('records', JSON.stringify({ 'testId': { highScore:0 }, 'testHighId': { highScore:10 } }));
        records = JSON.parse(await getRedis('records'));

        return { gameAssets, records };
    } catch (error) {
        throw new Error(`Failed to load game assets. ${error.message}`);
    }
};

export const getGameAssets = () => {
    return gameAssets;
};

export const getRecords = () => {
    return records;
}

export const updateRecords = async () => {
    records = JSON.parse(await redisClient.get('records'));
}


