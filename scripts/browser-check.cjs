const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/YsenG/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1080},acceptDownloads:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const url=process.env.TEST_URL||'http://127.0.0.1:5173';
 const visit=async p=>{await page.goto(`${url}/#/${p}`);await page.locator('main').waitFor();};
 await visit('');assert.match(await page.title(),/English Garden/);
 await page.getByRole('button',{name:'Start Learning 开始学习'}).click();
 await page.getByRole('button',{name:'Next step · 下一步'}).click();await page.waitForFunction(()=>document.querySelector('.teaching-card h2')?.textContent.includes('Nice to meet you'));await page.reload();
 assert.match(await page.locator('.teaching-card h2').innerText(),/Nice to meet you/);
 for(let i=0;i<3;i++)await page.getByRole('button',{name:'Next step · 下一步'}).click();
 await page.locator('.answers button').nth(0).click();assert.match(await page.locator('.feedback').innerText(),/答对/);
 await page.getByRole('button',{name:'Finish lesson · 完成课时'}).click();
 assert.match(await page.locator('.completion').innerText(),/Beautifully done/);
 console.log('PASS lesson traversal, completion, resume after reload');
 await visit('words');await page.getByRole('textbox',{name:'Search vocabulary · 搜索词汇'}).fill('friend');
 assert.equal(await page.locator('.word-tile').count(),1);await page.locator('.word-tile>a').click();
 const audioRequests=[];page.on('request',r=>{if(r.url().endsWith('.mp3'))audioRequests.push(r.url());});
 await page.getByRole('button',{name:'US audio · 美式发音'}).click();await page.waitForTimeout(700);
 await page.getByRole('button',{name:'UK audio · 英式发音'}).click();await page.waitForTimeout(700);
 assert.ok(audioRequests.some(u=>u.includes('/us-')));assert.ok(audioRequests.some(u=>u.includes('/uk-')));
 assert.equal(await page.locator('.toast').count(),0);
 await page.getByRole('button',{name:'Add to review · 加入复习'}).click();
 await visit('practice/review');await page.locator('.answers button').nth(0).click();
 await page.getByRole('button',{name:'See results · 查看结果'}).click();assert.match(await page.locator('.completion').innerText(),/Practice complete/);
 console.log('PASS word search, US/UK playback, review list, scored quiz');
 await visit('phonetic');await page.getByRole('button',{name:'Hear example · 听例词'}).first().click();await page.waitForTimeout(200);
 await page.getByRole('button',{name:'I practised this sound · 我练习了这个音'}).click();assert.equal(await page.getByRole('button',{name:'Practised · 已练习'}).count(),1);
 await visit('settings');await page.locator('.postcard-form input').first().fill('Lily');await page.getByRole('button',{name:'Save postcard · 保存明信片'}).click();
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Export progress · 导出进度'}).click();const download=await downloadPromise;const path=await download.path();const backup=JSON.parse(fs.readFileSync(path,'utf8'));assert.ok(backup.completed.includes('hello'));assert.equal(backup.postcard.name,'Lily');
 await page.getByRole('button',{name:'Reset progress · 重置进度'}).click();await page.getByRole('button',{name:'Cancel · 取消',exact:true}).click();
 await page.locator('input[type=file]').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"version":99}')});await page.waitForFunction(()=>document.querySelector('.toast')?.textContent.includes('invalid'));
 await page.getByRole('button',{name:'Reset progress · 重置进度'}).click();await page.getByRole('button',{name:'Yes, reset · 确认重置'}).click();
 await page.locator('input[type=file]').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});await page.getByRole('button',{name:'Replace and import · 替换并导入'}).click();await page.waitForFunction(()=>document.querySelector('.teaching-card h2')?.textContent.includes('Nice to meet you'));await page.reload();assert.equal(await page.locator('.postcard-form input').first().inputValue(),'Lily');
 console.log('PASS sound completion, postcard, export/import, reset/cancel, bad-backup rejection');
 for(const route of ['','learn','words','phonetic','practice','progress','settings']){await visit(route);assert.ok((await page.locator('main').innerText()).length>150);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route+' desktop overflow');}
 await visit('');await page.screenshot({path:'tmp/home-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 for(const route of ['','learn','words','phonetic','practice','progress','settings','lesson/hello']){await visit(route);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route+' mobile overflow');}
 await visit('');await page.getByRole('button',{name:'Toggle menu · 开关菜单'}).click();await page.locator('nav a').filter({hasText:'Words'}).click();assert.ok(page.url().endsWith('/words'));await visit('');await page.screenshot({path:'tmp/home-mobile.png',fullPage:true});
 await visit('phonetic');await page.screenshot({path:'tmp/phonetic-mobile.png',fullPage:true});
 assert.deepEqual(errors,[]);console.log('PASS desktop/mobile routes, mobile navigation, no overflow or browser exceptions');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});


