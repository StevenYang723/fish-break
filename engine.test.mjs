import test from 'node:test';
import assert from 'node:assert/strict';
import {FishEngine,PERKS,ROUTES,CORRUPTION_TIERS,MAX_CULT_STACKS,corruptionPenalty,nextCorruptionTier} from './engine.js';
const fresh=(seed=10)=>new FishEngine(seed,{skipDraft:true});
function finish(e){for(let n=0;n<1200&&e.state==='flying';n++){e.step(1/60);assert.ok(e.fish.length<=7);for(const f of e.fish)assert.ok([f.x,f.y,f.vx,f.vy,f.points].every(Number.isFinite));}assert.notEqual(e.state,'flying');}
function settle(e,a=0){assert.equal(e.shoot(a),true);finish(e);}
function ordinary(e){e.pegs.forEach(p=>{p.kind='normal';p.gold=false;});}
test('maps grow rewards and preserve all targets in 400 seeded layouts',()=>{
 for(let seed=1;seed<=40;seed++){const e=fresh(seed);let lastCount=0;
  for(let stage=1;stage<=10;stage++){e.stage=stage;e.setup();assert.ok(e.mapCount>=lastCount);assert.equal(e.mapCount,(6+e.biomeIndex)*(7+Math.ceil(e.biomeIndex/2))+8);assert.ok(e.target<e.mapBudget*1.7&&e.target>e.mapBudget*.4);assert.ok(e.pegs.every(p=>p.x>0&&p.x<420&&p.y>100&&p.y<470));lastCount=e.mapCount;}
  assert.equal(e.mapCount,98);assert.equal(e.baseValue,34);assert.equal(e.depth,8500);
 }
});
test('seed reproduces maps while other seeds and routes change them',()=>{
 assert.deepEqual(fresh(44).snapshot(),fresh(44).snapshot());assert.notDeepEqual(fresh(44).pegs,fresh(45).pegs);
 const maps=ROUTES.map(route=>{const e=fresh(44);e.routeId=route.id;e.stage=7;e.setup();return JSON.stringify(e.pegs);});assert.equal(new Set(maps).size,5);
});
test('all mechanisms and build combinations settle within the time limit',()=>{
 const builds=[{}, {volley:1,split:1,brood:2,tentacle:3,gaze:2,stars:2},Object.fromEntries(PERKS.map(p=>[p.id,p.max]))];
 for(const perks of builds)for(let stage=1;stage<=12;stage++)for(let seed=1;seed<=6;seed++){const e=fresh(seed);e.stage=stage;e.perks={...perks};e.routeId=ROUTES[seed%5].id;e.setup();while(e.state==='ready')settle(e,(seed%7-3)*.28);assert.ok(e.score>0&&Number.isFinite(e.score));assert.equal(e.total,e.score);assert.equal(e.fish.length,0);assert.equal(e.shoot(0),false);}
});
test('starter draft, offered choices, route selection, caps and rerolls',()=>{
 const e=new FishEngine(8);assert.equal(e.shoot(0),false);assert.equal(e.choices().length,3);assert.ok(e.choices().some(p=>p.cult));assert.ok(e.choices().some(p=>!p.cult));assert.equal(e.choose('not-offered'),false);
 assert.ok(e.choose(e.choices()[0].id));assert.equal(e.stage,1);assert.equal(e.state,'ready');assert.equal(e.reroll(),false);
 e.state='cleared';const route=e.routeChoices()[1],perk=e.choices()[0];assert.equal(e.choose(perk.id,'bad-route'),false);assert.equal(e.choose(perk.id,route.id),true);assert.equal(e.stage,2);assert.equal(e.routeId,route.id);
 e.state='cleared';for(let i=0;i<3;i++)assert.equal(e.reroll(),true);assert.equal(e.reroll(),false);
 e.perks=Object.fromEntries(PERKS.map(p=>[p.id,p.max]));assert.equal(e.choices().length,0);assert.equal(e.choose('extra'),false);assert.equal(e.nextEndless(),true);
 e.perks={};e.routeId='ritual';e.state='cleared';assert.equal(e.choices().filter(p=>p.cult).length,2);
});
test('maw and safety interact correctly without changing board width',()=>{
 const e=fresh();for(let n=0;n<=2;n++){e.perks.wide=n;assert.equal(e.bins().reduce((s,b)=>s+b.w,0),420);}e.perks.maw=1;assert.deepEqual(e.bins().map(b=>b.m),[1,2,5,2,1]);e.perks.safe=1;assert.deepEqual(e.bins().map(b=>b.m),[2,2,5,2,2]);
});
test('last-shot and sacrifice multiply landing exactly once',()=>{
 const e=fresh();e.perks={last:1,sacrifice:1};e.setup();assert.equal(e.shots,3);e.shots=1;e.shoot(0);e.fish[0].x=210;e.fish[0].y=504;e.fish[0].points=50;e.step(1/120);assert.equal(e.score,Math.round(50*3*1.65*1.5));const total=e.total;e.step(1);assert.equal(e.total,total);
});
test('lightning and gaze do not recurse into direct-hit combos',()=>{
 const e=fresh();ordinary(e);e.perks={chain:1,combo:1,gaze:1};e.shoot(0);const f=e.fish[0];for(let n=0;n<5;n++)e.pop(e.pegs.find(p=>p.alive),f);assert.equal(f.hits,5);assert.equal(e.pegs.filter(p=>!p.alive).length,10);assert.equal(e.events.filter(x=>x.type==='lightning').length,2);assert.equal(e.events.filter(x=>x.type==='gaze').length,3);
});
test('tentacles capture without contact and brood stops at seven fish',()=>{
 const e=fresh();ordinary(e);e.perks={tentacle:1,brood:2};e.shoot(0);const f=e.fish[0];e.pegs[0].x=f.x+45;e.pegs[0].y=f.y;f.tentacleCooldown=0;e.step(1/120);assert.equal(e.pegs[0].alive,false);assert.equal(f.hits,0);for(let n=0;n<18;n++)e.pop(e.pegs.find(p=>p.alive),f);assert.equal(e.spawned,7);assert.equal(e.fish.length,7);
});
test('vents return fish upward and dream works from the first layer',()=>{
 const starter=fresh();starter.perks.dream=1;starter.setup();assert.equal(starter.wells.length,1);starter.shoot(0);starter.fish[0].x=220;starter.fish[0].y=312;starter.step(1/120);assert.equal(starter.spawned,3);
 const e=fresh();e.stage=8;e.perks={dream:1,spring:1};e.setup();e.shoot(0);e.pegs=[];const f=e.fish[0],v=e.vents[0];f.x=v.x;f.y=v.y;f.vy=10;e.step(1/120);assert.ok(f.vy<0);assert.equal(f.points,3*e.baseValue);const w=e.wells[0];f.x=w.x+10;f.y=w.y;e.step(1/120);assert.equal(e.spawned,3);f.x=w.x+10;f.y=w.y;e.step(1/120);assert.equal(e.spawned,3);
});
test('rebirth and regrowth cannot loop forever',()=>{
 const e=fresh();e.perks={rebirth:1,blackTide:2};e.setup();e.shoot(0);const f=e.fish[0];f.x=210;f.y=504;e.step(1/120);assert.equal(f.reborn,true);assert.ok(f.vy<0);assert.equal(e.total,0);f.y=504;f.vy=100;e.step(1/120);assert.ok(e.total>0);
 e.pegs.forEach(p=>{p.alive=false;p.revived=false;});e.regrow();assert.equal(e.pegs.filter(p=>p.alive).length,25);assert.ok(e.pegs.filter(p=>p.alive).every(p=>p.spectral));for(let n=0;n<10;n++){e.pegs.forEach(p=>p.alive=false);e.regrow();}assert.equal(e.pegs.filter(p=>p.alive).length,0);
});
test('corruption has four distinct mutation thresholds',()=>{
 const e=fresh();assert.equal(e.cultTier,0);for(const [count,tier] of [[1,1],[2,1],[3,2],[5,2],[6,3],[8,3],[9,4],[16,4]]){e.perks=cultBuild(count);assert.equal(e.cultTier,tier);}
});
test('mid-shot saves resume identically with the new skills',()=>{
 const e=fresh(124);e.stage=9;e.perks={brood:2,tentacle:3,dream:1,rebirth:1,blackTide:2,sacrifice:1};e.setup();e.shoot(-.6);for(let i=0;i<70;i++)e.step(1/60);const copy=FishEngine.restore(e.snapshot());assert.ok(copy);finish(e);finish(copy);assert.equal(copy.score,e.score);assert.equal(copy.state,e.state);assert.deepEqual(copy.pegs,e.pegs);assert.deepEqual(copy.perks,e.perks);
});
test('legacy saves retain upgrades and score on the new map',()=>{
 const old=fresh(9).snapshot();delete old.version;old.total=954;old.perks={extra:1,rich:2};old.stage=5;const e=FishEngine.restore(old);assert.equal(e.total,954);assert.equal(e.stage,5);assert.equal(e.shots,4);assert.equal(e.baseValue,22);assert.equal(e.migrated,true);assert.equal(FishEngine.restore({}),null);assert.equal(FishEngine.restore(null),null);
});

function cultBuild(count){const perks={};for(const p of PERKS.filter(p=>p.cult)){const n=Math.min(count,p.max);if(n)perks[p.id]=n;count-=n;}assert.equal(count,0);return perks;}
function corrupted(count,stage=1){const e=fresh();e.stage=stage;e.perks=cultBuild(count);e.setup();return e;}
test('corruption counts repeated acquisitions, not unique skills or normal upgrades',()=>{
 const e=fresh();e.perks={tentacle:3,extra:2,wide:2};assert.equal(e.cultCount,3);assert.equal(e.corruption,3);assert.equal(MAX_CULT_STACKS,16);
 for(const p of PERKS.filter(p=>p.cult)){assert.equal(p.cult,1);assert.equal(p.cost,undefined);}e.perks={maw:1,dream:1,rebirth:1};assert.deepEqual(e.curse,corruptionPenalty(3));
});
test('tiers are cumulative and continue worsening after ten acquisitions',()=>{
 assert.equal(CORRUPTION_TIERS.length,10);
 for(let n=0;n<=16;n++){const c=corruptionPenalty(n);assert.equal(c.centerShrink,n>=1?14:0);assert.equal(c.edgeMultiplier,n>=2?.5:1);assert.equal(c.percent,n>=3?10+Math.max(0,n-10)*5:0);assert.equal(c.directMultiplier,n>=4?.85:1);assert.equal(c.shotLoss,n>=5?1:0);assert.equal(c.offerings,n>=6?2:0);assert.equal(c.broodTax,n>=7?.25:0);assert.equal(c.rebounceTax,n>=8?.5:0);assert.equal(c.forget,n>=9);assert.equal(c.originalMultiplier,n>=10?.85:1);if(n<16)assert.equal(nextCorruptionTier(n).level,n+1);}
 assert.equal(corruptionPenalty(-2).stacks,0);assert.equal(corruptionPenalty(NaN).stacks,0);assert.equal(corruptionPenalty(Infinity).stacks,0);assert.equal(corruptionPenalty(100).stacks,16);assert.equal(corruptionPenalty(2.7).stacks,2);
});
test('same count yields identical penalties regardless of the cult skills chosen',()=>{
 const a=fresh(),b=fresh();a.perks={tentacle:3,gaze:2};b.perks={maw:1,dream:1,rebirth:1,stars:2};a.setup();b.setup();assert.deepEqual(a.curse,b.curse);assert.equal(a.shots,b.shots);assert.equal(a.bins()[2].w,b.bins()[2].w);assert.equal(a.bins()[0].m,b.bins()[0].m);
});
test('tiers one and two narrow the jackpot and halve outer bins after normal compensation',()=>{
 const e=corrupted(1);assert.equal(e.bins()[2].w,78);assert.equal(e.bins()[0].m,1);e.perks.wide=2;assert.equal(e.bins()[2].w,130);e.perks.tentacle=2;assert.deepEqual(e.bins().map(b=>b.m),[.5,2,3,2,.5]);e.perks.safe=1;assert.equal(e.bins()[0].m,1);assert.equal(e.bins().reduce((sum,b)=>sum+b.w,0),420);
});
test('tier three deducts the final shot once across all fish and after save restore',()=>{
 for(const order of [[101,102],[102,101]]){const e=corrupted(3);e.shoot();e.pegs=[];e.spawnBrood(e.fish[0],1);e.events=[];e.fish.forEach((f,i)=>{f.points=order[i];f.x=210;f.y=i?300:504;f.tentacleCooldown=9;});e.step(1/120);const copy=FishEngine.restore(e.snapshot());
  for(const game of [e,copy]){game.fish[0].y=504;game.fish[0].vy=100;game.step(1/120);assert.equal(game.shotGross,609);assert.equal(game.score,548);assert.equal(game.lastShotDeducted,61);const total=game.total;game.step(1);assert.equal(game.total,total);}
  assert.equal(e.events.filter(ev=>ev.type==='land').reduce((sum,ev)=>sum+ev.value,0),548);
 }
});
test('tier four reduces direct bubble hits only and keeps indirect and machine points',()=>{
 const e=corrupted(4,9);ordinary(e);e.shoot();const f=e.fish[0];e.pop(e.pegs.find(p=>p.alive),f);assert.equal(f.points,Math.round(34*.85));const before=f.points;e.pop(e.pegs.find(p=>p.alive),f,true);assert.equal(f.points-before,34);assert.equal(e.machineBonus(f,1),34);
});
test('tier five loses one launch independent of blood contract and extra launches compensate',()=>{
 const e=corrupted(4);assert.equal(e.maxShots,3);e.perks=cultBuild(5);e.setup();assert.equal(e.maxShots,2);e.perks.extra=2;e.setup();assert.equal(e.maxShots,4);e.perks={sacrifice:2};e.setup();assert.equal(e.maxShots,3);
});
test('tier six seeded offerings give no points or explosions and never regrow',()=>{
 const a=corrupted(6),b=corrupted(6);for(const e of [a,b]){e.routeId='bloom';e.pegs.forEach(p=>p.kind='bomb');e.shoot();assert.equal(e.pegs.filter(p=>p.consumed).length,2);assert.equal(e.fish[0].points,0);assert.equal(e.events.filter(ev=>ev.type==='nova').length,0);assert.equal(e.events.filter(ev=>ev.type==='offering').length,2);e.regrow();assert.ok(e.pegs.filter(p=>p.consumed).every(p=>!p.alive));}
 assert.deepEqual(a.pegs.filter(p=>p.consumed).map(p=>p.id),b.pegs.filter(p=>p.consumed).map(p=>p.id));
 const e=corrupted(6);e.pegs=e.pegs.slice(0,1);e.shoot();assert.equal(e.pegs.filter(p=>p.consumed).length,1);
});
test('tier seven charges per successful spawning event, never per child or at capacity',()=>{
 const e=corrupted(7);e.shoot();e.score=300;e.total=300;const f=e.fish[0];f.points=100;assert.equal(e.spawnBrood(f,2),2);assert.equal(f.points,75);f.points=100;assert.equal(e.spawnBrood(f,8),4);assert.equal(f.points,75);f.points=100;assert.equal(e.spawnBrood(f,2),0);assert.equal(f.points,100);assert.equal(e.score,300);assert.equal(e.total,300);
});
test('tier seven also applies to ordinary wall split, without requiring the brood relic',()=>{
 const e=fresh();e.perks={tentacle:3,gaze:2,stars:2,split:1};e.setup();e.shoot();e.pegs=[];const f=e.fish[0];f.points=100;f.x=1;f.vx=-100;e.step(1/120);assert.equal(e.spawned,2);assert.equal(f.points,75);
});
test('tier eight taxes both echo and regeneration, retaining their separate bounce limits',()=>{
 const e=fresh();e.perks={tentacle:3,gaze:2,stars:2,rebirth:1};e.routeId='echo';e.setup();e.shoot();e.pegs=[];const f=e.fish[0];f.points=100;f.x=210;f.y=504;e.step(1/120);assert.equal(f.echoed,true);assert.equal(f.points,50);f.y=504;f.vy=100;e.step(1/120);assert.equal(f.reborn,true);assert.equal(f.points,25);f.y=504;f.vy=100;e.step(1/120);assert.equal(e.fish.length,0);assert.equal(e.score,Math.round(75*.9));
});
test('tier nine forgets on first well or portal entry even without the dream relic',()=>{
 for(const entry of ['well','portal']){const e=corrupted(9,7);e.shoot();e.pegs=[];e.bumpers=[];e.rotors=[];e.altars=[];e.vents=[];const f=e.fish[0];f.points=120;e.total=300;e.score=300;
  if(entry==='well'){f.x=e.wells[0].x+10;f.y=e.wells[0].y;}else{f.x=e.portals[0].x;f.y=e.portals[0].y;}f.vx=0;f.vy=0;e.step(1/120);assert.equal(f.points,0);assert.equal(f.mindBroken,true);assert.equal(e.total,300);f.points=30;e.enterDream(f);assert.equal(f.points,30);
  const child=e.makeFish(200,300,0,0,true);child.points=50;e.enterDream(child);assert.equal(child.points,50);
 }
});
test('tier ten lowers originals but preserves full ghost value and raw map target',()=>{
 const base=fresh();base.stage=9;base.setup();const e=corrupted(10,9);assert.equal(e.mapBudget,base.mapBudget);assert.equal(e.target,base.target);const p={kind:'normal',spectral:false};assert.equal(e.pegValue(p),Math.round(34*.85));assert.equal(e.pegValue(p,false),34);p.spectral=true;assert.equal(e.pegValue(p),34);e.perks.rich=1;assert.equal(e.pegValue(p),48);
});
test('individual relic penalties are gone below their shared unlock tiers',()=>{
 for(const id of ['tentacle','gaze','brood','sacrifice','blackTide','maw','stars','dream','rebirth']){const e=fresh();e.perks={[id]:1};e.setup();assert.equal(e.maxShots,3);assert.equal(e.bins()[2].w,78);assert.equal(e.bins()[0].m,1);assert.equal(e.curse.multiplier,1);e.shoot();assert.equal(e.pegs.filter(p=>p.consumed).length,0);const f=e.fish[0];f.points=100;e.spawnBrood(f,1);e.enterDream(f);assert.equal(f.points,100);assert.equal(e.pegValue({kind:'normal',spectral:false}),10);}
});
test('old 2.1 saves recalculate shared launch limits while preserving spent shots and score',()=>{
 const old=fresh().snapshot();old.balanceVersion=1;old.perks={sacrifice:2};old.maxShots=1;old.shots=0;old.state='over';old.score=90;old.total=590;const e=FishEngine.restore(old);assert.equal(e.maxShots,3);assert.equal(e.shots,2);assert.equal(e.score,90);assert.equal(e.total,590);assert.equal(e.state,'ready');assert.equal(e.balanceVersion,2);
 old.perks=cultBuild(5);old.maxShots=3;old.shots=1;old.state='ready';const reduced=FishEngine.restore(old);assert.equal(reduced.maxShots,2);assert.equal(reduced.shots,0);assert.equal(reduced.state,'over');
});
test('new saved shared penalties and once-per-shot flags resume without being applied twice',()=>{
 const e=corrupted(10,8);e.shoot();e.pegs=[];const f=e.fish[0];f.points=100;e.enterDream(f);f.points=50;const copy=FishEngine.restore(e.snapshot());copy.enterDream(copy.fish[0]);assert.equal(copy.fish[0].points,50);assert.equal(copy.fish[0].mindBroken,true);assert.equal(copy.shots,e.shots);assert.deepEqual(copy.curse,e.curse);
});
