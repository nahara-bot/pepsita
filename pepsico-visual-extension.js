/* PepsiCo visual extension — independent add-on for the existing GitHub Pages site.
   Does not replace or edit index.html, styles.css, script.js or datos.js. */
(() => {
  'use strict';
  const ROOT = document.currentScript?.src ? new URL('.', document.currentScript.src).href : './';
  const local = (p) => new URL(p, ROOT).href;
  const fallback = local('assets/deck/slide-01-image-01-e82a851d03.png');
  const images = {
    portfolio: 'https://digitalassets.pepsico.com/transform/c6d54222-a255-4c4c-960e-806546a1b3d3/super-bowl-header-lays-poppi-pepsi?q=75&w=2400',
    doritosF1: 'https://digitalassets.pepsico.com/transform/9f212303-5145-4d62-b485-9925308ef6bf/Doritos-Loaded-F1-image?q=75&w=2400',
    farming: 'https://digitalassets.pepsico.com/transform/84b13a99-153b-4333-9602-fcef1e54f8d8/2023-esg-summary-potato-farm-press-release-landscape-thumbnail?q=75&w=2400',
    gatorade: 'https://digitalassets.pepsico.com/asset/a94221f0-ea71-4919-bdb5-f3e1353d4f25/thumbnail/webimage-gatorade-thumbnail?q=75&w=2000'
  };
  const news = [
    {date:'19 NOV 2026',tag:'ALIANZAS · EXPERIENCIA',title:'Hyatt y PepsiCo renuevan su colaboración por diez años',desc:'El acuerdo contempla más de 700 propiedades Hyatt en Estados Unidos y acceso a un portafolio de bebidas, hidratación, nutrición y snacks.',url:'https://www.pepsico.com/en/newsroom/press-releases/2026/hyatt-pepsico-ten-year-collaboration-guest-experience-growth-across-seven-hundred-plus-properties',image:images.portfolio,alt:'Selección de productos PepsiCo del portafolio corporativo'},
    {date:'17 NOV 2026',tag:'MARKETING · MOTORSPORT',title:'Pepsi y Doritos activan el Gran Premio de Las Vegas 2026',desc:'Una experiencia gastronómica y de entretenimiento integra restaurantes locales, propuestas Doritos Loaded y bebidas DRIPS by Pepsi.',url:'https://www.pepsico.com/newsroom/press-releases/2026/pepsi-turns-up-flavor-formula-1-heineken-las-vegas-grand-prix-2026-race-mgm-resorts-international',image:images.doritosF1,alt:'Activación de Doritos junto a Fórmula 1'},
    {date:'16 NOV 2026',tag:'SOSTENIBILIDAD · PEP+',title:'PepsiCo informa avances en abastecimiento libre de deforestación',desc:'La compañía comunicó que el 94% del abastecimiento de materias primas de alto riesgo en operaciones propias fue libre de deforestación al cierre de 2025.',url:'https://www.pepsico.com/newsroom/press-releases/2026/pepsico-announces-progress-toward-deforestation-free-sourcing-goal',image:images.farming,alt:'Cultivo de papas en una explotación agrícola'},
    {date:'17 SEP 2026',tag:'CORPORATE BRAND · PORTAFOLIO',title:'House of Brands: la primera campaña corporativa de PepsiCo',desc:'La campaña presenta la amplitud del portafolio y conecta marcas como Lay’s, Doritos, Cheetos, Gatorade y Quaker con la compañía que las reúne.',url:'https://www.pepsico.com/newsroom/stories/2026/pepsico-first-corporate-brand-campaign',image:images.gatorade,alt:'Imagen de campaña de Gatorade'}
  ];
  const css = document.createElement('link'); css.rel='stylesheet'; css.href=local('pepsico-visual-extension.css'); document.head.appendChild(css);
  const make = (tag, cls, text) => { const el=document.createElement(tag); if(cls)el.className=cls; if(text!==undefined)el.textContent=text; return el; };
  const picture = (src, alt, cls='') => { const img=make('img',cls); img.src=src; img.alt=alt; img.loading='lazy'; img.decoding='async'; img.onerror=()=>{ if(img.src!==fallback) img.src=fallback; else img.hidden=true; }; return img; };
  function buildNews(){
    if(document.getElementById('pepsico-live-news')) return;
    const section=make('section','pcx-news'); section.id='pepsico-live-news';
    const head=make('div','pcx-news-head');
    const eyebrow=make('p','pcx-eyebrow','PEPSICO / NEWSROOM · ACTUALIDAD CORPORATIVA');
    const title=make('h2','', 'The latest.\nFrom PepsiCo.');
    const intro=make('p','pcx-news-intro','Noticias y campañas publicadas por PepsiCo. Cada historia enlaza con su fuente original.');
    head.append(eyebrow,title,intro); section.append(head);
    const lead=make('a','pcx-lead'); lead.href=news[1].url; lead.target='_blank'; lead.rel='noopener noreferrer';
    lead.append(picture(news[1].image,news[1].alt,'pcx-lead-image'));
    const leadCopy=make('div','pcx-lead-copy'); leadCopy.append(make('span','pcx-tag',news[1].tag),make('span','pcx-date',news[1].date),make('h3','',news[1].title),make('p','',news[1].desc),make('span','pcx-read','LEER EN PEPSICO ↗'));
    lead.append(leadCopy); section.append(lead);
    const grid=make('div','pcx-news-grid');
    news.filter((_,i)=>i!==1).forEach(item=>{
      const card=make('a','pcx-news-card'); card.href=item.url; card.target='_blank'; card.rel='noopener noreferrer';
      card.append(picture(item.image,item.alt,'pcx-card-image'));
      const body=make('div','pcx-card-body'); body.append(make('span','pcx-tag',item.tag),make('span','pcx-date',item.date),make('h3','',item.title),make('p','',item.desc),make('span','pcx-read','LEER NOTICIA ↗'));
      card.append(body); grid.append(card);
    });
    section.append(grid);
    const source=make('a','pcx-source','Explorar el PepsiCo Newsroom ↗'); source.href='https://www.pepsico.com/newsroom'; source.target='_blank'; source.rel='noopener noreferrer'; section.append(source);
    const culture=document.getElementById('culture'); const innovation=document.getElementById('innovation');
    if(culture?.parentNode) culture.parentNode.insertBefore(section,innovation||culture.nextSibling); else document.querySelector('main')?.append(section);
  }
  function enhanceHero(){
    const hero=document.querySelector('.hero'); const visual=hero?.querySelector('.hero-image');
    if(!hero || !visual || hero.querySelector('.pcx-hero-credit'))return;
    const probe=new Image();
    probe.onload=()=>{ visual.style.backgroundImage=`url(\"${images.portfolio}\")`; const credit=make('a','pcx-hero-credit','CAMPAIGN VISUAL · PEPSICO MEDIA'); credit.href='https://www.pepsico.com/newsroom/stories/2026/pepsico-must-see-ads-and-events-at-super-bowl-lx'; credit.target='_blank'; credit.rel='noopener noreferrer'; hero.append(credit); };
    probe.onerror=()=>{}; probe.src=images.portfolio;
  }
  function addPortfolioFeature(){
    const section=document.getElementById('brands'); if(!section||section.querySelector('.pcx-portfolio-feature'))return;
    const feature=make('a','pcx-portfolio-feature'); feature.href='https://www.pepsico.com/en/campaign/pepsico-family-of-brands'; feature.target='_blank'; feature.rel='noopener noreferrer';
    feature.append(picture(images.portfolio,'Fotografía de campaña con productos Pepsi, Lay’s y otras marcas PepsiCo','pcx-portfolio-image'));
    const copy=make('div','pcx-portfolio-copy'); copy.append(make('span','pcx-eyebrow','ONE PEPSICO · HOUSE OF BRANDS'),make('h3','', 'Una familia de marcas.\nUna historia compartida.'),make('span','pcx-read','VER CAMPAÑA OFICIAL ↗'));
    feature.append(copy); section.append(feature);
  }
  function addImpactImage(){
    const impact=document.getElementById('impact'); if(!impact||impact.querySelector('.pcx-impact-photo'))return;
    const img=picture(images.farming,'Persona caminando entre hileras de cultivo de papas','pcx-impact-photo');
    const content=impact.querySelector('.impact-content'); if(content)content.insertBefore(img,content.firstChild);
  }
  function addCultureImage(){
    const culture=document.getElementById('culture'); if(!culture||culture.querySelector('.pcx-culture-photo'))return;
    const img=picture(images.doritosF1,'Activación nocturna de Doritos en colaboración con Fórmula 1','pcx-culture-photo');
    const grid=culture.querySelector('.culture-grid'); if(grid)grid.parentNode.insertBefore(img,grid);
  }
  function init(){
    buildNews(); enhanceHero(); addPortfolioFeature(); addImpactImage(); addCultureImage();
    document.documentElement.classList.add('pcx-ready');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
