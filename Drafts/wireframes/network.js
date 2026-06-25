// Animated SKU network for the Enterprise hero.
// Vanilla-canvas port of the live site's HeroNetwork (src/components/Hero.tsx):
// nodes drift, connect to nearby nodes, and repel + brighten near the mouse.
// Restyled to match the static constellation: indigo hubs (with a soft halo), slate dots, a few emerald, indigo links.
(() => {
  const container = document.getElementById("sku-network");
  if (!container) return;

  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none";
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  const INDIGO = "#3e63dd";
  const SLATE = "#93a0c4";
  const EMERALD = "#00b27e";
  const LABEL = "#5d6373";
  const HUB_LABELS = ["SKU 0215", "SKU 4471", "shared part", "SKU 1180", "SKU 3092", "SKU 7740", "SKU 0884"];
  const CONNECT = 200;
  const CONNECT2 = CONNECT * CONNECT;

  let W = 0, H = 0, nodes = [], time = 0, raf = 0, near = true;
  const mouse = { x: 0, y: 0, active: false };

  function initNodes() {
    if (!W || !H) return;
    nodes = [];
    // fixed composition: 5 indigo hubs (with halo + caption), 19 slate dots, 2 emerald
    const kinds = [];
    for (let i = 0; i < 7; i++) kinds.push("hub");
    for (let i = 0; i < 4; i++) kinds.push("verified");
    for (let i = 0; i < 25; i++) kinds.push("node");
    let hub = 0;
    for (const kind of kinds) {
      const depth = 0.35 + Math.random() * 0.65;
      const base = kind === "hub" ? 5.5 + Math.random() * 2
                 : kind === "verified" ? 3.5 + Math.random() * 1.5
                 : 1.8 + Math.random() * 2.4;
      const label = kind === "hub" ? HUB_LABELS[hub++ % HUB_LABELS.length] : "";
      nodes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3 * depth, vy: (Math.random() - 0.5) * 0.2 * depth,
        radius: base * (0.7 + depth * 0.3), baseRadius: base * (0.7 + depth * 0.3),
        depth, phase: Math.random() * Math.PI * 2, brighten: 0, kind,
        label, labelHalf: label ? label.length * 3.4 : 0   // approx half text width at 11px
      });
    }
  }

  function resize() {
    const newW = container.clientWidth, newH = container.clientHeight;
    if (!newW || !newH) return;
    canvas.width = newW * DPR; canvas.height = newH * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (nodes.length && W && H) {                 // rescale existing nodes to the new box so they keep filling it
      const sx = newW / W, sy = newH / H;
      for (const n of nodes) { n.x *= sx; n.y *= sy; }
    }
    W = newW; H = newH;
    if (!nodes.length) initNodes();
  }

  function draw() {
    raf = requestAnimationFrame(draw);
    if (!near || !W) return;
    time += 0.008;
    ctx.clearRect(0, 0, W, H);

    const pushR = 110, growR = 280, lerp = 0.08;
    for (const n of nodes) {
      n.x += n.vx + Math.sin(time * 0.5 + n.phase) * 0.15 * n.depth;
      n.y += n.vy + Math.cos(time * 0.4 + n.phase + 1) * 0.1 * n.depth;
      let tBright = 0, tRad = n.baseRadius;
      if (mouse.active) {
        const dx = mouse.x - n.x, dy = mouse.y - n.y, d = Math.hypot(dx, dy);
        if (d < pushR && d > 0.1) { const p = (1 - d / pushR) * 0.5 * n.depth; n.x -= (dx / d) * p; n.y -= (dy / d) * p; }
        if (d < growR) { const prox = 1 - d / growR; tRad = n.baseRadius + prox * 4 * n.depth; tBright = prox; }
      }
      n.radius += (tRad - n.radius) * lerp;
      n.brighten += (tBright - n.brighten) * lerp;
      // Clamp the FULL footprint inside the canvas (dot + hub halo + caption below) so nothing clips at the edges.
      const halo = n.kind === "hub" ? n.radius * 2.6 : n.radius;
      const mX = Math.max(halo, n.labelHalf);
      const mBottom = Math.max(halo, n.label ? n.radius + 24 : 0);
      if (n.x < mX) { n.x = mX; n.vx = Math.abs(n.vx); }
      else if (n.x > W - mX) { n.x = W - mX; n.vx = -Math.abs(n.vx); }
      if (n.y < halo) { n.y = halo; n.vy = Math.abs(n.vy); }
      else if (n.y > H - mBottom) { n.y = H - mBottom; n.vy = -Math.abs(n.vy); }
    }

    // proximity links
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 < CONNECT2) {
          const ratio = d2 / CONNECT2;
          const boost = Math.min(a.brighten, b.brighten) * 0.4;
          ctx.strokeStyle = INDIGO;
          ctx.globalAlpha = Math.min(1, (1 - ratio) * (0.32 + boost) * Math.min(a.depth, b.depth));
          ctx.lineWidth = (1 - ratio) * (1 + boost * 2);
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    // nodes
    for (const n of nodes) {
      if (n.kind === "hub") {
        ctx.fillStyle = INDIGO; ctx.globalAlpha = 0.08 + n.brighten * 0.06;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.radius * 2.6, 0, Math.PI * 2); ctx.fill();
      }
      const color = n.kind === "hub" ? INDIGO : n.kind === "verified" ? EMERALD : SLATE;
      const baseAlpha = (n.kind === "node" ? 0.5 : 0.85) + n.depth * 0.15;
      ctx.fillStyle = color; ctx.globalAlpha = Math.min(1, baseAlpha + n.brighten * 0.3);
      ctx.beginPath(); ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2); ctx.fill();
      if (n.label) {
        ctx.fillStyle = LABEL; ctx.globalAlpha = 0.6;
        ctx.font = "11px system-ui, -apple-system, sans-serif"; ctx.textAlign = "center";
        ctx.fillText(n.label, n.x, n.y + n.radius + 14);
      }
    }
    ctx.globalAlpha = 1;
  }

  // react to the mouse anywhere over the hero
  const hero = container.closest(".hero") || container;
  hero.addEventListener("mousemove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
  });
  hero.addEventListener("mouseleave", () => { mouse.active = false; });

  new ResizeObserver(resize).observe(container);
  new IntersectionObserver((es) => { for (const e of es) near = e.isIntersecting; }, { rootMargin: "200px" }).observe(container);

  resize();
  draw();
})();
