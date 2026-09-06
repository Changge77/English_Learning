import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync,statSync} from 'node:fs';
import {words} from '../src/vocabulary.mjs';
import {lessons,letterNames} from '../src/curriculum.mjs';
import {sounds,soundQuestions} from '../src/phonetics.mjs';
import {audioId,spokenWord} from '../src/audio-id.mjs';
test('every word, example, lesson and sound clip has a nonempty static MP3',()=>{const clips=[];words.forEach(w=>{clips.push([spokenWord(w.text),'us'],[spokenWord(w.text),'uk'],[w.example,'us']);});lessons.forEach(l=>{l.cards.forEach(c=>clips.push([c.en,'us']));l.questions.forEach(q=>{if(q.audio)clips.push([q.audio,'us']);});});sounds.forEach(s=>clips.push([s.example,s.accent],[s.other,s.accent]));soundQuestions.flat().forEach(t=>clips.push([t,'us']));letterNames.forEach(t=>clips.push([t,'us']));for(const [text,accent] of clips){const path=`public/audio/${audioId(text,accent)}.mp3`;assert.ok(existsSync(path),`${text} ${accent}`);assert.ok(statSync(path).size>500,`${text} too short`);const b=readFileSync(path);assert.ok(b.subarray(0,3).toString()==='ID3'||b[0]===255,`${text} is not MP3`);}});
