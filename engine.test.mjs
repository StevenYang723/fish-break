import test from 'node:test';
import assert from 'node:assert/strict';
import {FishEngine,PERKS,ROUTES} from './engine.js';
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
 const e=fresh();for(let n=0;n<=2;n++){e.perks.wide=n;assert.equal(e.bins().reduce((s,b)=>s+b.w,0),420);}e.perks.maw=1;assert.deepEqual(e.bins().map(b=>b.m),[.5,2,5,2,.5]);e.perks.safe=1;assert.deepEqual(e.bins().map(b=>b.m),[2,2,5,2,2]);
});
test('last-shot and sacrifice multiply landing exactly once',()=>{
 const e=fresh();e.perks={last:1,sacrifice:1};e.setup();assert.equal(e.shots,2);e.shots=1;e.shoot(0);e.fish[0].x=210;e.fish[0].y=504;e.fish[0].points=50;e.step(1/120);assert.equal(e.score,Math.round(50*3*1.65*1.5));const total=e.total;e.step(1);assert.equal(e.total,total);
});
test('lightning and gaze do not recurse into direct-hit combos',()=>{
 const e=fresh();ordinary(e);e.perks={chain:1,combo:1,gaze:1};e.shoot(0);const f=e.fish[0];for(let n=0;n<5;n++)e.pop(e.pegs.find(p=>p.alive),f);assert.equal(f.hits,5);assert.equal(e.pegs.filter(p=>!p.alive).length,10);assert.equal(e.events.filter(x=>x.type==='lightning').length,2);assert.equal(e.events.filter(x=>x.type==='gaze').length,3);
});
test('tentacles capture without contact and brood stops at seven fish',()=>{
 const e=fresh();ordinary(e);e.perks={tentacle:1,brood:2};e.shoot(0);const f=e.fish[0];e.pegs[0].x=f.x+45;e.pegs[0].y=f.y;f.tentacleCooldown=0;e.step(1/120);assert.equal(e.pegs[0].alive,false);assert.equal(f.hits,0);for(let n=0;n<18;n++)e.pop(e.pegs.find(p=>p.alive),f);assert.equal(e.spawned,7);assert.equal(e.fish.length,7);
});
test('vents return fish upward and dream summons only once',()=>{
 const e=fresh();e.stage=8;e.perks={dream:1,spring:1};e.setup();e.shoot(0);e.pegs=[];const f=e.fish[0],v=e.vents[0];f.x=v.x;f.y=v.y;f.vy=10;e.step(1/120);assert.ok(f.vy<0);assert.equal(f.points,3*e.baseValue);const w=e.wells[0];f.x=w.x+10;f.y=w.y;e.step(1/120);assert.equal(e.spawned,3);f.x=w.x+10;f.y=w.y;e.step(1/120);assert.equal(e.spawned,3);
});
test('rebirth and regrowth cannot loop forever',()=>{
 const e=fresh();e.perks={rebirth:1,blackTide:2};e.setup();e.shoot(0);const f=e.fish[0];f.x=210;f.y=504;e.step(1/120);assert.equal(f.reborn,true);assert.ok(f.vy<0);assert.equal(e.total,0);f.y=504;f.vy=100;e.step(1/120);assert.ok(e.total>0);
 e.pegs.forEach(p=>{p.alive=false;p.revived=false;});e.regrow();assert.equal(e.pegs.filter(p=>p.alive).length,25);assert.ok(e.pegs.filter(p=>p.alive).every(p=>p.spectral));for(let n=0;n<10;n++){e.pegs.forEach(p=>p.alive=false);e.regrow();}assert.equal(e.pegs.filter(p=>p.alive).length,0);
});
test('corruption has four distinct mutation thresholds',()=>{
 const e=fresh();assert.equal(e.cultTier,0);e.perks.tentacle=1;assert.equal(e.cultTier,1);e.perks.brood=1;assert.equal(e.cultTier,2);e.perks.tentacle=2;e.perks.maw=1;assert.equal(e.cultTier,3);e.perks.stars=2;assert.equal(e.cultTier,4);
});
test('mid-shot saves resume identically with the new skills',()=>{
 const e=fresh(124);e.stage=9;e.perks={brood:2,tentacle:3,dream:1,rebirth:1,blackTide:2,sacrifice:1};e.setup();e.shoot(-.6);for(let i=0;i<70;i++)e.step(1/60);const copy=FishEngine.restore(e.snapshot());assert.ok(copy);finish(e);finish(copy);assert.equal(copy.score,e.score);assert.equal(copy.state,e.state);assert.deepEqual(copy.pegs,e.pegs);assert.deepEqual(copy.perks,e.perks);
});
test('legacy saves retain upgrades and score on the new map',()=>{
 const old=fresh(9).snapshot();delete old.version;old.total=954;old.perks={extra:1,rich:2};old.stage=5;const e=FishEngine.restore(old);assert.equal(e.total,954);assert.equal(e.stage,5);assert.equal(e.shots,4);assert.equal(e.baseValue,22);assert.equal(e.migrated,true);assert.equal(FishEngine.restore({}),null);assert.equal(FishEngine.restore(null),null);
});
