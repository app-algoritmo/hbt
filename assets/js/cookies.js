/* ============================================================
   HBT — cookies.js
   Banner de consentimento autossuficiente (injeta DOM + estilo).
   Categorias: Essenciais (sempre) · Análise · Marketing.
   Guarda a escolha em localStorage e emite o evento 'hbt:consent'.
   Para usar numa página: <script src="assets/js/cookies.js"></script>
   ============================================================ */
(function () {
  'use strict';

  var STORE = 'hbt_consent';
  var VERSION = 1;

  /* ---------- Traduções internas (não dependem dos JSON) ---------- */
  var T = {
    pt: {
      title: 'A sua privacidade',
      body: 'Usamos cookies essenciais para o funcionamento do site e, com o seu consentimento, cookies de análise e marketing. Você decide.',
      accept: 'Aceitar tudo', reject: 'Rejeitar', prefs: 'Preferências',
      save: 'Salvar preferências', manage: 'Preferências de cookies',
      c_ess: 'Essenciais', c_ess_d: 'Necessários para o funcionamento do site e a memória de idioma. Sempre ativos.',
      c_ana: 'Análise', c_ana_d: 'Ajudam a entender como o site é usado, de forma agregada.',
      c_mkt: 'Marketing', c_mkt_d: 'Permitem conteúdo e comunicação mais relevantes.',
      always: 'Sempre ativo', more: 'Saiba mais na Política de Cookies.'
    },
    en: {
      title: 'Your privacy',
      body: 'We use essential cookies to run the site and, with your consent, analytics and marketing cookies. You decide.',
      accept: 'Accept all', reject: 'Reject', prefs: 'Preferences',
      save: 'Save preferences', manage: 'Cookie preferences',
      c_ess: 'Essential', c_ess_d: 'Required for the site to work and to remember your language. Always on.',
      c_ana: 'Analytics', c_ana_d: 'Help us understand how the site is used, in aggregate.',
      c_mkt: 'Marketing', c_mkt_d: 'Allow more relevant content and communication.',
      always: 'Always on', more: 'Learn more in the Cookie Policy.'
    },
    es: {
      title: 'Su privacidad',
      body: 'Usamos cookies esenciales para el funcionamiento del sitio y, con su consentimiento, cookies de análisis y marketing. Usted decide.',
      accept: 'Aceptar todo', reject: 'Rechazar', prefs: 'Preferencias',
      save: 'Guardar preferencias', manage: 'Preferencias de cookies',
      c_ess: 'Esenciales', c_ess_d: 'Necesarias para el funcionamiento del sitio y la memoria de idioma. Siempre activas.',
      c_ana: 'Análisis', c_ana_d: 'Ayudan a entender cómo se usa el sitio, de forma agregada.',
      c_mkt: 'Marketing', c_mkt_d: 'Permiten contenido y comunicación más relevantes.',
      always: 'Siempre activo', more: 'Más información en la Política de Cookies.'
    },
    no: {
      title: 'Ditt personvern',
      body: 'Vi bruker nødvendige informasjonskapsler for at nettstedet skal fungere, og med ditt samtykke analyse- og markedsføringskapsler. Du bestemmer.',
      accept: 'Godta alle', reject: 'Avvis', prefs: 'Innstillinger',
      save: 'Lagre innstillinger', manage: 'Innstillinger for informasjonskapsler',
      c_ess: 'Nødvendige', c_ess_d: 'Kreves for at nettstedet skal fungere og for å huske språk. Alltid på.',
      c_ana: 'Analyse', c_ana_d: 'Hjelper oss å forstå hvordan nettstedet brukes, samlet sett.',
      c_mkt: 'Markedsføring', c_mkt_d: 'Gir mer relevant innhold og kommunikasjon.',
      always: 'Alltid på', more: 'Les mer i retningslinjene for informasjonskapsler.'
    }
  };

  function lang() {
    var l = (document.documentElement.lang || 'pt').slice(0, 2).toLowerCase();
    return T[l] ? l : 'pt';
  }
  function t() { return T[lang()]; }


  /* ============================================================
     GOOGLE ANALYTICS / TAG MANAGER — só carrega COM consentimento.
     Para ativar: preencha o ID abaixo. Enquanto vazio, nada carrega.
     Nunca ativar sem consentimento — exigência do GDPR/LGPD.
     ============================================================ */
  var GA_ID = '';        /* ex.: 'G-XXXXXXXXXX'  ⟦preencher⟧ */
  var GTM_ID = '';       /* ex.: 'GTM-XXXXXXX'   ⟦opcional⟧ */
  var analyticsLoaded = false;

  function loadAnalytics() {
    if (analyticsLoaded || !GA_ID) return;
    analyticsLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  function applyConsent(state) {
    if (!state) return;
    if (state.analytics) loadAnalytics();
    /* if (state.marketing) { ... pixels ... } */
  }

  /* ---------- Estado ---------- */
  function read() {
    try { return JSON.parse(localStorage.getItem(STORE)); } catch (e) { return null; }
  }
  function write(state) {
    state.v = VERSION; state.ts = Date.now();
    try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {}
    document.dispatchEvent(new CustomEvent('hbt:consent', { detail: state }));
    applyConsent(state);
    // GANCHO: carregue análise/marketing só se consentido
    // if (state.analytics) { /* iniciar analytics */ }
    // if (state.marketing) { /* iniciar pixels */ }
  }

  /* ---------- Estilos (injetados uma vez) ---------- */
  function injectCSS() {
    if (document.getElementById('hbt-cookie-css')) return;
    var css = ''
      + '.hbt-cc{position:fixed;left:0;right:0;bottom:0;z-index:1000;'
      + 'background:#101010;border-top:1px solid rgba(255,255,255,.14);'
      + 'color:#fff;font-family:var(--sans,"Jost",Arial,sans-serif);'
      + 'padding:1.4rem clamp(1.5rem,5vw,5rem);display:flex;gap:1.5rem;'
      + 'align-items:center;justify-content:space-between;flex-wrap:wrap;'
      + 'transform:translateY(100%);transition:transform .5s ease}'
      + '.hbt-cc.is-in{transform:none}'
      + '.hbt-cc__txt{max-width:60ch;font-weight:300;font-size:.92rem;color:#c9c9c9;line-height:1.6}'
      + '.hbt-cc__txt b{color:#fff;font-weight:500;display:block;margin-bottom:.25rem;letter-spacing:.02em}'
      + '.hbt-cc__txt a{color:#FFFFFF;text-decoration:underline;text-underline-offset:2px}'
      + '.hbt-cc__act{display:flex;gap:.7rem;flex-wrap:wrap;align-items:center}'
      + '.hbt-btn{font:inherit;font-size:.68rem;text-transform:uppercase;letter-spacing:.2em;'
      + 'cursor:pointer;padding:.85rem 1.6rem;border:1px solid rgba(255,255,255,.22);'
      + 'background:none;color:#fff;transition:all .35s ease;white-space:nowrap}'
      + '.hbt-btn:hover{border-color:#FFFFFF;color:#FFFFFF}'
      + '.hbt-btn--solid{background:#FFFFFF;border-color:#FFFFFF;color:#0A0A0A}'
      + '.hbt-btn--solid:hover{background:#E5E5E5;border-color:#E5E5E5;color:#0A0A0A}'
      + '.hbt-btn--ghost{border-color:transparent;color:#9A9A9A;padding-left:.4rem;padding-right:.4rem}'
      + '.hbt-btn--ghost:hover{color:#fff}'
      + '.hbt-cc__overlay{position:fixed;inset:0;z-index:1001;background:rgba(0,0,0,.7);'
      + 'display:flex;align-items:center;justify-content:center;padding:1.5rem;opacity:0;'
      + 'pointer-events:none;transition:opacity .3s ease}'
      + '.hbt-cc__overlay.is-in{opacity:1;pointer-events:auto}'
      + '.hbt-cc__modal{background:#0A0A0A;border:1px solid rgba(255,255,255,.14);'
      + 'max-width:560px;width:100%;max-height:88vh;overflow:auto;padding:clamp(1.6rem,4vw,2.6rem)}'
      + '.hbt-cc__modal h2{font-family:var(--serif,Georgia,serif);font-weight:400;font-size:1.9rem;'
      + 'margin:0 0 .4rem;color:#fff}'
      + '.hbt-cc__modal>p{color:#9A9A9A;font-size:.9rem;line-height:1.6;margin:0 0 1.6rem}'
      + '.hbt-row{border-top:1px solid rgba(255,255,255,.08);padding:1.1rem 0;display:grid;'
      + 'grid-template-columns:1fr auto;gap:.4rem 1rem;align-items:start}'
      + '.hbt-row h3{margin:0;font-size:.72rem;text-transform:uppercase;letter-spacing:.2em;color:#FFFFFF;font-weight:500}'
      + '.hbt-row p{grid-column:1/2;margin:.3rem 0 0;color:#9A9A9A;font-size:.86rem;line-height:1.5}'
      + '.hbt-row .hbt-always{font-size:.66rem;text-transform:uppercase;letter-spacing:.16em;color:#6E6E6E}'
      + '.hbt-sw{position:relative;width:42px;height:22px;flex:none}'
      + '.hbt-sw input{opacity:0;width:100%;height:100%;margin:0;cursor:pointer}'
      + '.hbt-sw span{position:absolute;inset:0;border:1px solid rgba(255,255,255,.25);border-radius:22px;transition:.3s;pointer-events:none}'
      + '.hbt-sw span::after{content:"";position:absolute;top:3px;left:3px;width:14px;height:14px;border-radius:50%;background:#9A9A9A;transition:.3s}'
      + '.hbt-sw input:checked+span{border-color:#FFFFFF;background:rgba(255,255,255,.14)}'
      + '.hbt-sw input:checked+span::after{left:22px;background:#FFFFFF}'
      + '.hbt-cc__modal .hbt-cc__act{margin-top:1.8rem;justify-content:flex-end}'
      + '@media(max-width:640px){.hbt-cc{flex-direction:column;align-items:flex-start}'
      + '.hbt-cc__act{width:100%}}';
    var s = document.createElement('style');
    s.id = 'hbt-cookie-css'; s.textContent = css;
    document.head.appendChild(s);
  }

  /* ---------- Banner ---------- */
  var bannerEl, overlayEl;

  function policyHref() {
    // páginas legais na raiz; a partir de /legal/ ou raiz o caminho relativo funciona
    return 'cookies.html';
  }

  function buildBanner() {
    var x = t();
    var el = document.createElement('div');
    el.className = 'hbt-cc'; el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', x.title);
    el.innerHTML =
      '<div class="hbt-cc__txt"><b>' + x.title + '</b>' + x.body +
      ' <a href="' + policyHref() + '">' + x.more + '</a></div>' +
      '<div class="hbt-cc__act">' +
        '<button class="hbt-btn hbt-btn--ghost" data-cc="prefs">' + x.prefs + '</button>' +
        '<button class="hbt-btn" data-cc="reject">' + x.reject + '</button>' +
        '<button class="hbt-btn hbt-btn--solid" data-cc="accept">' + x.accept + '</button>' +
      '</div>';
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('is-in'); });
    return el;
  }

  function buildModal(state) {
    var x = t();
    state = state || { analytics: false, marketing: false };
    var ov = document.createElement('div');
    ov.className = 'hbt-cc__overlay';
    ov.innerHTML =
      '<div class="hbt-cc__modal" role="dialog" aria-modal="true" aria-label="' + x.manage + '">' +
        '<h2>' + x.manage + '</h2><p>' + x.body + '</p>' +
        '<div class="hbt-row"><h3>' + x.c_ess + '</h3>' +
          '<span class="hbt-always">' + x.always + '</span>' +
          '<p>' + x.c_ess_d + '</p></div>' +
        '<div class="hbt-row"><h3>' + x.c_ana + '</h3>' +
          '<label class="hbt-sw"><input type="checkbox" data-cat="analytics"' + (state.analytics ? ' checked' : '') + '><span></span></label>' +
          '<p>' + x.c_ana_d + '</p></div>' +
        '<div class="hbt-row"><h3>' + x.c_mkt + '</h3>' +
          '<label class="hbt-sw"><input type="checkbox" data-cat="marketing"' + (state.marketing ? ' checked' : '') + '><span></span></label>' +
          '<p>' + x.c_mkt_d + '</p></div>' +
        '<div class="hbt-cc__act">' +
          '<button class="hbt-btn hbt-btn--ghost" data-cc="reject">' + x.reject + '</button>' +
          '<button class="hbt-btn hbt-btn--solid" data-cc="save">' + x.save + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);
    requestAnimationFrame(function () { ov.classList.add('is-in'); });
    ov.addEventListener('click', function (e) { if (e.target === ov) closeModal(); });
    return ov;
  }

  function closeBanner() { if (bannerEl) { bannerEl.classList.remove('is-in'); setTimeout(function () { bannerEl && bannerEl.remove(); bannerEl = null; }, 500); } }
  function closeModal() { if (overlayEl) { overlayEl.classList.remove('is-in'); setTimeout(function () { overlayEl && overlayEl.remove(); overlayEl = null; }, 300); } }

  function openPrefs() {
    if (overlayEl) return;
    overlayEl = buildModal(read() || {});
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-cc]');
    if (!btn) return;
    var action = btn.getAttribute('data-cc');
    if (action === 'accept') { write({ essential: true, analytics: true, marketing: true }); closeBanner(); closeModal(); }
    else if (action === 'reject') { write({ essential: true, analytics: false, marketing: false }); closeBanner(); closeModal(); }
    else if (action === 'prefs') { openPrefs(); }
    else if (action === 'save') {
      var st = { essential: true, analytics: false, marketing: false };
      document.querySelectorAll('[data-cat]').forEach(function (i) { st[i.getAttribute('data-cat')] = i.checked; });
      write(st); closeBanner(); closeModal();
    }
    else if (action === 'open') { openPrefs(); }  // link "Preferências de cookies" no rodapé
  });

  // reabrir preferências de qualquer lugar
  window.HBTCookies = { open: openPrefs, get: read };

  // atualiza idioma do banner se o usuário trocar
  document.addEventListener('hbt:i18n', function () {
    if (bannerEl) { closeBanner(); setTimeout(function () { if (!read()) bannerEl = buildBanner(); }, 520); }
  });

  function init() {
    injectCSS();
    var saved = read();
    if (!saved) bannerEl = buildBanner();
    else applyConsent(saved);   /* respeita a escolha anterior */
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
