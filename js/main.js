// =========================================================
// SAE — interacciones
// =========================================================

// Año dinámico en footer
document.getElementById('year').textContent = new Date().getFullYear();

// Header: fondo sólido al hacer scroll
const header = document.getElementById('header');
const onScroll = () => {
  if (window.scrollY > 60) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Menú móvil
const toggle = document.getElementById('navToggle');
const menu = document.getElementById('mobileMenu');
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});
menu.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  })
);

// Scroll reveal
const revealEls = document.querySelectorAll(
  '.statement .overline, .statement-title, .statement-body, .stats, ' +
  '.products-head, .feature-text, .feature-media, .pcard, ' +
  '.industries .overline, .industries .section-title, .industry-list, ' +
  '.quality-inner'
);
revealEls.forEach((el) => el.classList.add('reveal'));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => io.observe(el));

// Parallax del hero al hacer scroll (desactivado con reduce-motion)
const heroBg = document.querySelector('.hero-bg');
const heroEl = document.querySelector('.hero');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (heroBg && heroEl && !reduceMotion) {
  let ticking = false;
  const updateParallax = () => {
    const h = heroEl.offsetHeight || window.innerHeight;
    const y = Math.min(window.scrollY, h) * 0.05;
    heroBg.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
  }, { passive: true });
  updateParallax();
}

// Cartas de producto: emergen escalonadas al entrar y se ocultan al salir (reversible)
const cardsWrap = document.querySelector('.cards');
if (cardsWrap) {
  const cards = [...cardsWrap.querySelectorAll('.card')];
  const timers = [];
  const cardsIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        timers.forEach(clearTimeout);
        timers.length = 0;
        if (entry.isIntersecting) {
          cards.forEach((card, i) =>
            timers.push(setTimeout(() => card.classList.add('in'), i * 800))
          );
        } else {
          cards.forEach((card) => card.classList.remove('in'));
        }
      });
    },
    { threshold: 0.2 }
  );
  cardsIO.observe(cardsWrap);
}

// Formulario de contacto (demo — sin backend)
const form = document.getElementById('contactForm');
if (form) {
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    const email = form.email.value.trim();
    const mensaje = form.mensaje.value.trim();
    if (!nombre || !email || !mensaje) {
      status.style.color = '#b23b3b';
      status.textContent = 'Por favor completá nombre, email y mensaje.';
      return;
    }
    status.style.color = '';
    status.textContent = 'Gracias, ' + nombre + '. (Demo) Tu consulta se enviaría cuando conectemos el servicio de email.';
    form.reset();
  });
}
