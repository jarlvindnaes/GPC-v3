export function initNodeFlow() {
  const disposers: (() => void)[] = [];
  document.querySelectorAll<HTMLElement>("[data-node-diagram]").forEach((root) => {
    const stage = root.querySelector<HTMLElement>(".node-stage")!;
    const nodes = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-node]"));
    const paths = Array.from(root.querySelectorAll<SVGPathElement>(".node-wires path"));
    const reset = root.querySelector<HTMLButtonElement>(".diagram-reset")!;
    const links = paths.map((path) => [
      nodes.findIndex((n) => n.dataset.node === path.dataset.from),
      nodes.findIndex((n) => n.dataset.node === path.dataset.to)
    ]);
    const positions = nodes.map((n) => ({ x: Number(n.dataset.x), y: Number(n.dataset.y) }));
    const origins = positions.map((p) => ({ ...p }));
    const velocities = positions.map(() => ({ x: 0, y: 0 }));
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0,
      last = 0;
    function stopSpring(index: number) {
      velocities[index] = { x: 0, y: 0 };
    }
    function settle() {
      positions.forEach((p, i) => {
        positions[i] = { ...origins[i] };
        velocities[i] = { x: 0, y: 0 };
      });
    }
    function tick(now: number) {
      frame = 0;
      const dt = Math.min((now - last) / 1000, 1 / 60);
      last = now;
      const forces = positions.map((p, i) => ({
        x: (origins[i].x - p.x) * 32 - velocities[i].x * 14,
        y: (origins[i].y - p.y) * 32 - velocities[i].y * 14
      }));
      // Links resist relative displacement, so pulling a node transfers tension to its neighbours.
      for (const [a, b] of links) {
        const dx = positions[b].x - origins[b].x - (positions[a].x - origins[a].x);
        const dy = positions[b].y - origins[b].y - (positions[a].y - origins[a].y);
        forces[a].x += dx * 65;
        forces[a].y += dy * 65;
        forces[b].x -= dx * 65;
        forces[b].y -= dy * 65;
      }
      let energy = 0;
      positions.forEach((p, i) => {
        if (drag?.index === i) {
          velocities[i] = { x: 0, y: 0 };
          return;
        }
        velocities[i].x += forces[i].x * dt;
        velocities[i].y += forces[i].y * dt;
        p.x += velocities[i].x * dt;
        p.y += velocities[i].y * dt;
        energy += Math.hypot(p.x - origins[i].x, p.y - origins[i].y) + Math.hypot(velocities[i].x, velocities[i].y);
      });
      if (!drag && (energy < 0.02 || reduced.matches)) settle();
      draw();
      if (!reduced.matches && (drag || energy >= 0.02)) frame = requestAnimationFrame(tick);
    }
    function wake() {
      if (!frame && !reduced.matches) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    }
    function returnHome(_index: number) {
      if (reduced.matches) {
        settle();
        draw();
      } else wake();
    }
    let drag: { index: number; id: number; offsetX: number; offsetY: number } | null = null;
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
    function draw() {
      const rect = stage.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      nodes.forEach((node, i) => {
        const mx = (node.offsetWidth / 2 / rect.width) * 100 + 1,
          my = (node.offsetHeight / 2 / rect.height) * 100 + 1;
        positions[i].x = clamp(positions[i].x, mx, 100 - mx);
        positions[i].y = clamp(positions[i].y, my, 100 - my);
        node.style.left = `${positions[i].x}%`;
        node.style.top = `${positions[i].y}%`;
      });
      links.forEach(([a, b], i) => {
        const aa = nodes[a].getBoundingClientRect(),
          bb = nodes[b].getBoundingClientRect();
        const forward = bb.x >= aa.x;
        const x1 = (forward ? aa.right : aa.left) - rect.left,
          y1 = aa.top + aa.height / 2 - rect.top,
          x2 = (forward ? bb.left : bb.right) - rect.left,
          y2 = bb.top + bb.height / 2 - rect.top;
        const bend = Math.max(30, Math.abs(x2 - x1) * 0.48) * (forward ? 1 : -1);
        paths[i].setAttribute("d", `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`);
      });
    }
    nodes.forEach((node, index) => {
      const down = (e: PointerEvent) => {
        if (e.button !== 0 || drag) return;
        stopSpring(index);
        const r = node.getBoundingClientRect();
        drag = {
          index,
          id: e.pointerId,
          offsetX: e.clientX - r.left - r.width / 2,
          offsetY: e.clientY - r.top - r.height / 2
        };
        node.setPointerCapture(e.pointerId);
        node.classList.add("is-dragging");
        node.focus({ preventScroll: true });
        wake();
      };
      const move = (e: PointerEvent) => {
        if (!drag || drag.index !== index || drag.id !== e.pointerId) return;
        const r = stage.getBoundingClientRect();
        positions[index] = {
          x: ((e.clientX - r.left - drag.offsetX) / r.width) * 100,
          y: ((e.clientY - r.top - drag.offsetY) / r.height) * 100
        };
        draw();
      };
      const up = () => {
        if (drag?.index !== index) return;
        drag = null;
        node.classList.remove("is-dragging");
        returnHome(index);
      };
      const key = (e: KeyboardEvent) => {
        const steps: Record<string, [number, number]> = {
          ArrowLeft: [-1, 0],
          ArrowRight: [1, 0],
          ArrowUp: [0, -1],
          ArrowDown: [0, 1]
        };
        if (!steps[e.key]) return;
        e.preventDefault();
        stopSpring(index);
        const [x, y] = steps[e.key];
        positions[index].x += x * (e.shiftKey ? 5 : 1.5);
        positions[index].y += y * (e.shiftKey ? 5 : 1.5);
        draw();
        returnHome(index);
      };
      node.addEventListener("pointerdown", down);
      node.addEventListener("pointermove", move);
      node.addEventListener("pointerup", up);
      node.addEventListener("pointercancel", up);
      node.addEventListener("lostpointercapture", up);
      node.addEventListener("keydown", key);
      disposers.push(() => {
        node.removeEventListener("pointerdown", down);
        node.removeEventListener("pointermove", move);
        node.removeEventListener("pointerup", up);
        node.removeEventListener("pointercancel", up);
        node.removeEventListener("lostpointercapture", up);
        node.removeEventListener("keydown", key);
      });
    });
    const onReset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      settle();
      draw();
    };
    reset.addEventListener("click", onReset);
    const observer = new ResizeObserver(draw);
    observer.observe(stage);
    draw();
    disposers.push(() => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      reset.removeEventListener("click", onReset);
    });
  });
  return () => disposers.forEach((dispose) => dispose());
}
