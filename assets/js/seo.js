/* ============================================================
   HBT — seo.js
   Injeta em cada página: canonical, hreflang, Open Graph,
   Twitter/X Card, GEO e JSON-LD (schema.org).
   Fonte única — alterar aqui altera o site inteiro.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Configuração ---------- */
  var SITE = {
    origin:   'https://www.hbtofficial.com',
    name:     'HBT — Handmade Brazilian Tobacco',
    legalName:'HBT — Handmade Brazilian Tobacco Ltda.',
    short:    'HBT',
    image:    '/assets/img/og-cover.jpg',   // 1200×630
    logo:     '/assets/img/logo-hbt.png',   // 512×512
    twitter:  '@hbtofficial',               // ⟦confirmar handle real⟧

    /* GEO — ⟦preencher com o endereço real da sede⟧ */
    geo: {
      region:  'BR',
      placename: 'São Paulo',
      position: '-23.5505;-46.6333',       // ⟦coordenadas reais da sede⟧
      icbm:     '-23.5505, -46.6333'
    },

    social: [
      'https://www.linkedin.com/company/hbtofficial',
      'https://www.facebook.com/hbtofficial',
      'https://www.youtube.com/@hbtofficial'
    ]
  };

  var LANGS = ['pt', 'en', 'es', 'no'];

  /* ---------- Helpers ---------- */
  function meta(attr, key, content) {
    if (!content) return;
    var el = document.head.querySelector('meta[' + attr + '="' + key + '"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }
  function link(rel, href, extra) {
    var el = document.createElement('link');
    el.setAttribute('rel', rel);
    el.setAttribute('href', href);
    if (extra) Object.keys(extra).forEach(function (k) { el.setAttribute(k, extra[k]); });
    document.head.appendChild(el);
  }

  var path = location.pathname.split('/').pop() || 'index.html';
  var pageUrl = SITE.origin + '/' + (path === 'index.html' ? '' : path);
  var title = document.title;
  var descEl = document.querySelector('meta[name="description"]');
  var desc = descEl ? descEl.getAttribute('content') : '';

  /* ---------- Canonical ---------- */
  if (!document.head.querySelector('link[rel="canonical"]')) {
    link('canonical', pageUrl);
  }

  /* ---------- hreflang ---------- */
  if (!document.head.querySelector('link[hreflang]')) {
    LANGS.forEach(function (l) {
      link('alternate', pageUrl + '?lang=' + l, { hreflang: l });
    });
    link('alternate', pageUrl, { hreflang: 'x-default' });
  }

  /* ---------- Open Graph (Facebook, LinkedIn, WhatsApp) ---------- */
  meta('property', 'og:site_name', SITE.name);
  meta('property', 'og:type', 'website');
  meta('property', 'og:url', pageUrl);
  meta('property', 'og:title', title);
  meta('property', 'og:description', desc);
  meta('property', 'og:image', SITE.origin + SITE.image);
  meta('property', 'og:image:secure_url', SITE.origin + SITE.image);
  meta('property', 'og:image:width', '1200');
  meta('property', 'og:image:height', '630');
  meta('property', 'og:image:alt', SITE.name);
  meta('property', 'og:locale', 'pt_BR');
  meta('property', 'og:locale:alternate', 'en_US');
  meta('property', 'og:locale:alternate', 'es_ES');
  meta('property', 'og:locale:alternate', 'nb_NO');

  /* ---------- Twitter / X Card ---------- */
  meta('name', 'twitter:card', 'summary_large_image');
  meta('name', 'twitter:site', SITE.twitter);
  meta('name', 'twitter:title', title);
  meta('name', 'twitter:description', desc);
  meta('name', 'twitter:image', SITE.origin + SITE.image);
  meta('name', 'twitter:image:alt', SITE.name);

  /* ---------- GEO ---------- */
  meta('name', 'geo.region', SITE.geo.region);
  meta('name', 'geo.placename', SITE.geo.placename);
  meta('name', 'geo.position', SITE.geo.position);
  meta('name', 'ICBM', SITE.geo.icbm);

  /* ---------- Outros ---------- */
  meta('name', 'author', SITE.legalName);
  meta('name', 'publisher', SITE.legalName);
  meta('name', 'rating', 'adult');            /* conteúdo 18+ */
  meta('name', 'format-detection', 'telephone=no');

  /* ---------- JSON-LD: Organização ---------- */
  var org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.short,
    legalName: SITE.legalName,
    alternateName: 'Handmade Brazilian Tobacco',
    url: SITE.origin,
    logo: SITE.origin + SITE.logo,
    image: SITE.origin + SITE.image,
    description: desc,
    sameAs: SITE.social,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BR',
      addressLocality: SITE.geo.placename
      /* ⟦completar: streetAddress, postalCode, addressRegion⟧ */
    },
    contactPoint: [{
      '@type': 'ContactPoint',
      contactType: 'media relations',
      email: 'paula.azzar@hbtofficial.com',
      availableLanguage: ['Portuguese', 'English', 'Spanish', 'Norwegian']
    }]
  };

  var ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify(org);
  document.head.appendChild(ld);

  /* ---------- JSON-LD: WebSite ---------- */
  var site = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.origin,
    inLanguage: ['pt-BR', 'en', 'es', 'nb']
  };
  var ld2 = document.createElement('script');
  ld2.type = 'application/ld+json';
  ld2.textContent = JSON.stringify(site);
  document.head.appendChild(ld2);

})();
