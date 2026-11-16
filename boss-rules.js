// Physics, warnings and artwork share these shapes and attack timelines.
export const BOSS_TYPES={
 crab:{id:'crab',name:'沉船寄居蟹',stage:3,icon:'⚓',color:'#ffc18b',hpScale:1.45,
  body:[{x:210,y:258,r:54},{x:155,y:260,r:24},{x:265,y:260,r:24}],
  targets:[{x:102,y:174,role:'anchor'},{x:318,y:174,role:'anchor'}],targetName:'船锚',
  weakness:'拆掉两只船锚，永久破甲并使所有伤害 ×1.25。拆对应锚可取消横扫，拆任一锚可解除本发封缸。'},
 jelly:{id:'jelly',name:'风暴水母',stage:5,icon:'ϟ',color:'#b3a4ff',hpScale:4.4,
  body:[{x:210,y:248,r:48},{x:183,y:290,r:20},{x:237,y:290,r:20}],
  targets:[{x:105,y:172,role:'capacitor'},{x:315,y:172,role:'capacitor'}],targetName:'电囊',
  weakness:'击破任一电囊：本发停止放电，所有伤害由 ×0.55 提升至 ×1.6。电囊每发重新充能，半血后双侧放电。'},
 angler:{id:'angler',name:'噬光鮟鱇',stage:8,icon:'◒',color:'#91e8df',hpScale:5.8,
  body:[{x:210,y:264,r:54},{x:146,y:264,r:24}],targets:[],targetName:'腹口',
  weakness:'从下方撞进张开的金色腹口，造成 ×3 弱点伤害并打断吸力；本发后续伤害 ×1.5。闭嘴时硬撞腹口会被咬掉 15% 气泡分。'},
 eye:{id:'eye',name:'拉莱耶之眼',stage:10,icon:'◉',color:'#f6a5c6',hpScale:12.5,
  body:[{x:210,y:264,r:55}],
  targets:[{x:94,y:174,role:'rune'},{x:210,y:144,role:'rune'},{x:326,y:174,role:'rune'}],targetName:'封印',
  weakness:'按发光数字顺序破除三枚符文，永久解除封缸，所有伤害由 ×0.35 提升至 ×1.75。破封后撞击眼球还能短暂打断射线。'}
};
export const BOSS_LIST=Object.values(BOSS_TYPES);
export function bossAtStage(stage){if(stage===3)return 'crab';if(stage===5)return 'jelly';if(stage===8)return 'angler';if(stage===10)return 'eye';if(stage>10&&stage%5===0)return ['jelly','angler','eye','crab'][(stage/5-3)%4];return null;}
export const bossDef=e=>BOSS_TYPES[e.boss?.kind||'crab'];
export const bossBody=e=>e.boss?bossDef(e).body:[];
export const liveTargets=e=>e.pegs.filter(p=>p.kind==='anchor'&&p.alive);
export function bossFactor(e){const b=e.boss;if(!b)return 1;switch(b.kind||'crab'){
 case 'crab':return liveTargets(e).length?1-liveTargets(e).length*.3:1.25;
 case 'jelly':return b.exposed?1.6:.55;
 case 'angler':return b.exposed?1.5:.55;
 case 'eye':return liveTargets(e).length?.35:1.75;
 }}
export function bossThreat(e){const b=e.boss;if(!b||!b.hp)return {kind:'none'};const kind=b.kind||'crab',t=e.state==='flying'?e.shotTime||0:0,scale=Math.min(2,1+Math.max(0,e.stage-bossDef(e).stage)*.025),targets=liveTargets(e),rage=b.enraged;
 if(kind==='crab'){if(!targets.length)return {kind:'none'};if(b.turn%3===2)return b.sealBroken?{kind:'none'}:{kind:'seal',bins:[2]};return targets.some(p=>p.side===b.turn%2)?{kind:'sweep',direction:b.turn%2?-1:1,force:250*scale}:{kind:'none'};}
 if(kind==='angler'){const period=rage?3.2:4.2,phase=t%period,open=b.exposed||(phase>=1&&phase<(rage?2.9:3.1));return {kind:'suction',open,active:e.state==='flying'&&open&&!(b.stagger>0),force:(rage?600:390)*scale,radius:rage?215:180,phase,period};}
 const period=kind==='jelly'?(rage?3:3.8):(rage?2.8:3.6),phase=t%period,delay=kind==='jelly'?1.2:1.05;
 const disabled=kind==='jelly'?b.exposed:b.stagger>0;
 return {kind:kind==='jelly'?'electric':'gaze',disabled,warning:!disabled&&phase<delay,active:!disabled&&e.state==='flying'&&phase>=delay&&phase<delay+.7,cycle:Math.floor(t/period),phase,period,
  lanes:kind==='jelly'?(rage?[105,315]:[b.turn%2?315:105]):[105+(b.turn%3)*105],
  width:kind==='jelly'?(rage?64:48):52,horizontal:kind==='eye'&&rage?365:null,tax:kind==='jelly'?(rage?.3:.2):(rage?.4:.3),scale};
}
export function bossBinFactor(e,index){const b=e.boss;if(!b||!b.hp)return 1;const kind=b.kind||'crab';if(kind==='crab'&&index===2&&b.turn%3===2&&liveTargets(e).length&&!b.sealBroken)return .5;if(kind==='eye'&&liveTargets(e).length&&[b.turn%5,(b.turn+2)%5].includes(index))return .5;return 1;}
export function bossStatus(e){const b=e.boss;if(!b)return '';const kind=b.kind||'crab',n=liveTargets(e).length;
 if(kind==='crab')return n?'护甲减伤 '+Math.round(n*30)+'% · 船锚 '+n+'/2':'完全破甲 · 伤害 ×1.25';
 if(kind==='jelly')return b.exposed?'过载！本发伤害 ×1.6 · 放电停止':'电盾减伤 45% · 击破任一电囊可过载';
 if(kind==='angler')return b.exposed?'腹口击穿 · 本发伤害 ×1.5':'鳞甲减伤 45% · 张嘴时下方弱点 ×3';
 return n?'封印减伤 65% · 按 ① → ② → ③ 破封（'+(3-n)+'/3）':'三重封印已破 · 伤害 ×1.75';
}
export function bossIntent(e){const b=e.boss;if(!b)return '';if(!b.hp)return '守卫已击退 · 航道开启';const kind=b.kind||'crab',h=bossThreat(e);
 if(kind==='crab'){if(!liveTargets(e).length)return '甲壳碎裂 · 本发伤害提高 25%';if(h.kind==='none')return b.turn%3===2?'船锚已断 · 本发中央封锁解除':'对应船锚已断 · 本发横扫解除';if(h.kind==='seal')return '沉船封锁 · 中央鱼缸倍率减半，拆掉一锚可解除';return (b.turn%2?'右':'左')+'钳横扫 · 下半场海流向'+(b.turn%2?'左':'右')+'推，拆掉'+(b.turn%2?'右':'左')+'锚可解除';}
 if(kind==='angler')return b.stagger>0?'腹口重击 · 吸力被打断':h.active?'吞潮！吸向腹口 · 从下方反击金色弱点':h.open?'腹口已暴露 · 本发可持续反击':'吸潮蓄力 · 张嘴后腹口发金光，闭嘴会咬鱼';
 if(h.disabled)return kind==='jelly'?'电囊过载 · 本发安全，下一发重新充能':'眼球受击 · 射线暂时中断';
 const attack=kind==='jelly'?(b.enraged?'双侧雷暴':'单侧电幕'):(b.enraged?'十字凝视':'竖向凝视');
 return attack+' · '+(h.active?'正在释放':h.warning?'虚线预警':'冷却')+' · 碰到光带损失 '+Math.round(h.tax*100)+'% 气泡分'+(kind==='eye'&&liveTargets(e).length?'，封缸 '+(b.turn%5+1)+' / '+((b.turn+2)%5+1):'');
}
export function trialBuild(kind){return kind==='crab'?{rich:1,chain:1,wide:1}:kind==='jelly'?{rich:1,chain:1,wide:1,extra:1,spring:1}:kind==='angler'?{rich:2,chain:1,wide:1,extra:1,spring:1,volley:1,magnet:1}:{rich:2,chain:1,wide:1,extra:1,spring:1,volley:1,magnet:1,combo:1,gold:1};}
