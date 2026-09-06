import {words} from '../src/vocabulary.mjs';
import {lessons,letterNames} from '../src/curriculum.mjs';
import {sounds,soundQuestions} from '../src/phonetics.mjs';
import {audioId,spokenWord} from '../src/audio-id.mjs';
import {mkdirSync,writeFileSync} from 'node:fs';
const items=new Map();
function add(text,accent='us'){items.set(audioId(text,accent),{id:audioId(text,accent),text,accent});}
words.forEach(w=>{add(spokenWord(w.text));add(spokenWord(w.text),'uk');add(w.example);});
lessons.forEach(l=>{l.cards.forEach(c=>add(c.en));l.questions.forEach(q=>{if(q.audio)add(q.audio);});});
sounds.forEach(s=>{add(s.example,s.accent);add(s.other,s.accent);});
soundQuestions.flat().forEach(t=>add(t));letterNames.forEach(t=>add(t));
mkdirSync('tmp',{recursive:true});writeFileSync('tmp/audio-manifest.json',JSON.stringify([...items.values()],null,2));
console.log(`${items.size} audio files`);
