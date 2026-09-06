# English Learning Web — Design Guideline

## Approved implementation baseline — September 2026

This section records the user's latest approved decisions and supersedes conflicting requirements in the original design snapshot below.

- **Hosting:** GitHub Pages. Static React/TypeScript application; no runtime backend, accounts, API keys, microphone access, speech recognition, transcription or pronunciation scoring.
- **Bilingual interface:** Navigation, headings, actions, explanations, feedback, settings and error messages are English and Chinese together. Target English content can use a Chinese reveal control in recall tasks. Diphthongs is 双元音; vowels is 元音.
- **Audio:** US English is the main playback accent. UK audio and IPA are available in Words. Audio and fonts are packaged with the site; learners do not need a speech-service subscription. Slow playback is available.
- **Learning:** Unit 1 is the complete prototype. Units 2–6 remain visibly labelled Coming Later · 敬请期待. Shared components support later content expansion.
- **Speaking:** Listen and repeat aloud, without recording or assessment. Completion never claims pronunciation accuracy.
- **Vocabulary:** Cover printed pp. 86–92, including proper nouns and play vocabulary. Consolidate the repeated alphabetical list and expand parenthetical forms into searchable entries. Each entry includes Chinese meaning, US/UK broad IPA, both audio variants, an original bilingual example, and review state.
- **Phonetics:** A General American core with explicit British comparisons. Explain letter vs. sound and IPA. Use example-word audio, schematic mouth-opening diagrams and written tongue/lip instructions. Sound practice is participation, not a speech score.
- **Review:** Use exercise results and explicit flashcard self-checks. Mastery requires successful recall across different days. Errors return words to review. No fake scores or generated claims of speech quality.
- **Progress:** Save on the current browser/device, with validated JSON export/import and confirmation before replacement or reset. No automatic cross-device synchronization.
- **Visual design:** English Garden · 英语花园. Calm green, cream and warm accents; original garden illustration; readable bilingual labels; responsive desktop/tablet/mobile layouts; keyboard and reduced-motion support.

### Current site map

| Section | Contents |
|---|---|
| Home · 首页 | Continue learning · 继续学习; today's plan · 今日计划; review · 复习; rewards · 奖励 |
| Learn · 课程 | Greetings; friendship vocabulary; self-introductions; friends/listening; repeat aloud; kite story; alphabet; kindness; friend postcard; Unit 1 review |
| Words · 单词 | All vocabulary; English/Chinese search; unit and learning-state filters; details; US/UK IPA and audio; examples; review list |
| Phonetic · 音标 | Letters vs. sounds; vowels · 元音; diphthongs · 双元音; consonants · 辅音; UK comparison · 英音对照; sound practice |
| Practice · 练习 | Listening; picture matching; spelling; sentence ordering; reading; sound discrimination; flashcards; mixed review |
| Progress · 学习进度 | Completed lessons; vocabulary mastery; sound participation; exercise history; learning days; stars and badges |
| Settings · 设置 | Slow playback; Chinese learning hints; export/import; postcard; confirmed reset |

### Core verification requirements

1. Check every content reference and required audio file.
2. Verify actual lesson navigation, answer feedback and completion.
3. Verify page refresh restores progress, backups round-trip, and invalid imports preserve existing records.
4. Verify US/UK playback, listening-question gating and failure feedback.
5. Verify desktop/mobile navigation and layouts, including Pages project URLs and direct hash routes.
6. Deploy only the build output; preserve source inputs.

The original guideline is retained below as historical design context. Its automated speech-evaluation requirements and related score-based rewards are deferred.

---

## Original design snapshot (historical)

**Project:** Personal English Self-Learning Website  
**Primary learner:** Grade 3 student  
**Curriculum basis:** 《义务教育教科书 英语 三年级上册（根据2022年版课程标准修订）》, 外语教学与研究出版社  
**Initial development scope:** Unit 1 — *Let’s be friends!*  
**Design direction:** Child-friendly, but not childish; modern educational app + interactive storybook + textbook  
**Primary learning mode:** Self-learning, not classroom learning

---

## 1. Product Vision

The website should function as a **personal English-learning companion** rather than a digital copy of the textbook.

The textbook determines **what the learner studies**.  
The website determines **how the learner studies it**.

The website should add capabilities that the printed book cannot provide effectively:

- audio playback;
- pronunciation practice and evaluation;
- interactive listening;
- self-paced learning;
- immediate feedback;
- adaptive review;
- progress tracking;
- rewards and badges;
- reusable learning activities;
- personalized vocabulary review.

The learner should be able to use the website independently without relying on a teacher, classmate, or classroom activity.

---

## 2. Core Design Principles

### 2.1 Self-Learning First

All activities must work for one learner using the website independently.

Classroom instructions such as:

- “Work in pairs”
- “Work in groups”
- “Ask and answer”
- “Tell the class”

must be redesigned into self-learning interactions such as:

- listen and respond;
- speak to the website;
- record and replay;
- answer an AI or virtual character;
- complete an interactive task;
- ask a family member;
- create and save a small personal project.

The website must never assume that another student or teacher is present.

### 2.2 Consistent Learning Flow

Each textbook unit should use the same basic digital learning engine so that the learner quickly understands how the website works.

Recommended unit flow:

**Learn → Listen → Speak → Read / Story → Practice → Review**

The exact content changes by unit, but the interaction pattern should remain familiar.

### 2.3 Simple Interface

The learner is a primary-school student, so the interface should minimize cognitive load.

Use:

- large touch-friendly buttons;
- large readable text;
- simple navigation;
- strong visual hierarchy;
- clear icons;
- limited text per screen;
- one main task per screen;
- clear progress indicators;
- short instructions.

Avoid:

- complex dashboards;
- dense menus;
- excessive statistics;
- long paragraphs inside learning activities;
- distracting animation;
- competitive or stressful game mechanics.

### 2.4 Child-Friendly, Not Childish

The visual language should feel appropriate for a Grade 3 learner without resembling a preschool app.

Target style:

**Modern educational app + interactive storybook + textbook**

Use:

- rounded cards;
- clean layouts;
- friendly illustrations;
- soft backgrounds;
- clear typography;
- restrained animation;
- simple characters where useful;
- visually distinct unit themes.

Avoid excessive cartoon styling, noisy graphics, or overly juvenile decorations.

---

## 3. Main Website Architecture

The website should contain six top-level areas.

```text
HOME-首页
│
├── LEARN-课程
│   ├── Unit 1 — Let’s be friends!       ← Build first
│   ├── Unit 2 — My school things        ← Later
│   ├── Unit 3 — It’s a colourful world! ← Later
│   ├── Unit 4 — Fun with numbers        ← Later
│   ├── Unit 5 — We’re family            ← Later
│   └── Unit 6 — My sweet home           ← Later
│
├── WORDS-单词
│
├── PHONETIC-音标
│
├── PRACTICE-练习
│
└── PROGRESS-学习进度
```

Units 2–6 may appear in the interface during Version 1, but they should remain locked or marked as future content until the Unit 1 prototype is validated.

---

## 4. HOME-首页

The Home page is the learner’s daily self-learning control center.

Its purpose is to answer:

1. What am I learning now?
2. What should I do next?
3. What should I review?
4. How much progress have I made?

Recommended content:

### Continue Learning

Show:

- current unit;
- current lesson;
- completion percentage;
- one primary “Continue” button.

Example:

> **Unit 1 — Let’s be friends!**  
> Lesson 2  
> 60% complete  
> **Continue Learning →**

### Today’s Learning

The website should eventually generate a short self-learning plan.

Example:

- Continue Unit 1 — 8 min
- Review 5 words — 3 min
- Pronunciation practice — 3 min

### Daily Review

Show weak or recently learned content.

Example:

> **Review Today**  
> friend · name · hello · nice · meet

### Rewards Snapshot

Show lightweight motivation:

- stars;
- badges;
- learning streak;
- unit completion.

The Home page should not overwhelm the learner with analytics.

---

## 5. LEARN-课程

### 5.1 Development Strategy

Build **Unit 1 — Let’s be friends!** as the complete prototype first.

Unit 1 should establish:

- page structure;
- navigation;
- visual system;
- audio behavior;
- speaking behavior;
- pronunciation evaluation;
- story interaction;
- practice format;
- review logic;
- progress tracking;
- reward logic.

After Unit 1 works well, Units 2–6 should reuse the same learning system.

### 5.2 Unit Learning Flow

Each unit should follow:

#### A. Learn

Introduce new vocabulary, expressions, and sentence patterns using:

- illustration or image;
- English word or sentence;
- audio;
- optional Chinese support;
- short examples.

#### B. Listen

Listening activities should include:

- listen and choose;
- listen and match;
- listen and identify;
- listen without visible text;
- replay audio.

#### C. Speak

Speaking activities should include:

- listen and repeat;
- record learner speech;
- pronunciation evaluation;
- word-level feedback;
- sentence-level feedback.

#### D. Read / Story

Story sections from the textbook should become interactive reading experiences.

Recommended format:

**Scene → Audio → Read → Question → Continue**

Avoid showing an entire textbook story page as a static image when it can be converted into a guided sequence.

#### E. Practice

Use short reusable practice formats.

#### F. Review

Each unit should end with a concise mastery review that checks:

- vocabulary;
- listening;
- speaking;
- reading;
- sentence patterns.

The system should use errors from the review to determine future practice.

---

## 6. WORDS-单词

The **Words-单词** section is a separate top-level vocabulary system.

### 6.1 Vocabulary Source

The first vocabulary database should be built from the textbook’s **Words and Expressions** section on **pages 86–92**.

This section should eventually contain all vocabulary listed there.

### 6.2 Required Data for Each Word

Each vocabulary entry should contain:

- English spelling;
- Chinese meaning;
- unit;
- **US IPA**;
- **UK IPA**;
- **US audio**;
- **UK audio**;
- example sentence;
- picture or visual cue where useful;
- pronunciation practice;
- learning status;
- review status.

### 6.3 Default Pronunciation Rule

**US pronunciation is the default pronunciation throughout the website.**

This applies to:

- word audio;
- sentence audio;
- listening exercises;
- speaking targets;
- pronunciation evaluation;
- example sentences;
- lesson narration where English is spoken.

UK pronunciation should still be available as a secondary option in the Words section and where useful elsewhere.

Recommended interface:

> **friend**  
> 🇺🇸 US /.../ 🔊 **Default**  
> 🇬🇧 UK /.../ 🔊  
> 朋友

Do not require the learner to memorize both variants. The website should make the US version primary and the UK version available for comparison.

### 6.4 Vocabulary Learning States

Each word should have one of the following states:

- **New**
- **Learning**
- **Mastered**
- **Needs Review**

The learner should be able to filter vocabulary by:

- all words;
- current unit;
- New;
- Learning;
- Mastered;
- Needs Review.

### 6.5 Word Detail Interaction

A word page should support:

- play US pronunciation;
- play UK pronunciation;
- reveal Chinese meaning;
- show example sentence;
- record learner pronunciation;
- evaluate pronunciation;
- add to review;
- view relevant phonetic sounds.

---

## 7. PHONETIC-音标

The **Phonetic-音标** section is independent from the textbook units.

Its purpose is to systematically teach basic English sounds and pronunciation.

### 7.1 Recommended Structure

```text
PHONETIC-音标
│
├── Start Here
│   ├── What is a sound?
│   ├── Letter vs. sound
│   └── How to read IPA
│
├── Vowels-元音
│   ├── Simple vowels
│   └── Diphthongs
│
├── Consonants-辅音
│   ├── Stops
│   ├── Fricatives
│   ├── Affricates
│   ├── Nasals
│   └── Other consonants
│
├── Sound Practice
│
└── Phonetic Progress
```

### 7.2 Teaching Style

Do not teach phonetics like an academic linguistics course.

Each sound lesson should be highly visual and practical.

Recommended elements:

- IPA symbol;
- US audio as default;
- optional UK comparison where meaningful;
- mouth/tongue illustration or animation;
- example words;
- sound discrimination;
- minimal-pair practice where appropriate;
- listening exercise;
- speaking exercise;
- pronunciation evaluation.

Example structure:

> **/æ/**  
> Listen 🔊  
> Watch the mouth position  
> apple · cat · bag  
> Hear the sound  
> Say the sound  
> Record → Evaluate

### 7.3 Letter vs. Sound

One of the first concepts taught should be:

**Letter ≠ Sound**

The learner should understand that:

- a letter is a written symbol;
- a sound is what is pronounced;
- one letter can represent different sounds;
- different letters or letter combinations can sometimes represent the same sound.

---

## 8. SPEAKING & PRONUNCIATION EVALUATION

Speaking is not only one section. It is a **system-wide capability**.

It should be available inside:

- Learn;
- Words;
- Phonetic;
- Practice;
- Review.

### 8.1 Required Speaking Modes

#### Sound / Letter-Level Practice

The learner listens to a target sound or letter-related pronunciation and repeats it.

The system evaluates how close the pronunciation is to the target.

#### Word-Level Practice

Example:

> **friend**  
> Listen 🔊  
> Speak 🎤

The system should evaluate pronunciation and provide simple child-facing feedback.

#### Sentence-Level Practice

Example:

> **Nice to meet you.**  
> Listen 🔊  
> Read aloud 🎤

The system should evaluate the whole sentence.

### 8.2 Child-Facing Feedback

Do not expose technical scoring such as:

- phoneme accuracy 82.37;
- prosody 74.2;
- confidence 0.89.

The underlying system may use detailed metrics, but visible feedback should be simple.

Recommended feedback:

> 🌟 Great!  
> Pronunciation ★★★★☆  
> Try **meet** again.

Possible dimensions stored internally:

- pronunciation accuracy;
- completeness;
- fluency;
- stress;
- rhythm.

### 8.3 Default Accent

All target pronunciation and evaluation should use **US English as the default reference accent**.

UK pronunciation remains an optional comparison, primarily in the Words section.

---

## 9. PRACTICE-练习

Practice should reinforce content already learned elsewhere.

It should not introduce major new curriculum.

Recommended modes:

| Mode | Purpose |
|---|---|
| Listening | Understand words and sentences by ear |
| Speaking | Repeat and produce target language |
| Reading | Read and understand learned content |
| Words | Vocabulary recall |
| Pronunciation | Practice specific sounds |
| Mixed Challenge | Combine multiple learned skills |

### Reusable Activity Types

Keep the number of game/activity engines small and reusable.

Recommended initial set:

1. Picture Match
2. Listen and Choose
3. Word Builder
4. Memory Match
5. Quick Review
6. Speak and Repeat

The content changes by unit, but the interaction system stays consistent.

---

## 10. PROGRESS-学习进度

Progress should track more than textbook completion.

### 10.1 Course Progress

Example:

> Unit 1 — Let’s be friends!  
> 80% complete

### 10.2 Vocabulary Progress

Example:

- 18 Mastered
- 7 Learning
- 3 Needs Review

### 10.3 Pronunciation Progress

Track progress across:

- sounds;
- words;
- sentences;
- listening discrimination;
- speaking accuracy.

### 10.4 Review History

The system should remember:

- recent mistakes;
- frequently incorrect words;
- difficult sounds;
- difficult sentences;
- items that require repeated review.

This information should influence future daily learning.

---

## 11. REWARD SYSTEM

Rewards should support learning rather than distract from it.

Recommended reward types:

- stars;
- badges;
- streaks;
- unit completion;
- vocabulary milestones;
- pronunciation milestones.

Example badges:

- **First 10 Words** — Master 10 words
- **Perfect Listener** — Complete a listening activity without mistakes
- **Clear Speaker** — Achieve strong pronunciation results five times
- **Unit 1 Master** — Complete Unit 1
- **Sound Explorer** — Complete ten phonetic lessons

Avoid:

- public rankings;
- punishment for broken streaks;
- excessive timers;
- aggressive competition;
- rewards for meaningless clicking.

---

## 12. ADAPTIVE REVIEW SYSTEM

The website should remember what the learner finds difficult.

Example:

If the learner repeatedly struggles with:

- friend;
- meet;
- /æ/;
- a sentence such as “Nice to meet you”;

those items should appear again in:

- Home → Review Today;
- Practice;
- Unit Review;
- Words → Needs Review;
- Phonetic → Recommended Practice.

Recommended logic:

```text
Learn
  ↓
Practice
  ↓
Correct? ── Yes → Increase mastery
  │
  No
  ↓
Needs Review
  ↓
Reappear later
```

This adaptive review system is one of the key advantages of the website over the printed textbook.

---

## 13. CONNECTION BETWEEN WEBSITE SECTIONS

The sections must behave as one integrated learning system.

Example using the word **friend**:

```text
Unit 1
  ↓
friend
  ├── Words
  │    ├── US IPA + US audio
  │    └── UK IPA + UK audio
  │
  ├── Speaking
  │    └── pronunciation evaluation
  │
  ├── Phonetic
  │    └── related sounds
  │
  └── Review
       └── appears again if learner struggles
```

A word encountered in Learn should automatically connect to its Words entry.

A pronunciation result should contribute to Progress.

A weak word or sound should automatically enter Review.

A difficult phoneme should be linked to the relevant Phonetic lesson.

---

## 14. VERSION 1 SCOPE

### Build Now

#### Home-首页
- current learning;
- Continue button;
- Today’s Learning;
- Review Today;
- reward summary.

#### Unit 1 — Let’s be friends!
- Learn;
- Listen;
- Speak;
- Read / Story;
- Practice;
- Review;
- progress tracking.

#### Words-单词
- complete data model;
- vocabulary from textbook pages 86–92;
- Chinese meaning;
- US IPA;
- UK IPA;
- **US default audio**;
- UK alternative audio;
- example sentence;
- speaking practice;
- pronunciation evaluation;
- learning status.

#### Phonetic-音标
- full information architecture;
- introductory lessons;
- vowels;
- consonants;
- basic pronunciation exercises;
- speaking evaluation.

#### Practice-练习
- listening;
- speaking;
- vocabulary;
- pronunciation;
- mixed review.

#### Progress-学习进度
- Unit 1 progress;
- vocabulary progress;
- pronunciation progress;
- rewards;
- review history.

### Build Later

- full implementation of Units 2–6;
- richer adaptive learning;
- more advanced speech analysis;
- additional games;
- more sophisticated story interactions.

---

## 15. VISUAL DESIGN GUIDELINE

### Overall Style

**Child-friendly, but not childish.**

Reference direction:

- modern educational application;
- interactive storybook;
- contemporary textbook.

### Typography

Use:

- large headings;
- highly legible sans-serif fonts;
- generous line spacing;
- strong distinction between English and Chinese support text.

English learning content should remain visually dominant.

Chinese should function as support.

### Layout

Prefer:

- cards;
- clear white space;
- one primary action;
- consistent placement of audio and record buttons;
- predictable navigation;
- tablet-friendly and desktop-friendly layouts.

### Interaction

Use consistent symbols:

- 🔊 = listen
- 🎤 = speak / record
- ⭐ = achievement
- ✓ = completed
- ↻ = retry
- ? = hint

Do not change interaction patterns unnecessarily between sections.

### Motion

Animation should:

- confirm successful actions;
- support understanding;
- make transitions pleasant.

Animation should not:

- distract from English;
- delay learning;
- appear constantly;
- create visual overload.

---

## 16. AUDIO & PRONUNCIATION STANDARD

This rule applies throughout the product:

> **US English pronunciation is the default audio and pronunciation target.**

### Default

- US audio plays when the learner taps the main Listen button.
- US pronunciation is used in listening exercises.
- US pronunciation is used for sentence narration.
- US pronunciation is the default target for speech evaluation.
- US IPA is displayed first.

### UK Alternative

UK English should remain available where appropriate.

Recommended presentation:

```text
Pronunciation

🇺🇸 US  /.../  🔊  Default
🇬🇧 UK  /.../  🔊
```

Do not force the learner to switch between accents during ordinary exercises.

---

## 17. DEVELOPMENT PRINCIPLE

Do not develop the website as six independent textbook units.

Develop a **reusable learning engine** first.

The Unit 1 prototype should establish reusable components such as:

- vocabulary card;
- audio player;
- speaking recorder;
- pronunciation evaluator;
- listening question;
- story scene;
- word detail page;
- phonetic lesson;
- review card;
- progress indicator;
- reward badge.

Once these components are reliable, the remaining textbook units should primarily become a content-expansion task rather than a redesign task.

---

## 18. Current Product Definition

The website can now be summarized as:

> A self-learning English platform for a Grade 3 learner, based on the official textbook curriculum, using Unit 1 as the first complete prototype and combining textbook learning, a complete vocabulary library, systematic phonetic instruction, US-default pronunciation audio, speaking evaluation, adaptive review, progress tracking, and lightweight rewards in a modern child-friendly interface.

This document should be treated as the current baseline guideline. Future design decisions should update or extend this guideline rather than creating a separate conflicting structure.
