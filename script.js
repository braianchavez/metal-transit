/* ==========================================================================
   Metal Transit — script.js (JavaScript vanilla)
   ========================================================================== */
(() => {
  'use strict';

  const WA_NUMBER = '5491162842926';
  const DEFAULT_MESSAGE = 'Hola Metal Transit, quiero cotizar material.';

  const waUrl = (text) =>
    `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text || DEFAULT_MESSAGE)}`;

  /* ---------- 1. Enlaces de WhatsApp con mensaje prellenado ---------- */
  document.querySelectorAll('[data-wa]').forEach((link) => {
    link.href = waUrl(link.dataset.waText);
  });

  /* ---------- 2. Encabezado: sombra al hacer scroll ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- 3. Menú móvil ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('menu');

  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };

  toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      setMenu(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('open') && !e.target.closest('.header-inner')) setMenu(false);
  });
  window.matchMedia('(min-width: 860px)').addEventListener('change', (mq) => {
    if (mq.matches) setMenu(false);
  });

  /* ---------- 4. Aparición al hacer scroll ---------- */
  // Escalonado: cada grupo [data-stagger] retrasa a sus hijos .reveal
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    group.querySelectorAll(':scope > .reveal').forEach((el, i) => el.style.setProperty('--d', i));
  });

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  /* ---------- 5. Formulario de cotización -> WhatsApp ---------- */
  const form = document.getElementById('quote-form');
  const msg = document.getElementById('form-msg');

  if (form) {
    const material = form.elements.material;

    material.addEventListener('change', () => {
      material.removeAttribute('aria-invalid');
      msg.textContent = '';
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!material.value) {
        material.setAttribute('aria-invalid', 'true');
        msg.textContent = 'Seleccione el tipo de material para continuar.';
        material.focus();
        return;
      }

      const kg = form.elements.kg.value.trim();
      const zona = form.elements.zona.value.trim();

      const lines = [
        'Hola Metal Transit, quiero cotizar material y coordinar un retiro.',
        `Material: ${material.value}`,
        kg ? `Cantidad aproximada: ${kg} kg` : null,
        zona ? `Zona: ${zona}` : null,
        'Puedo enviar fotos por este medio.'
      ].filter(Boolean);

      window.open(waUrl(lines.join('\n')), '_blank', 'noopener,noreferrer');
    });
  }

  /* ---------- 6. Año del footer ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
