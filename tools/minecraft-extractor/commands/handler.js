const mineflayer = require('mineflayer');
//https://github.com/PrismarineJS/mineflayer/blob/master/docs/api.md


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

// function placeBlock(bot, blockType) {
//     const item = bot.inventory.items().find(item => item.name === blockType);

//     if (!item) {
//         console.log(`Cannot find ${blockType} in inventory`);
//         return;
//     }

//     bot.equip(item, 'hand', (err) => {
//         if (err) {
//             console.error(err);
//             bot.chat('Failed to equip block');
//         }

//         const referenceBlock = bot.blockAt(bot.entity.position.offset(0, -2, 0));;

//         if (!referenceBlock) {
//             bot.chat('No block below to place against');
//             return;
//         }
//         console.log('Placing block');
//         console.log(referenceBlock);
//         bot.placeBlock(referenceBlock, new mineflayer.vec3(0, 1, 0), (err) => {
//             if (err) {
//                 console.error(err);
//                 bot.chat('Failed to place block');
//             } else {
//                 bot.chat(`Placed ${blockType}`);
//             }
//         })
//     });
// }

function minectaftCommand(bot, tokens){
    bot.chat('/'+tokens.join(' '));
}

function initilizeForTask(bot){
    bot.chat('/gamemode creative');
    bot.chat('/time set day');
    bot.chat('/weather clear');
    bot.chat('/gamerule doDaylightCycle false');
    bot.chat('/gamerule doWeatherCycle false');
    bot.chat('/gamerule doMobSpawning false');
    // make him flaot in the air
    bot.creative.startFlying();
    bot.chat('Bot is ready for task.');
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
            // case "place":
            //     placeBlock(bot, tokens[0]);
            //     break;
            case 'command':
                minectaftCommand(bot, tokens);
                break;
            case "init":
                initilizeForTask(bot);
                break;
            default:
                greet(bot);
                break;
        }
    },
};