const mineflayer = require('mineflayer');
const express = require('express');

// --- WEB SERVER (Required to keep Render active) ---
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot is online!'));
app.listen(PORT, () => console.log(`Web server active on port ${PORT}`));

// --- BOT SETTINGS ---
const SERVER_HOST = 'fun.kelmora.cloud';
const SERVER_PORT = 25581;
const BOT_USERNAME = 'Obanai_Iguro1479';
const PASSWORD = 'Aniket@1479';

function createBot() {
    console.log('--- Initializing Bot ---');

    const bot = mineflayer.createBot({
        username: BOT_USERNAME,
        version: '1.21.1',
        auth: 'offline',
        host: SERVER_HOST,
        port: SERVER_PORT
    });

    bot.on('login', () => {
        console.log('✅ Connected to game world!');
    });

    bot.once('spawn', () => {
        console.log('✅ Bot spawned. Sending login...');
        setTimeout(() => {
            bot.chat(`/login ${PASSWORD}`);
        }, 5000);
    });

    // Anti-AFK behavior: Look around occasionally
    setInterval(() => {
        bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * Math.PI / 2);
    }, 10000);

    bot.on('kicked', (reason) => {
        console.log('--- KICKED BY SERVER ---', reason);
    });

    bot.on('error', (err) => {
        console.log('Error:', err);
    });

    bot.on('end', () => {
        console.log('Disconnected. Reconnecting in 1 minute...');
        setTimeout(createBot, 60000);
    });
}

createBot();
