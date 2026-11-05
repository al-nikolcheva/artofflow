/* ART OF FLOW — light interactions */
(function () {
  'use strict';

  var nav = document.querySelector('.nav');
  if (nav && nav.classList.contains('nav--over-init')) {
    var onScroll = function () {
      var over = window.scrollY < 40;
      nav.classList.toggle('nav--over', over);
      nav.classList.toggle('nav--solid', !over);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var burger = document.querySelector('.nav__burger');
  var drawer = document.querySelector('.drawer');
  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = drawer.classList.toggle('is-open');
      document.body.style.overflow = open ? 'hidden' : '';
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        drawer.classList.remove('is-open'); document.body.style.overflow = '';
      });
    });
  }

  // reveal — position based, never leaves content hidden
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (reveals.length) {
    var ticking = false;
    var check = function () {
      ticking = false;
      var trigger = window.innerHeight * 0.9;
      for (var i = reveals.length - 1; i >= 0; i--) {
        if (reveals[i].getBoundingClientRect().top < trigger) {
          reveals[i].classList.add('is-visible'); reveals.splice(i, 1);
        }
      }
      if (!reveals.length) { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); }
    };
    var on = function () { if (!ticking) { ticking = true; requestAnimationFrame(check); } };
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    check();
    setTimeout(function () { reveals.forEach(function (el) { el.classList.add('is-visible'); }); }, 2500);
  }

  // contact form — graceful fallback until an endpoint is wired
  var form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      var action = form.getAttribute('action') || '';
      if (action.indexOf('REPLACE_WITH_YOUR') !== -1 || action === '' || action === '#') {
        e.preventDefault();
        form.style.display = 'none';
        var ok = document.querySelector('#form-ok');
        if (ok) { ok.classList.add('is-visible'); ok.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      }
    });
  }
})();
