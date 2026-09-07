# Lingwei's English Garden 凌薇英语花园

The phonetic heading's speaker button streams individual US/UK sound recordings
from [Cambridge Dictionary](https://dictionary.cambridge.org/help/phonetics.html)
and requires internet access. Example-word audio remains bundled with the site.

A bilingual, self-paced Grade 3 English companion designed for **GitHub Pages**. No backend, API keys, sign-in, microphone, transcription, or pronunciation assessment.

## Included

- Ten complete Unit 1 lessons: greetings, vocabulary, self-introductions, friends/listening, repeat aloud, the kite story, alphabet, kindness, a saved postcard, and review.
- 272 vocabulary entries covering printed textbook pp. 86–92, including phrase entries, expanded parenthetical forms, proper nouns and play vocabulary. Alphabetical duplicates are consolidated.
- US and UK broad IPA, Chinese meanings, original bilingual examples, and prepared synthetic audio.
- 47 sound lessons: a General American core plus separately labelled British comparisons. Audio demonstrates sounds **inside example words**, with schematic mouth-opening illustrations and written tongue/lip guidance.
- Listening, picture matching, spelling, sentence ordering, reading comprehension, sound discrimination, flashcards, and mixed review.
- Browser-local learning progress, due reviews, stars, badges, and JSON backup/import with validation and confirmation.
- Responsive layout, keyboard controls, reduced-motion support, bilingual instructions and error messages, and bundled fonts/audio.

## Publish on GitHub Pages

1. Push the project to `Changge77/English_Learning`, branch `main`.
2. In the repository, open **Settings → Pages → Build and deployment → Source**, and choose **GitHub Actions**.
3. The included **Deploy English Garden to GitHub Pages** workflow builds and publishes `dist`. Run it manually from Actions if needed.
4. Open **https://changge77.github.io/English_Learning/**.

This URL becomes live only after Pages is enabled and a deployment succeeds. Hash routes such as `#/words` support direct links and refreshes on project Pages URLs. The source textbook PDF is not copied to the published site. CI deliberately skips Git LFS downloads because the textbook is an authoring input, not a runtime dependency.

GitHub Pages serves the website; learning records are stored only in each browser/device. Progress does **not** sync between devices. Export a backup before changing devices or clearing browser data. No GitHub account is needed to use the published website.

## Development and verification

Node.js 22 recommended:

```sh
npm ci
npm test
npm run build
```

`npm run dev` and `npm run preview` are developer-only local previews; learners use GitHub Pages.

`node scripts/browser-check.cjs` runs the browser regression workflow. Set `PLAYWRIGHT_MODULE` to your installed Playwright module and `CHROME_PATH` to Chrome's executable. Optional `TEST_URL` targets a running preview or deployment. `node scripts/full-unit-check.mjs` additionally exercises the whole unit and practice modes. Browser tests create isolated test profiles and do not use personal browser data.

## Content and audio maintenance

- `src/vocabulary.mjs`: vocabulary, meanings, IPA, examples, groups.
- `src/curriculum.mjs`: lessons, teaching cards, questions, alphabet.
- `src/phonetics.mjs`: sound inventory, tips, example words.
- `src/progress.mjs`: pure progress, review, and backup-validation functions.
- `src/main.tsx`: bilingual components and browser interactions.
- `public/audio/`: ready-to-play MP3s. Runtime does not call a speech service.

Audio was prepared with `edge-tts` 7.2.8, `en-US-JennyNeural` and `en-GB-SoniaNeural`, at -10% speaking rate. It is synthetic learning audio, not the publisher's recordings. Preparing new clips is a **build-time network operation**, not part of publishing or using the app:

```sh
python -m pip install --target tmp/audio-deps edge-tts==7.2.8
node scripts/audio-manifest.mjs
python scripts/generate-audio.py
npm test
```

Existing nonempty clips are reused. Tests verify that every referenced clip exists and has an MP3 header. They do not certify every spoken pronunciation. Names and isolated phonetics warrant a human listening review; no automated speech evaluation is included.

## Progress rules

- Lesson completion: 5 stars, once per lesson.
- Sound practice: 2 stars, once per sound; requires playing an example.
- Correct answer: 1 star per question per local calendar day.
- Vocabulary mastery increases at most once per day per word. Three successful days reach the mastered level. Errors lower the level and immediately schedule review.
- Review intervals are 1, 3, 7, and 14 days; due items return to Needs Review.
- Flashcards are explicitly self-reported recall. A score is not a pronunciation measurement.
- Badges and counts are derived from saved records. Units 2–6 are marked Coming Later.

## Content provenance

Curriculum input: 外研社《义务教育教科书 英语 三年级上册（根据2022年版课程标准修订）》, supplied in `Resource/`. Printed page 86 corresponds to PDF page 92; Unit 1 occupies printed pp. 6–17. The supplied PDF's SHA-256 remains `b78d852cd37e194a7d0cf4f66138bd32199b97916eb52b03e2eaf23c6e9fc3c5`.

Vocabulary meanings were transcribed from the appendix. IPA is an authored broad transcription; accent variants are not exhaustive, and names may vary. Examples, exercises, layout, the garden illustration and the schematic mouth diagrams are original companion content. The story is a concise adapted retelling. Fonts are distributed under their packages' SIL Open Font Licenses (see `public/licenses/`).
