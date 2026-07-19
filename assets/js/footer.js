/* ============================================================
   HBT — footer.js
   Rodapé único, injetado em todas as páginas.
   Alterar aqui altera o site inteiro.

   Estado de cada página:
     live  -> link normal
     soon  -> cinza, sem link, marcado "em breve"
   ============================================================ */
(function () {
  'use strict';

  /* Mapa do site — mudar 'soon' para 'live' quando a página tiver conteúdo */
  var MAP = {
    marca: [
      { href: 'a-marca.html',       key: 'a-marca',      state: 'soon' },
      { href: 'special-serie.html', key: 'special-serie',state: 'soon', noTranslate: true },
      { href: 'experiencia.html',   key: 'experiencia',  state: 'soon' },
      { href: 'contato.html',       key: 'contato',      state: 'soon' }
    ],
    institucional: [
      { href: 'governanca.html',      key: 'governanca',      state: 'soon' },
      { href: 'ciencia.html',         key: 'ciencia',         state: 'soon' },
      { href: 'sustentabilidade.html',key: 'sustentabilidade',state: 'soon' },
      { href: 'investidores.html',    key: 'investidores',    state: 'soon' }
    ],
    mais: [
      { href: 'imprensa.html',   key: 'imprensa',  state: 'soon' },
      { href: 'carreiras.html',  key: 'carreiras', state: 'soon' },
      { href: 'presenca.html',   key: 'presenca',  state: 'soon' },
      { href: 'sac.html',        key: 'sac',       state: 'live' }
    ],
    legal: [
      { href: 'privacidade.html', key: 'privacidade', state: 'live' },
      { href: 'termos.html',      key: 'termos',      state: 'live' },
      { href: 'cookies.html',     key: 'cookies',     state: 'live' }
    ]
  };

  /* Nomes das páginas, por idioma */
  var LABELS = {
    pt: { 'a-marca':'A Marca', 'special-serie':'Special Serie', 'experiencia':'Experiência', 'contato':'Contato',
          'governanca':'Governança & Liderança', 'ciencia':'Ciência & Inovação', 'sustentabilidade':'Sustentabilidade', 'investidores':'Investidores',
          'imprensa':'Imprensa', 'carreiras':'Carreiras', 'presenca':'Presença Global', 'sac':'SAC',
          'privacidade':'Privacidade', 'termos':'Termos de Uso', 'cookies':'Cookies' },
    en: { 'a-marca':'The Brand', 'special-serie':'Special Serie', 'experiencia':'Experience', 'contato':'Contact',
          'governanca':'Governance & Leadership', 'ciencia':'Science & Innovation', 'sustentabilidade':'Sustainability', 'investidores':'Investors',
          'imprensa':'Press', 'carreiras':'Careers', 'presenca':'Global Presence', 'sac':'Customer Service',
          'privacidade':'Privacy', 'termos':'Terms of Use', 'cookies':'Cookies' },
    es: { 'a-marca':'La Marca', 'special-serie':'Special Serie', 'experiencia':'Experiencia', 'contato':'Contacto',
          'governanca':'Gobernanza y Liderazgo', 'ciencia':'Ciencia e Innovación', 'sustentabilidade':'Sostenibilidad', 'investidores':'Inversores',
          'imprensa':'Prensa', 'carreiras':'Carreras', 'presenca':'Presencia Global', 'sac':'Atención al Cliente',
          'privacidade':'Privacidad', 'termos':'Términos de Uso', 'cookies':'Cookies' },
    no: { 'a-marca':'Merkevaren', 'special-serie':'Special Serie', 'experiencia':'Opplevelse', 'contato':'Kontakt',
          'governanca':'Styring og ledelse', 'ciencia':'Vitenskap og innovasjon', 'sustentabilidade':'Bærekraft', 'investidores':'Investorer',
          'imprensa':'Presse', 'carreiras':'Karriere', 'presenca':'Global tilstedeværelse', 'sac':'Kundeservice',
          'privacidade':'Personvern', 'termos':'Vilkår for bruk', 'cookies':'Cookies' }
  };

  var TITLES = {
    pt: { marca:'A Marca', institucional:'Institucional', mais:'Mais', legal:'Legal',
          tag:'Tabaco artesanal brasileiro.<br>Handcrafted in Brazil.',
          legalText:'Produto destinado exclusivamente a maiores de 18 anos. Este site tem caráter institucional e não constitui publicidade nem incentivo ao consumo de tabaco.',
          cc:'Preferências de cookies' },
    en: { marca:'The Brand', institucional:'Institutional', mais:'More', legal:'Legal',
          tag:'Handmade Brazilian tobacco.<br>Handcrafted in Brazil.',
          legalText:'Intended exclusively for adults over 18. This site is institutional in nature and does not constitute advertising or encouragement of tobacco consumption.',
          cc:'Cookie preferences' },
    es: { marca:'La Marca', institucional:'Institucional', mais:'Más', legal:'Legal',
          tag:'Tabaco artesanal brasileño.<br>Handcrafted in Brazil.',
          legalText:'Producto destinado exclusivamente a mayores de 18 años. Este sitio tiene carácter institucional y no constituye publicidad ni incentivo al consumo de tabaco.',
          cc:'Preferencias de cookies' },
    no: { marca:'Merkevaren', institucional:'Institusjonelt', mais:'Mer', legal:'Juridisk',
          tag:'Håndlaget brasiliansk tobakk.<br>Handcrafted in Brazil.',
          legalText:'Kun ment for voksne over 18 år. Dette nettstedet er av institusjonell karakter og utgjør ikke reklame eller oppfordring til bruk av tobakk.',
          cc:'Innstillinger for informasjonskapsler' }
  };


  /* Ícones sociais — YouTube, LinkedIn, Facebook */
  var SOCIAL = [
    { name:'LinkedIn', href:'https://www.linkedin.com/company/hbtofficial',
      path:'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z' },
    { name:'Facebook', href:'https://www.facebook.com/hbtofficial',
      path:'M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z' },
    { name:'YouTube', href:'https://www.youtube.com/@hbtofficial',
      path:'M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z' }
  ];

  function socialHtml() {
    var h = '<div class="footer__social">';
    SOCIAL.forEach(function (s) {
      h += '<a href="' + s.href + '" target="_blank" rel="noopener noreferrer" aria-label="' + s.name + '">'
         + '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + s.path + '"/></svg></a>';
    });
    return h + '</div>';
  }

  var SOON = { pt:'em breve', en:'coming soon', es:'próximamente', no:'kommer snart' };

  function lang() {
    var l = (document.documentElement.lang || 'pt').slice(0,2).toLowerCase();
    return TITLES[l] ? l : 'pt';
  }

  function col(title, items) {
    var L = LABELS[lang()] || LABELS.pt;
    var html = '<div class="footer__col"><h3>' + title + '</h3>';
    items.forEach(function (it) {
      var nt = it.noTranslate ? ' translate="no"' : '';
      var label = L[it.key] || (LABELS.pt[it.key] || it.key);
      if (it.state === 'live') {
        html += '<a href="' + it.href + '"' + nt + '>' + label + '</a>';
      } else {
        html += '<span class="is-soon"' + nt + '>' + label + '</span>';
      }
    });
    return html + '</div>';
  }

  function build() {
    var L = lang(), T = TITLES[L];
    var leaf = '<svg class="leaf" viewBox="0 0 64 64" aria-hidden="true">'
      + '<path d="M32 4C20 14 10 26 10 40c0 11 9 20 22 20 3-16 6-28 6-40C38 12 35 7 32 4Z" fill="none" stroke="currentColor" stroke-width="1.4"/>'
      + '<path d="M32 8C32 24 32 44 30 58" fill="none" stroke="currentColor" stroke-width="1.2"/>'
      + '<path d="M31 22c-4 2-9 4-14 4M31 34c-5 2-11 4-17 4M31 46c-4 1-9 2-14 2" fill="none" stroke="currentColor" stroke-width="1"/>'
      + '</svg>';

    var year = new Date().getFullYear();

    return ''
      + '<div class="footer__top">'
      +   '<div class="footer__brand-col">'
      +     leaf
      +     '<span class="footer__mark" translate="no">HBT</span>'
      +     '<p class="footer__tag">' + T.tag + '</p>'
      +     socialHtml()
      +   '</div>'
      +   col(T.marca, MAP.marca)
      +   col(T.institucional, MAP.institucional)
      +   col(T.mais, MAP.mais)
      +   col(T.legal, MAP.legal)
      + '</div>'
      + '<div class="footer__base">'
      +   '<p class="footer__legal">' + T.legalText + '</p>'
      +   '<div class="footer__meta">'
      +     '<button type="button" class="footer__cc" data-cc="open">' + T.cc + '</button>'
      +     '<span class="footer__copy" translate="no">© ' + year + ' HBT — Handmade Brazilian Tobacco Ltda.</span>'
      +     '<a class="footer__credit" href="https://www.dsnorge.com" target="_blank" rel="noopener noreferrer" translate="no">'
      +       '<span class="footer__credit-mark">&lt;/&gt;</span> Developed by Digital Solutions</a>'
      +   '</div>'
      + '</div>';
  }

  function render() {
    var f = document.querySelector('.site-footer');
    if (!f) return;
    f.innerHTML = build();
    // rótulo "em breve" no idioma corrente
    var s = document.getElementById('hbt-soon-style');
    if (!s) { s = document.createElement('style'); s.id = 'hbt-soon-style'; document.head.appendChild(s); }
    s.textContent = '.footer__col .is-soon::after{content:"' + SOON[lang()] + '";}';
  }

  render();
  document.addEventListener('hbt:i18n', render);   // re-renderiza ao trocar idioma
})();
