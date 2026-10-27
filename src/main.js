const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.querySelector('.geometry');
const ctx = canvas?.getContext('2d');
let width = 0;
let height = 0;
let frame = 0;

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function drawGeometry(time = 0) {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, width, height);
  const drift = reducedMotion ? 0 : time * 0.00003;
  const points = [
    [width * .12 + Math.sin(drift) * 40, height * .2 + Math.cos(drift) * 25],
    [width * .78 + Math.cos(drift * 1.3) * 46, height * .12 + Math.sin(drift) * 32],
    [width * .88 + Math.sin(drift * .7) * 50, height * .72 + Math.cos(drift * 1.1) * 40],
    [width * .19 + Math.cos(drift * .9) * 38, height * .83 + Math.sin(drift * 1.2) * 42],
  ];
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(91, 88, 167, .18)';
  ctx.fillStyle = 'rgba(91, 88, 167, .035)';
  points.forEach(([x, y], index) => {
    const size = 90 + index * 17;
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x - size, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });
  ctx.strokeStyle = 'rgba(226, 31, 47, .16)';
  ctx.beginPath();
  ctx.arc(width * .53, height * .42, Math.min(width, height) * .32, 0, Math.PI * 2);
  ctx.stroke();
  if (!reducedMotion) frame = requestAnimationFrame(drawGeometry);
}

resizeCanvas();
drawGeometry();
window.addEventListener('resize', () => { resizeCanvas(); if (reducedMotion) drawGeometry(); });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
