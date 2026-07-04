/* ============================================================
   RADIO ZOOM ONLINE — SCRIPT
   ============================================================ */

const audio           = document.getElementById('radioAudio');
const playBtn         = document.getElementById('playBtn');
const playIcon        = document.getElementById('playIcon');
const muteBtn         = document.getElementById('muteBtn');
const muteIcon        = document.getElementById('muteIcon');
const volumeSlider    = document.getElementById('volumeSlider');
const playerStatus    = document.getElementById('playerStatus');
const playerCard      = document.querySelector('.player-card');
const floatingPlayBtn = document.getElementById('floatingPlayBtn');
const floatingIcon    = document.getElementById('floatingIcon');
const header          = document.getElementById('header');
const menuToggle      = document.getElementById('menuToggle');
const mainNav         = document.getElementById('mainNav');
const backToTop       = document.getElementById('backToTop');
const yearEl          = document.getElementById('year');

yearEl.textContent = new Date().getFullYear();

let isPlaying = false;
let isMuted   = false;

/* ── Play / Pause ───────────────────────────────────────── */
function togglePlay() {
  isPlaying ? pauseRadio() : playRadio();
}

function playRadio() {
  audio.src = 'https://stream.zeno.fm/dagq48scgv8uv';
  setStatus('Conectando...', false);
   // Media Session (iPhone / Android)
if ('mediaSession' in navigator) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: 'Radio Zoom Online',
    artist: 'En Vivo',
    album: 'Villa Carlos Paz, Córdoba, Argentina',
    artwork: [
      {
        src: 'https://radiozoomonline.github.io/logo_radio_zoom_..png',
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: 'https://radiozoomonline.github.io/logo_radio_zoom_..png',
        sizes: '1024x1024',
        type: 'image/png'
      }
    ]
  });

  navigator.mediaSession.setActionHandler('play', playRadio);
  navigator.mediaSession.setActionHandler('pause', pauseRadio);
} /*  ====================== */
  audio.play()
    .then(() => setPlayingState(true))
    .catch(() => setStatus('Error al conectar', false));
}

function pauseRadio() {
  audio.pause();
  audio.src = '';
  setPlayingState(false);
}

function setPlayingState(playing) {
  isPlaying = playing;
  if (playing) {
    playIcon.className     = 'fas fa-pause';
    floatingIcon.className = 'fas fa-pause';
    playerCard.classList.add('playing');
    setStatus('En Vivo', true);
  } else {
    playIcon.className     = 'fas fa-play';
    floatingIcon.className = 'fas fa-headphones';
    playerCard.classList.remove('playing');
    setStatus('Detenido', false);
  }
}

function setStatus(text, live) {
  playerStatus.innerHTML = `<i class="fas fa-circle"></i> ${text}`;
  playerStatus.classList.toggle('live', live);
}

audio.addEventListener('playing', () => setPlayingState(true));
audio.addEventListener('waiting', () => { if (isPlaying) setStatus('Cargando...', false); });
audio.addEventListener('error',   () => { setPlayingState(false); setStatus('Error al conectar', false); });
audio.addEventListener('stalled', () => { if (isPlaying) setStatus('Reconectando...', false); });

playBtn.addEventListener('click', togglePlay);
floatingPlayBtn.addEventListener('click', togglePlay);

/* ── Volume ─────────────────────────────────────────────── */
volumeSlider.addEventListener('input', () => {
  audio.volume = parseFloat(volumeSlider.value);
  isMuted = audio.volume === 0;
  updateMuteIcon();
  updateSliderFill();
});

muteBtn.addEventListener('click', () => {
  isMuted = !isMuted;
  audio.muted = isMuted;
  updateMuteIcon();
});

function updateMuteIcon() {
  if (isMuted || audio.volume === 0) muteIcon.className = 'fas fa-volume-xmark';
  else if (audio.volume < 0.5)       muteIcon.className = 'fas fa-volume-low';
  else                               muteIcon.className = 'fas fa-volume-high';
}

function updateSliderFill() {
  const pct = (volumeSlider.value - volumeSlider.min) / (volumeSlider.max - volumeSlider.min) * 100;
  volumeSlider.style.background =
    `linear-gradient(to right, var(--clr-accent) ${pct}%, rgba(255,255,255,0.12) ${pct}%)`;
}
updateSliderFill();

/* ── Header scroll ──────────────────────────────────────── */
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ── Mobile Nav ─────────────────────────────────────────── */
menuToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

mainNav.querySelectorAll('.header__nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── Smooth scroll ──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - header.offsetHeight, behavior: 'smooth' });
  });
});

/* ── Back to top ────────────────────────────────────────── */
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── Scroll Reveal ──────────────────────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.parentElement.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = `${i * 80}ms`;
    });
    entry.target.classList.add('visible');
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── Hero parallax ──────────────────────────────────────── */
const heroBg = document.querySelector('.hero__bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    heroBg.style.transform = `scale(1.06) translateY(${window.scrollY * 0.15}px)`;
  }, { passive: true });
}
