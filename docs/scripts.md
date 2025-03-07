# Available Scripts

## Start the application

```bash
npm start
```

## List audio devices

```bash
npm run audio:list
```

This command displays all available audio input and output devices on your system.

## Record audio sample

```bash
npm run record-audio
```

By default, this command records a 5-second audio clip from your default microphone and saves it to the recordings directory. You can optionally specify a duration:

```bash
npm run record-audio 10
```

## Run Minecraft extractor

```bash
npm run minecraft
```

This script connects to a Minecraft server and extracts audio data.
