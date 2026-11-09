const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');nav.classList.toggle('open',open)});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu')}));
document.getElementById('year').textContent=new Date().getFullYear();
const lightbox=document.querySelector('.lightbox');
const lightboxImg=lightbox.querySelector('img');
document.querySelectorAll('.gallery-item').forEach(item=>item.addEventListener('click',()=>{const img=item.querySelector('img');lightboxImg.src=item.dataset.full;lightboxImg.alt=img.alt;lightbox.showModal();updateCaption()}));
lightbox.querySelector('.lightbox-close').addEventListener('click',()=>lightbox.close());
lightbox.addEventListener('click',event=>{if(event.target===lightbox)lightbox.close()});

const galleryItems=[...document.querySelectorAll('.gallery-item')];
function updateCaption(){document.querySelector('.lightbox-caption').textContent=lightboxImg.alt;}
function stepImage(direction){const current=galleryItems.findIndex(item=>item.dataset.full===lightboxImg.getAttribute('src'));const next=galleryItems[(current+direction+galleryItems.length)%galleryItems.length];lightboxImg.src=next.dataset.full;lightboxImg.alt=next.querySelector('img').alt;updateCaption();}
document.querySelector('.lightbox-prev').addEventListener('click',()=>stepImage(-1));
document.querySelector('.lightbox-next').addEventListener('click',()=>stepImage(1));
lightbox.addEventListener('keydown',event=>{if(event.key==='ArrowLeft')stepImage(-1);if(event.key==='ArrowRight')stepImage(1)});
lightbox.addEventListener('close',()=>{document.body.style.overflow=''});
galleryItems.forEach(item=>item.addEventListener('click',()=>{document.body.style.overflow='hidden'}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false')}});

// Révélations uniques, sans écouteur de défilement ni dépendance.
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
let revealObserver;
function configureReveals(){
  if(revealObserver)revealObserver.disconnect();
  document.querySelectorAll('.reveal-pending').forEach(el=>el.classList.remove('reveal-pending','is-visible'));
  if(motionPreference.matches||!('IntersectionObserver' in window))return;
  revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target)}});
  },{threshold:.08});
  document.querySelectorAll('.about-grid,.actions-heading,.action-card,.gallery-heading,.gallery-item,.contact-grid').forEach(el=>{
    // Ne masquer que les éléments qui ne sont pas encore dans le viewport.
    if(el.getBoundingClientRect().top<window.innerHeight)return;
    el.classList.add('reveal-pending');
    if(el.matches('.action-card,.gallery-item'))el.style.setProperty('--reveal-delay',`${Array.from(el.parentElement.children).indexOf(el)%2*85}ms`);
    revealObserver.observe(el);
  });
}
configureReveals();
motionPreference.addEventListener('change',configureReveals);
lightboxImg.addEventListener('load',()=>{
  if(lightbox.open&&!motionPreference.matches)lightboxImg.animate([{opacity:.35},{opacity:1}],{duration:240,easing:'ease-out'});
});

