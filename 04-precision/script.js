const header = document.querySelector('#siteHeader');
const menuToggle = document.querySelector('#menuToggle');
const navLinks = document.querySelector('#navLinks');
const quoteForm = document.querySelector('#quoteForm');
const formStatus = document.querySelector('#formStatus');
const dateInput = document.querySelector('#date');

const heroSlides = [...document.querySelectorAll('#heroMedia img')];
const heroDots = document.querySelector('#heroDots');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let heroIndex = 0;
let heroTimer;
const showHero = (index) => {
  heroIndex = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, i) => slide.classList.toggle('is-active', i === heroIndex));
  heroDots.querySelectorAll('button').forEach((dot, i) => {
    dot.classList.toggle('is-active', i === heroIndex);
    dot.setAttribute('aria-pressed', String(i === heroIndex));
  });
};
const startHero = () => {
  clearInterval(heroTimer);
  if (!reduceMotion && !document.hidden && heroSlides.length > 1) heroTimer = setInterval(() => showHero(heroIndex + 1), 6500);
};
heroSlides.forEach((slide, i) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.setAttribute('aria-label', `Show hero image ${i + 1} of ${heroSlides.length}`);
  dot.addEventListener('click', () => { showHero(i); startHero(); });
  heroDots.append(dot);
});
showHero(0);
startHero();
document.addEventListener('visibilitychange', startHero);

const closeMenu = () => {
  navLinks.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
};

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  document.body.classList.toggle('menu-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
navLinks.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 20), { passive: true });

const today = new Date();
dateInput.min = today.toISOString().split('T')[0];
document.querySelector('#year').textContent = String(today.getFullYear());

document.querySelectorAll('[data-select-service]').forEach((link) => {
  link.addEventListener('click', () => {
    document.querySelector('#service').value = link.dataset.selectService;
  });
});

quoteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(quoteForm).entries());
  const summary = [
    'Auto Care & Services service enquiry',
    `Name: ${data.name}`,
    `Mobile: ${data.phone}`,
    `Vehicle: ${data.vehicle}`,
    `Service: ${data.service}`,
    `Preferred slot: ${data.date} at ${data.time}`,
    `Notes: ${data.notes || '-'}`
  ].join('\n');
  localStorage.setItem('autocare_precision_enquiry', JSON.stringify({ ...data, createdAt: new Date().toISOString() }));
  formStatus.textContent = 'Enquiry saved in this browser. Opening WhatsApp…';
  window.open(`https://wa.me/601158121239?text=${encodeURIComponent(summary)}`, '_blank', 'noopener');
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

