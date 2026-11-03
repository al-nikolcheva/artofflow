/* ART OF FLOW — quiet interactions only:
   nav line on scroll, mobile menu, soft fades, contact form, cookie notice. */
(function () {
  'use strict';

  /* Nav: thin line appears once the page moves */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 10); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Mobile menu */
  var burger = document.querySelector('.nav__burger');
  var links = document.querySelector('.nav__links');
  if (burger && links) {
    var setOpen = function (open) {
      links.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', function () { setOpen(!links.classList.contains('is-open')); });
    links.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }

  /* Soft fades as you scroll (opacity only — nothing moves) */
  var fades = Array.prototype.slice.call(document.querySelectorAll('.fade'));
  if ('IntersectionObserver' in window && fades.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    fades.forEach(function (el) { io.observe(el); });
  } else {
    fades.forEach(function (el) { el.classList.add('is-in'); });
  }
  // Failsafe: never leave content hidden.
  window.setTimeout(function () { fades.forEach(function (el) { el.classList.add('is-in'); }); }, 3000);

  /* Contact form
     Set the form's action to your Formspree (or similar) endpoint.
     Until then, the form simply shows its thank-you message. */
  var form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var action = form.getAttribute('action') || '';
      if (action.indexOf('http') !== 0) { form.classList.add('is-sent'); return; }
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      fetch(action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('Send failed');
          form.classList.add('is-sent');
        })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.textContent = 'Send'; }
          alert('Sorry, something went wrong. Please email hello@artofflow.studio instead.');
        });
    });
  }

  /* Cookie notice (UK GDPR / PECR).
     The site sets no cookies by default. If you add analytics that use cookies,
     only load them inside loadOptional() so they wait for consent. */
  var KEY = 'aof-cookie-choice';
  var read = function () { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  var save = function (v) { try { localStorage.setItem(KEY, v); } catch (e) {} };
  var loadOptional = function () { /* add consent-based scripts here */ };

  var choice = read();
  if (choice === 'accepted') loadOptional();
  var notice = document.querySelector('.cookie');
  if (notice && !choice) {
    notice.classList.add('is-open');
    notice.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cookie]');
      if (!b) return;
      var v = b.getAttribute('data-cookie');
      save(v);
      if (v === 'accepted') loadOptional();
      notice.classList.remove('is-open');
    });
  }
})();
