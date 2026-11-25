// Shared Interactive Lesson Engine (Tabs, Timer, Whiteboard, Simulations, Quizzes)
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

  /* ================= 1. CLASSROOM TIMER ================= */
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

  /* ================= 2. WHITEBOARD ANNOTATION OVERLAY ================= */
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

    toggleBtn.addEventListener('click', function () {
      setActive(!active);
    });

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
      undoBtn.addEventListener('click', function () {
        strokes.pop();
        redraw(strokes);
      });
    }

    const clearBtn = document.getElementById('wbClearBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        strokes.length = 0;
        redraw(strokes);
      });
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

  /* ================= 3. TABS NAVIGATION ================= */
  function initTabs() {
    const tabBtns = Array.from(document.querySelectorAll('[role="tab"]'));
    const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
    if (!tabBtns.length) return;

    function activate(tabId) {
      tabBtns.forEach(function (btn) {
        const selected = btn.id === tabId;
        btn.setAttribute('aria-selected', String(selected));
        btn.setAttribute('tabindex', selected ? '0' : '-1');
      });
      panels.forEach(function (panel) {
        panel.hidden = panel.getAttribute('aria-labelledby') !== tabId;
      });
    }

    tabBtns.forEach(function (btn, idx) {
      btn.addEventListener('click', function () {
        activate(btn.id);
      });
      btn.addEventListener('keydown', function (e) {
        let nextIdx = idx;
        if (e.key === 'ArrowLeft') nextIdx = (idx + 1) % tabBtns.length;
        else if (e.key === 'ArrowRight') nextIdx = (idx - 1 + tabBtns.length) % tabBtns.length;
        else if (e.key === 'Home') nextIdx = 0;
        else if (e.key === 'End') nextIdx = tabBtns.length - 1;
        else return;
        e.preventDefault();
        tabBtns[nextIdx].focus();
        activate(tabBtns[nextIdx].id);
      });
    });

    activate(tabBtns[0].id);
  }

  /* ================= 4. INTERACTIVE SIMULATIONS PER LESSON ================= */
  function mountSimulation(container, simType) {
    if (!simType) return;
    const box = el('div', { className: 'sim-box' });

    if (simType === 'states-particles') {
      box.appendChild(el('div', { className: 'sim-header' }, [
        el('h3', { text: 'محاكاة تفاعلية: كيف تتحرك الجسيمات؟' }),
        el('span', { className: 'page-ref', text: 'اختر الحالة للمقارنة' })
      ]));
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
      tick();
    } else if (simType === 'graham-gas') {
      box.appendChild(el('div', { className: 'sim-header' }, [
        el('h3', { text: 'محاكاة قانون جراهام للتدفق والانتشار' }),
        el('span', { className: 'page-ref', text: 'قارن سرعة غازين' })
      ]));
      const controls = el('div', { className: 'sim-controls' });
      const gases = [
        { name: 'الهيليوم He (M = 4 g/mol)', m: 4 },
        { name: 'الميثان CH₄ (M = 16 g/mol)', m: 16 },
        { name: 'الأمونيا NH₃ (M = 17 g/mol)', m: 17 },
        { name: 'النيتروجين N₂ (M = 28 g/mol)', m: 28 },
        { name: 'الأكسجين O₂ (M = 32 g/mol)', m: 32 },
        { name: 'كلوريد الهيدروجين HCl (M = 36.5 g/mol)', m: 36.5 },
        { name: 'ثاني أكسيد الكربون CO₂ (M = 44 g/mol)', m: 44 }
      ];
      const selA = el('select', { className: 'btn btn-sm', 'aria-label': 'الغاز الأول A' });
      const selB = el('select', { className: 'btn btn-sm', 'aria-label': 'الغاز الثاني B' });
      gases.forEach(function (g, i) {
        selA.appendChild(el('option', { value: String(i), text: 'الغاز A: ' + g.name }));
        selB.appendChild(el('option', { value: String(i), text: 'الغاز B: ' + g.name }));
      });
      selA.value = '2'; // NH3
      selB.value = '5'; // HCl
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
      box.appendChild(el('div', { className: 'sim-header' }, [
        el('h3', { text: 'مستكشف القوى بين الجزيئات ودرجة الغليان' }),
        el('span', { className: 'page-ref', text: 'مقارنة تفاعلية' })
      ]));
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
      box.appendChild(el('div', { className: 'sim-header' }, [
        el('h3', { text: 'مستكشف مخطط الطور للماء وتحولات الحالة' }),
        el('span', { className: 'page-ref', text: 'جرّب تغيير الحرارة والضغط' })
      ]));
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
      box.appendChild(el('div', { className: 'sim-header' }, [
        el('h3', { text: 'محاكاة قوانين الغازات (بويل · شارل · جاي لوساك)' }),
        el('span', { className: 'page-ref', text: 'حرّك المؤشرات لملاحظة العلاقة' })
      ]));
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
          p = x;
          v = 10 / p;
          sliderVal.textContent = ' P = ' + p.toFixed(1) + ' atm';
          readout.innerHTML = 'قانون بويل: <span class="chem">P₁V₁ = P₂V₂ = 10 atm·L</span> ← الحجم الجديد <span class="chem">V = ' + v.toFixed(2) + ' L</span>';
        } else if (law === 'charles') {
          tK = x * 150;
          v = (tK / 150) * 3;
          sliderVal.textContent = ' T = ' + tK + ' K';
          readout.innerHTML = 'قانون شارل: <span class="chem">V₁/T₁ = V₂/T₂</span> ← الحجم عند ' + tK + ' K يساوي <span class="chem">' + v.toFixed(1) + ' L</span>';
        } else {
          tK = x * 150;
          p = (tK / 150) * 1.5;
          v = 6;
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
      box.appendChild(el('div', { className: 'sim-header' }, [
        el('h3', { text: 'حاسبة قانون الغاز المثالي (PV = nRT)' }),
        el('span', { className: 'page-ref', text: 'احسب عدد المولات n' })
      ]));
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
      box.appendChild(el('div', { className: 'sim-header' }, [
        el('h3', { text: 'حاسبة النسب الحجمية للتفاعلات الغازية' }),
        el('span', { className: 'page-ref', text: 'N₂ + 3H₂ → 2NH₃' })
      ]));
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
      box.appendChild(el('div', { className: 'sim-header' }, [
        el('h3', { text: 'محاكاة الخلية الجلفانية وحساب الجهد القياسي E°cell' }),
        el('span', { className: 'page-ref', text: 'اختر القطبين' })
      ]));
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
      sel1.value = '1'; // Zn
      sel2.value = '4'; // Cu
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
          'تتدفق الإلكترونات عبر السلك من <span class="chem">' + anode.metal + '</span> إلى <span class="chem">' + cathode.metal + '</span> · الجهد القياسي <span class="chem">E°cell = ' +
          cathode.e + ' - (' + anode.e + ') = +' + eCell.toFixed(3) + ' V</span> (تلقائي)';
      }
      sel1.addEventListener('change', update);
      sel2.addEventListener('change', update);
      update();
      box.appendChild(controls);
      box.appendChild(readout);
    } else if (simType === 'batteries-compare') {
      box.appendChild(el('div', { className: 'sim-header' }, [
        el('h3', { text: 'مقارنة تفاعلية: البطاريات وحماية الفلزات من التآكل' }),
        el('span', { className: 'page-ref', text: 'اختر النوع' })
      ]));
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
      box.appendChild(el('div', { className: 'sim-header' }, [
        el('h3', { text: 'مستكشف تطبيقات التحليل الكهربائي' }),
        el('span', { className: 'page-ref', text: 'قارن الأنود والكاثود والنواتج' })
      ]));
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

    container.appendChild(box);
  }

  /* ================= 5. QUIZ ENGINE (FORMATIVE + FINAL/TAHSILI) ================= */
  function renderQuiz(container, questions, options) {
    const mode = options.mode; // 'formative' | 'final'
    const lessonId = options.lessonId;
    const state = {};
    let submitted = false;

    const headerBar = el('div', { className: 'quiz-header-bar' });
    const scoreText = el('strong', { text: 'النتيجة: لم يتم التحقق بعد (' + questions.length + ' أسئلة)' });
    const actions = el('div', { style: 'display:flex; gap:0.5rem; flex-wrap:wrap;' });
    const submitBtn = el('button', { type: 'button', className: 'btn btn-primary btn-sm', text: mode === 'final' ? 'اعتماد الاختبار وحساب الدرجة' : 'تحقق من الإجابات' });
    const resetBtn = el('button', { type: 'button', className: 'btn btn-sm', text: 'إعادة المحاولة' });
    actions.appendChild(submitBtn);
    actions.appendChild(resetBtn);
    headerBar.appendChild(scoreText);
    headerBar.appendChild(actions);

    const validationBanner = el('div', { className: 'quiz-feedback err', hidden: '' });
    const list = el('div', { className: 'quiz-list' });

    function buildQuestions() {
      list.innerHTML = '';
      questions.forEach(function (q, qIdx) {
        const card = el('div', { className: 'quiz-card', id: mode + '-q-' + qIdx });
        const head = el('div', { className: 'quiz-q-head' }, [
          el('span', { className: 'quiz-q-num', text: 'سؤال ' + (qIdx + 1) }),
          el('span', {
            className: 'quiz-source-tag' + (q.source && q.source.includes('تحصيلي') ? ' tahsili' : ''),
            text: q.source || (mode === 'final' ? 'تقويم نهائي' : 'تقويم تكويني')
          })
        ]);
        card.appendChild(head);
        card.appendChild(el('p', { className: 'quiz-q-text', html: q.q }));

        const optsWrap = el('div', { className: 'quiz-options' });
        const feedback = el('div', { className: 'quiz-feedback', hidden: '' });

        q.options.forEach(function (optHtml, oIdx) {
          const btn = el('button', { type: 'button', className: 'quiz-option-btn' });
          btn.innerHTML = '<span>' + ['أ', 'ب', 'ج', 'د'][oIdx] + ')</span> <span>' + optHtml + '</span>';
          btn.addEventListener('click', function () {
            if (submitted && mode === 'final') return;
            state[qIdx] = oIdx;
            validationBanner.hidden = true;
            optsWrap.querySelectorAll('button').forEach(function (b, bIdx) {
              b.classList.toggle('selected', bIdx === oIdx);
            });
            if (mode === 'formative') {
              const isOk = oIdx === q.answer;
              optsWrap.querySelectorAll('button').forEach(function (b, bIdx) {
                b.classList.remove('correct', 'wrong');
                if (bIdx === q.answer) b.classList.add('correct');
                else if (bIdx === oIdx && !isOk) b.classList.add('wrong');
              });
              feedback.hidden = false;
              feedback.className = 'quiz-feedback ' + (isOk ? 'ok' : 'err');
              feedback.innerHTML = (isOk ? '<strong>إجابة صحيحة:</strong> ' : '<strong>حاول مجدداً · التفسير:</strong> ') + q.explain;
              updateLiveFormativeScore();
            }
          });
          optsWrap.appendChild(btn);
        });

        card.appendChild(optsWrap);
        card.appendChild(feedback);
        list.appendChild(card);
      });
    }

    function updateLiveFormativeScore() {
      let correct = 0;
      let answered = 0;
      questions.forEach(function (q, i) {
        if (state[i] !== undefined) {
          answered++;
          if (state[i] === q.answer) correct++;
        }
      });
      scoreText.textContent = 'تمت الإجابة على ' + answered + ' من ' + questions.length + ' · الصحيح: ' + correct;
    }

    submitBtn.addEventListener('click', function () {
      const unanswered = questions.filter(function (_, i) { return state[i] === undefined; }).length;
      if (unanswered > 0) {
        validationBanner.hidden = false;
        validationBanner.textContent = 'تبقى ' + unanswered + ' سؤال لم تُختر إجابته بعد. اختر إجابة لكل سؤال ثم اضغط اعتماد.';
        return;
      }
      validationBanner.hidden = true;
      submitted = true;
      let correct = 0;
      questions.forEach(function (q, qIdx) {
        const card = document.getElementById(mode + '-q-' + qIdx);
        const btns = card.querySelectorAll('.quiz-option-btn');
        const feedback = card.querySelector('.quiz-feedback');
        const picked = state[qIdx];
        const isOk = picked === q.answer;
        if (isOk) correct++;

        btns.forEach(function (b, oIdx) {
          b.disabled = (mode === 'final');
          b.classList.remove('selected', 'correct', 'wrong');
          if (oIdx === q.answer) b.classList.add('correct');
          else if (oIdx === picked && !isOk) b.classList.add('wrong');
        });
        feedback.hidden = false;
        feedback.className = 'quiz-feedback ' + (isOk ? 'ok' : 'err');
        feedback.innerHTML = (isOk ? '<strong>صحيح:</strong> ' : '<strong>غير صحيح · التفسير:</strong> ') + q.explain;
      });
      const pct = Math.round((correct / questions.length) * 100);
      scoreText.textContent = 'النتيجة النهائية: ' + correct + ' / ' + questions.length + ' (' + pct + '%)';
      if (mode === 'final' && window.CHEM_PORTAL) {
        window.CHEM_PORTAL.saveLessonScore(lessonId, correct, questions.length);
      }
    });

    resetBtn.addEventListener('click', function () {
      Object.keys(state).forEach(function (k) { delete state[k]; });
      submitted = false;
      validationBanner.hidden = true;
      scoreText.textContent = 'النتيجة: لم يتم التحقق بعد (' + questions.length + ' أسئلة)';
      buildQuestions();
    });

    buildQuestions();
    container.appendChild(headerBar);
    container.appendChild(validationBanner);
    container.appendChild(list);
  }

  /* ================= 6. RENDER FULL LESSON ================= */
  function mountLesson(lesson) {
    if (!lesson) return;
    document.title = lesson.code + ' ' + lesson.title + ' | بوابة الكيمياء التفاعلية';

    const titleEl = document.getElementById('lessonTitle');
    const pagesEl = document.getElementById('lessonPages');
    const backBookEl = document.getElementById('backBookLink');
    if (titleEl) titleEl.textContent = lesson.code + ' ' + lesson.title;
    if (pagesEl) pagesEl.textContent = lesson.bookTitle + ' · ' + lesson.pages;
    if (backBookEl) {
      backBookEl.href = '../' + lesson.bookUrl;
      backBookEl.textContent = 'العودة إلى ' + lesson.bookTitle;
    }

    // Tab 1: Objectives, Main Idea, Focus Slide
    const p1 = document.getElementById('panel-goals');
    p1.innerHTML = '';
    p1.appendChild(el('div', { className: 'section-title' }, [
      el('span', { text: 'الفكرة الرئيسة والأهداف' }),
      el('span', { className: 'page-ref', text: lesson.pages })
    ]));
    p1.appendChild(el('div', { className: 'main-idea-box' }, [
      el('span', { className: 'main-idea-label', text: 'الفكرة الرئيسة' }),
      el('p', { className: 'main-idea-text', html: lesson.mainIdea })
    ]));

    const split = el('div', { className: 'split-grid' });
    const objCard = el('div', { className: 'info-card' }, [
      el('h3', { text: 'أهداف الدرس' })
    ]);
    const objList = el('ul', { className: 'clean-list' });
    lesson.objectives.forEach(function (o) { objList.appendChild(el('li', { html: o })); });
    objCard.appendChild(objList);

    const vocabCard = el('div', { className: 'info-card' }, [
      el('h3', { text: 'المفردات والمفاهيم الأساسية' })
    ]);
    const chips = el('div', { className: 'vocab-chips' });
    lesson.vocab.forEach(function (v) { chips.appendChild(el('span', { className: 'vocab-chip', html: v })); });
    vocabCard.appendChild(chips);

    split.appendChild(objCard);
    split.appendChild(vocabCard);
    p1.appendChild(split);

    const focusCard = el('div', { className: 'focus-card' });
    const revealBox = el('div', { className: 'reveal-box', hidden: '', html: '<strong>المناقشة المتوقعة:</strong> ' + lesson.focus.answer });
    const revealBtn = el('button', { type: 'button', className: 'btn btn-sm', text: 'اعرض التفسير العلمي' });
    revealBtn.addEventListener('click', function () {
      const opening = revealBox.hidden;
      revealBox.hidden = !opening;
      revealBtn.textContent = opening ? 'إخفاء التفسير' : 'اعرض التفسير العلمي';
    });
    focusCard.appendChild(el('div', { className: 'focus-card-header' }, [
      el('span', { className: 'focus-badge', text: 'شريحة التركيز · تهيئة الدرس' }),
      revealBtn
    ]));
    focusCard.appendChild(el('p', { style: 'margin:0; font-weight:700;', html: lesson.focus.prompt }));
    focusCard.appendChild(revealBox);
    p1.appendChild(focusCard);

    // Tab 2: Interactive Content + Simulation + Worked Example + Support/Enrichment
    const p2 = document.getElementById('panel-content');
    p2.innerHTML = '';
    p2.appendChild(el('div', { className: 'section-title' }, [
      el('span', { text: 'المحتوى المركز والتفاعل' }),
      el('span', { className: 'page-ref', text: 'خلاصة المعلومات المهمة' })
    ]));

    mountSimulation(p2, lesson.simulation);

    const stack = el('div', { className: 'concepts-stack' });
    lesson.concepts.forEach(function (c) {
      const blk = el('div', { className: 'concept-block' });
      blk.appendChild(el('h3', { html: c.title }));
      blk.appendChild(el('div', { html: c.bodyHtml }));
      stack.appendChild(blk);
    });
    p2.appendChild(stack);

    if (lesson.workedExample) {
      const exBox = el('div', { className: 'concept-block', style: 'margin-top:1.15rem;' });
      const ansWrap = el('div', { className: 'reveal-box', hidden: '', html: lesson.workedExample.solutionHtml });
      const ansBtn = el('button', { type: 'button', className: 'btn btn-sm btn-primary', text: 'إظهار خطوات الحل' });
      ansBtn.addEventListener('click', function () {
        const opening = ansWrap.hidden;
        ansWrap.hidden = !opening;
        ansBtn.textContent = opening ? 'إخفاء الحل' : 'إظهار خطوات الحل';
      });
      exBox.appendChild(el('div', { style: 'display:flex; justify-content:space-between; align-items:center; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.5rem;' }, [
        el('h3', { style: 'margin:0;', html: 'مثال محلول: ' + lesson.workedExample.title }),
        ansBtn
      ]));
      exBox.appendChild(el('p', { html: lesson.workedExample.questionHtml }));
      exBox.appendChild(ansWrap);
      p2.appendChild(exBox);
    }

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
    p2.appendChild(scaff);

    // Tab 3: Strategies, Real-life & Cross-science Links
    const p3 = document.getElementById('panel-connections');
    p3.innerHTML = '';
    p3.appendChild(el('div', { className: 'section-title' }, [
      el('span', { text: 'استراتيجيات التعلم والربط بالواقع والعلوم' })
    ]));
    const cGrid = el('div', { className: 'connections-grid' });
    const stratCol = el('div');
    stratCol.appendChild(el('h3', { style: 'margin-top:0; color:var(--primary);', text: 'استراتيجيات مقترحة للتدريس والمذاكرة' }));
    lesson.strategies.forEach(function (st) {
      stratCol.appendChild(el('div', { className: 'strategy-card' }, [
        el('h4', { html: st.name }),
        el('p', { style: 'margin:0;', html: st.how })
      ]));
    });

    const linksCol = el('div');
    linksCol.appendChild(el('h3', { style: 'margin-top:0; color:var(--primary);', text: 'الربط بالواقع وأمثلة من الحياة والعلوم الأخرى' }));
    lesson.lifeLinks.forEach(function (lk) {
      linksCol.appendChild(el('div', { className: 'strategy-card' }, [
        el('h4', { html: lk.tag + ' · ' + lk.title }),
        el('p', { style: 'margin:0;', html: lk.text })
      ]));
    });
    cGrid.appendChild(stratCol);
    cGrid.appendChild(linksCol);
    p3.appendChild(cGrid);

    // Tab 4: Formative Quiz
    const p4 = document.getElementById('panel-formative');
    p4.innerHTML = '';
    p4.appendChild(el('div', { className: 'section-title' }, [
      el('span', { text: 'التقويم التكويني (أثناء الدرس)' }),
      el('span', { className: 'page-ref', text: 'تصحيح فوري وتغذية راجعة' })
    ]));
    renderQuiz(p4, lesson.formativeQuiz, { mode: 'formative', lessonId: lesson.id });

    // Tab 5: Final & Tahsili Quiz
    const p5 = document.getElementById('panel-final');
    p5.innerHTML = '';
    p5.appendChild(el('div', { className: 'section-title' }, [
      el('span', { text: 'التقويم النهائي وتجميعات التحصيلي' }),
      el('span', { className: 'page-ref', text: 'الكتاب المدرسي + تأسيس يلو' })
    ]));
    if (lesson.tahsiliTips && lesson.tahsiliTips.length) {
      const tCard = el('div', { className: 'tahsili-summary-card' }, [
        el('h3', { text: 'تنبيهات وقواعد التحصيلي (من كتاب تأسيس يلو للكيمياء)' })
      ]);
      const tList = el('ul', { className: 'clean-list' });
      lesson.tahsiliTips.forEach(function (tip) { tList.appendChild(el('li', { html: tip })); });
      tCard.appendChild(tList);
      p5.appendChild(tCard);
    }
    renderQuiz(p5, lesson.finalQuiz, { mode: 'final', lessonId: lesson.id });

    // Prev / Next Lesson Links
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
        navWrap.appendChild(el('a', { className: 'btn', href: prev.id + '.html', text: 'الدرس السابق: ' + prev.code + ' ' + prev.title }));
      } else {
        navWrap.appendChild(el('a', { className: 'btn', href: '../index.html', text: 'العودة للصفحة الرئيسية' }));
      }
      if (idx >= 0 && idx < flat.length - 1) {
        const next = flat[idx + 1];
        navWrap.appendChild(el('a', { className: 'btn btn-primary', href: next.id + '.html', text: 'الدرس التالي: ' + next.code + ' ' + next.title }));
      } else {
        navWrap.appendChild(el('a', { className: 'btn btn-primary', href: '../' + lesson.bookUrl, text: 'عرض فهرس ' + lesson.bookTitle }));
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTimer();
    initWhiteboard();
    initTabs();
    if (window.CURRENT_LESSON_ID && window.LESSONS_REGISTRY && window.LESSONS_REGISTRY[window.CURRENT_LESSON_ID]) {
      mountLesson(window.LESSONS_REGISTRY[window.CURRENT_LESSON_ID]);
    }
  });
})();
