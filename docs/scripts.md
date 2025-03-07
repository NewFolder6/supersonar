# Available Scripts

## Start the application

```bash
npm start
```

## Record audio sample

>I am using npm mic to record the audio, and it is dependent on arecord (Linux) or [sox](sourceforge.net/projects/sox). I am using sox on my Windows computer and to have it properly set up you must add it to your environment variables path, too.

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
