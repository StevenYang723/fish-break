export const W=420,H=544;
export const LEVELS=[['浅水试弹','熟悉你的第一道弧线'],['弹簧海湾','弹一下，会有好事发生'],['旋转珊瑚','转轮让路线有点意外'],['跃迁海域','传送门连接另一种可能'],['深海派对','所有机关，一起开工']];
export const PERKS=[
 {id:'split',icon:'⋈',name:'分身小鱼',tag:'分裂流',desc:'每条主鱼首次撞墙，分裂出一条小鱼。',max:1},
 {id:'rich',icon:'✦',name:'闪亮鳞片',tag:'得分流',desc:'每个普通气泡多得 5 分，可叠加 3 次。',max:3},
 {id:'chain',icon:'ϟ',name:'连锁闪电',tag:'连锁流',desc:'每撞破 3 个气泡，电破附近 2 个气泡。',max:1},
 {id:'extra',icon:'＋',name:'再来一条',tag:'续航流',desc:'从下一关起，每关多 1 条鱼，可叠加 2 次。',max:2},
 {id:'wide',icon:'↔',name:'大号金鱼缸',tag:'幸运流',desc:'中央 3 倍鱼缸变宽，更多幸运落点。',max:2},
 {id:'combo',icon:'∞',name:'连击爱好者',tag:'连锁流',desc:'每连续撞破 3 个气泡，额外加 25 分。',max:2},
 {id:'spring',icon:'⌁',name:'弹簧红包',tag:'机关流',desc:'每次撞上弹簧或转轮，额外加 20 分。',max:2},
 {id:'gold',icon:'◇',name:'淘金小队',tag:'得分流',desc:'金色气泡从 25 分变为 50 分。',max:1},
 {id:'last',icon:'↗',name:'压轴选手',tag:'爆发流',desc:'每关最后一发的全部得分再乘 1.5。',max:1},
 {id:'safe',icon:'♡',name:'保底好运',tag:'幸运流',desc:'两侧 1 倍鱼缸升级为 2 倍鱼缸。',max:1}
];
export function rng(seed){let s=seed>>>0;return()=>{s+=0x6D2B79F5;let t=Math.imul(s^s>>>15,1|s);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296;};}
export class FishEngine{
 constructor(seed=Date.now()){this.seed=seed;this.stage=1;this.total=0;this.perks={};this.bestCombo=0;this.events=[];this.setup();}
 setup(){
  this.random=rng(this.seed+this.stage*731);this.score=0;this.target=[0,220,300,400,530,680][this.stage]||Math.round(680*Math.pow(1.16,this.stage-5));this.maxShots=3+(this.perks.extra||0);this.shots=this.maxShots;this.fish=[];this.time=0;this.state='ready';this.shotPoints=0;this.lastShot=0;this.events=[];this.pegs=[];this.bumpers=[];this.portals=[];this.rotors=[];this.nextFishId=0;
  const offset=(this.stage%3)*.45;
  for(let row=0;row<7;row++)for(let col=0;col<7;col++){
   let x=52+col*52+(row%2?15:-6)+Math.sin(row*1.9+col+offset)*8;
   let y=133+row*44+Math.cos(col*1.7+row)*8;
   if(this.stage>=2&&Math.hypot(x-126,y-263)<35)continue;
   if(this.stage>=2&&Math.hypot(x-309,y-350)<36)continue;
   if(this.stage>=3&&Math.hypot(x-236,y-196)<48)continue;
   if(this.stage>=4&&(Math.hypot(x-56,y-315)<29||Math.hypot(x-355,y-145)<29))continue;
   this.pegs.push({id:row*7+col,x,y,r:9+(this.random()>.85?1:0),gold:this.random()<.14,alive:true});
  }
  if(this.stage>=2)this.bumpers=[{x:126,y:263,r:18},{x:309,y:350,r:19}];
  if(this.stage>=3)this.rotors=[{x:236,y:196,r:35,angle:offset}];
  if(this.stage>=4)this.portals=[{x:56,y:315,r:19,to:1},{x:355,y:145,r:19,to:0}];
 }
 bins(){const mid=92+(this.perks.wide||0)*26;const other=(W-mid)/4;let x=0;return[1,2,3,2,1].map((m,i)=>{const w=i===2?mid:other;const b={x,w,m:m===1&&this.perks.safe?2:m};x+=w;return b;});}
 shoot(angle=0){if(this.state!=='ready'||this.shots<1)return false;this.shots--;this.fish=[this.makeFish(210,52,Math.sin(angle)*360,Math.cos(angle)*360)];this.shotPoints=0;this.shotTime=0;this.isLast=this.shots===0;this.state='flying';this.events.push({type:'shoot'});return true;}
 makeFish(x,y,vx,vy,child=false){return{id:++this.nextFishId,x,y,vx,vy,r:child?6:8,points:0,hits:0,child,split:false,portalCooldown:0,bumperCooldown:0,trail:[]};}
 pop(peg,f,lightning=false){if(!peg.alive)return;peg.alive=false;const val=peg.gold?(this.perks.gold?50:25):(10+5*(this.perks.rich||0));f.points+=val;if(!lightning){f.hits++;this.bestCombo=Math.max(this.bestCombo,f.hits);}this.events.push({type:'pop',x:peg.x,y:peg.y,value:val,gold:peg.gold,hits:f.hits});
  if(!lightning&&f.hits%3===0){if(this.perks.combo){const n=25*this.perks.combo;f.points+=n;this.events.push({type:'text',x:f.x,y:f.y-22,text:'连击 +'+n,color:'#b48c33'});}if(this.perks.chain){const nearby=this.pegs.filter(p=>p.alive).sort((a,b)=>Math.hypot(a.x-f.x,a.y-f.y)-Math.hypot(b.x-f.x,b.y-f.y)).slice(0,2);for(const p of nearby){this.events.push({type:'lightning',x:f.x,y:f.y,tx:p.x,ty:p.y});this.pop(p,f,true);}}}
 }
 bounce(f,x,y,r,speed){let dx=f.x-x,dy=f.y-y,d=Math.hypot(dx,dy);if(d>=r+f.r)return false;const nx=d>.0001?dx/d:0,ny=d>.0001?dy/d:-1;f.x=x+nx*(r+f.r+.4);f.y=y+ny*(r+f.r+.4);const dot=f.vx*nx+f.vy*ny;if(dot<0){f.vx-=1.82*dot*nx;f.vy-=1.82*dot*ny;}if(speed){f.vx+=nx*speed;f.vy+=ny*speed;}return true;}
 step(dt){if(this.state!=='flying')return;const n=Math.ceil(dt/(1/120));for(let i=0;i<n;i++)this.tick(dt/n);}
 tick(dt){if(this.state!=='flying')return;this.time+=dt;this.shotTime+=dt;const dead=new Set();
  for(const f of [...this.fish]){
   f.portalCooldown=Math.max(0,f.portalCooldown-dt);f.bumperCooldown=Math.max(0,f.bumperCooldown-dt);f.vy+=300*dt;f.x+=f.vx*dt;f.y+=f.vy*dt;
   if(f.x<f.r||f.x>W-f.r){f.x=Math.max(f.r,Math.min(W-f.r,f.x));f.vx=f.x<W/2?Math.abs(f.vx)*.92:-Math.abs(f.vx)*.92;if(this.perks.split&&!f.child&&!f.split){f.split=true;this.fish.push(this.makeFish(f.x,f.y,-f.vx*.8,f.vy*.75,true));this.events.push({type:'text',x:f.x,y:f.y,text:'分身！',color:'#4c8bba'});}}
   if(f.y<f.r){f.y=f.r;f.vy=Math.abs(f.vy);}
   for(const p of this.pegs)if(p.alive&&this.bounce(f,p.x,p.y,p.r,8))this.pop(p,f);
   for(const b of this.bumpers)if(this.bounce(f,b.x,b.y,b.r,f.bumperCooldown?0:170)&&!f.bumperCooldown){f.bumperCooldown=.2;const bonus=20*(this.perks.spring||0);f.points+=bonus;this.events.push({type:'bumper',x:b.x,y:b.y,value:bonus});}
   for(const r of this.rotors){const a=r.angle+this.time*1.6;const ux=Math.cos(a),uy=Math.sin(a);const projection=Math.max(-r.r,Math.min(r.r,(f.x-r.x)*ux+(f.y-r.y)*uy));const px=r.x+ux*projection,py=r.y+uy*projection;if(this.bounce(f,px,py,5,55)&&!f.bumperCooldown){f.bumperCooldown=.2;f.vx+=-uy*projection*2;f.vy+=ux*projection*2;const bonus=20*(this.perks.spring||0);f.points+=bonus;this.events.push({type:'bumper',x:px,y:py,value:bonus});}}
   for(const p of this.portals)if(!f.portalCooldown&&Math.hypot(f.x-p.x,f.y-p.y)<p.r){const out=this.portals[p.to];f.x=out.x+(out.x>210?-28:28);f.y=out.y+10;f.vx=out.x>210?-Math.max(140,Math.abs(f.vx)):Math.max(140,Math.abs(f.vx));f.vy=Math.max(70,f.vy*.6);f.portalCooldown=1.3;this.events.push({type:'portal',x:p.x,y:p.y,tx:f.x,ty:f.y});break;}
   const speed=Math.hypot(f.vx,f.vy);if(speed>650){f.vx*=650/speed;f.vy*=650/speed;}
   if(this.shotTime>11){f.vy=Math.max(220,f.vy);f.x+=Math.sin(this.time*8)*2;}
   if(f.y>=503||this.shotTime>15){const bin=this.bins().find(b=>f.x>=b.x&&f.x<=b.x+b.w)||this.bins()[2];const points=Math.round(Math.max(10,f.points)*bin.m*(this.isLast&&this.perks.last?1.5:1));this.shotPoints+=points;this.events.push({type:'land',x:f.x,y:498,value:points,m:bin.m});dead.add(f.id);}
  }
  this.fish=this.fish.filter(f=>!dead.has(f.id));
  if(!this.fish.length){this.score+=this.shotPoints;this.total+=this.shotPoints;this.lastShot=this.shotPoints;this.state=this.score>=this.target?'cleared':this.shots===0?'over':'ready';this.events.push({type:'settle',points:this.shotPoints,state:this.state});}
 }
 choices(){const available=PERKS.filter(p=>(this.perks[p.id]||0)<p.max);const random=rng(this.seed+this.stage*1301);return available.map(p=>({p,v:random()})).sort((a,b)=>a.v-b.v).slice(0,3).map(x=>x.p);}
 choose(id){if(this.state!=='cleared')return false;const p=PERKS.find(p=>p.id===id);if(!p||(this.perks[id]||0)>=p.max)return false;this.perks[id]=(this.perks[id]||0)+1;this.stage++;this.setup();return true;}
 nextEndless(){if(this.state!=='cleared')return false;this.stage++;this.setup();return true;}
 snapshot(){return JSON.parse(JSON.stringify({...this,events:[],random:undefined}));}
 static restore(data){if(!data||!Number.isFinite(data.seed)||!Number.isInteger(data.stage)||data.stage<1||!Array.isArray(data.pegs)||!Array.isArray(data.fish)||!['ready','flying','cleared','over'].includes(data.state))return null;const e=new FishEngine(data.seed);Object.assign(e,data);e.events=[];e.random=rng(e.seed+e.stage*731);return e;}
}
