const mineflayer = require('mineflayer');
const http = require('http');

// Keep the service alive on Render
http.createServer((req, res) => {
    res.write('Bot is running!');
    res.end();
}).listen(process.env.PORT || 3000);

const SERVER_HOST = 'fun.kelmora.cloud';
const SERVER_PORT = 25581;
const BOT_USERNAME = 'FatAl_TErr0r'; 
const SERVER_VERSION = '1.21.1';
const STEP_INTERVAL = 1500;
const JUMP_DURATION = 500;

function createBot() {
    console.log('--- Initializing Bot Connection ---');

    const bot = mineflayer.createBot({
        host: SERVER_HOST,
        port: SERVER_PORT,
        username: BOT_USERNAME,
        auth: 'microsoft',
        version: SERVER_VERSION
    });

    let movementPhase = 0;

    function movementCycle() {
        if (!bot.entity) return;
        switch (movementPhase) {
            case 0:
                bot.setControlState('forward', true);
                bot.setControlState('back', false);
                bot.setControlState('jump', false);
                break;
            case 1:
                bot.setControlState('forward', false);
                bot.setControlState('back', true);
                bot.setControlState('jump', false);
                break;
            case 2:
                bot.setControlState('forward', false);
                bot.setControlState('back', false);
                bot.setControlState('jump', true);
                setTimeout(() => { bot.setControlState('jump', false); }, JUMP_DURATION);
                break;
            case 3:
                bot.setControlState('forward', false);
                bot.setControlState('back', false);
                bot.setControlState('jump', false);
                break;
        }
        movementPhase = (movementPhase + 1) % 4;
        setTimeout(movementCycle, STEP_INTERVAL);
    }

    bot.once('spawn', () => {
        console.log('✅ Bot spawned, running command...');
        setTimeout(() => {
            bot.chat('/server survival');
            bot.setControlState('sneak', true);
            movementCycle();
        }, 2000);
    });

    bot.on('error', (err) => { 
        console.error('⚠️ Error detected:', err); 
    });

    bot.on('kicked', (reason) => { 
        console.log('Bot kicked! Reason:', JSON.stringify(reason)); 
    });
    
    bot.on('end', () => {
        console.log('Bot disconnected. Reconnecting in 10 seconds...');
        setTimeout(createBot, 10000);
    });
}

createBot();
