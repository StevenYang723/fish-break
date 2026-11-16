import test from 'node:test';
import assert from 'node:assert/strict';
import {FishEngine,isBossStage} from './engine.js';
import {BOSS_TYPES,bossAtStage,bossFactor,trialBuild} from './boss-rules.js';
function run(kind,seed=17){const e=new FishEngine(seed,{skipDraft:true});e.stage=BOSS_TYPES[kind].stage;e.setup();return e;}
function fire(kind){const e=run(kind);e.shoot();return e;}
function clearTargets(e){for(const p of e.pegs.filter(p=>p.kind==='anchor'))p.alive=false;}
function finish(e){for(let i=0;i<1300&&e.state==='flying';i++)e.step(1/60);assert.notEqual(e.state,'flying');}
test('four unique guardians occupy depth milestones and rotate in endless mode',()=>{
 for(const [n,kind] of [[3,'crab'],[5,'jelly'],[8,'angler'],[10,'eye'],[15,'jelly'],[20,'angler'],[25,'eye'],[30,'crab'],[35,'jelly']]){const e=new FishEngine(9,{skipDraft:true});e.stage=n;e.setup();assert.equal(bossAtStage(n),kind);assert.equal(e.boss.kind,kind);assert.equal(e.maxShots,4);assert.equal(e.target,e.boss.maxHp);}
 for(const n of [1,2,4,6,7,9,11,14,16])assert.equal(isBossStage(n),false);
});
test('all boss hitboxes stay clear of scoring bubbles across routes and seeds',()=>{
 for(const kind of Object.keys(BOSS_TYPES))for(let seed=1;seed<=30;seed++){const e=run(kind,seed);for(const p of e.pegs.filter(p=>p.kind!=='anchor'))assert.ok(e.bossBody.every(c=>Math.hypot(p.x-c.x,p.y-c.y)>=c.r+p.r),kind+' '+seed);assert.ok(e.mapCount>=50);assert.ok(e.bossBody.length>0);}
});
test('each new silhouette resolves overlapping body shapes without trapped fish or invalid velocity',()=>{
 for(const kind of ['jelly','angler','eye']){const e=fire(kind);for(let x=115;x<300;x+=7)for(let y=185;y<335;y+=7){const f=e.makeFish(x,y,0,200);e.hitBoss(f,true);assert.ok([f.x,f.y,f.vx,f.vy].every(Number.isFinite));assert.ok(e.bossBody.every(c=>Math.hypot(f.x-c.x,f.y-c.y)>=c.r+f.r-.01),kind+' stuck at '+x+','+y);}assert.equal(e.shotImpactDamage,0);}
});
test('jelly warns before its live field, punishes one time per pulse, and spares safe lanes',()=>{
 const e=fire('jelly'),f=e.fish[0];f.points=1000;f.x=105;f.y=350;e.shotTime=.8;assert.equal(e.bossThreat.warning,true);e.applyBossHazard(f,.01);assert.equal(f.points,1000);e.shotTime=1.3;e.applyBossHazard(f,.01);assert.equal(f.points,800);e.applyBossHazard(f,.01);assert.equal(f.points,800);e.shotTime=5.1;e.applyBossHazard(f,.01);assert.equal(f.points,640);const safe=e.makeFish(210,350,0,0);safe.points=1000;e.applyBossHazard(safe,.01);assert.equal(safe.points,1000);
});
test('breaking either capacitor cancels electricity and exposes jelly until the next turn',()=>{
 const e=fire('jelly'),f=e.fish[0],p=e.bossAnchors[1];assert.equal(bossFactor(e),.55);e.pop(p,f,true);assert.equal(e.boss.exposed,false);e.pop(p,f,true);assert.equal(e.boss.exposed,true);assert.equal(bossFactor(e),1.6);e.shotTime=1.3;assert.equal(e.bossThreat.active,false);const hp=e.boss.hp;e.damageBoss(100,'volley');assert.equal(hp-e.boss.hp,160);e.prepareBossTurn();assert.equal(bossFactor(e),.55);assert.equal(e.bossAnchors.length,2);assert.ok(e.bossAnchors.every(p=>p.hp===p.maxHp));
});
test('angler suction moves fish toward the mouth only while open and not interrupted',()=>{
 const e=fire('angler'),f=e.fish[0];f.x=95;f.y=350;f.vx=0;f.vy=0;e.shotTime=.5;e.applyBossHazard(f,.1);assert.equal(f.vx,0);e.shotTime=1.5;e.applyBossHazard(f,.1);assert.ok(f.vx>0);assert.ok(f.vy<0);e.boss.stagger=1;f.vx=f.vy=0;e.applyBossHazard(f,.1);assert.equal(f.vx,0);assert.equal(f.vy,0);
});
test('angler belly has a timed counterattack, closed bite and persistent per-shot exposure',()=>{
 const e=fire('angler'),f=e.fish[0];function belly(){f.x=210;f.y=324;f.vx=0;f.vy=-200;f.bossCooldown=0;}
 belly();f.points=1000;e.shotTime=.5;e.hitBoss(f);assert.equal(f.points,850);assert.equal(e.boss.exposed,false);belly();e.shotTime=1.5;const hp=e.boss.hp;e.hitBoss(f);assert.equal(hp-e.boss.hp,e.baseValue*4*3);assert.equal(e.boss.exposed,true);assert.equal(e.boss.stagger,1.4);assert.equal(bossFactor(e),1.5);assert.ok(e.events.some(v=>v.type==='bossDamage'&&v.weak));e.prepareBossTurn();assert.equal(e.boss.exposed,false);
});
test('angler tail contact cannot trigger the mouth weak point or bite penalty',()=>{
 for(const time of [.5,1.5]){const e=fire('angler'),f=e.fish[0];e.shotTime=time;f.x=146;f.y=293;f.vx=0;f.vy=-200;f.points=1000;e.hitBoss(f);assert.equal(e.boss.exposed,false);assert.equal(f.points,1000);assert.ok(e.events.some(v=>v.type==='bossDamage'&&!v.weak));}
});
test('eye seals reject wrong order, preserve progress and unlock permanent vulnerability',()=>{
 const e=fire('eye'),f=e.fish[0],order=e.boss.runeOrder;const wrong=e.bossAnchors.find(p=>p.side===order[1]);e.pop(wrong,f,true);assert.equal(wrong.hp,1);assert.equal(f.points,0);assert.equal(e.boss.runeProgress,0);for(const side of order){const p=e.bossAnchors.find(p=>p.side===side);e.pop(p,f,true);}assert.equal(e.boss.runeProgress,3);assert.equal(e.bossAnchors.length,0);assert.equal(bossFactor(e),1.75);e.prepareBossTurn();e.bossSupply();e.regrow();assert.equal(e.bossAnchors.length,0);assert.equal(e.boss.runeProgress,3);
});
test('eye telegraphs exact sealed bins and restores them only after all seals break',()=>{
 const e=run('eye');e.boss.turn=1;assert.deepEqual(e.bins().map(b=>b.m),[1,1,3,1,1]);e.perks.maw=1;assert.equal(e.bins()[2].m,5);clearTargets(e);assert.deepEqual(e.bins().map(b=>b.m),[1,2,5,2,1]);
});
test('deep bosses rage once at half HP and expose stronger attacks without changing remaining shots',()=>{
 for(const kind of ['jelly','angler','eye']){const e=fire(kind),shots=e.shots;const h=e.bossThreat;e.damageBoss(e.boss.maxHp*.51/bossFactor(e),'volley');assert.equal(e.boss.enraged,true);assert.equal(e.shots,shots);assert.equal(e.events.filter(v=>v.type==='bossRage').length,1);e.damageBoss(1,'impact');assert.equal(e.events.filter(v=>v.type==='bossRage').length,1);if(kind==='jelly')assert.equal(e.bossThreat.lanes.length,2);if(kind==='angler')assert.ok(e.bossThreat.force>h.force);if(kind==='eye')assert.equal(e.bossThreat.horizontal,365);}
});
test('gaze cross only hurts within its shown bands, stops during stagger and never double-taxes a crossing',()=>{
 const e=fire('eye'),f=e.fish[0];e.boss.enraged=true;e.shotTime=1.2;f.x=250;f.y=365;f.points=1000;e.applyBossHazard(f,.01);assert.equal(f.points,600);f.x=105;e.applyBossHazard(f,.01);assert.equal(f.points,600);e.shotTime=4;e.boss.stagger=1;e.applyBossHazard(f,.01);assert.equal(f.points,600);e.boss.stagger=0;e.applyBossHazard(f,.01);assert.equal(f.points,360);
});
test('weak eye impact interrupts rays but regular armored hits do not',()=>{
 const e=fire('eye'),f=e.fish[0];e.shotTime=1.2;f.x=210;f.y=203;f.vy=200;e.hitBoss(f);assert.equal(e.boss.stagger,0);clearTargets(e);f.x=210;f.y=203;f.vy=200;f.bossCooldown=0;e.hitBoss(f);assert.equal(e.boss.stagger,.8);assert.equal(e.bossThreat.active,false);
});
test('attack phase, per-pulse protection and weak-point state survive mid-flight saves deterministically',()=>{
 for(const kind of ['jelly','angler','eye']){const e=fire(kind);e.shotTime=1.3;e.fish[0].x=105;e.fish[0].y=350;e.fish[0].points=1000;e.applyBossHazard(e.fish[0],.01);if(kind==='jelly'){e.pop(e.bossAnchors[0],e.fish[0],true);e.pop(e.bossAnchors[0],e.fish[0],true);}const copy=FishEngine.restore(e.snapshot());finish(e);finish(copy);assert.deepEqual(copy.boss,e.boss);assert.equal(copy.total,e.total);assert.deepEqual(copy.pegs,e.pegs);assert.equal(copy.state,e.state);}
});
test('old crab saves stay crabs at stage ten and current nonboss saves never gain a boss mid-room',()=>{
 const old=run('crab');old.stage=10;delete old.boss.kind;const snap=old.snapshot(),copy=FishEngine.restore(snap);assert.equal(copy.boss.kind,'crab');assert.equal(copy.boss.hp,old.boss.hp);assert.deepEqual(copy.pegs,old.pegs);const normal=new FishEngine(6,{skipDraft:true});normal.stage=5;const resumed=FishEngine.restore(normal.snapshot());assert.equal(resumed.boss,null);resumed.setup();assert.equal(resumed.boss.kind,'jelly');
});
test('deep boss damage budgets and same-species endless variants grow with depth',()=>{
 const budgets=['crab','jelly','angler','eye'].map(k=>run(k).boss.maxHp);for(let i=1;i<budgets.length;i++)assert.ok(budgets[i]>budgets[i-1]);for(const kind of ['jelly','angler','eye']){const e=run(kind),base=e.boss.maxHp;e.stage={jelly:15,angler:20,eye:25}[kind];e.setup();assert.ok(e.boss.maxHp>base);assert.ok(e.bossThreat.scale>1||e.bossThreat.force>390);}
});
test('all trial builds terminate and dead guardians stop attacks and post-mortem scoring damage',()=>{
 for(const kind of Object.keys(BOSS_TYPES))for(let seed=1;seed<=12;seed++){const e=run(kind,seed);e.perks=trialBuild(kind);e.setup();e.shoot((seed%5-2)*.35);finish(e);assert.ok(Number.isFinite(e.total));assert.ok(e.boss.hp>=0);e.boss.hp=0;assert.equal(e.bossThreat.kind,'none');const hp=e.boss.hp;assert.equal(e.damageBoss(100,'volley'),0);assert.equal(e.boss.hp,hp);}
});
