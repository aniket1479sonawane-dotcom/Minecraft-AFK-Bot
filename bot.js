const mineflayer = require('mineflayer');
const express = require('express');

// --- KEEP RENDER ACTIVE ---
const app = express();
app.get('/', (req, res) => res.send('Bot is online!'));
app.listen(process.env.PORT || 3000);

// --- SETTINGS ---
const SERVER_HOST = 'fun.kelmora.cloud';
const SERVER_PORT = 25581;
const BOT_USERNAME = 'Obanai_Iguro1479';
const PASSWORD = 'Aniket@1479';

function createBot() {
    console.log('--- Initializing Simple Bot ---');

    const bot = mineflayer.createBot({
        host: SERVER_HOST,
        port: SERVER_PORT,
        username: BOT_USERNAME,
        version: '1.21.1', // Ensure this matches the server's version
        auth: 'offline'
    });

    bot.on('login', () => {
        console.log('✅ Logged in!');
    });

    bot.once('spawn', () => {
        console.log('✅ Spawned. Logging in...');
        setTimeout(() => {
            bot.chat(`/login ${PASSWORD}`);
        }, 5000);
    });

    // Anti-AFK: Move slightly every 30 seconds
    setInterval(() => {
        bot.setControlState('forward', true);
        setTimeout(() => bot.setControlState('forward', false), 500);
    }, 30000);

    bot.on('kicked', (reason) => {
        console.log('--- KICKED BY SERVER ---');
        console.log(reason);
    });

    bot.on('error', (err) => {
        console.log('Error:', err);
    });

    bot.on('end', () => {
        console.log('Disconnected. Reconnecting...');
        setTimeout(createBot, 60000);
    });
}

createBot();
