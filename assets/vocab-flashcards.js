/* Shared Vocabulary Flashcards & Textbook Figure Library for All Chemistry Lessons */
(function () {
  var VOCAB_DEFS = {
    // 6-1 الغازات
    'نظرية الحركة الجزيئية': 'نموذج يفسّر سلوك المادة اعتماداً على حركة جسيماتها المستمرة والعشوائية وطاقتها الحركية.',
    'التصادم المرن': 'تصادم لا تُفقد فيه الطاقة الحركية الكلية بل تنتقل بين الجسيمات المتصادمة دون ضياع.',
    'درجة الحرارة': 'مقياس لمتوسط الطاقة الحركية لجسيمات المادة؛ كلما زادت الحرارة زادت سرعة الجسيمات.',
    'الانتشار': 'حركة تداخل الغازات والمواد معاً عشوائياً حتى تتوزع بانتظام في الوعاء.',
    'التدفق': 'خروج الغاز عبر ثقب ضيّق جداً تحت تأثير فرق الضغط بسرعة تتناسب عكسياً مع جذر الكتلة المولية.',
    'قانون جراهام': 'يتناسب معدل انتشار أو تدفق الغاز عكسياً مع الجذر التربيعي لكتلته المولية: r₁/r₂ = √(M₂/M₁).',
    'الضغط': 'القوة الواقعة على وحدة المساحة (P = F/A)، وينشأ ضغط الغاز عن تصادم جسيماته بجدران الوعاء.',
    'البارومتر': 'جهاز يُستخدم لقياس الضغط الجوي اعتماداً على ارتفاع عمود الزئبق (760 mmHg = 1 atm).',
    'المانومتر': 'جهاز على شكل حرف U يُستخدم لقياس ضغط غاز محصور مقارنة بالضغط الجوي.',
    'باسكال': 'وحدة قياس الضغط في النظام الدولي SI، وتساوي نيوتن واحد لكل متر مربع (1 N/m²).',
    'قانون دالتون': 'الضغط الكلي لخليط من الغازات يساوي مجموع الضغوط الجزئية للغازات المكوِّنة له.',

    // 6-2 قوى التجاذب
    'قوى الترابط الجزيئية': 'القوى القوية داخل الجزيء نفسه التي تربط الذرات معاً (الأيونية، التساهمية، الفلزية).',
    'القوى بين الجزيئات': 'قوى جذب أضعف تنشأ بين الجزيئات المتجاورة وتحدّد الحالة الفيزيائية ودرجة الغليان.',
    'قوى التشتت (لندن)': 'قوى تجاذب ضعيفة ومؤقتة تنشأ عن إزاحة لحظية للسحابة الإلكترونية في جميع الجزيئات، وتزداد بازدياد الكتلة المولية.',
    'القوى الثنائية القطبية': 'تجاذب مستمر بين الشحنات الجزئية الموجبة والسالبة في الجزيئات القطبية الدائمة.',
    'الرابطة الهيدروجينية': 'قوة ترابط قوية بين ذرة هيدروجين مرتبطة تساهمياً بذرة عالية الكهروسالبية (F أو O أو N) وزوج إلكترونات غير رابط.',

    // 6-3 المواد السائلة والمواد الصلبة
    'الميوعة': 'قابلية السوائل والغازات للانسياب والانتشار لانزلاق جسيماتها بعضها فوق بعض.',
    'اللزوجة': 'مقياس لمقاومة السائل للتدفق والانسياب؛ تزيد بزيادة قوى التجاذب وتنخفض بارتفاع الحرارة.',
    'التوتر السطحي': 'الطاقة اللازمة لزيادة مساحة سطح السائل بمقدار معين نتيجة عدم تكافؤ قوى الجذب على السطح.',
    'عوامل خافضة للتوتر السطحي': 'مركبات كيميائية مثل الصابون والمنظفات تقلل التوتر السطحي للماء بتكسير روابطه الهيدروجينية.',
    'التماسك والتلاصق': 'التماسك: تجاذب بين جسيمات المادة نفسها؛ التلاصق: تجاذب بين جسيمات مادتين مختلفتين كالماء والزجاج.',
    'الخاصية الشعرية': 'ارتفاع السائل داخل الأنابيب الضيقة عندما تكون قوى التلاصق مع الجدار أكبر من قوى التماسك.',
    'وحدة البناء': 'أصغر وحدة ترتيبية منتظمة من الجسيمات في الشبكة البلورية تحمل نفس التماثل الهندسي للبلورة.',
    'التآصل': 'ظاهرة وجود العنصر نفسه بأكثر من شكل هندسي في الحالة الفيزيائية نفسها مثل الماس والجرافيت للكربون.',
    'المواد الصلبة غير المتبلورة': 'مواد صلبة تترتب جسيماتها عشوائياً دون بناء بلوري منتظم مثل الزجاج والمطاط والبلاستيك.',

    // 6-4 تغيرات الحالة الفيزيائية
    'الانصهار': 'تحوّل المادة من الحالة الصلبة إلى السائلة بامتصاص طاقة حرارية تكفي لتفكيك الشبكة البلورية.',
    'التبخر': 'تحوّل المادة من الحالة السائلة إلى الحالة الغازية أو البخار بامتصاص طاقة حرارية.',
    'التبخر السطحي': 'تبخر يحدث على سطح السائل فقط دون وصوله إلى درجة الغليان.',
    'ضغط البخار': 'الضغط الذي يمارسه البخار فوق سطح السائل عندما يتساوى معدل التبخر مع معدل التكاثف.',
    'درجة الغليان': 'درجة الحرارة التي يتساوى عندها ضغط بخار السائل مع الضغط الجوي الخارجي.',
    'التسامي': 'تحوّل المادة مباشرة من الحالة الصلبة إلى الحالة الغازية دون المرور بالحالة السائلة مثل الثلج الجاف.',
    'التجمد': 'تحوّل المادة من الحالة السائلة إلى الحالة الصلبة عند فقدان طاقة حرارية وتقارب الجسيمات.',
    'التكاثف': 'تحوّل المادة من الحالة الغازية (البخار) إلى الحالة السائلة مع إطلاق طاقة حرارية.',
    'الترسب': 'تحوّل المادة مباشرة من الحالة الغازية إلى الحالة الصلبة دون المرور بالحالة السائلة مثل تكون الصقيع.',
    'مخطط الطور': 'رسم بياني يبيّن حالة المادة الفيزيائية (صلب، سائل، غاز) اعتماداً على الضغط ودرجة الحرارة.',
    'النقطة الثلاثية': 'درجة حرارة وضغط محددتان تتزن عندهما الحالات الثلاث (الصلبة والسائلة والغازية) للمادة معاً.',
    'النقطة الحرجة': 'درجة الحرارة والضغط اللتان لا يمكن فوقهما التمييز بين السائل والغاز أو إسالة البخار بالضغط.',

    // 7-1 قوانين الغازات
    'قانون بويل': 'يتناسب حجم كمية محددة من الغاز عكسياً مع الضغط الواقع عليه عند ثبوت درجة الحرارة (P₁V₁ = P₂V₂).',
    'الصفر المطلق': 'أدنى درجة حرارة ممكنة نظرياً (0 K = -273.15°C) تنعدم عندها الطاقة الحركية للجسيمات.',
    'قانون شارل': 'يتناسب حجم كمية محددة من الغاز طردياً مع درجة حرارته بالكلفن عند ثبوت الضغط (V₁/T₁ = V₂/T₂).',
    'قانون جاي-لوساك': 'يتناسب ضغط كمية محددة من الغاز طردياً مع درجة حرارته بالكلفن عند ثبوت الحجم (P₁/T₁ = P₂/T₂).',
    'القانون العام للغازات': 'قانون يربط الضغط والحجم ودرجة الحرارة بالكلفن لكمية محددة من الغاز: (P₁V₁/T₁ = P₂V₂/T₂).',

    // 7-2 قانون الغاز المثالي
    'مبدأ أفوجادرو': 'الحجوم المتساوية من الغازات المختلفة تحت نفس الظروف من الضغط والحرارة تحتوي العدد نفسه من الجسيمات.',
    'الحجم المولاري (22.4 L)': 'الحجم الذي يشغله مول واحد (1 mol) من أي غاز مثالي عند الظروف المعيارية STP ويساوي 22.4 L.',
    'الظروف المعيارية STP': 'الظروف القياسية المتفق عليها للغازات: درجة حرارة 0.00°C (273 K) وضغط 1.00 atm.',
    'ثابت الغاز المثالي R': 'ثابت التناسب في قانون الغاز المثالي وقيمته 0.0821 L·atm/(mol·K) عند استخدام الضغط بالـ atm.',
    'قانون الغاز المثالي': 'العلاقة الرياضية التي تربط متغيرات الغاز الأربعة: PV = nRT.',
    'الغاز الحقيقي': 'غاز تتأثر جسيماته بقوى تجاذب فيما بينها ولها حجم فعلي، لذا يحيد عن السلوك المثالي عند الضغط العالي أو التبريد الشديد.',

    // 7-3 الحسابات المتعلقة بالغازات
    'المعاملات الكيميائية': 'الأرقام التي تسبق الصيغ الكيميائية في المعادلة الموزونة وتحدد نسب المولات وحجوم الغازات.',
    'النسب الحجمية': 'نسبة حجوم الغازات المتفاعلة والناتجة وتساوي تماماً نسبة معاملاتها المولية عند ثبوت P و T.',
    'حسابات الحجم-حجم': 'تحديد حجم غاز مطلوب أو ناتج من حجم غاز آخر معلوم باستخدام النسبة الحجمية مباشرة من المعادلة.',
    'حسابات الحجم-كتلة': 'إيجاد كتلة أو حجم مادة بالربط بين معادلة التفاعل الموزونة وقانون الغاز المثالي PV = nRT.',

    // 4-1 الخلايا الجلفانية
    'الخلية الكهروكيميائية': 'جهاز يستخدم تفاعلات الأكسدة والاختزال لإنتاج طاقة كهربائية، أو يستخدم الكهرباء لإحداث تفاعل كيميائي.',
    'الخلية الجلفانية': 'خلية كهروكيميائية تحوّل الطاقة الكيميائية إلى طاقة كهربائية عبر تفاعل أكسدة واختزال تلقائي.',
    'نصف الخلية': 'أحد قسمي الخلية الكهروكيميائية ويحتوي على قطب فلزي مغمور في محلول يحتوي أيوناته.',
    'الأنود (المصعد)': 'القطب الذي يحدث عنده تفاعل الأكسدة (فقد الإلكترونات) ويكون سالباً في الخلية الجلفانية وموجباً في التحليل.',
    'الكاثود (المهبط)': 'القطب الذي يحدث عنده تفاعل الاختزال (اكتساب الإلكترونات) ويكون موجباً في الخلية الجلفانية وسالباً في التحليل.',
    'القنطرة الملحية': 'أنبوب مملوء بمحلول إلكتروليتي يسمح بمرور الأيونات لإغلاق الدائرة والمحافظة على التعادل الكهربائي.',
    'جهد الاختزال': 'مقياس لقابلية نصف الخلية على اكتساب الإلكترونات والاختزال مقارنة بقطب الهيدروجين القياسي (0.00 V).',
    'قطب الهيدروجين القياسي': 'القطب المرجعي العالمي لقياس جهود الاختزال، جهده يساوي 0.00 V تماماً في الظروف القياسية.',

    // 4-2 البطاريات
    'البطارية': 'خلية جلفانية واحدة أو عدة خلايا متصلة في عبوة واحدة تنتج تياراً كهربائياً مباشراً.',
    'الخلية الجافة': 'خلية جلفانية أولية (1.5 V) إلكتروليتها عجينة رطبة من NH₄Cl و MnO₂ و ZnCl₂ وحافظتها من الخارصين.',
    'البطارية الأولية': 'بطارية تعتمد على تفاعلات غير عكسية تُستخدم مرة واحدة ولا يمكن إعادة شحنها مثل الخلية الجافة.',
    'البطارية الثانوية': 'بطارية قابلة لإعادة الشحن عبر عكس تفاعلاتها بتيار خارجي مثل المركم الرصاصي وبطارية الليثيوم.',
    'خلية الوقود': 'خلية جلفانية تتأكسد فيها طاقة الوقود (مثل الهيدروجين مع الأكسجين) باستمرار لتوليد الكهرباء والماء النقي.',
    'التآكل': 'خسارة الفلز الناتجة عن تفاعل أكسدة واختزال تلقائي مع أكسجين الهواء والرطوبة مثل صدأ الحديد.',
    'الجلفنة': 'تغليف الحديد بطبقة من فلز الخارصين الأكثر نشاطاً لحمايته وعزله عن التآكل.',
    'الأنود المضحي': 'كتلة من فلز أنشط (كالماغنسيوم أو الخارصين) توصل بالحديد فتتأكسد بدلاً منه وتحميه من الصدأ.',

    // 4-3 التحليل الكهربائي
    'التحليل الكهربائي': 'استخدام الطاقة الكهربائية القسرية لإحداث تفاعل أكسدة واختزال غير تلقائي.',
    'خلية التحليل الكهربائي': 'خلية كهروكيميائية يُطبّق فيها مصدر جهد خارجي لعكس التفاعلات وإنتاج عناصر أو طلاء معادن.',
    'خلية داون': 'خلية تحليل كهربائي صناعية لمصهور كلوريد الصوديوم NaCl لإنتاج فلز الصوديوم النقي وغاز الكلور Cl₂.',
    'عملية هول-هيروليت': 'عملية تحليل كهربائي لأكسيد الألومنيوم المذاب في مصهور الكريوليت لاستخلاص الألومنيوم النقي.',
    'تنقية الفلزات': 'فصل الشوائب عن فلز غير نقي كالنحاس بجعله أنوداً ليترسب نقياً على الكاثود بالتحليل الكهربائي.',
    'الطلاء بالكهرباء': 'ترسيب طبقة رقيقة من فلز نقي (كالفضة أو الذهب) على جسم معدني موضوع عند الكاثود.'
  };

  var BOOK_FIGURES = {
    '6-1': [
      { src: '../assets/book-imgs/6-1.png', title: 'الشكل 6-7: قانون دالتون للضغوط الجزئية', caption: 'الضغط الكلي لخليط الغازات يساوي مجموع الضغوط الجزئية للغازات المكونة له.' },
      { src: '../assets/book-imgs/6-1b.png', title: 'الشكل 6-4: العلاقة العكسية بين الضغط والمساحة', caption: 'تركيز القوة على مساحة أصغر يضاعف الضغط المؤثر على السطح.' }
    ],
    '6-2': [
      { src: '../assets/book-imgs/6-2.png', title: 'الشكل 6-11: الروابط الهيدروجينية في الماء', caption: 'تربط الروابط الهيدروجينية جزيئات الماء القطبية بقوة أكبر من قوى ثنائية القطب.' }
    ],
    '6-3': [
      { src: '../assets/book-imgs/6-3.png', title: 'الجدول 6-4: وحدات البناء والأنظمة البلورية', caption: 'أشكال الشبكات البلورية السبع التي تترتب وفقها المواد الصلبة المتبلورة.' }
    ],
    '6-4': [
      { src: '../assets/book-imgs/6-4.png', title: 'الشكل 6-29: مخطط الطور للماء', caption: 'يوضح تغيّر حالة الماء (صلب، سائل، بخار) بتغيّر الحرارة والضغط مع النقطة الثلاثية والحرجة.' }
    ],
    '7-1': [
      { src: '../assets/book-imgs/7-1.png', title: 'الشكل 7-1: قانون بويل ومكبس الضغط', caption: 'زيادة الضغط المؤثر تقلص الحجم عكسياً عند ثبوت درجة الحرارة (P₁V₁ = P₂V₂).' }
    ],
    '7-2': [
      { src: '../assets/book-imgs/7-2.png', title: 'الشكل 7-5: مبدأ أفوجادرو والحجم المولاري', caption: 'الحجوم المتساوية من الغازات المختلفة تحت نفس الظروف تحتوي نفس العدد من الجسيمات.' }
    ],
    '7-3': [
      { src: '../assets/book-imgs/7-3.png', title: 'الشكل 7-10: النسب الحجمية من المعادلة الموزونة', caption: 'تتطابق نسب حجوم الغازات المتفاعلة والناتجة مع معاملات المعادلة الموزونة.' }
    ],
    '4-1': [
      { src: '../assets/book-imgs/4-1b.png', title: 'الشكل 4-2: الخلية الجلفانية الكاملة بالقنطرة الملحية', caption: 'مرور الإلكترونات في السلك الخارجي وهجرة الأيونات عبر القنطرة الملحية للحفاظ على التعادل.' }
    ],
    '4-2': [
      { src: '../assets/book-imgs/4-2.png', title: 'الشكل 4-8: تركيب الخلية الجافة (خارصين-كربون)', caption: 'تعمل حافظة الخارصين أنوداً وعمود الكربون كاثوداً داخل عجينة رطبة من MnO₂ و NH₄Cl.' },
      { src: '../assets/book-imgs/4-2b.png', title: 'الشكل 4-13: خلية الوقود الهيدروجينية (PEM)', caption: 'يتأكسد H₂ عند الأنود ويُختزل O₂ عند الكاثود لتوليد كهرباء مستمرة وعادم من الماء النقي.' }
    ],
    '4-3': [
      { src: '../assets/book-imgs/4-3.png', title: 'الشكل 4-20: خلية داون لتحليل مصهور NaCl', caption: 'فصل الصوديوم المصهور عن غاز الكلور الناتج باستخدام حاجز شبكي من الحديد.' },
      { src: '../assets/book-imgs/4-3b.png', title: 'الشكل 4-21: التحليل الكهربائي لماء البحر', caption: 'ينتج غاز الكلور والهيدروجين ومحلول هيدروكسيد الصوديوم لأن الماء أسهل اختزالاً من Na⁺.' }
    ]
  };

  function injectStyles() {
    if (document.getElementById('vocabFlashCss')) return;
    var st = document.createElement('style');
    st.id = 'vocabFlashCss';
    st.textContent = [
      '.vocab-head-row{display:flex;align-items:center;justify-content:space-between;gap:.6rem;flex-wrap:wrap;margin:.45rem 0 .45rem;}',
      '.vocab-head-row h3{margin:0;color:var(--primary,var(--blue,#2a7de1));font-size:1.05rem;font-weight:900;}',
      '.vocab-flip-all{border:1.5px solid var(--border,var(--line,#d8d3c5));background:var(--surface-muted,var(--soft,#faf8f3));color:var(--text,var(--ink,#1d2742));border-radius:10px;padding:.3rem .75rem;font-weight:800;font-size:.86rem;cursor:pointer;min-height:36px;}',
      '.vocab-flip-all:hover{border-color:var(--primary,var(--blue,#2a7de1));}',
      '.vocab-flash-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(195px,1fr));gap:.55rem;}',
      '.vocab-flash-grid.compact{grid-template-columns:repeat(auto-fill,minmax(175px,1fr));gap:.45rem;}',
      '.vocab-flashcard{text-align:right;border:2px solid var(--border,var(--line,#d8d3c5));border-right:5px solid var(--primary,var(--blue,#2a7de1));background:var(--surface,var(--card,#fff));color:var(--text,var(--ink,#1d2742));border-radius:14px;padding:.55rem .75rem;cursor:pointer;transition:transform .16s ease,border-color .16s ease,background-color .18s ease,box-shadow .18s ease;display:flex;flex-direction:column;gap:.25rem;min-height:54px;box-shadow:0 2px 6px rgba(0,0,0,.04);}',
      '.vocab-flashcard:hover{transform:translateY(-2px);border-color:var(--primary,var(--blue,#2a7de1));box-shadow:0 6px 14px rgba(42,125,225,.12);}',
      '.vocab-flashcard .flash-top{display:flex;align-items:center;justify-content:space-between;gap:.4rem;width:100%;}',
      '.vocab-flashcard .flash-term{font-weight:900;font-size:.96rem;line-height:1.35;}',
      '.vocab-flashcard .flash-hint{font-size:.74rem;font-weight:800;color:var(--primary,var(--blue,#2a7de1));background:var(--surface-tint,var(--red-l,#e6f0fd));padding:.1rem .45rem;border-radius:999px;white-space:nowrap;}',
      '.vocab-flashcard .flash-def{display:none;font-size:.88rem;line-height:1.55;font-weight:600;color:var(--text-muted,var(--muted,#5d6886));border-top:1px dashed var(--border,var(--line,#d8d3c5));padding-top:.32rem;margin-top:.15rem;}',
      '.vocab-flashcard.flipped{background:var(--surface-tint,var(--red-l,#e6f0fd));border-color:var(--secondary,var(--green,#0b8a4a));border-right-color:var(--secondary,var(--green,#0b8a4a));}',
      '.vocab-flashcard.flipped .flash-hint{background:var(--secondary,var(--green,#0b8a4a));color:#fff;}',
      '.vocab-flashcard.flipped .flash-def{display:block;color:var(--text,var(--ink,#1d2742));}',
      '.book-fig-card{background:var(--surface-muted,var(--soft,#faf8f3));border:2px solid var(--border,var(--line,#d8d3c5));border-radius:16px;padding:.75rem;margin-top:.7rem;display:flex;flex-direction:column;gap:.45rem;}',
      '.book-fig-head{display:flex;align-items:center;justify-content:space-between;gap:.5rem;flex-wrap:wrap;}',
      '.book-fig-tag{font-size:.82rem;font-weight:900;color:var(--primary,var(--blue,#2a7de1));background:var(--surface-tint,var(--red-l,#e6f0fd));padding:.15rem .65rem;border-radius:999px;}',
      '.book-fig-img{width:100%;max-height:290px;object-fit:contain;border-radius:12px;background:#fff;border:1px solid var(--border,var(--line,#d8d3c5));cursor:zoom-in;}',
      '.book-fig-cap{margin:0;font-size:.88rem;font-weight:700;color:var(--text-muted,var(--muted,#5d6886));text-align:center;}',
      '.book-fig-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:.85rem;margin-top:.85rem;}',
      '.book-zoom-modal{position:fixed;inset:0;z-index:999;background:rgba(15,23,42,.78);display:none;align-items:center;justify-content:center;padding:1rem;cursor:zoom-out;}',
      '.book-zoom-modal.open{display:flex;}',
      '.book-zoom-modal img{max-width:95vw;max-height:90vh;border-radius:14px;background:#fff;padding:6px;box-shadow:0 20px 50px rgba(0,0,0,.4);}'
    ].join('');
    document.head.appendChild(st);
  }

  function openZoom(src, alt) {
    injectStyles();
    var m = document.getElementById('bookZoomModal');
    if (!m) {
      m = document.createElement('div');
      m.id = 'bookZoomModal';
      m.className = 'book-zoom-modal';
      m.innerHTML = '<img alt="">';
      m.addEventListener('click', function () { m.classList.remove('open'); });
      document.body.appendChild(m);
    }
    var im = m.querySelector('img');
    im.src = src;
    im.alt = alt || 'شكل من الكتاب المدرسي';
    m.classList.add('open');
  }

  function createVocabFlashcards(terms, opts) {
    injectStyles();
    opts = opts || {};
    var wrap = document.createElement('div');
    wrap.className = 'vocab-flash-wrap';

    var head = document.createElement('div');
    head.className = 'vocab-head-row';
    var h3 = document.createElement('h3');
    h3.textContent = opts.title || '🃏 المفردات الأساسية (اضغطي على الكلمة لكشف التعريف)';
    var toggleAll = document.createElement('button');
    toggleAll.type = 'button';
    toggleAll.className = 'vocab-flip-all';
    toggleAll.textContent = 'كشف جميع التعريفات';
    head.appendChild(h3);
    head.appendChild(toggleAll);
    wrap.appendChild(head);

    var grid = document.createElement('div');
    grid.className = 'vocab-flash-grid' + (opts.compact ? ' compact' : '');
    var cards = [];
    (terms || []).forEach(function (term) {
      var def = VOCAB_DEFS[term] || 'مصطلح كيميائي أساسي في هذا الدرس — راجعي الشرح والتجربة.';
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'vocab-flashcard';
      card.setAttribute('aria-expanded', 'false');

      var top = document.createElement('div');
      top.className = 'flash-top';
      var tSpan = document.createElement('span');
      tSpan.className = 'flash-term';
      tSpan.innerHTML = term;
      var hint = document.createElement('span');
      hint.className = 'flash-hint';
      hint.textContent = 'التعريف';
      top.appendChild(tSpan);
      top.appendChild(hint);

      var dDiv = document.createElement('div');
      dDiv.className = 'flash-def';
      dDiv.textContent = def;

      card.appendChild(top);
      card.appendChild(dDiv);
      card.addEventListener('click', function () {
        var next = !card.classList.contains('flipped');
        card.classList.toggle('flipped', next);
        card.setAttribute('aria-expanded', next ? 'true' : 'false');
        hint.textContent = next ? 'مكشوف ✓' : 'التعريف';
        if (opts.onFlip && next) opts.onFlip(term, card);
      });
      cards.push({ card: card, hint: hint });
      grid.appendChild(card);
    });

    var allOpen = false;
    toggleAll.addEventListener('click', function () {
      allOpen = !allOpen;
      cards.forEach(function (c) {
        c.card.classList.toggle('flipped', allOpen);
        c.card.setAttribute('aria-expanded', allOpen ? 'true' : 'false');
        c.hint.textContent = allOpen ? 'مكشوف ✓' : 'التعريف';
      });
      toggleAll.textContent = allOpen ? 'إخفاء جميع التعريفات' : 'كشف جميع التعريفات';
    });

    wrap.appendChild(grid);
    return wrap;
  }

  function createBookFigureCard(fig) {
    injectStyles();
    var box = document.createElement('div');
    box.className = 'book-fig-card';

    var head = document.createElement('div');
    head.className = 'book-fig-head';
    var badge = document.createElement('span');
    badge.className = 'book-fig-tag';
    badge.textContent = '📖 ' + fig.title;
    var zBtn = document.createElement('button');
    zBtn.type = 'button';
    zBtn.className = 'vocab-flip-all';
    zBtn.textContent = '🔍 تكبير';
    zBtn.addEventListener('click', function () { openZoom(fig.src, fig.title); });
    head.appendChild(badge);
    head.appendChild(zBtn);

    var img = document.createElement('img');
    img.className = 'book-fig-img';
    img.src = fig.src;
    img.alt = fig.title;
    img.addEventListener('click', function () { openZoom(fig.src, fig.title); });

    var cap = document.createElement('p');
    cap.className = 'book-fig-cap';
    cap.textContent = fig.caption;

    box.appendChild(head);
    box.appendChild(img);
    box.appendChild(cap);
    return box;
  }

  window.CHEM_VOCAB_DEFS = VOCAB_DEFS;
  window.CHEM_BOOK_FIGURES = BOOK_FIGURES;
  window.createVocabFlashcards = createVocabFlashcards;
  window.createBookFigureCard = createBookFigureCard;
})();
