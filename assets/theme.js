// Theme toggle & shared curriculum catalog + student progress helpers
(function () {
  const THEME_KEY = 'chem_portal_theme';
  const PROGRESS_KEY = 'chem_portal_progress_v1';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
      const isDark = theme === 'dark';
      btn.setAttribute('aria-pressed', String(isDark));
      btn.textContent = isDark ? 'الوضع النهاري' : 'الوضع الليلي';
    }
  }

  function initTheme() {
    let saved = 'light';
    try {
      const raw = localStorage.getItem(THEME_KEY);
      if (raw === 'dark' || raw === 'light') saved = raw;
    } catch (_) {}
    applyTheme(saved);

    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
      btn.addEventListener('click', function () {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem(THEME_KEY, next); } catch (_) {}
        applyTheme(next);
      });
    }
  }

  function getProgress() {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  }

  function saveLessonScore(lessonId, score, total) {
    try {
      const data = getProgress();
      const prev = data[lessonId];
      const pct = total > 0 ? Math.round((score / total) * 100) : 0;
      if (!prev || pct >= prev.pct) {
        data[lessonId] = { score, total, pct, updatedAt: Date.now() };
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
      }
    } catch (_) {}
  }

  window.CHEM_PORTAL = {
    getProgress,
    saveLessonScore,
    books: [
      {
        id: 'chem-2-1',
        title: 'كيمياء 2-1',
        subtitle: 'التعليم الثانوي · نظام المسارات',
        pageUrl: 'chem-2-1.html',
        chapters: [
          {
            id: 'ch6',
            code: 'الفصل 6',
            title: 'حالات المادة',
            generalIdea: 'تفسر نظرية الحركة الجزيئية الخصائص المختلفة للمواد الصلبة والسائلة والغازية.',
            lessons: [
              { id: '6-1', code: '6-1', title: 'الغازات', pages: 'ص 218–227', mainIdea: 'تتمدد الغازات وتنتشر وتنضغط لأنها ذات كثافة منخفضة وتتكون من جسيمات صغيرة دائمة الحركة.' },
              { id: '6-2', code: '6-2', title: 'قوى التجاذب', pages: 'ص 228–232', mainIdea: 'تحدد القوى بين الجزيئات (التشتت، الثنائية القطبية، الروابط الهيدروجينية) حالة المادة عند درجة حرارة معينة.' },
              { id: '6-3', code: '6-3', title: 'المواد السائلة والمواد الصلبة', pages: 'ص 233–242', mainIdea: 'لجسيمات المواد الصلبة والسائلة قدرة محدودة على الحركة ويصعب ضغطها بسهولة.' },
              { id: '6-4', code: '6-4', title: 'تغيرات الحالة الفيزيائية', pages: 'ص 243–248', mainIdea: 'تتغير حالة المادة عند إضافة الطاقة إليها أو انتزاعها منها.' }
            ]
          },
          {
            id: 'ch7',
            code: 'الفصل 7',
            title: 'الغازات',
            generalIdea: 'تستجيب الغازات لتغيرات الضغط ودرجة الحرارة والحجم وعدد الجسيمات بطرائق يمكن التنبؤ بها.',
            lessons: [
              { id: '7-1', code: '7-1', title: 'قوانين الغازات', pages: 'ص 262–272', mainIdea: 'تغير الضغط أو درجة الحرارة أو الحجم لكمية ثابتة من الغاز يؤثر على المتغيرين الآخرين.' },
              { id: '7-2', code: '7-2', title: 'قانون الغاز المثالي', pages: 'ص 273–280', mainIdea: 'يربط قانون الغاز المثالي عدد المولات مع كل من الضغط ودرجة الحرارة والحجم.' },
              { id: '7-3', code: '7-3', title: 'الحسابات المتعلقة بالغازات', pages: 'ص 281–285', mainIdea: 'المعاملات في المعادلات الكيميائية الموزونة للغازات تشير إلى أعداد المولات والحجوم النسبية.' }
            ]
          }
        ]
      },
      {
        id: 'chem-3',
        title: 'كيمياء 3',
        subtitle: 'التعليم الثانوي · نظام المسارات',
        pageUrl: 'chem-3.html',
        chapters: [
          {
            id: 'ch4',
            code: 'الفصل 4',
            title: 'الكيمياء الكهربائية',
            generalIdea: 'يمكن تحويل الطاقة الكيميائية إلى طاقة كهربائية، كما يمكن تحويل الطاقة الكهربائية إلى طاقة كيميائية.',
            lessons: [
              { id: '4-1', code: '4-1', title: 'الخلايا الجلفانية', pages: 'ص 134–143', mainIdea: 'تحدث الأكسدة في الخلايا الجلفانية عند الأنود منتجة إلكترونات تتدفق نحو الكاثود حيث يحدث الاختزال.' },
              { id: '4-2', code: '4-2', title: 'البطاريات', pages: 'ص 144–153', mainIdea: 'البطاريات خلايا جلفانية تستعمل التفاعلات التلقائية لإنتاج الطاقة لأغراض متعددة.' },
              { id: '4-3', code: '4-3', title: 'التحليل الكهربائي', pages: 'ص 154–158', mainIdea: 'يؤدي وجود مصدر تيار كهربائي في التحليل الكهربائي إلى حدوث تفاعل أكسدة واختزال غير تلقائي.' }
            ]
          }
        ]
      }
    ]
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
})();
