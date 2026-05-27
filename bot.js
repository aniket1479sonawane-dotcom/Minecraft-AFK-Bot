const mineflayer = require('mineflayer');
const http = require('http');

// Keep the service alive on Render
http.createServer((req, res) => {
    res.write('Bot is running!');
    res.end();
}).listen(process.env.PORT || 3000);

const SERVER_HOST = 'fun.kelmora.cloud';
const SERVER_PORT = 25581;
const BOT_USERNAME = 'Obanai_Iguro1479'; // Choose any name you want
const SERVER_VERSION = '1.21.11';
const PASSWORD = 'Aniket@1479'; // CHANGE THIS to your server login password

function createBot() {
    console.log('--- Initializing Offline Bot ---');

    const bot = mineflayer.createBot({
        host: SERVER_HOST,
        port: SERVER_PORT,
        username: BOT_USERNAME,
        auth: 'offline', // Switched to offline
        version: SERVER_VERSION
    });

    bot.once('spawn', () => {
        console.log('✅ Bot spawned. Sending login command...');
        
        // Wait 2 seconds, then login and go to survival
        setTimeout(() => {
            bot.chat(`/login ${PASSWORD}`);
            
            setTimeout(() => {
                bot.chat('/server survival');
                console.log('--- Bot moved to survival ---');
            }, 2000);
            
        }, 2000);
    });

    bot.on('kicked', (reason) => { 
        console.log('Bot kicked! Reason:', JSON.stringify(reason)); 
    });
    
    bot.on('end', () => {
        console.log('Bot disconnected. Reconnecting in 10 seconds...');
        setTimeout(createBot, 10000);
    });

    bot.on('error', (err) => { console.log('Error:', err); });
}

createBot();
