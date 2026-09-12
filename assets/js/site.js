/* Nexa Studio — header state, mobile nav, method accordion, enquiry form */
(function () {
  'use strict';

  /* --- header hairline once the page moves --- */
  var hdr = document.getElementById('hdr');
  var onScroll = function () { hdr.classList.toggle('is-stuck', window.scrollY > 8); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- mobile nav --- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var closeNav = function () { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); };
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') === 'true';
    nav.classList.toggle('is-open', !open);
    burger.setAttribute('aria-expanded', String(!open));
  });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeNav(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  /* --- current section in the nav --- */
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a, i) {
          a.setAttribute('aria-current', sections[i] === entry.target ? 'true' : 'false');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { if (s) spy.observe(s); });
  }

  /* --- method accordion: one panel open at a time --- */
  var accs = Array.prototype.slice.call(document.querySelectorAll('#accordion .acc'));
  accs.forEach(function (acc) {
    var btn = acc.querySelector('.acc-btn');
    btn.addEventListener('click', function () {
      var open = acc.dataset.open === 'true';
      accs.forEach(function (other) {
        other.dataset.open = 'false';
        other.querySelector('.acc-btn').setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        acc.dataset.open = 'true';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });


  /* --- budget levels: tablist with roving focus, panels swap in place --- */
  var tablist = document.querySelector('.tiers');
  if (tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab, false); });
      tab.addEventListener('keydown', function (e) {
        var step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (step) { e.preventDefault(); select(tabs[(i + step + tabs.length) % tabs.length], true); }
        else if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
        else if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
      });
    });

    /* "Explore this level" carries the chosen budget into the enquiry form */
    document.querySelectorAll('[data-explore]').forEach(function (link) {
      link.addEventListener('click', function () {
        var band = tablist.querySelector('[aria-selected="true"]').dataset.budget;
        var select = document.getElementById('f-budget');
        Array.prototype.forEach.call(select.options, function (opt) {
          if (opt.text === band) select.value = opt.value;
        });
      });
    });
  }

  /* --- enquiry form: validate here, hand off to the visitor's mail client --- */
  var form = document.getElementById('enquiry');
  var status = document.getElementById('form-status');
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var setError = function (input, message) {
    var field = input.closest('.field');
    field.classList.toggle('invalid', Boolean(message));
    field.querySelector('.err').textContent = message || '';
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    return !message;
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.elements.name, email = form.elements.email, msg = form.elements.message;
    var ok = [
      setError(name, name.value.trim() ? '' : 'Tell us who you are.'),
      setError(email, emailRe.test(email.value.trim()) ? '' : 'That email address looks incomplete.'),
      setError(msg, msg.value.trim().length > 9 ? '' : 'A sentence or two about the project is plenty.')
    ].every(Boolean);

    if (!ok) {
      status.textContent = 'Check the highlighted fields.';
      form.querySelector('.invalid input, .invalid textarea').focus();
      return;
    }

    var body = [
      'Name: ' + name.value.trim(),
      'Email: ' + email.value.trim(),
      'Project type: ' + form.elements.type.value,
      'Budget: ' + form.elements.budget.value,
      '',
      msg.value.trim()
    ].join('\n');

    window.location.href = 'mailto:studio@nexastudio.co'
      + '?subject=' + encodeURIComponent('Project enquiry — ' + name.value.trim())
      + '&body=' + encodeURIComponent(body);

    status.textContent = 'Opening your mail client…';
  });

  form.addEventListener('input', function (e) {
    if (e.target.closest('.field.invalid')) setError(e.target, '');
  });
})();
