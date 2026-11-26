// Interactive Slide-Deck Lesson Engine (Slides, Section Tabs, Instant Quizzes, Timer, Whiteboard)
(function () {
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'className') node.className = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else if (k === 'text') node.textContent = attrs[k];
        else if (k.startsWith('on') && typeof attrs[k] === 'function') {
          node.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
        } else {
          node.setAttribute(k, attrs[k]);
        }
      });
    }
    if (Array.isArray(children)) {
      children.forEach(function (c) {
        if (c) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      });
    }
    return node;
  }

  function initTimer() {
    const display = document.getElementById('timerDisplay');
    const toggleBtn = document.getElementById('timerToggleBtn');
    const resetBtn = document.getElementById('timerResetBtn');
    const presetBtns = document.querySelectorAll('[data-timer-mins]');
    if (!display || !toggleBtn || !resetBtn) return;

    let baseSeconds = 40 * 60;
    let remaining = baseSeconds;
    let intervalId = null;

    function render() {
      const m = Math.floor(remaining / 60);
      const s = remaining % 60;
      display.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }

    function stop() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      toggleBtn.textContent = 'ابدئي';
    }

    toggleBtn.addEventListener('click', function () {
      if (intervalId) {
        stop();
      } else {
        if (remaining === 0) remaining = baseSeconds;
        toggleBtn.textContent = 'إيقاف';
        intervalId = setInterval(function () {
          if (remaining > 0) {
            remaining--;
            render();
          } else {
            stop();
          }
        }, 1000);
      }
    });

    resetBtn.addEventListener('click', function () {
      stop();
      remaining = baseSeconds;
      render();
    });

    presetBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        stop();
        baseSeconds = Number(btn.getAttribute('data-timer-mins')) * 60;
        remaining = baseSeconds;
        render();
      });
    });

    render();
  }

  function playChime(freq, dur) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!playChime.ctx) playChime.ctx = new AC();
      const c = playChime.ctx;
      if (c.state === 'suspended') c.resume();
      const o = c.createOscillator();
      const g = c.createGain();
      const t = c.currentTime;
      o.type = 'sine';
      o.frequency.value = freq || 660;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + (dur || 0.16));
      o.connect(g);
      g.connect(c.destination);
      o.start(t);
      o.stop(t + (dur || 0.16) + 0.04);
    } catch (_e) {}
  }

  function initStudentDraw() {
    const tools = document.querySelector('.header-tools');
    if (!tools || document.getElementById('drawOpenBtn')) return;
    const btn = el('button', { id: 'drawOpenBtn', type: 'button', className: 'btn btn-sm btn-draw', text: '🎤 قرعة' });
    const wbBtn = document.getElementById('wbToggleBtn');
    tools.insertBefore(btn, wbBtn || null);

    const modal = el('div', { id: 'drawModal', className: 'draw-modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'قرعة اختيار أسماء الطالبات' });
    const picked = el('div', { id: 'drawPicked', className: 'draw-picked', text: '؟' });
    const namesArea = el('textarea', { id: 'drawNamesInput', className: 'draw-textarea', placeholder: 'اكتبي اسم كل طالبة في سطر منفصل (يُحفظ تلقائياً)...' });
    const noRepeatChk = el('input', { type: 'checkbox', id: 'drawNoRepeat', checked: '' });
    const countInput = el('input', { type: 'number', id: 'drawCountInput', min: '2', max: '60', value: '25', className: 'btn btn-sm', style: 'width:72px' });
    const spinBtn = el('button', { id: 'drawSpinBtn', type: 'button', className: 'btn btn-primary', text: '🎲 اسحبي اسماً' });
    const resetPoolBtn = el('button', { id: 'drawResetPoolBtn', type: 'button', className: 'btn btn-sm', text: 'إعادة القائمة ↺' });
    const closeBtn = el('button', { id: 'drawCloseBtn', type: 'button', className: 'btn btn-sm', text: 'إغلاق' });

    const card = el('div', { className: 'draw-card' }, [
      el('h3', { text: '🎤 قرعة اختيار أسماء الطالبات' }),
      picked,
      el('div', { className: 'draw-row' }, [spinBtn, resetPoolBtn, closeBtn]),
      namesArea,
      el('div', { className: 'draw-row', style: 'font-size:0.88rem;font-weight:700;' }, [
        el('label', { style: 'display:inline-flex;align-items:center;gap:0.3rem;cursor:pointer;' }, [noRepeatChk, ' بلا تكرار']),
        el('label', { style: 'display:inline-flex;align-items:center;gap:0.3rem;' }, ['العدد الافتراضي: ', countInput])
      ])
    ]);
    modal.appendChild(card);
    document.body.appendChild(modal);

    const STORE_KEY = 'chem21-draw-names';
    let pool = [];
    let spinning = false;

    function getList() {
      const raw = namesArea.value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
      if (raw.length) return raw;
      const n = Math.max(2, Math.min(60, Number(countInput.value) || 25));
      return Array.from({ length: n }, function (_, i) { return 'الطالبة رقم ' + (i + 1); });
    }

    function openModal() {
      try { namesArea.value = localStorage.getItem(STORE_KEY) || ''; } catch (_e) {}
      if (!pool.length) pool = getList();
      modal.classList.add('open');
    }
    function closeModal() {
      modal.classList.remove('open');
    }

    btn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
    namesArea.addEventListener('input', function () {
      try { localStorage.setItem(STORE_KEY, namesArea.value); } catch (_e) {}
      pool = [];
    });
    countInput.addEventListener('change', function () { pool = []; });
    resetPoolBtn.addEventListener('click', function () {
      pool = getList();
      picked.textContent = '؟ (تمت إعادة القائمة)';
    });

    spinBtn.addEventListener('click', function () {
      if (spinning) return;
      const list = getList();
      if (!pool.length || !noRepeatChk.checked) pool = list.slice();
      spinning = true;
      let k = 0;
      const iv = setInterval(function () {
        picked.textContent = list[Math.floor(Math.random() * list.length)];
        playChime(320 + k * 25, 0.05);
        if (++k > 10) {
          clearInterval(iv);
          const idx = Math.floor(Math.random() * pool.length);
          const chosen = pool.splice(idx, 1)[0];
          picked.textContent = '🎤 ' + chosen;
          playChime(784, 0.22);
          spinning = false;
        }
      }, 55);
    });
  }

  function initWhiteboard() {
    const toggleBtn = document.getElementById('wbToggleBtn');
    const dock = document.getElementById('wbDock');
    const canvas = document.getElementById('wbCanvas');
    if (!toggleBtn || !dock || !canvas) return;

    const ctx = canvas.getContext('2d');
    let active = false;
    let drawing = false;
    let color = '#1D5FD6';
    let eraser = false;
    const strokes = [];
    let currentStroke = null;

    function resize() {
      const snapshot = strokes.slice();
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      redraw(snapshot);
    }

    function redraw(list) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      list.forEach(function (st) {
        if (st.points.length < 2) return;
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = st.eraser ? 18 : 3;
        ctx.globalCompositeOperation = st.eraser ? 'destination-out' : 'source-over';
        ctx.strokeStyle = st.color;
        ctx.beginPath();
        ctx.moveTo(st.points[0].x, st.points[0].y);
        for (let i = 1; i < st.points.length; i++) {
          ctx.lineTo(st.points[i].x, st.points[i].y);
        }
        ctx.stroke();
        ctx.restore();
      });
    }

    function setActive(state) {
      active = state;
      dock.hidden = !active;
      canvas.classList.toggle('drawing', active);
      toggleBtn.classList.toggle('btn-active', active);
      toggleBtn.setAttribute('aria-pressed', String(active));
      toggleBtn.textContent = active ? 'إخفاء القلم' : 'قلم الشرح';
    }

    toggleBtn.addEventListener('click', function () { setActive(!active); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && active) setActive(false);
    });

    dock.querySelectorAll('[data-wb-color]').forEach(function (sw) {
      sw.addEventListener('click', function () {
        eraser = false;
        color = sw.getAttribute('data-wb-color');
        dock.querySelectorAll('.wb-swatch').forEach(function (b) { b.classList.remove('active'); });
        sw.classList.add('active');
        const erBtn = document.getElementById('wbEraserBtn');
        if (erBtn) erBtn.classList.remove('btn-active');
      });
    });

    const erBtn = document.getElementById('wbEraserBtn');
    if (erBtn) {
      erBtn.addEventListener('click', function () {
        eraser = !eraser;
        erBtn.classList.toggle('btn-active', eraser);
      });
    }
    const undoBtn = document.getElementById('wbUndoBtn');
    if (undoBtn) {
      undoBtn.addEventListener('click', function () { strokes.pop(); redraw(strokes); });
    }
    const clearBtn = document.getElementById('wbClearBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () { strokes.length = 0; redraw(strokes); });
    }
    const closeBtn = document.getElementById('wbCloseBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () { setActive(false); });
    }

    function pt(e) {
      const t = e.touches ? e.touches[0] : e;
      return { x: t.clientX, y: t.clientY };
    }

    canvas.addEventListener('pointerdown', function (e) {
      if (!active) return;
      drawing = true;
      currentStroke = { color: color, eraser: eraser, points: [pt(e)] };
      strokes.push(currentStroke);
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!active || !drawing || !currentStroke) return;
      currentStroke.points.push(pt(e));
      redraw(strokes);
    });
    window.addEventListener('pointerup', function () {
      drawing = false;
      currentStroke = null;
    });
    window.addEventListener('resize', resize);
    resize();
  }

  function createSimulationNode(simType) {
    if (!simType) return null;
    if (window.CHEM_VIRTUAL_LABS && typeof window.CHEM_VIRTUAL_LABS.createLab === 'function') {
      const upgraded = window.CHEM_VIRTUAL_LABS.createLab(simType);
      if (upgraded) return upgraded;
    }
    const box = el('div', { className: 'sim-box' });

    function themePalette() {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      return {
        dark: dark,
        primary: dark ? '#5BA4FF' : '#1D5FD6',
        secondary: dark ? '#4FD18B' : '#0B7A43',
        accent: dark ? '#FF9A5C' : '#B44308',
        ink: dark ? '#F0F5FF' : '#18223C',
        muted: dark ? '#A9B8D8' : '#4A5674',
        wall: dark ? '#415A8C' : '#A9B8DB',
        surface: dark ? '#15213B' : '#FFFFFF',
        tint: dark ? 'rgba(91,164,255,0.16)' : 'rgba(29,95,214,0.1)'
      };
    }

    if (simType === 'states-particles') {
      const controls = el('div', { className: 'sim-controls' });
      const canvasWrap = el('div', { className: 'sim-canvas-wrap' });
      const canvas = el('canvas', { width: '640', height: '230' });
      const readout = el('div', { className: 'sim-readout' });
      canvasWrap.appendChild(canvas);
      canvasWrap.appendChild(readout);
      box.appendChild(controls);
      box.appendChild(canvasWrap);

      let mode = 'solid';
      const modes = {
        solid: { label: 'صلب (اهتزاز ثابت)', desc: 'صلب: الجسيمات متقاربة جداً ومرتبة بانتظام، وتهتز في أماكن ثابتة لقوة التجاذب.' },
        liquid: { label: 'سائل (انزلاق وانسياب)', desc: 'سائل: الجسيمات متقاربة لكنها تنزلق فوق بعضها فتأخذ شكل الوعاء وتحتفظ بحجم ثابت.' },
        gas: { label: 'غاز (انتشار سريع)', desc: 'غاز: الجسيمات متباعدة جداً وتتحرك عشوائياً بسرعة في خطوط مستقيمة وتنتشر لتملأ الوعاء.' },
        viscosity: { label: 'تجربة اللزوجة (بارد مقابل ساخن)', desc: 'بارد (يمين): لزوجة عالية فينساب ببطء؛ ساخن (يسار): طاقة حركية أعلى فينساب بسرعة.' }
      };
      const particles = [];
      for (let i = 0; i < 36; i++) {
        particles.push({
          gx: (i % 6) * 32 + 240,
          gy: Math.floor(i / 6) * 26 + 44,
          x: Math.random() * 540 + 50,
          y: Math.random() * 145 + 35,
          vx: (Math.random() - 0.5) * 4.2,
          vy: (Math.random() - 0.5) * 4.2,
          phase: Math.random() * Math.PI * 2
        });
      }
      let dropCold = 34, dropHot = 34;
      const btns = {};
      Object.keys(modes).forEach(function (k) {
        const b = el('button', { type: 'button', className: 'btn btn-sm', text: modes[k].label });
        b.addEventListener('click', function () {
          mode = k;
          if (k === 'viscosity') { dropCold = 34; dropHot = 34; }
          Object.keys(btns).forEach(function (key) { btns[key].classList.toggle('btn-primary', key === mode); });
          readout.textContent = modes[mode].desc;
        });
        btns[k] = b;
        controls.appendChild(b);
      });
      btns.solid.classList.add('btn-primary');
      readout.textContent = modes.solid.desc;

      const ctx = canvas.getContext('2d');
      let t = 0;
      function tick() {
        if (!document.body.contains(canvas)) return;
        t += 0.08;
        const pal = themePalette();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (mode === 'viscosity') {
          dropHot += 1.65;
          dropCold += 0.42;
          if (dropHot > 195) dropHot = 34;
          if (dropCold > 195) dropCold = 34;

          ctx.strokeStyle = pal.wall;
          ctx.lineWidth = 3;
          ctx.strokeRect(120, 24, 110, 186);
          ctx.strokeRect(410, 24, 110, 186);

          ctx.fillStyle = pal.accent;
          ctx.beginPath();
          ctx.arc(175, dropHot, 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(170, 26, 10, Math.max(0, dropHot - 26));

          ctx.fillStyle = pal.primary;
          ctx.beginPath();
          ctx.arc(465, dropCold, 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(460, 26, 10, Math.max(0, dropCold - 26));

          ctx.fillStyle = pal.ink;
          ctx.font = 'bold 15px Tajawal, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('سائل ساخن (لزوجة أقل)', 175, 222);
          ctx.fillText('سائل بارد (لزوجة عالية)', 465, 222);
        } else {
          ctx.strokeStyle = pal.wall;
          ctx.lineWidth = 2.5;
          ctx.strokeRect(16, 12, canvas.width - 32, canvas.height - 24);

          particles.forEach(function (p, idx) {
            let px, py;
            if (mode === 'solid') {
              px = p.gx + Math.sin(t * 2 + p.phase) * 2.2;
              py = p.gy + Math.cos(t * 2 + p.phase) * 2.2;
            } else if (mode === 'liquid') {
              p.x += Math.sin(t + p.phase) * 1.1;
              p.y += Math.cos(t * 0.8 + p.phase) * 0.7;
              if (p.x < 40) p.x = canvas.width - 40;
              if (p.x > canvas.width - 40) p.x = 40;
              if (p.y < 115) p.y = 115 + (idx % 5) * 18;
              if (p.y > 200) p.y = 200;
              px = p.x;
              py = p.y;
            } else {
              p.x += p.vx;
              p.y += p.vy;
              if (p.x < 30 || p.x > canvas.width - 30) p.vx *= -1;
              if (p.y < 26 || p.y > canvas.height - 26) p.vy *= -1;
              px = p.x;
              py = p.y;
            }
            ctx.beginPath();
            ctx.arc(px, py, 9.5, 0, Math.PI * 2);
            ctx.fillStyle = mode === 'gas' ? pal.accent : mode === 'liquid' ? pal.secondary : pal.primary;
            ctx.fill();
            ctx.strokeStyle = pal.surface;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          });
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    } else if (simType === 'graham-gas') {
      const gases = [
        { name: 'الهيليوم He (4.0)', short: 'He', m: 4.0 },
        { name: 'الميثان CH₄ (16.0)', short: 'CH₄', m: 16.0 },
        { name: 'الأمونيا NH₃ (17.0)', short: 'NH₃', m: 17.0 },
        { name: 'النيتروجين N₂ (28.0)', short: 'N₂', m: 28.0 },
        { name: 'الأكسجين O₂ (32.0)', short: 'O₂', m: 32.0 },
        { name: 'كلوريد الهيدروجين HCl (36.5)', short: 'HCl', m: 36.5 },
        { name: 'ثاني أكسيد الكربون CO₂ (44.0)', short: 'CO₂', m: 44.0 }
      ];
      const controls = el('div', { className: 'sim-controls' });
      const selA = el('select', { className: 'btn btn-sm', 'aria-label': 'الغاز الأول A' });
      const selB = el('select', { className: 'btn btn-sm', 'aria-label': 'الغاز الثاني B' });
      gases.forEach(function (g, i) {
        selA.appendChild(el('option', { value: String(i), text: 'الغاز A: ' + g.name }));
        selB.appendChild(el('option', { value: String(i), text: 'الغاز B: ' + g.name }));
      });
      selA.value = '2';
      selB.value = '5';
      const launchBtn = el('button', { type: 'button', className: 'btn btn-sm btn-primary', text: 'إطلاق الغازين في الأنبوب' });
      controls.appendChild(selA);
      controls.appendChild(selB);
      controls.appendChild(launchBtn);

      const tubeWrap = el('div', { className: 'sim-tube-wrap' });
      const tube = el('div', { className: 'sim-tube' });
      const barA = el('div', { className: 'sim-tube-a' });
      const barB = el('div', { className: 'sim-tube-b' });
      const ring = el('div', { className: 'sim-tube-ring', hidden: '' });
      tube.appendChild(barA);
      tube.appendChild(barB);
      tube.appendChild(ring);
      tubeWrap.appendChild(tube);

      const readout = el('div', { className: 'sim-readout' });
      let animId = 0;

      function runTube(animate) {
        cancelAnimationFrame(animId);
        const gA = gases[Number(selA.value)];
        const gB = gases[Number(selB.value)];
        const vA = 1 / Math.sqrt(gA.m);
        const vB = 1 / Math.sqrt(gB.m);
        const fracA = vA / (vA + vB);
        const ratio = Math.sqrt(gB.m / gA.m);
        barA.textContent = gA.short;
        barB.textContent = gB.short;
        ring.hidden = true;

        function finishText() {
          readout.innerHTML = 'نسبة الانتشار <span class="chem">r(A)/r(B) = √(' + gB.m + ' / ' + gA.m + ') = ' + ratio.toFixed(2) + '</span> · يلتقيان عند <span class="chem">' + Math.round(fracA * 100) + '%</span> من جهة ' + gA.short + ' (' +
            (ratio > 1 ? gA.short + ' أسرع لأنه أخف' : ratio < 1 ? gB.short + ' أسرع لأنه أخف' : 'سرعتهما متساوية') + ').';
        }

        if (!animate) {
          barA.style.width = (fracA * 100) + '%';
          barB.style.width = ((1 - fracA) * 100) + '%';
          ring.style.left = (fracA * 100) + '%';
          ring.hidden = false;
          finishText();
          return;
        }
        const t0 = performance.now();
        const dur = 1800;
        readout.textContent = 'تندفع جسيمات الغازين من طرفي الأنبوب...';
        function step(now) {
          if (!document.body.contains(tube)) return;
          const k = Math.min(1, (now - t0) / dur);
          barA.style.width = (fracA * k * 100) + '%';
          barB.style.width = ((1 - fracA) * k * 100) + '%';
          if (k < 1) {
            animId = requestAnimationFrame(step);
          } else {
            ring.style.left = (fracA * 100) + '%';
            ring.hidden = false;
            finishText();
          }
        }
        animId = requestAnimationFrame(step);
      }

      selA.addEventListener('change', function () { runTube(true); });
      selB.addEventListener('change', function () { runTube(true); });
      launchBtn.addEventListener('click', function () { runTube(true); });
      runTube(false);

      box.appendChild(controls);
      box.appendChild(tubeWrap);
      box.appendChild(readout);
    } else if (simType === 'imf-compare') {
      const items = [
        { label: 'CH₄ (الميثان)', m: '16.0 g/mol', bp: '-164 °C', strength: 1, tag: 'تشتت ضعيفة', force: 'قوى تشتت ضعيفة (جزيء غير قطبي) فتتبخر جزيئاته بسهولة ويكون غازاً في حرارة الغرفة.' },
        { label: 'HCl (كلوريد الهيدروجين)', m: '36.5 g/mol', bp: '-85 °C', strength: 2, tag: 'ثنائية قطبية', force: 'تجاذب ثنائي القطب بين الجزيئات القطبية + تشتت، فتزيد طاقة الترابط ودرجة الغليان.' },
        { label: 'NH₃ (الأمونيا)', m: '17.0 g/mol', bp: '-33.4 °C', strength: 3, tag: 'روابط هيدروجينية', force: 'روابط هيدروجينية (N-H) قوية نسبياً لكنها أضعف من روابط الماء.' },
        { label: 'H₂O (الماء)', m: '18.0 g/mol', bp: '100 °C', strength: 4, tag: 'شبكة هيدروجينية قوية', force: 'روابط هيدروجينية قوية ومتعددة (O-H)، تفسر بقاء الماء سائلاً وارتفاع درجة غليانه.' }
      ];
      let curIdx = 3;
      let tempC = 25;
      const controls = el('div', { className: 'sim-controls' });
      const heatRange = el('input', { type: 'range', min: '-180', max: '130', step: '5', value: '25', 'aria-label': 'درجة الحرارة المطبقة' });
      const heatLbl = el('span', { className: 'page-ref', text: ' الحرارة: 25 °C' });
      const canvasWrap = el('div', { className: 'sim-canvas-wrap' });
      const canvas = el('canvas', { width: '620', height: '190' });
      const readout = el('div', { className: 'sim-readout' });
      canvasWrap.appendChild(canvas);
      canvasWrap.appendChild(readout);
      box.appendChild(controls);
      box.appendChild(el('div', { className: 'sim-controls' }, [el('label', { text: 'تحكمي بالتسخين / التبريد (°C): ' }, [heatRange, heatLbl])]));
      box.appendChild(canvasWrap);

      function updateReadout() {
        const it = items[curIdx];
        const bpVal = parseFloat(it.bp);
        const boiled = tempC >= bpVal;
        heatLbl.textContent = ' ' + tempC + ' °C (' + (boiled ? 'غاز / تبخّر' : 'متماسك / مكثّف') + ')';
        readout.innerHTML = 'الكتلة المولية: <span class="chem">' + it.m + '</span> | الغليان: <span class="chem">' + it.bp + '</span> · الحالة عند <span class="chem">' + tempC + ' °C</span>: <strong>' + (boiled ? 'تغلّبت الحرارة على قوى التجاذب!' : 'قوى التجاذب ممسكة بالجسيمات') + '</strong> : ' + it.force;
      }
      function selectItem(idx) {
        curIdx = idx;
        controls.querySelectorAll('button').forEach(function (btn, bIdx) {
          btn.classList.toggle('btn-primary', bIdx === idx);
        });
        updateReadout();
      }
      items.forEach(function (it, i) {
        const b = el('button', { type: 'button', className: 'btn btn-sm', text: it.label });
        b.addEventListener('click', function () { selectItem(i); });
        controls.appendChild(b);
      });
      heatRange.addEventListener('input', function () {
        tempC = Number(heatRange.value);
        updateReadout();
      });
      selectItem(3);

      const ctx = canvas.getContext('2d');
      let t = 0;
      function drawIMF() {
        if (!document.body.contains(canvas)) return;
        const it = items[curIdx];
        const bpVal = parseFloat(it.bp);
        const boiled = tempC >= bpVal;
        const pal = themePalette();
        const vib = boiled ? 14 : (5 - it.strength) * 2.8 + Math.max(0, (tempC + 180) / 140);
        t += boiled ? 0.11 : 0.065;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let row = 0; row < 2; row++) {
          for (let col = 0; col < 3; col++) {
            const spread = boiled ? (col - 1) * 32 + Math.sin(t * 1.4 + row * 3 + col) * 18 : 0;
            const spreadY = boiled ? (row - 0.5) * 18 + Math.cos(t * 1.3 + col * 2) * 14 : 0;
            const bx = 135 + col * 175 + spread + Math.sin(t + row + col) * vib;
            const by = 58 + row * 72 + spreadY + Math.cos(t * 1.1 + col) * (vib * 0.7);
            if (col < 2 && !boiled) {
              const nx = 135 + (col + 1) * 175 + Math.sin(t + row + col + 1) * vib;
              const ny = 58 + row * 72 + Math.cos(t * 1.1 + col + 1) * (vib * 0.7);
              ctx.save();
              ctx.setLineDash(it.strength >= 3 ? [] : [6, 5]);
              ctx.lineWidth = it.strength * 1.4;
              ctx.strokeStyle = it.strength >= 3 ? pal.secondary : it.strength === 2 ? pal.primary : pal.muted;
              ctx.beginPath();
              ctx.moveTo(bx + 20, by);
              ctx.lineTo(nx - 20, ny);
              ctx.stroke();
              ctx.restore();
            }
            ctx.beginPath();
            ctx.arc(bx, by, 18, 0, Math.PI * 2);
            ctx.fillStyle = boiled ? pal.coral : (it.strength >= 3 ? pal.primary : pal.accent);
            ctx.fill();
            ctx.fillStyle = pal.surface;
            ctx.font = 'bold 12px Tajawal, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(it.label.split(' ')[0], bx, by);
          }
        }
        ctx.fillStyle = pal.ink;
        ctx.font = 'bold 14px Tajawal, sans-serif';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText((boiled ? '🔥 تبخّر (تكسّرت الروابط بين الجزيئات)' : '🧊 مترابط: ' + it.tag) + '  |  T = ' + tempC + ' °C', canvas.width / 2, 178);
        requestAnimationFrame(drawIMF);
      }
      requestAnimationFrame(drawIMF);
    } else if (simType === 'phase-diagram') {
      const controls = el('div', { className: 'sim-controls' });
      const tInput = el('input', { type: 'range', min: '-20', max: '400', value: '25', 'aria-label': 'درجة الحرارة بالسيليزية' });
      const pInput = el('input', { type: 'range', min: '0.001', max: '230', step: '0.5', value: '1', 'aria-label': 'الضغط الجوي' });
      const tLbl = el('span', { className: 'page-ref' });
      const pLbl = el('span', { className: 'page-ref' });
      controls.appendChild(el('label', { text: 'الحرارة (°C): ' }, [tInput, tLbl]));
      controls.appendChild(el('label', { text: 'الضغط (atm): ' }, [pInput, pLbl]));
      const presetRow = el('div', { className: 'sim-controls' });
      const canvasWrap = el('div', { className: 'sim-canvas-wrap' });
      const canvas = el('canvas', { width: '620', height: '190' });
      const readout = el('div', { className: 'sim-readout' });
      canvasWrap.appendChild(canvas);
      canvasWrap.appendChild(readout);

      let phaseState = 'liquid';
      const pts = Array.from({ length: 24 }, function (_, i) {
        return { gx: 90 + (i % 6) * 26, gy: 52 + Math.floor(i / 6) * 24, x: 75 + Math.random() * 160, y: 55 + Math.random() * 95, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, ph: i };
      });

      function evaluate() {
        const T = Number(tInput.value);
        const P = Number(pInput.value);
        tLbl.textContent = ' ' + T + ' °C';
        pLbl.textContent = ' ' + P + ' atm';
        let msg = '';
        if (Math.abs(T - 0.01) < 1 && P < 0.5) {
          phaseState = 'triple';
          msg = 'قرب النقطة الثلاثية للماء (0.01°C, 0.006 atm): تتزن الحالات الثلاث معاً (صلب وسائل وبخار).';
        } else if (T >= 373.99 && P >= 217.75) {
          phaseState = 'critical';
          msg = 'فوق النقطة الحرجة (373.99°C, 217.75 atm): مائع فوق حرج لا يمكن إسالته بزيادة الضغط.';
        } else if (T < 0) {
          phaseState = 'solid';
          msg = 'الحالة الصلبة (جليد): الجسيمات مقيدة في شبكة بلورية مفتوحة بروابط هيدروجينية.';
        } else if (P >= 1 && T >= 0 && T < 100) {
          phaseState = 'liquid';
          msg = 'الحالة السائلة (ماء): ضغط البخار أقل من الضغط الخارجي وتنساب الجسيمات.';
        } else {
          phaseState = 'gas';
          msg = 'الحالة الغازية (بخار ماء): طاقة الجسيمات عالية فتتغلب على قوى التجاذب وتتباعد.';
        }
        readout.textContent = msg;
      }

      [
        { label: 'ظروف الغرفة (25°C, 1 atm)', t: 25, p: 1 },
        { label: 'النقطة الثلاثية (~0°C, 0.006 atm)', t: 0, p: 0.006 },
        { label: 'النقطة الحرجة (374°C, 218 atm)', t: 374, p: 218 }
      ].forEach(function (pr) {
        const b = el('button', { type: 'button', className: 'btn btn-sm', text: pr.label });
        b.addEventListener('click', function () {
          tInput.value = pr.t;
          pInput.value = pr.p;
          evaluate();
        });
        presetRow.appendChild(b);
      });
      tInput.addEventListener('input', evaluate);
      pInput.addEventListener('input', evaluate);
      evaluate();
      box.appendChild(controls);
      box.appendChild(presetRow);
      box.appendChild(canvasWrap);

      const ctx = canvas.getContext('2d');
      let tm = 0;
      function drawPhase() {
        if (!document.body.contains(canvas)) return;
        tm += 0.08;
        const pal = themePalette();
        const T = Number(tInput.value);
        const P = Number(pInput.value);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Left: animated particle chamber
        ctx.strokeStyle = pal.wall;
        ctx.lineWidth = 2.5;
        ctx.strokeRect(30, 18, 250, 154);
        pts.forEach(function (p) {
          let px, py;
          if (phaseState === 'solid') {
            px = p.gx + Math.sin(tm * 2 + p.ph) * 1.6;
            py = p.gy + Math.cos(tm * 2 + p.ph) * 1.6;
          } else if (phaseState === 'liquid' || phaseState === 'triple') {
            p.x += Math.sin(tm + p.ph) * 1.0;
            p.y += Math.cos(tm * 0.9 + p.ph) * 0.8;
            if (p.x < 46) p.x = 264;
            if (p.x > 264) p.x = 46;
            if (p.y < 88) p.y = 95;
            if (p.y > 160) p.y = 155;
            px = p.x; py = p.y;
          } else {
            const sp = phaseState === 'critical' ? 2.1 : 1.4;
            p.x += p.vx * sp;
            p.y += p.vy * sp;
            if (p.x < 42 || p.x > 268) p.vx *= -1;
            if (p.y < 30 || p.y > 160) p.vy *= -1;
            px = p.x; py = p.y;
          }
          ctx.beginPath();
          ctx.arc(px, py, 7, 0, Math.PI * 2);
          ctx.fillStyle = phaseState === 'solid' ? pal.primary : (phaseState === 'gas' || phaseState === 'critical') ? pal.accent : pal.secondary;
          ctx.fill();
        });

        // Right: Phase diagram curves + live dot
        const ox = 335, oy = 158, w = 250, h = 135;
        ctx.strokeStyle = pal.ink;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ox, oy - h);
        ctx.lineTo(ox, oy);
        ctx.lineTo(ox + w, oy);
        ctx.stroke();

        // Phase lines meeting at triple point (tx, ty)
        const tx = ox + 55, ty = oy - 34;
        ctx.strokeStyle = pal.primary;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(ox + 6, oy - 6); ctx.lineTo(tx, ty);
        ctx.moveTo(tx, ty); ctx.lineTo(tx - 10, oy - h + 8);
        ctx.moveTo(tx, ty); ctx.quadraticCurveTo(ox + 150, oy - 65, ox + 210, oy - 115);
        ctx.stroke();

        ctx.fillStyle = pal.muted;
        ctx.font = 'bold 12px Tajawal, sans-serif';
        ctx.fillText('صلب', ox + 24, oy - 95);
        ctx.fillText('سائل', ox + 108, oy - 98);
        ctx.fillText('بخار', ox + 178, oy - 25);

        const dotX = Math.min(ox + w - 8, Math.max(ox + 8, ox + ((T + 20) / 420) * (w - 16)));
        const dotY = Math.max(oy - h + 8, Math.min(oy - 8, oy - (P / 230) * (h - 16)));
        ctx.beginPath();
        ctx.arc(dotX, dotY, 7 + Math.sin(tm * 2) * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = pal.accent;
        ctx.fill();
        ctx.strokeStyle = pal.surface;
        ctx.lineWidth = 2;
        ctx.stroke();

        requestAnimationFrame(drawPhase);
      }
      requestAnimationFrame(drawPhase);
    } else if (simType === 'gas-laws') {
      const controls = el('div', { className: 'sim-controls' });
      const lawSel = el('select', { className: 'btn btn-sm', 'aria-label': 'اختر القانون' });
      [
        { v: 'boyle', t: 'قانون بويل (ثبوت T): P و V عكسياً' },
        { v: 'charles', t: 'قانون شارل (ثبوت P): V و T(K) طردياً' },
        { v: 'gay', t: 'قانون جاي-لوساك (ثبوت V): P و T(K) طردياً' }
      ].forEach(function (o) { lawSel.appendChild(el('option', { value: o.v, text: o.t })); });

      const slider = el('input', { type: 'range', min: '1', max: '5', step: '0.25', value: '2', 'aria-label': 'قيمة المتغير المستقل' });
      const sliderVal = el('span', { className: 'page-ref' });
      controls.appendChild(lawSel);
      controls.appendChild(el('label', { text: 'المتغير: ' }, [slider, sliderVal]));

      const canvasWrap = el('div', { className: 'sim-canvas-wrap' });
      const canvas = el('canvas', { width: '620', height: '195' });
      const readout = el('div', { className: 'sim-readout' });
      canvasWrap.appendChild(canvas);
      canvasWrap.appendChild(readout);
      box.appendChild(controls);
      box.appendChild(canvasWrap);

      const ctx = canvas.getContext('2d');
      const gPts = Array.from({ length: 28 }, function () {
        return { u: Math.random(), v: Math.random(), a: Math.random() * Math.PI * 2 };
      });
      let state = { p: 2, v: 5, tK: 300, cylW: 260 };

      function update() {
        const law = lawSel.value;
        const x = Number(slider.value);
        let p = 1, v = 10, tK = 300;
        if (law === 'boyle') {
          p = x; v = 10 / p;
          sliderVal.textContent = ' P = ' + p.toFixed(2) + ' atm';
          readout.innerHTML = 'قانون بويل: <span class="chem">P₁V₁ = P₂V₂ = 10 atm·L</span> ← الحجم الجديد <span class="chem">V = ' + v.toFixed(2) + ' L</span>';
        } else if (law === 'charles') {
          tK = Math.round(x * 150); v = (tK / 150) * 2.4;
          sliderVal.textContent = ' T = ' + tK + ' K';
          readout.innerHTML = 'قانون شارل: <span class="chem">V₁/T₁ = V₂/T₂</span> ← الحجم عند ' + tK + ' K يساوي <span class="chem">' + v.toFixed(1) + ' L</span>';
        } else {
          tK = Math.round(x * 150); p = (tK / 150) * 1.5; v = 6;
          sliderVal.textContent = ' T = ' + tK + ' K';
          readout.innerHTML = 'جاي-لوساك: <span class="chem">P₁/T₁ = P₂/T₂</span> ← الضغط عند ' + tK + ' K يساوي <span class="chem">' + p.toFixed(2) + ' atm</span> (الحجم ثابت)';
        }
        state = { p: p, v: v, tK: tK, cylW: Math.min(480, Math.max(95, v * 44)) };
      }
      lawSel.addEventListener('change', update);
      slider.addEventListener('input', update);
      update();

      function animateCylinder() {
        if (!document.body.contains(canvas)) return;
        const pal = themePalette();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const x0 = 40, y0 = 24, ch = 122, cw = state.cylW;
        ctx.fillStyle = pal.tint;
        ctx.fillRect(x0, y0, cw, ch);
        ctx.strokeStyle = pal.primary;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(x0 + 500, y0);
        ctx.lineTo(x0, y0);
        ctx.lineTo(x0, y0 + ch);
        ctx.lineTo(x0 + 500, y0 + ch);
        ctx.stroke();

        // Metallic moving piston + rod
        ctx.fillStyle = pal.accent;
        ctx.fillRect(x0 + cw, y0 - 4, 14, ch + 8);
        ctx.fillRect(x0 + cw + 14, y0 + ch / 2 - 5, Math.max(20, 520 - cw), 10);

        const heat = Math.min(1, Math.max(0, (state.tK - 150) / 600));
        const speed = 0.008 * Math.sqrt(state.tK / 300);
        gPts.forEach(function (pt) {
          pt.u += Math.cos(pt.a) * speed * (320 / cw);
          pt.v += Math.sin(pt.a) * speed * 1.8;
          if (pt.u < 0) { pt.u = -pt.u; pt.a = Math.PI - pt.a; }
          if (pt.u > 1) { pt.u = 2 - pt.u; pt.a = Math.PI - pt.a; }
          if (pt.v < 0) { pt.v = -pt.v; pt.a = -pt.a; }
          if (pt.v > 1) { pt.v = 2 - pt.v; pt.a = -pt.a; }
          ctx.beginPath();
          ctx.arc(x0 + 10 + pt.u * (cw - 20), y0 + 10 + pt.v * (ch - 20), 6.5, 0, Math.PI * 2);
          ctx.fillStyle = heat > 0.45 ? pal.accent : pal.primary;
          ctx.fill();
        });

        ctx.fillStyle = pal.ink;
        ctx.font = 'bold 15px Tajawal, sans-serif';
        ctx.fillText('P = ' + state.p.toFixed(2) + ' atm   |   V = ' + state.v.toFixed(2) + ' L   |   T = ' + state.tK + ' K', 42, 178);
        requestAnimationFrame(animateCylinder);
      }
      requestAnimationFrame(animateCylinder);
    } else if (simType === 'ideal-gas') {
      const controls = el('div', { className: 'sim-controls' });
      const pIn = el('input', { type: 'number', step: '0.2', min: '0.2', max: '10', value: '1.5', className: 'btn btn-sm', style: 'width:90px', 'aria-label': 'الضغط atm' });
      const vIn = el('input', { type: 'number', step: '0.5', min: '1', max: '15', value: '3.0', className: 'btn btn-sm', style: 'width:90px', 'aria-label': 'الحجم L' });
      const tIn = el('input', { type: 'number', step: '10', min: '-150', max: '400', value: '27', className: 'btn btn-sm', style: 'width:90px', 'aria-label': 'الحرارة C' });
      controls.appendChild(el('label', { text: 'P (atm): ' }, [pIn]));
      controls.appendChild(el('label', { text: 'V (L): ' }, [vIn]));
      controls.appendChild(el('label', { text: 'T (°C): ' }, [tIn]));
      const canvasWrap = el('div', { className: 'sim-canvas-wrap' });
      const canvas = el('canvas', { width: '620', height: '175' });
      const readout = el('div', { className: 'sim-readout' });
      canvasWrap.appendChild(canvas);
      canvasWrap.appendChild(readout);
      box.appendChild(controls);
      box.appendChild(canvasWrap);

      let nMoles = 0.18, tempK = 300, volL = 3;
      const dots = Array.from({ length: 48 }, function () {
        return { x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.02, vy: (Math.random() - 0.5) * 0.025 };
      });
      function calc() {
        const P = Math.max(0.1, parseFloat(pIn.value) || 0.5);
        const V = Math.max(0.5, parseFloat(vIn.value) || 1);
        const Tc = parseFloat(tIn.value);
        const Tk = (isNaN(Tc) ? 27 : Tc) + 273;
        if (Tk <= 0) {
          readout.textContent = 'درجة الحرارة بالكلفن يجب أن تكون أكبر من الصفر المطلق (0 K).';
          return;
        }
        volL = V; tempK = Tk;
        nMoles = (P * V) / (0.0821 * Tk);
        readout.innerHTML = 'بالتحويل <span class="chem">T = ' + Tk + ' K</span> ← عدد المولات <span class="chem">n = PV / RT = ' + nMoles.toFixed(3) + ' mol</span>';
      }
      [pIn, vIn, tIn].forEach(function (i) { i.addEventListener('input', calc); });
      calc();

      const ctx = canvas.getContext('2d');
      function drawIdeal() {
        if (!document.body.contains(canvas)) return;
        const pal = themePalette();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const boxW = Math.min(540, Math.max(160, volL * 52 + 120));
        const bx = (canvas.width - boxW) / 2;
        ctx.fillStyle = pal.tint;
        ctx.fillRect(bx, 16, boxW, 136);
        ctx.strokeStyle = pal.primary;
        ctx.lineWidth = 3;
        ctx.strokeRect(bx, 16, boxW, 136);

        const activeCount = Math.min(48, Math.max(4, Math.round(nMoles * 65)));
        const sp = Math.sqrt(Math.max(50, tempK) / 300);
        for (let i = 0; i < activeCount; i++) {
          const d = dots[i];
          d.x += d.vx * sp;
          d.y += d.vy * sp;
          if (d.x < 0.03 || d.x > 0.97) d.vx *= -1;
          if (d.y < 0.06 || d.y > 0.94) d.vy *= -1;
          ctx.beginPath();
          ctx.arc(bx + d.x * boxW, 16 + d.y * 136, 6, 0, Math.PI * 2);
          ctx.fillStyle = tempK > 380 ? pal.accent : pal.secondary;
          ctx.fill();
        }
        ctx.fillStyle = pal.ink;
        ctx.font = 'bold 14px Tajawal, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('عدد الجسيمات المرئية يتناسب مع n = ' + nMoles.toFixed(3) + ' mol', canvas.width / 2, 168);
        requestAnimationFrame(drawIdeal);
      }
      requestAnimationFrame(drawIdeal);
    } else if (simType === 'gas-stoich') {
      const controls = el('div', { className: 'sim-controls' });
      const n2In = el('input', { type: 'range', min: '1', max: '10', step: '0.5', value: '5', 'aria-label': 'حجم غاز النيتروجين باللتر' });
      const readout = el('div', { className: 'sim-readout' });
      const canvasWrap = el('div', { className: 'sim-canvas-wrap' });
      const canvas = el('canvas', { width: '620', height: '165' });
      canvasWrap.appendChild(canvas);
      canvasWrap.appendChild(readout);

      let vN2 = 5, reacted = false;
      const reactBtn = el('button', { type: 'button', className: 'btn btn-sm btn-primary', text: 'أجري التفاعل في الوعاء ⚡' });
      function update() {
        vN2 = Number(n2In.value);
        readout.innerHTML = (reacted ? '✅ نتج ' : 'المتوقع: ') + '<span class="chem">' + vN2 + ' L N₂</span> يتفاعل مع <span class="chem">' + (vN2 * 3) + ' L H₂</span> لإنتاج <span class="chem">' + (vN2 * 2) + ' L NH₃</span> (النسبة الحجمية 1 : 3 : 2)';
      }
      n2In.addEventListener('input', function () { reacted = false; reactBtn.textContent = 'أجري التفاعل في الوعاء ⚡'; update(); });
      reactBtn.addEventListener('click', function () {
        reacted = !reacted;
        reactBtn.textContent = reacted ? 'إعادة المتفاعلات ↺' : 'أجري التفاعل في الوعاء ⚡';
        update();
      });
      update();
      controls.appendChild(el('label', { text: 'حجم N₂ (باللتر): ' }, [n2In]));
      controls.appendChild(reactBtn);
      box.appendChild(controls);
      box.appendChild(canvasWrap);

      const ctx = canvas.getContext('2d');
      let t = 0;
      function drawStoich() {
        if (!document.body.contains(canvas)) return;
        t += 0.06;
        const pal = themePalette();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const bars = [
          { x: 48, lbl: 'N₂ (' + vN2 + ' L)', w: 90, count: reacted ? 1 : 4, col: pal.primary },
          { x: 185, lbl: '3H₂ (' + (vN2 * 3) + ' L)', w: 165, count: reacted ? 2 : 12, col: pal.accent },
          { x: 425, lbl: '2NH₃ (' + (vN2 * 2) + ' L)', w: 140, count: reacted ? 14 : 4, col: pal.secondary }
        ];
        bars.forEach(function (b) {
          ctx.fillStyle = pal.tint;
          ctx.fillRect(b.x, 22, b.w, 108);
          ctx.strokeStyle = b.col;
          ctx.lineWidth = 2.5;
          ctx.strokeRect(b.x, 22, b.w, 108);
          for (let i = 0; i < b.count; i++) {
            const mx = b.x + 18 + ((i * 29 + Math.sin(t + i) * 9) % (b.w - 30));
            const my = 40 + ((i * 23 + Math.cos(t * 1.2 + i) * 8) % 72);
            ctx.beginPath();
            ctx.arc(mx, my, 6.5, 0, Math.PI * 2);
            ctx.fillStyle = b.col;
            ctx.fill();
          }
          ctx.fillStyle = pal.ink;
          ctx.font = 'bold 14px Tajawal, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(b.lbl, b.x + b.w / 2, 150);
        });
        ctx.fillStyle = pal.ink;
        ctx.font = 'bold 24px Tajawal, sans-serif';
        ctx.fillText('+', 162, 82);
        ctx.fillText('→', 388, 82);
        requestAnimationFrame(drawStoich);
      }
      requestAnimationFrame(drawStoich);
    } else if (simType === 'galvanic-cell') {
      const halfCells = [
        { name: 'Mg²⁺ | Mg', e: -2.372, ion: 'Mg²⁺', metal: 'Mg', col: '#9BA5B4' },
        { name: 'Zn²⁺ | Zn', e: -0.762, ion: 'Zn²⁺', metal: 'Zn', col: '#7A8899' },
        { name: 'Fe²⁺ | Fe', e: -0.447, ion: 'Fe²⁺', metal: 'Fe', col: '#636B78' },
        { name: 'Sn²⁺ | Sn', e: -0.137, ion: 'Sn²⁺', metal: 'Sn', col: '#A8B0BC' },
        { name: 'Cu²⁺ | Cu', e: +0.342, ion: 'Cu²⁺', metal: 'Cu', col: '#C87533' },
        { name: 'Ag⁺ | Ag', e: +0.800, ion: 'Ag⁺', metal: 'Ag', col: '#CBD2DC' }
      ];
      const controls = el('div', { className: 'sim-controls' });
      const sel1 = el('select', { className: 'btn btn-sm', 'aria-label': 'نصف الخلية الأول' });
      const sel2 = el('select', { className: 'btn btn-sm', 'aria-label': 'نصف الخلية الثاني' });
      halfCells.forEach(function (h, i) {
        sel1.appendChild(el('option', { value: String(i), text: h.name + ' (' + (h.e >= 0 ? '+' : '') + h.e + ' V)' }));
        sel2.appendChild(el('option', { value: String(i), text: h.name + ' (' + (h.e >= 0 ? '+' : '') + h.e + ' V)' }));
      });
      sel1.value = '1';
      sel2.value = '4';
      let running = true;
      const runBtn = el('button', { type: 'button', className: 'btn btn-sm btn-primary', text: 'إيقاف الدائرة' });
      controls.appendChild(el('label', { text: 'القطب 1: ' }, [sel1]));
      controls.appendChild(el('label', { text: 'القطب 2: ' }, [sel2]));
      controls.appendChild(runBtn);

      const svgWrap = el('div', { className: 'sim-canvas-wrap' });
      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('viewBox', '0 0 640 220');
      svg.setAttribute('class', 'sim-svg-stage');
      const readout = el('div', { className: 'sim-readout' });
      svgWrap.appendChild(svg);
      svgWrap.appendChild(readout);
      box.appendChild(controls);
      box.appendChild(svgWrap);

      function update() {
        const a = halfCells[Number(sel1.value)];
        const b = halfCells[Number(sel2.value)];
        if (a.metal === b.metal) {
          svg.innerHTML = '';
          readout.textContent = 'اختر قطبين مختلفين لتكوين خلية جلفانية ذات فرق جهد.';
          return;
        }
        const cathode = a.e >= b.e ? a : b;
        const anode = a.e >= b.e ? b : a;
        const eCell = cathode.e - anode.e;
        const flowCls = running ? 'anim-wire-flow' : '';
        svg.innerHTML =
          '<path d="M160 88 V30 H480 V88" fill="none" stroke="var(--text)" stroke-width="4"/>' +
          '<path d="M160 88 V30 H480 V88" fill="none" stroke="var(--accent)" stroke-width="4" class="' + flowCls + '"/>' +
          '<path d="M210 148 V98 H430 V148" fill="none" stroke="var(--primary)" stroke-width="18" stroke-linecap="round" opacity="0.35"/>' +
          '<text x="320" y="90" text-anchor="middle" font-size="13" font-weight="800" fill="var(--primary)">القنطرة الملحية (حركة الأيونات)</text>' +
          '<rect x="70" y="112" width="180" height="92" rx="12" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="3"/>' +
          '<rect x="74" y="135" width="172" height="65" rx="9" fill="var(--accent-bg)"/>' +
          '<rect x="390" y="112" width="180" height="92" rx="12" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="3"/>' +
          '<rect x="394" y="135" width="172" height="65" rx="9" fill="var(--surface-tint)"/>' +
          '<rect x="148" y="84" width="24" height="104" rx="4" fill="' + anode.col + '"/>' +
          '<rect x="468" y="84" width="24" height="104" rx="4" fill="' + cathode.col + '"/>' +
          '<text x="160" y="176" text-anchor="middle" font-size="14" font-weight="800" fill="var(--text)">الأنود (-): ' + anode.metal + '</text>' +
          '<text x="480" y="176" text-anchor="middle" font-size="14" font-weight="800" fill="var(--text)">الكاثود (+): ' + cathode.metal + '</text>' +
          '<circle cx="320" cy="30" r="24" fill="var(--surface)" stroke="var(--primary)" stroke-width="3"/>' +
          '<text x="320" y="35" text-anchor="middle" direction="ltr" font-size="13" font-weight="900" fill="var(--primary)">+' + eCell.toFixed(2) + ' V</text>' +
          (running ? '<circle cx="245" cy="30" r="5" fill="var(--accent)" class="anim-pulse"/><circle cx="395" cy="30" r="5" fill="var(--accent)" class="anim-pulse"/>' : '');

        readout.innerHTML =
          'الأنود (أكسدة): <span class="chem">' + anode.metal + ' → ' + anode.ion + '</span> · الكاثود (اختزال): <span class="chem">' + cathode.ion + ' → ' + cathode.metal + '</span> · الجهد القياسي <span class="chem">E°cell = +' + eCell.toFixed(3) + ' V</span>';
      }
      runBtn.addEventListener('click', function () {
        running = !running;
        runBtn.textContent = running ? 'إيقاف الدائرة' : 'تشغيل الدائرة';
        update();
      });
      sel1.addEventListener('change', update);
      sel2.addEventListener('change', update);
      update();
    } else if (simType === 'batteries-compare') {
      const items = [
        { k: 'الخلية الجافة (1.5V)', mode: 'battery', volt: '1.5 V', title: 'خارصين (أنود) + كربون/MnO₂', txt: 'أولية (لا تُشحن) · الأنود: الخارصين Zn · الكاثود غير الفعال: عمود الجرافيت في عجينة MnO₂ وNH₄Cl وZnCl₂ · الجهد: 1.5 V.' },
        { k: 'المركم الرصاصي (12V)', mode: 'battery', volt: '12 V', title: '6 خلايا × 2V في H₂SO₄', txt: 'ثانوية (تُشحن) · 6 خلايا × 2V = 12V · الأنود Pb والكاثود PbO₂ في محلول H₂SO₄.' },
        { k: 'خلية الوقود H₂/O₂', mode: 'fuel', volt: '1.23 V', title: 'وقود H₂ + O₂ → ماء نقي H₂O', txt: 'خلية الوقود (H₂/O₂) تزود بوقود خارجي باستمرار فتُنتج كهرباء وماءً نقياً دون تلوث.' },
        { k: 'الحماية المهبطية / الجلفنة', mode: 'protect', volt: 'Zn / Mg', title: 'الفلز الأنشط يتأكسد لحماية الحديد Fe', txt: 'يُوصل الحديد بفلز أنشط (المغنيسيوم Mg أو الخارصين Zn) فيتأكسد الفلز المضحي بدلاً من الحديد.' }
      ];
      const controls = el('div', { className: 'sim-controls' });
      const wrap = el('div', { className: 'sim-canvas-wrap' });
      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('viewBox', '0 0 600 165');
      svg.setAttribute('class', 'sim-svg-stage');
      const readout = el('div', { className: 'sim-readout' });
      wrap.appendChild(svg);
      wrap.appendChild(readout);
      box.appendChild(controls);
      box.appendChild(wrap);

      function renderBat(idx) {
        const it = items[idx];
        controls.querySelectorAll('button').forEach(function (btn, i) { btn.classList.toggle('btn-primary', i === idx); });
        readout.textContent = it.txt;
        if (it.mode === 'protect') {
          svg.innerHTML =
            '<rect x="90" y="54" width="160" height="60" rx="12" fill="var(--accent-bg)" stroke="var(--accent)" stroke-width="3"/>' +
            '<text x="170" y="90" text-anchor="middle" font-size="16" font-weight="800" fill="var(--accent)">أنود مضحّي (Zn / Mg)</text>' +
            '<path d="M250 84 H355" stroke="var(--primary)" stroke-width="5" class="anim-wire-flow"/>' +
            '<rect x="355" y="54" width="160" height="60" rx="12" fill="var(--success-bg)" stroke="var(--success)" stroke-width="3"/>' +
            '<text x="435" y="90" text-anchor="middle" font-size="16" font-weight="800" fill="var(--success)">أنبوب حديد Fe (محمي)</text>' +
            '<text x="302" y="68" text-anchor="middle" font-size="13" font-weight="800" fill="var(--primary)">تتدفق الإلكترونات e⁻</text>' +
            '<text x="300" y="146" text-anchor="middle" font-size="14" font-weight="700" fill="var(--text)">' + it.title + '</text>';
        } else {
          svg.innerHTML =
            '<rect x="115" y="45" width="145" height="75" rx="12" fill="var(--surface-tint)" stroke="var(--primary)" stroke-width="3"/>' +
            '<rect x="260" y="68" width="12" height="28" rx="3" fill="var(--primary)"/>' +
            '<text x="187" y="88" text-anchor="middle" font-size="20" font-weight="900" fill="var(--primary)">' + it.volt + '</text>' +
            '<path d="M272 74 H410 V92 H272" fill="none" stroke="var(--accent)" stroke-width="4" class="anim-wire-flow"/>' +
            '<circle cx="435" cy="83" r="24" fill="var(--accent-bg)" stroke="var(--accent)" stroke-width="3" class="anim-pulse"/>' +
            '<text x="435" y="88" text-anchor="middle" font-size="15" font-weight="900" fill="var(--accent)">⚡ حمل</text>' +
            '<text x="300" y="148" text-anchor="middle" font-size="14" font-weight="700" fill="var(--text)">' + it.title + '</text>';
        }
      }
      items.forEach(function (it, i) {
        const b = el('button', { type: 'button', className: 'btn btn-sm', text: it.k });
        b.addEventListener('click', function () { renderBat(i); });
        controls.appendChild(b);
      });
      renderBat(0);
    } else if (simType === 'electrolysis-cells') {
      const items = [
        { k: 'مصهور NaCl (خلية داون)', gas: 'Cl₂', prod: 'Na', txt: 'الأنود (+): أكسدة 2Cl⁻ → Cl₂(g) + 2e⁻ | الكاثود (-): اختزال Na⁺ + e⁻ → Na(l) | الناتج: فلز الصوديوم وغاز الكلور.' },
        { k: 'ماء البحر NaCl(aq)', gas: 'Cl₂ + H₂', prod: 'NaOH', txt: 'لا يترسب الصوديوم لأن اختزال الماء أسهل عند الكاثود فينتج H₂ وNaOH، وعند الأنود يتأكسد الكلوريد إلى Cl₂.' },
        { k: 'هول-هيروليت (Al)', gas: 'CO₂ / O₂', prod: 'Al', txt: 'يُستخلص الألومنيوم المنصهر عند الكاثود، وتُعاد تدويره لأنه يستهلك طاقة كهربائية عالية جداً.' },
        { k: 'الطلاء الكهربائي بالفضة', gas: 'Ag⁺', prod: 'Ag', txt: 'يوضع الجسم المراد طلاؤه (مثل مفتاح أو ملعقة) عند الكاثود (-)، وقطب الفضة النقية عند الأنود (+).' }
      ];
      const controls = el('div', { className: 'sim-controls' });
      const wrap = el('div', { className: 'sim-canvas-wrap' });
      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('viewBox', '0 0 600 180');
      svg.setAttribute('class', 'sim-svg-stage');
      const readout = el('div', { className: 'sim-readout' });
      wrap.appendChild(svg);
      wrap.appendChild(readout);
      box.appendChild(controls);
      box.appendChild(wrap);

      function renderElec(idx) {
        const it = items[idx];
        controls.querySelectorAll('button').forEach(function (btn, i) { btn.classList.toggle('btn-primary', i === idx); });
        readout.textContent = it.txt;
        svg.innerHTML =
          '<path d="M180 70 V26 H420 V70" fill="none" stroke="var(--accent)" stroke-width="4" class="anim-wire-flow"/>' +
          '<rect x="260" y="12" width="80" height="28" rx="8" fill="var(--primary)"/>' +
          '<text x="300" y="31" text-anchor="middle" font-size="13" font-weight="800" fill="var(--primary-contrast)">مصدر DC ⚡</text>' +
          '<rect x="130" y="64" width="340" height="104" rx="14" fill="var(--surface-tint)" stroke="var(--border-strong)" stroke-width="3"/>' +
          '<rect x="168" y="54" width="24" height="92" rx="4" fill="var(--accent)"/>' +
          '<rect x="408" y="54" width="24" height="92" rx="4" fill="var(--secondary)"/>' +
          '<circle cx="180" cy="115" r="5" fill="var(--surface)" class="anim-bubble-1"/>' +
          '<circle cx="196" cy="126" r="4" fill="var(--surface)" class="anim-bubble-2"/>' +
          '<circle cx="420" cy="115" r="5" fill="var(--surface)" class="anim-bubble-3"/>' +
          '<text x="180" y="160" text-anchor="middle" font-size="14" font-weight="800" fill="var(--accent)">الأنود (+): ' + it.gas + '</text>' +
          '<text x="420" y="160" text-anchor="middle" font-size="14" font-weight="800" fill="var(--secondary)">الكاثود (-): ' + it.prod + '</text>';
      }
      items.forEach(function (it, i) {
        const b = el('button', { type: 'button', className: 'btn btn-sm', text: it.k });
        b.addEventListener('click', function () { renderElec(i); });
        controls.appendChild(b);
      });
      renderElec(0);
    }
    return box;
  }

  function createQuizSlideNode(q, qIdx, totalCount, quizState, quizType, lessonId) {
    const wrap = el('div');
    const liveBar = el('div', { className: 'quiz-live-bar' });
    const scoreLbl = el('strong');
    const resetBtn = el('button', { type: 'button', className: 'btn btn-sm', text: 'إعادة الاختبار' });

    function countCorrect() {
      let c = 0, a = 0;
      quizState.questions.forEach(function (item, idx) {
        if (quizState.answers[idx] !== undefined) {
          a++;
          if (quizState.answers[idx] === item.answer) c++;
        }
      });
      return { correct: c, answered: a };
    }

    function updateBar() {
      const res = countCorrect();
      scoreLbl.textContent = 'النتيجة المباشرة: ' + res.correct + ' / ' + totalCount + ' (أُجيب على ' + res.answered + ')';
      if (quizType === 'final' && res.answered > 0 && window.CHEM_PORTAL) {
        window.CHEM_PORTAL.saveLessonScore(lessonId, res.correct, totalCount);
      }
    }

    const qText = el('p', { className: 'quiz-q-text', html: q.q });
    const optsWrap = el('div', { className: 'quiz-options' });
    const feedback = el('div', { className: 'quiz-feedback', hidden: '' });

    function paintQuestion() {
      const picked = quizState.answers[qIdx];
      optsWrap.querySelectorAll('button').forEach(function (b, oIdx) {
        b.classList.remove('correct', 'wrong');
        if (picked !== undefined) {
          if (oIdx === q.answer) b.classList.add('correct');
          else if (oIdx === picked && picked !== q.answer) b.classList.add('wrong');
        }
      });
      if (picked !== undefined) {
        const isOk = picked === q.answer;
        feedback.hidden = false;
        feedback.className = 'quiz-feedback ' + (isOk ? 'ok' : 'err');
        feedback.innerHTML = (isOk ? '<strong>إجابة صحيحة! </strong>' : '<strong>إجابة غير صحيحة · التفسير: </strong>') + q.explain;
      } else {
        feedback.hidden = true;
      }
      updateBar();
    }

    function confettiBurst() {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      let cv = document.getElementById('confettiCanvas');
      if (!cv) {
        cv = el('canvas', { id: 'confettiCanvas', className: 'confetti-canvas', 'aria-hidden': 'true' });
        document.body.appendChild(cv);
      }
      cv.width = window.innerWidth;
      cv.height = window.innerHeight;
      const cx = cv.getContext('2d');
      const colors = ['#e4572e', '#ffc93c', '#2a7de1', '#7c5ce6', '#0b8a4a'];
      const parts = Array.from({ length: 70 }, function (_, i) {
        return {
          x: Math.random() * cv.width,
          y: -15 - Math.random() * cv.height * 0.25,
          vx: (Math.random() - 0.5) * 5,
          vy: 2.5 + Math.random() * 4.5,
          rot: Math.random() * 6.28,
          sz: 6 + Math.random() * 7,
          col: colors[i % colors.length]
        };
      });
      function draw() {
        cx.clearRect(0, 0, cv.width, cv.height);
        for (let i = parts.length - 1; i >= 0; i--) {
          const p = parts[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.08;
          p.rot += 0.12;
          cx.save();
          cx.translate(p.x, p.y);
          cx.rotate(p.rot);
          cx.fillStyle = p.col;
          cx.fillRect(-p.sz / 2, -p.sz / 4, p.sz, p.sz / 2);
          cx.restore();
          if (p.y > cv.height + 24) parts.splice(i, 1);
        }
        if (parts.length > 0) requestAnimationFrame(draw);
        else cx.clearRect(0, 0, cv.width, cv.height);
      }
      requestAnimationFrame(draw);
    }

    q.options.forEach(function (optHtml, oIdx) {
      const btn = el('button', { type: 'button', className: 'quiz-option-btn' });
      btn.innerHTML = '<span>' + ['أ', 'ب', 'ج', 'د'][oIdx] + ')</span> <span>' + optHtml + '</span>';
      btn.addEventListener('click', function () {
        const firstPick = quizState.answers[qIdx] === undefined;
        quizState.answers[qIdx] = oIdx;
        paintQuestion();
        if (firstPick && oIdx === q.answer) confettiBurst();
      });
      optsWrap.appendChild(btn);
    });

    resetBtn.addEventListener('click', function () {
      quizState.answers = {};
      paintQuestion();
    });

    liveBar.appendChild(scoreLbl);
    liveBar.appendChild(resetBtn);
    wrap.appendChild(liveBar);
    wrap.appendChild(qText);
    wrap.appendChild(optsWrap);
    wrap.appendChild(feedback);

    paintQuestion();
    return wrap;
  }

  function buildSlides(lesson) {
    const slides = [];
    const simTitles = {
      'states-particles': 'محاكاة: حركة الجسيمات (صلب · سائل · غاز)',
      'graham-gas': 'محاكاة: قانون جراهام للانتشار والتدفق',
      'imf-compare': 'مستكشف القوى بين الجزيئات ودرجة الغليان',
      'phase-diagram': 'مستكشف مخطط الطور للماء',
      'gas-laws': 'محاكاة قوانين الغازات (بويل · شارل · جاي-لوساك)',
      'ideal-gas': 'حاسبة قانون الغاز المثالي',
      'gas-stoich': 'حاسبة النسب الحجمية للتفاعلات الغازية',
      'galvanic-cell': 'محاكاة الخلية الجلفانية وحساب الجهد',
      'batteries-compare': 'مستكشف البطاريات وحماية الفلزات',
      'electrolysis-cells': 'مستكشف تطبيقات التحليل الكهربائي'
    };

    slides.push({
      sectionId: 'goals',
      tone: 'goals',
      sectionLabel: 'الأهداف والتركيز',
      title: 'الفكرة الرئيسة والأهداف',
      render: function () {
        const frag = document.createDocumentFragment();
        frag.appendChild(el('div', { className: 'main-idea-box' }, [
          el('span', { className: 'main-idea-label', text: 'الفكرة الرئيسة' }),
          el('p', { className: 'main-idea-text', html: lesson.mainIdea })
        ]));
        const list = el('ul', { className: 'clean-list' });
        lesson.objectives.forEach(function (o) { list.appendChild(el('li', { html: o })); });
        frag.appendChild(el('h3', { style: 'margin:0 0 0.5rem; color:var(--primary);', text: 'أهداف الدرس' }));
        frag.appendChild(list);
        return frag;
      }
    });

    if (lesson.studentHook) {
      slides.push({
        sectionId: 'goals',
        tone: 'hook',
        sectionLabel: 'تهيئة من حياة الطالبة',
        title: 'تهيئة من حياتك اليومية',
        badge: 'اربطيها بحياتك',
        render: function () {
          const hk = lesson.studentHook;
          const ansBox = el('div', { className: 'reveal-box', hidden: '', html: '<strong>التفسير العلمي:</strong> ' + hk.answer });
          const ansBtn = el('button', { type: 'button', className: 'btn btn-sm btn-primary', text: 'اكتشفي التفسير' });
          ansBtn.addEventListener('click', function () {
            const open = ansBox.hidden;
            ansBox.hidden = !open;
            ansBtn.textContent = open ? 'إخفاء التفسير' : 'اكتشفي التفسير';
          });
          return el('div', { className: 'hook-hero-card' }, [
            el('p', { className: 'hook-scenario', html: hk.scenario }),
            el('div', { className: 'hook-question-box' }, [
              el('div', { className: 'focus-card-header' }, [
                el('span', { className: 'focus-badge', text: 'توقعي وفكري' }),
                ansBtn
              ]),
              el('p', { style: 'margin:0; font-weight:800; font-size:1.12rem;', html: hk.question }),
              ansBox
            ])
          ]);
        }
      });
    }

    slides.push({
      sectionId: 'goals',
      tone: 'goals',
      sectionLabel: 'الأهداف والتركيز',
      title: 'شريحة التركيز والمفردات الجديدة',
      render: function () {
        const frag = document.createDocumentFragment();
        const revealBox = el('div', { className: 'reveal-box', hidden: '', html: '<strong>التفسير العلمي:</strong> ' + lesson.focus.answer });
        const revealBtn = el('button', { type: 'button', className: 'btn btn-sm', text: 'اعرض التفسير العلمي' });
        revealBtn.addEventListener('click', function () {
          const open = revealBox.hidden;
          revealBox.hidden = !open;
          revealBtn.textContent = open ? 'إخفاء التفسير' : 'اعرض التفسير العلمي';
        });
        frag.appendChild(el('div', { className: 'focus-card' }, [
          el('div', { className: 'focus-card-header' }, [
            el('span', { className: 'focus-badge', text: 'سؤال التهيئة والتركيز' }),
            revealBtn
          ]),
          el('p', { style: 'margin:0; font-weight:700; font-size:1.15rem;', html: lesson.focus.prompt }),
          revealBox
        ]));
        if (window.createVocabFlashcards) {
          frag.appendChild(window.createVocabFlashcards(lesson.vocab, { compact: true }));
        } else {
          frag.appendChild(el('h3', { style: 'margin:0.5rem 0 0.35rem; color:var(--primary); font-size:1rem;', text: 'المفردات الأساسية' }));
          const chips = el('div', { className: 'vocab-chips' });
          lesson.vocab.forEach(function (v) { chips.appendChild(el('span', { className: 'vocab-chip', html: v })); });
          frag.appendChild(chips);
        }
        return frag;
      }
    });

    const formativeState = { questions: lesson.formativeQuiz || [], answers: {} };
    const simSlot = (lesson.simulation === 'graham-gas' && lesson.concepts.length > 1) ? 1 : 0;
    const totalCycles = lesson.concepts.length;
    const strategies = lesson.strategies || [];
    const lifeLinks = lesson.lifeLinks || [];
    const fQuiz = lesson.formativeQuiz || [];

    function pushFormativeSlide(q, idx) {
      slides.push({
        sectionId: 'content',
        tone: 'formative',
        sectionLabel: 'تقويم تكويني',
        title: 'تقويم تكويني · سؤال ' + (idx + 1) + ' من ' + fQuiz.length,
        badge: 'تحقق من الفهم',
        render: function () {
          return createQuizSlideNode(q, idx, fQuiz.length, formativeState, 'formative', lesson.id);
        }
      });
    }

    const bookFigs = (window.CHEM_BOOK_FIGURES && window.CHEM_BOOK_FIGURES[lesson.id]) || [];

    lesson.concepts.forEach(function (c, cIdx) {
      const isLast = cIdx === totalCycles - 1;
      const illusHtml = window.CHEM_ILLUSTRATIONS && window.CHEM_ILLUSTRATIONS[lesson.id + '-' + cIdx];
      const bookFig = bookFigs[cIdx === 0 && totalCycles > 1 && bookFigs.length < 2 ? -1 : (bookFigs.length > 1 ? Math.min(cIdx, bookFigs.length - 1) : (isLast ? 0 : -1))];

      slides.push({
        sectionId: 'content',
        tone: 'concept',
        sectionLabel: 'شرح المفهوم ' + (cIdx + 1),
        title: c.title,
        badge: bookFig ? 'شرح + شكل من الكتاب' : (illusHtml ? 'شرح + رسم توضيحي' : lesson.pages),
        render: function () {
          const bodyNode = el('div', { className: 'concept-slide-body', html: c.bodyHtml });
          if (!illusHtml && !bookFig) return bodyNode;
          const visualCard = el('div', { className: 'concept-visual-card' });
          if (bookFig && illusHtml && window.createBookFigureCard) {
            let showBook = true;
            const swRow = el('div', { style: 'display:flex;gap:0.4rem;justify-content:center;margin-bottom:0.45rem;flex-wrap:wrap;' });
            const btnBook = el('button', { type: 'button', className: 'btn btn-sm btn-primary', text: '📖 شكل من الكتاب' });
            const btnIllus = el('button', { type: 'button', className: 'btn btn-sm', text: '🎨 رسم توضيحي' });
            const bookNode = window.createBookFigureCard(bookFig);
            const illusNode = el('div', { html: illusHtml, hidden: '' });
            function syncView() {
              bookNode.hidden = !showBook;
              illusNode.hidden = showBook;
              btnBook.classList.toggle('btn-primary', showBook);
              btnIllus.classList.toggle('btn-primary', !showBook);
            }
            btnBook.addEventListener('click', function () { showBook = true; syncView(); });
            btnIllus.addEventListener('click', function () { showBook = false; syncView(); });
            swRow.appendChild(btnBook); swRow.appendChild(btnIllus);
            visualCard.appendChild(swRow);
            visualCard.appendChild(bookNode);
            visualCard.appendChild(illusNode);
          } else if (bookFig && window.createBookFigureCard) {
            visualCard.appendChild(window.createBookFigureCard(bookFig));
          } else {
            visualCard.appendChild(el('div', { html: illusHtml }));
            visualCard.appendChild(el('span', { className: 'muted-note', style: 'font-size:0.84rem; font-weight:700;', text: 'رسم توضيحي للمفهوم' }));
          }
          return el('div', { className: 'concept-split' }, [bodyNode, visualCard]);
        }
      });

      if (cIdx === simSlot && lesson.simulation) {
        slides.push({
          sectionId: 'lab',
          tone: 'lab',
          sectionLabel: 'المعمل الافتراضي والتجربة',
          title: '🧪 المعمل الافتراضي: ' + (simTitles[lesson.simulation] || 'تجربة تفاعلية'),
          badge: 'مختبر تفاعلي متكامل',
          render: function () {
            const simNode = createSimulationNode(lesson.simulation);
            const guide = window.CHEM21_LAB_GUIDES && window.CHEM21_LAB_GUIDES[lesson.id];
            if (!guide) return simNode;

            const shell = el('div', { className: 'vlab-shell' });
            const safetyBar = el('div', { className: 'vlab-safety' });
            guide.safety.forEach(function (sf) {
              safetyBar.appendChild(el('span', { className: 'vlab-safety-pill', text: sf }));
            });
            shell.appendChild(safetyBar);

            const grid = el('div', { className: 'vlab-grid' });
            const stepsCol = el('div', { className: 'vlab-steps-col' }, [
              el('h4', { className: 'vlab-steps-title', text: '🧭 خطوات المختبر (نفّذيها بالترتيب)' })
            ]);
            const msgBox = el('div', { className: 'vlab-step-msg', text: 'ابدئي بالخطوة الأولى ثم جربي المختبر المباشر 🔬' });

            const verifyCard = el('div', { className: 'vlab-verify-card', hidden: '' }, [
              el('h4', { text: '📋 جدول القياسات والتحقق المخبري' })
            ]);

            guide.checks.forEach(function (chk) {
              const row = el('div', { className: 'vlab-check-row' });
              const lbl = el('span', { text: chk.label });
              let inputEl;
              if (chk.type === 'select') {
                inputEl = el('select', { 'aria-label': chk.label });
                chk.options.forEach(function (o) {
                  inputEl.appendChild(el('option', { value: o.v, text: o.t }));
                });
              } else {
                inputEl = el('input', { type: 'number', step: 'any', placeholder: 'أدخلي القيمة', style: 'width:110px;direction:ltr;text-align:center;' });
              }
              const chkBtn = el('button', { type: 'button', className: 'btn btn-sm btn-primary', text: 'تحقق' });
              const fb = el('span', { className: 'vlab-fb', text: '' });
              chkBtn.addEventListener('click', function () {
                if (row.classList.contains('ok')) return;
                let ok = false;
                if (chk.type === 'select') {
                  ok = inputEl.value === chk.ans;
                } else {
                  const val = parseFloat(inputEl.value);
                  ok = !isNaN(val) && Math.abs(val - chk.ans) <= (chk.tol || 0.05);
                }
                if (ok) {
                  row.classList.add('ok');
                  fb.textContent = '✅ صحيح!';
                  inputEl.disabled = true;
                  chkBtn.disabled = true;
                  playChime(784, 0.2);
                } else {
                  fb.textContent = '❌ راجعي التجربة';
                  playChime(220, 0.16);
                }
              });
              row.appendChild(lbl);
              row.appendChild(inputEl);
              row.appendChild(chkBtn);
              row.appendChild(fb);
              verifyCard.appendChild(row);
            });

            let curStep = 0;
            const stepBtns = [];
            guide.steps.forEach(function (st, idx) {
              const b = el('button', { type: 'button', className: 'vlab-step-btn', text: st.label });
              if (idx !== 0) b.disabled = true;
              b.addEventListener('click', function () {
                if (idx !== curStep) return;
                b.classList.add('done');
                b.textContent = st.label + ' ✔';
                b.disabled = true;
                msgBox.textContent = st.msg;
                playChime(520 + idx * 80, 0.14);
                curStep++;
                if (stepBtns[curStep]) {
                  stepBtns[curStep].disabled = false;
                } else {
                  verifyCard.hidden = false;
                  playChime(880, 0.24);
                }
              });
              stepBtns.push(b);
              stepsCol.appendChild(b);
            });
            stepsCol.appendChild(msgBox);

            const rightCol = el('div', { style: 'display:flex;flex-direction:column;gap:0.65rem;' }, [
              simNode,
              verifyCard
            ]);
            grid.appendChild(stepsCol);
            grid.appendChild(rightCol);
            shell.appendChild(grid);
            return shell;
          }
        });
      }

      const cycleStrategies = isLast ? strategies.slice(cIdx) : (strategies[cIdx] ? [strategies[cIdx]] : []);
      if (cycleStrategies.length) {
        slides.push({
          sectionId: 'content',
          tone: 'strategy',
          sectionLabel: 'استراتيجية التعلم النشط',
          title: 'استراتيجية التعلم النشط · المفهوم ' + (cIdx + 1),
          badge: 'خطوات واضحة للطالبة',
          render: function () {
            const grid = el('div', { className: 'spotlight-grid' });
            cycleStrategies.forEach(function (st) {
              grid.appendChild(el('div', { className: 'strategy-spotlight-card' }, [
                el('span', { className: 'discovery-tag', text: 'استراتيجية صفية' }),
                el('h4', { html: st.name }),
                el('p', { html: '<strong>آلية التطبيق:</strong> ' + st.how })
              ]));
            });
            return grid;
          }
        });
      }

      const cycleLinks = isLast ? lifeLinks.slice(cIdx) : (lifeLinks[cIdx] ? [lifeLinks[cIdx]] : []);
      if (cycleLinks.length) {
        slides.push({
          sectionId: 'content',
          tone: 'link',
          sectionLabel: 'الربط بالواقع والعلوم الأخرى',
          title: 'الربط بالواقع والعلوم الأخرى · المفهوم ' + (cIdx + 1),
          badge: 'تطبيق حياتي وعلمي',
          render: function () {
            const grid = el('div', { className: 'spotlight-grid' });
            cycleLinks.forEach(function (lk) {
              grid.appendChild(el('div', { className: 'link-spotlight-card' }, [
                el('span', { className: 'discovery-tag', style: 'color:var(--teal);', html: lk.tag }),
                el('h4', { html: lk.title }),
                el('p', { html: lk.text })
              ]));
            });
            return grid;
          }
        });
      }

      if (isLast && lesson.workedExample) {
        slides.push({
          sectionId: 'content',
          tone: 'concept',
          sectionLabel: 'مثال محلول · دعم وإثراء',
          title: 'مثال محلول · دعم وإثراء',
          render: function () {
            const frag = document.createDocumentFragment();
            const ansWrap = el('div', { className: 'reveal-box', hidden: '', html: lesson.workedExample.solutionHtml });
            const ansBtn = el('button', { type: 'button', className: 'btn btn-sm btn-primary', text: 'إظهار خطوات الحل' });
            ansBtn.addEventListener('click', function () {
              const open = ansWrap.hidden;
              ansWrap.hidden = !open;
              ansBtn.textContent = open ? 'إخفاء الحل' : 'إظهار خطوات الحل';
            });
            frag.appendChild(el('div', { className: 'strategy-card' }, [
              el('div', { style: 'display:flex; justify-content:space-between; align-items:center; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.5rem;' }, [
                el('h4', { style: 'margin:0;', html: lesson.workedExample.title }),
                ansBtn
              ]),
              el('p', { style: 'margin:0;', html: lesson.workedExample.questionHtml }),
              ansWrap
            ]));

            const scaff = el('div', { className: 'scaffolding-grid' });
            const supReveal = el('div', { className: 'reveal-box', hidden: '', html: lesson.support.detail });
            const supBtn = el('button', { type: 'button', className: 'btn btn-sm', text: 'تلميح' });
            supBtn.addEventListener('click', function () { supReveal.hidden = !supReveal.hidden; });
            scaff.appendChild(el('div', { className: 'scaffold-box support' }, [
              el('div', { className: 'scaffold-head' }, [el('span', { text: 'دعم وتبسيط' }), supBtn]),
              el('p', { style: 'margin:0;', html: lesson.support.prompt }),
              supReveal
            ]));

            const enrReveal = el('div', { className: 'reveal-box', hidden: '', html: lesson.enrichment.detail });
            const enrBtn = el('button', { type: 'button', className: 'btn btn-sm', text: 'إجابة التحدي' });
            enrBtn.addEventListener('click', function () { enrReveal.hidden = !enrReveal.hidden; });
            scaff.appendChild(el('div', { className: 'scaffold-box enrichment' }, [
              el('div', { className: 'scaffold-head' }, [el('span', { text: 'إثراء وتفكير ناقد' }), enrBtn]),
              el('p', { style: 'margin:0;', html: lesson.enrichment.prompt }),
              enrReveal
            ]));
            frag.appendChild(scaff);
            return frag;
          }
        });
      }

      if (isLast) {
        fQuiz.slice(cIdx).forEach(function (q, offset) {
          pushFormativeSlide(q, cIdx + offset);
        });
      } else if (fQuiz[cIdx]) {
        pushFormativeSlide(fQuiz[cIdx], cIdx);
      }
    });

    if (lesson.discovery && lesson.discovery.items && lesson.discovery.items.length) {
      slides.push({
        sectionId: 'content',
        tone: 'discovery',
        sectionLabel: 'إثراء علمي واكتشافات',
        title: lesson.discovery.title,
        badge: 'اكتشافات وعلماء',
        render: function () {
          const grid = el('div', { className: 'discovery-grid' });
          lesson.discovery.items.forEach(function (it) {
            grid.appendChild(el('div', { className: 'discovery-card', 'data-tone': it.tone || 'violet' }, [
              el('span', { className: 'discovery-tag', text: it.tag }),
              el('h4', { html: it.head }),
              el('p', { html: it.body })
            ]));
          });
          return grid;
        }
      });
    }

    if (lesson.tahsiliTips && lesson.tahsiliTips.length) {
      slides.push({
        sectionId: 'exit',
        tone: 'exit',
        sectionLabel: 'بطاقة الخروج',
        title: 'بطاقة الخروج · خلاصة وتنبيهات التحصيلي',
        badge: 'ملخص التحصيلي',
        render: function () {
          const card = el('div', { className: 'tahsili-summary-card' }, [
            el('h3', { text: 'أبرز نقاط وتنبيهات التحصيلي لهذا الدرس' })
          ]);
          const list = el('ul', { className: 'clean-list' });
          lesson.tahsiliTips.forEach(function (t) { list.appendChild(el('li', { html: t })); });
          card.appendChild(list);
          return card;
        }
      });
    }

    const finalState = { questions: lesson.finalQuiz, answers: {} };
    lesson.finalQuiz.forEach(function (q, idx) {
      slides.push({
        sectionId: 'exit',
        tone: 'exit',
        sectionLabel: 'بطاقة الخروج',
        title: 'بطاقة الخروج · سؤال ' + (idx + 1) + ' من ' + lesson.finalQuiz.length,
        badge: q.source || 'أسئلة من التحصيلي',
        isTahsili: true,
        render: function () {
          return createQuizSlideNode(q, idx, lesson.finalQuiz.length, finalState, 'final', lesson.id);
        }
      });
    });

    return slides;
  }

  function mountLessonDeck(lesson) {
    if (!lesson) return;
    document.documentElement.classList.add('lesson-html');
    document.title = lesson.code + ' ' + lesson.title + ' | دروس الكيمياء التفاعلية';

    const titleEl = document.getElementById('lessonTitle');
    const pagesEl = document.getElementById('lessonPages');
    const backBookEl = document.getElementById('backBookLink');
    if (titleEl) titleEl.textContent = lesson.code + ' ' + lesson.title;
    if (pagesEl) pagesEl.textContent = lesson.pages;
    if (backBookEl) {
      backBookEl.href = '../' + lesson.bookUrl;
      backBookEl.textContent = lesson.bookTitle;
    }

    const slides = buildSlides(lesson);
    let current = 0;

    const tabsNav = document.querySelector('.tabs-nav');
    const exitTabBtn = tabsNav && tabsNav.querySelector('[data-section-tab="exit"]');
    if (tabsNav && !tabsNav.querySelector('[data-section-tab="lab"]') && slides.some(function (s) { return s.sectionId === 'lab'; })) {
      const labTabBtn = el('button', { type: 'button', className: 'tab-btn', role: 'tab', 'data-section-tab': 'lab', 'aria-selected': 'false', text: '🧪 المعمل الافتراضي' });
      tabsNav.insertBefore(labTabBtn, exitTabBtn || null);
    }

    const counterEl = document.getElementById('slideCounter');
    const stageEl = document.getElementById('slideStage');
    const dotsEl = document.getElementById('slideDots');
    const prevBtn = document.getElementById('slidePrevBtn');
    const nextBtn = document.getElementById('slideNextBtn');
    const tabBtns = Array.from(document.querySelectorAll('[data-section-tab]'));

    function renderSlide(idx) {
      current = Math.max(0, Math.min(slides.length - 1, idx));
      const s = slides[current];

      if (counterEl) {
        counterEl.textContent = (current + 1) + ' / ' + slides.length;
      }

      tabBtns.forEach(function (tb) {
        const active = tb.getAttribute('data-section-tab') === s.sectionId;
        tb.setAttribute('aria-selected', String(active));
      });

      if (dotsEl) {
        dotsEl.innerHTML = '';
        slides.forEach(function (_, dIdx) {
          const dot = el('button', {
            type: 'button',
            className: 'slide-dot' + (dIdx === current ? ' active' : ''),
            text: String(dIdx + 1),
            'aria-label': 'الانتقال إلى الشريحة ' + (dIdx + 1)
          });
          dot.addEventListener('click', function () { renderSlide(dIdx); });
          dotsEl.appendChild(dot);
        });
      }

      if (stageEl) {
        stageEl.innerHTML = '';
        stageEl.scrollTop = 0;
        stageEl.setAttribute('data-stage-tone', s.tone || 'concept');
        const topMeta = el('div', { className: 'slide-top-meta' }, [
          el('span', { className: 'slide-section-pill', text: s.sectionLabel }),
          el('span', { className: s.isTahsili ? 'quiz-source-tag tahsili' : 'page-ref', text: s.badge || lesson.pages })
        ]);
        stageEl.appendChild(topMeta);
        stageEl.appendChild(el('h2', { className: 'slide-heading', html: s.title }));
        stageEl.appendChild(s.render());
      }

      if (prevBtn) prevBtn.disabled = current === 0;
      if (nextBtn) nextBtn.disabled = current === slides.length - 1;
    }

    tabBtns.forEach(function (tb) {
      tb.addEventListener('click', function () {
        const secId = tb.getAttribute('data-section-tab');
        const firstIdx = slides.findIndex(function (s) { return s.sectionId === secId; });
        if (firstIdx >= 0) renderSlide(firstIdx);
      });
    });

    if (prevBtn) prevBtn.addEventListener('click', function () { renderSlide(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { renderSlide(current + 1); });

    document.addEventListener('keydown', function (e) {
      if (e.target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowLeft') renderSlide(current + 1);
      else if (e.key === 'ArrowRight') renderSlide(current - 1);
    });

    const navWrap = document.getElementById('lessonPrevNext');
    if (navWrap && window.CHEM_PORTAL) {
      const flat = [];
      window.CHEM_PORTAL.books.forEach(function (bk) {
        bk.chapters.forEach(function (ch) {
          ch.lessons.forEach(function (ls) { flat.push(ls); });
        });
      });
      const idx = flat.findIndex(function (x) { return x.id === lesson.id; });
      navWrap.innerHTML = '';
      if (idx > 0) {
        const prev = flat[idx - 1];
        navWrap.appendChild(el('a', { className: 'btn btn-sm', href: prev.id + '.html', text: 'الدرس السابق: ' + prev.code + ' ' + prev.title }));
      } else {
        navWrap.appendChild(el('a', { className: 'btn btn-sm', href: '../index.html', text: 'الصفحة الرئيسية' }));
      }
      if (idx >= 0 && idx < flat.length - 1) {
        const next = flat[idx + 1];
        navWrap.appendChild(el('a', { className: 'btn btn-sm btn-primary', href: next.id + '.html', text: 'الدرس التالي: ' + next.code + ' ' + next.title }));
      } else {
        navWrap.appendChild(el('a', { className: 'btn btn-sm btn-primary', href: '../' + lesson.bookUrl, text: 'فهرس ' + lesson.bookTitle }));
      }
    }

    renderSlide(0);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTimer();
    initStudentDraw();
    initWhiteboard();
    if (window.CURRENT_LESSON_ID && window.LESSONS_REGISTRY && window.LESSONS_REGISTRY[window.CURRENT_LESSON_ID]) {
      mountLessonDeck(window.LESSONS_REGISTRY[window.CURRENT_LESSON_ID]);
    }
  });
})();
