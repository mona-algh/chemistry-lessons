// Renders Home Page (index.html) and Book Pages (chem-2-1.html, chem-3.html) from CHEM_PORTAL
(function () {
  function renderHome() {
    const booksContainer = document.getElementById('homeBooksGrid');
    const summaryText = document.getElementById('progressSummaryText');
    const summaryBar = document.getElementById('progressSummaryBar');
    if (!booksContainer || !window.CHEM_PORTAL) return;

    const progress = window.CHEM_PORTAL.getProgress();
    let totalLessons = 0;
    let completedLessons = 0;

    booksContainer.innerHTML = '';

    window.CHEM_PORTAL.books.forEach(function (book) {
      const panel = document.createElement('section');
      panel.className = 'book-panel';

      const header = document.createElement('div');
      header.className = 'book-panel-header';
      header.innerHTML =
        '<div><span class="book-tag">' + book.subtitle + '</span><h2>' + book.title + '</h2></div>' +
        '<a class="btn btn-sm btn-primary" href="' + book.pageUrl + '">صفحة الكتاب</a>';
      panel.appendChild(header);

      book.chapters.forEach(function (ch) {
        const chBlock = document.createElement('div');
        chBlock.className = 'chapter-block';
        chBlock.innerHTML =
          '<div class="chapter-heading">' +
          '<h3>' + ch.code + ': ' + ch.title + '</h3>' +
          '<span class="chapter-meta">' + ch.lessons.length + ' دروس</span>' +
          '</div>';

        const ul = document.createElement('ul');
        ul.className = 'lesson-list';

        ch.lessons.forEach(function (ls) {
          totalLessons++;
          const rec = progress[ls.id];
          if (rec) completedLessons++;

          const li = document.createElement('li');
          const a = document.createElement('a');
          a.className = 'lesson-item-link';
          a.href = 'lessons/' + ls.id + '.html';

          const statusClass = rec ? 'status-pill done' : 'status-pill';
          const statusLabel = rec ? ('الدرجة: ' + rec.pct + '%') : 'لم يُختبر بعد';

          a.innerHTML =
            '<span class="lesson-item-main">' +
            '<span class="lesson-code">' + ls.code + '</span>' +
            '<span class="lesson-title-text">' + ls.title + '</span>' +
            '</span>' +
            '<span class="' + statusClass + '">' + statusLabel + '</span>';

          li.appendChild(a);
          ul.appendChild(li);
        });

        chBlock.appendChild(ul);
        panel.appendChild(chBlock);
      });

      booksContainer.appendChild(panel);
    });

    if (summaryText && summaryBar) {
      const pct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      summaryBar.style.width = pct + '%';
      summaryText.textContent = completedLessons === 0
        ? 'لم تُحل اختبارات نهائية بعد · المتاح حالياً ' + totalLessons + ' دروس تفاعلية.'
        : 'أنجزت اختبارات ' + completedLessons + ' من أصل ' + totalLessons + ' دروس (' + pct + '%).';
    }
  }

  function renderBookPage() {
    const bookRoot = document.getElementById('bookChaptersRoot');
    const bookId = document.body.getAttribute('data-book-id');
    if (!bookRoot || !bookId || !window.CHEM_PORTAL) return;

    const book = window.CHEM_PORTAL.books.find(function (b) { return b.id === bookId; });
    if (!book) return;

    const progress = window.CHEM_PORTAL.getProgress();
    bookRoot.innerHTML = '';

    book.chapters.forEach(function (ch) {
      const sec = document.createElement('section');
      sec.className = 'chapter-section';

      const banner = document.createElement('div');
      banner.className = 'chapter-banner';
      banner.innerHTML =
        '<h2>' + ch.code + ': ' + ch.title + '</h2>' +
        '<p class="muted-note"><strong>الفكرة العامة:</strong> ' + ch.generalIdea + '</p>';
      sec.appendChild(banner);

      const grid = document.createElement('div');
      grid.className = 'lesson-cards-grid';

      ch.lessons.forEach(function (ls) {
        const rec = progress[ls.id];
        const statusClass = rec ? 'status-pill done' : 'status-pill';
        const statusLabel = rec ? ('أفضل درجة: ' + rec.score + '/' + rec.total + ' (' + rec.pct + '%)') : 'لم يُختبر بعد';

        const card = document.createElement('article');
        card.className = 'lesson-card';
        card.innerHTML =
          '<div>' +
          '<div class="lesson-card-top">' +
          '<span class="lesson-code">' + ls.code + '</span>' +
          '<span class="' + statusClass + '">' + statusLabel + '</span>' +
          '</div>' +
          '<h3>' + ls.title + '</h3>' +
          '<p>' + ls.mainIdea + '</p>' +
          '</div>' +
          '<div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem;">' +
          '<span class="page-ref">' + ls.pages + '</span>' +
          '<a class="btn btn-primary btn-sm" href="lessons/' + ls.id + '.html">افتح الدرس التفاعلي</a>' +
          '</div>';
        grid.appendChild(card);
      });

      sec.appendChild(grid);
      bookRoot.appendChild(sec);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderHome();
    renderBookPage();
  });
})();
