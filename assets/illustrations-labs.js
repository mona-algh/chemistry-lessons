// Custom Labeled SVG Illustrations, Interactive Animated Video Explainers, and Virtual Labs
(function () {
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'className') node.className = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else if (k === 'text') node.textContent = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    if (Array.isArray(children)) {
      children.forEach(function (c) {
        if (c) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      });
    }
    return node;
  }

  function themePal() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      dark: dark,
      primary: dark ? '#5aa9ff' : '#2a7de1',
      green: dark ? '#34c77b' : '#0b8a4a',
      coral: dark ? '#ff7c54' : '#e4572e',
      violet: dark ? '#a78bfa' : '#7c5ce6',
      teal: dark ? '#3ccad6' : '#0e9aa7',
      gold: dark ? '#ffc93c' : '#d79b14',
      ink: dark ? '#f3f6ff' : '#1d2742',
      muted: dark ? '#aab8d6' : '#5d6886',
      wall: dark ? '#465d94' : '#cfc7b6',
      surface: dark ? '#18223b' : '#ffffff',
      tint: dark ? 'rgba(90,169,255,0.16)' : 'rgba(42,125,225,0.1)'
    };
  }

  /* ==================== 1. LABELED SCIENTIFIC ILLUSTRATIONS (SVG) ==================== */
  const ILLUSTRATIONS = {
    '6-1-0': '<svg viewBox="0 0 360 220" class="concept-svg" role="img" aria-label="تصادمات مرنة وحركة عشوائية لجسيمات الغاز">' +
      '<rect x="20" y="20" width="320" height="165" rx="16" fill="var(--surface-tint)" stroke="var(--primary)" stroke-width="3"/>' +
      '<circle cx="95" cy="82" r="14" fill="var(--primary)"/><circle cx="210" cy="118" r="14" fill="var(--coral)"/>' +
      '<circle cx="270" cy="65" r="12" fill="var(--green)"/><circle cx="145" cy="145" r="12" fill="var(--violet)"/>' +
      '<path d="M112 85 L155 102" stroke="var(--ink)" stroke-width="3" stroke-dasharray="5 4"/><polygon points="158,104 148,96 151,106" fill="var(--ink)"/>' +
      '<path d="M195 112 L162 94" stroke="var(--coral)" stroke-width="3"/><path d="M260 76 L232 104" stroke="var(--green)" stroke-width="2.5"/>' +
      '<text x="180" y="206" text-anchor="middle" font-size="13" font-weight="800" fill="var(--ink)">فراغات كبيرة · حركة مستمرة · تصادم مرن</text></svg>',

    '6-1-1': '<svg viewBox="0 0 360 220" class="concept-svg" role="img" aria-label="الانتشار والتدفق عبر ثقب صغير">' +
      '<rect x="25" y="45" width="145" height="115" rx="14" fill="var(--coral-l)" stroke="var(--coral)" stroke-width="3"/>' +
      '<rect x="190" y="45" width="145" height="115" rx="14" fill="var(--surface)" stroke="var(--primary)" stroke-width="3"/>' +
      '<rect x="166" y="92" width="28" height="22" fill="var(--bg)"/>' +
      '<circle cx="70" cy="80" r="8" fill="var(--coral)"/><circle cx="105" cy="120" r="8" fill="var(--coral)"/><circle cx="135" cy="95" r="8" fill="var(--coral)"/>' +
      '<path d="M148 103 H230" stroke="var(--primary)" stroke-width="3" class="anim-wire-flow"/><circle cx="248" cy="103" r="8" fill="var(--primary)"/>' +
      '<text x="97" y="34" text-anchor="middle" font-size="13" font-weight="800" fill="var(--coral)">تركيز مرتفع</text>' +
      '<text x="262" y="34" text-anchor="middle" font-size="13" font-weight="800" fill="var(--primary)">تدفق عبر ثقب ضيق</text>' +
      '<text x="180" y="195" text-anchor="middle" font-size="13" font-weight="800" fill="var(--ink)">الغاز الأخف يتدفق وينتشر بسرعة أكبر</text></svg>',

    '6-1-2': '<svg viewBox="0 0 360 220" class="concept-svg" role="img" aria-label="البارومتر والمانومتر وقانون دالتون">' +
      '<rect x="35" y="140" width="95" height="32" rx="8" fill="var(--gold-l)" stroke="var(--gold)" stroke-width="2.5"/>' +
      '<rect x="74" y="28" width="18" height="122" rx="9" fill="var(--surface)" stroke="var(--ink)" stroke-width="2.5"/>' +
      '<rect x="77" y="58" width="12" height="92" fill="var(--muted)"/>' +
      '<text x="82" y="196" text-anchor="middle" font-size="13" font-weight="800" fill="var(--ink)">البارومتر (760 mmHg)</text>' +
      '<circle cx="235" cy="90" r="36" fill="var(--surface-tint)" stroke="var(--primary)" stroke-width="3"/>' +
      '<path d="M268 102 V155 Q292 175 314 155 V75" fill="none" stroke="var(--ink)" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M276 138 V155 Q292 169 314 155 V105" fill="none" stroke="var(--coral)" stroke-width="6"/>' +
      '<text x="275" y="196" text-anchor="middle" font-size="13" font-weight="800" fill="var(--ink)">المانومتر (الغاز المحصور)</text></svg>',

    '6-2-0': '<svg viewBox="0 0 360 220" class="concept-svg" role="img" aria-label="الفرق بين القوى داخل الجزيء والقوى بين الجزيئات">' +
      '<rect x="30" y="42" width="120" height="62" rx="18" fill="var(--surface)" stroke="var(--primary)" stroke-width="2.5"/>' +
      '<circle cx="62" cy="73" r="16" fill="var(--primary)"/><circle cx="118" cy="73" r="11" fill="var(--coral)"/>' +
      '<line x1="78" y1="73" x2="107" y2="73" stroke="var(--ink)" stroke-width="5"/>' +
      '<rect x="210" y="42" width="120" height="62" rx="18" fill="var(--surface)" stroke="var(--primary)" stroke-width="2.5"/>' +
      '<circle cx="242" cy="73" r="16" fill="var(--primary)"/><circle cx="298" cy="73" r="11" fill="var(--coral)"/>' +
      '<line x1="258" y1="73" x2="287" y2="73" stroke="var(--ink)" stroke-width="5"/>' +
      '<line x1="154" y1="73" x2="206" y2="73" stroke="var(--green)" stroke-width="4" stroke-dasharray="6 5"/>' +
      '<text x="90" y="132" text-anchor="middle" font-size="13" font-weight="800" fill="var(--ink)">رابطة تساهمية قوية</text>' +
      '<text x="180" y="164" text-anchor="middle" font-size="13" font-weight="800" fill="var(--green)">قوى بين الجزيئات (تحدد الغليان)</text></svg>',

    '6-2-1': '<svg viewBox="0 0 360 220" class="concept-svg" role="img" aria-label="مقارنة التشتت وثنائية القطب والرابطة الهيدروجينية">' +
      '<rect x="24" y="28" width="94" height="140" rx="14" fill="var(--surface-muted)" stroke="var(--muted)" stroke-width="2"/>' +
      '<text x="71" y="62" text-anchor="middle" font-size="14" font-weight="900" fill="var(--ink)">تشتت لندن</text>' +
      '<text x="71" y="96" text-anchor="middle" font-size="12" font-weight="700" fill="var(--muted)">أقطاب لحظية</text>' +
      '<text x="71" y="128" text-anchor="middle" font-size="13" font-weight="800" fill="var(--primary)">CH₄ · I₂</text>' +
      '<rect x="133" y="28" width="94" height="140" rx="14" fill="var(--surface-tint)" stroke="var(--primary)" stroke-width="2"/>' +
      '<text x="180" y="62" text-anchor="middle" font-size="14" font-weight="900" fill="var(--primary)">ثنائية القطب</text>' +
      '<text x="180" y="96" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">δ⁺ ← δ⁻ دائمة</text>' +
      '<text x="180" y="128" text-anchor="middle" font-size="13" font-weight="800" fill="var(--primary)">HCl</text>' +
      '<rect x="242" y="28" width="94" height="140" rx="14" fill="var(--green-l)" stroke="var(--green)" stroke-width="2.5"/>' +
      '<text x="289" y="62" text-anchor="middle" font-size="14" font-weight="900" fill="var(--green)">هيدروجينية</text>' +
      '<text x="289" y="96" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">H مع F, O, N</text>' +
      '<text x="289" y="128" text-anchor="middle" font-size="13" font-weight="800" fill="var(--green)">H₂O · NH₃</text>' +
      '<path d="M40 194 H316" stroke="var(--coral)" stroke-width="3"/><polygon points="324,194 312,188 312,200" fill="var(--coral)"/>' +
      '<text x="180" y="213" text-anchor="middle" font-size="13" font-weight="800" fill="var(--coral)">تزداد قوة التجاذب ودرجة الغليان ←</text></svg>',

    '6-3-0': '<svg viewBox="0 0 360 220" class="concept-svg" role="img" aria-label="تقعر سطح الماء وتحدب الزئبق بفعل التماسك والتلاصق">' +
      '<rect x="52" y="34" width="84" height="146" rx="10" fill="var(--surface)" stroke="var(--ink)" stroke-width="3"/>' +
      '<path d="M55 82 Q94 114 133 82 L133 176 L55 176 Z" fill="var(--surface-tint)" stroke="var(--primary)" stroke-width="3"/>' +
      '<text x="94" y="204" text-anchor="middle" font-size="13" font-weight="800" fill="var(--primary)">الماء: التلاصق أكبر (مقعر)</text>' +
      '<rect x="224" y="34" width="84" height="146" rx="10" fill="var(--surface)" stroke="var(--ink)" stroke-width="3"/>' +
      '<path d="M227 98 Q266 64 305 98 L305 176 L227 176 Z" fill="var(--surface-muted)" stroke="var(--coral)" stroke-width="3"/>' +
      '<text x="266" y="204" text-anchor="middle" font-size="13" font-weight="800" fill="var(--coral)">الزئبق: التماسك أكبر (محدب)</text></svg>',

    '6-3-1': '<svg viewBox="0 0 360 220" class="concept-svg" role="img" aria-label="أنواع وحدة البناء البلورية الثلاثة">' +
      '<g transform="translate(22,36)"><rect x="10" y="24" width="60" height="60" fill="none" stroke="var(--primary)" stroke-width="2.5"/><rect x="28" y="8" width="60" height="60" fill="none" stroke="var(--primary)" stroke-width="2" stroke-dasharray="4 3"/><circle cx="10" cy="24" r="5" fill="var(--primary)"/><circle cx="70" cy="24" r="5" fill="var(--primary)"/><circle cx="10" cy="84" r="5" fill="var(--primary)"/><circle cx="70" cy="84" r="5" fill="var(--primary)"/><text x="48" y="114" text-anchor="middle" font-size="12" font-weight="800" fill="var(--ink)">مكعب بسيط</text></g>' +
      '<g transform="translate(132,36)"><rect x="10" y="24" width="60" height="60" fill="none" stroke="var(--violet)" stroke-width="2.5"/><rect x="28" y="8" width="60" height="60" fill="none" stroke="var(--violet)" stroke-width="2" stroke-dasharray="4 3"/><circle cx="49" cy="46" r="8" fill="var(--coral)"/><text x="48" y="114" text-anchor="middle" font-size="12" font-weight="800" fill="var(--ink)">مركزي الجسم</text></g>' +
      '<g transform="translate(242,36)"><rect x="10" y="24" width="60" height="60" fill="none" stroke="var(--green)" stroke-width="2.5"/><rect x="28" y="8" width="60" height="60" fill="none" stroke="var(--green)" stroke-width="2" stroke-dasharray="4 3"/><circle cx="40" cy="54" r="6" fill="var(--green)"/><circle cx="70" cy="54" r="5" fill="var(--green)"/><circle cx="40" cy="24" r="5" fill="var(--green)"/><text x="48" y="114" text-anchor="middle" font-size="12" font-weight="800" fill="var(--ink)">مركزي الوجه</text></g>' +
      '<text x="180" y="196" text-anchor="middle" font-size="13" font-weight="800" fill="var(--ink)">أصغر ترتيب للذرات يحمل تماثل الشبكة البلورية</text></svg>',

    '6-4-0': '<svg viewBox="0 0 360 220" class="concept-svg" role="img" aria-label="التحولات الستة الماصة والطاردة للحرارة">' +
      '<rect x="22" y="75" width="76" height="44" rx="12" fill="var(--surface-tint)" stroke="var(--primary)" stroke-width="2.5"/><text x="60" y="102" text-anchor="middle" font-size="15" font-weight="900" fill="var(--primary)">صلب</text>' +
      '<rect x="142" y="75" width="76" height="44" rx="12" fill="var(--green-l)" stroke="var(--green)" stroke-width="2.5"/><text x="180" y="102" text-anchor="middle" font-size="15" font-weight="900" fill="var(--green)">سائل</text>' +
      '<rect x="262" y="75" width="76" height="44" rx="12" fill="var(--coral-l)" stroke="var(--coral)" stroke-width="2.5"/><text x="300" y="102" text-anchor="middle" font-size="15" font-weight="900" fill="var(--coral)">غاز</text>' +
      '<path d="M98 70 Q180 26 262 70" fill="none" stroke="var(--coral)" stroke-width="3"/><text x="180" y="36" text-anchor="middle" font-size="12" font-weight="800" fill="var(--coral)">ماصة للحرارة: انصهار · تبخر · تسامي ←</text>' +
      '<path d="M262 124 Q180 168 98 124" fill="none" stroke="var(--primary)" stroke-width="3"/><text x="180" y="176" text-anchor="middle" font-size="12" font-weight="800" fill="var(--primary)">→ طاردة للحرارة: تكاثف · تجمد · ترسب</text></svg>',

    '6-4-1': '<svg viewBox="0 0 360 220" class="concept-svg" role="img" aria-label="مخطط الطور والنقطة الثلاثية والنقطة الحرجة">' +
      '<line x1="48" y1="26" x2="48" y2="178" stroke="var(--ink)" stroke-width="3"/>' +
      '<line x1="48" y1="178" x2="328" y2="178" stroke="var(--ink)" stroke-width="3"/>' +
      '<line x1="60" y1="170" x2="128" y2="132" stroke="var(--primary)" stroke-width="3"/>' +
      '<line x1="128" y1="132" x2="112" y2="34" stroke="var(--primary)" stroke-width="3"/>' +
      '<path d="M128 132 Q225 102 275 52" fill="none" stroke="var(--coral)" stroke-width="3"/>' +
      '<circle cx="128" cy="132" r="7" fill="var(--green)"/><text x="150" y="152" font-size="12" font-weight="800" fill="var(--green)">النقطة الثلاثية</text>' +
      '<circle cx="275" cy="52" r="7" fill="var(--coral)"/><text x="260" y="38" text-anchor="middle" font-size="12" font-weight="800" fill="var(--coral)">النقطة الحرجة</text>' +
      '<text x="82" y="75" font-size="13" font-weight="800" fill="var(--primary)">صلب</text>' +
      '<text x="172" y="75" font-size="13" font-weight="800" fill="var(--teal)">سائل</text>' +
      '<text x="255" y="145" font-size="13" font-weight="800" fill="var(--coral)">غاز</text></svg>',

    '7-1-0': '<svg viewBox="0 0 360 220" class="concept-svg" role="img" aria-label="علاقات بويل وشارل وجاي لوساك">' +
      '<rect x="20" y="25" width="98" height="145" rx="12" fill="var(--surface-tint)" stroke="var(--primary)" stroke-width="2.5"/>' +
      '<text x="69" y="54" text-anchor="middle" font-size="14" font-weight="900" fill="var(--primary)">بويل</text>' +
      '<path d="M40 135 Q55 82 98 72" fill="none" stroke="var(--primary)" stroke-width="3.5"/>' +
      '<text x="69" y="156" text-anchor="middle" font-size="12" font-weight="800" fill="var(--ink)">P و V عكسياً</text>' +
      '<rect x="131" y="25" width="98" height="145" rx="12" fill="var(--green-l)" stroke="var(--green)" stroke-width="2.5"/>' +
      '<text x="180" y="54" text-anchor="middle" font-size="14" font-weight="900" fill="var(--green)">شارل</text>' +
      '<line x1="150" y1="132" x2="210" y2="75" stroke="var(--green)" stroke-width="3.5"/>' +
      '<text x="180" y="156" text-anchor="middle" font-size="12" font-weight="800" fill="var(--ink)">V و T(K) طردياً</text>' +
      '<rect x="242" y="25" width="98" height="145" rx="12" fill="var(--coral-l)" stroke="var(--coral)" stroke-width="2.5"/>' +
      '<text x="291" y="54" text-anchor="middle" font-size="14" font-weight="900" fill="var(--coral)">جاي-لوساك</text>' +
      '<line x1="262" y1="132" x2="320" y2="75" stroke="var(--coral)" stroke-width="3.5"/>' +
      '<text x="291" y="156" text-anchor="middle" font-size="12" font-weight="800" fill="var(--ink)">P و T(K) طردياً</text></svg>',

    '7-2-0': '<svg viewBox="0 0 360 220" class="concept-svg" role="img" aria-label="الحجم المولاري للغازات عند STP يساوي 22.4 لتر">' +
      '<rect x="35" y="42" width="110" height="110" rx="14" fill="var(--surface-tint)" stroke="var(--primary)" stroke-width="3"/>' +
      '<text x="90" y="88" text-anchor="middle" font-size="18" font-weight="900" fill="var(--primary)">1 mol He</text>' +
      '<text x="90" y="116" text-anchor="middle" font-size="14" font-weight="800" fill="var(--ink)">22.4 L (STP)</text>' +
      '<text x="180" y="102" text-anchor="middle" font-size="24" font-weight="900" fill="var(--green)">=</text>' +
      '<rect x="215" y="42" width="110" height="110" rx="14" fill="var(--green-l)" stroke="var(--green)" stroke-width="3"/>' +
      '<text x="270" y="88" text-anchor="middle" font-size="18" font-weight="900" fill="var(--green)">1 mol CO₂</text>' +
      '<text x="270" y="116" text-anchor="middle" font-size="14" font-weight="800" fill="var(--ink)">22.4 L (STP)</text>' +
      '<text x="180" y="192" text-anchor="middle" font-size="12.5" font-weight="800" fill="var(--ink)">الحجوم المتساوية تحوي العدد نفسه من الجسيمات</text></svg>',

    '7-2-1': '<svg viewBox="0 0 360 220" class="concept-svg" role="img" aria-label="مثلث قانون الغاز المثالي PV=nRT">' +
      '<rect x="40" y="34" width="280" height="68" rx="16" fill="var(--primary)"/><text x="180" y="76" text-anchor="middle" font-size="26" font-weight="900" fill="#fff" direction="ltr">P V = n R T</text>' +
      '<rect x="40" y="122" width="130" height="62" rx="12" fill="var(--gold-l)" stroke="var(--gold)" stroke-width="2"/><text x="105" y="158" text-anchor="middle" font-size="15" font-weight="900" fill="var(--ink)" direction="ltr">M = mRT / PV</text>' +
      '<rect x="190" y="122" width="130" height="62" rx="12" fill="var(--teal-l)" stroke="var(--teal)" stroke-width="2"/><text x="255" y="158" text-anchor="middle" font-size="15" font-weight="900" fill="var(--ink)" direction="ltr">D = MP / RT</text></svg>',

    '7-2-2': '<svg viewBox="0 0 360 220" class="concept-svg" role="img" aria-label="الغاز المثالي مقابل الغاز الحقيقي عند الضغط المرتفع">' +
      '<rect x="24" y="36" width="142" height="122" rx="14" fill="var(--green-l)" stroke="var(--green)" stroke-width="2.5"/>' +
      '<circle cx="60" cy="75" r="5" fill="var(--green)"/><circle cx="122" cy="118" r="5" fill="var(--green)"/>' +
      '<text x="95" y="180" text-anchor="middle" font-size="13" font-weight="800" fill="var(--green)">مثالي: ضغط منخفض وحرارة عالية</text>' +
      '<rect x="194" y="36" width="142" height="122" rx="14" fill="var(--coral-l)" stroke="var(--coral)" stroke-width="2.5"/>' +
      '<circle cx="242" cy="96" r="14" fill="var(--coral)"/><circle cx="282" cy="100" r="14" fill="var(--coral)"/>' +
      '<line x1="256" y1="98" x2="268" y2="98" stroke="var(--ink)" stroke-width="3" stroke-dasharray="3 3"/>' +
      '<text x="265" y="180" text-anchor="middle" font-size="13" font-weight="800" fill="var(--coral)">حقيقي: يزداد الحجم والتجاذب</text></svg>',

    '7-3-0': '<svg viewBox="0 0 360 220" class="concept-svg" role="img" aria-label="النسبة الحجمية 1 الى 3 الى 2 لتكون الأمونيا">' +
      '<rect x="22" y="54" width="60" height="84" rx="10" fill="var(--surface-tint)" stroke="var(--primary)" stroke-width="3"/><text x="52" y="102" text-anchor="middle" font-size="15" font-weight="900" fill="var(--primary)">1 L N₂</text>' +
      '<text x="96" y="104" text-anchor="middle" font-size="22" font-weight="900" fill="var(--ink)">+</text>' +
      '<rect x="110" y="36" width="96" height="102" rx="10" fill="var(--coral-l)" stroke="var(--coral)" stroke-width="3"/><text x="158" y="96" text-anchor="middle" font-size="15" font-weight="900" fill="var(--coral)">3 L H₂</text>' +
      '<text x="226" y="104" text-anchor="middle" font-size="24" font-weight="900" fill="var(--ink)">→</text>' +
      '<rect x="246" y="45" width="90" height="93" rx="10" fill="var(--green-l)" stroke="var(--green)" stroke-width="3"/><text x="291" y="98" text-anchor="middle" font-size="15" font-weight="900" fill="var(--green)">2 L NH₃</text>' +
      '<text x="180" y="186" text-anchor="middle" font-size="13" font-weight="800" fill="var(--ink)">المعاملات الموزونة تمثل نسب المولات ونسب الحجوم للغازات</text></svg>',

    '7-3-1': '<svg viewBox="0 0 360 220" class="concept-svg" role="img" aria-label="خطوات حساب الكتلة والحجم بالغاز المثالي">' +
      '<rect x="20" y="64" width="92" height="58" rx="12" fill="var(--gold-l)" stroke="var(--gold)" stroke-width="2.5"/><text x="66" y="98" text-anchor="middle" font-size="14" font-weight="900" fill="var(--ink)">كتلة / حجم A</text>' +
      '<text x="126" y="100" text-anchor="middle" font-size="22" font-weight="900" fill="var(--primary)">→</text>' +
      '<rect x="138" y="64" width="84" height="58" rx="12" fill="var(--surface-tint)" stroke="var(--primary)" stroke-width="2.5"/><text x="180" y="98" text-anchor="middle" font-size="14" font-weight="900" fill="var(--primary)">نسبة مولية</text>' +
      '<text x="236" y="100" text-anchor="middle" font-size="22" font-weight="900" fill="var(--green)">→</text>' +
      '<rect x="248" y="64" width="92" height="58" rx="12" fill="var(--green-l)" stroke="var(--green)" stroke-width="2.5"/><text x="294" y="98" text-anchor="middle" font-size="14" font-weight="900" fill="var(--green)">PV = nRT</text>' +
      '<text x="180" y="176" text-anchor="middle" font-size="13" font-weight="800" fill="var(--ink)">خريطة الحل من المعطى إلى حجم الغاز عند أي ظروف T و P</text></svg>',

    '4-1-0': '<svg viewBox="0 0 360 220" class="concept-svg" role="img" aria-label="الخلية الجلفانية ومكوناتها">' +
      '<path d="M90 78 V32 H270 V78" fill="none" stroke="var(--ink)" stroke-width="4"/>' +
      '<path d="M90 78 V32 H270 V78" fill="none" stroke="var(--coral)" stroke-width="3" class="anim-wire-flow"/>' +
      '<circle cx="180" cy="32" r="18" fill="var(--surface)" stroke="var(--primary)" stroke-width="3"/><text x="180" y="37" text-anchor="middle" font-size="13" font-weight="900" fill="var(--primary)">V</text>' +
      '<path d="M122 128 V86 H238 V128" fill="none" stroke="var(--violet)" stroke-width="14" stroke-linecap="round" opacity="0.4"/>' +
      '<rect x="40" y="102" width="104" height="80" rx="10" fill="var(--coral-l)" stroke="var(--border-strong)" stroke-width="2.5"/>' +
      '<rect x="216" y="102" width="104" height="80" rx="10" fill="var(--surface-tint)" stroke="var(--border-strong)" stroke-width="2.5"/>' +
      '<rect x="82" y="74" width="16" height="88" rx="3" fill="#7a8899"/><rect x="262" y="74" width="16" height="88" rx="3" fill="#c87533"/>' +
      '<text x="90" y="204" text-anchor="middle" font-size="13" font-weight="900" fill="var(--coral)">الأنود (-): أكسدة</text>' +
      '<text x="270" y="204" text-anchor="middle" font-size="13" font-weight="900" fill="var(--primary)">الكاثود (+): اختزال</text></svg>',

    '4-1-1': '<svg viewBox="0 0 360 220" class="concept-svg" role="img" aria-label="سلسلة جهود الاختزال القياسية وحساب جهد الخلية">' +
      '<rect x="40" y="28" width="280" height="46" rx="12" fill="var(--primary)"/><text x="180" y="57" text-anchor="middle" font-size="17" font-weight="900" fill="#fff" direction="ltr">E°cell = E°cathode - E°anode</text>' +
      '<rect x="40" y="92" width="130" height="72" rx="12" fill="var(--green-l)" stroke="var(--green)" stroke-width="2.5"/>' +
      '<text x="105" y="122" text-anchor="middle" font-size="15" font-weight="900" fill="var(--green)">E°cell &gt; 0</text>' +
      '<text x="105" y="146" text-anchor="middle" font-size="13" font-weight="800" fill="var(--ink)">تفاعل تلقائي ✓</text>' +
      '<rect x="190" y="92" width="130" height="72" rx="12" fill="var(--coral-l)" stroke="var(--coral)" stroke-width="2.5"/>' +
      '<text x="255" y="122" text-anchor="middle" font-size="15" font-weight="900" fill="var(--coral)">E°cell &lt; 0</text>' +
      '<text x="255" y="146" text-anchor="middle" font-size="13" font-weight="800" fill="var(--ink)">غير تلقائي ✗</text></svg>',

    '4-2-0': '<svg viewBox="0 0 360 220" class="concept-svg" role="img" aria-label="الفرق بين البطاريات الأولية والثانوية">' +
      '<rect x="26" y="42" width="144" height="128" rx="16" fill="var(--gold-l)" stroke="var(--gold)" stroke-width="2.5"/>' +
      '<text x="98" y="76" text-anchor="middle" font-size="15" font-weight="900" fill="var(--accent)">أولية (لا تُشحن)</text>' +
      '<text x="98" y="110" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">الجافة · القلوية · الفضة</text>' +
      '<text x="98" y="140" text-anchor="middle" font-size="12" font-weight="700" fill="var(--muted)">تفاعل غير عكسي</text>' +
      '<rect x="190" y="42" width="144" height="128" rx="16" fill="var(--green-l)" stroke="var(--green)" stroke-width="2.5"/>' +
      '<text x="262" y="76" text-anchor="middle" font-size="15" font-weight="900" fill="var(--green)">ثانوية (تُشحن)</text>' +
      '<text x="262" y="110" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">المركم الرصاصي · الليثيوم</text>' +
      '<text x="262" y="140" text-anchor="middle" font-size="12" font-weight="700" fill="var(--muted)">تفاعل عكسي بالشحن ↻</text></svg>',

    '4-2-1': '<svg viewBox="0 0 360 220" class="concept-svg" role="img" aria-label="حماية الحديد بالجلفنة والأنود المضحي">' +
      '<rect x="38" y="64" width="115" height="62" rx="12" fill="var(--coral-l)" stroke="var(--coral)" stroke-width="3"/>' +
      '<text x="95" y="100" text-anchor="middle" font-size="14" font-weight="900" fill="var(--coral)">أنود مضحّي Mg/Zn</text>' +
      '<path d="M153 95 H208" stroke="var(--primary)" stroke-width="5" class="anim-wire-flow"/>' +
      '<rect x="208" y="64" width="115" height="62" rx="12" fill="var(--green-l)" stroke="var(--green)" stroke-width="3"/>' +
      '<text x="265" y="100" text-anchor="middle" font-size="14" font-weight="900" fill="var(--green)">حديد محمي Fe</text>' +
      '<text x="180" y="172" text-anchor="middle" font-size="12.5" font-weight="800" fill="var(--ink)">يتأكسد الفلز الأنشط بدلاً من الحديد لحمايته</text></svg>',

    '4-3-0': '<svg viewBox="0 0 360 220" class="concept-svg" role="img" aria-label="خلية التحليل الكهربائي القسرية بمصدر تيار خارجي">' +
      '<rect x="135" y="18" width="90" height="32" rx="8" fill="var(--coral)"/><text x="180" y="39" text-anchor="middle" font-size="13" font-weight="900" fill="#fff">تيار DC خارجي</text>' +
      '<path d="M135 34 H92 V78 M225 34 H268 V78" fill="none" stroke="var(--ink)" stroke-width="3.5"/>' +
      '<rect x="52" y="72" width="256" height="106" rx="14" fill="var(--surface-tint)" stroke="var(--primary)" stroke-width="2.5"/>' +
      '<rect x="84" y="62" width="18" height="86" rx="3" fill="var(--coral)"/><rect x="258" y="62" width="18" height="86" rx="3" fill="var(--green)"/>' +
      '<text x="93" y="198" text-anchor="middle" font-size="13" font-weight="900" fill="var(--coral)">الأنود (+): أكسدة</text>' +
      '<text x="267" y="198" text-anchor="middle" font-size="13" font-weight="900" fill="var(--green)">الكاثود (-): اختزال</text></svg>',

    '4-3-1': '<svg viewBox="0 0 360 220" class="concept-svg" role="img" aria-label="الطلاء الكهربائي واستخلاص الصوديوم والألومنيوم">' +
      '<rect x="24" y="42" width="96" height="118" rx="14" fill="var(--surface-tint)" stroke="var(--primary)" stroke-width="2"/><text x="72" y="88" text-anchor="middle" font-size="14" font-weight="900" fill="var(--primary)">خلية داون</text><text x="72" y="116" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">Na + Cl₂</text>' +
      '<rect x="132" y="42" width="96" height="118" rx="14" fill="var(--violet-l)" stroke="var(--violet)" stroke-width="2"/><text x="180" y="88" text-anchor="middle" font-size="14" font-weight="900" fill="var(--violet)">هول-هيروليت</text><text x="180" y="116" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">استخلاص Al</text>' +
      '<rect x="240" y="42" width="96" height="118" rx="14" fill="var(--gold-l)" stroke="var(--gold)" stroke-width="2"/><text x="288" y="88" text-anchor="middle" font-size="14" font-weight="900" fill="var(--accent)">الطلاء الكهربائي</text><text x="288" y="116" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">طلاء Ag بالكاثود</text></svg>'
  };

  /* ==================== 2. INTERACTIVE ANIMATED EXPLAINER VIDEOS ==================== */
  const VIDEOS = {
    '6-1': {
      title: 'فيديو تفاعلي: حركة الغاز والانتشار والضغط',
      scenes: [
        { label: '1. النظرية الحركية', term: 'التصادم المرن', anim: 'gas-bounce', caption: 'تتحرك جسيمات الغاز باستمرار في خطوط مستقيمة وتتصادم تصادماً مرناً دون فقدان للطاقة الحركية.' },
        { label: '2. الانتشار والتدفق', term: 'قانون جراهام', anim: 'gas-diffuse', caption: 'الغاز الأخف ذو الكتلة المولية الأقل يندفع وينتشر أسرع عبر الحيز أو عبر الثقوب الضيقة.' },
        { label: '3. ضغط الغاز', term: 'الضغط الجزيئي', anim: 'gas-pressure', caption: 'كلما زادت اصطدامات الجسيمات بجدار الوعاء ارتفع الضغط المقيس بالبارومتر أو المانومتر.' }
      ]
    },
    '6-2': {
      title: 'فيديو تفاعلي: كيف تتجاذب الجزيئات وتغلي السوائل؟',
      scenes: [
        { label: '1. قوى التشتت', term: 'ثنائية قطبية لحظية', anim: 'imf-dispersion', caption: 'تتحرك السحابة الإلكترونية لحظياً فتنتج أقطاباً مؤقتة ضعيفة تجذب الجزيئات غير القطبية.' },
        { label: '2. ثنائية القطب', term: 'التجاذب القطبي الدائم', anim: 'imf-dipole', caption: 'يتجاذب الطرف الموجب الجزئي في جزيء قطبي مع الطرف السالب الجزئي في الجزيء المجاور.' },
        { label: '3. الرابطة الهيدروجينية', term: 'ترابط F, O, N مع H', anim: 'imf-hbond', caption: 'أقوى قوى التجاذب بين الجزيئات، وترفع درجة غليان الماء مقارنة بالمركبات المشابهة.' }
      ]
    },
    '6-3': {
      title: 'فيديو تفاعلي: من اللزوجة والتوتر السطحي إلى البلورات',
      scenes: [
        { label: '1. الميوعة واللزوجة', term: 'اللزوجة', anim: 'liquid-flow', caption: 'انسياب السوائل يقل عند زيادة التجاذب أو انخفاض الحرارة فتزداد مقاومتها للتدفق.' },
        { label: '2. التوتر السطحي', term: 'التماسك والتلاصق', anim: 'surface-tension', caption: 'تنشدّ جسيمات السطح للداخل والأسفل مكونة غشاءً مرناً يحمل الأجسام الخفيفة.' },
        { label: '3. البنية البلورية', term: 'وحدة البناء', anim: 'crystal-lattice', caption: 'تترتب جسيمات المواد الصلبة المتبلورة في شبكة ثلاثية الأبعاد متكررة ومنتظمة.' }
      ]
    },
    '6-4': {
      title: 'فيديو تفاعلي: تحولات الطاقة ومخطط الطور',
      scenes: [
        { label: '1. التحولات الماصة', term: 'الانصهار والتبخر والتسامي', anim: 'phase-heat', caption: 'يمتص الجليد والماء حرارة لكسر قوى التجاذب والانتقال إلى الحالة الأعلى طاقة.' },
        { label: '2. التحولات الطاردة', term: 'التكاثف والتجمد والترسب', anim: 'phase-cool', caption: 'تفقد الجسيمات طاقتها فتتقارب وتنتظم وتطلق حرارة إلى الوسط المحيط.' },
        { label: '3. النقطتان الثلاثية والحرجة', term: 'النقطة الثلاثية', anim: 'phase-triple', caption: 'عند 0.01°C و0.006 atm تتزن حالات الماء الثلاث معاً في لحظة واحدة.' }
      ]
    },
    '7-1': {
      title: 'فيديو تفاعلي: سلوك المكبس تحت تأثير الضغط والحرارة',
      scenes: [
        { label: '1. قانون بويل', term: 'تناسب عكسي (P × V)', anim: 'boyle-piston', caption: 'عند دفع المكبس يقل الحجم فتتقارب الجسيمات وتزيد التصادمات ويرتفع الضغط.' },
        { label: '2. قانون شارل', term: 'تناسب طردي (V / T)', anim: 'charles-expand', caption: 'تسخين الغاز يزيد طاقة جسيماته فتدفع المكبس للخارج ويزداد الحجم عند ثبوت الضغط.' },
        { label: '3. جاي-لوساك', term: 'تناسب طردي (P / T)', anim: 'gay-heat', caption: 'مع تثبيت الحجم يرفع التسخين سرعة التصادمات فيقفز الضغط بحدة (تحذير العبوات المضغوطة).' }
      ]
    },
    '7-2': {
      title: 'فيديو تفاعلي: مبدأ أفوجادرو والغاز المثالي مقابل الحقيقي',
      scenes: [
        { label: '1. مبدأ أفوجادرو', term: '22.4 L لكل 1 mol', anim: 'avogadro-moles', caption: 'مول واحد من أي غاز يشغل الحجم نفسه (22.4 L) عند STP مهما اختلف نوعه.' },
        { label: '2. الغاز المثالي', term: 'PV = nRT', anim: 'ideal-chamber', caption: 'يربط القانون العام الضغط والحجم والمولات والحرارة في معادلة واحدة دقيقة.' },
        { label: '3. الحيود الحقيقي', term: 'الضغط العالي والبرودة', anim: 'real-deviation', caption: 'عند الضغط العالي تتقارب الجزيئات وتظهر قوى التجاذب الحقيقية وحجم الجسيمات.' }
      ]
    },
    '7-3': {
      title: 'فيديو تفاعلي: حسابات الحجوم في التفاعلات الغازية',
      scenes: [
        { label: '1. النسب الحجمية', term: 'معاملات المعادلة الموزونة', anim: 'stoich-volumes', caption: 'حجم 1 L من النيتروجين يتفاعل بالضبط مع 3 L هيدروجين لإنتاج 2 L أمونيا.' },
        { label: '2. تحويل الكتلة للحجم', term: 'خطوة المولات الوسيطة', anim: 'stoich-moles', caption: 'نحوّل كتلة المتفاعل إلى مولات ثم نحسب مولات الغاز ونعوض في PV = nRT.' },
        { label: '3. تطبيق الأمان (الوسادة الهوائية)', term: 'توليد N₂ السريع', anim: 'airbag-deploy', caption: 'تحلل أزيد الصوديوم يحرر كمية محسوبة بدقة من غاز النيتروجين في أجزاء من الثانية.' }
      ]
    },
    '4-1': {
      title: 'فيديو تفاعلي: رحلة الإلكترونات والأيونات في الخلية الجلفانية',
      scenes: [
        { label: '1. الأكسدة عند الأنود', term: 'الأنود (القطب السالب)', anim: 'galv-anode', caption: 'تفقد ذرات الخارصين Zn إلكتروناتها وتذوب أيونات Zn²⁺ في المحلول فتقل كتلة الشريحة.' },
        { label: '2. سريان الإلكترونات والقنطرة', term: 'القنطرة الملحية', anim: 'galv-flow', caption: 'تسري الإلكترونات في السلك إلى النحاس بينما تتحرك الأيونات في القنطرة لحفظ التعادل.' },
        { label: '3. الاختزال عند الكاثود', term: 'الكاثود (القطب الموجب)', anim: 'galv-cathode', caption: 'تكتسب أيونات Cu²⁺ الإلكترونات وتترسب ذرات نحاس صلبة فتزداد كتلة الكاثود.' }
      ]
    },
    '4-2': {
      title: 'فيديو تفاعلي: كيف تحمي البطاريات والمعادن نفسها؟',
      scenes: [
        { label: '1. خلية أولية مقابل ثانوية', term: 'البطارية الثانوية', anim: 'bat-recharge', caption: 'التفاعلات العكسية في بطاريات السيارات والهواتف تسمح بإعادة شحنها مراراً.' },
        { label: '2. خلية الوقود النظيفة', term: 'وقود H₂ و O₂', anim: 'fuel-cell', caption: 'تتفاعل تغذية مستمرة من الهيدروجين والأكسجين لإنتاج الكهرباء وماء نقي فقط.' },
        { label: '3. الجلفنة والأنود المضحي', term: 'الحماية المهبطية', anim: 'cathodic-guard', caption: 'يتآكل الخارصين أو المغنيسيوم الأنشط تلقائياً ويمنح إلكتروناته للحديد كي لا يصدأ.' }
      ]
    },
    '4-3': {
      title: 'فيديو تفاعلي: قسر التفاعل غير التلقائي بالتيار الكهربائي',
      scenes: [
        { label: '1. دفع الإلكترونات قسرياً', term: 'التحليل الكهربائي', anim: 'elec-force', caption: 'يجبر مصدر الجهد الكهربائي الإلكترونات على الانتقال في الاتجاه غير التلقائي.' },
        { label: '2. مصهور NaCl مقابل ماء البحر', term: 'خلية داون', anim: 'elec-nacl', caption: 'مصهور NaCl يُنتج صوديوم نقي وكلور، بينما في ماء البحر يُختزل الماء إلى غاز H₂.' },
        { label: '3. الطلاء الكهربائي', term: 'الطلاء بالكاثود (-)', anim: 'elec-plate', caption: 'تنجذب أيونات الفلز الموجبة نحو القطعة المراد طلاؤها عند الكاثود وتكسوها بطبقة لامعة.' }
      ]
    }
  };

  function createInteractiveVideoNode(lesson) {
    const data = VIDEOS[lesson.id] || VIDEOS['6-1'];
    const wrap = el('div', { className: 'video-player-box' });

    const topBar = el('div', { className: 'video-controls-bar' });
    const playBtn = el('button', { type: 'button', className: 'btn btn-sm btn-primary', text: '⏸ إيقاف مؤقت' });
    const replayBtn = el('button', { type: 'button', className: 'btn btn-sm', text: '↺ إعادة العرض' });
    const statusPill = el('span', { className: 'sim-pill', text: 'عرض تفاعلي متحرك' });
    topBar.appendChild(playBtn);
    topBar.appendChild(replayBtn);
    topBar.appendChild(statusPill);

    const stepTabs = el('div', { className: 'video-steps-bar' });
    const canvasWrap = el('div', { className: 'sim-canvas-wrap' });
    const canvas = el('canvas', { width: '680', height: '215' });
    const progTrack = el('div', { className: 'video-progress-track' }, [el('div', { className: 'video-progress-fill' })]);
    const progFill = progTrack.firstChild;
    const captionBox = el('div', { className: 'video-caption-box' });

    canvasWrap.appendChild(canvas);
    canvasWrap.appendChild(progTrack);
    canvasWrap.appendChild(captionBox);
    wrap.appendChild(topBar);
    wrap.appendChild(stepTabs);
    wrap.appendChild(canvasWrap);

    let sceneIdx = 0;
    let playing = true;
    let sceneElapsed = 0;
    const SCENE_MS = 5500;
    let lastTs = performance.now();

    const stepBtns = data.scenes.map(function (sc, idx) {
      const b = el('button', { type: 'button', className: 'btn btn-sm' + (idx === 0 ? ' btn-primary' : ''), text: sc.label });
      b.addEventListener('click', function () {
        sceneIdx = idx;
        sceneElapsed = 0;
        updateSceneUI();
      });
      stepTabs.appendChild(b);
      return b;
    });

    function updateSceneUI() {
      const sc = data.scenes[sceneIdx];
      stepBtns.forEach(function (b, i) { b.classList.toggle('btn-primary', i === sceneIdx); });
      captionBox.innerHTML = '<span class="video-term-badge">' + sc.term + '</span> <span>' + sc.caption + '</span>';
    }
    updateSceneUI();

    playBtn.addEventListener('click', function () {
      playing = !playing;
      playBtn.textContent = playing ? '⏸ إيقاف مؤقت' : '▶ تشغيل العرض';
      lastTs = performance.now();
    });
    replayBtn.addEventListener('click', function () {
      sceneIdx = 0;
      sceneElapsed = 0;
      playing = true;
      playBtn.textContent = '⏸ إيقاف مؤقت';
      updateSceneUI();
    });

    const dots = Array.from({ length: 24 }, function (_, i) {
      return {
        x: (i % 6) * 0.12 + 0.14,
        y: Math.floor(i / 6) * 0.18 + 0.18,
        vx: (Math.random() - 0.5) * 0.012,
        vy: (Math.random() - 0.5) * 0.014,
        ph: i * 0.7
      };
    });

    const ctx = canvas.getContext('2d');
    function frame(now) {
      if (!document.body.contains(canvas)) return;
      const dt = Math.min(80, now - lastTs);
      lastTs = now;
      if (playing) {
        sceneElapsed += dt;
        if (sceneElapsed >= SCENE_MS) {
          sceneElapsed = 0;
          sceneIdx = (sceneIdx + 1) % data.scenes.length;
          updateSceneUI();
        }
      }
      const pct = ((sceneIdx + sceneElapsed / SCENE_MS) / data.scenes.length) * 100;
      progFill.style.width = Math.min(100, pct) + '%';

      const pal = themePal();
      const sc = data.scenes[sceneIdx];
      const W = canvas.width, H = canvas.height;
      const t = now * 0.004;
      ctx.clearRect(0, 0, W, H);

      // Draw rich scene-specific phenomenon animation
      ctx.fillStyle = pal.tint;
      ctx.fillRect(24, 14, W - 48, H - 28);
      ctx.strokeStyle = pal.primary;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(24, 14, W - 48, H - 28);

      if (sc.anim.indexOf('galv') === 0 || sc.anim.indexOf('elec') === 0 || sc.anim === 'cathodic-guard' || sc.anim === 'fuel-cell') {
        // Electrochemical animated scene: two electrodes + flowing electron sparks
        ctx.fillStyle = pal.surface;
        ctx.fillRect(105, 92, 165, 96);
        ctx.fillRect(410, 92, 165, 96);
        ctx.strokeStyle = pal.wall;
        ctx.strokeRect(105, 92, 165, 96);
        ctx.strokeRect(410, 92, 165, 96);
        ctx.fillStyle = pal.coral;
        ctx.fillRect(172, 62, 24, 108);
        ctx.fillStyle = pal.green;
        ctx.fillRect(484, 62, 24, 108);
        ctx.strokeStyle = pal.ink;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(184, 62); ctx.lineTo(184, 34); ctx.lineTo(496, 34); ctx.lineTo(496, 62);
        ctx.stroke();

        for (let k = 0; k < 5; k++) {
          const prog = ((t * 0.45 + k * 0.2) % 1);
          const ex = 184 + prog * 312;
          ctx.beginPath();
          ctx.arc(ex, 34, 6.5, 0, Math.PI * 2);
          ctx.fillStyle = pal.gold;
          ctx.fill();
        }
        ctx.fillStyle = pal.ink;
        ctx.font = 'bold 14px Tajawal, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('e⁻ حركة الإلكترونات عبر السلك', W / 2, 58);
      } else if (sc.anim.indexOf('boyle') === 0 || sc.anim.indexOf('charles') === 0 || sc.anim.indexOf('gay') === 0) {
        // Animated piston oscillation
        const osc = sc.anim === 'gay-heat' ? 0.52 : (0.42 + Math.sin(t * 0.7) * 0.18);
        const pw = (W - 140) * osc;
        ctx.fillStyle = pal.surface;
        ctx.fillRect(50, 44, pw, 126);
        ctx.fillStyle = pal.coral;
        ctx.fillRect(50 + pw, 38, 16, 138);
        dots.slice(0, 18).forEach(function (d, idx) {
          const px = 64 + (((d.x * 2 + Math.sin(t * 1.4 + idx)) * 0.5 + 0.5) % 0.85) * (pw - 24);
          const py = 56 + (((d.y * 2 + Math.cos(t * 1.6 + idx)) * 0.5 + 0.5) % 0.85) * 100;
          ctx.beginPath();
          ctx.arc(px, py, 6.5, 0, Math.PI * 2);
          ctx.fillStyle = sc.anim === 'gay-heat' ? pal.coral : pal.primary;
          ctx.fill();
        });
      } else {
        // Kinetic / diffusion / phase / IMF particle animation
        const spd = (sc.anim === 'crystal-lattice' || sc.anim === 'phase-cool') ? 0.22 : 1.15;
        dots.forEach(function (d, idx) {
          d.x += d.vx * spd * (playing ? 1 : 0);
          d.y += d.vy * spd * (playing ? 1 : 0);
          if (d.x < 0.08 || d.x > 0.92) d.vx *= -1;
          if (d.y < 0.14 || d.y > 0.86) d.vy *= -1;
          const px = 24 + (sc.anim === 'crystal-lattice' ? ((idx % 6) * 0.08 + 0.3 + Math.sin(t * 2 + idx) * 0.006) : d.x) * (W - 48);
          const py = 14 + (sc.anim === 'crystal-lattice' ? (Math.floor(idx / 6) * 0.16 + 0.22 + Math.cos(t * 2 + idx) * 0.006) : d.y) * (H - 28);
          ctx.beginPath();
          ctx.arc(px, py, 8.5, 0, Math.PI * 2);
          ctx.fillStyle = idx % 3 === 0 ? pal.coral : idx % 2 === 0 ? pal.green : pal.primary;
          ctx.fill();
        });
      }

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return wrap;
  }

  /* ==================== 3. VIRTUAL LABS (المعمل الافتراضي) ==================== */
  function createVirtualLabNode(simType) {
    if (!simType) return null;
    const box = el('div', { className: 'sim-box' });

    if (simType === 'galvanic-cell') {
      // Multi-step Galvanic Cell Virtual Lab (inspired by user's Galvanic Cell reference!)
      const halfCells = [
        { name: 'Mg²⁺ | Mg', e: -2.372, ion: 'Mg²⁺', metal: 'Mg', col: '#9BA5B4' },
        { name: 'Zn²⁺ | Zn', e: -0.762, ion: 'Zn²⁺', metal: 'Zn', col: '#7A8899' },
        { name: 'Fe²⁺ | Fe', e: -0.447, ion: 'Fe²⁺', metal: 'Fe', col: '#636B78' },
        { name: 'Sn²⁺ | Sn', e: -0.137, ion: 'Sn²⁺', metal: 'Sn', col: '#A8B0BC' },
        { name: 'Cu²⁺ | Cu', e: +0.342, ion: 'Cu²⁺', metal: 'Cu', col: '#C87533' },
        { name: 'Ag⁺ | Ag', e: +0.800, ion: 'Ag⁺', metal: 'Ag', col: '#CBD2DC' }
      ];
      let builtStep = 6; // Ready immediately for quick projection, plus interactive step rebuild!
      const controls = el('div', { className: 'sim-controls' });
      const sel1 = el('select', { className: 'btn btn-sm', 'aria-label': 'نصف الخلية الأول' });
      const sel2 = el('select', { className: 'btn btn-sm', 'aria-label': 'نصف الخلية الثاني' });
      halfCells.forEach(function (h, i) {
        sel1.appendChild(el('option', { value: String(i), text: h.name + ' (' + (h.e >= 0 ? '+' : '') + h.e + ' V)' }));
        sel2.appendChild(el('option', { value: String(i), text: h.name + ' (' + (h.e >= 0 ? '+' : '') + h.e + ' V)' }));
      });
      sel1.value = '1';
      sel2.value = '4';
      const bridgeBtn = el('button', { type: 'button', className: 'btn btn-sm', text: 'رفع القنطرة الملحية (اختبار)' });
      const recordBtn = el('button', { type: 'button', className: 'btn btn-sm btn-primary', text: 'سجّلي القراءة بالجدول' });
      controls.appendChild(el('label', { text: 'القطب 1: ' }, [sel1]));
      controls.appendChild(el('label', { text: 'القطب 2: ' }, [sel2]));
      controls.appendChild(bridgeBtn);
      controls.appendChild(recordBtn);

      const svgWrap = el('div', { className: 'sim-canvas-wrap' });
      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('viewBox', '0 0 640 205');
      svg.setAttribute('class', 'sim-svg-stage');
      const readout = el('div', { className: 'sim-readout' });
      const tableWrap = el('div', { className: 'data-table-wrap' });
      const rows = [];

      svgWrap.appendChild(svg);
      svgWrap.appendChild(readout);
      box.appendChild(controls);
      box.appendChild(svgWrap);
      box.appendChild(tableWrap);

      let bridgeIn = true;
      function update() {
        const a = halfCells[Number(sel1.value)];
        const b = halfCells[Number(sel2.value)];
        if (a.metal === b.metal) {
          svg.innerHTML = '';
          readout.textContent = 'اختر فلزين مختلفين لتكوين خلية جلفانية ذات فرق جهد.';
          return;
        }
        const cathode = a.e >= b.e ? a : b;
        const anode = a.e >= b.e ? b : a;
        const eCell = cathode.e - anode.e;
        const active = builtStep >= 6 && bridgeIn;
        const flowCls = active ? 'anim-wire-flow' : '';
        svg.innerHTML =
          '<path d="M160 84 V28 H480 V84" fill="none" stroke="var(--text)" stroke-width="4"/>' +
          (active ? '<path d="M160 84 V28 H480 V84" fill="none" stroke="var(--coral)" stroke-width="4" class="' + flowCls + '"/>' : '') +
          (bridgeIn ? '<path d="M210 142 V92 H430 V142" fill="none" stroke="var(--violet)" stroke-width="18" stroke-linecap="round" opacity="0.4"/><text x="320" y="85" text-anchor="middle" font-size="13" font-weight="800" fill="var(--violet)">القنطرة الملحية (أيونات متعادلة)</text>' : '<text x="320" y="85" text-anchor="middle" font-size="13" font-weight="800" fill="var(--coral)">القنطرة مرفوعة (الدائرة مفتوحة!)</text>') +
          '<rect x="70" y="106" width="180" height="86" rx="12" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="3"/>' +
          '<rect x="74" y="128" width="172" height="60" rx="9" fill="var(--coral-l)"/>' +
          '<rect x="390" y="106" width="180" height="86" rx="12" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="3"/>' +
          '<rect x="394" y="128" width="172" height="60" rx="9" fill="var(--surface-tint)"/>' +
          '<rect x="148" y="80" width="24" height="96" rx="4" fill="' + anode.col + '"/>' +
          '<rect x="468" y="80" width="24" height="96" rx="4" fill="' + cathode.col + '"/>' +
          '<text x="160" y="170" text-anchor="middle" font-size="14" font-weight="800" fill="var(--text)">الأنود (-): ' + anode.metal + '</text>' +
          '<text x="480" y="170" text-anchor="middle" font-size="14" font-weight="800" fill="var(--text)">الكاثود (+): ' + cathode.metal + '</text>' +
          '<circle cx="320" cy="28" r="24" fill="var(--surface)" stroke="var(--primary)" stroke-width="3"/>' +
          '<text x="320" y="33" text-anchor="middle" direction="ltr" font-size="13" font-weight="900" fill="var(--primary)">' + (active ? '+' + eCell.toFixed(2) + ' V' : '0.00 V') + '</text>';

        readout.innerHTML = active
          ? 'الأنود (أكسدة): <span class="chem">' + anode.metal + ' → ' + anode.ion + '</span> · الكاثود (اختزال): <span class="chem">' + cathode.ion + ' → ' + cathode.metal + '</span> · <span class="chem">E°cell = +' + eCell.toFixed(3) + ' V</span>'
          : 'انقطعت الدائرة الكهربائية برفع القنطرة الملحية فأصبحت قراءة الفولتميتر صفراً!';
      }

      function renderRows() {
        if (!rows.length) {
          tableWrap.innerHTML = '';
          return;
        }
        tableWrap.innerHTML = '<table class="data-table"><thead><tr><th>الخلية (الرمز الاصطلاحي)</th><th>الأنود</th><th>الكاثود</th><th>الجهد القياسي E°cell</th></tr></thead><tbody>' +
          rows.map(function (r) {
            return '<tr><td class="chem">' + r.notation + '</td><td>' + r.anode + '</td><td>' + r.cathode + '</td><td class="chem">+' + r.e.toFixed(3) + ' V</td></tr>';
          }).join('') + '</tbody></table>';
      }

      bridgeBtn.addEventListener('click', function () {
        bridgeIn = !bridgeIn;
        bridgeBtn.textContent = bridgeIn ? 'رفع القنطرة الملحية (اختبار)' : 'إعادة وضع القنطرة الملحية';
        update();
      });
      recordBtn.addEventListener('click', function () {
        const a = halfCells[Number(sel1.value)];
        const b = halfCells[Number(sel2.value)];
        if (a.metal === b.metal || !bridgeIn) return;
        const cathode = a.e >= b.e ? a : b;
        const anode = a.e >= b.e ? b : a;
        if (rows.length >= 4) rows.shift();
        rows.push({
          notation: anode.metal + ' | ' + anode.ion + ' || ' + cathode.ion + ' | ' + cathode.metal,
          anode: anode.metal,
          cathode: cathode.metal,
          e: cathode.e - anode.e
        });
        renderRows();
      });
      sel1.addEventListener('change', update);
      sel2.addEventListener('change', update);
      update();
    } else if (simType === 'states-particles') {
      const controls = el('div', { className: 'sim-controls' });
      const canvasWrap = el('div', { className: 'sim-canvas-wrap' });
      const canvas = el('canvas', { width: '640', height: '215' });
      const readout = el('div', { className: 'sim-readout' });
      canvasWrap.appendChild(canvas);
      canvasWrap.appendChild(readout);
      box.appendChild(controls);
      box.appendChild(canvasWrap);

      let mode = 'solid', tempLvl = 1.5;
      const modes = {
        solid: { label: 'صلب (اهتزاز ثابت)', desc: 'صلب: الجسيمات متقاربة جداً ومرتبة بانتظام، وتهتز في أماكن ثابتة لقوة التجاذب.' },
        liquid: { label: 'سائل (انزلاق وانسياب)', desc: 'سائل: الجسيمات متقاربة لكنها تنزلق فوق بعضها فتأخذ شكل الوعاء وتحتفظ بحجم ثابت.' },
        gas: { label: 'غاز (انتشار سريع)', desc: 'غاز: الجسيمات متباعدة جداً وتتحرك عشوائياً بسرعة في خطوط مستقيمة وتنتشر لتملأ الوعاء.' },
        viscosity: { label: 'مختبر اللزوجة (بارد مقابل ساخن)', desc: 'بارد (يمين): لزوجة عالية فينساب ببطء؛ ساخن (يسار): طاقة حركية أعلى فينساب بسرعة.' }
      };
      const particles = [];
      for (let i = 0; i < 36; i++) {
        particles.push({
          gx: (i % 6) * 32 + 240,
          gy: Math.floor(i / 6) * 24 + 40,
          x: Math.random() * 540 + 50,
          y: Math.random() * 140 + 35,
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
      const speedCtrl = el('div', { className: 'sim-controls' });
      const speedRange = el('input', { type: 'range', min: '0.5', max: '3.5', step: '0.5', value: '1.5', 'aria-label': 'سرعة حركة الجسيمات والطاقة الحركية' });
      const speedLbl = el('span', { className: 'page-ref', text: ' 1.5x' });
      const resetDropsBtn = el('button', { type: 'button', className: 'btn btn-sm', text: 'إعادة سكب القطرات 💧' });
      resetDropsBtn.addEventListener('click', function () { dropCold = 34; dropHot = 34; });
      speedRange.addEventListener('input', function () { tempLvl = Number(speedRange.value); speedLbl.textContent = ' ' + tempLvl.toFixed(1) + 'x'; });
      speedCtrl.appendChild(el('label', { text: 'تحكمي بالطاقة الحركية (الحرارة): ' }, [speedRange, speedLbl]));
      speedCtrl.appendChild(resetDropsBtn);
      box.insertBefore(speedCtrl, canvasWrap);

      const ctx = canvas.getContext('2d');
      let t = 0;
      function tick() {
        if (!document.body.contains(canvas)) return;
        t += 0.05 * tempLvl;
        const pal = themePal();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (mode === 'viscosity') {
          dropHot += 0.85 * tempLvl;
          dropCold += 0.25 * tempLvl;
          if (dropHot > 180) dropHot = 34;
          if (dropCold > 180) dropCold = 34;
          ctx.strokeStyle = pal.wall;
          ctx.lineWidth = 3;
          ctx.strokeRect(120, 20, 110, 172);
          ctx.strokeRect(410, 20, 110, 172);
          ctx.fillStyle = pal.coral;
          ctx.beginPath(); ctx.arc(175, dropHot, 15, 0, Math.PI * 2); ctx.fill();
          ctx.fillRect(170, 22, 10, Math.max(0, dropHot - 22));
          ctx.fillStyle = pal.primary;
          ctx.beginPath(); ctx.arc(465, dropCold, 15, 0, Math.PI * 2); ctx.fill();
          ctx.fillRect(460, 22, 10, Math.max(0, dropCold - 22));
          ctx.fillStyle = pal.ink;
          ctx.font = 'bold 14px Tajawal, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('سائل ساخن (لزوجة أقل)', 175, 208);
          ctx.fillText('سائل بارد (لزوجة عالية)', 465, 208);
        } else {
          ctx.strokeStyle = pal.wall;
          ctx.lineWidth = 2.5;
          ctx.strokeRect(16, 12, canvas.width - 32, canvas.height - 24);
          particles.forEach(function (p, idx) {
            let px, py;
            if (mode === 'solid') {
              px = p.gx + Math.sin(t * 2 + p.phase) * (1.2 + tempLvl * 0.7);
              py = p.gy + Math.cos(t * 2 + p.phase) * (1.2 + tempLvl * 0.7);
            } else if (mode === 'liquid') {
              p.x += Math.sin(t + p.phase) * (0.65 * tempLvl);
              p.y += Math.cos(t * 0.8 + p.phase) * (0.45 * tempLvl);
              if (p.x < 40) p.x = canvas.width - 40;
              if (p.x > canvas.width - 40) p.x = 40;
              if (p.y < 105) p.y = 105 + (idx % 5) * 17;
              if (p.y > 186) p.y = 186;
              px = p.x; py = p.y;
            } else {
              p.x += p.vx * (tempLvl * 0.65); p.y += p.vy * (tempLvl * 0.65);
              if (p.x < 30 || p.x > canvas.width - 30) p.vx *= -1;
              if (p.y < 26 || p.y > canvas.height - 26) p.vy *= -1;
              px = p.x; py = p.y;
            }
            ctx.beginPath();
            ctx.arc(px, py, 9.5, 0, Math.PI * 2);
            ctx.fillStyle = mode === 'gas' ? pal.coral : mode === 'liquid' ? pal.green : pal.primary;
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
      selA.value = '2'; selB.value = '5';
      const launchBtn = el('button', { type: 'button', className: 'btn btn-sm btn-primary', text: 'إطلاق الغازين في الأنبوب' });
      controls.appendChild(selA); controls.appendChild(selB); controls.appendChild(launchBtn);

      const tubeWrap = el('div', { className: 'sim-tube-wrap' });
      const tube = el('div', { className: 'sim-tube' });
      const barA = el('div', { className: 'sim-tube-a' });
      const barB = el('div', { className: 'sim-tube-b' });
      const ring = el('div', { className: 'sim-tube-ring', hidden: '' });
      tube.appendChild(barA); tube.appendChild(barB); tube.appendChild(ring);
      tubeWrap.appendChild(tube);

      const readout = el('div', { className: 'sim-readout' });
      let animId = 0;
      function runTube(animate) {
        cancelAnimationFrame(animId);
        const gA = gases[Number(selA.value)];
        const gB = gases[Number(selB.value)];
        const vA = 1 / Math.sqrt(gA.m), vB = 1 / Math.sqrt(gB.m);
        const fracA = vA / (vA + vB), ratio = Math.sqrt(gB.m / gA.m);
        barA.textContent = gA.short; barB.textContent = gB.short; ring.hidden = true;
        function finishText() {
          readout.innerHTML = 'نسبة الانتشار <span class="chem">r(A)/r(B) = √(' + gB.m + ' / ' + gA.m + ') = ' + ratio.toFixed(2) + '</span> · يلتقيان عند <span class="chem">' + Math.round(fracA * 100) + '%</span> من جهة ' + gA.short + ' (' +
            (ratio > 1 ? gA.short + ' أسرع لأنه أخف' : ratio < 1 ? gB.short + ' أسرع لأنه أخف' : 'سرعتهما متساوية') + ').';
        }
        if (!animate) {
          barA.style.width = (fracA * 100) + '%'; barB.style.width = ((1 - fracA) * 100) + '%';
          ring.style.left = (fracA * 100) + '%'; ring.hidden = false; finishText(); return;
        }
        const t0 = performance.now(), dur = 1600;
        readout.textContent = 'تندفع جسيمات الغازين من طرفي الأنبوب...';
        function step(now) {
          if (!document.body.contains(tube)) return;
          const k = Math.min(1, (now - t0) / dur);
          barA.style.width = (fracA * k * 100) + '%'; barB.style.width = ((1 - fracA) * k * 100) + '%';
          if (k < 1) animId = requestAnimationFrame(step);
          else { ring.style.left = (fracA * 100) + '%'; ring.hidden = false; finishText(); }
        }
        animId = requestAnimationFrame(step);
      }
      selA.addEventListener('change', function () { runTube(true); });
      selB.addEventListener('change', function () { runTube(true); });
      launchBtn.addEventListener('click', function () { runTube(true); });
      runTube(false);

      // Dalton Partial Pressure interactive mixer alongside Graham's tube
      const daltonBox = el('div', { className: 'sim-controls', style: 'margin-top:0.55rem;padding-top:0.55rem;border-top:1.5px dashed var(--border);' });
      const p1In = el('input', { type: 'range', min: '0.2', max: '3.0', step: '0.2', value: '1.2', 'aria-label': 'الضغط الجزئي الأول' });
      const p2In = el('input', { type: 'range', min: '0.2', max: '3.0', step: '0.2', value: '0.8', 'aria-label': 'الضغط الجزئي الثاني' });
      const daltonOut = el('span', { className: 'sim-pill' });
      function updDalton() {
        const p1 = Number(p1In.value), p2 = Number(p2In.value);
        daltonOut.innerHTML = 'قانون دالتون: <span class="chem">P_total = ' + p1.toFixed(1) + ' + ' + p2.toFixed(1) + ' = ' + (p1 + p2).toFixed(1) + ' atm</span>';
      }
      p1In.addEventListener('input', updDalton);
      p2In.addEventListener('input', updDalton);
      updDalton();
      daltonBox.appendChild(el('label', { text: 'P₁ (He): ' }, [p1In]));
      daltonBox.appendChild(el('label', { text: 'P₂ (N₂): ' }, [p2In]));
      daltonBox.appendChild(daltonOut);

      box.appendChild(controls); box.appendChild(tubeWrap); box.appendChild(readout); box.appendChild(daltonBox);
    } else if (simType === 'gas-laws') {
      const modeRow = el('div', { className: 'sim-controls' });
      const btnBalloon = el('button', { type: 'button', className: 'btn btn-sm btn-primary', text: '🎈 مختبر منطاد الهواء الساخن' });
      const btnPiston = el('button', { type: 'button', className: 'btn btn-sm', text: '🔩 مختبر المكبس المغلق' });
      modeRow.appendChild(btnBalloon);
      modeRow.appendChild(btnPiston);

      const controls = el('div', { className: 'sim-controls' });
      const lawSel = el('select', { className: 'btn btn-sm', 'aria-label': 'اختر القانون' });
      [
        { v: 'charles', t: 'قانون شارل (ثبوت P): V و T(K) طردياً — تسخين المنطاد' },
        { v: 'boyle', t: 'قانون بويل (ثبوت T): P و V عكسياً — صعود البالون بالضغط' },
        { v: 'gay', t: 'قانون جاي-لوساك (ثبوت V): P و T(K) طردياً — الوعاء المغلق' }
      ].forEach(function (o) { lawSel.appendChild(el('option', { value: o.v, text: o.t })); });
      const slider = el('input', { type: 'range', min: '1', max: '5', step: '0.25', value: '2', 'aria-label': 'قيمة المتغير المستقل' });
      const sliderVal = el('span', { className: 'page-ref' });
      const recBtn = el('button', { type: 'button', className: 'btn btn-sm btn-primary', text: 'سجّلي القراءة' });
      controls.appendChild(lawSel);
      controls.appendChild(el('label', { text: 'المتغير: ' }, [slider, sliderVal]));
      controls.appendChild(recBtn);

      const canvasWrap = el('div', { className: 'sim-canvas-wrap' });
      const canvas = el('canvas', { width: '620', height: '205' });
      const readout = el('div', { className: 'sim-readout' });
      const tableWrap = el('div', { className: 'data-table-wrap' });
      const rows = [];
      canvasWrap.appendChild(canvas); canvasWrap.appendChild(readout);
      box.appendChild(modeRow); box.appendChild(controls); box.appendChild(canvasWrap); box.appendChild(tableWrap);

      let visualMode = 'balloon';
      btnBalloon.addEventListener('click', function () { visualMode = 'balloon'; btnBalloon.classList.add('btn-primary'); btnPiston.classList.remove('btn-primary'); });
      btnPiston.addEventListener('click', function () { visualMode = 'piston'; btnPiston.classList.add('btn-primary'); btnBalloon.classList.remove('btn-primary'); });

      const ctx = canvas.getContext('2d');
      const gPts = Array.from({ length: 26 }, function () {
        return { u: Math.random(), v: Math.random(), a: Math.random() * Math.PI * 2 };
      });
      let state = { law: 'charles', p: 1, v: 4.8, tK: 300, cylW: 240 };

      function update() {
        const law = lawSel.value, x = Number(slider.value);
        let p = 1, v = 10, tK = 300;
        if (law === 'boyle') {
          p = x; v = 10 / p;
          sliderVal.textContent = ' P = ' + p.toFixed(2) + ' atm';
          readout.innerHTML = 'قانون بويل (المنطاد/المكبس): <span class="chem">P₁V₁ = 10 atm·L</span> ← انخفاض الضغط الخارجي يوسّع الحجم إلى <span class="chem">V = ' + v.toFixed(2) + ' L</span>';
        } else if (law === 'charles') {
          tK = Math.round(x * 150); v = (tK / 150) * 2.4;
          sliderVal.textContent = ' T = ' + tK + ' K';
          readout.innerHTML = 'قانون شارل (منطاد الهواء الساخن): <span class="chem">V₁/T₁ = V₂/T₂</span> ← التسخين إلى ' + tK + ' K يتمدد به المنطاد إلى <span class="chem">' + v.toFixed(1) + ' L</span>';
        } else {
          tK = Math.round(x * 150); p = (tK / 150) * 1.5; v = 6;
          sliderVal.textContent = ' T = ' + tK + ' K';
          readout.innerHTML = 'جاي-لوساك: <span class="chem">P₁/T₁ = P₂/T₂</span> ← الضغط عند ' + tK + ' K يساوي <span class="chem">' + p.toFixed(2) + ' atm</span> (الحجم ثابت)';
        }
        state = { law: law, p: p, v: v, tK: tK, cylW: Math.min(480, Math.max(95, v * 44)) };
      }
      lawSel.addEventListener('change', function () { rows.length = 0; tableWrap.innerHTML = ''; update(); });
      slider.addEventListener('input', update);
      recBtn.addEventListener('click', function () {
        if (rows.length >= 4) rows.shift();
        const kVal = state.law === 'boyle' ? (state.p * state.v).toFixed(2) : state.law === 'charles' ? (state.v / state.tK).toFixed(4) : (state.p / state.tK).toFixed(4);
        const kName = state.law === 'boyle' ? 'P × V' : state.law === 'charles' ? 'V ÷ T' : 'P ÷ T';
        rows.push({ p: state.p.toFixed(2), v: state.v.toFixed(2), t: state.tK, k: kVal });
        tableWrap.innerHTML = '<table class="data-table"><thead><tr><th>#</th><th>P (atm)</th><th>V (L)</th><th>T (K)</th><th>' + kName + '</th></tr></thead><tbody>' +
          rows.map(function (r, idx) { return '<tr><td>' + (idx + 1) + '</td><td>' + r.p + '</td><td>' + r.v + '</td><td>' + r.t + '</td><td>' + r.k + '</td></tr>'; }).join('') + '</tbody></table>';
      });
      update();

      let skyT = 0;
      function animateCylinder() {
        if (!document.body.contains(canvas)) return;
        skyT += 0.04;
        const pal = themePal();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (visualMode === 'balloon') {
          // Sky background & clouds
          ctx.fillStyle = pal.dark ? 'rgba(42,125,225,0.14)' : '#e6f3ff';
          ctx.fillRect(16, 12, canvas.width - 32, 162);
          ctx.fillStyle = 'rgba(255,255,255,0.8)';
          ctx.beginPath(); ctx.arc(105 + Math.sin(skyT * 0.4) * 20, 48, 18, 0, Math.PI * 2); ctx.arc(124 + Math.sin(skyT * 0.4) * 20, 44, 22, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(495 - Math.sin(skyT * 0.35) * 18, 62, 16, 0, Math.PI * 2); ctx.arc(515 - Math.sin(skyT * 0.35) * 18, 58, 20, 0, Math.PI * 2); ctx.fill();

          const scale = Math.min(1.38, Math.max(0.62, state.v / 5.5));
          const cx = 310;
          const lift = state.law === 'charles' ? ((state.tK - 150) / 600) * 38 : state.law === 'boyle' ? ((5 - state.p) / 4) * 42 : 12;
          const cy = 96 - lift * 0.55;
          const rx = 44 * scale, ry = 52 * scale;

          // Envelope
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
          ctx.fillStyle = state.law === 'gay' ? pal.violet : (state.tK > 380 ? pal.coral : pal.primary);
          ctx.fill();
          ctx.strokeStyle = pal.ink; ctx.lineWidth = 2.5; ctx.stroke();
          // Vertical stripes on balloon
          ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.ellipse(cx, cy, rx * 0.48, ry, 0, 0, Math.PI * 2); ctx.stroke();

          // Ropes & basket
          ctx.strokeStyle = pal.ink; ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cx - rx * 0.35, cy + ry * 0.85); ctx.lineTo(cx - 12, cy + ry + 26);
          ctx.moveTo(cx + rx * 0.35, cy + ry * 0.85); ctx.lineTo(cx + 12, cy + ry + 26);
          ctx.stroke();
          ctx.fillStyle = '#b45309';
          ctx.fillRect(cx - 16, cy + ry + 25, 32, 18);

          // Flame when heating (Charles / Gay-Lussac)
          if (state.law !== 'boyle' && state.tK >= 250) {
            const fh = 8 + (state.tK / 750) * 14 + Math.sin(skyT * 6) * 2.5;
            ctx.fillStyle = '#ffc93c';
            ctx.beginPath(); ctx.moveTo(cx - 6, cy + ry + 23); ctx.lineTo(cx, cy + ry + 23 - fh); ctx.lineTo(cx + 6, cy + ry + 23); ctx.closePath(); ctx.fill();
          }
          // Particles moving inside balloon
          const speed = 0.015 * Math.sqrt(state.tK / 300);
          for (let i = 0; i < 10; i++) {
            const pt = gPts[i];
            pt.u += Math.cos(pt.a) * speed; pt.v += Math.sin(pt.a) * speed;
            if (pt.u < 0.1 || pt.u > 0.9) pt.a = Math.PI - pt.a;
            if (pt.v < 0.1 || pt.v > 0.9) pt.a = -pt.a;
            ctx.beginPath();
            ctx.arc(cx - rx * 0.65 + pt.u * (rx * 1.3), cy - ry * 0.65 + pt.v * (ry * 1.3), 4, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff'; ctx.fill();
          }

          ctx.fillStyle = pal.ink; ctx.font = 'bold 14px Tajawal, sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('P = ' + state.p.toFixed(2) + ' atm   |   V = ' + state.v.toFixed(2) + ' L   |   T = ' + state.tK + ' K   (' + (state.law === 'gay' ? 'حجم ثابت' : 'منطاد حر التمدد') + ')', canvas.width / 2, 194);
          requestAnimationFrame(animateCylinder);
          return;
        }

        const x0 = 40, y0 = 18, ch = 122, cw = state.cylW;
        ctx.fillStyle = pal.tint; ctx.fillRect(x0, y0, cw, ch);
        ctx.strokeStyle = pal.primary; ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.moveTo(x0 + 500, y0); ctx.lineTo(x0, y0); ctx.lineTo(x0, y0 + ch); ctx.lineTo(x0 + 500, y0 + ch); ctx.stroke();
        ctx.fillStyle = pal.coral; ctx.fillRect(x0 + cw, y0 - 4, 14, ch + 8);
        ctx.fillRect(x0 + cw + 14, y0 + ch / 2 - 5, Math.max(20, 520 - cw), 10);
        const heat = Math.min(1, Math.max(0, (state.tK - 150) / 600));
        const speed = 0.008 * Math.sqrt(state.tK / 300);
        gPts.forEach(function (pt) {
          pt.u += Math.cos(pt.a) * speed * (320 / cw); pt.v += Math.sin(pt.a) * speed * 1.8;
          if (pt.u < 0) { pt.u = -pt.u; pt.a = Math.PI - pt.a; }
          if (pt.u > 1) { pt.u = 2 - pt.u; pt.a = Math.PI - pt.a; }
          if (pt.v < 0) { pt.v = -pt.v; pt.a = -pt.a; }
          if (pt.v > 1) { pt.v = 2 - pt.v; pt.a = -pt.a; }
          ctx.beginPath(); ctx.arc(x0 + 10 + pt.u * (cw - 20), y0 + 10 + pt.v * (ch - 20), 6.5, 0, Math.PI * 2);
          ctx.fillStyle = heat > 0.45 ? pal.coral : pal.primary; ctx.fill();
        });
        ctx.fillStyle = pal.ink; ctx.font = 'bold 14px Tajawal, sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('P = ' + state.p.toFixed(2) + ' atm   |   V = ' + state.v.toFixed(2) + ' L   |   T = ' + state.tK + ' K', 42, 178);
        requestAnimationFrame(animateCylinder);
      }
      requestAnimationFrame(animateCylinder);
    } else if (simType === 'imf-compare' || simType === 'phase-diagram' || simType === 'ideal-gas' || simType === 'gas-stoich' || simType === 'batteries-compare' || simType === 'electrolysis-cells') {
      return null; // Handled cleanly by existing createSimulationNode fallback in lesson-app.js
    }
    return box;
  }

  window.CHEM_ILLUSTRATIONS = ILLUSTRATIONS;
  window.CHEM_VIDEOS = {
    createPlayer: createInteractiveVideoNode
  };
  window.CHEM_VIRTUAL_LABS = {
    createLab: createVirtualLabNode
  };

  /* Rich illustrated SVG scenes for real-world examples & cross-science links */
  const LINK_SVGS = {
    lungs: '<svg viewBox="0 0 260 110" class="link-svg" aria-label="الرئتان والشهيق والزفير"><rect width="260" height="110" rx="12" fill="var(--teal-l)"/><path d="M130 14 V44" stroke="var(--ink)" stroke-width="6" stroke-linecap="round"/><path d="M130 42 Q100 32 82 54 Q70 78 96 92 Q122 96 125 65 Z" fill="#fda4af" stroke="#e11d48" stroke-width="2.5" class="anim-pulse"/><path d="M130 42 Q160 32 178 54 Q190 78 164 92 Q138 96 135 65 Z" fill="#fda4af" stroke="#e11d48" stroke-width="2.5" class="anim-pulse"/><path d="M68 96 Q130 82 192 96" fill="none" stroke="var(--primary)" stroke-width="3" stroke-dasharray="5 4"/><text x="130" y="106" text-anchor="middle" font-size="11" font-weight="800" fill="var(--ink)">اتساع الصدر ← انخفاض الضغط ← دخول الهواء</text></svg>',
    balloon: '<svg viewBox="0 0 260 110" class="link-svg" aria-label="منطاد الهواء الساخن"><rect width="260" height="110" rx="12" fill="#e0f2fe"/><ellipse cx="130" cy="46" rx="34" ry="38" fill="var(--coral)" stroke="#9a3412" stroke-width="2"/><ellipse cx="130" cy="46" rx="16" ry="38" fill="#ffc93c" opacity="0.85"/><line x1="115" y1="80" x2="122" y2="94" stroke="#451a03" stroke-width="2"/><line x1="145" y1="80" x2="138" y2="94" stroke="#451a03" stroke-width="2"/><rect x="118" y="93" width="24" height="12" rx="3" fill="#92400e"/><circle cx="130" cy="86" r="4" fill="#fde047" class="anim-pulse"/><text x="46" y="45" font-size="11" font-weight="800" fill="#0369a1">T ↑ ← V ↑</text></svg>',
    weather: '<svg viewBox="0 0 260 110" class="link-svg" aria-label="بالون الطقس في الأجواء العليا"><rect width="260" height="110" rx="12" fill="var(--violet-l)"/><circle cx="80" cy="72" r="14" fill="var(--primary)" opacity="0.75"/><circle cx="178" cy="38" r="28" fill="var(--coral)" opacity="0.9" class="anim-pulse"/><path d="M98 66 L144 46" stroke="var(--ink)" stroke-width="2.5" stroke-dasharray="4 3"/><text x="80" y="98" text-anchor="middle" font-size="11" font-weight="800" fill="var(--ink)">الأرض P عالٍ</text><text x="178" y="82" text-anchor="middle" font-size="11" font-weight="800" fill="var(--coral)">الأعلى P↓ فـ V↑</text></svg>',
    tire: '<svg viewBox="0 0 260 110" class="link-svg" aria-label="إطار السيارة وضغط الغاز"><rect width="260" height="110" rx="12" fill="var(--gold-l)"/><circle cx="130" cy="54" r="38" fill="#1e293b" stroke="#0f172a" stroke-width="3"/><circle cx="130" cy="54" r="20" fill="#cbd5e1"/><circle cx="110" cy="30" r="4" fill="#ffc93c"/><circle cx="152" cy="32" r="4" fill="#ffc93c"/><circle cx="154" cy="72" r="4" fill="#ffc93c"/><text x="130" y="104" text-anchor="middle" font-size="11" font-weight="800" fill="var(--ink)">تصادمات جزيئات الهواء تحفظ الضغط</text></svg>',
    perfume: '<svg viewBox="0 0 260 110" class="link-svg" aria-label="انتشار رائحة العطر"><rect width="260" height="110" rx="12" fill="var(--coral-l)"/><rect x="44" y="42" width="40" height="50" rx="8" fill="var(--primary)"/><rect x="54" y="28" width="20" height="14" rx="3" fill="#0f172a"/><circle cx="115" cy="40" r="6" fill="var(--coral)" class="anim-bubble-1"/><circle cx="148" cy="55" r="7" fill="var(--violet)" class="anim-bubble-2"/><circle cx="188" cy="36" r="5" fill="var(--green)" class="anim-bubble-3"/><circle cx="215" cy="60" r="6" fill="var(--coral)" class="anim-bubble-1"/><text x="155" y="96" text-anchor="middle" font-size="11" font-weight="800" fill="var(--ink)">انتشار عشوائي سريع من التركيز الأعلى</text></svg>',
    dive: '<svg viewBox="0 0 260 110" class="link-svg" aria-label="الضغط والغوص وخليط الغازات"><rect width="260" height="110" rx="12" fill="#dbeafe"/><rect x="45" y="34" width="26" height="58" rx="10" fill="#0284c7"/><circle cx="135" cy="45" r="9" fill="#22c55e"/><circle cx="170" cy="45" r="9" fill="#3b82f6"/><circle cx="205" cy="45" r="9" fill="#ef4444"/><text x="135" y="72" text-anchor="middle" font-size="11" font-weight="800" fill="var(--ink)">He + O₂ + N₂ ← P_total</text><text x="130" y="100" text-anchor="middle" font-size="11" font-weight="800" fill="#1e3a8a">دالتون وتخفيض النيتروجين في أعماق الغوص</text></svg>',
    dna: '<svg viewBox="0 0 260 110" class="link-svg" aria-label="الماء والروابط الهيدروجينية في DNA"><rect width="260" height="110" rx="12" fill="var(--surface-tint)"/><path d="M55 24 Q105 55 155 24 Q205 55 235 28" fill="none" stroke="var(--primary)" stroke-width="5"/><path d="M55 82 Q105 51 155 82 Q205 51 235 78" fill="none" stroke="var(--coral)" stroke-width="5"/><line x1="82" y1="41" x2="82" y2="65" stroke="var(--green)" stroke-width="3" stroke-dasharray="4 3"/><line x1="130" y1="43" x2="130" y2="63" stroke="var(--green)" stroke-width="3" stroke-dasharray="4 3"/><line x1="180" y1="39" x2="180" y2="67" stroke="var(--green)" stroke-width="3" stroke-dasharray="4 3"/><text x="130" y="102" text-anchor="middle" font-size="11" font-weight="800" fill="var(--ink)">روابط هيدروجينية تربط سلسلتي DNA وقطبية الماء</text></svg>',
    iceFloat: '<svg viewBox="0 0 260 110" class="link-svg" aria-label="طفو الجليد فوق الماء والخاصية الشعرية"><rect width="260" height="110" rx="12" fill="#e0f2fe"/><rect x="0" y="54" width="260" height="56" fill="rgba(42,125,225,0.28)"/><polygon points="75,38 145,38 158,64 62,64" fill="#ffffff" stroke="#38bdf8" stroke-width="2.5"/><text x="110" y="56" text-anchor="middle" font-size="12" font-weight="900" fill="#0369a1">جليد طافٍ 🧊</text><circle cx="205" cy="78" r="10" fill="#f97316"/><text x="130" y="98" text-anchor="middle" font-size="11" font-weight="800" fill="#0c4a6e">تمدد الجليد وقلة كثافته تحمي الحياة المائية</text></svg>',
    capillary: '<svg viewBox="0 0 260 110" class="link-svg" aria-label="اللزوجة والخاصية الشعرية"><rect width="260" height="110" rx="12" fill="var(--teal-l)"/><rect x="30" y="76" width="200" height="24" fill="rgba(42,125,225,0.35)"/><rect x="75" y="20" width="26" height="68" fill="#fff" stroke="var(--ink)" stroke-width="2"/><rect x="77" y="52" width="22" height="34" fill="var(--primary)" opacity="0.7"/><rect x="130" y="20" width="12" height="68" fill="#fff" stroke="var(--ink)" stroke-width="2"/><rect x="132" y="28" width="8" height="58" fill="var(--primary)" opacity="0.85"/><text x="195" y="55" text-anchor="middle" font-size="11" font-weight="800" fill="var(--ink)">تلاصق + شعرية</text></svg>',
    phaseLife: '<svg viewBox="0 0 260 110" class="link-svg" aria-label="الجليد الجاف والسحب وتنظيم الحرارة"><rect width="260" height="110" rx="12" fill="#f1f5f9"/><path d="M55 50 Q70 28 96 34 Q118 22 138 38 Q158 34 162 54 Q162 68 142 68 H65 Q48 68 55 50 Z" fill="#cbd5e1" stroke="#64748b" stroke-width="2"/><circle cx="88" cy="82" r="4" fill="var(--primary)" class="anim-bubble-2"/><circle cx="115" cy="86" r="4" fill="var(--primary)" class="anim-bubble-1"/><rect x="186" y="48" width="44" height="30" rx="6" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/><text x="208" y="67" text-anchor="middle" font-size="11" font-weight="900" fill="#1e293b">CO₂</text><text x="130" y="102" text-anchor="middle" font-size="11" font-weight="800" fill="var(--ink)">تكاثف السحب وتسامي الثلج الجاف</text></svg>',
    co2Pop: '<svg viewBox="0 0 260 110" class="link-svg" aria-label="خزانات الغاز وفرقعة الفشار وPV=nRT"><rect width="260" height="110" rx="12" fill="var(--gold-l)"/><rect x="44" y="26" width="38" height="68" rx="12" fill="#dc2626"/><text x="63" y="64" text-anchor="middle" font-size="12" font-weight="900" fill="#fff">CO₂</text><circle cx="155" cy="52" r="24" fill="#fef08a" stroke="#ca8a04" stroke-width="2.5" class="anim-pulse"/><text x="155" y="56" text-anchor="middle" font-size="18">🍿</text><text x="155" y="98" text-anchor="middle" font-size="11" font-weight="800" fill="var(--ink)">تمدد البخار والغاز عند تطبيق PV = nRT</text></svg>',
    haberHbot: '<svg viewBox="0 0 260 110" class="link-svg" aria-label="مصانع الأمونيا وغرفة الأكسجين المضغوط"><rect width="260" height="110" rx="12" fill="var(--green-l)"/><rect x="34" y="32" width="76" height="46" rx="16" fill="#ffffff" stroke="var(--green)" stroke-width="3"/><text x="72" y="59" text-anchor="middle" font-size="12" font-weight="900" fill="var(--green)">O₂ HBOT</text><rect x="148" y="26" width="80" height="52" rx="8" fill="#0284c7" opacity="0.2" stroke="#0284c7" stroke-width="2.5"/><text x="188" y="56" text-anchor="middle" font-size="12" font-weight="900" fill="#0369a1">2NH₃ ⚗️</text><text x="130" y="100" text-anchor="middle" font-size="11" font-weight="800" fill="var(--ink)">النسب الحجمية في الطب والصناعة والزراعة</text></svg>'
  };

  window.CHEM_LINK_SVGS = {
    getFor: function (lessonId, lk, idx) {
      const text = ((lk && (lk.title + ' ' + lk.tag + ' ' + lk.text)) || '');
      if (text.includes('التنفس') || text.includes('بويل')) return LINK_SVGS.lungs;
      if (text.includes('بالون')) return LINK_SVGS.weather;
      if (text.includes('منطاد') || text.includes('أواني')) return LINK_SVGS.balloon;
      if (text.includes('إطارات') || text.includes('مرتبة')) return LINK_SVGS.tire;
      if (text.includes('عطر') || text.includes('رائحة') || text.includes('تسرب')) return LINK_SVGS.perfume;
      if (text.includes('الغوص') || text.includes('الفيزياء والأرض')) return LINK_SVGS.dive;
      if (text.includes('DNA') || text.includes('الماء') || text.includes('أبو بريص')) return LINK_SVGS.dna;
      if (text.includes('الجليد') || text.includes('البيئة')) return LINK_SVGS.iceFloat;
      if (text.includes('المناديل') || text.includes('اللزوجة') || text.includes('زيوت')) return LINK_SVGS.capillary;
      if (text.includes('الجاف') || text.includes('السحب') || text.includes('التعرق')) return LINK_SVGS.phaseLife;
      if (text.includes('طفايات') || text.includes('الفشار') || text.includes('البروبان')) return LINK_SVGS.co2Pop;
      if (text.includes('الأسمدة') || text.includes('HBOT') || text.includes('الأمونيا') || text.includes('الزراعة')) return LINK_SVGS.haberHbot;
      const byLesson = { '6-1': LINK_SVGS.tire, '6-2': LINK_SVGS.dna, '6-3': LINK_SVGS.iceFloat, '6-4': LINK_SVGS.phaseLife, '7-1': LINK_SVGS.balloon, '7-2': LINK_SVGS.co2Pop, '7-3': LINK_SVGS.haberHbot };
      return byLesson[lessonId] || LINK_SVGS.lungs;
    }
  };

  window.CHEM21_LAB_GUIDES = {
    '6-1': {
      safety: ['🥽 نظارة السلامة المخبرية', '🧤 الحذر عند فتح أمبولة الأمونيا وHCl', '⚖️ قياس الكتلة المولية والضغوط بدقة'],
      steps: [
        { label: '١ اختيار NH₃ و HCl في الأنبوب', msg: '🧪 تم تجهيز الأمونيا (17 g/mol) وكلوريد الهيدروجين (36.5 g/mol) على طرفي الأنبوب.' },
        { label: '٢ إطلاق الغازين ومراقبة التقاء الحلقة', msg: '💨 الغاز الأخف (NH₃) يندفع أسرع بنسبة ≈ 1.47 ويلتقي بـ HCl قرب الطرف الأيمن.' },
        { label: '٣ تحريك منزلقات الضغوط الجزئية لدالتون', msg: '🎚️ حرّكي منزلقَي P₁ و P₂ وشاهدي كيف يساوي الضغط الكلي مجموع الضغوط الجزئية.' },
        { label: '٤ استنتاج القانون العام وسجّلي التحقق', msg: '✅ اكتملت التجربة! أجيبي عن جدول التحقق بالأسفل.' }
      ],
      checks: [
        { label: '١) أي الغازين ينتشر أسرع في الأنبوب (NH₃ أم HCl)؟', type: 'select', options: [{ v: '', t: 'اختاري' }, { v: 'nh3', t: 'الأمونيا NH₃ (الأخف 17)' }, { v: 'hcl', t: 'كلوريد الهيدروجين HCl (36.5)' }], ans: 'nh3' },
        { label: '٢) إذا كان P₁ = 1.2 atm و P₂ = 0.8 atm فإن الضغط الكلي P_total يساوي (atm):', type: 'number', ans: 2.0, tol: 0.05 }
      ]
    },
    '6-2': {
      safety: ['🥽 نظارة السلامة', '🔥 الحذر عند استخدام السخان الحراري', '❄️ مراقبة نقطة تحول الطور بدقة'],
      steps: [
        { label: '١ فحص جزيء الميثان CH₄ وتسخينه', msg: '🫧 قوى تشتت لندن الضعيفة تتفكك مبكراً ويتحول الميثان إلى غاز عند -164°C.' },
        { label: '٢ اختيار HCl ومقارنة ثنائي القطب', msg: '🧲 ثنائي القطب الدائم في HCl يرفع درجة غليانه إلى -85°C.' },
        { label: '٣ اختيار الماء H₂O ورفع الحرارة إلى 100°C', msg: '💧 الشبكة الهيدروجينية القوية تُبقي جزيئات الماء متماسكة حتى 100°C!' },
        { label: '٤ مقارنة قوى التجاذب والتحقق من النتائج', msg: '✅ جاهز! سجّلي استنتاجك في جدول التحقق بالأسفل.' }
      ],
      checks: [
        { label: '١) نوع القوة الأساسية المسؤولة عن ارتفاع غليان الماء H₂O:', type: 'select', options: [{ v: '', t: 'اختاري' }, { v: 'hb', t: 'الرابطة الهيدروجينية' }, { v: 'disp', t: 'قوى التشتت فقط' }], ans: 'hb' },
        { label: '٢) درجة غليان الماء بالسيليزية (°C) التي تتكسر عندها الروابط:', type: 'number', ans: 100, tol: 1 }
      ]
    },
    '6-3': {
      safety: ['🥽 نظارة السلامة', '💧 تجنّب سكب السوائل الساخنة', '⏱️ مقارنة سرعة انسياب القطرتين بدقة'],
      steps: [
        { label: '١ اختيار الحالة الصلبة (شبكة منتظمة)', msg: '🧊 تهتز الجسيمات في مواضع ثابتة لشدة قوى التجاذب.' },
        { label: '٢ التحويل إلى الحالة السائلة ثم الغازية', msg: '🌊 تنزلق جسيمات السائل بحرية أكبر ثم تتباعد في الغاز وتتحكم بها الحرارة.' },
        { label: '٣ فتح مختبر اللزوجة وزيادة الطاقة الحركية', msg: '🔥 كلما زادت الحرارة انخفضت اللزوجة وانساَب السائل الساخن أسرع.' },
        { label: '٤ استنتاج علاقة اللزوجة والتوتر السطحي', msg: '✅ ممتاز! أجيبي عن بطاقة التحقق بالأسفل.' }
      ],
      checks: [
        { label: '١) بارتفاع درجة الحرارة فإن لزوجة السائل:', type: 'select', options: [{ v: '', t: 'اختاري' }, { v: 'dec', t: 'تقلّ ويسرع الانسياب' }, { v: 'inc', t: 'تزداد ويتجمد' }], ans: 'dec' },
        { label: '٢) خاصية ارتفاع الماء في الأنابيب الضيقة والجذور تُسمى:', type: 'select', options: [{ v: '', t: 'اختاري' }, { v: 'cap', t: 'الخاصية الشعرية' }, { v: 'all', t: 'التآصل' }], ans: 'cap' }
      ]
    },
    '6-4': {
      safety: ['🥽 نظارة السلامة', '🔥 الحذر عند اختبار التغيرات الماصة بالتسخين', '❄️ التبريد والضغط المنخفض للثلج الجاف'],
      steps: [
        { label: '١ تطبيق التغيرات الماصة (الانصهار والتبخر)', msg: '🔥 تمتص الجسيمات طاقة (+ΔH) فتتغلب على قوى الترابط وتتفكك.' },
        { label: '٢ اختبار التسامي (صلب ← غاز مباشرة)', msg: '💨 كما في الثلج الجاف CO₂(s)؛ يتحول الصلب إلى غاز دون مرور بالسائل.' },
        { label: '٣ تطبيق التغيرات الطاردة (التجمد والتكاثف والترسب)', msg: '❄️ تُطلق الجسيمات طاقة (−ΔH) وتتقارب لتكوين السائل أو الصلب.' },
        { label: '٤ تحديد النقطة الثلاثية والحرجة والتحقق', msg: '✅ اكتملت التجارب الست! أجيبي عن جدول التحقق بالأسفل.' }
      ],
      checks: [
        { label: '١) أي المجموعة التالية جميعها تغيرات ماصة للطاقة (+ΔH)؟', type: 'select', options: [{ v: '', t: 'اختاري' }, { v: 'endo', t: 'الانصهار، التبخر، التسامي' }, { v: 'exo', t: 'التجمد، التكاثف، الترسب' }], ans: 'endo' },
        { label: '٢) تحوّل الغاز مباشرة إلى صلب (مثل الصقيع) يُسمى:', type: 'select', options: [{ v: '', t: 'اختاري' }, { v: 'dep', t: 'الترسب (طارد للحرارة)' }, { v: 'sub', t: 'التسامي (ماص للحرارة)' }], ans: 'dep' }
      ]
    },
    '7-1': {
      safety: ['🥽 نظارة السلامة', '🔥 مراقبة لهب تسخين المنطاد بحذر', '🌡️ تحويل درجات الحرارة إلى كلفن قبل الحساب'],
      steps: [
        { label: '١ تسخين منطاد الهواء الساخن (قانون شارل)', msg: '🎈 بارتفاع T بالكلفن يتمدد الهواء داخل المنطاد (V ↑) فيرتفع في السماء!' },
        { label: '٢ اختبار قانون بويل (تغيير الضغط الخارجي)', msg: '💨 عند صعود البالون وانخفاض P الخارجي يتضاعف الحجم عكسياً (P₁V₁ = P₂V₂).' },
        { label: '٣ تثبيت الحجم واختبار جاي-لوساك + المكبس', msg: '⚡ في الحجم الثابت يزداد الضغط طردياً مع الحرارة بالكلفن.' },
        { label: '٤ التحقق الحسابي في جدول القياس', msg: '✅ اكتملت التجارب! أجيبي عن جدول التحقق بالأسفل.' }
      ],
      checks: [
        { label: '١) في قانون بويل (P₁V₁ = 10 atm·L)، ما الحجم باللتر عند P = 2 atm؟', type: 'number', ans: 5, tol: 0.1 },
        { label: '٢) وحدة درجة الحرارة الإلزامية في جميع قوانين الغازات:', type: 'select', options: [{ v: '', t: 'اختاري' }, { v: 'k', t: 'كلفن (K)' }, { v: 'c', t: 'سيليزية (°C)' }], ans: 'k' }
      ]
    },
    '7-2': {
      safety: ['🥽 نظارة السلامة', '⚖️ ضبط الظروف المعيارية (0°C, 1 atm)', '🧮 التحقق من ثبوت R = 0.0821'],
      steps: [
        { label: '١ ضبط الوعاء عند 1.0 atm و 0°C (273 K)', msg: '🌡️ تم ضبط الظروف المعيارية STP لحساب عدد المولات n.' },
        { label: '٢ تجربة حجم 22.4 L أو مضاعفة الضغط P', msg: '📦 زيادة الضغط تضغط الجسيمات وتزيد n عند ثبوت V و T.' },
        { label: '٣ رفع الحرارة T وتتبّع سرعة الجسيمات', msg: '⚡ تزداد طاقة الجسيمات وتصادماتها مع الجدران.' },
        { label: '٤ التحقق من ثوابت الغاز المثالي', msg: '✅ سجّلي استنتاجاتك في بطاقة التحقق بالأسفل.' }
      ],
      checks: [
        { label: '١) الحجم المولاري لمول واحد من أي غاز مثالي عند STP باللتر:', type: 'number', ans: 22.4, tol: 0.1 },
        { label: '٢) قيمة ثابت الغاز المثالي R عندما يُقاس الضغط بوحدة atm:', type: 'number', ans: 0.0821, tol: 0.002 }
      ]
    },
    '7-3': {
      safety: ['🥽 نظارة السلامة', '⚗️ التعامل بحذر مع غاز الهيدروجين والأمونيا', '📊 موازنة المعاملات قبل الحساب'],
      steps: [
        { label: '١ ضبط حجم غاز النيتروجين N₂ على 5 L', msg: '🧪 من المعادلة N₂ + 3H₂ → 2NH₃ نحتاج 3 أمثال الحجم من H₂.' },
        { label: '٢ تحديد حجم H₂ المطلوب (15 L)', msg: '⚖️ النسبة الحجمية 1 : 3 : 2 تتحقق لأن الحجوم تتناسب مع المعاملات.' },
        { label: '٣ الضغط على زر «أجري التفاعل في الوعاء ⚡»', msg: '⚗️ تحوّلت المتفاعلات إلى 10 L من غاز الأمونيا NH₃.' },
        { label: '٤ تأكيد النسب الحجمية في الجدول', msg: '✅ تحققي من القيم العددية في الجدول بالأسفل.' }
      ],
      checks: [
        { label: '١) كم لتراً من H₂ يلزم للتفاعل مع 5 L من N₂ لإنتاج الأمونيا؟', type: 'number', ans: 15, tol: 0.1 },
        { label: '٢) كم لتراً من غاز الأمونيا NH₃ ينتج عن هذا التفاعل؟', type: 'number', ans: 10, tol: 0.1 }
      ]
    }
  };

  /* Interactive Visual Widgets & Games imported cleanly for 6-3 */
  window.CHEM_INTERACTIVE_WIDGETS = {
    createForConcept: function (widgetId) {
      if (widgetId === '6-3-syrup') {
        const box = el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:0.45rem;width:100%;' });
        const btns = el('div', { style: 'display:flex;gap:0.4rem;flex-wrap:wrap;justify-content:center;' });
        const bCold = el('button', { type: 'button', className: 'btn btn-sm btn-primary', text: '❄️ القَطْر من الثلاجة' });
        const bHot = el('button', { type: 'button', className: 'btn btn-sm', text: '🔥 القَطْر بعد التسخين' });
        const svgWrap = el('div', { html: '<svg viewBox="0 0 220 220" class="concept-svg" style="max-width:210px;" aria-label="قنينة قطر تقطر"><path d="M80 12 h60 v36 c0 14 34 20 34 50 v90 c0 14 -12 22 -26 22 h-76 c-14 0 -26 -8 -26 -22 v-90 c0 -30 34 -36 34 -50z" fill="var(--gold-l)" stroke="var(--primary)" stroke-width="4"/><rect x="58" y="110" width="104" height="86" rx="10" fill="var(--gold)"/><circle id="syrupDrop" cx="110" cy="206" r="9" fill="var(--coral)"><animate attributeName="cy" values="196;216;196" dur="3.4s" repeatCount="indefinite"/></circle></svg>' });
        const note = el('span', { className: 'page-ref', text: 'بارد ← لزوجة عالية ← يتدفق ببطء' });
        bCold.addEventListener('click', function () {
          bCold.classList.add('btn-primary'); bHot.classList.remove('btn-primary');
          const anim = svgWrap.querySelector('animate'); if (anim) anim.setAttribute('dur', '3.4s');
          note.textContent = 'بارد ← لزوجة عالية ← يتدفق ببطء';
        });
        bHot.addEventListener('click', function () {
          bHot.classList.add('btn-primary'); bCold.classList.remove('btn-primary');
          const anim = svgWrap.querySelector('animate'); if (anim) anim.setAttribute('dur', '0.9s');
          note.textContent = 'ساخن ← طاقة حركية أعلى ← لزوجة أقل';
        });
        btns.appendChild(bCold); btns.appendChild(bHot);
        box.appendChild(btns); box.appendChild(svgWrap); box.appendChild(note);
        return box;
      }
      if (widgetId === '6-3-tension') {
        const box = el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:0.45rem;width:100%;' });
        const btns = el('div', { style: 'display:flex;gap:0.35rem;flex-wrap:wrap;justify-content:center;' });
        const bTension = el('button', { type: 'button', className: 'btn btn-sm btn-primary', text: '🧲 أسهم التوتر السطحي' });
        const bWater = el('button', { type: 'button', className: 'btn btn-sm', text: '💧 مخبار الماء (مقعر)' });
        const bMerc = el('button', { type: 'button', className: 'btn btn-sm', text: '☿️ مخبار الزئبق (محدب)' });
        const stage = el('div', { style: 'width:100%;display:flex;justify-content:center;' });
        const note = el('span', { className: 'muted-note', style: 'font-size:0.85rem;font-weight:700;text-align:center;' });

        function showTension() {
          [bTension, bWater, bMerc].forEach(x => x.classList.remove('btn-primary')); bTension.classList.add('btn-primary');
          stage.innerHTML = '<svg viewBox="0 0 320 200" class="concept-svg" aria-label="قوى الجذب على السطح وفي الداخل"><rect x="18" y="45" width="284" height="140" rx="14" fill="var(--surface-tint)"/><circle cx="160" cy="45" r="16" fill="var(--coral)"/><circle cx="105" cy="45" r="13" fill="var(--primary)" opacity=".5"/><circle cx="215" cy="45" r="13" fill="var(--primary)" opacity=".5"/><circle cx="160" cy="128" r="16" fill="var(--primary)"/><line x1="160" y1="45" x2="160" y2="85" stroke="var(--coral)" stroke-width="4"/><line x1="160" y1="45" x2="122" y2="45" stroke="var(--coral)" stroke-width="4"/><line x1="160" y1="45" x2="198" y2="45" stroke="var(--coral)" stroke-width="4"/><line x1="160" y1="128" x2="160" y2="92" stroke="var(--green)" stroke-width="3.5"/><line x1="160" y1="128" x2="160" y2="164" stroke="var(--green)" stroke-width="3.5"/><line x1="160" y1="128" x2="122" y2="128" stroke="var(--green)" stroke-width="3.5"/><line x1="160" y1="128" x2="198" y2="128" stroke="var(--green)" stroke-width="3.5"/><text x="160" y="24" text-anchor="middle" font-size="13" font-weight="800" fill="var(--ink)">جسيم السطح يُجذب للداخل والجانبين فقط</text></svg>';
          note.textContent = 'عدم تكافؤ القوى على السطح يجعله مشدوداً كالطبلة!';
        }
        function showMeniscus(isMerc) {
          [bTension, bWater, bMerc].forEach(x => x.classList.remove('btn-primary'));
          (isMerc ? bMerc : bWater).classList.add('btn-primary');
          const dPath = isMerc ? 'M112 105 Q160 65 208 105 L208 182 L112 182z' : 'M112 90 Q160 125 208 90 L208 182 L112 182z';
          const fill = isMerc ? '#94a3b8' : 'var(--primary)';
          stage.innerHTML = '<svg viewBox="0 0 320 200" class="concept-svg" aria-label="تقعر وتحدب سطح السائل"><rect x="110" y="20" width="100" height="164" fill="var(--bg)" stroke="var(--ink)" stroke-width="4"/><path d="' + dPath + '" fill="' + fill + '" opacity="0.82"/><text x="160" y="196" text-anchor="middle" font-size="13" font-weight="800" fill="var(--ink)">' + (isMerc ? 'الزئبق: التماسك > التلاصق ← محدّب' : 'الماء: التلاصق > التماسك ← مقعّر') + '</text></svg>';
          note.textContent = isMerc ? 'التماسك بين ذرات الزئبق أقوى من تلاصقها بالزجاج.' : 'التلاصق بين الماء والزجاج أقوى من تماسك جزيئات الماء.';
        }
        bTension.addEventListener('click', showTension);
        bWater.addEventListener('click', function () { showMeniscus(false); });
        bMerc.addEventListener('click', function () { showMeniscus(true); });
        showTension();
        btns.appendChild(bTension); btns.appendChild(bWater); btns.appendChild(bMerc);
        box.appendChild(btns); box.appendChild(stage); box.appendChild(note);
        return box;
      }
      if (widgetId === '6-3-crystals') {
        const box = el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:0.4rem;width:100%;' });
        const btns = el('div', { style: 'display:flex;gap:0.35rem;flex-wrap:wrap;justify-content:center;' });
        const names = ['مكعب بسيط', 'مركزي الجسم', 'مركزي الوجه'];
        const descs = [
          'مكعب بسيط: الجسيمات عند زوايا المكعب الثماني فقط.',
          'مكعب مركزي الجسم: زوايا المكعب + جسيم واحد في المركز.',
          'مكعب مركزي الوجه: الزوايا + وسط الأوجه الستة للمكعب.'
        ];
        const stage = el('div', { style: 'width:100%;display:flex;justify-content:center;' });
        const note = el('span', { className: 'muted-note', style: 'font-size:0.84rem;font-weight:700;text-align:center;' });
        function drawCube(t) {
          btns.querySelectorAll('button').forEach((b, i) => b.classList.toggle('btn-primary', i === t));
          const A = [[70, 72], [170, 72], [170, 172], [70, 172]];
          const B = A.map(p => [p[0] + 42, p[1] - 42]);
          let svg = '<svg viewBox="0 0 280 205" class="concept-svg" style="max-width:250px;" aria-label="وحدة البناء المكعبة">';
          for (let i = 0; i < 4; i++) {
            const n = (i + 1) % 4;
            svg += '<line x1="' + A[i][0] + '" y1="' + A[i][1] + '" x2="' + A[n][0] + '" y2="' + A[n][1] + '" stroke="var(--primary)" stroke-width="3"/>';
            svg += '<line x1="' + B[i][0] + '" y1="' + B[i][1] + '" x2="' + B[n][0] + '" y2="' + B[n][1] + '" stroke="var(--primary)" stroke-width="3"' + ((i === 2 || i === 3) ? ' stroke-dasharray="5 5"' : '') + '/>';
            svg += '<line x1="' + A[i][0] + '" y1="' + A[i][1] + '" x2="' + B[i][0] + '" y2="' + B[i][1] + '" stroke="var(--primary)" stroke-width="3"' + (i === 3 ? ' stroke-dasharray="5 5"' : '') + '/>';
          }
          A.concat(B).forEach(p => { svg += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="8" fill="var(--primary)"/>'; });
          if (t === 1) svg += '<circle cx="141" cy="101" r="10" fill="var(--coral)"/>';
          if (t === 2) {
            [[120, 122], [162, 80], [141, 51], [141, 151], [91, 101], [191, 101]].forEach(p => {
              svg += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="8" fill="var(--coral)"/>';
            });
          }
          svg += '</svg>';
          stage.innerHTML = svg;
          note.textContent = descs[t];
        }
        names.forEach((n, i) => {
          const b = el('button', { type: 'button', className: 'btn btn-sm', text: n });
          b.addEventListener('click', () => drawCube(i));
          btns.appendChild(b);
        });
        drawCube(0);
        box.appendChild(btns); box.appendChild(stage); box.appendChild(note);
        return box;
      }
      return null;
    },
    createCrystalExplorerSlide: function () {
      const wrap = el('div', { className: 'vlab-grid' });
      const sysBox = el('div', { className: 'vlab-steps-col' }, [
        el('h4', { className: 'vlab-steps-title', text: '💎 الأنظمة البلورية السبعة (الجدول 6-4 · ص 239)' })
      ]);
      const SYS = [
        ['مكعب', 'a = b = c', 'α = β = γ = 90°', 'مثال: الهالايت (NaCl)'],
        ['رباعي الأوجه', 'a = b ≠ c', 'α = β = γ = 90°', 'مثال: الفيزوفيانايت'],
        ['متوازي مستطيلات', 'a ≠ b ≠ c', 'α = β = γ = 90°', 'مثال: الأراجونايت'],
        ['سداسي الأوجه', 'a = b ≠ c', 'α = β = 90°, γ = 120°', 'مثال: التورمالين / الجرافيت'],
        ['معيني', 'a = b = c', 'α = β = γ ≠ 90°', 'مثال: الزمرد / الكالسيت'],
        ['أحادي الميل', 'a ≠ b ≠ c', 'α = γ = 90° ≠ β', 'مثال: الكروسيت'],
        ['ثلاثي الميل', 'a ≠ b ≠ c', 'α ≠ β ≠ γ ≠ 90°', 'مثال: الميكروكلاين']
      ];
      const sysBtns = el('div', { className: 'sim-controls' });
      const sysOut = el('div', { className: 'vlab-step-msg', style: 'text-align:center;' });
      SYS.forEach((s, i) => {
        const b = el('button', { type: 'button', className: 'btn btn-sm' + (i === 0 ? ' btn-primary' : ''), text: s[0] });
        b.addEventListener('click', () => {
          sysBtns.querySelectorAll('button').forEach(x => x.classList.remove('btn-primary'));
          b.classList.add('btn-primary');
          sysOut.innerHTML = '<strong>' + s[0] + '</strong><br><span class="chem">' + s[1] + ' | ' + s[2] + '</span><br>' + s[3];
        });
        sysBtns.appendChild(b);
      });
      sysOut.innerHTML = '<strong>' + SYS[0][0] + '</strong><br><span class="chem">' + SYS[0][1] + ' | ' + SYS[0][2] + '</span><br>' + SYS[0][3];
      sysBox.appendChild(sysBtns); sysBox.appendChild(sysOut);

      const gameBox = el('div', { className: 'vlab-verify-card' }, [
        el('h4', { text: '🎮 لعبة التصنيف: حدّدي نوع المادة الصلبة البلورية (الجدول 6-5)' })
      ]);
      const TYPES = ['ذرية', 'جزيئية', 'تساهمية شبكية', 'أيونية', 'فلزية'];
      const ITEMS = [
        ['Ar', 0, 'من عناصر المجموعة 18 وبين ذراتها قوى تشتت ضعيفة.'],
        ['SiO₂ (الكوارتز)', 2, 'ذرات مترابطة بروابط تساهمية في شبكة ثلاثية الأبعاد.'],
        ['NaCl', 3, 'بلورة أيونية من أيونات موجبة وسالبة صلبة وهشة.'],
        ['Cu (النحاس)', 4, 'أيونات موجبة في بحر من الإلكترونات الحرة.'],
        ['C₁₂H₂₂O₁₁ (السكر)', 1, 'مادة صلبة جزيئية رديئة التوصيل.'],
        ['C (الألماس)', 2, 'شبكة تساهمية من ذرات الكربون شديدة الصلابة.']
      ];
      let gi = 0, gScore = 0, gLocked = false;
      const gPrompt = el('div', { className: 'chem', style: 'font-size:1.35rem;font-weight:900;text-align:center;margin:0.35rem 0;' });
      const gOpts = el('div', { className: 'sim-controls' });
      const gFb = el('div', { className: 'vlab-step-msg', style: 'text-align:center;min-height:36px;' });
      const gFoot = el('div', { style: 'display:flex;justify-content:space-between;align-items:center;margin-top:0.4rem;' });
      const gNext = el('button', { type: 'button', className: 'btn btn-sm btn-primary', text: 'المادة التالية ←' });
      const gScLbl = el('span', { className: 'page-ref', text: 'النقاط: 0' });
      function renderGame() {
        const it = ITEMS[gi]; gLocked = false;
        gPrompt.textContent = it[0];
        gFb.textContent = 'اختاري نوع المادة الصلبة المناسب من الخيارات أعلاه.';
        gOpts.innerHTML = '';
        TYPES.forEach((t, i) => {
          const b = el('button', { type: 'button', className: 'btn btn-sm', text: t });
          b.addEventListener('click', () => {
            if (gLocked) return;
            if (i === it[1]) {
              gLocked = true; gScore++; b.classList.add('btn-primary');
              gFb.textContent = '✅ صحيح! ' + it[2];
              gScLbl.textContent = 'النقاط: ' + gScore;
            } else {
              gFb.textContent = '❌ حاولي مرة أخرى بالرجوع للجدول.';
            }
          });
          gOpts.appendChild(b);
        });
      }
      gNext.addEventListener('click', () => { gi = (gi + 1) % ITEMS.length; renderGame(); });
      renderGame();
      gFoot.appendChild(gNext); gFoot.appendChild(gScLbl);
      gameBox.appendChild(gPrompt); gameBox.appendChild(gOpts); gameBox.appendChild(gFb); gameBox.appendChild(gFoot);
      wrap.appendChild(sysBox); wrap.appendChild(gameBox);
      return wrap;
    }
  };
})();
