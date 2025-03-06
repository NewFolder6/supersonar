const mineflayer = require('mineflayer');
const commands = require('./commands');

const bot = mineflayer.createBot({
    //logging in
    host: 'localhost',
    port: 25565,
    username: 'Bot'
});

bot.once('spawn', () => {
    console.log('Bot successfully created!');
});

bot.once('error', (error) => {
    console.log('Error creating bot:', error);
});

bot.on('chat', (username, message) => {
    if (username == bot.username) return;
    const playerEntity = bot.players[username] && bot.players[username].entity;
    if (message.startsWith("bot ")) {
        const tokens = message.slice(4).trim().split(/\s+/);
        const cmd = tokens.shift()?.toLowerCase();

        console.log($`Command from ${username}: ${cmd} ${tokens.join(' ')}`);

        switch (cmd) {
            case "trackme":
                commands.trackme(bot, username, tokens);
                break;
            default:
                bot.chat("Unknown command.");
                break;
        }
    }
});