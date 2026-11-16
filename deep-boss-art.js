import {bossBody,bossDef,bossThreat,bossBinFactor} from './boss-rules.js?v=2.4';
const TAU=Math.PI*2;
const circle=(c,x,y,r,fill,stroke)=>{c.beginPath();c.arc(x,y,r,0,TAU);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.stroke();}};
const line=(c,x,y,tx,ty,color,width=2)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(tx,ty);c.stroke();};
function label(c,s,x,y,color='#d7e8ff',size=9){c.font='700 '+size+'px "Segoe UI","Microsoft YaHei"';c.textAlign='center';c.fillStyle=color;c.fillText(s,x,y);}
export function renderDeepBoss(c,e,t){
 const b=e.boss;if(!b||e.bossKind==='crab')return;const def=bossDef(e),h=bossThreat(e),color=def.color;
 c.save();c.lineCap='round';c.lineJoin='round';
 // Every damaging field uses exactly the same dimensions and timeline as physics.
 if(b.hp&&['electric','gaze'].includes(h.kind)&&!h.disabled&&(h.warning||h.active)){
  c.save();c.shadowColor=color;c.shadowBlur=h.active?18:0;c.strokeStyle=h.active?color:color+'88';c.lineWidth=h.active?2:1;c.setLineDash(h.active?[]:[5,7]);c.fillStyle=h.active?color+'39':color+'0b';
  for(const x of h.lanes){c.fillRect(x-h.width/2,118,h.width,350);c.strokeRect(x-h.width/2,118,h.width,350);if(h.active){line(c,x,118,x,468,'#fff5e8',3);for(let y=130;y<460;y+=28){c.beginPath();c.moveTo(x-10,y);c.lineTo(x+8,y+9);c.lineTo(x-4,y+23);c.stroke();}}else label(c,'⚡',x,120,color,12);}
  if(h.horizontal){c.fillRect(10,h.horizontal-22,400,44);c.strokeRect(10,h.horizontal-22,400,44);if(h.active)line(c,10,h.horizontal,410,h.horizontal,'#ffe9ed',3);}
  c.restore();
 }
 if(b.hp&&h.kind==='suction'&&h.active){c.save();c.strokeStyle='#91e8df55';c.setLineDash([5,8]);for(let i=0;i<3;i++){const r=45+((i*50-t*25)%150+150)%150;circle(c,210,299,r,null,'#91e8df'+(r>150?'22':'55'));}c.setLineDash([]);for(const x of [80,340]){line(c,x,370,x<210?x+16:x-16,357,'#a6f4c7aa',2);}c.restore();}
 if(b.hp&&e.bossKind==='eye')for(const [i,bin] of e.bins().entries())if(bossBinFactor(e,i)<1){c.fillStyle='#f2a4c52b';c.fillRect(bin.x,456,bin.w,34);c.strokeStyle='#ec98be';c.setLineDash([3,4]);c.strokeRect(bin.x+2,456,bin.w-4,32);c.setLineDash([]);label(c,'封印 ×0.5',bin.x+bin.w/2,475,'#ffc2df',8);}
 c.save();c.globalAlpha=b.hp?1:.35;c.shadowColor=color;c.shadowBlur=b.enraged?20:10;
 const glow=c.createRadialGradient(210,264,15,210,264,100);glow.addColorStop(0,color+'25');glow.addColorStop(1,color+'00');circle(c,210,264,100,glow);
 for(const shape of bossBody(e)){c.lineWidth=1.5;circle(c,shape.x,shape.y,shape.r,color+'09',b.hitFlash?'#fff8e9':color+'aa');}
 c.shadowBlur=0;
 if(e.bossKind==='jelly'){
  for(let j=0;j<7;j++){const x=177+j*11;c.strokeStyle=j%2?'#937de8':'#c7afff';c.lineWidth=j%2?2:4;c.beginPath();c.moveTo(x,277);c.bezierCurveTo(x-14,300,x+Math.sin(t*1.7+j)*18,321,x+Math.cos(t+j)*12,339+j%3*8);c.stroke();}
  const g=c.createRadialGradient(199,227,3,210,248,49);g.addColorStop(0,'#ded7ff');g.addColorStop(.4,'#8a80d2');g.addColorStop(1,'#393964');circle(c,210,248,46,g,'#c6bdff');
  c.fillStyle='#c6cbff50';c.beginPath();c.ellipse(210,270,43,15,0,0,TAU);c.fill();c.strokeStyle='#eadcff';c.stroke();
  for(let i=0;i<5;i++)circle(c,183+i*14,270+Math.sin(i*1.2)*4,3,b.exposed?'#fff2b1':'#c9a3ff');
  for(const x of [197,223]){circle(c,x,241,7,'#e9e4ff');circle(c,x,243,3,'#302b56');}
  c.save();c.shadowColor=b.exposed?'#ffe8a5':'#c4a9ff';c.shadowBlur=18;circle(c,210,255,b.exposed?8:5,b.exposed?'#fff1b3':'#e2cfff');c.restore();
  for(const side of [-1,1]){c.strokeStyle='#dfcaff';c.lineWidth=2;c.beginPath();c.moveTo(210+side*16,207);c.lineTo(210+side*25,192);c.lineTo(210+side*28,207);c.stroke();}
  label(c,b.exposed?'过载 · 本发伤害 ×1.6':'击破电囊，让电盾过载',210,368,color);
 }else if(e.bossKind==='angler'){
  c.fillStyle='#467d83';c.strokeStyle='#9bcfc3';c.lineWidth=2;c.beginPath();c.moveTo(166,257);c.lineTo(128,242);c.quadraticCurveTo(134,265,126,282);c.lineTo(166,272);c.closePath();c.fill();c.stroke();
  const g=c.createRadialGradient(192,239,4,210,264,54);g.addColorStop(0,'#6ea5a1');g.addColorStop(.5,'#345e71');g.addColorStop(1,'#152c45');circle(c,210,264,51,g,'#87c5bd');
  for(let j=0;j<7;j++){const a=Math.PI*1.12+j*.28,x=210+Math.cos(a)*49,y=264+Math.sin(a)*49;line(c,x,y,x+Math.cos(a)*12,y+Math.sin(a)*12,'#91b8b3',3);}
  c.strokeStyle='#97d3c1';c.lineWidth=2;c.beginPath();c.moveTo(219,218);c.quadraticCurveTo(248,174,265,199);c.stroke();c.save();c.shadowColor='#d1ffc5';c.shadowBlur=20;circle(c,265,201,7,'#e5ffd1');c.restore();
  for(const x of [193,227]){circle(c,x,250,10,'#cadb9e','#19283b');circle(c,x+1,252,4,'#122238');circle(c,x+2,249,1.6,'white');}
  c.fillStyle='#0a192a';c.strokeStyle=h.open?'#ffe1a1':'#618a93';c.lineWidth=3;c.beginPath();c.ellipse(210,289,32,h.open?18:5,0,0,TAU);c.fill();c.stroke();
  if(h.open){c.fillStyle='#f4e5b3';for(let j=0;j<7;j++){const x=184+j*8;c.beginPath();c.moveTo(x,280);c.lineTo(x+4,290+j%2*3);c.lineTo(x+7,280);c.fill();}c.strokeStyle='#ffe6a3';c.shadowColor='#ffd478';c.shadowBlur=15;c.lineWidth=4;c.beginPath();c.arc(210,264,54,.45,Math.PI-.45);c.stroke();c.shadowBlur=0;label(c,'↑ 金色腹口 · 反击 ×3',210,340,'#ffe6ad');}else label(c,'张嘴时，从下方撞击腹口',210,340,color);
 }else{
  c.save();c.translate(210,264);c.rotate(t*.12);c.strokeStyle='#a77caa';c.lineWidth=2;for(let j=0;j<8;j++){c.rotate(TAU/8);c.beginPath();c.moveTo(49,-8);c.quadraticCurveTo(70,-20,75,-4);c.quadraticCurveTo(58,0,63,21);c.stroke();}c.restore();
  const g=c.createRadialGradient(210,264,10,210,264,55);g.addColorStop(0,'#8c4876');g.addColorStop(.65,'#4a315e');g.addColorStop(1,'#272340');circle(c,210,264,53,g,'#dba4c1');
  c.fillStyle=e.bossAnchors.length?'#cabfc0':'#ffe9c9';c.strokeStyle='#ffc5d9';c.lineWidth=2;c.beginPath();c.moveTo(164,264);c.quadraticCurveTo(210,225,256,264);c.quadraticCurveTo(210,303,164,264);c.fill();c.stroke();
  circle(c,210,264,22,e.bossAnchors.length?'#997894':'#e6a65f','#5f3955');circle(c,210,264,12,'#1c1831');c.fillStyle='#fff1cf';c.beginPath();c.ellipse(215,256,4,7,.5,0,TAU);c.fill();
  if(e.bossAnchors.length){c.strokeStyle='#ccb2c5';c.lineWidth=2;c.setLineDash([3,4]);circle(c,210,264,37,null,'#caa3c9');c.setLineDash([]);}else{c.shadowColor='#ffcb8f';c.shadowBlur=18;circle(c,210,264,23,null,'#ffd591');c.shadowBlur=0;}
  label(c,e.bossAnchors.length?'循亮纹 · 依序解开三重封印':'封印全破 · 反击可打断凝视',210,344,color);
 }
 if(b.hitFlash){c.save();c.globalCompositeOperation='screen';c.globalAlpha=Math.min(.7,b.hitFlash*3);for(const shape of bossBody(e))circle(c,shape.x,shape.y,shape.r,'#fff0cf');c.restore();}
 if(b.enraged&&b.hp)label(c,'AWAKENED · 狂暴',210,192,'#ffc5c5',8);
 c.restore();c.restore();
}
export function renderDeepTargets(c,e,t){
 if(!e.boss||e.bossKind==='crab')return;const b=e.boss,def=bossDef(e);c.save();
 for(const p of e.pegs.filter(p=>p.kind==='anchor')){const order=b.runeOrder?.indexOf(p.side)??0,active=e.bossKind==='jelly'||p.side===b.runeOrder[b.runeProgress];if(!p.alive){circle(c,p.x,p.y,13,null,def.color+'33');label(c,'✓',p.x,p.y+4,def.color+'77');continue;}
  c.strokeStyle=def.color+'50';c.setLineDash([3,5]);line(c,p.x,p.y+18,210,222,def.color+'50',1);c.setLineDash([]);c.lineWidth=2;c.shadowColor=def.color;c.shadowBlur=active?15:0;
  circle(c,p.x,p.y,18,active?'#343655':'#222b42',active?'#fff0bd':'#716781');circle(c,p.x,p.y,13,'#191d36',def.color);c.shadowBlur=0;
  label(c,e.bossKind==='jelly'?'ϟ':String(order+1),p.x,p.y+5,active?'#fff0bb':'#7f789a',16);
  for(let i=0;i<p.maxHp;i++)circle(c,p.x+(i-(p.maxHp-1)/2)*8,p.y+25,2.3,i<p.hp?def.color:'#49556d');
  if(active&&e.bossKind==='eye')label(c,'先击这里',p.x,p.y-26,'#ffe1ac',8);
 }c.restore();
}
