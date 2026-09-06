export const STORAGE_KEY = "english-garden:english-learning:v1";
export function freshState() {
  return {
    version: 1,
    completed: [],
    seen: [],
    sounds: [],
    wordProgress: {},
    history: [],
    awards: [],
    days: [],
    resume: { lesson: "hello", step: 0 },
    settings: { slow: false, showChinese: true },
    postcard: {
      name: "",
      age: "9",
      pronoun: "She",
      country: "China",
      decoration: "🌼",
    },
  };
}
export function localDay(time = Date.now()) {
  const d = new Date(time);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function wordStatus(p, now = Date.now()) {
  if (!p) return "new";
  if (p.weak || p.due <= now) return "review";
  return p.level >= 3 ? "mastered" : "learning";
}
export function answerResult(
  state,
  id,
  correct,
  wordId = "",
  time = Date.now(),
) {
  const s = structuredClone(state),
    day = localDay(time);
  if (!s.days.includes(day)) s.days.push(day);
  const award = `${day}:${id}`;
  if (correct && !s.awards.includes(award)) s.awards.push(award);
  s.history.push({ id, correct, wordId, time });
  s.history = s.history.slice(-2000);
  if (wordId) {
    let p = s.wordProgress[wordId] || {
      level: 0,
      due: time,
      weak: false,
      lastSuccess: "",
    };
    if (correct) {
      if (p.lastSuccess !== day) {
        p.level = Math.min(p.level + 1, 4);
        p.lastSuccess = day;
      }
      p.weak = false;
      p.due = time + [1, 1, 3, 7, 14][p.level] * 86400000;
    } else {
      p.level = Math.max(0, p.level - 1);
      p.weak = true;
      p.due = time;
    }
    s.wordProgress[wordId] = p;
  }
  return s;
}
export function completeLesson(state, id) {
  const s = structuredClone(state);
  if (!s.completed.includes(id)) s.completed.push(id);
  const day = localDay();
  if (!s.days.includes(day)) s.days.push(day);
  return s;
}
export function stars(state) {
  return (
    state.completed.length * 5 + state.sounds.length * 2 + state.awards.length
  );
}
export function streak(state, time = Date.now()) {
  let d = new Date(time),
    count = 0;
  if (!state.days.includes(localDay(d))) {
    d.setDate(d.getDate() - 1);
  }
  while (state.days.includes(localDay(d))) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}
export function validateBackup(input, wordIds, lessonIds, soundIds) {
  if (!input || typeof input !== "object" || input.version !== 1)
    throw Error("Unsupported backup");
  const out = freshState();
  const safeList = (v, allowed, max = 1000) => {
    if (
      !Array.isArray(v) ||
      v.length > max ||
      v.some((x) => typeof x !== "string" || (allowed && !allowed.has(x)))
    )
      throw Error("Invalid list");
    return [...new Set(v)];
  };
  out.completed = safeList(input.completed, new Set(lessonIds));
  out.seen = safeList(input.seen, new Set(wordIds));
  out.sounds = safeList(input.sounds, new Set(soundIds));
  out.days = safeList(input.days, null, 20000);
  if (out.days.some((d) => !/^\d{4}-\d{2}-\d{2}$/.test(d)))
    throw Error("Invalid days");
  out.awards = safeList(input.awards, null, 50000);
  if (out.awards.some((a) => a.length > 200)) throw Error("Invalid awards");
  if (
    !input.wordProgress ||
    typeof input.wordProgress !== "object" ||
    Array.isArray(input.wordProgress)
  )
    throw Error("Invalid progress");
  for (const [id, p] of Object.entries(input.wordProgress)) {
    if (
      !wordIds.includes(id) ||
      !p ||
      !Number.isInteger(p.level) ||
      p.level < 0 ||
      p.level > 4 ||
      !Number.isFinite(p.due) ||
      p.due < 0 ||
      typeof p.weak !== "boolean" ||
      typeof p.lastSuccess !== "string" ||
      !/^$|^\d{4}-\d{2}-\d{2}$/.test(p.lastSuccess)
    )
      throw Error("Invalid word");
    out.wordProgress[id] = {
      level: p.level,
      due: p.due,
      weak: p.weak,
      lastSuccess: p.lastSuccess,
    };
  }
  if (!Array.isArray(input.history) || input.history.length > 2000)
    throw Error("Invalid history");
  out.history = input.history.map((h) => {
    if (
      !h ||
      typeof h.id !== "string" ||
      h.id.length > 200 ||
      typeof h.correct !== "boolean" ||
      !Number.isFinite(h.time) ||
      h.time < 0 ||
      typeof h.wordId !== "string" ||
      (h.wordId && !wordIds.includes(h.wordId))
    )
      throw Error("Invalid attempt");
    return { id: h.id, correct: h.correct, wordId: h.wordId, time: h.time };
  });
  if (
    !input.resume ||
    !lessonIds.includes(input.resume.lesson) ||
    !Number.isInteger(input.resume.step) ||
    input.resume.step < 0 ||
    input.resume.step > 100
  )
    throw Error("Invalid resume");
  out.resume = { lesson: input.resume.lesson, step: input.resume.step };
  if (
    !input.settings ||
    typeof input.settings.slow !== "boolean" ||
    typeof input.settings.showChinese !== "boolean"
  )
    throw Error("Invalid settings");
  out.settings = {
    slow: input.settings.slow,
    showChinese: input.settings.showChinese,
  };
  const p = input.postcard;
  if (
    !p ||
    typeof p.name !== "string" ||
    p.name.length > 40 ||
    typeof p.age !== "string" ||
    !/^$|^\d{1,2}$/.test(p.age) ||
    !["He", "She", "They"].includes(p.pronoun) ||
    !["China", "the UK", "the USA"].includes(p.country) ||
    !["🌼", "🪁", "🌈", "🐈", "⭐"].includes(p.decoration)
  )
    throw Error("Invalid postcard");
  out.postcard = {
    name: p.name,
    age: p.age,
    pronoun: p.pronoun,
    country: p.country,
    decoration: p.decoration,
  };
  return out;
}
