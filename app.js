// Optional: paste a Formspree (or similar) URL to receive enquiries by email
const CONFIG={formEndpoint:""};
const ROOMS={royal:["Royal Suite","Private terrace over the lake"],heritage:["Heritage Suite","Hand-painted walls, carved teak"],garden:["Garden Room","Opens onto the courtyard"],lake:["Lake View Room","Sunrise over Pichola"]};
const SCENES={
 intro:{art:"dark"},
 lake:{art:"lake",crumb:"LAKE PICHOLA",next:"arrival",auto:8000,line:"Dusk settles over the water."},
 arrival:{art:"gate",crumb:"ARRIVAL",next:"reception",auto:8000,line:"The gates of Kesar Mahal open."},
 reception:{art:"hall",crumb:"RECEPTION",q:"What would you like to experience?",opts:[["Stay","Suites and rooms","rooms"],["Wedding","Ceremonies on the lake shore","enquiry:Wedding"],["Banquet","Feasts in the courtyard","enquiry:Banquet"],["Dining","The terrace at sunset","enquiry:Dining"],["Spa","Rituals of the royal court","enquiry:Spa"]]},
 rooms:{art:"hall",crumb:"RECEPTION",q:"Which room would you like to see?",opts:Object.entries(ROOMS).map(([k,v])=>[v[0],v[1],"room:"+k])},
 enquiry:{art:"desk",crumb:"ENQUIRY",light:1},
 seal:{art:"seal",crumb:"ENQUIRY",light:1}
};
const $=s=>document.querySelector(s),stage=$("#stage"),ui=$("#ui");
let timer,topic="";
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

function makeLayer(id,art){
 const d=document.createElement("div");d.className="layer art-"+art;
 d.style.setProperty("--img",`url(assets/images/${id}.jpg)`); // missing file = code-made fallback shows
 const v=document.createElement("video");
 v.src=`assets/videos/${id}.mp4`;v.muted=v.loop=v.autoplay=v.playsInline=true;
 v.onplaying=()=>v.classList.add("on");v.onerror=()=>v.remove();
 d.append(v);return d;
}
function view(n,sc,id){
 if(n==="intro")return `<div class="center"><div class="pip"></div><button class="enter" data-go="lake">ENTER UDAIPUR</button></div>`;
 if(sc.line)return `<p class="line">${sc.line}</p><button class="next" data-go="${sc.next}">CONTINUE</button>`;
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
 if(!sc)return;
 const L=makeLayer(id,sc.art);stage.append(L);void L.offsetWidth;L.classList.add("show");
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
  if(sc.auto)timer=setTimeout(()=>go(sc.next),sc.auto);
 },500);
}
go("intro");
