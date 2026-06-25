// Interactive warping-grid background for the dark "Trust & compliance" section.
// Vanilla-canvas port of the live site's InteractiveGrid (src/components/CountdownBanner.tsx):
// a 48px grid of lines whose nodes spring away from the cursor and brighten nearby.
// Tuned to the same quiet tone as the How-it-works particles — light indigo on the dark base.
(() => {
  const host = document.getElementById("trust-grid");
  if (!host) return;

  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none";
  host.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  const LINE = "157,180,255";        // --indigo-soft (#9db4ff) — matches the particle palette
  const SPACING = 48;
  const PUSH_R = 280, GROW_R = 550, LERP = 0.1, SPRING = 0.08;
  const BASE_ALPHA = 0.08;

  let W = 0, H = 0, cols = 0, nodes = [], raf = 0, near = true;
  const mouse = { x: 0, y: 0, active: false };
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  function initGrid() {
    if (!W || !H) return;
    cols = Math.ceil(W / SPACING) + 1;
    const rows = Math.ceil(H / SPACING) + 1;
    nodes = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const bx = c * SPACING, by = r * SPACING;
        nodes.push({ bx, by, x: bx, y: by, brighten: 0 });
      }
  }

  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    canvas.width = w * DPR; canvas.height = h * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    W = w; H = h;
    initGrid();
  }

  function line(a, b) {
    const boost = Math.min(a.brighten, b.brighten) * 0.25;
    const alpha = Math.min(1, BASE_ALPHA + boost);
    ctx.strokeStyle = `rgba(${LINE},${alpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  }

  function draw() {
    raf = requestAnimationFrame(draw);
    if (!near || !W) return;
    ctx.clearRect(0, 0, W, H);

    if (!coarse) {                       // skip per-node physics on touch devices
      for (const n of nodes) {
        let tBright = 0, pushX = 0, pushY = 0;
        if (mouse.active) {
          const dx = mouse.x - n.bx, dy = mouse.y - n.by, dist = Math.hypot(dx, dy);
          if (dist < PUSH_R && dist > 0.1) { const p = (1 - dist / PUSH_R) * 14; pushX = -(dx / dist) * p; pushY = -(dy / dist) * p; }
          if (dist < GROW_R) tBright = 1 - dist / GROW_R;
        }
        n.x += (n.bx + pushX - n.x) * SPRING;
        n.y += (n.by + pushY - n.y) * SPRING;
        n.brighten += (tBright - n.brighten) * LERP;
      }
    }

    const lastRowStart = Math.floor((nodes.length - 1) / cols);
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i], col = i % cols, row = Math.floor(i / cols);
      if (col < cols - 1) line(n, nodes[i + 1]);
      if (row < lastRowStart) { const below = nodes[i + cols]; if (below) line(n, below); }
    }
  }

  const sec = host.closest("section") || host;
  sec.addEventListener("mousemove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
  });
  sec.addEventListener("mouseleave", () => { mouse.active = false; });

  new ResizeObserver(resize).observe(host);
  new IntersectionObserver((es) => { for (const e of es) near = e.isIntersecting; }, { rootMargin: "200px" }).observe(host);

  resize();
  draw();
})();
