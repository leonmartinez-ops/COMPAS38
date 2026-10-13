'use strict';
// ÚNICA CONFIGURACIÓN DE CONTACTO. E.164: código de país + número, sin espacios.
// Ejemplo de formato exclusivamente: +[país][número]. No publicar sin completar.
const CONFIG = Object.freeze({
  phone: '',
  whatsappMessage: 'Hola, vi la propiedad de Compás 38 y me gustaría agendar una visita.',
  mapQuery: 'Compás 38, Colonia Sevilla, Ciudad de México',
  // Opcional: sustituir por una URL embed verificada o con Place ID exacto.
  mapEmbedUrl: '',
  publicUrl: '' // URL final de Netlify o dominio, cuando esté asignada.
});
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const photos = $$('.photo img').map((img) => ({
  src: img.getAttribute('src').replace('-thumb.webp', '-full.webp'),
  alt: img.alt
}));
let toastTimer;
function toast(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3800);
}
const phone = CONFIG.phone.replace(/[^+\d]/g, '');
for (const id of ['call', 'whatsapp']) {
  const link = $('#' + id);
  if (/^\+?\d{10,15}$/.test(phone)) {
    link.href = id === 'call' ? `tel:${phone}` : `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;
  } else {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
    link.setAttribute('aria-disabled', 'true');
    link.addEventListener('click', (event) => { event.preventDefault(); toast('El teléfono de contacto estará disponible próximamente.'); });
    link.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); link.click(); }
    });
  }
}
let savedScroll = 0;
let returnFocus = null;
function openDialog(dialog) {
  if (dialog.open) return;
  savedScroll = window.scrollY;
  returnFocus = document.activeElement;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${savedScroll}px`;
  document.body.style.width = '100%';
  dialog.showModal();
  dialog.querySelector('[data-close]').focus();
}
function restorePage() {
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  const previous = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, savedScroll);
  document.documentElement.style.scrollBehavior = previous;
  returnFocus?.focus({preventScroll:true});
}
$$('dialog').forEach((dialog) => {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', restorePage);
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});
const mapQuery = encodeURIComponent(CONFIG.mapQuery);
$('#external-map').href = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
$$('[data-map]').forEach((button) => button.addEventListener('click', () => {
  closeMenu();
  if (!$('#interactive-map').getAttribute('src')) {
    $('#interactive-map').src = CONFIG.mapEmbedUrl || `https://maps.google.com/maps?q=${mapQuery}&z=17&output=embed`;
  }
  openDialog($('#map-dialog'));
}));
let activePhoto = 0;
function showPhoto(index) {
  activePhoto = (index + photos.length) % photos.length;
  $('#large-photo').src = photos[activePhoto].src;
  $('#large-photo').alt = photos[activePhoto].alt;
  $('#photo-name').textContent = photos[activePhoto].alt;
  $('#photo-count').textContent = `${String(activePhoto + 1).padStart(2, '0')} / ${photos.length}`;
}
function openGallery(index = 0) { closeMenu(); showPhoto(index); openDialog($('#gallery-dialog')); }
$$('[data-gallery]').forEach((button) => button.addEventListener('click', () => openGallery()));
$$('[data-photo]').forEach((button) => button.addEventListener('click', () => openGallery(Number(button.dataset.photo))));
$('.previous').addEventListener('click', () => showPhoto(activePhoto - 1));
$('.next').addEventListener('click', () => showPhoto(activePhoto + 1));
$('#gallery-dialog').addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {event.preventDefault();showPhoto(activePhoto - 1);}
  if (event.key === 'ArrowRight') {event.preventDefault();showPhoto(activePhoto + 1);}
});
let touchStart;
$('.lightbox-stage').addEventListener('touchstart', (event) => {
  touchStart = event.touches.length === 1 ? {x:event.touches[0].clientX,y:event.touches[0].clientY} : null;
}, {passive:true});
$('.lightbox-stage').addEventListener('touchend', (event) => {
  if (!touchStart || !event.changedTouches.length) return;
  const dx = event.changedTouches[0].clientX - touchStart.x;
  const dy = event.changedTouches[0].clientY - touchStart.y;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) showPhoto(activePhoto + (dx < 0 ? 1 : -1));
  touchStart = null;
}, {passive:true});
const gallery = $('.gallery');
const indicators = $('.gallery-indicators');
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
function scrollPhoto(track, index) {
  const items = [...track.children];
  const selected = Math.max(0, Math.min(items.length - 1, index));
  track.scrollTo({left:items[selected].offsetLeft - items[0].offsetLeft, behavior:reducedMotion() ? 'auto' : 'smooth'});
}
function nearestPhoto(track) {
  const items = [...track.children];
  return items.reduce((best, item, index) => Math.abs(item.offsetLeft - items[0].offsetLeft - track.scrollLeft) < Math.abs(items[best].offsetLeft - items[0].offsetLeft - track.scrollLeft) ? index : best, 0);
}
function updateIndicators() {
  indicators.textContent = `Desliza para recorrer · ${nearestPhoto(gallery) + 1} / ${photos.length}`;
}
gallery.addEventListener('scroll', updateIndicators, {passive:true});
window.addEventListener('resize', updateIndicators);updateIndicators();
gallery.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();scrollPhoto(gallery, nearestPhoto(gallery) + (event.key === 'ArrowRight' ? 1 : -1));
});
const heroTrack = document.createElement('div');
heroTrack.className = 'hero-carousel';
heroTrack.setAttribute('aria-label', 'Fotos de la casa; desliza a izquierda o derecha');
heroTrack.setAttribute('role', 'region');heroTrack.tabIndex = 0;
const firstHero = $('.hero-photo');
firstHero.before(heroTrack);heroTrack.append(firstHero);
photos.slice(1).forEach((photo) => {
  const img = document.createElement('img');
  img.className = 'hero-photo';img.src = photo.src;img.alt = photo.alt;
  img.loading = 'lazy';img.decoding = 'async';heroTrack.append(img);
});
const heroBrowse = document.createElement('div');heroBrowse.className = 'hero-browse';
heroBrowse.innerHTML = '<span>Desliza para ver la casa</span><div class="hero-browse-controls"><button type="button" aria-label="Foto anterior de portada">←</button><span class="hero-count" aria-live="polite"></span><button type="button" aria-label="Foto siguiente de portada">→</button></div>';
$('.hero').append(heroBrowse);
function updateHeroCount() { $('.hero-count').textContent = `${nearestPhoto(heroTrack) + 1} / ${photos.length}`; }
heroTrack.addEventListener('scroll', updateHeroCount, {passive:true});
window.addEventListener('resize', updateHeroCount);updateHeroCount();
heroBrowse.querySelectorAll('button').forEach((button, index) => button.addEventListener('click', () => scrollPhoto(heroTrack, nearestPhoto(heroTrack) + (index ? 1 : -1))));
heroTrack.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();scrollPhoto(heroTrack, nearestPhoto(heroTrack) + (event.key === 'ArrowRight' ? 1 : -1));
});
function closeMenu() { $('#quick-menu').hidden = true; $('.menu-toggle').setAttribute('aria-expanded', 'false'); }
$('.menu-toggle').addEventListener('click', () => {
  const open = $('#quick-menu').hidden; $('#quick-menu').hidden = !open;
  $('.menu-toggle').setAttribute('aria-expanded', String(open));
});
$('#quick-menu a').addEventListener('click', closeMenu);
document.addEventListener('click', (event) => { if (!event.target.closest('.masthead')) closeMenu(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
