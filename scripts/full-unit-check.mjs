import { createRequire } from "node:module";
import assert from "node:assert/strict";
import { lessons } from "../src/curriculum.mjs";
const require = createRequire(import.meta.url);
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE ||
    "C:/Users/YsenG/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright",
);
const b = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
try {
  const p = await b.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  const base = process.env.TEST_URL || "http://127.0.0.1:5173";
  for (const lesson of lessons) {
    await p.goto(`${base}/#/lesson/${lesson.id}`);
    const teaching = lesson.wordTexts?.length || lesson.cards.length;
    for (let i = 0; i < teaching; i++)
      await p
        .getByRole("button", {
          name: /Next step · 下一步|Finish lesson · 完成课时/,
        })
        .click();
    if (lesson.id === "alphabet") {
      assert.equal(
        await p
          .getByRole("button", { name: "Next step · 下一步" })
          .isDisabled(),
        true,
      );
      for (let i = 0; i < 5; i++) {
        await p.locator(".alphabet-grid .audio").nth(i).click();
        await p.waitForFunction(
          (n) =>
            Number(
              document
                .querySelector(".lesson-stage>span")
                ?.textContent?.split("/")[0],
            ) >= n,
          i + 1,
        );
      }
      await p.getByRole("button", { name: "Next step · 下一步" }).click();
    }
    if (lesson.id === "project") {
      assert.equal(
        await p
          .getByRole("button", { name: "Finish lesson · 完成课时" })
          .isDisabled(),
        true,
      );
      await p.locator(".postcard-form input").first().fill("Mia");
      await p
        .getByRole("button", { name: "Save postcard · 保存明信片" })
        .click();
      await p.getByRole("button", { name: "Finish lesson · 完成课时" }).click();
    }
    for (const q of lesson.questions) {
      if (q.audio) {
        assert.equal(
          await p.locator(".answers button").first().isDisabled(),
          true,
        );
        await p
          .getByRole("button", { name: "Play question · 播放题目" })
          .click();
      }
      await p.locator(".answers button").nth(q.answer).click();
      assert.match(await p.locator(".feedback").innerText(), /You got it/);
      await p
        .getByRole("button", {
          name: /Next step · 下一步|Finish lesson · 完成课时/,
        })
        .click();
    }
    assert.equal(await p.locator(".completion").count(), 1, lesson.id);
    console.log("PASS full lesson", lesson.id);
  }
  await p.goto(`${base}/#/progress`);
  assert.match(await p.locator(".progress-summary").innerText(), /10\/10/);
  // Add pictured and spelled words through the actual word UI.
  await p.goto(`${base}/#/words/w0-book`);
  await p.goto(`${base}/#/practice/matching`);
  await p.locator(".answers button").first().click();
  await p.getByRole("button", { name: /Next question|See results/ }).click();
  for (const mode of ["spelling", "sentences"]) {
    await p.goto(`${base}/#/practice/${mode}`);
    const buttons = p.locator(".token-bank button");
    const n = await buttons.count();
    assert.ok(n > 1);
    for (let i = 0; i < n; i++) await buttons.nth(i).click();
    await p.getByRole("button", { name: "Check answer · 检查答案" }).click();
    assert.equal(await p.locator(".feedback").count(), 1);
  }
  await p.goto(`${base}/#/practice/reading`);
  assert.ok((await p.locator(".reading-passage").innerText()).length > 40);
  await p.locator(".answers button").first().click();
  assert.equal(await p.locator(".feedback").count(), 1);
  await p.goto(`${base}/#/practice/listening`);
  await p.getByRole("button", { name: "Play question · 播放题目" }).click();
  await p.locator(".answers button").first().click();
  assert.equal(await p.locator(".feedback").count(), 1);
  await p.goto(`${base}/#/practice/flashcards`);
  await p.getByRole("button", { name: "Show meaning · 显示释义" }).click();
  await p.getByRole("button", { name: "I remembered · 我记住了" }).click();
  // A missing audio file must leave a listening question unanswerable, with honest feedback.
  await p.route("**/*.mp3", (r) => r.abort());
  await p.goto(`${base}/#/practice/sounds`);
  await p.getByRole("button", { name: "Play question · 播放题目" }).click();
  await p.locator(".toast").waitFor();
  assert.equal(await p.locator(".answers button").first().isDisabled(), true);
  assert.deepEqual(errors, []);
  console.log("PASS all practice engines and audio-failure handling");
} finally {
  await b.close();
}
