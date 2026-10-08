// Lightweight procedural data diagrams. No WebGL or animation dependencies.
export function initDataScenes() {
  const cleanups: (() => void)[] = [];
  for (const canvas of document.querySelectorAll<HTMLCanvasElement>("canvas[data-scene]")) {
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let w = 0,
      h = 0,
      frame = 0,
      visible = false,
      last = 0,
      time = 0;
    const sphere = canvas.dataset.scene === "sphere";
    const dot = (x: number, y: number, r: number, color: string | CanvasGradient) => {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };
    function draw(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      if (sphere) {
        const r = Math.min(w * 0.53, h * 0.69),
          cx = w * 0.5,
          cy = h * 1.055;
        const glow = ctx.createRadialGradient(cx, cy, r * 0.8, cx, cy, r * 1.3);
        glow.addColorStop(0, "#718ab31c");
        glow.addColorStop(1, "#11121400");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);
        const shade = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.5, 0, cx, cy, r);
        shade.addColorStop(0, "#10151d");
        shade.addColorStop(0.65, "#080c12");
        shade.addColorStop(1, "#030508");
        dot(cx, cy, r, shade);
        // Spectral atmosphere: warm amber at left, pale green overhead, cool blue at right.
        const atmosphere = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
        atmosphere.addColorStop(0, "#c77a55");
        atmosphere.addColorStop(0.27, "#c4b763");
        atmosphere.addColorStop(0.5, "#b3cbb8");
        atmosphere.addColorStop(0.73, "#739dbf");
        atmosphere.addColorStop(1, "#7269b6");
        ctx.save();
        ctx.strokeStyle = atmosphere;
        for (const [width, alpha] of [
          [36, 0.018],
          [24, 0.025],
          [15, 0.045],
          [8, 0.075],
          [3, 0.22],
          [1, 0.8]
        ]) {
          ctx.beginPath();
          ctx.arc(cx, cy, r + width * 0.16, Math.PI, Math.PI * 2);
          ctx.lineWidth = width;
          ctx.globalAlpha = alpha;
          ctx.stroke();
        }
        ctx.restore();
        // Curved, accelerating trajectories arrive along the surface normal.
        // The last part of each cycle is a collected point, not a falling streak.
        for (let i = 0; i < 80; i++) {
          const spread = Math.sin(i * 13.71),
            angle = spread * 1.24;
          const nx = Math.sin(angle),
            ny = -Math.cos(angle);
          const hitX = cx + r * nx,
            hitY = cy + r * ny;
          const startX = cx + spread * w * 0.62,
            startY = -40 - (i % 7) * 12;
          const pull = Math.max(65, (hitY - startY) * 0.38);
          const controlX = hitX + nx * pull,
            controlY = hitY + ny * pull;
          const phase = (i * 0.618 + t * (0.085 + (i % 5) * 0.007)) % 1;
          const point = (q: number) => {
            const u = 1 - q;
            return {
              x: u * u * startX + 2 * u * q * controlX + q * q * hitX,
              y: u * u * startY + 2 * u * q * controlY + q * q * hitY
            };
          };
          if (phase < 0.79) {
            const progress = phase / 0.79,
              q = Math.pow(progress, 1.65);
            const head = point(q),
              tail = point(Math.max(0, q - (0.025 + progress * 0.04)));
            const beam = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
            beam.addColorStop(0, "#9db4d200");
            beam.addColorStop(1, "#b1c8e0aa");
            ctx.strokeStyle = beam;
            ctx.lineWidth = i % 6 === 0 ? 1.2 : 0.7;
            ctx.beginPath();
            ctx.moveTo(tail.x, tail.y);
            for (let k = 1; k <= 6; k++) {
              const p = point(
                Math.max(0, q - (0.025 + progress * 0.04)) + ((q - Math.max(0, q - (0.025 + progress * 0.04))) * k) / 6
              );
              ctx.lineTo(p.x, p.y);
            }
            ctx.stroke();
            dot(head.x, head.y, progress > 0.7 ? 1.5 : 1, "#b9cfe0");
            if (i % 9 === 0) {
              ctx.fillStyle = "#a4b6ca80";
              ctx.font = "9px monospace";
              ctx.fillText(["01", "CO₂", "BOM", "SKU", "MAT"][i % 5], head.x + 6, head.y - 6);
            }
          } else {
            const age = (phase - 0.79) / 0.21,
              fade = 1 - age;
            const halo = ctx.createRadialGradient(hitX, hitY, 0, hitX, hitY, 16);
            halo.addColorStop(0, `rgba(182,211,236,${fade * 0.45})`);
            halo.addColorStop(1, "#b6d3ec00");
            dot(hitX, hitY, 16, halo);
            // Settle just inside the atmospheric rim as the model absorbs the point.
            dot(hitX - nx * age * 5, hitY - ny * age * 5, 1.2 + fade, `rgba(209,229,250,${fade})`);
            ctx.save();
            ctx.translate(hitX, hitY);
            ctx.rotate(angle);
            ctx.strokeStyle = `rgba(180,210,239,${fade * 0.45})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.ellipse(0, 0, 3 + age * 15, 1 + age * 4, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }
        }
      } else {
        const lx = w * 0.43,
          cy = h * 0.47,
          ry = Math.min(h * 0.42, w * 0.4),
          rx = w * 0.075,
          focus = w * 0.85,
          start = w * 0.015;
        // A convex lens gathers parallel information streams into a single focus.
        for (let i = 0; i < 9; i++) {
          const y = cy + (i - 4) * ry * 0.2;
          ctx.beginPath();
          ctx.moveTo(start, y);
          ctx.lineTo(lx, y);
          ctx.lineTo(focus, cy);
          ctx.strokeStyle = `rgba(151,180,213,${i === 4 ? 0.5 : 0.24})`;
          ctx.lineWidth = i === 4 ? 1.2 : 0.8;
          ctx.stroke();
          for (let j = 0; j < 2; j++) {
            const q = (t * 0.17 + i * 0.113 + j * 0.5) % 1;
            const x = start + (focus - start) * q;
            const py = x < lx ? y : y + ((cy - y) * (x - lx)) / (focus - lx);
            dot(x, py, 1.5, "#c5ddf2");
          }
        }
        const glass = ctx.createLinearGradient(lx - rx, 0, lx + rx, 0);
        glass.addColorStop(0, "#a5cde92b");
        glass.addColorStop(0.4, "#a5cde909");
        glass.addColorStop(0.8, "#b4d6ed32");
        glass.addColorStop(1, "#d7edff55");
        ctx.beginPath();
        ctx.moveTo(lx, cy - ry);
        ctx.bezierCurveTo(lx + rx * 1.8, cy - ry * 0.5, lx + rx * 1.8, cy + ry * 0.5, lx, cy + ry);
        ctx.bezierCurveTo(lx - rx * 1.8, cy + ry * 0.5, lx - rx * 1.8, cy - ry * 0.5, lx, cy - ry);
        ctx.fillStyle = glass;
        ctx.fill();
        ctx.strokeStyle = "#b9d9f38c";
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(lx, cy, rx * 0.5, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "#b7d5f02b";
        ctx.lineWidth = 0.65;
        ctx.stroke();
        const orbR = Math.max(13, w * 0.035);
        const glow = ctx.createRadialGradient(focus, cy, orbR * 0.8, focus, cy, orbR * 2.1);
        glow.addColorStop(0, "#aec9db44");
        glow.addColorStop(1, "#9ec5ec00");
        dot(focus, cy, orbR * 2.1, glow);
        const orb = ctx.createRadialGradient(focus - orbR * 0.35, cy - orbR * 0.4, 0, focus, cy, orbR);
        orb.addColorStop(0, "#243442");
        orb.addColorStop(0.6, "#0b121b");
        orb.addColorStop(1, "#030609");
        dot(focus, cy, orbR, orb);
        const rim = ctx.createLinearGradient(focus - orbR, cy, focus + orbR, cy);
        rim.addColorStop(0, "#c59865");
        rim.addColorStop(0.45, "#bfccb2");
        rim.addColorStop(0.75, "#8cb8cf");
        rim.addColorStop(1, "#8981ba");
        ctx.beginPath();
        ctx.arc(focus, cy, orbR, 0, Math.PI * 2);
        ctx.strokeStyle = rim;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.font = "11px Inter, sans-serif";
        ctx.fillStyle = "#949daa";
        ctx.textAlign = "center";
        ctx.fillText("Product data", start + 40, cy + ry + 20);
        ctx.fillText("Input interface", lx, cy + ry + 20);
        ctx.fillStyle = "#d9e2ef";
        ctx.font = "12px Inter, sans-serif";
        ctx.fillText("Dynamic", focus, cy + 40);
        ctx.fillText("Product Model", focus, cy + 57);
      }
    }
    function tick(now: number) {
      frame = 0;
      if (!visible || document.hidden || reduced.matches) return;
      // Hold still under the full-screen passport, but keep ticking so it resumes when it closes.
      if (document.documentElement.dataset.overlayOpen) {
        frame = requestAnimationFrame(tick);
        return;
      }
      if (now - last >= 32) {
        time += Math.min((now - last) / 1000, 0.05);
        last = now;
        draw(time);
      }
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(frame);
      frame = 0;
      draw(time);
      if (visible && !document.hidden && !reduced.matches) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    }
    const resize = new ResizeObserver(() => {
      const box = canvas.getBoundingClientRect();
      w = box.width;
      h = box.height;
      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(time);
    });
    resize.observe(canvas);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(canvas);
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    cleanups.push(() => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      reduced.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    });
  }
  return () => cleanups.forEach((cleanup) => cleanup());
}
