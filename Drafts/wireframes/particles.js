// Connected-particle background for the dark "How it works" section.
// Vanilla-canvas port of the product-connect-website <Particles> component:
// dots drift and bounce off the edges, link to nearby dots, and repel + grow + brighten near the mouse.
// Recoloured from the original dark-navy dots to a light indigo so it reads on the dark section,
// and dimmed so it stays a background illustration behind the copy.
(() => {
  const host = document.getElementById("how-particles");
  if (!host) return;

  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none";
  host.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  const DOT = { r: 120, g: 150, b: 245 };   // light indigo — visible on the dark base (#11152a)
  const BRIGHT = 235;                        // colour to brighten toward near the mouse
  const SPEED = 0.08;                        // drift speed (matches the original)
  const DENSITY = 11000;                     // larger = fewer particles
  const MAX_DOTS = 170;
  const INTERACT = 90;                       // repel radius in px

  let W = 0, H = 0, particles = [], raf = 0, near = true;
  const mouse = { x: null, y: null, radius: 0 };

  function init() {
    particles = [];
    const count = Math.min(MAX_DOTS, Math.round((W * H) / DENSITY) * 2);
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 2.4 + 0.8;
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        dx: Math.random() * 5 - 2.5, dy: Math.random() * 5 - 2.5,
        size, base: size, color: `rgb(${DOT.r},${DOT.g},${DOT.b})`
      });
    }
  }

  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    canvas.width = w * DPR; canvas.height = h * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    W = w; H = h;
    mouse.radius = (H / 100) * (W / 100);
    init();
  }

  function connect() {
    const threshold = (W / 7) * (H / 7);
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const pa = particles[a], pb = particles[b];
        const d2 = (pa.x - pb.x) ** 2 + (pa.y - pb.y) ** 2;
        if (d2 < threshold) {
          const op = (1 - d2 / 20000) * 0.32;  // dimmed for a quiet background feel
          if (op <= 0) continue;
          ctx.strokeStyle = `rgba(${DOT.r},${DOT.g},${DOT.b},${op})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
        }
      }
    }
  }

  function draw() {
    raf = requestAnimationFrame(draw);
    if (!near || !W) return;
    ctx.clearRect(0, 0, W, H);
    connect();
    for (const p of particles) {
      if (p.x > W || p.x < 0) p.dx = -p.dx;
      if (p.y > H || p.y < 0) p.dy = -p.dy;

      if (mouse.x !== null) {
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < INTERACT) {                 // push away from the cursor
          const angle = Math.atan2(dy, dx);
          const force = (INTERACT - dist) / INTERACT;
          p.x -= Math.cos(angle) * force * 3;
          p.y -= Math.sin(angle) * force * 3;
        }
        if (dist < mouse.radius) {             // grow + brighten in a wider field
          const f = 1 - dist / mouse.radius;
          p.size = p.base + f * 4;
          const r = Math.min(BRIGHT, DOT.r + f * (BRIGHT - DOT.r));
          const g = Math.min(BRIGHT, DOT.g + f * (BRIGHT - DOT.g));
          const bl = Math.min(BRIGHT, DOT.b + f * (BRIGHT - DOT.b));
          p.color = `rgb(${r | 0},${g | 0},${bl | 0})`;
        } else { p.size = p.base; p.color = `rgb(${DOT.r},${DOT.g},${DOT.b})`; }
      }

      p.x += p.dx * SPEED; p.y += p.dy * SPEED;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.fill();
    }
  }

  window.addEventListener("mousemove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  window.addEventListener("mouseout", () => { mouse.x = null; mouse.y = null; });

  new ResizeObserver(resize).observe(host);
  new IntersectionObserver((es) => { for (const e of es) near = e.isIntersecting; }, { rootMargin: "200px" }).observe(host);

  resize();
  draw();
})();
