function trackme(bot, username, tokens) {
    const player = bot.players[username];
    const { x, y, z } = player.entity.position;
    console.log(`📍 ${username} is at X=${Math.floor(x)}, Y=${Math.floor(y)}, Z=${Math.floor(z)}`);
    bot.chat(`${username} is at X=${Math.floor(x)}, Y=${Math.floor(y)}, Z=${Math.floor(z)}`);
}

function greet(bot) {
    const { x, y, z } = bot.entity.position;
    bot.chat('I am a bot. Not human. ');
    bot.chat('I am purposed to create controlled enrvironment for testing and sound cues datasets collection for the supersonar project.');
    bot.chat(`I am at X=${Math.floor(x)}, Y=${Math.floor(y)}, Z=${Math.floor(z)}`);
    bot.chat('Enter command "bot help" to see the list of commands.');

}

module.exports = {
    handleCommand: (bot, username, cmd, tokens) => {
        switch (cmd) {
            case "ping":
                bot.chat('pong!');
                break;
            case "trackme":
                trackme(bot, username, tokens);
                break;
            default:
                greet(bot);
                break;
        }
    },
};