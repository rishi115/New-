const container = document.querySelector('.horizontal-scroll-container');
const pages = document.querySelectorAll('.page');

function handleScroll() {
  const scrollLeft = container.scrollLeft;
  const pageWidth = window.innerWidth;
  const currentIndex = Math.round(scrollLeft / pageWidth);

  pages.forEach((page, index) => {
    const video = page.querySelector('video');
    if (video) {
      if (index === currentIndex) {
        video.muted = false;
        video.play().catch(() => {});
      } else {
        video.muted = true;
        video.pause();
      }
    }
  });

  // Special case: final love-page audio
  const isLast = currentIndex === pages.length - 1;
  const music = document.getElementById('background-music');
  const btn = document.querySelector('.play-music-btn');

  if (music) {
    if (isLast) {
      music.play().catch(() => {
        btn.style.display = 'block';
      });
    } else {
      music.pause();
      btn.style.display = 'none';
    }
  }
}

// Trigger on load and scroll
window.addEventListener('DOMContentLoaded', handleScroll);
container.addEventListener('scroll', () => {
  clearTimeout(container.scrollTimeout);
  container.scrollTimeout = setTimeout(handleScroll, 100); // debounce
});

// Play music manually (mobile)
function playMusic() {
  const music = document.getElementById('background-music');
  music.play();
  document.querySelector('.play-music-btn').style.display = 'none';
}
