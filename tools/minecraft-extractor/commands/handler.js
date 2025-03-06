const commands = require('./commands');

function trackme(bot, username, tokens) {
    const playerEntity = bot.players
    if(playerEntity) {
        const { x, y, z } = playerEntity.position;
        console.log(username + " is at X=" + x + ", Y=" + y + ", Z=" + z);
    }
}

module.exports = {
    handleCommand: (bot, username, cmd, tokens) => {
        switch (cmd) {
            case "trackme":
                trackme(bot, username, tokens);
                break;
            default:
                bot.chat("Unknown command.");
                break;
        }
    },
};