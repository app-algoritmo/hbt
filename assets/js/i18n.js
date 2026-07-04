/* ============================================================
   HBT — i18n.js
   Troca de idioma sem framework e sem recarregar a página.
   Fonte única de HTML; o texto vem de assets/i18n/<lang>.json
   Idiomas: PT · EN · ES · NO
   ============================================================ */
(function () {
  'use strict';

  var SUPPORTED = ['pt', 'en', 'es', 'no'];
  var DEFAULT = 'pt';
  var STORE = 'hbt_lang';
  var current = DEFAULT;

  function pickLang() {
    var url = new URLSearchParams(location.search).get('lang');
    if (url && SUPPORTED.indexOf(url) > -1) return url;
    var saved;
    try { saved = localStorage.getItem(STORE); } catch (e) {}
    if (saved && SUPPORTED.indexOf(saved) > -1) return saved;
    var nav = (navigator.language || '').slice(0, 2).toLowerCase();
    if (SUPPORTED.indexOf(nav) > -1) return nav;
    return DEFAULT;
  }

  function resolve(dict, path) {
    return path.split('.').reduce(function (o, k) {
      return (o && o[k] != null) ? o[k] : null;
    }, dict);
  }

  function apply(dict) {
    document.documentElement.lang = current;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = resolve(dict, el.getAttribute('data-i18n'));
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = resolve(dict, el.getAttribute('data-i18n-html'));
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var bits = pair.split(':');
        var v = resolve(dict, bits[1]);
        if (v != null) el.setAttribute(bits[0].trim(), v);
      });
    });

    var t = resolve(dict, 'meta.title');
    if (t) document.title = t;
    var d = resolve(dict, 'meta.description');
    var m = document.querySelector('meta[name="description"]');
    if (d && m) m.setAttribute('content', d);

    document.querySelectorAll('[data-lang]').forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-lang') === current);
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === current ? 'true' : 'false');
    });

    document.dispatchEvent(new CustomEvent('hbt:i18n', { detail: { lang: current, dict: dict } }));
  }

  function load(lang) {
    return fetch('assets/i18n/' + lang + '.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) < 0) return;
    current = lang;
    try { localStorage.setItem(STORE, lang); } catch (e) {}
    load(lang)
      .then(function (dict) {
        window.__hbtDict = dict;
        apply(dict);
        var u = new URL(location);
        u.searchParams.set('lang', lang);
        history.replaceState({}, '', u);
      })
      .catch(function (err) {
        console.error('i18n: falha ao carregar', lang, err);
        if (lang !== DEFAULT) setLang(DEFAULT);
      });
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-lang]');
    if (b) { e.preventDefault(); setLang(b.getAttribute('data-lang')); }
  });

  window.HBTi18n = { set: setLang, get: function () { return current; }, supported: SUPPORTED };

  current = pickLang();
  setLang(current);
})();
