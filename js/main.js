// unbottle. — small progressive enhancements. The site works without JS.
(function () {
  'use strict';

  // Mobile navigation toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Close the menu after picking a section on a phone
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    // Close with Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Reset state if the viewport grows past the desktop breakpoint
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (e) {
      if (e.matches) setOpen(false);
    });
  }

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
