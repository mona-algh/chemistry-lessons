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

    let baseSeconds = 35 * 60;
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

  function initWhiteboard() {
    const toggleBtn = document.getElementById('wbToggleBtn');
    const dock = document.getElementById('wbDock');
    const canvas = document.getElementById('wbCanvas');
    if (!toggleBtn || !dock || !canvas) return;

    const ctx = canvas.getContext('2d');
    let active = false;
    let drawing = false;
    let color = '#1D5A70';
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
    const box = el('div', { className: 'sim-box' });

    if (simType === 'states-particles') {
      const controls = el('div', { className: 'sim-controls' });
      const canvasWrap = el('div', { className: 'sim-canvas-wrap' });
      const canvas = el('canvas', { width: '520', height: '210' });
      const readout = el('div', { className: 'sim-readout' });
      canvasWrap.appendChild(canvas);
      canvasWrap.appendChild(readout);
      box.appendChild(controls);
      box.appendChild(canvasWrap);

      let mode = 'solid';
      const modes = {
        solid: { label: 'صلب', desc: 'صلب: الجسيمات متقاربة جداً ومرتبة بانتظام، وتهتز في أماكن ثابتة لقوة التجاذب.' },
        liquid: { label: 'سائل', desc: 'سائل: الجسيمات متقاربة لكنها تنزلق فوق بعضها فتأخذ شكل الوعاء وتحتفظ بحجم ثابت.' },
        gas: { label: 'غاز', desc: 'غاز: الجسيمات متباعدة جداً وتتحرك عشوائياً بسرعة في خطوط مستقيمة وتنتشر لتملأ الوعاء.' }
      };
      const particles = [];
      for (let i = 0; i < 36; i++) {
        particles.push({
          gx: (i % 6) * 28 + 190,
          gy: Math.floor(i / 6) * 24 + 45,
          x: Math.random() * 440 + 40,
          y: Math.random() * 140 + 35,
          vx: (Math.random() - 0.5) * 3.5,
          vy: (Math.random() - 0.5) * 3.5,
          phase: Math.random() * Math.PI * 2
        });
      }
      const btns = {};
      Object.keys(modes).forEach(function (k) {
        const b = el('button', { type: 'button', className: 'btn btn-sm', text: modes[k].label });
        b.addEventListener('click', function () {
          mode = k;
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        ctx.strokeStyle = isDark ? '#3B506E' : '#B8C5D4';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

        particles.forEach(function (p, idx) {
          let px, py;
          if (mode === 'solid') {
            px = p.gx + Math.sin(t * 2 + p.phase) * 1.8;
            py = p.gy + Math.cos(t * 2 + p.phase) * 1.8;
          } else if (mode === 'liquid') {
            p.x += Math.sin(t + p.phase) * 0.9;
            p.y += Math.cos(t * 0.8 + p.phase) * 0.6;
            if (p.x < 35) p.x = 485;
            if (p.x > 485) p.x = 35;
            if (p.y < 105) p.y = 105 + (idx % 5) * 18;
            if (p.y > 188) p.y = 188;
            px = p.x;
            py = p.y;
          } else {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 24 || p.x > canvas.width - 24) p.vx *= -1;
            if (p.y < 24 || p.y > canvas.height - 24) p.vy *= -1;
            px = p.x;
            py = p.y;
          }
          ctx.beginPath();
          ctx.arc(px, py, 9, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? '#5DA7C2' : '#1D5A70';
          ctx.fill();
          ctx.strokeStyle = isDark ? '#A5B4C7' : '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    } else if (simType === 'graham-gas') {
      const controls = el('div', { className: 'sim-controls' });
      const gases = [
        { name: 'الهيليوم He (4 g/mol)', m: 4 },
        { name: 'الميثان CH₄ (16 g/mol)', m: 16 },
        { name: 'الأمونيا NH₃ (17 g/mol)', m: 17 },
        { name: 'النيتروجين N₂ (28 g/mol)', m: 28 },
        { name: 'الأكسجين O₂ (32 g/mol)', m: 32 },
        { name: 'كلوريد الهيدروجين HCl (36.5 g/mol)', m: 36.5 },
        { name: 'ثاني أكسيد الكربون CO₂ (44 g/mol)', m: 44 }
      ];
      const selA = el('select', { className: 'btn btn-sm', 'aria-label': 'الغاز الأول A' });
      const selB = el('select', { className: 'btn btn-sm', 'aria-label': 'الغاز الثاني B' });
      gases.forEach(function (g, i) {
        selA.appendChild(el('option', { value: String(i), text: 'الغاز A: ' + g.name }));
        selB.appendChild(el('option', { value: String(i), text: 'الغاز B: ' + g.name }));
      });
      selA.value = '2';
      selB.value = '5';
      controls.appendChild(selA);
      controls.appendChild(selB);
      const readout = el('div', { className: 'sim-readout' });
      function update() {
        const gA = gases[Number(selA.value)];
        const gB = gases[Number(selB.value)];
        const ratio = Math.sqrt(gB.m / gA.m);
        readout.innerHTML = 'نسبة معدل انتشار <span class="chem">A / B = √(' + gB.m + ' / ' + gA.m + ') = ' + ratio.toFixed(2) + '</span> · ' +
          (ratio > 1 ? 'الغاز A أسرع بمقدار ' + ratio.toFixed(2) + ' مرة لأنه أخف.' : ratio < 1 ? 'الغاز B أسرع لأن كتلته المولية أقل.' : 'متساويان في معدل الانتشار.');
      }
      selA.addEventListener('change', update);
      selB.addEventListener('change', update);
      update();
      box.appendChild(controls);
      box.appendChild(readout);
    } else if (simType === 'imf-compare') {
      const items = [
        { label: 'CH₄ (الميثان)', m: '16.0 g/mol', bp: '-164 °C', force: 'قوى تشتت ضعيفة (جزيء غير قطبي) لذلك يوجد غازاً في درجة حرارة الغرفة.' },
        { label: 'HCl (كلوريد الهيدروجين)', m: '36.5 g/mol', bp: '-85 °C', force: 'قوى ثنائية قطبية دائمة بين الجزيئات القطبية + قوى تشتت.' },
        { label: 'NH₃ (الأمونيا)', m: '17.0 g/mol', bp: '-33.4 °C', force: 'روابط هيدروجينية (N-H)، لكنها أضعف من روابط الماء لأن كهروسالبية N أقل من O.' },
        { label: 'H₂O (الماء)', m: '18.0 g/mol', bp: '100 °C', force: 'روابط هيدروجينية قوية ومتعددة (O-H)، تفسر بقاء الماء سائلاً رغم صغر كتلته المولية.' }
      ];
      const controls = el('div', { className: 'sim-controls' });
      const readout = el('div', { className: 'sim-readout' });
      items.forEach(function (it, i) {
        const b = el('button', { type: 'button', className: 'btn btn-sm' + (i === 3 ? ' btn-primary' : ''), text: it.label });
        b.addEventListener('click', function () {
          controls.querySelectorAll('button').forEach(function (btn) { btn.classList.remove('btn-primary'); });
          b.classList.add('btn-primary');
          readout.innerHTML = 'الكتلة المولية: <span class="chem">' + it.m + '</span> | درجة الغليان: <span class="chem">' + it.bp + '</span> : ' + it.force;
        });
        controls.appendChild(b);
      });
      readout.innerHTML = 'الكتلة المولية: <span class="chem">' + items[3].m + '</span> | درجة الغليان: <span class="chem">' + items[3].bp + '</span> : ' + items[3].force;
      box.appendChild(controls);
      box.appendChild(readout);
    } else if (simType === 'phase-diagram') {
      const controls = el('div', { className: 'sim-controls' });
      const tInput = el('input', { type: 'range', min: '-20', max: '400', value: '25', 'aria-label': 'درجة الحرارة بالسيليزية' });
      const pInput = el('input', { type: 'range', min: '0.001', max: '230', step: '0.5', value: '1', 'aria-label': 'الضغط الجوي' });
      const tLbl = el('span', { className: 'page-ref' });
      const pLbl = el('span', { className: 'page-ref' });
      controls.appendChild(el('label', { text: 'الحرارة (°C): ' }, [tInput, tLbl]));
      controls.appendChild(el('label', { text: 'الضغط (atm): ' }, [pInput, pLbl]));
      const presetRow = el('div', { className: 'sim-controls' });
      const readout = el('div', { className: 'sim-readout' });

      function evaluate() {
        const T = Number(tInput.value);
        const P = Number(pInput.value);
        tLbl.textContent = ' ' + T + ' °C';
        pLbl.textContent = ' ' + P + ' atm';
        let msg = '';
        if (Math.abs(T - 0.01) < 1 && P < 0.5) {
          msg = 'قرب النقطة الثلاثية للماء (0.01°C, 0.006 atm): توجد الحالات الثلاث معاً (صلب وسائل وبخار).';
        } else if (T >= 373.99 && P >= 217.75) {
          msg = 'فوق النقطة الحرجة (373.99°C, 217.75 atm): لا يمكن إسالة البخار بزيادة الضغط.';
        } else if (T < 0) {
          msg = 'الحالة الصلبة (جليد): الجسيمات مقيدة بروابط هيدروجينية مرتبة.';
        } else if (P >= 1 && T >= 0 && T < 100) {
          msg = 'الحالة السائلة (ماء): ضغط البخار أقل من الضغط الخارجي.';
        } else {
          msg = 'الحالة الغازية (بخار ماء): طاقة الجسيمات كافية للتغلب على قوى التجاذب.';
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
      box.appendChild(readout);
    } else if (simType === 'gas-laws') {
      const controls = el('div', { className: 'sim-controls' });
      const lawSel = el('select', { className: 'btn btn-sm', 'aria-label': 'اختر القانون' });
      [
        { v: 'boyle', t: 'قانون بويل (ثبوت T): P و V عكسياً' },
        { v: 'charles', t: 'قانون شارل (ثبوت P): V و T(K) طردياً' },
        { v: 'gay', t: 'قانون جاي-لوساك (ثبوت V): P و T(K) طردياً' }
      ].forEach(function (o) { lawSel.appendChild(el('option', { value: o.v, text: o.t })); });

      const slider = el('input', { type: 'range', min: '1', max: '5', step: '0.5', value: '2', 'aria-label': 'قيمة المتغير المستقل' });
      const sliderVal = el('span', { className: 'page-ref' });
      controls.appendChild(lawSel);
      controls.appendChild(el('label', { text: 'المتغير: ' }, [slider, sliderVal]));

      const canvasWrap = el('div', { className: 'sim-canvas-wrap' });
      const canvas = el('canvas', { width: '480', height: '150' });
      const readout = el('div', { className: 'sim-readout' });
      canvasWrap.appendChild(canvas);
      canvasWrap.appendChild(readout);
      box.appendChild(controls);
      box.appendChild(canvasWrap);

      const ctx = canvas.getContext('2d');
      function update() {
        const law = lawSel.value;
        const x = Number(slider.value);
        let p = 1, v = 10, tK = 300;
        if (law === 'boyle') {
          p = x; v = 10 / p;
          sliderVal.textContent = ' P = ' + p.toFixed(1) + ' atm';
          readout.innerHTML = 'قانون بويل: <span class="chem">P₁V₁ = P₂V₂ = 10 atm·L</span> ← الحجم الجديد <span class="chem">V = ' + v.toFixed(2) + ' L</span>';
        } else if (law === 'charles') {
          tK = x * 150; v = (tK / 150) * 3;
          sliderVal.textContent = ' T = ' + tK + ' K';
          readout.innerHTML = 'قانون شارل: <span class="chem">V₁/T₁ = V₂/T₂</span> ← الحجم عند ' + tK + ' K يساوي <span class="chem">' + v.toFixed(1) + ' L</span>';
        } else {
          tK = x * 150; p = (tK / 150) * 1.5; v = 6;
          sliderVal.textContent = ' T = ' + tK + ' K';
          readout.innerHTML = 'جاي-لوساك: <span class="chem">P₁/T₁ = P₂/T₂</span> ← الضغط عند ' + tK + ' K يساوي <span class="chem">' + p.toFixed(2) + ' atm</span> (الحجم ثابت)';
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const cylW = Math.min(380, Math.max(80, v * 28));
        ctx.strokeStyle = isDark ? '#5DA7C2' : '#1D5A70';
        ctx.lineWidth = 3;
        ctx.strokeRect(40, 25, 390, 95);
        ctx.fillStyle = isDark ? 'rgba(93,167,194,0.2)' : 'rgba(29,90,112,0.14)';
        ctx.fillRect(42, 27, cylW, 91);
        ctx.fillStyle = isDark ? '#E5A84B' : '#B4690E';
        ctx.fillRect(40 + cylW, 25, 14, 95);
        ctx.fillStyle = isDark ? '#E9EFF6' : '#182230';
        ctx.font = 'bold 14px Tajawal, sans-serif';
        ctx.fillText('P = ' + p.toFixed(2) + ' atm   |   V = ' + v.toFixed(2) + ' L   |   T = ' + tK + ' K', 50, 140);
      }
      lawSel.addEventListener('change', update);
      slider.addEventListener('input', update);
      update();
    } else if (simType === 'ideal-gas') {
      const controls = el('div', { className: 'sim-controls' });
      const pIn = el('input', { type: 'number', step: '0.1', value: '1.5', className: 'btn btn-sm', style: 'width:90px', 'aria-label': 'الضغط atm' });
      const vIn = el('input', { type: 'number', step: '0.5', value: '3.0', className: 'btn btn-sm', style: 'width:90px', 'aria-label': 'الحجم L' });
      const tIn = el('input', { type: 'number', step: '5', value: '27', className: 'btn btn-sm', style: 'width:90px', 'aria-label': 'الحرارة C' });
      controls.appendChild(el('label', { text: 'P (atm): ' }, [pIn]));
      controls.appendChild(el('label', { text: 'V (L): ' }, [vIn]));
      controls.appendChild(el('label', { text: 'T (°C): ' }, [tIn]));
      const readout = el('div', { className: 'sim-readout' });
      function calc() {
        const P = parseFloat(pIn.value) || 0;
        const V = parseFloat(vIn.value) || 0;
        const Tc = parseFloat(tIn.value);
        const Tk = (isNaN(Tc) ? 0 : Tc) + 273;
        if (Tk <= 0) {
          readout.textContent = 'درجة الحرارة بالكلفن يجب أن تكون أكبر من الصفر المطلق (0 K).';
          return;
        }
        const n = (P * V) / (0.0821 * Tk);
        readout.innerHTML = 'بالتحويل <span class="chem">T = ' + Tk + ' K</span> ← عدد المولات <span class="chem">n = PV / RT = ' + n.toFixed(3) + ' mol</span>';
      }
      [pIn, vIn, tIn].forEach(function (i) { i.addEventListener('input', calc); });
      calc();
      box.appendChild(controls);
      box.appendChild(readout);
    } else if (simType === 'gas-stoich') {
      const controls = el('div', { className: 'sim-controls' });
      const n2In = el('input', { type: 'range', min: '1', max: '10', step: '0.5', value: '5', 'aria-label': 'حجم غاز النيتروجين باللتر' });
      const readout = el('div', { className: 'sim-readout' });
      function update() {
        const vN2 = Number(n2In.value);
        readout.innerHTML = '<span class="chem">' + vN2 + ' L N₂</span> يتفاعل مع <span class="chem">' + (vN2 * 3) + ' L H₂</span> لإنتاج <span class="chem">' + (vN2 * 2) + ' L NH₃</span> (النسبة الحجمية 1 : 3 : 2)';
      }
      n2In.addEventListener('input', update);
      update();
      controls.appendChild(el('label', { text: 'حجم N₂ (باللتر): ' }, [n2In]));
      box.appendChild(controls);
      box.appendChild(readout);
    } else if (simType === 'galvanic-cell') {
      const halfCells = [
        { name: 'Mg²⁺ | Mg', e: -2.372, ion: 'Mg²⁺', metal: 'Mg' },
        { name: 'Zn²⁺ | Zn', e: -0.762, ion: 'Zn²⁺', metal: 'Zn' },
        { name: 'Fe²⁺ | Fe', e: -0.447, ion: 'Fe²⁺', metal: 'Fe' },
        { name: 'Sn²⁺ | Sn', e: -0.137, ion: 'Sn²⁺', metal: 'Sn' },
        { name: 'Cu²⁺ | Cu', e: +0.342, ion: 'Cu²⁺', metal: 'Cu' },
        { name: 'Ag⁺ | Ag', e: +0.800, ion: 'Ag⁺', metal: 'Ag' }
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
      controls.appendChild(el('label', { text: 'القطب 1: ' }, [sel1]));
      controls.appendChild(el('label', { text: 'القطب 2: ' }, [sel2]));
      const readout = el('div', { className: 'sim-readout' });
      function update() {
        const a = halfCells[Number(sel1.value)];
        const b = halfCells[Number(sel2.value)];
        if (a.metal === b.metal) {
          readout.textContent = 'اختر قطبين مختلفين لتكوين خلية جلفانية ذات فرق جهد.';
          return;
        }
        const cathode = a.e >= b.e ? a : b;
        const anode = a.e >= b.e ? b : a;
        const eCell = cathode.e - anode.e;
        readout.innerHTML =
          'الأنود (أكسدة): <span class="chem">' + anode.metal + ' → ' + anode.ion + '</span> · الكاثود (اختزال): <span class="chem">' + cathode.ion + ' → ' + cathode.metal + '</span><br>' +
          'تتدفق الإلكترونات من <span class="chem">' + anode.metal + '</span> إلى <span class="chem">' + cathode.metal + '</span> · الجهد القياسي <span class="chem">E°cell = +' + eCell.toFixed(3) + ' V</span>';
      }
      sel1.addEventListener('change', update);
      sel2.addEventListener('change', update);
      update();
      box.appendChild(controls);
      box.appendChild(readout);
    } else if (simType === 'batteries-compare') {
      const items = [
        { k: 'الجافة (الخارصين-الكربون)', txt: 'أولية (لا تُشحن) · الأنود: الخارصين Zn · الكاثود غير الفعال: عمود الجرافيت في عجينة MnO₂ وNH₄Cl وZnCl₂ · الجهد: 1.5 V.' },
        { k: 'القلوية والفضة', txt: 'أولية · تستخدم مسحوق الخارصين مع KOH، وبطارية الفضة تستخدم Ag₂O في الساعات وسماعات الأذن.' },
        { k: 'المركم الرصاصي', txt: 'ثانوية (تُشحن) · 6 خلايا × 2V = 12V · الأنود Pb والكاثود PbO₂ في محلول H₂SO₄.' },
        { k: 'الليثيوم والوقود', txt: 'الليثيوم أخف فلز وأقل جهد اختزال (-3.04V) فيُنتج جهداً عالياً · خلية الوقود (H₂/O₂) تزود بوقود خارجي وتُنتج ماءً نقياً وكهرباء.' }
      ];
      const controls = el('div', { className: 'sim-controls' });
      const readout = el('div', { className: 'sim-readout' });
      items.forEach(function (it, i) {
        const b = el('button', { type: 'button', className: 'btn btn-sm' + (i === 0 ? ' btn-primary' : ''), text: it.k });
        b.addEventListener('click', function () {
          controls.querySelectorAll('button').forEach(function (btn) { btn.classList.remove('btn-primary'); });
          b.classList.add('btn-primary');
          readout.textContent = it.txt;
        });
        controls.appendChild(b);
      });
      readout.textContent = items[0].txt;
      box.appendChild(controls);
      box.appendChild(readout);
    } else if (simType === 'electrolysis-cells') {
      const items = [
        { k: 'مصهور NaCl (خلية داون)', txt: 'الأنود (+): أكسدة 2Cl⁻ → Cl₂(g) + 2e⁻ | الكاثود (-): اختزال Na⁺ + e⁻ → Na(l) | الناتج: فلز الصوديوم النقي وغاز الكلور.' },
        { k: 'ماء البحر NaCl(aq)', txt: 'لا يترسب الصوديوم لأن اختزال الماء أسهل عند الكاثود فينتج H₂ وNaOH، وعند الأنود يتأكسد الكلوريد إلى Cl₂.' },
        { k: 'هول-هيروليت (Al)', txt: 'يُستخلص الألومنيوم المنصهر عند الكاثود، وتُعاد تدويره لأنه يستهلك طاقة كهربائية عالية جداً.' },
        { k: 'تنقية النحاس والطلاء', txt: 'يوضع الفلز النقي (للتنقية) أو الجسم المراد طلاؤه (مثل مفتاح بالفضة) عند الكاثود، والفلز النقي عند الأنود.' }
      ];
      const controls = el('div', { className: 'sim-controls' });
      const readout = el('div', { className: 'sim-readout' });
      items.forEach(function (it, i) {
        const b = el('button', { type: 'button', className: 'btn btn-sm' + (i === 0 ? ' btn-primary' : ''), text: it.k });
        b.addEventListener('click', function () {
          controls.querySelectorAll('button').forEach(function (btn) { btn.classList.remove('btn-primary'); });
          b.classList.add('btn-primary');
          readout.textContent = it.txt;
        });
        controls.appendChild(b);
      });
      readout.textContent = items[0].txt;
      box.appendChild(controls);
      box.appendChild(readout);
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

    q.options.forEach(function (optHtml, oIdx) {
      const btn = el('button', { type: 'button', className: 'quiz-option-btn' });
      btn.innerHTML = '<span>' + ['أ', 'ب', 'ج', 'د'][oIdx] + ')</span> <span>' + optHtml + '</span>';
      btn.addEventListener('click', function () {
        quizState.answers[qIdx] = oIdx;
        paintQuestion();
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

    slides.push({
      sectionId: 'goals',
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
          el('p', { style: 'margin:0; font-weight:700; font-size:1.08rem;', html: lesson.focus.prompt }),
          revealBox
        ]));
        frag.appendChild(el('h3', { style: 'margin:0.5rem 0 0.35rem; color:var(--primary); font-size:1rem;', text: 'المفردات الأساسية' }));
        const chips = el('div', { className: 'vocab-chips' });
        lesson.vocab.forEach(function (v) { chips.appendChild(el('span', { className: 'vocab-chip', html: v })); });
        frag.appendChild(chips);
        return frag;
      }
    });

    if (lesson.simulation) {
      slides.push({
        sectionId: 'content',
        sectionLabel: 'الشرح والتفاعل',
        title: simTitles[lesson.simulation] || 'محاكاة تفاعلية',
        render: function () {
          return createSimulationNode(lesson.simulation);
        }
      });
    }

    lesson.concepts.forEach(function (c) {
      slides.push({
        sectionId: 'content',
        sectionLabel: 'الشرح والتفاعل',
        title: c.title,
        render: function () {
          return el('div', { className: 'concept-slide-body', html: c.bodyHtml });
        }
      });
    });

    if (lesson.workedExample) {
      slides.push({
        sectionId: 'content',
        sectionLabel: 'الشرح والتفاعل',
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

    slides.push({
      sectionId: 'connections',
      sectionLabel: 'الاستراتيجيات والربط',
      title: 'استراتيجيات التعلم النشط',
      render: function () {
        const grid = el('div', { className: 'strategy-grid' });
        lesson.strategies.forEach(function (st) {
          grid.appendChild(el('div', { className: 'strategy-card' }, [
            el('h4', { html: st.name }),
            el('p', { style: 'margin:0;', html: st.how })
          ]));
        });
        return grid;
      }
    });

    slides.push({
      sectionId: 'connections',
      sectionLabel: 'الاستراتيجيات والربط',
      title: 'الربط بالواقع وأمثلة من الحياة والعلوم الأخرى',
      render: function () {
        const grid = el('div', { className: 'strategy-grid' });
        lesson.lifeLinks.forEach(function (lk) {
          grid.appendChild(el('div', { className: 'strategy-card' }, [
            el('h4', { html: lk.tag + ' · ' + lk.title }),
            el('p', { style: 'margin:0;', html: lk.text })
          ]));
        });
        return grid;
      }
    });

    const formativeState = { questions: lesson.formativeQuiz, answers: {} };
    lesson.formativeQuiz.forEach(function (q, idx) {
      slides.push({
        sectionId: 'formative',
        sectionLabel: 'التقويم التكويني',
        title: 'تقويم تكويني · سؤال ' + (idx + 1) + ' من ' + lesson.formativeQuiz.length,
        badge: 'تصحيح فوري',
        render: function () {
          return createQuizSlideNode(q, idx, lesson.formativeQuiz.length, formativeState, 'formative', lesson.id);
        }
      });
    });

    if (lesson.tahsiliTips && lesson.tahsiliTips.length) {
      slides.push({
        sectionId: 'final',
        sectionLabel: 'النهائي والتحصيلي',
        title: 'تنبيهات وقواعد مهمة للتحصيلي',
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
        sectionId: 'final',
        sectionLabel: 'النهائي والتحصيلي',
        title: 'التقويم النهائي · سؤال ' + (idx + 1) + ' من ' + lesson.finalQuiz.length,
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
    initWhiteboard();
    if (window.CURRENT_LESSON_ID && window.LESSONS_REGISTRY && window.LESSONS_REGISTRY[window.CURRENT_LESSON_ID]) {
      mountLessonDeck(window.LESSONS_REGISTRY[window.CURRENT_LESSON_ID]);
    }
  });
})();
