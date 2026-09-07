import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { words } from "../src/vocabulary.mjs";
import { lessons, letterNames } from "../src/curriculum.mjs";
import { sounds, soundQuestions } from "../src/phonetics.mjs";
import { audioId, spokenWord } from "../src/audio-id.mjs";
test("every IPA sound has its own publisher recording in the lesson accent", () => {
  assert.equal(new Set(sounds.map((s) => s.audio)).size, sounds.length);
  for (const sound of sounds) {
    const url = new URL(sound.audio);
    assert.equal(url.origin, "https://dictionary.cambridge.org");
    assert.ok(
      url.pathname.startsWith(`/media/english/${sound.accent}_phonetic/`),
    );
    assert.match(url.pathname, /_sound_.*\.mp3$/);
  }
  assert.match(sounds.find((s) => s.ipa === "eɪ").audio, /day_2023feb_002/);
  assert.match(sounds.find((s) => s.ipa === "d").audio, /day_2023feb_001/);
});
test("every word, example, lesson and sound clip has a nonempty static MP3", () => {
  const clips = [];
  words.forEach((w) => {
    clips.push(
      [spokenWord(w.text), "us"],
      [spokenWord(w.text), "uk"],
      [w.example, "us"],
    );
  });
  lessons.forEach((l) => {
    l.cards.forEach((c) => clips.push([c.en, "us"]));
    l.questions.forEach((q) => {
      if (q.audio) clips.push([q.audio, "us"]);
    });
  });
  sounds.forEach((s) => clips.push([s.example, s.accent], [s.other, s.accent]));
  soundQuestions.flat().forEach((t) => clips.push([t, "us"]));
  letterNames.forEach((t) => clips.push([t, "us"]));
  for (const [text, accent] of clips) {
    const path = `public/audio/${audioId(text, accent)}.mp3`;
    assert.ok(existsSync(path), `${text} ${accent}`);
    assert.ok(statSync(path).size > 500, `${text} too short`);
    const b = readFileSync(path);
    assert.ok(
      b.subarray(0, 3).toString() === "ID3" || b[0] === 255,
      `${text} is not MP3`,
    );
  }
});
