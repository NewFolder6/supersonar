const mineflayer = require('mineflayer');
const commandsHandler = require('./commands/handler');

// Function to create and configure a bot
function createBot(options = {}) {
    const defaultOptions = {
        host: 'localhost',
        port: 25565,
        username: 'Bot'
    };
    
    const botOptions = { ...defaultOptions, ...options };
    const bot = mineflayer.createBot(botOptions);

    // Setup event handlers
    bot.once('spawn', () => {
        console.log('🤖 Bot successfully created!');
    });

    bot.once('error', (error) => {
        console.log('⚠️ Error creating bot:', error);
    });

    bot.on('chat', (username, message) => {
        if (username == bot.username) return;
        if (message.startsWith("bot ")) {
            const tokens = message.slice(4).trim().split(/\s+/);
            const cmd = tokens.shift()?.toLowerCase();
            
            commandsHandler.handleCommand(bot, username, cmd, tokens);
            console.log(`💬 Command from ${username}: ${cmd} ${tokens.join(' ')}`);
        }
    });

    return bot;
}

module.exports = {
    createBot
};
