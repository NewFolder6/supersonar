module.exports = {
    trackme: (bot, username, tokens) => {
        const playerEntity = bot.players[username] && bot.players[username].entity;
        if (playerEntity) {
            const { x, y, z } = playerEntity.position;
            console.log(username + " is at X=" + x + ", Y=" + y + ", Z=" + z);
        }
    }
};