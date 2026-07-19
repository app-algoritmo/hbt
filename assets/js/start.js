/* ============================================================
   HBT — start.js
   Página Start: folhas de tabaco picadas, magnéticas ao cursor,
   ruído de folhas (sintetizado, inicia após o 1º clique) e
   transição para a Home.
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------- Idioma (leve, próprio) -------------------- */
  var STR = {
    pt: { eyebrow: 'Handmade Brazilian Tobacco', tag: 'Tabaco artesanal brasileiro.', enter: 'Entrar', hint: 'Clique para ativar o som' },
    en: { eyebrow: 'Handmade Brazilian Tobacco', tag: 'Handmade Brazilian tobacco.', enter: 'Enter', hint: 'Click to enable sound' },
    es: { eyebrow: 'Handmade Brazilian Tobacco', tag: 'Tabaco artesanal brasileño.', enter: 'Entrar', hint: 'Haz clic para activar el sonido' },
    no: { eyebrow: 'Handmade Brazilian Tobacco', tag: 'Håndlaget brasiliansk tobakk.', enter: 'Gå inn', hint: 'Klikk for å slå på lyd' }
  };
  function getLang() {
    try { var s = localStorage.getItem('hbt_lang'); if (STR[s]) return s; } catch (e) {}
    var n = (navigator.language || '').slice(0, 2).toLowerCase();
    return STR[n] ? n : 'pt';
  }
  var lang = getLang();
  function applyLang() {
    var x = STR[lang];
    document.documentElement.lang = lang;
    setText('eyebrow', x.eyebrow); setText('tag', x.tag);
    setText('enter-label', x.enter); setText('hint', x.hint);
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-lang') === lang);
    });
  }
  function setText(id, t) { var el = document.getElementById('s-' + id); if (el) el.textContent = t; }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-lang]');
    if (!b) return;
    lang = b.getAttribute('data-lang');
    try { localStorage.setItem('hbt_lang', lang); } catch (err) {}
    applyLang();
  });

  /* -------------------- Áudio: bossa nova (bossa.mp3) -------------------- */
  /* Arquivo real em assets/audio/bossa.mp3. Toca só após o 1º gesto do
     usuário (exigência dos navegadores), com fade-in suave e em loop. */
  var audioEl, audioReady = false, audioMuted = false;
  var FADE_MS = 1600, TARGET_VOL = 0.55;

  function fadeTo(target, ms) {
    if (!audioEl) return;
    var start = audioEl.volume, t0 = performance.now();
    (function step(now) {
      var k = Math.min(1, (now - t0) / ms);
      var v = start + (target - start) * k;
      audioEl.volume = Math.max(0, Math.min(1, v));   // trava em [0,1]
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  function startAudio() {
    if (audioReady || reduce) return;
    try {
      audioEl = new Audio('assets/audio/bossa.mp3');
      audioEl.loop = true;
      audioEl.volume = 0;
      audioEl.play().then(function () {
        audioReady = true;
        fadeTo(TARGET_VOL, FADE_MS);
        var hint = document.getElementById('s-hint'); if (hint) hint.classList.add('is-hidden');
        var mute = document.getElementById('s-mute'); if (mute) mute.classList.add('is-visible');
      }).catch(function () { /* navegador bloqueou; tentará no próximo gesto */ audioReady = false; });
    } catch (e) { /* sem áudio */ }
  }

  function toggleMute() {
    if (!audioEl) return;
    audioMuted = !audioMuted;
    fadeTo(audioMuted ? 0 : TARGET_VOL, 400);
    var mute = document.getElementById('s-mute');
    if (mute) mute.setAttribute('aria-pressed', audioMuted ? 'true' : 'false');
    if (mute) mute.classList.toggle('is-muted', audioMuted);
  }

  // primeiro gesto em qualquer lugar libera o som
  window.addEventListener('pointerdown', startAudio, { once: true });
  document.addEventListener('DOMContentLoaded', function () {
    var mute = document.getElementById('s-mute');
    if (mute) mute.addEventListener('click', function (e) { e.stopPropagation(); toggleMute(); });
  });

  /* -------------------- Canvas: folhas picadas -------------------- */
  var canvas = document.getElementById('leaf-canvas');
  var ctx = canvas.getContext('2d');
  var W, H, DPR, particles = [], mouse = { x: -9999, y: -9999, active: false };
  var PALETTE = ['rgba(255,255,255,', 'rgba(200,200,200,', 'rgba(150,150,150,', 'rgba(110,110,110,'];

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function makeParticles() {
    var count = reduce ? 40 : Math.round(Math.min(180, (W * H) / 9000));
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        len: 4 + Math.random() * 9, wdt: 1.5 + Math.random() * 2.5,
        ang: Math.random() * Math.PI, av: (Math.random() - 0.5) * 0.01,
        col: PALETTE[(Math.random() * PALETTE.length) | 0],
        alpha: 0.15 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  var R = 150; // raio do efeito magnético
  function step(t) {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      // brisa ambiente
      p.vx += Math.sin((t * 0.0002) + p.phase) * 0.004;
      p.vy += Math.cos((t * 0.00018) + p.phase) * 0.003;

      // magnetismo do cursor
      if (mouse.active && !reduce) {
        var dx = mouse.x - p.x, dy = mouse.y - p.y;
        var d2 = dx * dx + dy * dy, d = Math.sqrt(d2);
        if (d < R && d > 0.5) {
          var f = (1 - d / R);
          var ux = dx / d, uy = dy / d;
          // atração + leve giro (redemoinho)
          p.vx += ux * f * 0.5 - uy * f * 0.25;
          p.vy += uy * f * 0.5 + ux * f * 0.25;
          p.av += f * 0.02;
        }
      }

      p.vx *= 0.94; p.vy *= 0.94;         // atrito
      p.x += p.vx; p.y += p.vy;
      p.ang += p.av; p.av *= 0.96;

      // envolver bordas
      if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;

      // desenhar shard (folha picada)
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(p.ang);
      ctx.fillStyle = p.col + p.alpha + ')';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(-p.len / 2, -p.wdt / 2, p.len, p.wdt, p.wdt / 2);
      else ctx.rect(-p.len / 2, -p.wdt / 2, p.len, p.wdt);
      ctx.fill();
      ctx.restore();
    }
    raf = requestAnimationFrame(step);
  }

  var raf;
  function start() { cancelAnimationFrame(raf); raf = requestAnimationFrame(step); }

  window.addEventListener('pointermove', function (e) {
    var r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
  });
  window.addEventListener('pointerleave', function () { mouse.active = false; });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) cancelAnimationFrame(raf); else start();
  });
  window.addEventListener('resize', function () { resize(); makeParticles(); });

  /* -------------------- Entrar -> Home -------------------- */
  function enter() {
    startAudio();
    var el = document.querySelector('.start');
    el.classList.add('is-leaving');
    setTimeout(function () { window.location.href = 'home.html'; }, reduce ? 100 : 850);
  }
  var enterBtn = document.getElementById('s-enter');
  if (enterBtn) enterBtn.addEventListener('click', enter);

  /* -------------------- Boot -------------------- */
  applyLang();
  resize();
  makeParticles();
  start();
})();
