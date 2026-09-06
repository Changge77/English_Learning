import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Home as HomeIcon,
  BookOpen,
  Library,
  AudioLines,
  Puzzle,
  ChartNoAxesCombined,
  Settings,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Check,
  Star,
  Flame,
  Search,
  ChevronRight,
  RotateCcw,
  Download,
  Upload,
  Leaf,
  Clock,
  Lock,
  Menu,
  X,
  Headphones,
  CheckCircle2,
  Play,
  Bookmark,
  Heart,
  Sun,
  Flower2,
  ShieldCheck,
} from "lucide-react";
import { words, groupNames, emojiMap } from "./vocabulary.mjs";
import { lessons, units, alphabet, letterNames } from "./curriculum.mjs";
import { sounds, soundQuestions } from "./phonetics.mjs";
import { audioId, spokenWord } from "./audio-id.mjs";
import {
  freshState,
  STORAGE_KEY,
  answerResult,
  completeLesson,
  wordStatus,
  stars,
  streak,
  validateBackup,
  localDay,
} from "./progress.mjs";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/manrope";
import "./style.css";
type State = ReturnType<typeof freshState>;
type Word = (typeof words)[number];
type Question = {
  id: string;
  prompt: string;
  zh: string;
  options: string[];
  answer: number;
  explain: string;
  explainZh: string;
  word?: string;
  audio?: string;
  build?: boolean;
  picture?: string;
  passage?: string;
};
type Store = {
  state: any;
  setState: React.Dispatch<React.SetStateAction<any>>;
  notice: (s: string) => void;
};
const StoreContext = React.createContext<Store>(null!);
const useStore = () => React.useContext(StoreContext);
const B = ({
  en,
  zh,
  inline = false,
}: {
  en: string;
  zh: string;
  inline?: boolean;
}) => (
  <span className={inline ? "bi inline" : "bi"}>
    <span lang="en">{en}</span>
    <span lang="zh-CN" className="zh">
      {zh}
    </span>
  </span>
);
const go = (path: string) => {
  location.hash = "/" + path;
};
const wordByText = (t: string) => words.find((w) => w.text === t);
const wordIds = words.map((w) => w.id),
  lessonIds = lessons.map((l) => l.id),
  soundIds = sounds.map((s) => s.id);
function validated(raw: any) {
  return validateBackup(raw, wordIds, lessonIds, soundIds);
}
let storageMessage = "";
function readState() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? validated(JSON.parse(s)) : freshState();
  } catch {
    storageMessage =
      "Saved progress could not be loaded. Import a backup if you have one. · 无法读取学习进度，如有备份请导入。";
    return freshState();
  }
}
let activeAudio: HTMLAudioElement | null = null;
function stopAudio() {
  activeAudio?.pause();
  activeAudio = null;
  window.dispatchEvent(new Event("garden-audio-stop"));
}
function AudioButton({
  text,
  accent = "us",
  label,
  zh,
  onPlayed,
  compact = false,
}: {
  text: string;
  accent?: string;
  label?: string;
  zh?: string;
  onPlayed?: () => void;
  compact?: boolean;
}) {
  const { state, notice } = useStore();
  const [busy, setBusy] = useState(false),
    [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const stop = () => {
      setPlaying(false);
      setBusy(false);
    };
    window.addEventListener("garden-audio-stop", stop);
    return () => {
      window.removeEventListener("garden-audio-stop", stop);
      ref.current?.pause();
    };
  }, []);
  async function play() {
    if (playing) {
      stopAudio();
      return;
    }
    stopAudio();
    setBusy(true);
    const a = new Audio(
      `${import.meta.env.BASE_URL}audio/${audioId(text, accent)}.mp3`,
    );
    ref.current = a;
    activeAudio = a;
    a.playbackRate = state.settings.slow ? 0.78 : 1;
    a.onended = () => setPlaying(false);
    a.onerror = () => {
      setBusy(false);
      setPlaying(false);
      notice(
        "Audio could not load. Check your connection and try again. · 音频加载失败，请检查网络后重试。",
      );
    };
    try {
      await a.play();
      setBusy(false);
      setPlaying(true);
      onPlayed?.();
    } catch {
      setBusy(false);
      notice(
        "Tap to retry audio. Check your connection or device volume. · 请点击重试音频，检查网络或设备音量。",
      );
    }
  }
  return (
    <button
      className={`audio ${compact ? "compact" : ""} ${playing ? "playing" : ""}`}
      onClick={play}
      aria-label={`${label || "Listen"} · ${zh || "听音"} ${compact ? text : ""}`}
      aria-pressed={playing}
      disabled={busy}
    >
      <Volume2 size={18} />
      {!compact && (
        <B
          en={busy ? "Loading…" : playing ? "Stop" : label || "Listen"}
          zh={busy ? "加载中" : playing ? "停止" : zh || "听音"}
        />
      )}
    </button>
  );
}
function Bar({ value }: { value: number }) {
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-label="Progress · 学习进度"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
    >
      <span style={{ width: `${value}%` }} />
    </div>
  );
}
function Title({
  eyebrow,
  en,
  zh,
  description,
  children,
}: {
  eyebrow?: string;
  en: string;
  zh: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="page-title">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>
          {en}
          <span lang="zh-CN">{zh}</span>
        </h1>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  );
}
function GardenArt() {
  return (
    <svg
      className="garden-art"
      viewBox="0 0 500 330"
      role="img"
      aria-label="Friends reading together in a garden · 朋友们在花园里一起读书"
    >
      <defs>
        <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#648873" opacity=".2" />
        </pattern>
      </defs>
      <path d="M50 290V151a158 158 0 01316 0v139" fill="#e5edcf" />
      <path d="M50 290V151a158 158 0 01316 0v139" fill="url(#dots)" />
      <circle cx="354" cy="63" r="30" fill="#f4c85c" />
      <path
        d="M47 278c-10-30-42-71-19-80s39 25 43 44c-2-41 13-72 32-58s-3 59-17 85"
        fill="#719780"
      />
      <path
        d="M373 285c-12-48 17-94 38-83s-5 42-23 58c30-34 52-35 59-19s-29 41-57 43"
        fill="#37664e"
      />
      <ellipse
        cx="235"
        cy="292"
        rx="185"
        ry="16"
        fill="#38654f"
        opacity=".13"
      />
      <rect
        x="129"
        y="83"
        width="103"
        height="74"
        rx="17"
        fill="#fffdf5"
        transform="rotate(-10 129 83)"
      />
      <text
        x="151"
        y="130"
        fontSize="29"
        fontWeight="700"
        fill="#35674e"
        transform="rotate(-10 129 83)"
      >
        Hello!
      </text>
      <path d="M184 154l7 16 12-21" fill="#fffdf5" />
      <path
        d="M155 200c-30 0-47 27-47 79h112c0-52-22-79-65-79"
        fill="#da8e72"
      />
      <ellipse cx="163" cy="174" rx="40" ry="44" fill="#eec3a0" />
      <path
        d="M124 173c-15-66 79-67 80-3-23-5-33-19-38-26-8 15-26 23-42 29"
        fill="#3a4237"
      />
      <circle cx="150" cy="174" r="3" fill="#363d31" />
      <circle cx="178" cy="174" r="3" fill="#363d31" />
      <path
        d="M156 189q9 8 17-1"
        stroke="#9d5942"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M297 200c-35 0-54 28-54 79h112c0-55-20-79-58-79"
        fill="#6e91ad"
      />
      <path d="M257 173c-8-61 91-59 82 11l8 33-97-7" fill="#4f372e" />
      <ellipse cx="296" cy="174" rx="35" ry="42" fill="#dca17b" />
      <path
        d="M260 165c4-40 66-49 75 0-22-4-40-12-47-22-7 12-18 19-28 22"
        fill="#4f372e"
      />
      <circle cx="284" cy="174" r="3" fill="#36352a" />
      <circle cx="310" cy="174" r="3" fill="#36352a" />
      <path
        d="M289 188q8 7 15-1"
        stroke="#854b39"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M158 234l72 10 70-13-9 57-61 10-65-15Z"
        fill="#fffaf0"
        stroke="#38654f"
        strokeWidth="3"
      />
      <path
        d="M230 247v48m-57-44 42 7m-41 7 37 6m32-14 40-9m-41 21 35-7"
        stroke="#97b299"
        strokeWidth="3"
      />
      <ellipse
        cx="163"
        cy="255"
        rx="12"
        ry="17"
        fill="#eec3a0"
        transform="rotate(-20 163 255)"
      />
      <ellipse
        cx="296"
        cy="253"
        rx="12"
        ry="17"
        fill="#dca17b"
        transform="rotate(20 296 253)"
      />
      <rect
        x="328"
        y="97"
        width="89"
        height="64"
        rx="15"
        fill="#f9e7b3"
        transform="rotate(9 328 97)"
      />
      <text
        x="344"
        y="139"
        fontSize="27"
        fontWeight="650"
        fill="#88663d"
        transform="rotate(9 328 97)"
      >
        你好!
      </text>
      <path d="M384 162l-5 15-10-19" fill="#f9e7b3" />
      <path
        d="M82 82v18m-9-9h18m343 79v14m-7-7h14"
        stroke="#b4975f"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
const nav = [
  ["", "Home", "首页", HomeIcon],
  ["learn", "Learn", "课程", BookOpen],
  ["words", "Words", "单词", Library],
  ["phonetic", "Phonetic", "音标", AudioLines],
  ["practice", "Practice", "练习", Puzzle],
  ["progress", "Progress", "学习进度", ChartNoAxesCombined],
] as const;
function App() {
  const [state, reactSetState] = useState(readState),
    [route, setRoute] = useState(location.hash.replace(/^#\/?/, "") || ""),
    [toast, setToast] = useState(""),
    [menu, setMenu] = useState(false),
    [storageError, setStorageError] = useState(storageMessage);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const stateRef = useRef(state);
  const setState: React.Dispatch<React.SetStateAction<any>> = (action) => {
    const next =
      typeof action === "function" ? action(stateRef.current) : action;
    stateRef.current = next;
    try {
      if (!storageMessage)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      setStorageError(
        "Progress cannot be saved. Export a backup. · 无法保存进度，请导出备份。",
      );
    }
    reactSetState(next);
  };
  const notice = (s: string) => {
    setToast(s);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 6500);
  };
  useEffect(() => {
    const change = () => {
      stopAudio();
      setRoute(location.hash.replace(/^#\/?/, ""));
      setMenu(false);
      window.scrollTo(0, 0);
      document.getElementById("main")?.focus();
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  const top = route.split("/")[0];
  const activeTop = top === "lesson" ? "learn" : top;
  const current = nav.find((n) => n[0] === activeTop);
  const date = new Date();
  return (
    <StoreContext.Provider value={{ state, setState, notice }}>
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content · 跳到正文
      </a>
      <div className="app-shell">
        <aside className={`sidebar ${menu ? "open" : ""}`}>
          <a href="#/" className="brand">
            <span className="brand-mark">
              <Leaf size={27} />
            </span>
            <span>
              English Garden<small>英语花园</small>
            </span>
          </a>
          <div className="sidebar-label">
            GROW A LITTLE EVERY DAY<span>每天进步一点点</span>
          </div>
          <nav aria-label="Main navigation · 主导航">
            {nav.map(([path, en, zh, Icon]) => (
              <a
                key={path}
                href={`#/${path}`}
                className={activeTop === path ? "active" : ""}
                aria-current={activeTop === path ? "page" : undefined}
              >
                <Icon size={21} />
                <B en={en} zh={zh} />
                {activeTop === path && <span className="nav-dot" />}
              </a>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="grow-card">
              <Flower2 size={28} />
              <B en="Your own little journey" zh="属于你的小小旅程" />
              <p>
                One word at a time.
                <br />
                从一个单词开始。
              </p>
            </div>
            <a
              className={
                top === "settings" ? "settings-link active" : "settings-link"
              }
              href="#/settings"
            >
              <Settings size={20} />
              <B en="Settings" zh="设置" />
            </a>
            <span className="grade">GRADE 3 · 三年级上册</span>
          </div>
        </aside>
        <div className="main-shell">
          <header className="topbar">
            <div className="crumb">
              <button
                className="menu-button"
                onClick={() => setMenu(!menu)}
                aria-label="Toggle menu · 开关菜单"
              >
                {menu ? <X /> : <Menu />}
              </button>
              <span>
                My learning space <span className="muted">· 我的学习空间</span>
              </span>
              <ChevronRight size={15} />
              <strong>
                {current ? `${current[1]} · ${current[2]}` : "Settings · 设置"}
              </strong>
            </div>
            <div className="top-tools">
              <span className="accent-tag">
                <Volume2 size={15} /> US · 美式
              </span>
              <span className="star-tag">
                <Star size={18} />
                {stars(state)}
              </span>
              <span className="avatar" aria-label="Learner · 学习者">
                🌱
              </span>
            </div>
          </header>
          <main id="main" tabIndex={-1}>
            {storageError && (
              <div className="warning" role="alert">
                {storageError}
                <button onClick={() => go("settings")}>Backup · 备份</button>
              </div>
            )}
            {top === "" ? (
              <HomePage />
            ) : top === "learn" ? (
              <LearnPage />
            ) : top === "lesson" ? (
              <LessonPage key={route} id={route.split("/")[1]} />
            ) : top === "words" ? (
              route.split("/")[1] ? (
                <WordPage key={route} id={route.split("/")[1]} />
              ) : (
                <WordsPage />
              )
            ) : top === "phonetic" ? (
              <PhoneticPage />
            ) : top === "practice" ? (
              <PracticePage key={route} mode={route.split("/")[1]} />
            ) : top === "progress" ? (
              <ProgressPage />
            ) : top === "settings" ? (
              <SettingsPage
                onRestore={() => {
                  storageMessage = "";
                  setStorageError("");
                }}
              />
            ) : (
              <div className="empty">
                <B en="This page has wandered off." zh="这个页面走丢啦。" />
                <button onClick={() => go("")}>Home · 首页</button>
              </div>
            )}
            <footer>
              English Garden · 英语花园{" "}
              <span>
                Little steps, lasting learning. · 小小进步，慢慢成长。
              </span>
            </footer>
          </main>
        </div>
      </div>
      {toast && (
        <div className="toast" role="status">
          {toast}
          <button onClick={() => setToast("")} aria-label="Dismiss · 关闭">
            <X size={16} />
          </button>
        </div>
      )}
    </StoreContext.Provider>
  );
}
function HomePage() {
  const { state } = useStore();
  const count = state.completed.length;
  const pct = Math.round((count / lessons.length) * 100);
  const due = words.filter(
    (w) => wordStatus(state.wordProgress[w.id]) === "review",
  );
  const resume =
    lessons.find((l) => l.id === state.resume.lesson) || lessons[0];
  const mastered = words.filter(
    (w) => wordStatus(state.wordProgress[w.id]) === "mastered",
  ).length;
  return (
    <>
      <Title
        eyebrow="A FRESH PAGE, A NEW POSSIBILITY · 新的一页，新的可能"
        en="A little English, every day."
        zh="每天一点英语，慢慢收获成长。"
      >
        <span className="today">
          <Sun size={19} />
          {new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
          <small>
            {new Date().toLocaleDateString("zh-CN", { weekday: "long" })}
          </small>
        </span>
      </Title>
      <section className="hero">
        <div className="hero-copy">
          <span className="pill">
            <span className="tiny-dot" /> UNIT 01 · 第一单元
          </span>
          <h2>Let's be friends!</h2>
          <p className="hero-cn">让我们成为朋友！</p>
          <p>
            Every friendship starts with a hello.
            <br />
            <span lang="zh-CN">从一声“你好”，开启你的英语旅程。</span>
          </p>
          <button className="primary" onClick={() => go(`lesson/${resume.id}`)}>
            <B
              en={count ? "Continue Learning" : "Start Learning"}
              zh={count ? "继续学习" : "开始学习"}
            />
            <ArrowRight size={19} />
          </button>
          <div className="hero-progress">
            <Bar value={pct} />
            <span>
              {count}/{lessons.length} lessons · 课时
            </span>
          </div>
        </div>
        <GardenArt />
      </section>
      <div className="stats-strip">
        <div>
          <span className="stat-icon mint">
            <BookOpen />
          </span>
          <div>
            <strong>
              {count}
              <small> / {lessons.length}</small>
            </strong>
            <B en="Lessons completed" zh="已完成课时" />
          </div>
        </div>
        <div>
          <span className="stat-icon sand">
            <Library />
          </span>
          <div>
            <strong>{mastered}</strong>
            <B en="Words mastered" zh="已掌握单词" />
          </div>
        </div>
        <div>
          <span className="stat-icon peach">
            <Flame />
          </span>
          <div>
            <strong>
              {streak(state)}
              <small> days · 天</small>
            </strong>
            <B en="Learning streak" zh="连续学习" />
          </div>
        </div>
      </div>
      <div className="home-columns">
        <section className="panel daily">
          <div className="section-heading">
            <div>
              <h2>
                Today's little plan <span>今日小计划</span>
              </h2>
              <p>A little practice goes a long way. · 每次练习，都有收获。</p>
            </div>
            <span className="round-icon">
              <Sun size={20} />
            </span>
          </div>
          <PlanRow
            num="01"
            icon={<BookOpen />}
            title={resume.title}
            zh={resume.zh}
            meta={`${resume.minutes} min · 分钟`}
            onClick={() => go(`lesson/${resume.id}`)}
          />
          <PlanRow
            num="02"
            icon={<RotateCcw />}
            title={
              due.length
                ? `Review ${Math.min(due.length, 8)} words`
                : "Grow your word collection"
            }
            zh={
              due.length
                ? `复习 ${Math.min(due.length, 8)} 个单词`
                : "丰富你的单词收藏"
            }
            meta="3 min · 分钟"
            onClick={() => go(due.length ? "practice/review" : "words")}
          />
          <PlanRow
            num="03"
            icon={<AudioLines />}
            title="Explore a new sound"
            zh="探索一个新声音"
            meta="2 min · 分钟"
            onClick={() => go("phonetic")}
          />
        </section>
        <section className="sound-spotlight">
          <div className="eyebrow">SOUND OF THE DAY · 今日音标</div>
          <div className="sound-symbol">
            /æ/<span>as in apple · 如 apple 中的发音</span>
          </div>
          <div className="sound-apple">🍎</div>
          <p>
            A little sound. A whole new world.
            <br />
            一个小小发音，打开新的世界。
          </p>
          <button className="text-button" onClick={() => go("phonetic")}>
            Explore sounds · 探索音标 <ArrowRight size={17} />
          </button>
        </section>
      </div>
      <section>
        <div className="section-heading">
          <h2>
            Your learning paths <span>你的学习路线</span>
          </h2>
          <a href="#/learn">
            View all · 查看全部 <ArrowRight size={16} />
          </a>
        </div>
        <div className="path-grid">
          {units.slice(0, 3).map((u, i) => (
            <button
              key={i}
              className={`path-card ${u[3]}`}
              onClick={() => (i === 0 ? go("learn") : go("learn"))}
            >
              <span className="path-emoji">{u[4]}</span>
              <small>
                UNIT 0{i + 1} · 第{i + 1}单元
              </small>
              <h3>{u[0]}</h3>
              <p>{u[1]}</p>
              <div className="path-bottom">
                {i === 0 ? (
                  <span>Ready to explore · 开始探索</span>
                ) : (
                  <span>
                    <Lock size={12} /> Coming later · 敬请期待
                  </span>
                )}
                <ChevronRight size={18} />
              </div>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
function PlanRow({
  num,
  icon,
  title,
  zh,
  meta,
  onClick,
}: {
  num: string;
  icon: React.ReactNode;
  title: string;
  zh: string;
  meta: string;
  onClick: () => void;
}) {
  return (
    <button className="plan-row" onClick={onClick}>
      <span className="plan-number">{num}</span>
      <span className="plan-icon">{icon}</span>
      <B en={title} zh={zh} />
      <span className="plan-meta">{meta}</span>
      <ChevronRight size={17} />
    </button>
  );
}
function LearnPage() {
  const { state } = useStore();
  return (
    <>
      <Title
        eyebrow="YOUR LEARNING JOURNEY · 你的学习旅程"
        en="One unit. Many discoveries."
        zh="一个单元，许多新发现。"
        description="Follow the path at your own pace. · 按照自己的节奏，一步步学习。"
      />
      <div className="unit-banner">
        <span>🤝</span>
        <div>
          <div className="eyebrow">UNIT 01 · 第一单元</div>
          <h2>Let's be friends! · 让我们成为朋友！</h2>
          <p>
            Greetings, introductions, and being a good friend. ·
            问候、介绍自己，学做一个好朋友。
          </p>
        </div>
        <div className="unit-pct">
          {Math.round((state.completed.length / lessons.length) * 100)}%
          <small>Complete · 已完成</small>
        </div>
      </div>
      <div className="lesson-grid">
        {lessons.map((l, i) => (
          <a
            key={l.id}
            href={`#/lesson/${l.id}`}
            className={`lesson-card ${state.completed.includes(l.id) ? "done" : ""}`}
          >
            <div className="lesson-card-top">
              <span className="lesson-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="badge">{l.type}</span>
              {state.completed.includes(l.id) && <CheckCircle2 size={20} />}
            </div>
            <span className="lesson-emoji">{l.icon}</span>
            <h3>{l.title}</h3>
            <p>{l.zh}</p>
            <div className="lesson-card-bottom">
              <span>
                <Clock size={14} /> {l.minutes} min · 分钟
              </span>
              <ArrowRight size={18} />
            </div>
          </a>
        ))}
      </div>
      <div className="section-heading">
        <h2>
          More adventures ahead <span>更多旅程，敬请期待</span>
        </h2>
      </div>
      <div className="future-grid">
        {units.slice(1).map((u, i) => (
          <div className="future-card" key={u[0]}>
            <span>{u[4]}</span>
            <small>
              Unit {i + 2} · 第{i + 2}单元
            </small>
            <h3>{u[0]}</h3>
            <p>{u[1]}</p>
            <span className="muted">
              <Lock size={13} /> Coming later · 敬请期待
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
function Meaning({ en, zh }: { en: string; zh: string }) {
  const { state } = useStore();
  const [show, setShow] = useState(state.settings.showChinese);
  return (
    <div className="meaning">
      <p>{en}</p>
      {show ? (
        <p lang="zh-CN" className="muted">
          {zh}
        </p>
      ) : (
        <button className="text-button" onClick={() => setShow(true)}>
          Show meaning · 显示中文释义
        </button>
      )}
    </div>
  );
}
function Status({ word }: { word: Word }) {
  const { state } = useStore();
  const status = wordStatus(state.wordProgress[word.id]);
  return (
    <span className={`status ${status}`}>
      {
        (
          {
            new: "New · 未学习",
            learning: "Learning · 学习中",
            mastered: "Mastered · 已掌握",
            review: "Needs review · 待复习",
          } as any
        )[status]
      }
    </span>
  );
}
function WordTile({ word }: { word: Word }) {
  return (
    <div className="word-tile">
      <a href={`#/words/${word.id}`}>
        <span className="word-emoji">
          {(emojiMap as any)[word.text] || "✦"}
        </span>
        <h3>{word.text}</h3>
        <p className="ipa">/{word.us}/</p>
        <p lang="zh-CN">{word.zh}</p>
      </a>
      <div className="word-tile-bottom">
        <Status word={word} />
        <AudioButton text={spokenWord(word.text)} compact />
      </div>
    </div>
  );
}
function WordsPage() {
  const { state } = useStore();
  const [search, setSearch] = useState(""),
    [unit, setUnit] = useState("all"),
    [filter, setFilter] = useState("all");
  const visible = words.filter(
    (w) =>
      (unit === "all" || String(w.unit) === unit) &&
      (filter === "all" || wordStatus(state.wordProgress[w.id]) === filter) &&
      `${w.text} ${w.zh} ${w.text.replace("colour", "color")}`
        .toLowerCase()
        .includes(search.toLowerCase().trim()),
  );
  return (
    <>
      <Title
        eyebrow="WORDS THAT OPEN WORLDS · 用单词认识世界"
        en="Your word garden"
        zh="你的单词花园"
        description={`${words.length} words, expressions, and names · ${words.length} 个单词、短语与专有名词`}
      >
        <button className="secondary" onClick={() => go("practice/flashcards")}>
          <RotateCcw size={18} />
          <B en="Flashcards" zh="单词卡片" />
        </button>
      </Title>
      <div className="filters">
        <label className="search-box">
          <Search size={20} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search words or Chinese · 搜索单词或中文"
            aria-label="Search vocabulary · 搜索词汇"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search · 清除搜索"
            >
              <X size={15} />
            </button>
          )}
        </label>
        <select
          aria-label="Unit filter · 单元筛选"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        >
          <option value="all">All units · 全部单元</option>
          {groupNames.map((n, i) => (
            <option key={n} value={i}>
              {n}
            </option>
          ))}
        </select>
      </div>
      <div className="tabs" role="group" aria-label="Learning state · 学习状态">
        {[
          ["all", "All words · 全部"],
          ["new", "New · 未学习"],
          ["learning", "Learning · 学习中"],
          ["mastered", "Mastered · 已掌握"],
          ["review", "Needs review · 待复习"],
        ].map(([v, t]) => (
          <button
            className={filter === v ? "selected" : ""}
            key={v}
            onClick={() => setFilter(v)}
            aria-pressed={filter === v}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="results-line">
        {visible.length} results · 条结果{" "}
        <span>US first, UK alongside · 美式优先，英式对照</span>
      </div>
      {visible.length ? (
        <div className="word-grid">
          {visible.map((w) => (
            <WordTile key={w.id} word={w} />
          ))}
        </div>
      ) : (
        <Empty
          en="No words here yet"
          zh="这里暂时没有单词"
          detail="Try another search or filter. · 试试其他搜索或筛选条件。"
        />
      )}
      <p className="source-note">
        Textbook vocabulary: pp. 86–92; repeated alphabetical entries are
        combined. Examples are written for this companion. ·
        教材词汇来自第86–92页，字母表中的重复词条已合并，例句为本网站编写。
      </p>
    </>
  );
}
function WordPage({ id }: { id: string }) {
  const w = words.find((w) => w.id === id);
  const { state, setState, notice } = useStore();
  useEffect(() => {
    if (w)
      setState((s: any) => ({
        ...s,
        seen: [...new Set([...s.seen, w.id])],
        wordProgress: {
          ...s.wordProgress,
          [w.id]: s.wordProgress[w.id] || {
            level: 0,
            due: Date.now() + 86400000,
            weak: false,
            lastSuccess: "",
          },
        },
      }));
  }, [id]);
  if (!w) return <Empty en="Word not found" zh="没有找到这个单词" />;
  const related = sounds.filter(
    (s) => s.accent === "us" && (s.example === w.text || s.other === w.text),
  );
  return (
    <>
      <button className="back" onClick={() => go("words")}>
        <ArrowLeft size={17} /> All words · 全部单词
      </button>
      <div className="word-detail panel">
        <div className="word-detail-top">
          <span className="eyebrow">{groupNames[w.unit]}</span>
          <Status word={w} />
        </div>
        <div className="word-detail-body">
          <div className="detail-emoji">
            {(emojiMap as any)[w.text] || "🌱"}
          </div>
          <div>
            <h1>{w.text}</h1>
            <p className="word-meaning">{w.zh}</p>
            <div className="pronunciations">
              <div>
                <span>
                  US · 美式 <small>Default · 默认</small>
                </span>
                <strong className="ipa">/{w.us}/</strong>
                <AudioButton
                  text={spokenWord(w.text)}
                  label="US audio"
                  zh="美式发音"
                />
              </div>
              <div>
                <span>UK · 英式</span>
                <strong className="ipa">/{w.uk}/</strong>
                <AudioButton
                  text={spokenWord(w.text)}
                  accent="uk"
                  label="UK audio"
                  zh="英式发音"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="example-box">
          <div className="eyebrow">IN A SENTENCE · 放进句子里</div>
          <Meaning en={w.example} zh={w.exampleZh} />
          <AudioButton text={w.example} label="Listen to example" zh="听例句" />
        </div>
        <div className="row wrap">
          <button
            className="secondary"
            onClick={() => {
              setState((s: any) => ({
                ...s,
                wordProgress: {
                  ...s.wordProgress,
                  [w.id]: {
                    ...(s.wordProgress[w.id] || { level: 0, lastSuccess: "" }),
                    weak: true,
                    due: Date.now(),
                  },
                },
              }));
              notice("Added to your review list. · 已加入复习列表。");
            }}
          >
            <Bookmark size={17} /> Add to review · 加入复习
          </button>
          {related.length > 0 && (
            <a className="secondary" href="#/phonetic">
              <AudioLines size={18} /> Related sounds · 相关音标{" "}
              {related.map((s) => `/${s.ipa}/`).join(" ")}
            </a>
          )}
        </div>
        <p className="source-note">
          IPA shows common citation forms. Names and regional pronunciation may
          vary. “sb / sth” means somebody / something; its IPA shows the phrase
          stem. · 音标展示常用单独读音，名字和地区读音可能不同。sb / sth
          表示某人或某物，音标仅展示短语主体。
        </p>
      </div>
    </>
  );
}
function QuestionCard({
  question,
  onAnswer,
}: {
  question: Question;
  onAnswer: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null),
    [heard, setHeard] = useState(false),
    [built, setBuilt] = useState<number[]>([]);
  const [reported, setReported] = useState(false);
  const tokens = question.build ? question.options : [];
  const target = question.build ? question.explain : "";
  const correct = question.build
    ? built.map((i) => tokens[i]).join(" ") === target
    : picked === question.answer;
  function submit(i: number) {
    if (reported) return;
    setPicked(i);
    setReported(true);
    onAnswer(
      question.build
        ? built.map((n) => tokens[n]).join(" ") === target
        : i === question.answer,
    );
  }
  return (
    <div className="question">
      <span className="eyebrow">YOUR TURN · 轮到你啦</span>
      <h2>
        <B en={question.prompt} zh={question.zh} />
      </h2>
      {question.passage && (
        <div className="reading-passage">
          <div className="eyebrow">READ FIRST · 先读一读</div>
          <p>{question.passage}</p>
        </div>
      )}
      {question.picture && (
        <div className="picture-prompt" aria-label="Picture clue · 图片线索">
          {question.picture}
        </div>
      )}
      {question.audio && (
        <div className="listen-question">
          <AudioButton
            text={question.audio}
            onPlayed={() => setHeard(true)}
            label="Play question"
            zh="播放题目"
          />
          {!heard && <p>Listen before choosing. · 请先听音，再作答。</p>}
        </div>
      )}
      {question.build ? (
        <>
          <div className="built-sentence" aria-live="polite">
            {built.map((i, j) => (
              <button
                key={j}
                disabled={reported}
                onClick={() => setBuilt(built.filter((_, k) => k !== j))}
              >
                {tokens[i]} <X size={12} />
              </button>
            ))}
            {!built.length && <span>Tap words in order · 按顺序点击单词</span>}
          </div>
          <div className="token-bank">
            {tokens.map((t, i) => (
              <button
                key={i}
                disabled={reported || built.includes(i)}
                onClick={() => setBuilt([...built, i])}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            className="primary"
            disabled={reported || built.length !== tokens.length}
            onClick={() => submit(0)}
          >
            Check answer · 检查答案
          </button>
        </>
      ) : (
        <div className="answers">
          {question.options.map((o, i) => (
            <button
              key={i}
              disabled={reported || (!!question.audio && !heard)}
              className={
                reported
                  ? i === question.answer
                    ? "correct"
                    : i === picked
                      ? "incorrect"
                      : ""
                  : ""
              }
              onClick={() => submit(i)}
            >
              <span className="answer-letter">{"ABCD"[i]}</span>
              {o}
              {reported && i === question.answer && <Check size={18} />}
            </button>
          ))}
        </div>
      )}
      {reported && (
        <div
          className={`feedback ${correct ? "success" : "retry"}`}
          role="status"
        >
          <strong>
            {correct
              ? "You got it! · 答对啦！"
              : "Let’s learn from this. · 一起来学一学。"}
          </strong>
          <B en={question.explain} zh={question.explainZh} />
        </div>
      )}
    </div>
  );
}
function LessonPage({ id }: { id: string }) {
  const { state, setState } = useStore();
  const lesson = lessons.find((l) => l.id === id);
  const [step, setStep] = useState(
      state.resume.lesson === id ? state.resume.step : 0,
    ),
    [answered, setAnswered] = useState(false),
    [finished, setFinished] = useState(false);
  const [heardLetters, setHeardLetters] = useState<string[]>([]);
  const [projectReady, setProjectReady] = useState(false);
  if (!lesson) return <Empty en="Lesson not found" zh="没有找到这个课时" />;
  const ws = (lesson.wordTexts || []).map(wordByText).filter(Boolean) as Word[];
  const cards = lesson.cards;
  const special = id === "alphabet" || id === "project";
  const teachCount = special ? 1 : ws.length || cards.length;
  const total = teachCount + lesson.questions.length;
  const currentStep = Math.min(step, Math.max(total - 1, 0));
  const question = lesson.questions[currentStep - teachCount] as
    Question | undefined;
  useEffect(() => {
    setState((s: any) => ({ ...s, resume: { lesson: id, step: currentStep } }));
    setAnswered(false);
  }, [id, currentStep]);
  function advance() {
    stopAudio();
    if (ws[currentStep]) {
      const w = ws[currentStep];
      setState((s: any) => ({
        ...s,
        seen: [...new Set([...s.seen, w.id])],
        wordProgress: {
          ...s.wordProgress,
          [w.id]: s.wordProgress[w.id] || {
            level: 0,
            due: Date.now() + 86400000,
            weak: false,
            lastSuccess: "",
          },
        },
      }));
    }
    if (currentStep < total - 1) {
      setState((s: any) => ({
        ...s,
        resume: { lesson: id, step: currentStep + 1 },
      }));
      setStep(currentStep + 1);
    } else {
      const next = lessons[lessons.indexOf(lesson!) + 1];
      setState((s: any) => ({
        ...completeLesson(s, id),
        resume: { lesson: next?.id || id, step: 0 },
      }));
      setFinished(true);
    }
  }
  if (finished)
    return (
      <div className="completion panel">
        <div className="completion-flower">🌻</div>
        <div className="eyebrow">A LITTLE MORE CONFIDENT · 又进步了一点</div>
        <h1>
          Beautifully done!<span>完成啦，真棒！</span>
        </h1>
        <p>
          {lesson.title} · {lesson.zh}
        </p>
        <div className="pill">
          <Star size={17} /> Lesson complete · 课时完成
        </div>
        <p>Every little step counts. · 每一个小小的进步都值得肯定。</p>
        <div className="row">
          <button className="secondary" onClick={() => go("learn")}>
            All lessons · 全部课程
          </button>
          <button
            className="primary"
            onClick={() =>
              go(id === "review" ? "progress" : `lesson/${state.resume.lesson}`)
            }
          >
            Continue · 继续 <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  return (
    <>
      <button className="back" onClick={() => go("learn")}>
        <ArrowLeft size={17} /> Unit 1 · 第一单元
      </button>
      <Title eyebrow={lesson.type} en={lesson.title} zh={lesson.zh} />
      <div className="lesson-progress">
        <Bar value={Math.round((currentStep / total) * 100)} />
        <span>
          {currentStep + 1}/{total} steps · 步骤
        </span>
      </div>
      <p className="lesson-intro">
        {lesson.intro}
        <br />
        <span lang="zh-CN">{lesson.introZh}</span>
      </p>
      <section className="lesson-stage panel" key={currentStep}>
        {question ? (
          <QuestionCard
            question={question}
            onAnswer={(correct) => {
              setAnswered(true);
              setState((s: any) =>
                answerResult(
                  s,
                  question.id,
                  correct,
                  wordByText(question.word || "")?.id || "",
                ),
              );
            }}
          />
        ) : id === "alphabet" ? (
          <>
            <div className="alphabet-grid">
              {alphabet.map((a, i) => (
                <div
                  key={a}
                  className={heardLetters.includes(a) ? "heard" : ""}
                >
                  <strong>
                    {a}
                    <span>{a.toLowerCase()}</span>
                  </strong>
                  <AudioButton
                    text={letterNames[i]}
                    compact
                    onPlayed={() =>
                      setHeardLetters([...new Set([...heardLetters, a])])
                    }
                  />
                </div>
              ))}
            </div>
            <p className="muted">
              Listen to at least 5 letters, then continue. A letter name is
              different from a sound. ·
              至少听5个字母后继续。字母名称与音素不同。
            </p>
            <span>{heardLetters.length}/26 heard · 已听</span>
          </>
        ) : id === "project" ? (
          <PostcardEditor onReady={setProjectReady} />
        ) : ws.length ? (
          <div className="lesson-word">
            <span className="big-emoji">
              {(emojiMap as any)[ws[currentStep].text] || "🌱"}
            </span>
            <h2>{ws[currentStep].text}</h2>
            <p className="ipa">/{ws[currentStep].us}/</p>
            <p>{ws[currentStep].zh}</p>
            <AudioButton text={spokenWord(ws[currentStep].text)} />
            <Meaning
              en={ws[currentStep].example}
              zh={ws[currentStep].exampleZh}
            />
          </div>
        ) : (
          <div className="teaching-card">
            <span className="big-emoji">
              {id === "story"
                ? ["🪁", "🙌", "🤝", "🌈"][currentStep]
                : lesson.icon}
            </span>
            <h2>{cards[currentStep].en}</h2>
            <Meaning
              en={cards[currentStep].note}
              zh={cards[currentStep].noteZh}
            />
            <p className="translation">{cards[currentStep].zh}</p>
            <AudioButton text={cards[currentStep].en} />
            {id === "repeat" && (
              <p className="hint">
                Say it aloud, then tap Next. · 大声说出来，然后点击下一步。
              </p>
            )}
          </div>
        )}
      </section>
      <div className="lesson-actions">
        <button
          className="secondary"
          disabled={currentStep === 0}
          onClick={() => {
            stopAudio();
            setStep(currentStep - 1);
          }}
        >
          <ArrowLeft size={17} /> Previous · 上一步
        </button>
        <button
          className="primary"
          disabled={
            question
              ? !answered
              : id === "alphabet"
                ? heardLetters.length < 5
                : id === "project"
                  ? !projectReady
                  : false
          }
          onClick={advance}
        >
          {currentStep === total - 1
            ? "Finish lesson · 完成课时"
            : "Next step · 下一步"}
          <ArrowRight size={18} />
        </button>
      </div>
    </>
  );
}
function PostcardEditor({ onReady }: { onReady?: (v: boolean) => void }) {
  const { state, setState, notice } = useStore();
  const p = state.postcard;
  const [saved, setSaved] = useState(false);
  const valid =
    p.name.trim().length > 0 && Number(p.age) > 0 && Number(p.age) <= 99;
  function change(k: string, v: string) {
    if (k === "age" && !/^\d{0,2}$/.test(v)) return;
    setState((s: any) => ({ ...s, postcard: { ...s.postcard, [k]: v } }));
    setSaved(false);
    onReady?.(false);
  }
  const pronoun = p.pronoun;
  const verb = pronoun === "They" ? "are" : "is";
  return (
    <div className="postcard-layout">
      <div className="postcard-form">
        <h2>
          <B en="Tell us about a friend" zh="介绍一位朋友" />
        </h2>
        <label>
          Name · 名字
          <input
            maxLength={40}
            value={p.name}
            onChange={(e) => change("name", e.target.value)}
            placeholder="A real or imaginary friend · 真实或想象中的朋友"
          />
        </label>
        <label>
          Age · 年龄
          <input
            type="number"
            min={1}
            max={99}
            value={p.age}
            onChange={(e) => change("age", e.target.value)}
          />
        </label>
        <label>
          Pronoun · 人称
          <select
            value={p.pronoun}
            onChange={(e) => change("pronoun", e.target.value)}
          >
            <option value="She">She · 她</option>
            <option value="He">He · 他</option>
            <option value="They">They · 他们</option>
          </select>
        </label>
        <label>
          From · 来自
          <select
            value={p.country}
            onChange={(e) => change("country", e.target.value)}
          >
            <option value="China">China · 中国</option>
            <option value="the UK">The UK · 英国</option>
            <option value="the USA">The USA · 美国</option>
          </select>
        </label>
        <label>
          Decoration · 装饰
          <select
            value={p.decoration}
            onChange={(e) => change("decoration", e.target.value)}
          >
            {["🌼", "🪁", "🌈", "🐈", "⭐"].map((d, i) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </label>
        <button
          className="primary"
          disabled={!valid}
          onClick={() => {
            setSaved(true);
            onReady?.(true);
            notice("Postcard saved on this device. · 明信片已保存在此设备。");
          }}
        >
          <Check size={17} />
          {saved ? "Saved · 已保存" : "Save postcard · 保存明信片"}
        </button>
      </div>
      <div className="postcard">
        <span className="postage">
          WITH LOVE
          <br />
          送给朋友 ♡
        </span>
        <span className="postcard-flower">{p.decoration}</span>
        <h3>
          My friends
          <br />
          <span>我的朋友</span>
        </h3>
        <p>
          {p.name || "…"} {verb} my friend.
        </p>
        <p>
          {pronoun} {verb} {p.age || "…"}.
        </p>
        <p>
          {pronoun} {verb} from {p.country}.
        </p>
        <p>We are friends!</p>
        <small>
          {p.name || "…"} 是我的朋友。
          <br />
          {pronoun === "She" ? "她" : pronoun === "He" ? "他" : "他们"}{" "}
          {p.age || "…"} 岁。我们是朋友！
        </small>
      </div>
    </div>
  );
}
function Empty({
  en,
  zh,
  detail,
}: {
  en: string;
  zh: string;
  detail?: string;
}) {
  return (
    <div className="empty">
      <Leaf size={40} />
      <h2>
        <B en={en} zh={zh} />
      </h2>
      {detail && <p>{detail}</p>}
      <a className="secondary" href="#/learn">
        Explore lessons · 探索课程 <ArrowRight size={17} />
      </a>
    </div>
  );
}
function Mouth({ open }: { open: number }) {
  return (
    <svg
      className="mouth"
      viewBox="0 0 160 120"
      role="img"
      aria-label="Mouth opening guide; schematic front view · 张口程度示意图，正面简图"
    >
      <ellipse cx="80" cy="60" rx="67" ry="50" fill="#f5dbc8" />
      <path
        d={`M30 58 Q80 ${28 - open * 5} 130 58 Q80 ${82 + open * 10} 30 58`}
        fill="#bd7064"
      />
      <ellipse
        cx="80"
        cy="60"
        rx="39"
        ry={open === 0 ? 1 : 9 + open * 4}
        fill="#633d3e"
      />
      {open > 0 && (
        <>
          <path d="M45 51q35-9 70 0v7H45Z" fill="#fff8e9" />
          <ellipse cx="80" cy={67 + open * 2} rx="23" ry="5" fill="#e6a3a0" />
        </>
      )}
    </svg>
  );
}
function PhoneticPage() {
  const { state, setState } = useStore();
  const [group, setGroup] = useState("All"),
    [selected, setSelected] = useState("s3"),
    [heard, setHeard] = useState(false);
  const sound = sounds.find((s) => s.id === selected)!;
  const visible = sounds.filter((s) => group === "All" || s.group === group);
  return (
    <>
      <Title
        eyebrow="LISTEN. NOTICE. REPEAT. · 听一听，辨一辨，读一读"
        en="Small sounds, big discoveries."
        zh="从小小发音，发现英语的美。"
        description="Learn the sounds behind the words. · 认识单词背后的声音。"
      />
      <div className="phonetic-intro panel">
        <span className="abc-mark">
          Aa<span>≠</span>/æ/
        </span>
        <div>
          <h2>
            Letters and sounds are different. <span>字母和音素不同。</span>
          </h2>
          <p>
            A is a written letter; /æ/ is one sound in apple. IPA symbols help
            us write sounds. · A 是字母，/æ/ 是 apple
            中的一个音素。音标帮助我们记录发音。
          </p>
          <p className="muted">
            US is the main learning accent. /e/ may also be written /ɛ/, /r/ as
            /ɹ/, and /ɝ, ɚ/ as /ɜːr, ər/. British comparisons are labelled
            separately. · 以美式为主；这些音标写法可能因词典而异，英音另作对照。
          </p>
        </div>
      </div>
      <div className="tabs">
        {[
          ["All", "All sounds · 全部"],
          ["Vowels", "Vowels · 元音"],
          ["Diphthongs", "Diphthongs · 双元音"],
          ["Consonants", "Consonants · 辅音"],
          ["UK comparison", "UK comparison · 英音对照"],
        ].map(([g, label]) => (
          <button
            key={g}
            className={g === group ? "selected" : ""}
            onClick={() => {
              setGroup(g);
              const first = sounds.find((s) => g === "All" || s.group === g);
              if (first) {
                setSelected(first.id);
                setHeard(false);
              }
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="phonetic-layout">
        <div className="sound-grid">
          {visible.map((s) => (
            <button
              key={s.id}
              className={`sound-cell ${selected === s.id ? "active" : ""}`}
              onClick={() => {
                stopAudio();
                setSelected(s.id);
                setHeard(false);
              }}
            >
              <strong>/{s.ipa}/</strong>
              <span>{s.example}</span>
              {state.sounds.includes(s.id) && <CheckCircle2 size={13} />}
            </button>
          ))}
        </div>
        <section className="sound-lesson panel" key={selected}>
          <div className="eyebrow">
            {sound.group} · {sound.groupZh}
          </div>
          <div className="sound-title">
            <h2>/{sound.ipa}/</h2>
            <Mouth open={sound.open} />
          </div>
          <h3>Try this mouth position · 试试这个口形</h3>
          <Meaning en={sound.tip} zh={sound.tipZh} />
          <p className="source-note">
            Opening shown schematically; follow the tongue and lip instructions.
            · 图示仅表示张口程度，请结合舌位与嘴唇说明。
          </p>
          <div className="example-words">
            {[sound.example, sound.other].map((t) => (
              <div key={t}>
                <strong>{t}</strong>
                <AudioButton
                  text={t}
                  accent={sound.accent}
                  onPlayed={() => setHeard(true)}
                  label="Hear example"
                  zh="听例词"
                />
              </div>
            ))}
          </div>
          <p className="hint">
            Hear the sound inside each word, then repeat the word aloud. ·
            听例词中的目标音，然后大声跟读。
          </p>
          <button
            className="primary"
            disabled={!heard && !state.sounds.includes(sound.id)}
            onClick={() => {
              setState((s: any) => ({
                ...s,
                sounds: [...new Set([...s.sounds, sound.id])],
              }));
            }}
          >
            <Check size={17} />
            {state.sounds.includes(sound.id)
              ? "Practised · 已练习"
              : "I practised this sound · 我练习了这个音"}
          </button>
          <a className="text-button" href="#/practice/sounds">
            Sound listening practice · 辨音练习 <ArrowRight size={16} />
          </a>
        </section>
      </div>
    </>
  );
}
const modes = [
  [
    "listening",
    "Listen and choose",
    "听音选择",
    Headphones,
    "Hear a word. Find its meaning.",
    "听单词，选释义。",
    "mint",
  ],
  [
    "matching",
    "Picture match",
    "看图选词",
    Puzzle,
    "Connect pictures and words.",
    "连接图片与单词。",
    "sand",
  ],
  [
    "spelling",
    "Word builder",
    "单词拼写",
    Library,
    "Put the letters in order.",
    "把字母按顺序排列。",
    "pink",
  ],
  [
    "sentences",
    "Sentence builder",
    "句子排序",
    BookOpen,
    "Build a sentence, one word at a time.",
    "一个词一个词地组成句子。",
    "blue",
  ],
  [
    "reading",
    "Read and understand",
    "阅读理解",
    BookOpen,
    "Read a short text and answer.",
    "读短文并回答问题。",
    "peach",
  ],
  [
    "sounds",
    "Sound detective",
    "发音小侦探",
    AudioLines,
    "Listen closely to similar words.",
    "仔细听，辨别相近的单词。",
    "lilac",
  ],
  [
    "review",
    "Mixed review",
    "综合复习",
    RotateCcw,
    "Give tricky words another try.",
    "再练一练容易忘记的单词。",
    "mint",
  ],
  [
    "flashcards",
    "Flashcards",
    "单词卡片",
    Library,
    "Recall a meaning before revealing it.",
    "先回忆，再查看释义。",
    "sand",
  ],
] as const;
function shuffle<T>(arr: T[]) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function makeQuestions(mode: string, pool: Word[]): Question[] {
  const sample = shuffle(pool).slice(0, 8);
  return sample.map((w) => {
    const options = shuffle([
      w,
      ...shuffle(words.filter((o) => o.id !== w.id && o.zh !== w.zh)).slice(
        0,
        2,
      ),
    ]);
    const ix = options.findIndex((o) => o.id === w.id);
    if (mode === "spelling")
      return {
        id: `spell-${w.id}`,
        prompt: `Spell the word for: ${w.zh}`,
        zh: "按顺序点击字母，拼出单词。",
        options: shuffle(w.text.split("")),
        answer: 0,
        explain: w.text.split("").join(" "),
        explainZh: `${w.text} · ${w.zh}`,
        word: w.text,
        build: true,
      };
    return {
      id: `${mode}-${w.id}`,
      prompt:
        mode === "matching"
          ? "Which word matches this picture?"
          : mode === "listening"
            ? "Listen. What does the word mean?"
            : `What does “${w.text}” mean?`,
      zh:
        mode === "matching"
          ? "哪个单词与图片相符？"
          : mode === "listening"
            ? "听一听，这个单词是什么意思？"
            : "这个单词是什么意思？",
      options: options.map((o) => (mode === "matching" ? o.text : o.zh)),
      answer: ix,
      explain: `${w.text} means ${w.zh}.`,
      explainZh: `记住这个词：${w.text}。`,
      word: w.text,
      audio: mode === "listening" ? spokenWord(w.text) : undefined,
      picture: mode === "matching" ? (emojiMap as any)[w.text] : undefined,
    };
  });
}
function PracticePage({ mode }: { mode?: string }) {
  const { state, setState } = useStore();
  const [run, setRun] = useState(0);
  const learned = words.filter(
    (w) => state.seen.includes(w.id) || !!state.wordProgress[w.id],
  );
  const due = words.filter(
    (w) => wordStatus(state.wordProgress[w.id]) === "review",
  );
  const [initialPool] = useState(() => (mode === "review" ? due : learned));
  const selected = modes.find((m) => m[0] === mode);
  if (!mode || !selected)
    return (
      <>
        <Title
          eyebrow="LITTLE CHALLENGES, REAL PROGRESS · 小练习，真进步"
          en="Let's put it into practice."
          zh="把学到的知识练起来。"
          description="Practise what you have learned, without a timer. · 复习学过的内容，不限时，慢慢来。"
        />
        <div className="practice-grid">
          {modes.map(([id, en, zh, Icon, desc, descZh, color]) => (
            <a
              href={`#/practice/${id}`}
              key={id}
              className={`practice-card ${color}`}
            >
              <span className="practice-icon">
                <Icon size={27} />
              </span>
              <h2>{en}</h2>
              <p className="practice-zh">{zh}</p>
              <p>
                {desc}
                <br />
                {descZh}
              </p>
              <ArrowRight size={21} />
            </a>
          ))}
        </div>
      </>
    );
  let pool = initialPool;
  if (mode === "matching")
    pool = pool.filter(
      (w) =>
        (emojiMap as any)[w.text] &&
        !["help", "friend", "happy", "play"].includes(w.text),
    );
  if (mode === "spelling")
    pool = pool.filter((w) => /^[a-z]{2,10}$/.test(w.text));
  const needsLessons = ["sentences", "reading"].includes(mode);
  if (
    (needsLessons && !state.completed.length) ||
    (!["sounds", "sentences", "reading"].includes(mode) && !pool.length)
  )
    return (
      <>
        <button className="back" onClick={() => go("practice")}>
          <ArrowLeft size={17} /> Practice · 练习
        </button>
        <Empty
          en={
            mode === "review"
              ? "All caught up!"
              : "A little learning comes first"
          }
          zh={mode === "review" ? "暂时没有到期复习！" : "先学一点，再来练习"}
          detail={
            mode === "review"
              ? "Explore a lesson or add words to review. · 可以继续学课程，或手动添加待复习单词。"
              : "Open word details or finish a lesson to build your practice collection. · 打开单词详情或完成课时，丰富你的练习词库。"
          }
        />
      </>
    );
  return (
    <>
      <button className="back" onClick={() => go("practice")}>
        <ArrowLeft size={17} /> All practice · 全部练习
      </button>
      <Title
        en={selected[1]}
        zh={selected[2]}
        description={`${selected[4]} · ${selected[5]}`}
      />
      {mode === "flashcards" ? (
        <Flashcards key={run} pool={pool} />
      ) : (
        <QuizSession
          key={`${mode}-${run}`}
          mode={mode}
          pool={pool}
          onAgain={() => setRun(run + 1)}
        />
      )}
    </>
  );
}
function QuizSession({
  mode,
  pool,
  onAgain,
}: {
  mode: string;
  pool: Word[];
  onAgain: () => void;
}) {
  const { state, setState } = useStore();
  const [questions] = useState<Question[]>(() => {
    if (mode === "sounds")
      return shuffle(soundQuestions)
        .slice(0, 6)
        .map((pair, i) => ({
          id: `sound-${pair.join("-")}`,
          prompt: "Which word do you hear?",
          zh: "你听到了哪个单词？",
          options: shuffle(pair),
          answer: 0,
          explain: `Listen for “${pair[0]}”.`,
          explainZh: "注意两个单词中不同的发音。",
          audio: pair[0],
        }))
        .map((q) => ({ ...q, answer: q.options.indexOf(q.audio!) }));
    if (mode === "sentences") {
      const available = lessons
        .filter((l) => state.completed.includes(l.id))
        .flatMap((l) => l.cards)
        .filter(
          (c) => c.en.split(" ").length >= 3 && c.en.split(" ").length <= 8,
        );
      return shuffle(available)
        .slice(0, 6)
        .map((c, i) => ({
          id: `sentence-${audioId(c.en)}`,
          prompt: c.zh,
          zh: "Put the English words in order. · 将英语单词按顺序排列。",
          options: shuffle(c.en.split(" ")),
          answer: 0,
          explain: c.en,
          explainZh: c.zh,
          build: true,
        }));
    }
    if (mode === "reading") {
      const passage =
        "Hello! Nice to meet you. Let's be friends. Let's play together!";
      return [
        {
          id: "read-greeting",
          passage,
          prompt: "How does the text start?",
          zh: "这段话以什么问候开始？",
          options: ["Hello!", "Goodbye!", "No!"],
          answer: 0,
          explain: "The greeting is Hello!",
          explainZh: "开头的问候是 Hello!（你好！）",
          word: "hello",
        },
        {
          id: "read-invite",
          passage,
          prompt: "What does the speaker invite you to do?",
          zh: "说话的人邀请你做什么？",
          options: ["Go home.", "Play together.", "Sit down."],
          answer: 1,
          explain: "The invitation is to play together.",
          explainZh: "说话的人邀请你一起玩。",
          word: "play",
        },
      ];
    }
    return makeQuestions(mode, pool);
  });
  const [index, setIndex] = useState(0),
    [answered, setAnswered] = useState(false),
    [score, setScore] = useState(0);
  if (!questions.length)
    return (
      <Empty
        en="Learn a little more first"
        zh="先多学一点内容"
        detail="Complete a lesson with sentences or questions. · 完成包含句子或问题的课时后再来练习。"
      />
    );
  if (index >= questions.length)
    return (
      <div className="completion panel">
        <span className="completion-flower">🌷</span>
        <h1>
          Practice complete!<span>练习完成！</span>
        </h1>
        <div className="score">
          {score}
          <small> / {questions.length}</small>
        </div>
        <p>Correct on the first try · 首次作答正确</p>
        <p>
          {score === questions.length
            ? "Every answer, a little more confidence. · 每一次回答，都多一点自信。"
            : "Your tricky words are saved for review. · 易错单词已保存到复习列表。"}
        </p>
        <div className="row">
          <button className="secondary" onClick={() => go("progress")}>
            View progress · 查看进度
          </button>
          <button className="primary" onClick={onAgain}>
            Practise again · 再练一次 <RotateCcw size={17} />
          </button>
        </div>
      </div>
    );
  const question = questions[index];
  return (
    <>
      <div className="lesson-progress">
        <Bar value={Math.round((index / questions.length) * 100)} />
        <span>
          {index + 1}/{questions.length} questions · 题目
        </span>
      </div>
      <section className="lesson-stage panel">
        <QuestionCard
          key={`${index}-${runKey(question)}`}
          question={question}
          onAnswer={(correct) => {
            setAnswered(true);
            if (correct) setScore(score + 1);
            setState((s: any) =>
              answerResult(
                s,
                question.id,
                correct,
                wordByText(question.word || "")?.id || "",
              ),
            );
          }}
        />
      </section>
      <div className="lesson-actions">
        <span className="muted">
          No rush. Take your time. · 不着急，慢慢想。
        </span>
        <button
          className="primary"
          disabled={!answered}
          onClick={() => {
            stopAudio();
            setIndex(index + 1);
            setAnswered(false);
          }}
        >
          {index === questions.length - 1
            ? "See results · 查看结果"
            : "Next question · 下一题"}
          <ArrowRight size={17} />
        </button>
      </div>
    </>
  );
}
const runKey = (q: Question) => q.id;
function Flashcards({ pool }: { pool: Word[] }) {
  const { setState } = useStore();
  const [cards] = useState(() => shuffle(pool).slice(0, 12)),
    [index, setIndex] = useState(0),
    [show, setShow] = useState(false);
  if (index >= cards.length)
    return (
      <Empty
        en="Your words are growing!"
        zh="你的词汇又增加了！"
        detail="Flashcard practice is saved. · 单词卡片练习已保存。"
      />
    );
  const w = cards[index];
  function rate(correct: boolean) {
    setState((s: any) => answerResult(s, `self-${w.id}`, correct, w.id));
    setShow(false);
    setIndex(index + 1);
    stopAudio();
  }
  return (
    <>
      <div className="lesson-progress">
        <Bar value={Math.round((index / cards.length) * 100)} />
        <span>
          {index + 1}/{cards.length} cards · 卡片
        </span>
      </div>
      <section className="flashcard panel">
        <span className="big-emoji">{(emojiMap as any)[w.text] || "🌱"}</span>
        <h2>{w.text}</h2>
        <p className="ipa">/{w.us}/</p>
        <AudioButton text={spokenWord(w.text)} />
        {show ? (
          <>
            <h3>{w.zh}</h3>
            <Meaning en={w.example} zh={w.exampleZh} />
            <div className="row">
              <button className="secondary" onClick={() => rate(false)}>
                Still learning · 还要复习
              </button>
              <button className="primary" onClick={() => rate(true)}>
                I remembered · 我记住了 <Check size={17} />
              </button>
            </div>
          </>
        ) : (
          <button className="secondary" onClick={() => setShow(true)}>
            Show meaning · 显示释义
          </button>
        )}
        <p className="source-note">
          Self-check: be honest with yourself. · 自我检查，请如实选择。
        </p>
      </section>
    </>
  );
}
function ProgressPage() {
  const { state } = useStore();
  const correct = state.history.filter((h: any) => h.correct).length;
  const mastered = words.filter(
    (w) => wordStatus(state.wordProgress[w.id]) === "mastered",
  ).length;
  const learning = words.filter(
    (w) => wordStatus(state.wordProgress[w.id]) === "learning",
  ).length;
  const due = words.filter(
    (w) => wordStatus(state.wordProgress[w.id]) === "review",
  );
  const badges = [
    [
      "🌱",
      "First steps",
      "迈出第一步",
      state.completed.length >= 1,
      "Complete your first lesson. · 完成第一个课时。",
    ],
    [
      "🌻",
      "Unit 1 explorer",
      "第一单元探索者",
      state.completed.length === lessons.length,
      "Complete every Unit 1 lesson. · 完成第一单元全部课时。",
    ],
    [
      "📚",
      "Word grower",
      "单词种植家",
      mastered >= 10,
      "Master 10 words across later reviews. · 通过多日复习掌握10个单词。",
    ],
    [
      "🎧",
      "Sound explorer",
      "声音探索家",
      state.sounds.length >= 10,
      "Practise 10 sound lessons. · 练习10个音标课。",
    ],
    [
      "✨",
      "Steady steps",
      "坚持的小脚步",
      state.days.length >= 3,
      "Learn on 3 different days. · 在3个不同日期学习。",
    ],
  ];
  return (
    <>
      <Title
        eyebrow="LOOK HOW FAR YOU'VE GROWN · 看看你的成长"
        en="Every little step counts."
        zh="每一个小小的进步，都算数。"
        description="Your learning story, saved on this device. · 你的学习故事，保存在此设备。"
      />
      <div className="progress-summary">
        <div className="panel">
          <Star />
          <strong>{stars(state)}</strong>
          <B en="Stars earned" zh="获得星星" />
        </div>
        <div className="panel">
          <BookOpen />
          <strong>
            {state.completed.length}/{lessons.length}
          </strong>
          <B en="Lessons complete" zh="完成课时" />
        </div>
        <div className="panel">
          <AudioLines />
          <strong>
            {state.sounds.length}/{sounds.length}
          </strong>
          <B en="Sounds practised" zh="已练习音标" />
        </div>
        <div className="panel">
          <Flame />
          <strong>{state.days.length}</strong>
          <B en="Learning days" zh="累计学习天数" />
        </div>
      </div>
      <div className="home-columns">
        <section className="panel">
          <h2>
            Vocabulary growth <span>词汇成长</span>
          </h2>
          <div className="vocab-growth">
            <div>
              <strong>{mastered}</strong>
              <span>Mastered · 已掌握</span>
            </div>
            <div>
              <strong>{learning}</strong>
              <span>Learning · 学习中</span>
            </div>
            <div>
              <strong>{due.length}</strong>
              <span>Review · 待复习</span>
            </div>
          </div>
          <p className="muted">
            Mastery grows with successful recall on different days. Completion
            and pronunciation ability are not the same. ·
            在不同日期成功回忆可提高掌握度。完成学习不代表口语发音已达标。
          </p>
          <button className="secondary" onClick={() => go("practice/review")}>
            Review today · 今日复习 <ArrowRight size={17} />
          </button>
        </section>
        <section className="panel">
          <h2>
            Your practice record <span>你的练习记录</span>
          </h2>
          <strong className="big-number">
            {state.history.length
              ? Math.round((correct / state.history.length) * 100)
              : 0}
            %
          </strong>
          <p>
            {correct}/{state.history.length} correct answers, including
            flashcard self-checks.
            <br />
            正确作答次数 / 总次数，包含单词卡片自评。
          </p>
          <Bar
            value={
              state.history.length
                ? Math.round((correct / state.history.length) * 100)
                : 0
            }
          />
        </section>
      </div>
      <div className="section-heading">
        <h2>
          A garden of achievements <span>你的成就花园</span>
        </h2>
      </div>
      <div className="badges-grid">
        {badges.map(([emoji, en, zh, earned, desc]) => (
          <div
            key={String(en)}
            className={`achievement ${earned ? "earned" : ""}`}
          >
            <span>{emoji}</span>
            <h3>{en}</h3>
            <p>{zh}</p>
            <small>{desc}</small>
            <div>{earned ? "✓ Earned · 已获得" : "Growing · 成长中"}</div>
          </div>
        ))}
      </div>
      <section className="panel history">
        <h2>
          Recent practice <span>最近练习</span>
        </h2>
        {state.history.length ? (
          state.history
            .slice(-8)
            .reverse()
            .map((h: any, i: number) => (
              <div className="history-row" key={`${h.time}-${i}`}>
                <span className={h.correct ? "history-check" : "history-retry"}>
                  {h.correct ? <Check size={16} /> : <RotateCcw size={16} />}
                </span>
                <span>
                  {words.find((w) => w.id === h.wordId)?.text ||
                    "Learning activity · 学习活动"}
                </span>
                <span>
                  {h.correct
                    ? "Remembered · 已记住"
                    : "Keep practising · 继续练习"}
                </span>
                <time>{new Date(h.time).toLocaleDateString("zh-CN")}</time>
              </div>
            ))
        ) : (
          <p className="muted">
            Your first practice will appear here. ·
            第一次练习后，这里将显示你的记录。
          </p>
        )}
      </section>
    </>
  );
}
function SettingsPage({ onRestore }: { onRestore: () => void }) {
  const { state, setState, notice } = useStore();
  const [pending, setPending] = useState<any>(null),
    [reset, setReset] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  function download() {
    const data = JSON.stringify(state, null, 2);
    const url = URL.createObjectURL(
      new Blob([data], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `english-garden-${localDay()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    notice("Backup downloaded. · 备份已下载。");
  }
  async function importFile(f: File) {
    try {
      if (f.size > 2_000_000) throw Error("File too large");
      setPending(validated(JSON.parse(await f.text())));
    } catch {
      notice(
        "This backup is invalid or from an unsupported version. Your progress has not changed. · 备份无效或版本不支持，现有进度未改变。",
      );
    }
  }
  return (
    <>
      <Title
        eyebrow="MAKE YOURSELF AT HOME · 按你的习惯来"
        en="A few little preferences."
        zh="让学习更适合你。"
      />
      <section className="panel settings-panel">
        <h2>
          Learning preferences <span>学习偏好</span>
        </h2>
        <label className="setting-row">
          <span>
            <B en="Slower audio" zh="慢速播放" />
            <small>Play at a gentler pace. · 放慢语速，仔细听。</small>
          </span>
          <input
            type="checkbox"
            checked={state.settings.slow}
            onChange={(e) =>
              setState({
                ...state,
                settings: { ...state.settings, slow: e.target.checked },
              })
            }
          />
        </label>
        <label className="setting-row">
          <span>
            <B en="Show Chinese learning hints" zh="显示中文学习提示" />
            <small>
              Interface instructions always stay bilingual. ·
              界面说明始终保持双语。
            </small>
          </span>
          <input
            type="checkbox"
            checked={state.settings.showChinese}
            onChange={(e) =>
              setState({
                ...state,
                settings: { ...state.settings, showChinese: e.target.checked },
              })
            }
          />
        </label>
        <div className="setting-row">
          <span>
            <B en="Default pronunciation" zh="默认发音" />
            <small>
              UK comparison stays available in Words. · 单词页提供英式对照。
            </small>
          </span>
          <span className="pill">US English · 美式英语</span>
        </div>
      </section>
      <section className="panel settings-panel">
        <h2>
          Keep your progress safe <span>保存你的学习成果</span>
        </h2>
        <p>
          Progress belongs to this browser and device. Export a backup before
          clearing browser data or changing devices. ·
          进度保存在当前浏览器和设备中。清除浏览器数据或更换设备前，请先导出备份。
        </p>
        <div className="row wrap">
          <button className="primary" onClick={download}>
            <Download size={17} /> Export progress · 导出进度
          </button>
          <button className="secondary" onClick={() => file.current?.click()}>
            <Upload size={17} /> Import progress · 导入进度
          </button>
          <input
            hidden
            ref={file}
            type="file"
            accept=".json,application/json"
            onChange={(e) => {
              if (e.target.files?.[0]) importFile(e.target.files[0]);
              e.target.value = "";
            }}
          />
        </div>
        {pending && (
          <div className="confirm-box" role="alert">
            <h3>Replace this device’s progress? · 替换此设备的进度？</h3>
            <p>
              {pending.completed.length} completed lessons · 个已完成课时，
              {pending.history.length} practice records · 条练习记录。
            </p>
            <div className="row">
              <button
                className="primary"
                onClick={() => {
                  onRestore();
                  setState(pending);
                  setPending(null);
                  notice("Progress restored. · 学习进度已恢复。");
                }}
              >
                Replace and import · 替换并导入
              </button>
              <button className="secondary" onClick={() => setPending(null)}>
                Cancel · 取消
              </button>
            </div>
          </div>
        )}
      </section>
      <section className="panel settings-panel">
        <h2>
          Your friends postcard <span>你的朋友明信片</span>
        </h2>
        <PostcardEditor />
      </section>
      <section className="panel settings-panel">
        <h2>
          About this garden <span>关于英语花园</span>
        </h2>
        <p>
          A self-learning companion based on the Grade 3 textbook. Original
          activities and illustrations; prepared synthetic US/UK audio. ·
          根据三年级教材编排的自学伙伴，配有原创练习、插图及预制的美式和英式合成语音。
        </p>
        <p>
          Phonetics uses a General American core with British comparisons;
          examples demonstrate sounds inside words. No speech is recorded or
          assessed. ·
          音标以通用美式发音为主并提供英音对照，通过例词示范发音。网站不录音、不评测口语。
        </p>
        <p className="source-note">
          Reference: FLTRP Grade 3, first semester, revised to the 2022
          curriculum standard; Unit 1 and vocabulary pp. 86–92. ·
          参考外研社三年级上册（2022年版课程标准修订），第一单元及第86–92页词汇。
        </p>
      </section>
      <section className="panel settings-panel danger">
        <h2>
          Start fresh <span>重新开始</span>
        </h2>
        <p>
          Reset only this website’s progress on this device. Export a backup
          first. · 仅清除本网站在当前设备的进度，建议先导出备份。
        </p>
        {reset ? (
          <div className="confirm-box">
            <strong>
              Erase learning progress and your postcard? ·
              清除学习进度和明信片？
            </strong>
            <div className="row">
              <button
                className="danger-button"
                onClick={() => {
                  onRestore();
                  setState(freshState());
                  setReset(false);
                  notice(
                    "Progress reset. A new journey begins. · 进度已重置，开始新的旅程。",
                  );
                }}
              >
                Yes, reset · 确认重置
              </button>
              <button className="secondary" onClick={() => setReset(false)}>
                Cancel · 取消
              </button>
            </div>
          </div>
        ) : (
          <button className="danger-button" onClick={() => setReset(true)}>
            <RotateCcw size={17} /> Reset progress · 重置进度
          </button>
        )}
      </section>
    </>
  );
}
createRoot(document.getElementById("root")!).render(<App />);

import "./readability.css";
