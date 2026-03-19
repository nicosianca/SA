// ── NAV ──
function toggleNav(){ document.getElementById('navOverlay').classList.toggle('open'); }
function closeNav(){ document.getElementById('navOverlay').classList.remove('open'); }

// ── FILTROS ──
function filtrar(e, cat){
  document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  document.querySelectorAll('.proy-entry').forEach(item => {
    const show = cat === 'todos' || item.dataset.cat === cat;
    item.style.opacity = show ? '1' : '0.15';
    item.style.pointerEvents = show ? 'all' : 'none';
  });
}

// ── LIGHTBOX ──
let lbImgs = [], lbIdx = 0;

function openLB(imgs, idx){
  if(!imgs || imgs.length === 0) return;
  lbImgs = imgs;
  lbIdx = idx;
  document.getElementById('lbImg').src = lbImgs[lbIdx];
  document.getElementById('lbCounter').textContent = (lbIdx+1) + ' / ' + lbImgs.length;
  document.getElementById('lightbox').classList.add('open');
}

function closeLB(){
  document.getElementById('lightbox').classList.remove('open');
}

function lbMove(dir){
  if(lbImgs.length === 0) return;
  lbIdx = (lbIdx + dir + lbImgs.length) % lbImgs.length;
  document.getElementById('lbImg').src = lbImgs[lbIdx];
  document.getElementById('lbCounter').textContent = (lbIdx+1) + ' / ' + lbImgs.length;
}

// Teclado — listener en document para que siempre funcione
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if(!lb.classList.contains('open')) return;
  if(e.key === 'Escape')      closeLB();
  if(e.key === 'ArrowLeft')   lbMove(-1);
  if(e.key === 'ArrowRight')  lbMove(1);
});

// Cerrar lightbox al hacer click fuera de la imagen
document.getElementById('lightbox').addEventListener('click', function(e){
  if(e.target === this) closeLB();
});

// ── SLIDERS ──
const sliderState = {};

function sliderMove(trackId, dir){
  const track = document.getElementById(trackId);
  if(!track) return;
  const imgs = track.querySelectorAll('img');
  if(!imgs.length) return;
  if(sliderState[trackId] === undefined) sliderState[trackId] = 0;
  if(dir === 'next') sliderState[trackId] = (sliderState[trackId] + 1) % imgs.length;
  if(dir === 'prev') sliderState[trackId] = (sliderState[trackId] - 1 + imgs.length) % imgs.length;
  track.style.transform = 'translateX(-' + (sliderState[trackId] * 100) + '%)';
  const countId = trackId.replace('track-', 'count-');
  const counter = document.getElementById(countId);
  if(counter) counter.textContent = (sliderState[trackId]+1) + ' / ' + imgs.length;
}

// ── SWIPE TÁCTIL EN SLIDERS ──
document.querySelectorAll('.proy-slider').forEach(slider => {
  let startX = 0, isDragging = false;
  const track = slider.querySelector('.proy-slider-track');
  if (!track) return;

  slider.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  slider.addEventListener('touchend', e => {
    if (!isDragging) return;
    isDragging = false;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 40) return; // ignorar swipes muy cortos
    const trackId = track.id;
    if (diff > 0) sliderMove(trackId, 'next');
    else          sliderMove(trackId, 'prev');
  }, { passive: true });
});

// ── SWIPE TÁCTIL EN LIGHTBOX ──
let lbTouchStartX = 0;
document.getElementById('lightbox').addEventListener('touchstart', e => {
  lbTouchStartX = e.touches[0].clientX;
}, { passive: true });

document.getElementById('lightbox').addEventListener('touchend', e => {
  const diff = lbTouchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) < 40) return;
  if (diff > 0) lbMove(1);
  else          lbMove(-1);
}, { passive: true });
