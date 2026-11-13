export const W=420,H=544,FINAL_STAGE=10;
export const BIOMES=[
 {name:'日光浅滩',depth:30,desc:'阳光还在，冒险刚刚开始',colors:['#123e58','#175264','#1b605d'],accent:'#71eed9'},
 {name:'荧光海林',depth:350,desc:'海流与热泉，改变每次落点',colors:['#102f42','#123e47','#185247'],accent:'#72e9b4'},
 {name:'暮光裂谷',depth:1100,desc:'漩涡牵引，珍珠在黑暗中发光',colors:['#131b43','#253053','#26384c'],accent:'#9998ff'},
 {name:'无光深渊',depth:2800,desc:'古神之眼，注视着每次弹射',colors:['#100f29','#211e3a','#2d2545'],accent:'#cd8cef'},
 {name:'拉莱耶遗城',depth:6000,desc:'沉睡的星辰，正在回应你的呼唤',colors:['#0b1723','#142c32','#173c3a'],accent:'#94e1a2'}
];
export const LEVELS=BIOMES.map(b=>[b.name,b.desc]);
export const ROUTES=[
 {id:'bloom',icon:'♧',name:'繁生珊瑚',desc:'每发结束，20% 已破气泡再生一次。'},
 {id:'treasure',icon:'◇',name:'珍珠矿脉',desc:'额外 8 个得分点，更多珍珠与金泡。'},
 {id:'current',icon:'≋',name:'湍流航道',desc:'强横向洋流；所有气泡价值增加 25%。'},
 {id:'echo',icon:'↟',name:'回音海沟',desc:'每条主鱼首次落底反弹，再多收一轮。'},
 {id:'ritual',icon:'◉',name:'古神祭场',desc:'新增古神祭坛；下一次至少出现 2 个禁忌技能。'}
];
export const PERKS=[
 {id:'split',icon:'⋈',name:'分身小鱼',tag:'分裂',desc:'主鱼首次撞墙，分裂一条幼鱼。',max:1},
 {id:'rich',icon:'✦',name:'闪亮鳞片',tag:'财富',desc:'普通气泡基础分增加 40%，最多叠加 3 次。',max:3},
 {id:'chain',icon:'ϟ',name:'连锁闪电',tag:'连锁',desc:'每直接撞破 3 个气泡，电破最近 2 个。',max:1},
 {id:'extra',icon:'＋',name:'再来一条',tag:'续航',desc:'每关多 1 次发射，最多叠加 2 次。',max:2},
 {id:'wide',icon:'↔',name:'大号金鱼缸',tag:'幸运',desc:'中央高倍率鱼缸加宽 26 像素。',max:2},
 {id:'combo',icon:'∞',name:'连击引擎',tag:'连锁',desc:'每 3 次直接碰撞，额外获得 2 倍本层基础分。',max:2},
 {id:'spring',icon:'⌁',name:'机关专家',tag:'机关',desc:'每次触发弹簧、转轮、热泉，多得 2 倍基础分。',max:2},
 {id:'gold',icon:'◇',name:'淘金小队',tag:'财富',desc:'金色气泡和珍珠的得分翻倍。',max:1},
 {id:'last',icon:'↗',name:'压轴选手',tag:'爆发',desc:'每关最后一发的全部结算分乘 1.5。',max:1},
 {id:'safe',icon:'♡',name:'保底好运',tag:'幸运',desc:'两侧鱼缸基础倍率升至 ×2；受到侵蚀后为 ×1。',max:1},
 {id:'volley',icon:'⋮',name:'鱼群齐射',tag:'分裂',desc:'每次发射附带两条扇形飞出的幼鱼。',max:1},
 {id:'blast',icon:'✺',name:'爆破鳞片',tag:'爆发',desc:'每撞破 4 个气泡，炸开 58 范围内最多 4 个；叠加增加目标。',max:2},
 {id:'magnet',icon:'∪',name:'金币磁鳍',tag:'幸运',desc:'进入底部区域后，向中央鱼缸吸引。',max:2},
 {id:'pierce',icon:'➶',name:'穿浪鱼雷',tag:'穿透',desc:'每条鱼前 3 次碰撞穿透气泡，并各加 1 倍基础分；叠加增加次数。',max:2},
 {id:'wall',icon:'⟡',name:'回弹红包',tag:'机关',desc:'每条鱼前 5 次撞墙，各获得 2 倍基础分。',max:2},
 {id:'tentacle',icon:'ψ',name:'触须共生',tag:'克苏鲁',desc:'每 0.8 秒吞食附近气泡；每级扩大触须范围。',max:3,cult:1},
 {id:'gaze',icon:'◉',name:'深渊之眼',tag:'克苏鲁',desc:'每撞破 5 个气泡，凝视击碎远处 3 个；叠加增加目标。',max:2,cult:1},
 {id:'brood',icon:'♆',name:'不可名状之卵',tag:'克苏鲁',desc:'主鱼每撞破 6 个气泡，孵化 2 条幼体；叠加多 1 条，每发最多 7 条鱼。',max:2,cult:1},
 {id:'sacrifice',icon:'⛧',name:'血潮契约',tag:'克苏鲁',desc:'所有鱼的结算分每级增加 65%。',max:2,cult:1},
 {id:'blackTide',icon:'≈',name:'黑潮回响',tag:'克苏鲁',desc:'每发结束后，25% 已破气泡以原值重生一次；叠加提高比例。',max:2,cult:1},
 {id:'maw',icon:'⏣',name:'虚空吞口',tag:'克苏鲁',desc:'中央鱼缸结算升至 ×5。',max:1,cult:1},
 {id:'stars',icon:'✵',name:'群星归位',tag:'克苏鲁',desc:'每撞破 8 个气泡，仪式击碎 6 个；叠加增加目标。',max:2,cult:1},
 {id:'dream',icon:'☽',name:'梦魇鳃',tag:'克苏鲁',desc:'每层生成梦境漩涡；主鱼首次进入漩涡或传送门，召唤 2 条幼体。',max:1,cult:1},
 {id:'rebirth',icon:'☥',name:'深潜者再生',tag:'克苏鲁',desc:'主鱼可在落底时再弹回一次；回音航线的额外返弹优先。',max:1,cult:1}
];
export const MAX_CULT_STACKS=PERKS.filter(p=>p.cult).reduce((sum,p)=>sum+p.max,0);
export const CORRUPTION_TIERS=[
 {level:1,name:'缸口收缩',desc:'中央高倍率鱼缸缩窄 14 像素；加宽遗物仍可补偿。'},
 {level:2,name:'边缘失宠',desc:'最外侧两只鱼缸倍率减半：通常为 ×0.5；保底升级后为 ×1。'},
 {level:3,name:'收益侵蚀',desc:'每发最终结算得分降低 10%。'},
 {level:4,name:'鳞片腐蚀',desc:'直接撞破气泡的得分降低 15%；技能间接得分不受此项影响。'},
 {level:5,name:'献出一鱼',desc:'每关少 1 次发射，至少保留 1 次；额外发射遗物仍生效。'},
 {level:6,name:'深海献祭',desc:'每次发射前，随机献祭 2 颗气泡；无得分、无爆炸、无法再生。'},
 {level:7,name:'幼体供养',desc:'每次成功分裂或召唤，扣除母鱼当前气泡分的 25%；达到数量上限不扣分。'},
 {level:8,name:'返生血税',desc:'每次落底返弹，失去主鱼当前气泡分的 50%；回音航线也生效。'},
 {level:9,name:'梦境遗忘',desc:'主鱼每发首次进入漩涡或传送门，清空其当前气泡分；之后仍可继续得分。'},
 {level:10,name:'黑潮枯萎',desc:'未变成幽灵的气泡价值再降低 15%；幽灵气泡保留完整原值。'}
];
export function corruptionPenalty(count){
 const stacks=Number.isFinite(count)?Math.min(MAX_CULT_STACKS,Math.max(0,Math.floor(count))):0,percent=stacks>=3?10+Math.max(0,stacks-10)*5:0;
 return{stacks,percent,multiplier:1-percent/100,centerShrink:stacks>=1?14:0,edgeMultiplier:stacks>=2?.5:1,directMultiplier:stacks>=4?.85:1,shotLoss:stacks>=5?1:0,offerings:stacks>=6?2:0,broodTax:stacks>=7?.25:0,rebounceTax:stacks>=8?.5:0,forget:stacks>=9,originalMultiplier:stacks>=10?.85:1};
}
export function nextCorruptionTier(count){const level=Math.min(MAX_CULT_STACKS,count+1);return CORRUPTION_TIERS.find(t=>t.level===level)||{level,name:'深渊加压',desc:'结算扣分再增加 5 个百分点，提升至 '+corruptionPenalty(level).percent+'%；之前的负面全部保留。'};}
export function rng(seed){let s=seed>>>0;return()=>{s+=0x6D2B79F5;let t=Math.imul(s^s>>>15,1|s);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296;};}
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export class FishEngine{
 constructor(seed=Date.now(),{skipDraft=false}={}){this.version=2;this.balanceVersion=2;this.seed=seed;this.stage=1;this.total=0;this.perks={};this.bestCombo=0;this.rerolls=3;this.draftRoll=0;this.routeId='treasure';this.events=[];this.setup();if(!skipDraft)this.state='draft';}
 get biomeIndex(){return Math.min(4,Math.floor((this.stage-1)/2));}
 get biome(){return BIOMES[this.biomeIndex];}
 get depth(){return this.stage>10?8500+(this.stage-10)*1200:this.biome.depth+(this.stage-1)%2*[120,300,700,1200,2500][this.biomeIndex];}
 get cultCount(){return PERKS.reduce((sum,p)=>sum+(p.cult?(this.perks[p.id]||0):0),0);}
 get corruption(){return this.cultCount;}
 get curse(){return corruptionPenalty(this.cultCount);}
 get cultTier(){return this.corruption===0?0:this.corruption<3?1:this.corruption<6?2:this.corruption<9?3:4;}
 get cultName(){return ['理智清明','低语侵染','古神凝视','异化共生','旧日苏醒'][this.cultTier];}
 get route(){return ROUTES.find(r=>r.id===this.routeId)||ROUTES[1];}
 setup(){
  const random=rng(this.seed+this.stage*731+ROUTES.findIndex(r=>r.id===this.routeId)*229),tier=this.biomeIndex,extraDepth=Math.max(0,this.stage-10);
  this.baseValue=10+tier*6+extraDepth*3;this.score=0;this.maxShots=Math.max(1,3+(this.perks.extra||0)-this.curse.shotLoss);this.shots=this.maxShots;
  this.fish=[];this.time=0;this.state='ready';this.shotPoints=0;this.shotGross=0;this.lastShot=0;this.lastShotGross=0;this.lastShotDeducted=0;this.events=[];this.nextFishId=0;this.draftRoll=0;
  this.pegs=[];this.bumpers=[];this.portals=[];this.rotors=[];this.currents=[];this.vents=[];this.wells=[];this.altars=[];
  this.layout=Math.floor(random()*4);this.flowSign=random()<.5?-1:1;const mirror=random()<.5?-1:1;
  if(this.stage>=2)this.bumpers=[{x:mirror===1?102:318,y:265,r:16},{x:mirror===1?312:108,y:369,r:17}];
  if(this.stage>=3)this.currents=[{x:0,y:270,w:420,h:62,ax:this.flowSign*(this.routeId==='current'?220:110)}];
  if(this.routeId==='current'&&!this.currents.length)this.currents=[{x:0,y:255,w:420,h:70,ax:this.flowSign*200}];
  if(this.stage>=4)this.vents=[{x:mirror===1?78:342,y:448,r:17}];
  if(this.stage>=5)this.rotors=[{x:mirror===1?270:150,y:180,r:28,angle:random()*Math.PI}];
  if(this.stage>=6||this.perks.dream)this.wells=[{x:210,y:312,r:60,spin:mirror}];
  if(this.stage>=7)this.portals=[{x:42,y:345,r:17,to:1},{x:377,y:145,r:17,to:0}];
  if(this.stage>=8||this.routeId==='ritual')this.altars=[{x:210,y:224,r:19,charges:0}];
  if(this.stage>=9)this.vents.push({x:mirror===1?342:78,y:448,r:17});
  const rows=6+tier,cols=7+Math.ceil(tier/2),desired=rows*cols+(this.routeId==='treasure'?8:0);
  const blocked=(x,y)=>[...this.bumpers,...this.vents,...this.portals,...this.altars].some(b=>Math.hypot(x-b.x,y-b.y)<b.r+12)||this.rotors.some(r=>Math.hypot(x-r.x,y-r.y)<r.r+10);
  const add=(x,y)=>{if(blocked(x,y)||this.pegs.some(p=>Math.hypot(x-p.x,y-p.y)<20))return false;const roll=random(),boost=this.routeId==='treasure'?.12:0;const kind=roll<.035+tier*.025+boost*.4?'pearl':roll<.07+tier*.05+boost*.4?'bomb':roll<.20+tier*.05+boost?'gold':'normal';this.pegs.push({id:this.pegs.length,x,y,r:tier>2?7.6:8.5,kind,gold:kind==='gold',alive:true,revived:false,spectral:false});return true;};
  for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
   const x=35+col*350/(cols-1),y=128+row*307/(rows-1),dx=this.layout===0?Math.sin(row*1.5)*12:this.layout===1?(row%2?9:-9):this.layout===2?Math.sin(col+row)*9:Math.cos(row+col*.6)*12,dy=this.layout===2?Math.cos(col*1.3)*10:this.layout===3?Math.abs(col-(cols-1)/2)*4:0;
   if(this.layout===1){const a=col/cols*Math.PI*2+row*.23,r=38+row*18;add(clamp(210+Math.cos(a)*r,24,396),clamp(285+Math.sin(a)*r*.93,116,451));}
   else add(clamp(x+dx+(random()-.5)*6,24,396),clamp(y+dy+(random()-.5)*5,116,451));
  }
  for(let i=0;this.pegs.length<desired&&i<3500;i++)add(25+random()*370,119+random()*333);
  this.mapBudget=this.pegs.reduce((s,p)=>s+this.pegValue(p,false),0);this.target=Math.round(this.mapBudget*(.42+Math.min(9,this.stage-1)*.14)/10)*10;this.mapCount=this.pegs.length;
 }
 pegValue(p,upgraded=true){const base=this.baseValue;let value=base*(p.kind==='pearl'?4:p.kind==='gold'?2.5:p.kind==='bomb'?1.5:1);if(upgraded){if(p.kind==='normal')value+=base*.4*(this.perks.rich||0);if((p.kind==='gold'||p.kind==='pearl')&&this.perks.gold)value*=2;}if(upgraded&&!p.spectral)value*=this.curse.originalMultiplier;if(this.routeId==='current')value*=1.25;return Math.round(value);}
 bins(){const mid=92+(this.perks.wide||0)*26-this.curse.centerShrink,other=(W-mid)/4;let x=0;return[1,2,3,2,1].map((m,i)=>{if(this.perks.maw&&i===2)m=5;if(this.perks.safe&&(i===0||i===4))m=Math.max(2,m);if(i===0||i===4)m*=this.curse.edgeMultiplier;const w=i===2?mid:other,b={x,w,m};x+=w;return b;});}
 makeFish(x,y,vx,vy,child=false){return{id:++this.nextFishId,x,y,vx,vy,r:child?6:8,points:0,hits:0,child,split:false,wallHits:0,reborn:false,echoed:false,dreamed:false,mindBroken:false,portalCooldown:0,bumperCooldown:0,ventCooldown:0,altarCooldown:0,tentacleCooldown:.3,pierces:3*(this.perks.pierce||0),trail:[]};}
 shoot(angle=0){if(this.state!=='ready'||this.shots<1||!Number.isFinite(angle))return false;angle=clamp(angle,-1.05,1.05);this.shots--;this.fish=[this.makeFish(210,52,Math.sin(angle)*360,Math.cos(angle)*360)];this.spawned=1;this.offerBubbles();if(this.perks.volley)this.spawnBrood(this.fish[0],2);this.shotPoints=0;this.shotGross=0;this.shotTime=0;this.isLast=this.shots===0;this.state='flying';this.events.push({type:'shoot'});return true;}
 spawnBrood(f,n){const before=this.spawned;for(let i=0;i<n&&this.spawned<7;i++){const a=(i%2?1:-1)*(.55+.18*Math.floor(i/2));this.fish.push(this.makeFish(clamp(f.x+(i%2?9:-9),10,410),f.y,Math.sin(a)*220,100+Math.abs(f.vy)*.4,true));this.spawned++;}const count=this.spawned-before;if(count){this.payCurse(f,this.curse.broodTax,'幼体供养');this.events.push({type:'brood',x:f.x,y:f.y});}return count;}
 payCurse(f,rate,label){const loss=Math.round(f.points*rate);if(loss){f.points=Math.max(0,f.points-loss);this.events.push({type:'curse',x:f.x,y:f.y-20,text:label+' −'+loss});}return loss;}
 offerBubbles(){const count=this.curse.offerings;if(!count)return;const random=rng(this.seed+this.stage*967+this.shots*2311),chosen=this.pegs.filter(p=>p.alive).map(p=>({p,n:random()})).sort((a,b)=>a.n-b.n).slice(0,count);for(const {p} of chosen){p.alive=false;p.consumed=true;this.events.push({type:'offering',x:p.x,y:p.y});}if(chosen.length)this.events.push({type:'curse',x:210,y:105,text:'深海献祭 · '+chosen.length+' 颗'});}
 enterDream(f){if(this.curse.forget&&!f.child&&!f.mindBroken){f.mindBroken=true;this.payCurse(f,1,'梦境遗忘');}this.dream(f);}
 starRitual(f){this.strike(f,4+2*this.perks.stars,'gaze');this.events.push({type:'ritual',x:f.x,y:f.y});}
 nearby(f,n,r=Infinity){return this.pegs.filter(p=>p.alive&&Math.hypot(p.x-f.x,p.y-f.y)<r).sort((a,b)=>Math.hypot(a.x-f.x,a.y-f.y)-Math.hypot(b.x-f.x,b.y-f.y)).slice(0,n);}
 strike(f,n,type,r=Infinity){for(const p of this.nearby(f,n,r)){this.events.push({type,x:f.x,y:f.y,tx:p.x,ty:p.y});this.pop(p,f,true);}}
 pop(p,f,indirect=false){if(!p.alive)return;p.alive=false;const value=Math.round(this.pegValue(p)*(indirect?1:this.curse.directMultiplier));f.points+=value;if(!indirect){f.hits++;this.bestCombo=Math.max(this.bestCombo,f.hits);}this.events.push({type:'pop',x:p.x,y:p.y,value,gold:p.gold,kind:p.kind,hits:indirect?0:f.hits});
  if(p.kind==='bomb'){this.events.push({type:'nova',x:p.x,y:p.y});for(const q of this.nearby(p,4,53)){q.alive=false;const val=this.pegValue(q);f.points+=val;this.events.push({type:'pop',x:q.x,y:q.y,value:val,kind:q.kind,gold:q.gold,hits:0});}}
  if(indirect)return;
  if(f.hits%3===0){if(this.perks.combo){const bonus=this.baseValue*2*this.perks.combo;f.points+=bonus;this.events.push({type:'text',x:f.x,y:f.y-22,text:'连击 +'+bonus});}if(this.perks.chain)this.strike(f,2,'lightning');}
  if(this.perks.blast&&f.hits%4===0){this.strike(f,4*this.perks.blast,'nova',58);this.events.push({type:'nova',x:f.x,y:f.y});}
  if(this.perks.gaze&&f.hits%5===0)this.strike(f,2+this.perks.gaze,'gaze');
  if(this.perks.brood&&!f.child&&f.hits%6===0)this.spawnBrood(f,1+this.perks.brood);
  if(this.perks.stars&&f.hits%8===0)this.starRitual(f);
 }
 bounce(f,x,y,r,speed=0){const dx=f.x-x,dy=f.y-y,d=Math.hypot(dx,dy);if(d>=r+f.r)return false;const nx=d>.0001?dx/d:0,ny=d>.0001?dy/d:-1;f.x=x+nx*(r+f.r+.4);f.y=y+ny*(r+f.r+.4);const dot=f.vx*nx+f.vy*ny;if(dot<0){f.vx-=1.82*dot*nx;f.vy-=1.82*dot*ny;}f.vx+=nx*speed;f.vy+=ny*speed;return true;}
 machineBonus(f,mult=0){const bonus=this.baseValue*(mult+2*(this.perks.spring||0));f.points+=bonus;return bonus;}
 dream(f){if(this.perks.dream&&!f.child&&!f.dreamed){f.dreamed=true;this.spawnBrood(f,2);}}
 step(dt){if(this.state!=='flying'||!Number.isFinite(dt)||dt<=0)return;dt=Math.min(dt,.1);const n=Math.ceil(dt/(1/120));for(let i=0;i<n;i++)this.tick(dt/n);}
 tick(dt){if(this.state!=='flying')return;this.time+=dt;this.shotTime+=dt;const dead=new Set(),draining=this.shotTime>13;
  for(const f of [...this.fish]){
   for(const k of ['portalCooldown','bumperCooldown','ventCooldown','altarCooldown','tentacleCooldown'])f[k]=Math.max(0,f[k]-dt);
   f.vy+=300*dt;
   if(!draining){for(const z of this.currents)if(f.y>z.y&&f.y<z.y+z.h)f.vx+=z.ax*dt;
    for(const well of this.wells){const dx=well.x-f.x,dy=well.y-f.y,d=Math.hypot(dx,dy);if(d<well.r&&d>4){const force=220*(1-d/well.r);f.vx+=(dx/d*force-dy/d*140*well.spin)*dt;f.vy+=(dy/d*force+dx/d*140*well.spin)*dt;this.enterDream(f);}}
    if(this.perks.magnet&&f.y>421)f.vx+=(210-f.x)*this.perks.magnet*3*dt;
   }
   f.x+=f.vx*dt;f.y+=f.vy*dt;
   if(f.x<f.r||f.x>W-f.r){f.x=clamp(f.x,f.r,W-f.r);f.vx=f.x<W/2?Math.abs(f.vx)*.92:-Math.abs(f.vx)*.92;f.wallHits++;if(this.perks.wall&&f.wallHits<=5)f.points+=this.baseValue*2*this.perks.wall;if(this.perks.split&&!f.child&&!f.split){f.split=true;this.spawnBrood(f,1);}}
   if(f.y<f.r){f.y=f.r;f.vy=Math.abs(f.vy);}
   for(const p of this.pegs){if(!p.alive)continue;if(f.pierces>0&&Math.hypot(f.x-p.x,f.y-p.y)<p.r+f.r){f.pierces--;f.points+=this.baseValue;this.pop(p,f);}else if(this.bounce(f,p.x,p.y,p.r,8))this.pop(p,f);}
   if(this.perks.tentacle&&!f.tentacleCooldown&&this.shotTime<13){this.strike(f,1,'tentacle',52+18*this.perks.tentacle);f.tentacleCooldown=.8;}
   if(!draining){
    for(const b of this.bumpers)if(this.bounce(f,b.x,b.y,b.r,f.bumperCooldown?0:170)&&!f.bumperCooldown){f.bumperCooldown=.22;this.events.push({type:'bumper',x:b.x,y:b.y,value:this.machineBonus(f)});}
    for(const r of this.rotors){const a=r.angle+this.time*1.6,ux=Math.cos(a),uy=Math.sin(a),p=clamp((f.x-r.x)*ux+(f.y-r.y)*uy,-r.r,r.r),px=r.x+ux*p,py=r.y+uy*p;if(this.bounce(f,px,py,5,55)&&!f.bumperCooldown){f.bumperCooldown=.22;f.vx-=uy*p*2;f.vy+=ux*p*2;this.events.push({type:'bumper',x:px,y:py,value:this.machineBonus(f)});}}
    for(const v of this.vents)if(!f.ventCooldown&&Math.abs(f.x-v.x)<25&&f.y>v.y-24&&f.y<v.y+15){f.vy=-400;f.vx+=(210-f.x)*.45;f.ventCooldown=1.2;this.events.push({type:'vent',x:v.x,y:v.y,value:this.machineBonus(f,1)});}
    for(const p of this.portals)if(!f.portalCooldown&&Math.hypot(f.x-p.x,f.y-p.y)<p.r){const out=this.portals[p.to];f.x=out.x+(out.x>210?-28:28);f.y=out.y+10;f.vx=(out.x>210?-1:1)*Math.max(140,Math.abs(f.vx));f.vy=Math.max(70,f.vy*.6);f.portalCooldown=1.3;this.events.push({type:'portal',x:p.x,y:p.y,tx:f.x,ty:f.y});this.enterDream(f);break;}
    for(const a of this.altars)if(this.bounce(f,a.x,a.y,a.r,95)&&!f.altarCooldown){f.altarCooldown=.7;a.charges++;f.points+=this.baseValue*3;this.strike(f,3,'gaze');this.events.push({type:'ritual',x:a.x,y:a.y});}
   }
   const speed=Math.hypot(f.vx,f.vy);if(speed>650){f.vx*=650/speed;f.vy*=650/speed;}
   if(draining)f.vy=Math.max(250,f.vy);
   if(f.y>=503&&!f.child&&!draining){const echo=this.routeId==='echo'&&!f.echoed,rebirth=this.perks.rebirth&&!f.reborn;if(echo||rebirth){this.payCurse(f,this.curse.rebounceTax,'返生血税');if(echo)f.echoed=true;else f.reborn=true;f.y=476;f.vy=-440;f.vx=(210-f.x)*1.1;this.events.push({type:'rebirth',x:f.x,y:490});continue;}}
   if(f.y>=503||this.shotTime>17){const bin=this.bins().find(b=>f.x>=b.x&&f.x<=b.x+b.w)||this.bins()[2],multiplier=(1+.65*(this.perks.sacrifice||0))*(this.isLast&&this.perks.last?1.5:1),gross=Math.round(Math.max(this.baseValue,f.points)*bin.m*multiplier),before=this.shotPoints;this.shotGross+=gross;this.shotPoints=Math.round(this.shotGross*this.curse.multiplier);this.events.push({type:'land',x:f.x,y:498,value:this.shotPoints-before,gross,m:bin.m});dead.add(f.id);}
  }
  this.fish=this.fish.filter(f=>!dead.has(f.id));
  if(!this.fish.length){this.score+=this.shotPoints;this.total+=this.shotPoints;this.lastShot=this.shotPoints;this.lastShotGross=this.shotGross;this.lastShotDeducted=this.shotGross-this.shotPoints;if(this.lastShotDeducted)this.events.push({type:'curse',x:210,y:452,text:'侵蚀 '+this.cultCount+' 层 · −'+this.lastShotDeducted});this.state=this.score>=this.target?'cleared':this.shots===0?'over':'ready';if(this.state==='ready')this.regrow();this.events.push({type:'settle',points:this.shotPoints,state:this.state});}
 }
 regrow(){const rate=(this.routeId==='bloom'?.2:0)+.25*(this.perks.blackTide||0);if(!rate)return;const dead=this.pegs.filter(p=>!p.alive&&!p.revived&&!p.consumed),random=rng(this.seed+this.stage*91+this.shots*881),chosen=dead.map(p=>({p,n:random()})).sort((a,b)=>a.n-b.n).slice(0,Math.ceil(dead.length*Math.min(.8,rate)));for(const {p} of chosen){p.alive=true;p.revived=true;p.spectral=!!this.perks.blackTide;}if(chosen.length)this.events.push({type:'regrow',count:chosen.length,x:210,y:350});}
 choices(){const random=rng(this.seed+this.stage*1301+this.draftRoll*4531+(this.state==='draft'?99:0)),pool=PERKS.filter(p=>(this.perks[p.id]||0)<p.max).map(p=>({p,n:random()})).sort((a,b)=>a.n-b.n).map(x=>x.p),cult=pool.filter(p=>p.cult),normal=pool.filter(p=>!p.cult),preferred=this.routeId==='ritual'&&this.state!=='draft'?[...cult.slice(0,2),...normal.slice(0,1)]:[...cult.slice(0,1),...normal.slice(0,1)];for(const p of pool)if(preferred.length<3&&!preferred.includes(p))preferred.push(p);return preferred.sort((a,b)=>pool.indexOf(a)-pool.indexOf(b));}
 routeChoices(){const random=rng(this.seed+this.stage*1723);return ROUTES.map(r=>({r,n:random()})).sort((a,b)=>a.n-b.n).slice(0,2).map(x=>x.r);}
 reroll(){if(!['cleared','draft'].includes(this.state)||this.rerolls<=0)return false;this.rerolls--;this.draftRoll++;return true;}
 choose(id,routeId){if(!['cleared','draft'].includes(this.state))return false;const p=this.choices().find(p=>p.id===id);if(!p)return false;if(this.state==='cleared'&&routeId&&!this.routeChoices().some(r=>r.id===routeId))return false;this.perks[id]=(this.perks[id]||0)+1;if(this.state==='cleared'){this.routeId=routeId||this.routeChoices()[0].id;this.stage++;}this.setup();return true;}
 nextEndless(routeId){if(this.state!=='cleared')return false;this.routeId=this.routeChoices().find(r=>r.id===routeId)?.id||this.routeChoices()[0].id;this.stage++;this.setup();return true;}
 snapshot(){return JSON.parse(JSON.stringify({...this,events:[]}));}
 static restore(data){if(!data||!Number.isFinite(data.seed)||!Number.isInteger(data.stage)||data.stage<1||data.stage>10000||!Array.isArray(data.pegs)||!Array.isArray(data.fish)||!['draft','ready','flying','cleared','over'].includes(data.state))return null;
  const e=new FishEngine(data.seed,{skipDraft:true});
  if(data.version!==2){e.stage=Math.min(10,data.stage);e.total=Number.isFinite(data.total)?data.total:0;e.perks=Object.fromEntries(PERKS.filter(p=>data.perks?.[p.id]).map(p=>[p.id,clamp(data.perks[p.id],0,p.max)]));e.bestCombo=data.bestCombo||0;e.setup();e.migrated=true;return e;}
  if(!Number.isFinite(data.total)||!Number.isFinite(data.score)||!Number.isFinite(data.shots)||!data.perks||['vents','wells','altars','currents'].some(k=>!Array.isArray(data[k])))return null;
  Object.assign(e,data);e.events=[];
  if(data.balanceVersion!==2){const spent=Math.max(0,(data.maxShots||3)-data.shots);e.maxShots=Math.max(1,3+(e.perks.extra||0)-e.curse.shotLoss);e.shots=Math.max(0,e.maxShots-spent);if(e.state==='over'&&e.shots>0)e.state='ready';if(e.state==='ready'&&!e.shots)e.state=e.score>=e.target?'cleared':'over';if(data.balanceVersion==null)for(const f of e.fish)if(e.routeId==='echo'&&f.reborn){f.echoed=true;f.reborn=false;}e.balanceVersion=2;e.shotGross=e.state==='flying'?data.shotPoints:0;if(e.state==='flying')e.shotPoints=Math.round(e.shotGross*e.curse.multiplier);e.lastShotGross=0;e.lastShotDeducted=0;delete e.shotCost;delete e.shotOfferings;}
  return e;
 }
}
