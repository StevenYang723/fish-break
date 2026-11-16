import test from 'node:test';
import assert from 'node:assert/strict';
import {FishEngine,isBossStage,difficultyFactor,BOSS_BODY} from './engine.js';
function boss(stage=3){const e=new FishEngine(17,{skipDraft:true});e.stage=stage;e.setup({bossKind:'crab'});return e;}
function land(e,points=1000){const f=e.fish[0];f.x=210;f.y=504;f.vx=0;f.vy=50;f.points=points;e.shotTime=14;e.step(1/120);}
function finish(e){for(let n=0;n<1300&&e.state==='flying';n++)e.step(1/60);assert.notEqual(e.state,'flying');}
test('boss schedule, shot allowance, and permanent anchors match all depths',()=>{
 for(const n of [1,2,4,6,7,9,11,14,16])assert.equal(isBossStage(n),false);
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
 const e=boss(10);e.perks={volley:1,chain:1,rich:2,maw:1};e.setup({bossKind:'crab'});e.shoot(-.9);for(let i=0;i<150;i++)e.step(1/60);const copy=FishEngine.restore(e.snapshot());finish(e);finish(copy);assert.deepEqual(copy.boss,e.boss);assert.deepEqual(copy.pegs,e.pegs);assert.equal(copy.lastShotDamage,e.lastShotDamage);assert.equal(copy.state,e.state);
});
test('old runs keep current map and spent shots; boss rules start at the next generated stage',()=>{
 const old=new FishEngine(23,{skipDraft:true}).snapshot();delete old.rulesVersion;delete old.boss;old.stage=3;old.shots=1;old.total=900;old.target=300;const e=FishEngine.restore(old);assert.equal(e.boss,null);assert.equal(e.shots,1);assert.equal(e.target,300);assert.equal(e.total,900);assert.deepEqual(e.pegs,old.pegs);e.stage=10;e.setup();assert.ok(e.boss);assert.equal(e.maxShots,4);
});
test('difficulty continues past ten without scaling from the player score or chosen build',()=>{
 assert.ok(difficultyFactor(15)>difficultyFactor(10));assert.ok(difficultyFactor(25)>difficultyFactor(15));const a=boss(11),b=boss(11);b.perks={rich:3,gold:1,maw:1};b.total=999999;b.setup();assert.equal(a.target,b.target);assert.equal(a.mapBudget,b.mapBudget);assert.equal(a.boss,null);
});

function contact(e,index=0){const c=BOSS_BODY[index],f=e.fish[0];f.x=c.x;f.y=c.y-c.r-f.r+1;f.vx=0;f.vy=200;return f;}
test('shell and both claws bounce fish and deal immediate damage before landing',()=>{
 for(let i=0;i<3;i++){const e=boss();e.shoot();const f=contact(e,i),hp=e.boss.hp;assert.equal(e.hitBoss(f),true);assert.ok(f.vy<0);assert.ok(BOSS_BODY.every(c=>Math.hypot(f.x-c.x,f.y-c.y)>=c.r+f.r));assert.ok(e.boss.hp<hp);assert.equal(e.shotImpactDamage,hp-e.boss.hp);assert.equal(e.state,'flying');assert.equal(e.score,0);assert.equal(f.points,0);assert.match(e.boss.lastAttack,/实体命中/);assert.equal(e.events.filter(v=>v.type==='bossDamage').length,1);}
});
test('near misses and separating contacts cause no damage, while cooldown still allows physical bounces',()=>{
 const e=boss();e.shoot();const f=contact(e),hp=e.boss.hp;f.y-=2;const pos=[f.x,f.y,f.vx,f.vy];assert.equal(e.hitBoss(f),false);assert.deepEqual([f.x,f.y,f.vx,f.vy],pos);assert.equal(e.boss.hp,hp);
 contact(e);f.vy=-200;e.hitBoss(f);assert.equal(e.boss.hp,hp);contact(e);e.hitBoss(f);const after=e.boss.hp;contact(e);e.hitBoss(f);assert.ok(f.vy<0);assert.equal(e.boss.hp,after);assert.equal(f.bossHits,1);f.bossCooldown=0;contact(e);e.hitBoss(f);assert.equal(f.bossHits,2);
});
test('each fish has its own hit cooldown and child damage respects armor and corruption',()=>{
 for(const remaining of [2,1,0]){const e=boss();e.perks={tentacle:3};e.setup();e.shoot();for(const a of e.bossAnchors.slice(remaining))a.alive=false;const factor=remaining?1-.3*remaining:1.25;const f=contact(e);e.hitBoss(f);assert.equal(e.shotImpactDamage,Math.round(e.baseValue*4*.9*factor));const child=e.makeFish(f.x,f.y,0,200,true);child.y=BOSS_BODY[0].y-BOSS_BODY[0].r-child.r+1;const hp=e.boss.hp;e.hitBoss(child);assert.equal(hp-e.boss.hp,Math.round(e.baseValue*4*.65*.9*factor));assert.equal(child.bossHits,1);}
});
test('impact damage never enters peg points or the later volley a second time',()=>{
 const e=boss();e.shoot();const f=contact(e),hp=e.boss.hp;f.points=100;e.hitBoss(f);const impact=hp-e.boss.hp;assert.equal(f.points,100);land(e,100);assert.equal(e.lastVolleyDamage,120);assert.equal(e.lastImpactDamage,impact);assert.equal(e.lastShotDamage,impact+120);assert.equal(e.boss.hp,hp-impact-120);assert.equal(e.score,300);assert.equal(e.total,300);assert.deepEqual(e.events.filter(v=>v.type==='bossDamage').map(v=>v.source),['impact','volley']);
});
test('an impact kill clamps HP, recalls fish and settles exactly once without a counterattack',()=>{
 const e=boss();e.perks={volley:1,rebirth:1};e.setup();e.shoot();e.pegs.forEach(p=>{if(p.kind!=='anchor')p.alive=false;});e.bumpers=[];e.rotors=[];e.altars=[];e.currents=[];e.boss.hp=1;contact(e);e.step(1/120);assert.equal(e.boss.hp,0);assert.equal(e.state,'cleared');assert.equal(e.fish.length,0);assert.equal(e.lastShotDamage,1);assert.equal(e.lastVolleyDamage,0);assert.equal(e.boss.turn,0);assert.equal(e.events.filter(v=>v.type==='bossDamage'&&v.defeated).length,1);assert.equal(e.events.filter(v=>v.type==='settle').length,1);assert.equal(e.events.some(v=>v.type==='supply'),false);const hp=e.boss.hp;e.step(1);assert.equal(e.boss.hp,hp);assert.equal(e.events.filter(v=>v.type==='settle').length,1);
});
test('overlapping body boundaries resolve without trapping fish or farming timeout damage',()=>{
 const e=boss();e.shoot();for(let x=125;x<=295;x+=5)for(let y=196;y<=320;y+=5){const f=e.makeFish(x,y,0,200);e.boss.hp=100000;e.hitBoss(f,true);assert.ok([f.x,f.y,f.vx,f.vy].every(Number.isFinite));assert.ok(BOSS_BODY.every(c=>Math.hypot(f.x-c.x,f.y-c.y)>=c.r+f.r-.01),`stuck at ${x},${y}`);}assert.equal(e.shotImpactDamage,0);
});
test('v2.3 mid-flight saves preserve HP and shots while adding finite collision fields',()=>{
 const e=boss(10);e.shoot();e.boss.hp-=350;e.altars=[{x:210,y:224,r:16,charges:0}];const data=e.snapshot();delete data.combatVersion;delete data.shotImpactDamage;delete data.lastImpactDamage;delete data.lastVolleyDamage;delete data.boss.hitFlash;delete data.boss.lastAttack;for(const f of data.fish){delete f.bossCooldown;delete f.bossHits;}const copy=FishEngine.restore(data);assert.equal(copy.boss.hp,e.boss.hp);assert.equal(copy.shots,e.shots);assert.deepEqual(copy.pegs,e.pegs);assert.equal(copy.fish[0].bossCooldown,0);assert.equal(copy.shotImpactDamage,0);assert.equal(copy.altars[0].x,50);contact(copy);copy.step(1/120);assert.ok(copy.boss.hp<e.boss.hp);assert.ok(Number.isFinite(copy.fish[0].bossCooldown));finish(copy);
});
test('settled hit flashes fade while damage history remains readable, including old saves',()=>{
 const e=boss();e.shoot();land(e,100);assert.ok(e.boss.hitFlash>0);const history=e.boss.lastAttack;for(let n=0;n<4;n++)e.step(.1);assert.equal(e.boss.hitFlash,0);assert.equal(e.boss.lastAttack,history);const old=e.snapshot();delete old.combatVersion;delete old.lastVolleyDamage;delete old.boss.lastAttack;const copy=FishEngine.restore(old);assert.equal(copy.lastVolleyDamage,e.lastShotDamage);assert.match(copy.boss.lastAttack,/上次落缸轰击/);
});
