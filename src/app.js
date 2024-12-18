import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';

const app = express();
const server = createServer(app);

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
initSocket(server);

app.get('/', (req, res) => {
    res.send('<h1>WebSocketGame default API </h1>');
});

server.listen(PORT, async () => {
    console.log(`[app.js]Server is running on port ${PORT}`);

    try {
        const assets = await loadGameAssets();
        console.log('[app.js]Assets loaded successfully');
    } catch (error) {
        console.error('[app.js]Failed to load game assets:', error);
    }
});
