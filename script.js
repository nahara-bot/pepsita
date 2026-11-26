/* Interacciones, renderizado y accesibilidad. */
(() => {
  const D = window.PEPSICO_DATA;
  if (!D) { console.error("No se pudo cargar datos.js"); return; }
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const asset = p => p || "";
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const render = () => {
    $("#metrics").innerHTML = D.metrics.map((m,i)=>`<article class="metric"><div class="metric-value" data-count="${m.value}" data-prefix="${esc(m.prefix||"")}" data-suffix="${esc(m.suffix||"")}">${esc(m.prefix||"")}0${esc(m.suffix||"")}</div><div class="metric-label">${esc(m.label)}</div><div class="metric-detail">${esc(m.detail)}</div></article>`).join("");
    $("#timeline").innerHTML = D.timeline.map(t=>`<article class="time-item"><div class="time-year">${esc(t.year)}</div><h4>${esc(t.name)}</h4><p>${esc(t.description)}</p></article>`).join("");
    renderBrands("all");
    $("#moments-grid").innerHTML = D.occasions.map((o,i)=>`<article class="moment-card">${o.image?`<img src="${asset(o.image)}" alt="${esc(o.title)}" loading="lazy">`:""}<div class="moment-content"><span class="moment-num">${esc(o.number)}</span><h3>${esc(o.title)}</h3><p>${esc(o.description)}</p></div></article>`).join("");
    $("#culture-grid").innerHTML = D.marketing.map((m,i)=>`<article class="culture-card">${m.image?`<img src="${asset(m.image)}" alt="" loading="lazy">`:""}<h3>${esc(m.title)}</h3><p>${esc(m.description)}</p></article>`).join("");
    $("#journey-steps").innerHTML = D.journey.map((j,i)=>`<article class="journey-step"><b>0${i+1}</b><h4>${esc(j.title)}</h4><p>${esc(j.description)}</p></article>`).join("");
    $("#innovation-list").innerHTML = D.innovation.map((x,i)=>`<article class="innovation-item"><span>0${i+1}</span><div><h3>${esc(x.title)}</h3><p>${esc(x.description)}</p></div></article>`).join("");
    $("#impact-pillars").innerHTML = D.impact.map(x=>`<article class="impact-pillar"><h3>${esc(x.title)}</h3><b>${esc(x.subtitle)}</b><p>${esc(x.description)}</p></article>`).join("");
  };
  function renderBrands(filter) {
    const list = D.brands.filter(b=>filter==="all"||b.kind===filter);
    $("#brand-grid").innerHTML = list.map(b=>`<article class="brand-card">${b.image?`<img src="${asset(b.image)}" alt="${esc(b.name)}" loading="lazy">`:""}<span class="brand-cat">${esc(b.category)}</span><div><div class="brand-name">${esc(b.name)}</div><p class="brand-desc">${esc(b.description)}</p></div><span class="brand-arrow" aria-hidden="true">↗</span></article>`).join("");
  }
  $$(".filter").forEach(btn=>btn.addEventListener("click",()=>{
    $$(".filter").forEach(b=>b.classList.toggle("active",b===btn)); renderBrands(btn.dataset.filter);
  }));
  const header=$(".site-header"), nav=$(".main-nav"), toggle=$(".menu-toggle");
  const onScroll=()=>header.classList.toggle("scrolled",window.scrollY>30);
  window.addEventListener("scroll",onScroll,{passive:true}); onScroll();
  toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));});
  $$(".main-nav a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");}));
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target);}}),{threshold:.12});
  const observe=()=>$$(".reveal").forEach(el=>observer.observe(el));
  function counters(){
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{
      if(!e.isIntersecting)return; const el=e.target;io.unobserve(el);
      const end=Number(el.dataset.count),prefix=el.dataset.prefix||"",suffix=el.dataset.suffix||"",start=performance.now(),duration=1300;
      const tick=now=>{const p=Math.min((now-start)/duration,1),v=end*(1-Math.pow(1-p,3));el.textContent=prefix+(end%1? v.toFixed(1):Math.round(v))+suffix;if(p<1)requestAnimationFrame(tick);};
      requestAnimationFrame(tick);
    }),{threshold:.7});
    $$("[data-count]").forEach(el=>io.observe(el));
  }
  let qIndex=0,score=0,answered=false;
  function showQuestion(){
    const q=D.quiz[qIndex];answered=false;
    $("#quiz-number").textContent=`QUESTION ${String(qIndex+1).padStart(2,"0")}`;
    $("#quiz-question").textContent=q.question;
    $("#quiz-progress-label").textContent=`PREGUNTA ${String(qIndex+1).padStart(2,"0")} / ${String(D.quiz.length).padStart(2,"0")}`;
    $("#quiz-progress").style.width=`${(qIndex/D.quiz.length)*100}%`;
    $("#quiz-feedback").textContent="";
    $("#quiz-next").disabled=true;$("#quiz-next").textContent=qIndex===D.quiz.length-1?"Ver resultado →":"Siguiente pregunta →";
    $("#quiz-options").innerHTML=q.options.map((o,i)=>`<button class="quiz-option" data-option="${i}"><b>${String.fromCharCode(65+i)}</b>　${esc(o)}</button>`).join("");
    $$(".quiz-option").forEach(btn=>btn.addEventListener("click",()=>answer(Number(btn.dataset.option))));
  }
  function answer(selected){
    if(answered)return;answered=true;const q=D.quiz[qIndex],correct=selected===q.correct;
    if(correct)score++;
    $$(".quiz-option").forEach((b,i)=>{b.disabled=true;if(i===q.correct)b.classList.add("correct");else if(i===selected)b.classList.add("wrong");});
    $("#quiz-feedback").textContent=(correct?"¡Correcto! ":"No exactamente. ")+q.hint;
    $("#quiz-next").disabled=false;
  }
  $("#quiz-next").addEventListener("click",()=>{
    if(!answered)return;
    if(qIndex<D.quiz.length-1){qIndex++;showQuestion();return;}
    $("#quiz-number").textContent="YOUR RESULT";
    $("#quiz-question").textContent=`Obtuviste ${score} de ${D.quiz.length} respuestas correctas.`;
    $("#quiz-options").innerHTML="";
    $("#quiz-feedback").textContent=score===D.quiz.length?"¡Excelente! Conoces muy bien el ecosistema PepsiCo.":"Explora las secciones y vuelve a intentarlo.";
    $("#quiz-progress").style.width="100%";
    $("#quiz-next").disabled=false;$("#quiz-next").textContent="Volver a empezar ↻";
    $("#quiz-next").onclick=()=>{qIndex=0;score=0;$("#quiz-next").onclick=null;showQuestion();};
  });
  render();observe();counters();showQuestion();
  window.addEventListener("load",()=>setTimeout(()=>$(".preloader").classList.add("done"),450));
  setTimeout(()=>$(".preloader")?.classList.add("done"),2500);
})();
