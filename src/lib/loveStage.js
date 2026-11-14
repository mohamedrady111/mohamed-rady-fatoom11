// Exact restored characters, ghosts, skits, and floating hearts
export function initLoveStage() {
(function(){
  if(window.DuoChars)return;
  var uidc=0;
  function markup(who,uid){
    var SK='#fde4dc';
    var eyeL='<clipPath id="ce1-'+uid+'"><ellipse cx="40" cy="60" rx="6.3" ry="7.2"/></clipPath>',
        eyeR='<clipPath id="ce2-'+uid+'"><ellipse cx="60" cy="60" rx="6.3" ry="7.2"/></clipPath>';
    if(who==='m'){
      var SKm='#fde4dc',NAVY='#1d2a52';
      var Pm='<circle r="4.2" fill="#22222c"/><circle r="2" fill="#0b0b12"/><circle cx="-1.3" cy="-1.6" r="1.5" fill="#fff"/><circle cx="1.6" cy="1.4" r=".7" fill="#fff" opacity=".7"/>';
      var cross=function(x,y){return '<path d="M'+x+' '+(y-3.2)+' v6.4 M'+(x-2.4)+' '+(y-.8)+' h4.8" stroke="#e8eaf0" stroke-width="1.3" stroke-linecap="round"/>';};
      return '<defs>'+eyeL+eyeR+'</defs><g class="dc-all">'+
        '<g class="dc-tail"><path d="M42 108 C14 116 -6 94 3 62 C6 50 12 45 17 38 C18 56 22 70 38 88 Z" fill="#e98b3d"/><path d="M3 62 C6 50 12 45 17 38 C16 50 12 57 3 62 Z" fill="#fff6ea"/><path d="M12 84 C16 90 24 94 34 96 M8 74 C12 82 20 88 30 92" stroke="#f6b06a" stroke-width="1.2" fill="none" stroke-linecap="round"/></g>'+
        '<path d="M31 102 L69 102 L78 124 L22 124 Z" fill="#121217"/>'+cross(38,113)+cross(62,113)+cross(50,119)+
        '<path d="M28 122 l1.4 2.9 3.1 .3 -2.3 2 .7 3.1 -2.9 -1.6 -2.9 1.6 .7 -3.1 -2.3 -2 3.1 -.3 Z" fill="#fff" opacity=".9"/>'+
        '<ellipse cx="36" cy="127" rx="10" ry="4.6" fill="#fff"/><ellipse cx="64" cy="127" rx="10" ry="4.6" fill="#fff"/>'+
        '<ellipse cx="36" cy="127" rx="11.5" ry="5.6" fill="none" stroke="#fff" stroke-width="2.2" stroke-dasharray=".1 4" stroke-linecap="round"/><ellipse cx="64" cy="127" rx="11.5" ry="5.6" fill="none" stroke="#fff" stroke-width="2.2" stroke-dasharray=".1 4" stroke-linecap="round"/>'+
        '<path d="M34 94 Q25 101 27 110" stroke="'+NAVY+'" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M66 94 Q75 101 73 110" stroke="'+NAVY+'" stroke-width="8" stroke-linecap="round" fill="none"/>'+
        '<path d="M28 101 l-3.5 1.2 M72 101 l3.5 1.2" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>'+
        '<circle cx="27" cy="111" r="4.2" fill="#111118"/><circle cx="73" cy="111" r="4.2" fill="#111118"/>'+
        '<rect x="44" y="78" width="12" height="13" fill="'+SKm+'"/>'+
        '<path d="M32 92 Q50 84 68 92 L72 108 Q50 113 28 108 Z" fill="'+NAVY+'"/>'+
        '<path d="M42 87.5 L50 97 L58 87.5" stroke="#fff" stroke-width="2.4" fill="none" stroke-linejoin="round" stroke-linecap="round"/>'+
        '<circle cx="50" cy="103" r="5.2" fill="#9c8660" stroke="#fff" stroke-width=".9"/><circle cx="47.6" cy="100.6" r="1.4" fill="#7d6a48"/><circle cx="52.4" cy="100.6" r="1.4" fill="#7d6a48"/><ellipse cx="50" cy="104.2" rx="2" ry="1.4" fill="#e9dcc0"/>'+
        '<path d="M60.5 94 h6 l-3.2 8" stroke="#fff" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" fill="none"/>'+
        '<g class="dc-pet"><ellipse cx="71" cy="90.5" rx="8.5" ry="4.6" fill="#e98b3d"/><circle cx="76" cy="83" r="6.4" fill="#e98b3d"/><path d="M71 79 L72 72 L77 77 Z M81 79 L81 72 L76 76 Z" fill="#e98b3d"/><path d="M72.6 76.4 L73 74 L75 76 Z M80 76.4 L80 74 L78 76 Z" fill="#fde4dc"/><path d="M71 85 Q76 91 81 85 Q80 82 76 82 Q72 82 71 85 Z" fill="#fff6ea"/><circle cx="73.6" cy="82.6" r=".95" fill="#2b1d12"/><circle cx="78.6" cy="82.6" r=".95" fill="#2b1d12"/><circle cx="76.1" cy="85" r=".9" fill="#2b1d12"/><g transform="translate(70 76)"><circle r="1.5" cx="2" fill="#fff"/><circle r="1.5" cx="-2" fill="#fff"/><circle r="1.5" cy="2" fill="#fff"/><circle r="1.5" cy="-2" fill="#fff"/><circle r="1" fill="#fcd34d"/></g></g>'+
        '<g class="dc-head">'+
          '<ellipse cx="50" cy="52" rx="34" ry="32" fill="#f4f4f9"/>'+
          '<ellipse cx="50" cy="53" rx="36.5" ry="34.5" fill="none" stroke="#f4f4f9" stroke-width="6" stroke-dasharray=".1 6.4" stroke-linecap="round"/>'+
          '<ellipse cx="50" cy="62" rx="21" ry="19" fill="'+SKm+'"/>'+
          '<ellipse cx="32" cy="72.5" rx="4" ry="2.2" fill="#f9a8b8" opacity=".6"/><ellipse cx="68" cy="72.5" rx="4" ry="2.2" fill="#f9a8b8" opacity=".6"/>'+
          '<g transform="rotate(-18 33 72.5)"><rect x="29.5" y="70.8" width="7" height="3.4" rx="1.4" fill="#f5d9b8" stroke="#d6b38a" stroke-width=".5"/></g>'+
          '<path class="m-shut" d="M45.5 76.5 Q50 80 54.5 76.5" stroke="#d9808c" stroke-width="1.8" fill="none" stroke-linecap="round"/><ellipse class="m-open" cx="50" cy="78" rx="3.6" ry="4.2" fill="#7f1d1d"/>'+
          '<path class="mo-flat" d="M45.5 77.4 H54.5" stroke="#cf7480" stroke-width="2" stroke-linecap="round"/><path class="mo-smirk" d="M45 78 Q50 78 55 75" stroke="#cf7480" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse class="mo-yawn" cx="50" cy="78.2" rx="4.8" ry="6" fill="#7f1d1d"/><ellipse class="mo-yawn" cx="50" cy="80.8" rx="2.6" ry="1.7" fill="#e86f86"/>'+
          '<text class="xe-sweat" x="74" y="44" font-size="11">💧</text><text class="xe-spark" x="70" y="38" font-size="11">✨</text><text class="xe-zzz" x="70" y="30" font-size="12">💤</text>'+
          '<path d="M15 60 C12 34 24 27 50 27 C76 27 88 34 85 60 L86 71 C81 76 76 71 72 75 C67 71 62 76 57 74.5 C52 71 47 76 42 74.5 C37 71 32 76 27 74.5 C22 71 17 75 14 71 Z" fill="#f6f6fb" stroke="#d6d7e4" stroke-width=".7"/><path d="M29 43 C33 56 32 66 29 74 M42 39 C45 55 44 66 42 74.5 M57 39 C55 55 56 66 57 74.5 M71 43 C67 56 68 66 71 74" stroke="#dcdde9" stroke-width="1" fill="none" stroke-linecap="round"/>'+
          '<g class="dc-ear-l"><path d="M21 29 L18 -7 L44 17 Z" fill="#f8ecd8" stroke="#e3cfae" stroke-width=".9" stroke-linejoin="round"/><path d="M25 22 L23.6 .5 L38.5 15 Z" fill="#f7b4bd"/></g>'+
          '<g class="dc-ear-r"><path d="M79 29 L82 -7 L56 17 Z" fill="#f8ecd8" stroke="#e3cfae" stroke-width=".9" stroke-linejoin="round"/><path d="M75 22 L76.4 .5 L61.5 15 Z" fill="#f7b4bd"/></g>'+
          '<path d="M20 40 C18 12 82 12 80 40 C70 33 30 33 20 40 Z" fill="#121218"/>'+
          '<path d="M19 38.5 C30 31.5 70 31.5 81 38.5 L80 46 C70 40.5 30 40.5 20 46 Z" fill="#f2f2f7"/>'+
          '<circle cx="27" cy="41" r="1.3" fill="#222"/><circle cx="36" cy="38.6" r="1.3" fill="#222"/><circle cx="46" cy="37.6" r="1.3" fill="#222"/><circle cx="56" cy="37.6" r="1.3" fill="#222"/><circle cx="66" cy="38.6" r="1.3" fill="#222"/><circle cx="74" cy="41" r="1.3" fill="#222"/>'+
          '<path d="M16 52 C13 6 87 6 84 52" stroke="#f4f5f8" stroke-width="4.2" fill="none" stroke-linecap="round"/>'+
          '<circle cx="16" cy="58" r="9.5" fill="#f4f5f8" stroke="#cfd4de" stroke-width="1"/><circle cx="84" cy="58" r="9.5" fill="#f4f5f8" stroke="#cfd4de" stroke-width="1"/>'+
          '<path d="M12 55 a4 4 0 0 1 8 0 v6 l-2 -1.5 l-2 1.5 l-2 -1.5 l-2 1.5 Z" fill="#17171f"/><circle cx="14.2" cy="55" r=".9" fill="#fff"/><circle cx="17.8" cy="55" r=".9" fill="#fff"/>'+
          '<path d="M80 55 a4 4 0 0 1 8 0 v6 l-2 -1.5 l-2 1.5 l-2 -1.5 l-2 1.5 Z" fill="#17171f"/><circle cx="82.2" cy="55" r=".9" fill="#fff"/><circle cx="85.8" cy="55" r=".9" fill="#fff"/>'+
          '<g class="dc-halo"><ellipse cx="50" cy="-8" rx="13" ry="3.8" fill="none" stroke="#fde68a" stroke-opacity=".45" stroke-width="5"/><ellipse cx="50" cy="-8" rx="13" ry="3.8" fill="none" stroke="#fcd34d" stroke-width="2"/></g>'+
        '</g></g>';
    }
    var P2=function(c){return '<circle r="4.8" fill="'+c+'"/><circle r="2.3" fill="#0b1226"/><circle cx="-1.5" cy="-1.8" r="1.6" fill="#fff"/><circle cx="1.8" cy="1.5" r=".8" fill="#fff" opacity=".8"/>';};
    var HOOD='#a9c8f2',HOODD='#8fb4e8';
    var eL='<clipPath id="ce1-'+uid+'"><ellipse cx="40" cy="62" rx="6.8" ry="7.8"/></clipPath>',eR='<clipPath id="ce2-'+uid+'"><ellipse cx="60" cy="62" rx="6.8" ry="7.8"/></clipPath>';
    return '<defs>'+eL+eR+'</defs><g class="dc-all">'+
      '<ellipse cx="41" cy="125" rx="8" ry="4" fill="#e8f0ff"/><ellipse cx="59" cy="125" rx="8" ry="4" fill="#e8f0ff"/>'+
      '<path d="M31 92 Q50 83 69 92 L75 120 Q50 128 25 120 Z" fill="'+HOOD+'"/>'+
      '<path d="M26 120 Q50 128 74 120" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-dasharray=".1 6" fill="none"/>'+
      '<path d="M50 92 L50 110" stroke="#fff" stroke-width="1.4" stroke-dasharray="1 2.5" stroke-linecap="round"/>'+
      '<circle cx="27" cy="111" r="5.8" fill="#fff"/><circle cx="73" cy="111" r="5.8" fill="#fff"/>'+'<g class="slip"><text x="0" y="0" font-size="20" text-anchor="middle">🩴</text></g>'+
      '<circle cx="27" cy="111" r="7.4" fill="none" stroke="#fff" stroke-width="2.4" stroke-dasharray=".1 4.2" stroke-linecap="round"/><circle cx="73" cy="111" r="7.4" fill="none" stroke="#fff" stroke-width="2.4" stroke-dasharray=".1 4.2" stroke-linecap="round"/>'+
      '<g class="dc-head">'+
        '<g class="dc-el"><ellipse cx="29" cy="12" rx="8.5" ry="25" transform="rotate(-12 29 12)" fill="'+HOOD+'" stroke="#fff" stroke-width="2.6"/><ellipse cx="29" cy="14" rx="4" ry="17" transform="rotate(-12 29 14)" fill="#dbe9ff"/></g>'+
        '<g class="dc-er"><ellipse cx="71" cy="12" rx="8.5" ry="25" transform="rotate(12 71 12)" fill="'+HOOD+'" stroke="#fff" stroke-width="2.6"/><ellipse cx="71" cy="14" rx="4" ry="17" transform="rotate(12 71 14)" fill="#dbe9ff"/></g>'+
        '<ellipse cx="50" cy="56" rx="35" ry="33" fill="'+HOOD+'"/>'+
        '<ellipse cx="50" cy="58" rx="30.5" ry="29" fill="none" stroke="#fff" stroke-width="8"/>'+
        '<ellipse cx="50" cy="58" rx="33" ry="31.5" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray=".1 5.4" stroke-linecap="round"/>'+
        '<ellipse cx="50" cy="60" rx="23" ry="21" fill="#fde9e4"/>'+
        '<path d="M28 52 C30 36 70 36 72 52 C64 46 58 51 50 42 C42 51 36 46 28 52 Z" fill="#eaf2ff"/>'+
        '<path d="M31 60 C36 52 46 53 48 60 M52 60 C54 53 64 52 69 60" stroke="#dde9fb" stroke-width="0" fill="none"/>'+
        '<ellipse cx="40" cy="62" rx="6.8" ry="7.8" fill="#fff" stroke="#27324a" stroke-width=".8"/><ellipse cx="60" cy="62" rx="6.8" ry="7.8" fill="#fff" stroke="#27324a" stroke-width=".8"/>'+
        '<g clip-path="url(#ce1-'+uid+')"><g transform="translate(40 62)"><g class="pupil">'+P2('#243a66')+'</g></g></g>'+
        '<g clip-path="url(#ce2-'+uid+')"><g transform="translate(60 62)"><g class="pupil">'+P2('#4aa3f7')+'</g></g></g>'+
        '<ellipse class="lid" cx="40" cy="54.2" rx="7" ry="8.2" fill="#fde9e4" stroke="#1b2338" stroke-width="1.3"/><ellipse class="lid" cx="60" cy="54.2" rx="7" ry="8.2" fill="#fde9e4" stroke="#1b2338" stroke-width="1.3"/>'+
        '<path d="M32.5 58.5 Q40 52.5 47.5 58.5 M52.5 58.5 Q60 52.5 67.5 58.5" stroke="#1b2338" stroke-width="2.1" fill="none" stroke-linecap="round"/><path d="M33 58 l-2.6 -2 M67 58 l2.6 -2" stroke="#1b2338" stroke-width="1.6" stroke-linecap="round"/>'+
        '<ellipse cx="31.5" cy="71" rx="4.2" ry="2.4" fill="#f9a8b8" opacity=".6"/><ellipse cx="68.5" cy="71" rx="4.2" ry="2.4" fill="#f9a8b8" opacity=".6"/>'+
        '<ellipse class="m-shut" cx="50" cy="74" rx="3.1" ry="1.9" fill="#e14b5a"/><ellipse class="m-open" cx="50" cy="75" rx="3.8" ry="4.6" fill="#8b1d2c"/>'+
        '<g class="mo-wail"><path d="M41 71.5 Q50 69 59 71.5 Q58 84 50 84 Q42 84 41 71.5 Z" fill="#8b1d2c"/><ellipse cx="50" cy="80.6" rx="5" ry="3.1" fill="#f0627a"/></g>'+
        '<g class="mo-grit"><rect x="43" y="72" width="14" height="6" rx="2.5" fill="#fff" stroke="#8b1d2c" stroke-width="1.3"/><path d="M47.5 72 V78 M52.5 72 V78 M43 75 H57" stroke="#8b1d2c" stroke-width=".9"/></g>'+
        '<ellipse class="drool" cx="55.4" cy="78.4" rx="1.8" ry="2.6" fill="#9bd4ff"/>'+
        '<path class="arc-eye" d="M33.6 62.5 Q40 55.5 46.4 62.5 M53.6 62.5 Q60 55.5 66.4 62.5" stroke="#1b2338" stroke-width="2.4" fill="none" stroke-linecap="round"/>'+
        '<path class="brow-ang" d="M31.5 53.5 L47.5 58.4 M68.5 53.5 L52.5 58.4" stroke="#1b2338" stroke-width="2.6" stroke-linecap="round"/>'+
        '<g class="hl2"><path d="M37.2 59.6 l1 2 2 .3 -1.5 1.4 .4 2 -1.9 -1 -1.9 1 .4 -2 -1.5 -1.4 2 -.3 Z M57.2 59.6 l1 2 2 .3 -1.5 1.4 .4 2 -1.9 -1 -1.9 1 .4 -2 -1.5 -1.4 2 -.3 Z" fill="#fff"/></g>'+
        '<g class="tear tl"><path d="M33.5 68 Q31 73 33.5 77 Q36 73 33.5 68 Z" fill="#8fd0ff"/></g><g class="tear tr"><path d="M66.5 68 Q64 73 66.5 77 Q69 73 66.5 68 Z" fill="#8fd0ff"/></g>'+
        '<text class="xe-vein" x="66" y="44" font-size="12">💢</text>'+
        '<path d="M70 38 l1.6 3.4 3.6 .4 -2.7 2.4 .8 3.6 -3.3 -1.9 -3.3 1.9 .8 -3.6 -2.7 -2.4 3.6 -.4 Z" fill="#cfd6e6" stroke="#9aa6bd" stroke-width=".5"/>'+
      '</g></g>';
  }
  window.DuoChars={markup:markup};
  if(typeof customElements==='undefined'||customElements.get('duo-char'))return;
  var ctx=null;
  function audio(){ try{ var AC=window.AudioContext||window.webkitAudioContext; if(!AC)return null; if(!ctx)ctx=new AC(); if(ctx.state==='suspended')ctx.resume(); return ctx; }catch(e){return null;} }
  function noise(c,dur){ var b=c.createBuffer(1,Math.floor(c.sampleRate*dur),c.sampleRate),d=b.getChannelData(0); for(var i=0;i<d.length;i++)d[i]=Math.random()*2-1; var s=c.createBufferSource(); s.buffer=b; return s; }
  function sneezeSound(pitch){
    var c=audio(); if(!c)return; var t=c.currentTime;
    try{
      var a=noise(c,.34),fa=c.createBiquadFilter(),ga=c.createGain(); fa.type='bandpass'; fa.Q.value=4;
      fa.frequency.setValueAtTime(700*pitch,t); fa.frequency.exponentialRampToValueAtTime(2200*pitch,t+.32);
      ga.gain.setValueAtTime(.0001,t); ga.gain.exponentialRampToValueAtTime(.16,t+.3); ga.gain.exponentialRampToValueAtTime(.0001,t+.34);
      a.connect(fa); fa.connect(ga); ga.connect(c.destination); a.start(t);
      var u=t+.44,b=noise(c,.3),fb=c.createBiquadFilter(),gb=c.createGain(); fb.type='bandpass'; fb.Q.value=1.6;
      fb.frequency.setValueAtTime(3200*pitch,u); fb.frequency.exponentialRampToValueAtTime(1100*pitch,u+.26);
      gb.gain.setValueAtTime(.0001,u); gb.gain.exponentialRampToValueAtTime(.5,u+.02); gb.gain.exponentialRampToValueAtTime(.0001,u+.28);
      b.connect(fb); fb.connect(gb); gb.connect(c.destination); b.start(u);
      var o=c.createOscillator(),go=c.createGain(); o.type='sawtooth'; o.frequency.setValueAtTime(380*pitch,u); o.frequency.exponentialRampToValueAtTime(200*pitch,u+.2);
      go.gain.setValueAtTime(.0001,u); go.gain.exponentialRampToValueAtTime(.08,u+.03); go.gain.exponentialRampToValueAtTime(.0001,u+.22);
      o.connect(go); go.connect(c.destination); o.start(u); o.stop(u+.25);
    }catch(e){}
  }
  var all=[],lastPt=null;
  function onPoint(e){ var p=(e.touches&&e.touches[0])||e; lastPt={x:p.clientX,y:p.clientY,t:Date.now()}; all.forEach(function(el){el._look&&el._look(true);}); }
  document.addEventListener('pointerdown',onPoint,{passive:true,capture:true});
  function Duo(){return Reflect.construct(HTMLElement,[],Duo);}
  Duo.prototype=Object.create(HTMLElement.prototype);
  Duo.prototype.constructor=Duo; Object.setPrototypeOf(Duo,HTMLElement);
  Duo.prototype.connectedCallback=function(){
    var el=this; if(el._init)return; el._init=true;
    var who=el.getAttribute('who')==='f'?'f':'m'; var uid=++uidc;
    el.classList.add('dc-'+who); if(el.hasAttribute('big'))el.classList.add('big');
    el.innerHTML='<span class="dc-name">'+(who==='m'?'محمد راضي':'فطوم')+'</span><svg viewBox="0 -14 100 144" aria-hidden="true">'+markup(who,uid)+'</svg><span class="dc-bubble"></span><span class="dc-drop" style="--dx:-14px">💦</span><span class="dc-drop" style="--dx:6px">💦</span><span class="dc-drop" style="--dx:20px">💧</span>';
    all.push(el);
    var pupils=el.querySelectorAll('.pupil'),bub=el.querySelector('.dc-bubble'),drops=el.querySelectorAll('.dc-drop'),tm=[];
    function look(x,y){ var tr='translate('+x.toFixed(2)+'px,'+y.toFixed(2)+'px)'; for(var i=0;i<pupils.length;i++)pupils[i].style.transform=tr; }
    function rnd(a,b){return a+Math.random()*(b-a);}
    el._look=function(follow){
      if(follow&&lastPt){ var r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height*.45,dx=lastPt.x-cx,dy=lastPt.y-cy,m=Math.max(1,Math.hypot(dx,dy));
        look(dx/m*2.7,dy/m*2.2); clearTimeout(el._lt); el._lt=setTimeout(function(){look(0,0);},1800); el._holdUntil=Date.now()+1900; }
    };
    (function wander(){ if(!document.body.contains(el)&&el._seen){return;} el._seen=true;
      if(!(el._holdUntil>Date.now())&&!el.classList.contains('sneezing')){ look(rnd(-2.6,2.6),rnd(-1.7,1.7)); }
      setTimeout(wander,rnd(1400,3800)); })();
    (function blinkLoop(){ setTimeout(function(){ if(!el.classList.contains('sneezing')){ el.classList.add('blink'); setTimeout(function(){el.classList.remove('blink');},230); if(Math.random()<.22){ setTimeout(function(){el.classList.add('blink'); setTimeout(function(){el.classList.remove('blink');},230);},330); } } blinkLoop(); },rnd(2000,5200)); })();
    function say(txt,delay,ms){ setTimeout(function(){ bub.textContent=txt; bub.classList.remove('show'); void bub.offsetWidth; bub.classList.add('show'); },delay); }
    el._say=say;
    function chirpSound(baseFreq){
      var c=audio(); if(!c)return; var t=c.currentTime;
      try{
        var o=c.createOscillator(),g=c.createGain();
        o.type='sine';
        o.frequency.setValueAtTime(baseFreq,t);
        o.frequency.exponentialRampToValueAtTime(baseFreq*1.45,t+.09);
        g.gain.setValueAtTime(.0001,t);
        g.gain.exponentialRampToValueAtTime(.09,t+.02);
        g.gain.exponentialRampToValueAtTime(.0001,t+.14);
        o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+.16);
      }catch(e){}
    }
    function charHearts(n){
      if(!window.__loveHeart)return;
      var r=el.getBoundingClientRect(),cx=r.left+r.width/2-8,cy=r.top+12;
      for(var i=0;i<(n||3);i++){
        (function(k){
          setTimeout(function(){
            window.__loveHeart(cx+rnd(-18,18),cy,{dy:-rnd(60,120),dx:rnd(-28,28),size:rnd(13,20),dur:rnd(1100,1700),op:.95});
          },k*80);
        })(i);
      }
    }
    function sneeze(){
      if(el.classList.contains('sneezing'))return;
      el.classList.add('sneezing'); look(0,0); try{document.dispatchEvent(new CustomEvent('duo-sneeze',{detail:who}));}catch(e){}
      sneezeSound(who==='f'?1.25:.9);
      say('آتشــيــه! 🤧',480);
      setTimeout(function(){ for(var i=0;i<drops.length;i++){ (function(d,k){ d.classList.remove('go'); void d.offsetWidth; setTimeout(function(){d.classList.add('go');},k*60); })(drops[i],i); } },500);
      setTimeout(function(){ el.classList.remove('sneezing'); },1400);
      say('الحمد لله 💗',1750);
      var other=all.filter(function(x){return x!==el&&x.isConnected;})[0];
      if(other&&other._say) other._say('يرحمك الله 🤲',2500);
      try{ if(navigator.vibrate) navigator.vibrate([15,50,35]); }catch(e){}
    }
    var tapIdx=0;
    function reactTap(){
      var idx=(tapIdx++)%5;
      if(idx===0){ sneeze(); return; }
      chirpSound(who==='f'?620:440);
      charHearts(idx===2?5:3);
      try{ if(navigator.vibrate) navigator.vibrate(18); }catch(e){}
      try{ document.dispatchEvent(new CustomEvent('duo-tap',{detail:{who:who,mode:idx}})); }catch(e){}
    }
    function stop(e){ e.stopPropagation(); }
    el.addEventListener('click',function(e){ e.stopPropagation(); reactTap(); });
    el.addEventListener('dblclick',function(e){ e.stopPropagation(); charHearts(6); sneeze(); });
    el.addEventListener('touchstart',stop,{passive:true});
    el.addEventListener('mousedown',stop);
  };
  Duo.prototype.disconnectedCallback=function(){ var i=all.indexOf(this); if(i>-1)all.splice(i,1); this._init=false; };
  customElements.define('duo-char',Duo);
})();

(function(){
  if(window.__loveInit)return; window.__loveInit=true;
  function rnd(a,b){return a+Math.random()*(b-a);}
  /* ---------- floating hearts ---------- */
  var HE=['💗','💘','💕','🩷','💞','💖'],live=0;
  function mkHeart(x,y,o){
    if(live>(o.force?170:44))return; var h=document.createElement('span'); h.className='lv-heart'; h.textContent=HE[(Math.random()*HE.length)|0];
    var sz=o.size||rnd(12,22); h.style.fontSize=sz+'px'; document.body.appendChild(h); live++;
    var dx=o.dx!=null?o.dx:rnd(-40,40),dy=o.dy!=null?o.dy:-rnd(160,320),dur=o.dur||rnd(2600,4600),op=o.op||.8,rot=rnd(-25,25);
    var a=h.animate([{transform:'translate('+x+'px,'+y+'px) scale(.4) rotate(0deg)',opacity:0},{transform:'translate('+(x+dx*.3)+'px,'+(y+dy*.3)+'px) scale(1) rotate('+rot+'deg)',opacity:op,offset:.18},{transform:'translate('+(x+dx)+'px,'+(y+dy)+'px) scale(.85) rotate('+(-rot)+'deg)',opacity:0}],{duration:dur,easing:'ease-out'});
    a.onfinish=function(){live--;if(h.parentNode)h.parentNode.removeChild(h);};
  }
  window.__loveHeart=mkHeart;
  var glow=document.createElement('div'); glow.className='lv-glow'; document.body.appendChild(glow);
  function ambient(){ if(!document.hidden&&!document.getElementById('splash')){ mkHeart(rnd(10,Math.max(40,innerWidth-30)),innerHeight+10,{dy:-(innerHeight*rnd(.5,.95)),dx:rnd(-50,50),op:.5,size:rnd(11,20),dur:rnd(5200,8200)}); } setTimeout(ambient,rnd(900,1700)); }
  setTimeout(ambient,1200);
  var lastTap=0;
  document.addEventListener('pointerdown',function(e){ var n=Date.now(); if(n-lastTap<110)return; lastTap=n;
    var c=1+((Math.random()*2)|0); for(var i=0;i<c;i++)mkHeart(e.clientX-8+rnd(-10,10),e.clientY-8,{dy:-rnd(70,150),dx:rnd(-34,34),op:.95,size:rnd(13,22),dur:rnd(900,1500)}); },{passive:true,capture:true});
  function lovePulse(x,y,o){
    o=o||{};
    var count=o.count||2;
    var color=o.color||'rgba(244,114,182,.85)';
    for(var i=0;i<count;i++){
      (function(k){
        setTimeout(function(){
          var ring=document.createElement('span');
          ring.className='lv-pulse-ring';
          ring.style.left=x+'px';
          ring.style.top=y+'px';
          ring.style.borderColor=color;
          ring.style.boxShadow='0 0 18px '+color+', inset 0 0 10px '+color;
          document.body.appendChild(ring);
          var sc=o.scale||3.2;
          var a=ring.animate([
            {transform:'translate(-50%,-50%) scale(.25)',opacity:.9},
            {transform:'translate(-50%,-50%) scale('+(sc*.62)+')',opacity:.55,offset:.45},
            {transform:'translate(-50%,-50%) scale('+sc+')',opacity:0}
          ],{duration:o.dur||1050,easing:'cubic-bezier(.2,.8,.3,1)'});
          a.onfinish=function(){if(ring.parentNode)ring.parentNode.removeChild(ring);};
        },k*160);
      })(i);
    }
    if(o.hearts){
      var n=o.hearts;
      for(var j=0;j<n;j++){
        mkHeart(x-8+rnd(-18,18),y-8+rnd(-10,10),{force:true,dy:-rnd(45,110),dx:rnd(-36,36),size:rnd(12,20),dur:rnd(1000,1500),op:.95});
      }
    }
  }
  window.__lovePulse=lovePulse;
  /* ---------- ghost ---------- */
  function ghostSVG(girl){ if(girl)return girlSVG(); return '<svg viewBox="0 0 60 70" aria-hidden="true"><g class="gh-in">'+
    '<g class="gh-armL"><ellipse cx="8" cy="42" rx="5" ry="3.2" fill="#e8f6ff" stroke="#9bd6ff" stroke-width="1"/></g><g class="gh-armR"><ellipse cx="52" cy="42" rx="5" ry="3.2" fill="#e8f6ff" stroke="#9bd6ff" stroke-width="1"/></g>'+
    '<path d="M10 36 C10 12 50 12 50 36 L50 58 Q45 51 40 58 Q35 65 30 58 Q25 51 20 58 Q15 65 10 58 Z" fill="#eaf7ff" fill-opacity=".92" stroke="#8fd3ff" stroke-width="1.5"/>'+
    '<path d="M16 24 C20 18 28 16 34 17" stroke="#fff" stroke-width="2.2" stroke-linecap="round" fill="none" opacity=".9"/>'+
    '<g class="gh-hp"><path d="M12 31 C12 7 48 7 48 31" stroke="#4aa3f7" stroke-width="3.6" fill="none" stroke-linecap="round"/><ellipse cx="11" cy="33" rx="4.6" ry="7.4" fill="#5eb3ff" stroke="#d8ecff" stroke-width="1.2"/><ellipse cx="49" cy="33" rx="4.6" ry="7.4" fill="#5eb3ff" stroke="#d8ecff" stroke-width="1.2"/><ellipse cx="11" cy="33" rx="2" ry="3.8" fill="#2f86e0"/><ellipse cx="49" cy="33" rx="2" ry="3.8" fill="#2f86e0"/></g>'+
    '<g class="gh-eyes"><circle cx="23.5" cy="35" r="2.6" fill="#16202e"/><circle cx="36.5" cy="35" r="2.6" fill="#16202e"/><circle cx="22.7" cy="34.1" r=".9" fill="#fff"/><circle cx="35.7" cy="34.1" r=".9" fill="#fff"/></g>'+
    '<g class="gh-laugh-eyes"><path d="M20.5 36 Q23.5 31.8 26.5 36 M33.5 36 Q36.5 31.8 39.5 36" stroke="#16202e" stroke-width="2" fill="none" stroke-linecap="round"/></g>'+
    '<ellipse cx="19" cy="40" rx="3" ry="1.8" fill="#ffb3c9" opacity=".75"/><ellipse cx="41" cy="40" rx="3" ry="1.8" fill="#ffb3c9" opacity=".75"/>'+
    '<path class="gh-mouth" d="M27.5 40.5 Q30 43 32.5 40.5" stroke="#16202e" stroke-width="1.3" fill="none" stroke-linecap="round"/>'+
    '<path class="gh-laugh-mouth" d="M26.5 39.8 Q30 45.2 33.5 39.8 Z" fill="#f43f5e" stroke="#16202e" stroke-width="1"/>'+
    '<g class="gh-bf"><ellipse cx="25" cy="46" rx="5.4" ry="3.6" transform="rotate(-28 25 46)" fill="#3b9bff"/><ellipse cx="35" cy="46" rx="5.4" ry="3.6" transform="rotate(28 35 46)" fill="#3b9bff"/><ellipse cx="26" cy="49.4" rx="3.2" ry="2.3" transform="rotate(25 26 49.4)" fill="#7cc4ff"/><ellipse cx="34" cy="49.4" rx="3.2" ry="2.3" transform="rotate(-25 34 49.4)" fill="#7cc4ff"/><rect x="29.2" y="43.8" width="1.6" height="7.4" rx=".8" fill="#17315c"/><circle cx="25.5" cy="45" r=".9" fill="#d9efff"/><circle cx="34.5" cy="45" r=".9" fill="#d9efff"/></g>'+
    '<g class="gh-sp"><path d="M50 18 l1.2 2.8 2.8 1.2 -2.8 1.2 -1.2 2.8 -1.2 -2.8 -2.8 -1.2 2.8 -1.2 Z" fill="#fff6a8"/></g>'+
    '</g></svg><span class="gh-bub"></span>'; }

  function girlSVG(){ return '<svg viewBox="0 0 60 70" aria-hidden="true"><g class="gh-in">'+
    '<g class="gh-armL"><ellipse cx="8" cy="43" rx="5" ry="3.2" fill="#e9f5ff" stroke="#a9d8ff" stroke-width="1"/></g><g class="gh-armR"><ellipse cx="52" cy="43" rx="5" ry="3.2" fill="#e9f5ff" stroke="#a9d8ff" stroke-width="1"/></g>'+
    '<path d="M10 36 C10 12 50 12 50 36 L50 58 Q45 51 40 58 Q35 65 30 58 Q25 51 20 58 Q15 65 10 58 Z" fill="#dff1ff" fill-opacity=".95" stroke="#9fd0ff" stroke-width="1.5"/>'+
    '<path d="M16 24 C20 18 28 16 34 17" stroke="#fff" stroke-width="2.2" stroke-linecap="round" fill="none" opacity=".95"/>'+
    '<g class="gh-bow"><path d="M38 14 L47 8 L47 20 Z M38 14 L29 8 L29 20 Z" fill="#ff8fb8" stroke="#ff5f9b" stroke-width=".9" stroke-linejoin="round"/><circle cx="38" cy="14" r="3.2" fill="#ff5f9b"/><circle cx="37" cy="13" r="1" fill="#ffd0e2"/></g>'+
    '<g class="gh-eyes"><circle cx="23.5" cy="35" r="3" fill="#16202e"/><circle cx="22.6" cy="34" r="1.1" fill="#fff"/><circle cx="25" cy="36.4" r=".6" fill="#fff"/><path d="M20 32.4 l-2.2 -1.4 M21 31.2 l-1.2 -2" stroke="#16202e" stroke-width="1.2" stroke-linecap="round"/></g>'+
    '<path class="gh-wink" d="M32.4 35.8 Q36.6 31.6 40.8 35.8" stroke="#16202e" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M41.4 33.4 l2.2 -1.4" stroke="#16202e" stroke-width="1.2" stroke-linecap="round"/>'+
    '<g class="gh-laugh-eyes"><path d="M20.2 35.8 Q23.5 31.4 26.8 35.8 M32.8 35.8 Q36.4 31.4 40 35.8" stroke="#16202e" stroke-width="2" fill="none" stroke-linecap="round"/></g>'+
    '<ellipse cx="18.5" cy="40.5" rx="3.6" ry="2.1" fill="#ffa8c8" opacity=".85"/><ellipse cx="41.5" cy="40.5" rx="3.6" ry="2.1" fill="#ffa8c8" opacity=".85"/>'+
    '<path class="gh-mouth" d="M26.6 40.2 Q28.4 43 30 40.8 Q31.6 43 33.4 40.2" stroke="#16202e" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'+
    '<path class="gh-laugh-mouth" d="M26.5 39.8 Q30 45.2 33.5 39.8 Z" fill="#f43f5e" stroke="#16202e" stroke-width="1"/>'+
    '<g class="gh-bf"><path d="M30 53.6 C22 48 25 43.2 28.6 44.4 C29.6 44.8 30 45.6 30 45.6 C30 45.6 30.4 44.8 31.4 44.4 C35 43.2 38 48 30 53.6 Z" fill="#ff7fae" stroke="#ff4f93" stroke-width=".8"/><circle cx="27.6" cy="46" r="1" fill="#ffd0e2"/></g>'+
    '<g class="gh-sp"><path d="M50 18 l1.2 2.8 2.8 1.2 -2.8 1.2 -1.2 2.8 -1.2 -2.8 -2.8 -1.2 2.8 -1.2 Z" fill="#fff6a8"/><path d="M8 24 l.9 2 2 .9 -2 .9 -.9 2 -.9 -2 -2 -.9 2 -.9 Z" fill="#fff6a8"/></g>'+
    '</g></svg><span class="gh-bub"></span>'; }
  function Ghost(){return Reflect.construct(HTMLElement,[],Ghost);} Ghost.prototype=Object.create(HTMLElement.prototype); Ghost.prototype.constructor=Ghost; Object.setPrototypeOf(Ghost,HTMLElement);
  Ghost.prototype.connectedCallback=function(){
    var g=this; if(g._on)return; g._on=true; var girlG=g.hasAttribute('girl'),owner=girlG?'f':'m'; if(girlG)g.classList.add('girl'); g.innerHTML=ghostSVG(girlG); var bub=g.querySelector('.gh-bub');
    var host=g.parentNode, stageEl=host.closest?host.closest('love-stage'):null;
    var st={th:rnd(0,6.28),sp:.022,mode:'orbit',mt:0,push:0,pushA:0,peek:0,t:0,talking:false,laughCd:0,avoidBlend:0,visitDir:(owner==='m'?1:-1)}, last=performance.now(), HW=48, HH=64, W=38,H=44;
    function getOuterDir(){
      if(!stageEl)return owner==='m'?1:-1;
      var mid=stageEl.querySelector('.ls-mid');
      if(!mid)return owner==='m'?1:-1;
      var mr=mid.getBoundingClientRect(), hr=host.getBoundingClientRect();
      return (hr.left+hr.width/2 >= mr.left+mr.width/2) ? 1 : -1;
    }
    function say(t){ bub.textContent=t; bub.classList.remove('show'); void bub.offsetWidth; bub.classList.add('show'); }
    g._say=say;
    function hearts(n){ var r=g.getBoundingClientRect(); for(var i=0;i<(n||2);i++){ window.__loveHeart&&window.__loveHeart(r.left+r.width/2-6+rnd(-12,12),r.top,{dy:-rnd(50,100),dx:rnd(-24,24),size:rnd(13,18),dur:1300,op:.95}); } }
    function triggerSpin(){ g.classList.remove('spin'); void g.offsetWidth; g.classList.add('spin'); setTimeout(function(){g.classList.remove('spin');},950); }
    function startDance(ms){ g.classList.add('dancing'); st.mode='dance'; st.mt=(ms||2400)/1000; setTimeout(function(){ g.classList.remove('dancing'); },ms||2400); }
    g.addEventListener('click',function(e){ e.stopPropagation(); triggerSpin(); startDance(2000); g.classList.add('laughing'); setTimeout(function(){ if(!st.talking)g.classList.remove('laughing'); },2200);
      say((girlG?['هيهي 🤭🎀','أنا هنا! ✨','غمزة! 😉','يا قلبي 💕','بصّولي! 🦋','بنضحك 😂🎀']:['بووو! 👻','هيهي 😂💙','أنا هنا! 🦋','ثانية 🗿','بخخ! 👻','يا قمر ✨'])[(Math.random()*6)|0]);
      hearts(3); st.mode='loop'; st.mt=2.2;
      try{ document.dispatchEvent(new CustomEvent('ghost-poke',{detail:{owner:owner}})); }catch(err){}
      try{ if(navigator.vibrate) navigator.vibrate(14); }catch(err){}
    });
    g.addEventListener('touchstart',function(e){e.stopPropagation();},{passive:true}); g.addEventListener('mousedown',function(e){e.stopPropagation();});
    document.addEventListener('ghost-poke',function(ev){
      var d=ev.detail||{};
      if(d.owner!==owner){
        setTimeout(function(){
          if(!g.isConnected)return;
          if(!st.talking){ st.mode='visit'; st.mt=2.6; }
          hearts(2);
          say(girlG?['هيهي 🎀','أنا هنا كمان! ✨','😉💕'][(Math.random()*3)|0]:['يا شقية 👻','بتعملي إيه؟ 💙','هيهي 🦋'][(Math.random()*3)|0]);
        },350);
      }
    });
    document.addEventListener('ghost-duet',function(){
      if(!g.isConnected||document.getElementById('splash')||st.talking)return;
      st.mode='visit'; st.mt=3.2; startDance(2600); hearts(3);
      say(girlG?['بنطير سوا! 🎀💙','شوفي القلب ده 💕','هيهي ✨'][(Math.random()*3)|0]:['أحلى صحاب 👻💙','يلا نلف الكون 🌌','هيهي 🦋'][(Math.random()*3)|0]);
    });
    document.addEventListener('duo-talk',function(ev){
      var d=ev.detail||{};
      st.talking=!!d.active;
      if(st.talking){
        g.classList.add('laughing');
        g.classList.remove('visiting');
        if(st.laughCd<=0){
          st.laughCd=3.2;
          if(Math.random()<.72){
            setTimeout(function(){
              if(!g.isConnected||!st.talking)return;
              say((girlG?['هيهي 🤭💕','عسل أوي 😂🎀','يا سيدي 🙈✨','هموت ضحك 😆','بصي بصي 😂💙']:['هيهي 😂👻','ايوة بقا 😆💙','يا عيني 🤭✨','عسلات 😂🦋','استمروا 👻💕'])[(Math.random()*5)|0]);
            }, owner==='m'?240:620);
          }
        }
      } else {
        setTimeout(function(){
          if(!st.talking) g.classList.remove('laughing');
        },380);
      }
    });
    document.addEventListener('duo-sneeze',function(ev){ if(ev.detail===owner){ st.push=1; st.pushA=rnd(-.5,.5); g.classList.add('scare'); setTimeout(function(){g.classList.remove('scare');},520); setTimeout(function(){say('يا ساتر! 😮');},180); } });
    document.addEventListener('duo-expr',function(ev){ var d=ev.detail||{}; if(d.who!==owner)return;
      if(d.x==='x-cry'||d.x==='x-wail'){ say(girlG?'متعيطيش يا فطوم 🥺💔':'🗿 يا ساتر 😭'); if(!st.talking){st.mode='visit'; st.mt=3.0;} }
      else if(d.x==='x-angry'){ g.classList.add('scare'); setTimeout(function(){g.classList.remove('scare');},520); st.mode='peek'; st.mt=2.4; say('😨😂'); }
      else if(d.x==='x-hungry'){ if(!st.talking){st.mode='loop'; st.mt=2.4;} say('🍕'); }
      else if(d.x==='x-sleepy'){ say('💤'); }
      else if(d.x==='x-love'||d.x==='x-shy'){ startDance(2200); hearts(2); say(girlG?'💘🎀':'💗✨'); }
      else if(d.x==='x-cheer'||d.x==='x-laugh'||d.x==='x-smirk'){ triggerSpin(); startDance(2200); say(girlG?'😉✨':'😏💙'); }
      else if(d.x==='x-peek'){ say('👀🤭'); }
    });
    document.addEventListener('duo-heart-boom',function(){
      if(!st.talking){ st.mode='visit'; st.mt=3.0; }
      triggerSpin(); startDance(2600);
      say(girlG?'ربنا يخليكم لبعض 🎀':'أحلى ثنائي في الكون 💙');
      hearts(4);
    });
    document.addEventListener('tasbih-tap',function(ev){
      var d=ev.detail||{};
      if(d.completed){
        triggerSpin(); startDance(3000); hearts(5);
        say(girlG?'مبروك يا فطوم 🎉💗':'تقبل الله يا محمد 🤲✨');
      } else if(d.count>0 && d.count%7===0){
        st.push=.55; st.pushA=rnd(-.4,.4); hearts(1);
        if(d.count%14===0) say(girlG?'ما شاء الله ✨':'استمر 🤲💙');
      }
    });
    function pickMode(){
      var r=Math.random();
      if(r<.22){st.mode='loop';st.mt=rnd(2.2,3.4);}
      else if(r<.44){st.mode='figure8';st.mt=rnd(3.0,4.6);}
      else if(r<.68){st.mode='visit';st.mt=rnd(2.6,3.8); hearts(1); if(!st.talking) say((girlG?['أهلاً 💙','🎀✨','فطومتي 💕','بصي يا محمد 👀']:['أهلاً يا ست 🦋','هيهي 👻','محمد يا بطل ✨','يا قمر 💙'])[(Math.random()*4)|0]);}
      else if(r<.80){st.mode='peek';st.mt=rnd(1.8,2.6);}
      else if(r<.90){startDance(2200); if(!st.talking) say((girlG?['💙','🎀','😉','✨']:['💙','🦋','هيهي','بوو'])[(Math.random()*4)|0]); st.mode='dance';st.mt=rnd(3.2,5.0);}
      else {st.mode='orbit';st.mt=rnd(4,7);}
    }
    pickMode();
    function frame(now){
      if(!g.isConnected){return;} var dt=Math.min(.05,(now-last)/1000); last=now;
      if(document.hidden){requestAnimationFrame(frame);return;}
      HW=host.clientWidth/2; HH=host.clientHeight*.5;
      st.t+=dt; st.mt-=dt; if(st.laughCd>0)st.laughCd-=dt;
      if(st.mt<=0)pickMode();
      var targetAvoid=st.talking?1:0;
      st.avoidBlend+=(targetAvoid-st.avoidBlend)*Math.min(1,dt*4.5);
      // Calm original ghost speed, with wider roaming range when not talking; smoothly steps aside and giggles when dialogue appears
      var rx=Math.min(72,HW*1.25),ry=36,speed=.022,loopY=0,scale=1,visitX=0;
      if(st.mode==='loop'){ speed=.045; loopY=Math.sin(st.t*4.8)*24; ry=42; }
      else if(st.mode==='figure8'){ speed=.036; rx=Math.min(92,HW*1.55); loopY=Math.sin(st.th*2)*26; }
      else if(st.mode==='dance'){ speed=.040; rx=Math.min(76,HW*1.3); loopY=Math.abs(Math.sin(st.t*5.6))*-18; }
      else if(st.mode==='visit' && !st.talking){
        var outD=getOuterDir();
        var prog=Math.min(1,Math.sin(Math.min(1,Math.max(0,st.mt/3.0))*Math.PI)*1.25);
        visitX=-outD*Math.min(120,HW*2.0)*prog;
        loopY=-22*prog+Math.sin(st.t*4.5)*7;
        g.classList.add('visiting');
      } else {
        g.classList.remove('visiting');
      }
      st.sp+=(speed-st.sp)*Math.min(1,dt*3.2); st.th+=st.sp*60*dt;
      var s=Math.sin(st.th),c=Math.cos(st.th);
      var roamX=HW+rx*c+visitX, roamY=HH+4+ry*s*.95+Math.sin(st.t*2.1)*5+loopY;
      if(st.mode==='peek' && !st.talking){ var k=Math.max(0,Math.min(1,st.mt>.6?1:st.mt/.6)); roamX=roamX+(HW-roamX)*.85*k; roamY=roamY+(HH-20-roamY)*.8*k; }
      var outer=getOuterDir();
      var dodgeX=HW+outer*Math.min(34,HW*.68)+Math.sin(st.t*2.4)*10;
      var dodgeY=16+Math.abs(Math.sin(st.t*4.2))*-8+Math.cos(st.t*2.1)*6;
      var x=roamX+(dodgeX-roamX)*st.avoidBlend;
      var y=roamY+(dodgeY-roamY)*st.avoidBlend;
      if(st.push>0){ st.push=Math.max(0,st.push-dt*1.0); x+=Math.cos(st.th+st.pushA)*48*st.push*(1-st.avoidBlend*.6); y+=Math.sin(st.th+st.pushA)*28*st.push-12*st.push; }
      scale=(.92+.18*s)*(1-st.avoidBlend*.04)+(st.talking?Math.abs(Math.sin(st.t*7))*0.06:0);
      var front=((s>0||st.mode==='visit')&&st.mode!=='peek')||st.talking;
      g.style.zIndex=front?4:1; g.style.opacity=front?1:.84;
      var tilt=(c*11+(st.mode==='loop'||st.mode==='figure8'?Math.sin(st.t*4.8)*12:0))*(1-st.avoidBlend)+Math.sin(st.t*7.5)*11*st.avoidBlend;
      g.style.transform='translate('+(x-W/2).toFixed(1)+'px,'+(y-H/2-10).toFixed(1)+'px) rotate('+tilt.toFixed(1)+'deg) scale('+scale.toFixed(3)+')';
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };
  customElements.define('duo-ghost',Ghost);
  /* ---------- stage ---------- */
  function sleep(ms){return new Promise(function(r){setTimeout(r,ms);});}
  function boom(el){
    var r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
    el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
    try{ document.dispatchEvent(new CustomEvent('duo-heart-boom')); }catch(e){}
    lovePulse(cx,cy,{count:3,scale:5.2,dur:1300,color:'rgba(244,114,182,.95)',hearts:6});
    var f=document.createElement('div'); f.style.cssText='position:fixed;inset:0;z-index:14;pointer-events:none;background:radial-gradient(circle at '+cx+'px '+cy+'px,rgba(255,105,180,.55),rgba(255,105,180,0) 62%)'; document.body.appendChild(f);
    f.animate([{opacity:0},{opacity:1,offset:.12},{opacity:0}],{duration:900,easing:'ease-out'}).onfinish=function(){f.remove();};
    for(var i=0;i<64;i++){ (function(i){ var a=Math.PI*2*i/64+rnd(-.1,.1),d=rnd(110,Math.max(innerWidth,innerHeight)*.75);
      setTimeout(function(){ mkHeart(cx-9,cy-9,{force:true,dx:Math.cos(a)*d,dy:Math.sin(a)*d,size:rnd(15,38),dur:rnd(1300,2500),op:1}); },(i%8)*25); })(i); }
    for(var j=0;j<14;j++){ (function(j){ setTimeout(function(){ mkHeart(rnd(0,innerWidth),innerHeight+6,{force:true,dx:rnd(-60,60),dy:-rnd(innerHeight*.5,innerHeight*1.05),size:rnd(18,40),dur:rnd(1800,3000),op:.95}); },200+j*60); })(j); }
    try{ if(navigator.vibrate)navigator.vibrate([25,30,70,30,25]); }catch(e){}
    try{ var AC=window.AudioContext||window.webkitAudioContext; if(AC){ var c=boom._c||(boom._c=new AC()); if(c.state==='suspended')c.resume(); var t=c.currentTime;
      [523,659,784,1047,1319].forEach(function(fq,k){ var o=c.createOscillator(),g=c.createGain(); o.type='sine'; o.frequency.value=fq; g.gain.setValueAtTime(.0001,t+k*.06); g.gain.exponentialRampToValueAtTime(.16,t+k*.06+.02); g.gain.exponentialRampToValueAtTime(.0001,t+k*.06+.26); o.connect(g); g.connect(c.destination); o.start(t+k*.06); o.stop(t+k*.06+.3); }); } }catch(e){}
  }
  function Stage(){return Reflect.construct(HTMLElement,[],Stage);} Stage.prototype=Object.create(HTMLElement.prototype); Stage.prototype.constructor=Stage; Object.setPrototypeOf(Stage,HTMLElement);
  Stage.prototype.connectedCallback=function(){
    var el=this; if(el._on)return; el._on=true;
    el.innerHTML='<div class="ls-love-aura" aria-hidden="true"></div><div class="ls-row"><div class="ls-slot"><duo-char who="m" big></duo-char><duo-ghost></duo-ghost></div><div class="ls-mid"><div class="ls-heart-wrap"><span class="ls-pulse-ring" aria-hidden="true"></span><span class="ls-pulse-ring d2" aria-hidden="true"></span><div class="ls-heart">❤️</div></div><div class="ls-bubs"><div class="ls-b ls-bf"></div><div class="ls-b ls-bm"></div></div></div><div class="ls-slot"><duo-char who="f" big></duo-char><duo-ghost girl></duo-ghost></div></div>';
    ['click','touchstart','mousedown'].forEach(function(ev){ el.addEventListener(ev,function(e){e.stopPropagation();},{passive:true}); });
    var heart=el.querySelector('.ls-heart'),bm=el.querySelector('.ls-bm'),bf=el.querySelector('.ls-bf');
    var chars={}; function C(w){ return chars[w]||(chars[w]=el.querySelector('duo-char[who='+w+']')); }
    var XS=['x-sleepy','x-smirk','x-sweat','x-spark','x-angry','x-hungry','x-wail','x-cry','x-laugh','x-flat','x-love','x-shy','x-cheer','x-peek'], tok={m:0,f:0};
    function pulseStage(heavy){
      el.classList.remove('pulsing'); void el.offsetWidth; el.classList.add('pulsing');
      setTimeout(function(){ el.classList.remove('pulsing'); },1300);
      if(!document.getElementById('splash')){
        var hr=heart.getBoundingClientRect();
        if(hr.width>0){
          lovePulse(hr.left+hr.width/2, hr.top+hr.height/2, {
            count: heavy?3:2,
            scale: heavy?4.1:2.9,
            dur: heavy?1250:950,
            color: heavy?'rgba(244,114,182,.92)':'rgba(251,113,133,.72)',
            hearts: heavy?4:0
          });
        }
      }
    }
    (function heartbeatAmbient(){
      setTimeout(function(){
        if(!el.isConnected)return;
        if(!document.hidden && !document.getElementById('splash')){
          var hr=heart.getBoundingClientRect();
          if(hr.width>0){
            lovePulse(hr.left+hr.width/2, hr.top+hr.height/2, {count:1,scale:2.4,dur:1100,color:'rgba(244,114,182,.55)'});
          }
        }
        heartbeatAmbient();
      }, 3400);
    })();
    function X(w,cls,ms){ var c=C(w); if(!c)return; var t=++tok[w]; XS.forEach(function(x){c.classList.remove(x);}); (cls||'').split(' ').forEach(function(x){ if(x)c.classList.add(x); });
      var first=cls?cls.split(' ')[0]:'';
      try{document.dispatchEvent(new CustomEvent('duo-expr',{detail:{who:w,x:first}}));}catch(e){}
      if(first==='x-love'||first==='x-shy'||first==='x-cheer'){ pulseStage(first==='x-love'); }
      var dur=ms?Math.round(ms*1.45):0;
      if(dur)setTimeout(function(){ if(tok[w]===t)XS.forEach(function(x){c.classList.remove(x);}); },dur); }
    var talkCount=0;
    function notifyTalk(active){
      try{ document.dispatchEvent(new CustomEvent('duo-talk',{detail:{active:active}})); }catch(e){}
    }
    function say(w,txt,ms){
      var b=w==='m'?bm:bf;
      b.textContent=txt; b.classList.add('on');
      talkCount++;
      if(talkCount===1) notifyTalk(true);
      var readMs=Math.max(3200, Math.round((ms||2400)*1.5));
      return sleep(readMs).then(function(){
        b.classList.remove('on');
        talkCount=Math.max(0,talkCount-1);
        if(talkCount===0) notifyTalk(false);
        return sleep(480);
      });
    }
    var busy=false;
    function wail(n){ return 'و'+new Array(n+1).join('ع'); }
    function mReactCry(){ var r=Math.random()<.5; X('m',r?'x-flat':'x-sweat',2600); return say('m',r?'🗿🗿🗿':'يمههههه',2300); }
    function loveDramaSkit(){
      X('f','x-peek',2900);
      return say('f','بتحبني ولا لا💔😕',2600)
        .then(function(){ X('m','x-smirk',2500); return say('m','لا',2200); })
        .then(function(){ X('f','x-wail',3600); return say('f',wail(48)+'💔😭😭',3400); })
        .then(mReactCry)
        .then(function(){ X('f','x-cry',3600); return say('f','سلمههههههههع بتووووووولل عزههههههههع😭',3400); })
        .then(mReactCry)
        .then(function(){ X('f','x-cry',3600); return say('f','محمد مش بيحبني💔💔😭😭😭😭😭😭',3400); })
        .then(mReactCry)
        .then(function(){ X('f','x-peek',3000); return say('f','بتحبني ولا لا؟💔😕☹️',2700); })
        .then(function(){ X('m','x-love',3600); X('f','x-love',3600); pulseStage(true); return say('m','بمووت فيكي يروحييي 💘💗',3300); });
    }
    var SK=[
      loveDramaSkit,
      function(){ X('m','x-sleepy',4400); return say('m','عيز انااام🗿',2600).then(function(){ X('f','x-angry',3800); return say('f','مفيش نوم 🩴🌚',2700);}).then(function(){ X('m','x-sweat',2200); return say('m','حاضر حاضر 🗿',2000); }); },
      function(){ X('f','x-hungry',3600); return say('f','عيزه اكل جوعااانه 🍕',2600).then(function(){ X('m','x-smirk',3400); return say('m','همك كرشك ي ام كرش 🗿',2700);}).then(function(){ X('f','x-wail',2800); return say('f',wail(14),2400); }).then(function(){ var h=Math.random()<.5; X('m',h?'x-smirk x-spark':'x-smirk',2800); return say('m',h?'هرمونات 🗿✨️':'مجنونه 🗿',2400); }); },
      function(){ X('f','x-cry',4000); return say('f',wail(22)+'😭😭',3100).then(function(){ var h=Math.random()<.5; X('m',h?'x-smirk x-spark':'x-smirk',2800); return say('m',h?'هرمونات 🗿✨️':'مجنونه 🗿',2500); }); },
      function(){ X('f','x-wail',2600); return say('f',wail(12),2300).then(function(){ X('m','x-flat',2200); return say('m','🗿',1900); }); },
      function(){ X('m','x-sleepy',3800); return say('m','عيز انااام🗿',2600).then(function(){ X('f','x-angry',3600); return say('f','مفيش نوم 🩴🌚',2600); }); },
      function(){ X('m','x-love',3800); pulseStage(true); return say('m','فطومتي القمر 🌙💗',2600).then(function(){ X('f','x-shy',3200); return say('f','بس بتكسف 🙈💕',2400); }).then(function(){ X('m','x-cheer',2600); return say('m','أحلى قمر في المجرة ✨',2400); }); },
      function(){ X('f','x-peek',3200); return say('f','بتحبني قد إيه؟ 🥺',2500).then(function(){ X('m','x-love',3400); pulseStage(true); return say('m','قد الفضاء ده كله 🌌💘',2700); }).then(function(){ X('f','x-laugh',2600); return say('f','هيهي وأنا أكتر 💖',2400); }); },
      function(){ X('m','x-peek',3200); return say('m','تعالي نعد النجوم سوا ✨',2500).then(function(){ X('f','x-hungry',3000); return say('f','لا هات شاورما الاول 🌯😂',2500); }).then(function(){ X('m','x-smirk',2600); return say('m','ام كرشش 🗿',2400); }); },
      function(){ X('f','x-peek',2600); return say('f','محمد... 👀',2100).then(function(){ X('m','x-smirk',2600); return say('m','عيون محمد؟ 💗',2200); }).then(function(){ X('f','x-hungry',2800); return say('f','هات شوكولاتة 🍫🥺',2500); }).then(function(){ X('m','x-love',2800); pulseStage(true); return say('m','من عيوني يستي 🗿🍫',2500); }); },
      function(){ X('m','x-cheer',2800); X('f','x-cheer',2800); pulseStage(false); return say('m','يلا نسبّح سوا 🤲✨',2500).then(function(){ X('f','x-love',2800); return say('f','ربنا يجمعنا في الخير 💗',2500); }); },
      loveDramaSkit
    ];
    var last=-1;
    function runScene(fn){
      if(busy)return;
      busy=true;
      fn().then(function(){ X('m','',0); X('f','',0); bm.classList.remove('on'); bf.classList.remove('on'); talkCount=0; notifyTalk(false); busy=false; });
    }
    (function loop(){ setTimeout(function(){ if(!el.isConnected)return; if(document.hidden||busy||document.getElementById('splash')){loop();return;}
      busy=true; var k; do{k=(Math.random()*SK.length)|0;}while(k===last); last=k;
      SK[k]().then(function(){ X('m','',0); X('f','',0); bm.classList.remove('on'); bf.classList.remove('on'); talkCount=0; notifyTalk(false); busy=false; loop(); }); },rnd(3200,5600)); })();
    (function ghostDuetLoop(){ setTimeout(function(){ if(!el.isConnected)return; if(!document.hidden&&!document.getElementById('splash')){ try{document.dispatchEvent(new CustomEvent('ghost-duet'));}catch(e){} } ghostDuetLoop(); },rnd(8500,13500)); })();

    document.addEventListener('duo-tap',function(ev){
      var d=ev.detail||{};
      pulseStage(false);
      if(d.who==='m'){
        if(d.mode===1) runScene(function(){ X('m','x-love',2800); pulseStage(true); return say('m','بحبك ي فطوم 💘',2400).then(function(){ X('f','x-shy',2400); return say('f','يا مجنون 🙈💗',2200); }); });
        else if(d.mode===2) runScene(function(){ X('m','x-sleepy',2800); return say('m','عيز انااام🗿',2400).then(function(){ X('f','x-angry',3000); return say('f','مفيش نوم 🩴🌚',2400); }); });
        else if(d.mode===3) runScene(function(){ X('m','x-smirk',2600); return say('m','شايفة الكتكوت ده؟ 🦊',2300).then(function(){ X('f','x-laugh',2400); return say('f','قمر زينا 😌✨',2200); }); });
        else runScene(function(){ X('m','x-cheer',2600); pulseStage(true); return say('m','فطومتي وبس 💗',2200).then(function(){ X('f','x-love',2400); return say('f','ربنا يخليك ليا 🤲💖',2200); }); });
      } else if(d.who==='f'){
        if(d.mode===1) runScene(loveDramaSkit);
        else if(d.mode===2) runScene(function(){ X('f','x-angry',2800); return say('f','مفيش نوم 🩴🌚',2400).then(function(){ X('m','x-sweat',2400); return say('m','حاضر حاضر 🗿',2100); }); });
        else if(d.mode===3) runScene(function(){ X('f','x-hungry',2800); return say('f','هات شوكولاتة 🍫🥺',2400).then(function(){ X('m','x-love',2600); pulseStage(true); return say('m','من عيوني يستي 🗿🍫',2300); }); });
        else runScene(function(){ X('f','x-hungry',2800); return say('f','لا هات شاورما الاول 🌯😂',2400).then(function(){ X('m','x-smirk',2600); return say('m','ام كرشش 🗿',2200); }); });
      }
    });

    document.addEventListener('ghost-poke',function(ev){
      var d=ev.detail||{}, w=d.owner==='f'?'f':'m', c=C(w);
      if(c){ c.classList.add('tap-pulse'); setTimeout(function(){ c.classList.remove('tap-pulse'); },260); }
      if(!busy){
        runScene(function(){
          X(w,w==='f'?'x-laugh':'x-peek',2000);
          return say(w,w==='f'?'الشبح بيضحكني 😂🎀':'إيه يا شبح! 👻💙',1800);
        });
      }
    });

    document.addEventListener('tasbih-tap',function(ev){
      var d=ev.detail||{};
      var cm=C('m'), cf=C('f');
      if(cm){ cm.classList.add('tap-pulse'); setTimeout(function(){cm.classList.remove('tap-pulse');},160); }
      if(cf){ cf.classList.add('tap-pulse'); setTimeout(function(){cf.classList.remove('tap-pulse');},160); }
      if(d.count>0 && d.count%3===0){
        pulseStage(d.completed || d.count%11===0);
      }
      if(d.count>0 && d.count%4===0){
        var hr=heart.getBoundingClientRect();
        mkHeart(hr.left+hr.width/2-8,hr.top,{dy:-rnd(60,120),dx:rnd(-28,28),size:15,dur:1200,op:.9});
      }
      if(d.completed){
        var hr2=heart.getBoundingClientRect();
        for(var q=0;q<12;q++){
          mkHeart(hr2.left+hr2.width/2-8+rnd(-24,24),hr2.top,{force:true,dy:-rnd(90,190),dx:rnd(-70,70),size:rnd(16,26),dur:rnd(1400,2200),op:1});
        }
        if(!busy){
          runScene(function(){
            X('m','x-cheer',2800); X('f','x-cheer',2800); pulseStage(true);
            return say('m','ما شاء الله يا فطوم! 🎉✨',2200).then(function(){ X('f','x-love',2400); return say('f','تقبل الله مننا 🤲💗',2200); });
          });
        }
      } else if(d.count>0 && d.count%11===0 && !busy){
        var msgs=[
          ['m','تقبل الله 🤲✨'],
          ['f','عاش مكملين 💪💗'],
          ['m','اللهم بارك 🌙'],
          ['f','أحلى تسبيح سوا 💕']
        ];
        var pick=msgs[(Math.random()*msgs.length)|0];
        runScene(function(){ X(pick[0],'x-love',2000); pulseStage(true); return say(pick[0],pick[1],1800); });
      }
    });

    heart.addEventListener('click',function(e){ e.stopPropagation(); boom(heart); X('m','x-laugh',2400); X('f','x-laugh',2400); });
  };
  customElements.define('love-stage',Stage);
})();
}
