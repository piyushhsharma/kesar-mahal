// Code-made sunset lake (used until assets/videos/lake.mp4 or assets/images/lake.jpg exists)
function paintLake(c,layer){
 const x=c.getContext("2d"),dpr=Math.min(devicePixelRatio||1,1.5);let W,H;
 const size=()=>{W=c.width=innerWidth*dpr;H=c.height=innerHeight*dpr};size();addEventListener("resize",size);
 const ridge=(u,s)=>Math.sin(u*3+s)*.5+Math.sin(u*7.3+s*2)*.3+Math.sin(u*17+s*3)*.12+.6;
 const L=[[1.2,.1,"#b08f7e",.9],[3.1,.075,"#756f7a",1.1],[5.4,.05,"#444b59",1.6]];
 const D=Array.from({length:650},()=>({r:Math.random(),u:Math.random()*2-1,p:Math.random()*6.28,s:.4+Math.random(),k:Math.random()}));
 const boat=(bx,by,s,a)=>{x.save();x.translate(bx,by);x.scale(s,a<0?-s:s);x.globalAlpha=Math.abs(a);x.fillStyle="#1d1a1d";
  x.beginPath();x.moveTo(-60,0);x.quadraticCurveTo(0,14,60,0);x.lineTo(50,-8);x.lineTo(-52,-8);x.fill();
  x.fillRect(-26,-26,52,18);for(let i=0;i<4;i++){x.beginPath();x.arc(-18+i*12,-31,4,0,7);x.fill()}x.restore()};
 (function frame(t){
  if(!layer.isConnected)return;
  const hz=H*.47,sx=W*.6;
  let g=x.createLinearGradient(0,0,0,hz);g.addColorStop(0,"#d9965a");g.addColorStop(.6,"#f3c27f");g.addColorStop(1,"#fbdca0");
  x.fillStyle=g;x.fillRect(0,0,W,hz+2);
  g=x.createRadialGradient(sx,hz*.95,0,sx,hz*.95,H*.55);g.addColorStop(0,"rgba(255,240,200,.95)");g.addColorStop(.25,"rgba(255,214,150,.45)");g.addColorStop(1,"rgba(255,200,130,0)");
  x.fillStyle=g;x.fillRect(0,0,W,hz+2);
  for(const[f,h,col,bias]of L){x.fillStyle=col;x.beginPath();x.moveTo(0,hz);
   for(let px=0;px<=W;px+=8){const u=px/W;x.lineTo(px,hz-ridge(u*f*3,f)*h*H*(.45+.55*Math.pow(u,bias>1?bias:1)*(bias>1?1:1)+(bias<1?.2:0)))}
   x.lineTo(W,hz);x.fill();g=x.createLinearGradient(0,hz-h*H,0,hz);g.addColorStop(0,"rgba(250,205,140,0)");g.addColorStop(1,"rgba(250,205,140,.35)");x.fillStyle=g;x.fill()}
  x.fillStyle="#4a4140";for(let i=0;i<16;i++){const bx=W*(.06+i*.014),bh=(4+(i*7%9))*dpr;x.fillRect(bx,hz-bh,W*.009,bh)}
  g=x.createLinearGradient(0,hz,0,H);g.addColorStop(0,"#f0b873");g.addColorStop(.12,"#cf9460");g.addColorStop(.5,"#6d5a52");g.addColorStop(1,"#2a2f38");
  x.fillStyle=g;x.fillRect(0,hz,W,H-hz);
  g=x.createLinearGradient(0,hz,0,hz+H*.05);g.addColorStop(0,"rgba(60,60,75,.4)");g.addColorStop(1,"rgba(60,60,75,0)");x.fillStyle=g;x.fillRect(0,hz,W,H*.05);
  for(const d of D){const y=hz+d.r*d.r*(H-hz),sp=(.05+d.r*.5)*W,wob=Math.sin(t/2000+d.p)*6*d.r*dpr;
   const w=(6+d.r*70)*dpr*d.s,h=(1+d.r*3)*dpr,tw=.35+.65*Math.sin(t/600*d.s+d.p);
   if(d.k<.6){const a=Math.pow(1-Math.abs(d.u),1.6)*tw*(1-d.r*.6);x.fillStyle=`rgba(255,240,200,${a})`;x.fillRect(sx+d.u*sp*.5+wob-w/2,y,w,h)}
   else{x.fillStyle=`rgba(40,35,45,${.18*tw*(.4+d.r)})`;x.fillRect(d.u*W/2+W/2+wob-w/2,y,w*1.4,h)}}
  const by=hz+H*.075,bx=W*(.2+((t/110000)%1)*.45);boat(bx,by,H*.0016,1);boat(bx,by+H*.012,H*.0016,-.25);
  const o=Math.sin(t/1300)*H*.005;x.fillStyle="#1b1512";x.beginPath();x.moveTo(0,H*.74+o);x.quadraticCurveTo(W*.1,H*.82+o,W*.24,H+8);x.lineTo(0,H+8);x.fill();
  x.strokeStyle="#6a5242";x.lineWidth=2*dpr;x.beginPath();x.moveTo(0,H*.74+o);x.quadraticCurveTo(W*.1,H*.82+o,W*.24,H+8);x.stroke();
  requestAnimationFrame(frame)})(0);
}
