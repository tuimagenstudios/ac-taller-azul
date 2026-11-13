// Efectos comunes de los simuladores de AC-Taller: cursor de llave amarilla y sonidos de taller.
// Los sonidos se generan en el navegador (sin archivos) y se pueden silenciar con el botón «Sonido».
if(/[?&]lamina/.test(location.search))document.documentElement.classList.add("solo-lamina");
(function(){
  // ---- Cursor de llave (solo con mouse) ----
  var CUR="url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34' height='34' viewBox='0 0 64 64'%3E%3Cg transform='translate(64 0) scale(-1 1)'%3E%3Cpath d='M44 8a12 12 0 0 0-11 16L10 47a5 5 0 0 0 7 7l23-23a12 12 0 0 0 16-11l-8 5-7-2-2-7z' fill='%23f5e61b' stroke='%23000' stroke-width='3' stroke-linejoin='round'/%3E%3C/g%3E%3C/svg%3E\") 10 10, auto";
  var st=document.createElement("style");
  st.textContent="@media (hover:hover) and (pointer:fine){html,body,a,button,summary,label,input,.btn,.pieza,.pz,.chip{cursor:"+CUR+"!important}}"+
    ".sonido-fx{font:inherit;cursor:pointer;background:none;border:1px solid #33333a;border-radius:20px;color:#9d9da6;padding:3px 10px;font-size:.75rem;font-weight:700;margin-left:auto;white-space:nowrap}"+
    ".sonido-fx[aria-pressed='false']{opacity:.6}";
  document.head.appendChild(st);

  // ---- Sonidos ----
  var ac=null,on=true;try{on=localStorage.getItem("acSonido")!=="0"}catch(e){}
  function ctx(){if(!ac){var C=window.AudioContext||window.webkitAudioContext;if(!C)return null;ac=new C()}if(ac.state==="suspended")ac.resume();return ac}
  function tono(f,dur,tipo,vol,cuando,desliz){var a=ctx();if(!a)return;var t=a.currentTime+(cuando||0),o=a.createOscillator(),g=a.createGain();o.type=tipo||"sine";o.frequency.setValueAtTime(f,t);if(desliz)o.frequency.exponentialRampToValueAtTime(desliz,t+dur);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol||.2,t+.005);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g).connect(a.destination);o.start(t);o.stop(t+dur+.02)}
  function ruido(dur,vol,cuando,filtro){var a=ctx();if(!a)return;var t=a.currentTime+(cuando||0),n=Math.floor(a.sampleRate*dur),b=a.createBuffer(1,n,a.sampleRate),d=b.getChannelData(0);for(var i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,3);var s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=b;f.type="bandpass";f.frequency.value=filtro||3000;f.Q.value=2;g.gain.value=vol||.25;s.connect(f).connect(g).connect(a.destination);s.start(t)}
  var SON={
    pieza:function(){tono(2400,.25,"triangle",.12);tono(3600,.18,"sine",.06);tono(5200,.1,"sine",.03);ruido(.03,.15,0,6000)},
    clic:function(){ruido(.02,.3,0,2200);ruido(.02,.25,.06,2600);tono(900,.05,"square",.03)},
    falla:function(){ruido(.04,.45,0,1500);tono(240,.06,"square",.08)},
    criquet:function(n){for(var i=0;i<(n||6);i++){ruido(.025,.35,i*.055,2600);tono(1800,.03,"square",.03,i*.055)}},
    bien:function(){tono(660,.18,"triangle",.15);tono(880,.22,"triangle",.13,.09);tono(1320,.3,"sine",.08,.18)},
    mal:function(){tono(180,.25,"sawtooth",.08,0,120)}
  };
  window.TallerFX={sonar:function(k,x){if(on&&SON[k])SON[k](x)},activo:function(){return on}};

  // ---- Botón para silenciar (en la barra de la escena) ----
  var barra=document.querySelector(".banco .barra")||document.querySelector(".barra")||document.querySelector(".scanner .marca");
  if(barra){var b=document.createElement("button");b.type="button";b.className="sonido-fx";b.title="Activar o silenciar los sonidos";
    var pintar=function(){b.setAttribute("aria-pressed",on);b.textContent=on?"🔊 Sonido":"🔇 Sin sonido"};pintar();
    b.addEventListener("click",function(e){e.stopPropagation();on=!on;try{localStorage.setItem("acSonido",on?"1":"0")}catch(err){}pintar();if(on)SON.pieza()});
    if(!getComputedStyle(barra).gap||getComputedStyle(barra).gap==="normal")barra.style.gap="12px";
    barra.appendChild(b)}

  // ---- Qué suena con cada clic ----
  document.addEventListener("click",function(e){if(!on)return;var t=e.target.closest("button,.pieza,.pz,[role=button]");if(!t||t.classList.contains("sonido-fx"))return;
    if(t.dataset.fx){if(t.dataset.fx!=="none"&&SON[t.dataset.fx])SON[t.dataset.fx](8);return}
    if(t.closest(".pieza,.pz"))return SON.pieza();
    if(t.closest(".chip"))return SON.falla();
    if(t.closest(".puntas")||t.closest(".rapidos"))return SON.pieza();
    SON.clic();
  },true);
})();
