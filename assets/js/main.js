/* AN in the Studios — light interactions
   Nav scroll state, mobile drawer, scroll reveals, contact form. */

(function () {
  'use strict';

  /* ---- Nav: transparent over hero, solid on scroll ---- */
  var nav = document.querySelector('.nav');
  if (nav && nav.classList.contains('nav--over-hero')) {
    var onScroll = function () {
      if (window.scrollY > 40) {
        nav.classList.add('nav--solid');
        nav.classList.remove('nav--transparent');
      } else {
        nav.classList.add('nav--transparent');
        nav.classList.remove('nav--solid');
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Mobile drawer ---- */
  var burger = document.querySelector('.nav__burger');
  var drawer = document.querySelector('.nav__drawer');
  if (burger && drawer) {
    var toggle = function () {
      var open = drawer.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', toggle);
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        drawer.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Reveal on scroll ----
     Position-based so nothing can stay stuck hidden after a fast scroll or
     jump-to-anchor: any .reveal whose top has entered the viewport is shown. */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (reveals.length) {
    var ticking = false;
    var check = function () {
      ticking = false;
      var trigger = window.innerHeight * 0.92;
      for (var i = reveals.length - 1; i >= 0; i--) {
        var el = reveals[i];
        if (el.getBoundingClientRect().top < trigger) {
          el.classList.add('is-visible');
          reveals.splice(i, 1);
        }
      }
      if (!reveals.length) {
        window.removeEventListener('scroll', onScrollReveal);
        window.removeEventListener('resize', onScrollReveal);
      }
    };
    var onScrollReveal = function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(check); }
    };
    window.addEventListener('scroll', onScrollReveal, { passive: true });
    window.addEventListener('resize', onScrollReveal);
    check(); // reveal whatever is already in view on load
    // Failsafe: never leave content hidden even if events misfire.
    window.setTimeout(function () {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
    }, 2500);
  }

  /* ---- Contact form ---- */
  var form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      // If no real endpoint is wired up yet, show the local confirmation.
      var action = form.getAttribute('action') || '';
      if (action.indexOf('REPLACE_WITH_YOUR') !== -1 || action === '' || action === '#') {
        e.preventDefault();
        var success = document.querySelector('#form-success');
        form.style.display = 'none';
        if (success) {
          success.classList.add('is-visible');
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      // Otherwise let the form post to the configured service (Formspree/Basin).
    });
  }
})();
