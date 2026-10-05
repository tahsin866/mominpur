import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
console.log('=== PROD route check ===');
for (const u of ['/','/en','/bn','/en/status','/bn/status','/en/registration/reg','/bn/registration/reg','/en/verify','/en/login','/en/auth','/dashboard','/dashboard/registrations','/dashboard/reports','/status','/registration/reg']) {
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs=[]; p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,45));});
  p.on('pageerror',e=>errs.push('PAGEERR:'+e.message.slice(0,45)));
  let st='ERR', land='';
  try{const r=await p.goto('http://localhost:3000'+u,{waitUntil:'domcontentloaded',timeout:20000});st=r.status();land=p.url().replace('http://localhost:3000','');}catch(e){errs.push('NAV:'+e.message.slice(0,30));}
  await p.waitForTimeout(1000);
  const d=await p.evaluate(()=>({nav:document.querySelectorAll('nav').length,ov:document.documentElement.scrollWidth>document.documentElement.clientWidth+1,body:document.body.innerText.length}));
  console.log(`  ${u.padEnd(24)} ${String(st).padEnd(4)} -> ${land.padEnd(24)} nav=${d.nav} ${d.ov?'OVERFLOW!':'ok'} ${errs.length?'ERR: '+[...new Set(errs)][0]:''}`);
  await p.close();
}
console.log('\n=== PROD hydration check: SSR HTML vs client DOM (React prod e warning chupay) ===');
for (const u of ['/en','/en/status','/en/registration/reg']) {
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('http://localhost:3000'+u, { waitUntil:'networkidle', timeout:25000 });
  await p.waitForTimeout(2500);
  const r = await p.evaluate(() => {
    const out = { inputs:0, disabled:[], selects:[] };
    document.querySelectorAll('input,select,textarea').forEach(e => {
      out.inputs++;
      if (e.disabled) out.disabled.push(e.name||e.tagName);
      if (e.tagName==='SELECT') out.selects.push({n:e.options.length, d:e.disabled, v:e.value});
    });
    return out;
  });
  console.log(`  ${u.padEnd(24)} inputs=${r.inputs} disabled=${r.disabled.length} selects=${JSON.stringify(r.selects)}`);
  await p.close();
}
await b.close();
