// Book flip controller
(function () {
  const book = document.getElementById('book');
  const leaves = Array.from(book.querySelectorAll('.leaf'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const indicator = document.getElementById('pageIndicator');
  const totalLeaves = leaves.length;

  // Current position: how many leaves have been flipped
  let currentFlipped = 0;

  // Stack leaves so the first is on top (highest z-index)
  function updateZIndex() {
    leaves.forEach((leaf, i) => {
      if (i < currentFlipped) {
        // Flipped leaves: earlier flipped = lower z
        leaf.style.zIndex = i;
      } else {
        // Unflipped leaves: first unflipped = highest z
        leaf.style.zIndex = totalLeaves - i;
      }
    });
  }

  function updateUI() {
    prevBtn.disabled = currentFlipped === 0;
    nextBtn.disabled = currentFlipped === totalLeaves;

    if (currentFlipped === 0) {
      indicator.textContent = 'Cover';
    } else if (currentFlipped === totalLeaves) {
      indicator.textContent = 'Back Cover';
    } else {
      indicator.textContent = `Page ${currentFlipped * 2 - 1}–${currentFlipped * 2}`;
    }
  }

  function flipNext() {
    if (currentFlipped >= totalLeaves) return;
    const leaf = leaves[currentFlipped];

    // Temporarily raise z-index during flip
    leaf.style.zIndex = totalLeaves + 1;

    leaf.classList.add('flipped');
    currentFlipped++;
    updateUI();

    // After transition, normalize z-index
    setTimeout(() => updateZIndex(), 950);
  }

  function flipPrev() {
    if (currentFlipped <= 0) return;
    currentFlipped--;
    const leaf = leaves[currentFlipped];

    // Raise z-index during flip back
    leaf.style.zIndex = totalLeaves + 1;

    leaf.classList.remove('flipped');
    updateUI();

    setTimeout(() => updateZIndex(), 950);
  }

  // Button clicks
  nextBtn.addEventListener('click', flipNext);
  prevBtn.addEventListener('click', flipPrev);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      flipNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      flipPrev();
    }
  });

  // Click on book: left half = prev, right half = next
  book.addEventListener('click', (e) => {
    const rect = book.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width * 0.5) {
      flipPrev();
    } else {
      flipNext();
    }
  });

  // Touch swipe support
  let touchStartX = 0;
  book.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  book.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      if (dx < 0) flipNext();
      else flipPrev();
    }
  }, { passive: true });

  // Init
  updateZIndex();
  updateUI();
})();
