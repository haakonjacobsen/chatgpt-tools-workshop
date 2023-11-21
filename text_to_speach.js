import fs from 'fs';
import path from 'path';
import player from 'play-sound';

const audioPlayer = player();
const speechFile = path.resolve('./speech.mp3');

export async function textToSpeech(openai, text) {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: text,
  });
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
  audioPlayer.play(speechFile, (err) => {
    if (err) console.error(`Could not play the audio: ${err}`);
  });
}
