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

  // Contact form: send with fetch and answer in place. Without JS the form
  // posts normally and the function redirects back to #sent or #error.
  var form = document.querySelector('.contact-form');

  if (form && window.fetch) {
    var sent = form.querySelector('.form-status-ok');
    var failed = form.querySelector('.form-status-error');
    var failedText = failed.querySelector('.form-status-text');
    var failedDefault = failedText.innerHTML;
    var submit = form.querySelector('[type="submit"]');

    // The server's messages replace the browser's validation bubbles
    form.noValidate = true;

    var setFieldError = function (name, message) {
      var input = form.elements[name];
      var slot = document.getElementById(input.id + '-error');
      if (message) {
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', slot.id);
      } else {
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
      }
      slot.textContent = message || '';
    };

    var showFailure = function (message) {
      failedText.innerHTML = failedDefault;
      if (message) failedText.textContent = message;
      failed.classList.add('is-shown');
      failed.focus();
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      failed.classList.remove('is-shown');
      ['name', 'email', 'company', 'message'].forEach(function (name) { setFieldError(name, ''); });

      submit.disabled = true;
      submit.textContent = 'Sending…';

      fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      })
        .then(function (res) {
          return res.json().catch(function () { return { ok: false }; });
        })
        .then(function (data) {
          if (data.ok) {
            form.classList.add('is-sent');
            sent.classList.add('is-shown');
            sent.focus();
            return;
          }
          var fields = data.fields || {};
          Object.keys(fields).forEach(function (name) { setFieldError(name, fields[name]); });
          var first = Object.keys(fields)[0];
          if (first) form.elements[first].focus();
          else showFailure(data.error);
        })
        .catch(function () { showFailure(); })
        .then(function () {
          submit.disabled = false;
          submit.textContent = 'Send';
        });
    });
  }

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
