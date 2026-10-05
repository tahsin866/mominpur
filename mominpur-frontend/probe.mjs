import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
for (const u of ['/en','/bn','/en/status','/en/registration/reg','/bn/registration/reg']) {
  for (const [w,h] of [[390,844],[360,740]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto('http://localhost:3000' + u, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1200);
    const r = await p.evaluate(() => ({ vw: document.documentElement.clientWidth, sw: document.documentElement.scrollWidth }));
    const bad = r.sw > r.vw + 1;
    console.log(`${(u+' '+w).padEnd(32)} scrollW=${r.sw} vw=${r.vw} ${bad ? 'OVERFLOW' : 'ok'}`);
    await p.close();
  }
}
await b.close();
