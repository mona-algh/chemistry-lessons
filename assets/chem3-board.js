// Shared Interactive Classroom Board Engine for Chemistry 3 Lessons
(function () {
  window.initChem3Board = function (cfg) {
    const $ = s => document.querySelector(s);
    const $$ = s => [...document.querySelectorAll(s)];
    let curClass = 0, points = 0, actx = null;

    function tone(f, d = .18, t0 = 0, type = 'sine') {
      try {
        actx = actx || new (window.AudioContext || window.webkitAudioContext)();
        const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + t0;
        o.type = type; o.frequency.value = f;
        g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.28, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + d);
        o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + d + .05);
      } catch (e) {}
    }
    const good = () => { tone(660, .15); tone(880, .2, .12); };
    const bad = () => tone(200, .25, 0, 'square');
    const fanfare = () => [523, 659, 784, 1047].forEach((f, i) => tone(f, .22, i * .13));

    const cvf = $('#confetti'), cfx = cvf.getContext('2d');
    let parts = [], anim = null;
    function confetti(n = 110) {
      cvf.width = innerWidth; cvf.height = innerHeight;
      const C = ['#e4572e', '#ffc93c', '#2a7de1', '#7c5ce6', '#0b8a4a'];
      for (let i = 0; i < n; i++) parts.push({ x: Math.random() * cvf.width, y: -20 - Math.random() * cvf.height * .3, vx: (Math.random() - .5) * 4, vy: 2 + Math.random() * 4, r: Math.random() * 6.28, s: 6 + Math.random() * 7, c: C[i % 5] });
      if (!anim) loop();
    }
    function loop() {
      cfx.clearRect(0, 0, cvf.width, cvf.height);
      parts.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .05; p.r += .1; cfx.save(); cfx.translate(p.x, p.y); cfx.rotate(p.r); cfx.fillStyle = p.c; cfx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); cfx.restore(); });
      parts = parts.filter(p => p.y < cvf.height + 30);
      anim = parts.length ? requestAnimationFrame(loop) : (cfx.clearRect(0, 0, cvf.width, cvf.height), null);
    }

    function updBatt() {
      const p = Math.min(100, Math.round(points / 1.4));
      $('#battI').style.width = p + '%';
      $('#battI').style.background = p < 35 ? '#e4572e' : p < 70 ? '#d79b14' : '#0b8a4a';
      $('#battT').textContent = p + '%';
      if (p >= 100 && !updBatt.full) { updBatt.full = true; fanfare(); confetti(140); }
    }
    function addPts(n) {
      points += n;
      const e = $('#pts');
      e.textContent = '⭐ ' + points;
      e.classList.remove('bump'); void e.offsetWidth; e.classList.add('bump');
      updBatt();
    }

    function go(n) {
      $$('.tab').forEach((t, i) => { t.classList.toggle('on', i === n); if (i < n) t.classList.add('done'); });
      $$('.panel').forEach((p, i) => p.classList.toggle('on', i === n));
      scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(sizeInk, 80);
    }
    $$('.tab').forEach((t, i) => t.onclick = () => go(i));
    $$('[data-go]').forEach(b => b.onclick = () => go(+b.dataset.go));

    /* Timer 40:00 */
    const TOTAL = 40 * 60;
    let el = 0, run = false, iv = null, rang = false, warned = false;
    function renderClock() {
      const l = TOTAL - el, a = Math.abs(l);
      $('#clock').textContent = (l < 0 ? '+' : '') + String(Math.floor(a / 60)).padStart(2, '0') + ':' + String(a % 60).padStart(2, '0');
      $('#clock').className = 'clock' + (l <= 0 ? ' over' : l <= 300 ? ' warn' : '');
      $('#tbar').style.width = Math.min(100, el / TOTAL * 100) + '%';
      if (run && l === 300 && !warned) { warned = true; tone(660, .3); tone(660, .3, .4); }
      if (run && l <= 0 && !rang) { rang = true; [0, .5, 1].forEach(t => tone(880, .35, t)); $('#alarm').classList.add('show'); }
    }
    $('#tStart').onclick = () => {
      run = !run;
      try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); actx.resume(); } catch (e) {}
      if (run) { iv = setInterval(() => { el++; renderClock(); }, 1000); $('#tStart').textContent = '⏸ إيقاف'; }
      else { clearInterval(iv); $('#tStart').textContent = '▶ متابعة'; }
      renderClock();
    };
    function resetTimer() { clearInterval(iv); run = false; el = 0; rang = false; warned = false; $('#tStart').textContent = '▶ ابدئي الدرس'; renderClock(); }
    $('#tReset').onclick = resetTimer; renderClock();

    /* Mic draw */
    let pool = null;
    const drawKey = () => 'c3-names-' + cfg.lessonId + '-' + curClass;
    $('#micBtn').onclick = () => { try { $('#names').value = localStorage.getItem(drawKey()) || ''; } catch (e) {} pool = null; $('#picked').textContent = '؟'; $('#drawM').classList.add('show'); };
    $('#names').oninput = () => { try { localStorage.setItem(drawKey(), $('#names').value); } catch (e) {} pool = null; };
    $('#drawClose').onclick = () => $('#drawM').classList.remove('show');
    $('#drawGo').onclick = () => {
      let L = $('#names').value.split('\n').map(s => s.trim()).filter(Boolean);
      if (!L.length) { const n = Math.max(2, +$('#count').value || 25); L = Array.from({ length: n }, (_, i) => 'الطالبة رقم ' + (i + 1)); }
      if (!pool || !$('#noRep').checked || !pool.length) pool = [...L];
      const p = $('#picked'); let k = 0;
      const sp = setInterval(() => {
        p.textContent = L[Math.floor(Math.random() * L.length)]; tone(300 + k * 20, .04);
        if (++k > 14) { clearInterval(sp); p.textContent = '🎤 ' + pool.splice(Math.floor(Math.random() * pool.length), 1)[0]; fanfare(); }
      }, 70);
    };

    /* Ink canvas overlay */
    let pen = false, mode = 'pen', col = '#1d2742'; const inks = [];
    $$('.panel').forEach(p => {
      const c = document.createElement('canvas'); c.className = 'ink'; p.appendChild(c);
      const x = c.getContext('2d'); let dr = false, lp = null;
      const pos = e => { const r = c.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top, p: e.pressure || .5 }; };
      c.addEventListener('pointerdown', e => { if (!pen) return; dr = true; lp = pos(e); c.setPointerCapture(e.pointerId); e.preventDefault(); });
      c.addEventListener('pointermove', e => {
        if (!dr) return; const q = pos(e);
        x.globalCompositeOperation = mode === 'er' ? 'destination-out' : 'source-over';
        x.globalAlpha = mode === 'hi' ? .25 : 1; x.strokeStyle = mode === 'hi' ? '#ffd400' : col;
        x.lineWidth = mode === 'er' ? 30 : mode === 'hi' ? 22 : (e.pointerType === 'pen' ? 2 + q.p * 4 : 4);
        x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); x.moveTo(lp.x, lp.y); x.lineTo(q.x, q.y); x.stroke(); lp = q;
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => c.addEventListener(t, () => dr = false));
      inks.push({ c, x, p });
    });
    function sizeInk() {
      inks.forEach(o => {
        if (!o.p.classList.contains('on')) return;
        const w = o.p.offsetWidth, h = o.p.scrollHeight, d = devicePixelRatio || 1;
        if (o.c.width === Math.round(w * d) && o.c.height === Math.round(h * d)) return;
        o.c.width = w * d; o.c.height = h * d; o.c.style.width = w + 'px'; o.c.style.height = h + 'px'; o.x.setTransform(d, 0, 0, d, 0, 0);
      });
    }
    addEventListener('resize', sizeInk); sizeInk();
    function setMode(m) { mode = m; pen = true; document.body.classList.add('pen'); $('#penBtn').classList.toggle('on', m === 'pen'); $('#hiBtn').classList.toggle('on', m === 'hi'); $('#erBtn').classList.toggle('on', m === 'er'); }
    $('#penBtn').onclick = () => { if (pen && mode === 'pen') { pen = false; document.body.classList.remove('pen'); $('#penBtn').classList.remove('on'); } else setMode('pen'); };
    $('#hiBtn').onclick = () => { if (pen && mode === 'hi') { pen = false; document.body.classList.remove('pen'); $('#hiBtn').classList.remove('on'); } else setMode('hi'); };
    $('#erBtn').onclick = () => { if (pen && mode === 'er') { pen = false; document.body.classList.remove('pen'); $('#erBtn').classList.remove('on'); } else setMode('er'); };
    $$('.tools .dot').forEach(d => d.onclick = () => { col = d.dataset.c; $$('.tools .dot').forEach(z => z.classList.remove('on')); d.classList.add('on'); setMode('pen'); });
    $('#clrBtn').onclick = () => { const o = inks.find(o => o.p.classList.contains('on')); if (o) o.x.clearRect(0, 0, o.c.width, o.c.height); };

    /* Inject interactive Vocabulary Flashcards in Tab 0 if provided */
    if (cfg.vocab && cfg.vocab.length && window.createVocabFlashcards) {
      const p0 = $('.panel');
      if (p0) {
        const vCard = document.createElement('div');
        vCard.className = 'card';
        vCard.style.setProperty('--c', 'var(--blue)');
        vCard.appendChild(window.createVocabFlashcards(cfg.vocab, {
          title: '🃏 المفردات الأساسية (اضغطي على الكلمة لكشف التعريف ⚡ +1)',
          onFlip: function (_t, elCard) {
            if (!elCard.dataset.scored) { elCard.dataset.scored = '1'; good(); addPts(1); }
          }
        }));
        const nextDiv = p0.querySelector('.next');
        p0.insertBefore(vCard, nextDiv || null);
      }
    }

    /* Common interactions: reveal cards, blur steps, tracks, qrow, calc */
    $$('.rv').forEach(b => b.onclick = () => { if (b.classList.contains('open')) return; b.classList.add('open'); good(); addPts(3); });
    $$('.st').forEach(s => { const o = () => { if (!s.classList.contains('open')) { s.classList.add('open'); tone(620, .1); addPts(1); } }; s.querySelector('button').onclick = o; s.querySelector('.a').onclick = o; });
    const wQ = $('#wQ'); if (wQ) wQ.onclick = () => { $('#wA').classList.add('show'); good(); addPts(3); };

    function showTrack(i) { $$('.track').forEach((t, k) => t.classList.toggle('on', k === i)); $$('.tbox').forEach((b, k) => b.classList.toggle('on', k === i)); tone(500 + i * 120, .12); setTimeout(sizeInk, 60); }
    $$('.track').forEach((t, i) => t.onclick = () => showTrack(i));
    $$('.qrow[data-a]').forEach(r => {
      const s = r.querySelector('select'), b = r.querySelector('.chk');
      b.onclick = () => {
        if (r.classList.contains('ok')) return; if (!s.value) { bad(); return; } r.classList.remove('no'); void r.offsetWidth;
        if (s.value === r.dataset.a) { r.classList.add('ok'); r.querySelector('.fb').textContent = '✅'; s.disabled = true; good(); addPts(6); }
        else { r.classList.add('no'); r.querySelector('.fb').textContent = '❌'; bad(); }
      };
    });
    $$('.calc').forEach(r => {
      const i = r.querySelector('input'), s = r.querySelector('select'), b = r.querySelector('.chk');
      b.onclick = () => {
        if (r.classList.contains('ok')) return; r.classList.remove('no'); void r.offsetWidth; const v = parseFloat(i.value);
        const okN = !isNaN(v) && Math.abs(v - parseFloat(r.dataset.a)) <= 0.02, okS = !s || s.value === r.dataset.s;
        if (okN && okS) { r.classList.add('ok'); r.querySelector('.fb').textContent = '✅'; i.disabled = true; if (s) s.disabled = true; good(); addPts(10); }
        else { r.classList.add('no'); r.querySelector('.fb').textContent = !okN ? '❌ راجعي الحساب' : '❌ راجعي الاختيار'; bad(); }
      };
    });

    /* Exit ticket Speed Challenge */
    const QS = cfg.challengeQuestions || [];
    let qi = 0, left = 15, civ = null, ans = false, corr = 0;
    function ring() { $('#ringT').textContent = left; $('#ringC').style.strokeDashoffset = 226.2 * (1 - left / 15); $('#ringC').style.stroke = left <= 5 ? '#e4572e' : '#d79b14'; }
    function loadQ() {
      const Q = QS[qi]; ans = false; left = 15; ring(); $('#qn').textContent = `السؤال ${qi + 1} من ${QS.length} · ${Q.src || 'أسئلة من التحصيلي'}`; $('#cq').innerHTML = Q.q; $('#res').textContent = '';
      const b = $('#copts'); b.innerHTML = '';
      Q.o.forEach((t, i) => { const x = document.createElement('button'); x.type = 'button'; x.innerHTML = ['أ', 'ب', 'ج', 'د'][i] + ') ' + t; x.onclick = () => answer(i); b.appendChild(x); });
      $('#cNext').style.display = 'none'; clearInterval(civ);
      civ = setInterval(() => { left--; ring(); if (left <= 3 && left > 0) tone(440, .08); if (left <= 0) { clearInterval(civ); answer(-1); } }, 1000);
    }
    function answer(i) {
      if (ans) return; ans = true; clearInterval(civ);
      const Q = QS[qi], bs = $$('#copts button'); bs[Q.a].classList.add('ok'); if (i >= 0 && i !== Q.a) bs[i].classList.add('no');
      if (i === Q.a) { corr++; good(); addPts(10); $('#res').innerHTML = '<span style="color:var(--green)">✓ إجابة صحيحة! ⚡ +10 · ' + (Q.exp || '') + '</span>'; }
      else { bad(); $('#res').innerHTML = (i < 0 ? '<span style="color:var(--ox)">⏰ انتهى الوقت · </span>' : '') + '<span style="color:var(--ox)">التفسير: ' + (Q.exp || 'الصحيحة بالأخضر') + '</span>'; }
      if (window.CHEM_PORTAL) window.CHEM_PORTAL.saveLessonScore(cfg.lessonId, corr, QS.length);
      if (qi < QS.length - 1) $('#cNext').style.display = '';
      else { $('#res').innerHTML += `<div style="color:var(--gold)">🏆 النتيجة النهائية: ${corr} من ${QS.length}</div>`; $('#cGo').style.display = ''; $('#cGo').textContent = '↺ أعيدي التحدي'; if (corr >= Math.ceil(QS.length * 0.7)) { fanfare(); confetti(); } }
    }
    $('#cGo').onclick = () => { qi = 0; corr = 0; $('#cGo').style.display = 'none'; loadQ(); };
    $('#cNext').onclick = () => { qi++; loadQ(); };

    function resetBoard() {
      points = 0; $('#pts').textContent = '⭐ 0'; updBatt.full = false; updBatt();
      if (cfg.onReset) cfg.onReset();
      $$('.rv').forEach(b => b.classList.remove('open'));
      const wA = $('#wA'); if (wA) wA.classList.remove('show');
      $$('.st').forEach(s => s.classList.remove('open'));
      $$('.track').forEach(t => t.classList.remove('on')); $$('.tbox').forEach(t => t.classList.remove('on'));
      $$('.qrow[data-a]').forEach(r => { r.classList.remove('ok', 'no'); r.querySelector('.fb').textContent = ''; const s = r.querySelector('select'); s.disabled = false; s.value = ''; });
      $$('.calc').forEach(r => { r.classList.remove('ok', 'no'); r.querySelector('.fb').textContent = ''; const i = r.querySelector('input'); i.disabled = false; i.value = ''; const s = r.querySelector('select'); if (s) { s.disabled = false; s.value = ''; } });
      clearInterval(civ); qi = 0; corr = 0; $('#copts').innerHTML = ''; $('#res').textContent = ''; $('#cNext').style.display = 'none'; $('#cGo').style.display = ''; $('#cGo').textContent = '▶ ابدئي بطاقة الخروج'; left = 15; ring();
      inks.forEach(o => o.x.clearRect(0, 0, o.c.width, o.c.height)); resetTimer(); pool = null; $$('.tab').forEach(t => t.classList.remove('done')); go(0);
    }
    $('#resetAll').onclick = resetBoard;
    $$('#cls button').forEach((b, i) => b.onclick = () => { if (b.classList.contains('on')) return; $$('#cls button').forEach(z => z.classList.remove('on')); b.classList.add('on'); curClass = i; resetBoard(); });

    return { $, $$, tone, good, bad, fanfare, confetti, addPts, go };
  };
})();
