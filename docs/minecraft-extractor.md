# Minecraft Sound Extractor

> Tool for extracting and capturing sound data from Minecraft environments

## Overview

The Minecraft Extractor is a specialized tool designed to connect to Minecraft servers and extract audio cues and environmental data. This data is used to train the Supersonar AI for sound recognition and spatial awareness.

![Minecraft Extractor Overview](../docs/images/Screenshot%202025-03-06%20170041.png)
*Screenshot of the Minecraft Extractor in action showing the bot connected to a server*

## Setup

### Server Configuration

1. Download and set up a minecraft server. I'd like to use PaperMC's from [PaperMC](https://papermc.io/downloads)
2. Configure the `server.properties` file:

   ```properties
   online-mode:false
   ```

### Client Configuration

1. Install Minecraft Java Edition
2. Create a test account or use your existing account
3. Ensure you can connect to the same server your bot will connect to

## Running the Extractor

Start the Minecraft extractor with:

```bash
npm run minecraft
```

This will:

1. Connect a bot to your configured Minecraft server
2. Begin listening for in-game sounds
3. Record the sounds with their spatial positioning data

![Minecraft Bot Connection](../docs/images/Screenshot%202025-03-06%20170041.png)
*Screenshot showing successful connection to the Minecraft server*

## Bot Commands

The Minecraft extractor bot responds to several in-game commands:

| Command | Description |
|---------|-------------|
| `bot ping` | Simple command to check if the bot is responsive |
| `bot trackme` | Shows the current player's coordinates |
| `bot help` | Displays the list of available commands |

Commands are entered in the Minecraft chat and must be prefixed with "bot".

## Data Collection

The bot collects the following data:

- Sound events with their type IDs
- Spatial coordinates of each sound
- Player position relative to sounds
- Environmental context (biome, time of day)

All sound data is saved in the format:

```json
{
  "soundId": "minecraft:block.stone.break",
  "position": {"x": 245, "y": 65, "z": -132},
  "playerPosition": {"x": 247, "y": 65, "z": -130},
  "timestamp": 1621345678900,
  "distance": 3.6
}
```

## Controlled Testing Environment

For optimal data collection, create a controlled testing environment:

1. Use a flat world generation
2. Place different sound-producing blocks (note blocks, redstone, etc.)
3. Create command block sequences to trigger sounds
4. Build separate areas for different sound categories

## Resources

- [Mineflayer Documentation](https://github.com/PrismarineJS/mineflayer)
- [Minecraft Sound Events Wiki](https://minecraft.fandom.com/wiki/Sounds.json)
- [Paper Server Documentation](https://docs.papermc.io/)
- [Hello Minecraft Launcher](https://github.com/HMCL-dev/HMCL)
