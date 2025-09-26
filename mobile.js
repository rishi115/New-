let highestZ = 1;

class Paper {
  holdingPaper = false;
  rotating = false;
  touchStartX = 0;
  touchStartY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  currentPaperX = 0;
  currentPaperY = 0;
  rotation = Math.random() * 30 - 15;
  initialAngle = 0;

  init(paper) {
    // For mobile touch
    paper.addEventListener('touchstart', (e) => {
      e.preventDefault(); // Prevent scrolling
      if (this.holdingPaper) return;

      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;

      // Detect if two fingers are used for rotation
      if (e.touches.length === 2) {
        this.rotating = true;
        this.initialAngle = this.getRotationAngle(e.touches);
      }
    }, { passive: false });

    paper.addEventListener('touchmove', (e) => {
      e.preventDefault(); // Required for touch events on mobile

      if (this.holdingPaper) {
        if (this.rotating && e.touches.length === 2) {
          // Handle rotation with two fingers
          const angle = this.getRotationAngle(e.touches);
          this.rotation += angle - this.initialAngle;
          this.initialAngle = angle;
        } else {
          // Handle dragging with one finger
          const touchX = e.touches[0].clientX;
          const touchY = e.touches[0].clientY;

          this.currentPaperX += touchX - this.prevTouchX;
          this.currentPaperY += touchY - this.prevTouchY;

          this.prevTouchX = touchX;
          this.prevTouchY = touchY;
        }
        // Apply transformation
        paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotate(${this.rotation}deg)`;
      }
    }, { passive: false });

    paper.addEventListener('touchend', (e) => {
      if (e.touches.length === 0) {
        this.holdingPaper = false;
        this.rotating = false;
      }
    });

    // For laptop/desktop (mouse support)
    paper.addEventListener('mousedown', (e) => {
      e.preventDefault(); // Prevent default mouse events
      if (this.holdingPaper) return;

      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;
      this.touchStartX = e.clientX;
      this.touchStartY = e.clientY;
      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;
      this.rotating = false;
    });

    paper.addEventListener('mousemove', (e) => {
      if (this.holdingPaper) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Handle dragging
        this.currentPaperX += mouseX - this.prevTouchX;
        this.currentPaperY += mouseY - this.prevTouchY;

        this.prevTouchX = mouseX;
        this.prevTouchY = mouseY;

        // Apply transformation
        paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotate(${this.rotation}deg)`;
      }
    });

    paper.addEventListener('mouseup', (e) => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    paper.addEventListener('mouseleave', (e) => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }

  getRotationAngle(touches) {
    const dx = touches[1].clientX - touches[0].clientX;
    const dy = touches[1].clientY - touches[0].clientY;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  }
}

// Initialize Papers
document.querySelectorAll('.paper').forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
