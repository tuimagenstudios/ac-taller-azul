// Lista de simuladores gratis de AC-Taller: se muestra al pie de cada simulador.
(function(){
  var SIMS=[
    ["motor-4-tiempos.html","Motor de 4 tiempos","Cómo trabaja por dentro"],
    ["sistema-de-carga.html","Sistema de carga","Batería, burro y alternador"],
    ["distribucion.html","Distribución","Qué pasa si se corta la correa"],
    ["inyector.html","Inyector","Limpio contra sucio"],
    ["codigos-scanner.html","Códigos del scanner","Qué significa cada falla"],
    ["frenos.html","Frenos","Cuántos metros para frenar"],
    ["caja-de-cambios.html","Caja de cambios","Embrague, marchas y sincronizados"]
  ];
  var el=document.getElementById("otros"); if(!el) return;
  var aqui=location.pathname.split("/").pop()||"index.html";
  el.innerHTML=SIMS.map(function(s){
    return '<a href="'+s[0]+'"'+(s[0]===aqui?' aria-current="page"':'')+'>'+s[1]+'<span>'+s[2]+'</span></a>';
  }).join("");
})();
