// Optional: paste a Formspree (or similar) URL to receive enquiries by email
const CONFIG={formEndpoint:""};
const ROOMS={royal:["Royal Suite","Private terrace over the lake"],heritage:["Heritage Suite","Hand-painted walls, carved teak"],garden:["Garden Room","Opens onto the courtyard"],lake:["Lake View Room","Sunrise over Pichola"]};
const SCENES={
 intro:{art:"dark"},
 lake:{art:"lake",crumb:"LAKE PICHOLA",next:"arrival",line:"Dusk settles over the water."},
 arrival:{art:"gate",crumb:"ARRIVAL",next:"reception",line:"The gates of Kesar Mahal open."},
 reception:{art:"hall",crumb:"RECEPTION",q:"What would you like to experience?",opts:[["Stay","Suites and rooms","rooms"],["Wedding","Ceremonies on the lake shore","enquiry:Wedding"],["Banquet","Feasts in the courtyard","enquiry:Banquet"],["Dining","The terrace at sunset","enquiry:Dining"],["Spa","Rituals of the royal court","enquiry:Spa"]]},
 rooms:{art:"hall",crumb:"RECEPTION",q:"Which room would you like to see?",opts:Object.entries(ROOMS).map(([k,v])=>[v[0],v[1],"room:"+k])},
 enquiry:{art:"desk",crumb:"ENQUIRY",light:1},
 seal:{art:"seal",crumb:"ENQUIRY",light:1}
};
const $=s=>document.querySelector(s),stage=$("#stage"),ui=$("#ui");
let timer,topic="",cur="intro",until=0,seenRec=false;const JOURNEY=["intro","lake","arrival","reception"];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

function makeLayer(id,art){
 const d=document.createElement("div");d.className="layer art-"+art;
 if(id==="lake"){const c=document.createElement("canvas");c.className="lakecv";d.append(c);paintLake(c,d);const im=new Image();im.onload=()=>c.remove();im.src="assets/images/lake.jpg"}
 d.style.setProperty("--img",(id==="lake"&&innerHeight>innerWidth?"url(assets/images/lake-m.jpg),":"")+`url(assets/images/${id}.jpg)`); // missing file = code-made fallback shows
 const v=document.createElement("video");
 v.src=`assets/videos/${id}.mp4`;v.muted=v.autoplay=v.playsInline=true;v.loop=false; // plays once, holds last frame
 v.onplaying=()=>{v.classList.add("on");d.classList.add("vid")};v.onerror=()=>v.remove();
 d.append(v);return d;
}
function view(n,sc,id){
 if(n==="intro")return `<div class="center"><div class="pip"></div><button class="enter" data-go="lake">ENTER UDAIPUR</button></div><button class="cue" data-go="lake">SCROLL<i></i></button>`;
 if(sc.line)return `<p class="line">${sc.line}</p><button class="cue" data-go="${sc.next}">SCROLL<i></i></button>`;
 if(sc.opts){
  const lab=sc.label?`<div class="tag">${esc(sc.label)}</div>`:`<h1 class="q">${sc.q}</h1>`;
  return `${lab}<ul class="menu">${sc.opts.map(o=>`<li><button data-go="${o[2]}"><b>${esc(o[0])}</b><small>${esc(o[1])}</small></button></li>`).join("")}${sc.q?`<li><button class="alt" data-go="enquiry:">Or simply make an enquiry</button></li>`:""}</ul>`;
 }
 if(n==="enquiry")return `<form class="letter" id="f"><h2>Write to Kesar Mahal</h2><p>${topic?"REGARDING: "+esc(topic).toUpperCase():"A LETTER TO THE FRONT DESK"}</p>
  <label>NAME<input name="name" required autocomplete="name"></label><label>EMAIL<input name="email" type="email" required autocomplete="email"></label>
  <div class="row"><label>ARRIVAL<input name="from" type="date"></label><label>DEPARTURE<input name="to" type="date"></label></div>
  <label>MESSAGE<textarea name="msg" rows="3"></textarea></label><input type="hidden" name="topic" value="${esc(topic)}"><button class="send">SEAL AND SEND</button></form>`;
 if(n==="seal")return `<div class="center"><div class="env"><div class="seal">K</div></div><p class="thanks">Your letter is on its way.</p><button class="next" style="position:static;margin-top:24px;color:#4a3a22" data-go="reception">RETURN TO RECEPTION</button></div>`;
}
function go(t){
 clearTimeout(timer);
 let [n,a]=t.split(":"),sc=SCENES[n],id=n;
 if(n==="room"){id="room-"+a;sc={art:"room",crumb:ROOMS[a][0].toUpperCase(),label:ROOMS[a][0],opts:[["Exit","Back to reception","reception"],["Enquire about this room","Write a letter","enquiry:"+ROOMS[a][0]],["Explore another","See the other rooms","rooms"]]};}
 if(n==="enquiry")topic=a||"";
 if(!sc)return;cur=n;let wait=false;
 if(n==="reception"){if(seenRec)id="rooms";else{wait=true;seenRec=true}}
 if(n==="room")wait=true; // room clip plays, then the menu appears // first visit plays the video, then shows the menu
 const ni=JOURNEY.indexOf(n)+1;if(ni>0&&ni<JOURNEY.length){const p=document.createElement("video");p.preload="auto";p.muted=true;p.src=`assets/videos/${JOURNEY[ni]}.mp4`}
 const L=makeLayer(id,sc.art);stage.append(L);void L.offsetWidth;L.classList.add("show");
 ui.classList.toggle("hold",wait);
 if(wait){const v=L.querySelector("video"),rev=()=>ui.classList.remove("hold");if(v){v.addEventListener("ended",rev);v.addEventListener("error",rev);setTimeout(rev,12000)}else rev()}
 const old=[...stage.querySelectorAll(".layer")].filter(x=>x!==L);setTimeout(()=>old.forEach(x=>x.remove()),1500);
 ui.classList.add("out");
 setTimeout(()=>{
  ui.innerHTML=view(n,sc,id);ui.classList.remove("out");
  document.body.classList.toggle("light",!!sc.light);
  $("#crumb").textContent=sc.crumb||"";
  ui.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
  const f=$("#f");if(f)f.onsubmit=async e=>{e.preventDefault();
   if(CONFIG.formEndpoint){try{await fetch(CONFIG.formEndpoint,{method:"POST",headers:{Accept:"application/json"},body:new FormData(f)})}catch(_){}}
   go("seal")};
 },500);
}
function step(d,wheel){const now=Date.now(),i=JOURNEY.indexOf(cur)+d;
 if(now<until){if(wheel)until=Math.max(until,now+250);return}
 if(JOURNEY.indexOf(cur)<0||i<0||i>=JOURNEY.length)return;
 until=now+1800;go(JOURNEY[i])}
addEventListener("wheel",e=>{if(Math.abs(e.deltaY)>10)step(e.deltaY>0?1:-1,1)},{passive:true});
let ty=0;addEventListener("touchstart",e=>ty=e.touches[0].clientY,{passive:true});
addEventListener("touchend",e=>{const d=ty-e.changedTouches[0].clientY;if(Math.abs(d)>50)step(d>0?1:-1)});
addEventListener("keydown",e=>{const t=document.activeElement.tagName;
 if(["ArrowDown","PageDown"].includes(e.key)||(e.key===" "&&!/BUTTON|INPUT|TEXTAREA/.test(t)))step(1);
 if(["ArrowUp","PageUp"].includes(e.key))step(-1)});
ui.addEventListener("click",()=>ui.classList.remove("hold")); // tap to skip the wait
go("intro");
