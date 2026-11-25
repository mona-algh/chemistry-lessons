// Renders simplified Home Page (index.html) and Book Pages (chem-2-1.html, chem-3.html)
(function () {
  function renderHome() {
    const booksContainer = document.getElementById('homeBooksGrid');
    if (!booksContainer || !window.CHEM_PORTAL) return;

    const progress = window.CHEM_PORTAL.getProgress();
    booksContainer.innerHTML = '';

    window.CHEM_PORTAL.books.forEach(function (book) {
      const panel = document.createElement('section');
      panel.className = 'book-panel';

      const header = document.createElement('div');
      header.className = 'book-panel-header';
      header.innerHTML =
        '<div><h2>' + book.title + '</h2><span class="muted-note">' + book.subtitle + '</span></div>' +
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
          const rec = progress[ls.id];
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.className = 'lesson-item-link';
          a.href = 'lessons/' + ls.id + '.html';

          const rightTag = rec
            ? '<span class="status-pill done">' + rec.pct + '%</span>'
            : '<span class="chapter-meta">' + ls.pages + '</span>';

          a.innerHTML =
            '<span class="lesson-item-main">' +
            '<span class="lesson-code">' + ls.code + '</span>' +
            '<span class="lesson-title-text">' + ls.title + '</span>' +
            '</span>' +
            rightTag;

          li.appendChild(a);
          ul.appendChild(li);
        });

        chBlock.appendChild(ul);
        panel.appendChild(chBlock);
      });

      booksContainer.appendChild(panel);
    });
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
        const statusHtml = rec
          ? '<span class="status-pill done">النتيجة: ' + rec.score + '/' + rec.total + ' (' + rec.pct + '%)</span>'
          : '<span class="page-ref">' + ls.pages + '</span>';

        const card = document.createElement('article');
        card.className = 'lesson-card';
        card.innerHTML =
          '<div>' +
          '<div class="lesson-card-top">' +
          '<span class="lesson-code">' + ls.code + '</span>' +
          statusHtml +
          '</div>' +
          '<h3>' + ls.title + '</h3>' +
          '<p>' + ls.mainIdea + '</p>' +
          '</div>' +
          '<div style="display:flex; justify-content:flex-end; align-items:center;">' +
          '<a class="btn btn-primary btn-sm" href="lessons/' + ls.id + '.html">عرض شرائح الدرس</a>' +
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
