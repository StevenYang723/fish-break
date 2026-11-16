import test from 'node:test';
import assert from 'node:assert/strict';
import {FishEngine,isBossStage,difficultyFactor} from './engine.js';
function boss(stage=3){const e=new FishEngine(17,{skipDraft:true});e.stage=stage;e.setup();return e;}
function land(e,points=1000){const f=e.fish[0];f.x=210;f.y=504;f.vx=0;f.vy=50;f.points=points;e.shotTime=14;e.step(1/120);}
function finish(e){for(let n=0;n<1300&&e.state==='flying';n++)e.step(1/60);assert.notEqual(e.state,'flying');}
test('boss schedule, shot allowance, and permanent anchors match all depths',()=>{
 for(const n of [1,2,4,6,9,11,14,16])assert.equal(isBossStage(n),false);
 for(const n of [3,10,15,20]){const e=boss(n);assert.ok(e.boss);assert.equal(e.maxShots,4);assert.equal(e.bossAnchors.length,2);assert.equal(e.boss.hp,e.target);assert.equal(e.bossAnchors[0].hp,n===3?2:3);assert.ok(e.pegs.filter(p=>p.kind!=='anchor').every(p=>Math.hypot(p.x-210,p.y-276)>=69));}
 const e=boss();e.perks={extra:2,tentacle:3,gaze:2};e.setup();assert.equal(e.maxShots,5);
});
test('direct hits, indirect skills and bomb splash each damage anchors without bypassing durability',()=>{
 const e=boss();e.shoot();const f=e.fish[0],a=e.bossAnchors[0];e.pop(a,f);assert.equal(a.hp,1);assert.equal(a.alive,true);assert.equal(f.hits,0);e.pop(a,f,true);assert.equal(a.alive,false);assert.equal(e.bossArmor,.3);assert.equal(e.boss.sealBroken,true);
 const other=e.bossAnchors[0];e.pegs=[other,{id:999,x:other.x+20,y:other.y,r:8,kind:'bomb',alive:true}];e.pop(e.pegs[1],f,true);assert.equal(other.hp,1);assert.equal(other.alive,true);e.pop(other,f,true);assert.equal(e.bossArmor,0);
});
test('each surviving anchor reduces settlement damage and full break grants a bonus',()=>{
 for(const [remaining,factor] of [[2,.4],[1,.7],[0,1.25]]){const e=boss();e.shoot();const f=e.fish[0];for(const a of e.bossAnchors.slice(remaining)){e.pop(a,f,true);e.pop(a,f,true);}e.pegs.forEach(p=>{if(p.kind!=='anchor')p.alive=false;});const hp=e.boss.hp;land(e,100);assert.equal(e.lastShot,300);assert.equal(e.lastShotDamage,Math.round(300*factor));assert.equal(e.boss.hp,hp-e.lastShotDamage);assert.equal(e.total,300);}
});
test('large score does not clear a living boss; death clears with no counterattack or further supply',()=>{
 const e=boss();e.shoot();e.score=e.target+100;land(e,1);assert.equal(e.state,'ready');assert.ok(e.boss.hp>0);assert.equal(e.boss.turn,1);e.shoot();e.boss.hp=1;const turn=e.boss.turn;land(e,100);assert.equal(e.state,'cleared');assert.equal(e.boss.hp,0);assert.equal(e.boss.turn,turn);assert.equal(e.events.at(-1).state,'cleared');assert.equal(e.shoot(),false);
});
test('seal preview matches collector penalty and breaking an anchor cancels it for this shot',()=>{
 const e=boss();e.boss.turn=2;assert.match(e.bossIntent,/封锁/);assert.equal(e.bins()[2].m,1.5);e.shoot();const a=e.bossAnchors[0],f=e.fish[0];e.pop(a,f);e.pop(a,f);assert.equal(e.bins()[2].m,3);assert.equal(e.boss.sealBroken,true);assert.match(e.bossIntent,/封锁解除/);
});
test('horizontal sweep is forecast before shooting and tied to its own anchor',()=>{
 const e=boss();assert.match(e.bossIntent,/左钳/);e.shoot();e.currents=[];const f=e.fish[0];f.x=210;f.y=345;f.vx=0;f.vy=0;e.step(1/120);assert.ok(f.vx>0);const a=e.bossAnchors.find(p=>p.side===0);e.pop(a,f,true);e.pop(a,f,true);f.x=210;f.y=345;f.vx=0;f.vy=0;e.step(1/120);assert.equal(f.vx,0);
});
test('boss supply and relic regrowth cannot restore destroyed anchors or consumed bubbles',()=>{
 const e=boss();e.perks.blackTide=2;e.shoot();const f=e.fish[0];for(const a of e.bossAnchors){e.pop(a,f,true);e.pop(a,f,true);}const bubble=e.pegs.find(p=>p.kind!=='anchor');bubble.alive=false;bubble.consumed=true;e.pegs.filter(p=>p.kind!=='anchor').forEach(p=>p.alive=false);e.regrow();e.bossSupply();assert.equal(e.bossAnchors.length,0);assert.equal(bubble.alive,false);assert.ok(e.pegs.some(p=>p.alive));
});
test('corruption offerings never consume objectives, but all normal corruption rules still apply',()=>{
 const e=boss();e.perks={tentacle:3,gaze:2,brood:1};e.setup();e.shoot();assert.equal(e.bossAnchors.length,2);assert.equal(e.pegs.filter(p=>p.consumed).length,2);assert.equal(e.maxShots,3);assert.equal(e.bins()[0].m,.5);
});
test('mid-shot boss state, broken anchors, score and next action survive save/restore exactly',()=>{
 const e=boss(10);e.perks={volley:1,chain:1,rich:2,maw:1};e.setup();e.shoot(-.9);for(let i=0;i<150;i++)e.step(1/60);const copy=FishEngine.restore(e.snapshot());finish(e);finish(copy);assert.deepEqual(copy.boss,e.boss);assert.deepEqual(copy.pegs,e.pegs);assert.equal(copy.lastShotDamage,e.lastShotDamage);assert.equal(copy.state,e.state);
});
test('old runs keep current map and spent shots; boss rules start at the next generated stage',()=>{
 const old=new FishEngine(23,{skipDraft:true}).snapshot();delete old.rulesVersion;delete old.boss;old.stage=3;old.shots=1;old.total=900;old.target=300;const e=FishEngine.restore(old);assert.equal(e.boss,null);assert.equal(e.shots,1);assert.equal(e.target,300);assert.equal(e.total,900);assert.deepEqual(e.pegs,old.pegs);e.stage=10;e.setup();assert.ok(e.boss);assert.equal(e.maxShots,4);
});
test('difficulty continues past ten without scaling from the player score or chosen build',()=>{
 assert.ok(difficultyFactor(15)>difficultyFactor(10));assert.ok(difficultyFactor(25)>difficultyFactor(15));const a=boss(11),b=boss(11);b.perks={rich:3,gold:1,maw:1};b.total=999999;b.setup();assert.equal(a.target,b.target);assert.equal(a.mapBudget,b.mapBudget);assert.equal(a.boss,null);
});
