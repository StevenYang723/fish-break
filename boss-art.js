const TAU=Math.PI*2;
const circle=(c,x,y,r,fill,stroke)=>{c.beginPath();c.arc(x,y,r,0,TAU);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.stroke();}};
export function renderBoss(c,e,t){
 if(!e.boss)return;const b=e.boss,armored=e.bossAnchors.length>0,sway=Math.sin(t*1.3)*3;
 c.save();
 // Telegraph the next shot's sweep directly on the board.
 if(b.hp&&armored&&b.turn%3!==2&&e.bossAnchors.some(p=>p.side===b.turn%2)){
  const right=b.turn%2===0,g=c.createLinearGradient(0,320,0,405);g.addColorStop(0,'#eaa96700');g.addColorStop(.5,'#eaa96720');g.addColorStop(1,'#eaa96700');c.fillStyle=g;c.fillRect(0,320,420,85);c.strokeStyle='#ffc18466';c.lineWidth=2;
  for(let i=0;i<7;i++){const x=((i*70+(right?t:-t)*24)%490+490)%490-35,y=366;c.beginPath();c.moveTo(x,y);c.lineTo(x+(right?16:-16),y);c.lineTo(x+(right?10:-10),y-5);c.stroke();}
 }
 if(b.hp&&armored&&b.turn%3===2&&!b.sealBroken){const bin=e.bins()[2];c.fillStyle='#ef846127';c.fillRect(bin.x,455,bin.w,40);c.strokeStyle='#f0ad77';c.setLineDash([4,4]);c.strokeRect(bin.x+2,457,bin.w-4,30);c.setLineDash([]);c.font='bold 10px "Microsoft YaHei"';c.textAlign='center';c.fillStyle='#ffd7a1';c.fillText('封锁 · 倍率减半',bin.x+bin.w/2,473);}
 // The shell is a miniature shipwreck, carried by a deep-sea crab.
 c.translate(210,276+sway);if(!b.hp)c.globalAlpha=.35;
 const aura=c.createRadialGradient(0,0,15,0,0,78);aura.addColorStop(0,armored?'#ffbd6425':'#fb7e8a33');aura.addColorStop(1,'#e58e6d00');circle(c,0,0,78,aura);
 c.lineCap='round';c.lineJoin='round';
 for(const side of [-1,1]){
  for(let j=0;j<3;j++){c.strokeStyle='#173042';c.lineWidth=9;c.beginPath();c.moveTo(side*22,12+j*6);c.lineTo(side*(43+j*5),19+j*8+Math.sin(t*2+j)*2);c.lineTo(side*(47+j*6),37+j*4);c.stroke();c.strokeStyle=j%2?'#db8d67':'#b9755d';c.lineWidth=4;c.stroke();}
  c.strokeStyle='#563e49';c.lineWidth=14;c.beginPath();c.moveTo(side*25,5);c.quadraticCurveTo(side*50,10,side*54,-12);c.stroke();c.strokeStyle='#e6a57d';c.lineWidth=8;c.stroke();
  c.save();c.translate(side*55,-16);c.rotate(side*(.35+Math.sin(t*1.5)*.1));c.fillStyle='#bc735c';c.strokeStyle='#f1ba86';c.lineWidth=1.7;c.beginPath();c.moveTo(-13,9);c.quadraticCurveTo(-23,-16,-3,-25);c.lineTo(0,-7);c.lineTo(7,-24);c.quadraticCurveTo(25,-7,10,10);c.closePath();c.fill();c.stroke();c.restore();
 }
 const body=c.createLinearGradient(0,-16,0,34);body.addColorStop(0,'#f4bd87');body.addColorStop(.45,'#bd7869');body.addColorStop(1,'#594758');c.fillStyle=body;c.strokeStyle='#ecbf95';c.lineWidth=2;c.beginPath();c.ellipse(0,13,35,23,0,0,TAU);c.fill();c.stroke();
 for(const x of [-15,15]){c.strokeStyle='#d69876';c.lineWidth=5;c.beginPath();c.moveTo(x,5);c.lineTo(x*1.25,-9);c.stroke();circle(c,x*1.25,-11,8,'#d5f5c1','#4d605b');circle(c,x*1.25+Math.sin(t)*1.4,-12,3.5,'#172b39');circle(c,x*1.25+1,-14,1.2,'#fff2cb');}
 c.strokeStyle='#4e3847';c.lineWidth=2;c.beginPath();c.arc(0,17,8,.1,Math.PI-.1);c.stroke();
 if(armored){
  c.save();c.translate(0,-22);const shell=c.createLinearGradient(0,-43,0,21);shell.addColorStop(0,'#547e7e');shell.addColorStop(.4,'#37616d');shell.addColorStop(1,'#1a364b');c.fillStyle=shell;c.strokeStyle='#a7c3a4';c.lineWidth=2;c.beginPath();c.moveTo(-40,3);c.lineTo(-30,-27);c.quadraticCurveTo(3,-56,31,-27);c.lineTo(40,3);c.quadraticCurveTo(0,30,-40,3);c.fill();c.stroke();
  c.strokeStyle='#8baa9a';c.lineWidth=1;for(let k=-2;k<=2;k++){c.beginPath();c.moveTo(k*12,-31);c.lineTo(k*17,8);c.stroke();}
  c.fillStyle='#8d6556';c.strokeStyle='#e2bb8e';c.lineWidth=1.5;c.beginPath();c.moveTo(-32,-6);c.lineTo(28,-9);c.lineTo(18,8);c.lineTo(-20,10);c.closePath();c.fill();c.stroke();
  c.strokeStyle='#d2b388';c.lineWidth=3;c.beginPath();c.moveTo(-2,-9);c.lineTo(-5,-52);c.lineTo(3,-60);c.stroke();c.fillStyle='#c3bf9c';c.beginPath();c.moveTo(-5,-47);c.lineTo(-25,-20);c.lineTo(-6,-24);c.closePath();c.fill();c.fillStyle='#657e7b';c.beginPath();c.moveTo(-1,-45);c.lineTo(20,-25);c.lineTo(11,-25);c.lineTo(15,-18);c.lineTo(-1,-22);c.closePath();c.fill();
  for(const x of [-13,0,13])circle(c,x,0,2,'#122c3e','#e6bd88');
  if(e.bossAnchors.length===1){c.strokeStyle='#f6bb88';c.lineWidth=2;c.beginPath();c.moveTo(14,-37);c.lineTo(4,-22);c.lineTo(17,-14);c.lineTo(8,2);c.stroke();}
  c.restore();
 }else{c.save();c.shadowColor='#ff9e7d';c.shadowBlur=16;circle(c,0,3,7,'#ffd59b','#ff816d');c.restore();}
 c.textAlign='center';c.font='700 9px "Segoe UI","Microsoft YaHei"';c.fillStyle=armored?'#e9c299':'#ffd1bb';c.fillText(!b.hp?'GUARDIAN DEFEATED':armored?'击碎船锚 · 瓦解甲壳':'甲壳崩解 · 全力输出',0,59);c.restore();
}
export function renderAnchors(c,e,t){
 if(!e.boss)return;c.save();
 for(const p of e.pegs.filter(p=>p.kind==='anchor')){
  if(!p.alive){c.strokeStyle='#bd93623a';c.lineWidth=1;circle(c,p.x,p.y,13,null,'#bd93623a');continue;}
  c.strokeStyle='#c9ab7270';c.lineWidth=2;c.setLineDash([3,5]);c.beginPath();c.moveTo(p.x,p.y+18);c.quadraticCurveTo(p.x,260,210+(p.side?26:-26),250);c.stroke();c.setLineDash([]);
  c.save();c.translate(p.x,p.y);c.shadowColor='#edb66c';c.shadowBlur=12+Math.sin(t*2)*3;circle(c,0,0,17,'#243d4d','#e2b776');c.shadowBlur=0;circle(c,0,0,13,'#162c40','#7f7a63');c.strokeStyle='#ffe1a1';c.lineWidth=2.2;c.lineCap='round';circle(c,0,-7,2.5,null,'#ffe1a1');c.beginPath();c.moveTo(0,-4);c.lineTo(0,9);c.moveTo(-5,-1);c.lineTo(5,-1);c.moveTo(-8,2);c.quadraticCurveTo(-8,8,0,9);c.quadraticCurveTo(8,8,8,2);c.moveTo(-9,1);c.lineTo(-5,3);c.moveTo(9,1);c.lineTo(5,3);c.stroke();
  for(let i=0;i<p.maxHp;i++)circle(c,(i-(p.maxHp-1)/2)*8,24,2.4,i<p.hp?'#ffdf9c':'#52616b');c.restore();
 }c.restore();
}
