// ============================================
// Quick-View Lightbox with Slideshow
// ============================================

(function () {
  const qv       = document.getElementById('quickView');
  const qvBg     = document.getElementById('quickViewBg');
  const qvImg    = document.getElementById('quickViewImg');
  const qvCap    = document.getElementById('qvCaption');
  const btnPrev  = document.getElementById('qvPrev');
  const btnNext  = document.getElementById('qvNext');

  // Collect all zoomable images in DOM order
  const allImages = Array.from(document.querySelectorAll('img.zoomable'));
  let currentIdx  = 0;

  // ---- Open lightbox ----
  function open(idx) {
    currentIdx = idx;
    show(idx);
    qv.classList.remove('closing');
    qv.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // ---- Show specific image ----
  function show(idx) {
    const img = allImages[idx];
    // Use a larger version for the lightbox
    const src = img.src.replace(/\/w\/\d+\//, '/w/2000/');
    qvImg.src = src;
    qvCap.textContent = img.dataset.caption || '';

    btnPrev.style.visibility = idx > 0 ? 'visible' : 'hidden';
    btnNext.style.visibility = idx < allImages.length - 1 ? 'visible' : 'hidden';
  }

  // ---- Close lightbox ----
  function close() {
    qv.classList.add('closing');
    setTimeout(() => {
      qv.classList.remove('open', 'closing');
      document.body.style.overflow = '';
      qvImg.src = '';
    }, 250);
  }

  // ---- Navigate ----
  function next() {
    if (currentIdx < allImages.length - 1) {
      currentIdx++;
      show(currentIdx);
    }
  }

  function prev() {
    if (currentIdx > 0) {
      currentIdx--;
      show(currentIdx);
    }
  }

  // ---- Event: click on zoomable image ----
  allImages.forEach((img, i) => {
    img.addEventListener('click', () => open(i));
  });

  // ---- Event: click background to close ----
  qvBg.addEventListener('click', close);

  // ---- Event: nav buttons ----
  btnPrev.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
  btnNext.addEventListener('click', (e) => { e.stopPropagation(); next(); });

  // ---- Event: keyboard ----
  document.addEventListener('keydown', (e) => {
    if (!qv.classList.contains('open')) return;

    if (e.key === 'Escape') {
      close();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    }
  });

  // ---- Event: touch swipe ----
  let touchStartX = 0;
  let touchStartY = 0;

  qv.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  qv.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    // Only trigger if horizontal swipe is dominant
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next();
      else prev();
    }
  }, { passive: true });

})();

// ============================================
// Smooth scroll for anchor links
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
