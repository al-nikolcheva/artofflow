/* ART OF FLOW — interactions: load sequence, nav, reveals, parallax, marquee-safe */
(function () {
  'use strict';
  var root = document.documentElement;

  /* ---- load sequence ---- */
  function markLoaded(){ document.body.classList.add('loaded'); }
  if (document.readyState === 'complete') { requestAnimationFrame(markLoaded); }
  else { window.addEventListener('load', function(){ requestAnimationFrame(markLoaded); }); }
  // safety: never leave the cover hidden
  setTimeout(markLoaded, 1200);

  /* ---- nav: transparent over hero, solid on scroll ---- */
  var nav = document.querySelector('.nav');
  if (nav && nav.classList.contains('nav--over-init')) {
    var onNav = function () {
      var over = window.scrollY < 40;
      nav.classList.toggle('nav--over', over);
      nav.classList.toggle('nav--solid', !over);
    };
    onNav(); window.addEventListener('scroll', onNav, { passive: true });
  }

  /* ---- mobile drawer ---- */
  var burger = document.querySelector('.nav__burger');
  var drawer = document.querySelector('.drawer');
  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = drawer.classList.toggle('is-open');
      document.body.style.overflow = open ? 'hidden' : '';
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { drawer.classList.remove('is-open'); document.body.style.overflow = ''; });
    });
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- reveals (position-based; covers .reveal and .reveal--clip) ---- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (reveals.length) {
    var ticking = false;
    var check = function () {
      ticking = false;
      var trigger = window.innerHeight * 0.9;
      for (var i = reveals.length - 1; i >= 0; i--) {
        if (reveals[i].getBoundingClientRect().top < trigger) { reveals[i].classList.add('is-visible'); reveals.splice(i, 1); }
      }
      if (!reveals.length) { window.removeEventListener('scroll', onRev); window.removeEventListener('resize', onRev); }
    };
    var onRev = function () { if (!ticking) { ticking = true; requestAnimationFrame(check); } };
    window.addEventListener('scroll', onRev, { passive: true });
    window.addEventListener('resize', onRev);
    check();
    setTimeout(function () { reveals.forEach(function (el) { el.classList.add('is-visible'); }); }, 2600);
  }

  /* ---- parallax (subtle; skipped when reduced-motion) ---- */
  var px = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  if (px.length && !reduce) {
    var pTick = false;
    var run = function () {
      pTick = false;
      var vh = window.innerHeight;
      px.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var factor = parseFloat(el.getAttribute('data-parallax')) || 0.08;
        var offset = ((r.top + r.height / 2) - vh / 2) * -factor;
        el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      });
    };
    var onPx = function () { if (!pTick) { pTick = true; requestAnimationFrame(run); } };
    window.addEventListener('scroll', onPx, { passive: true });
    window.addEventListener('resize', onPx);
    run();
  }

  /* ---- contact form fallback ---- */
  var form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      var action = form.getAttribute('action') || '';
      if (action.indexOf('REPLACE_WITH_YOUR') !== -1 || action === '' || action === '#') {
        e.preventDefault(); form.style.display = 'none';
        var ok = document.querySelector('#form-ok');
        if (ok) { ok.classList.add('is-visible'); ok.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      }
    });
  }
})();
