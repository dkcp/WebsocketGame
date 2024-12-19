import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { redisClient } from '../utils/redisClient.js';

const __filename = fileURLToPath(import.meta.url); //C:\Users\DW\Documents\NodeJS\sparta\websocketGame\src\init\assets.js
const __dirname = path.dirname(__filename); //C:\Users\DW\Documents\NodeJS\sparta\websocketGame\src\init
const basePath = path.join(__dirname, '../../assets'); //C:\Users\DW\Documents\NodeJS\sparta\websocketGame\assets
const basename = path.basename(__filename);
let gameAssets = {};

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

// listening 포트로 established될 때 실행
export const loadGameAssets = async () => {
    try {

        const [stages, items, enemies, itemUnlocks] = await Promise.all([
            readFileAsync('stage.json'),
            readFileAsync('item.json'),
            readFileAsync('enemy.json'),
            readFileAsync('item_unlock.json'),
        ]);
        gameAssets = { stages, items, enemies, itemUnlocks };

        await redisClient.connect();
        await redisClient.set('gameAssets', JSON.stringify(gameAssets));
        gameAssets = JSON.parse(await redisClient.get('gameAssets'));
        await redisClient.set('highScore', 0)
        await redisClient.quit();

        return gameAssets;
    } catch (error) {
        throw new Error(`Failed to load game assets. ${error.message}`);
    }
};

export const getGameAssets = () => {
    return gameAssets;
};

