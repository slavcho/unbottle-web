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

  // "unbottle your ___." rotator: hold 2.4s, roll 500ms. The next word enters
  // from above, the previous one exits below. Reduced motion keeps "business".
  var roll = document.querySelector('.roll');
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (roll && !calm) {
    var words = ['business', 'success', 'workflow', 'process', 'dreams'];
    var index = 0;
    var current = roll.querySelector('.roll-word');

    // Width in em, so it still fits when the headline scales with the viewport
    var fitTo = function (word) {
      var size = parseFloat(window.getComputedStyle(roll).fontSize);
      roll.style.width = (word.offsetWidth / size) + 'em';
    };

    var start = function () {
      fitTo(current);
      roll.classList.add('is-live');

      setInterval(function () {
        index = (index + 1) % words.length;

        var next = document.createElement('span');
        next.className = 'roll-word is-entering';
        next.textContent = words[index];
        roll.appendChild(next);

        fitTo(next); // measuring also commits the start state for the transition
        next.classList.remove('is-entering');
        current.classList.add('is-leaving');

        var leaving = current;
        current = next;
        setTimeout(function () { leaving.remove(); }, 500);
      }, 2900);
    };

    // Measure with the real font, not the fallback
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(start);
    else start();
  }

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
