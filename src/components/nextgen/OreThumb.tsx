import { useEffect, useRef } from "react";
import * as Three from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Small turning 3D model for a label in the chair story: the ore in "Material information" (same model
// as the raw-material step on our original How it works page) and the open cardboard box in
// "Packaging information". Renders only while `active` (label shown).
const DRACO_DECODER_PATH =
  "https://www.gstatic.com/draco/versioned/decoders/1.5.6/";

export function OreThumb({
  base,
  active,
  model = "models/emerald_in_quartz__for_games.glb",
}: {
  base: string;
  active: boolean;
  model?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }
    let renderer: Three.WebGLRenderer;
    try {
      renderer = new Three.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    const size = host.clientWidth || 56;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(size, size);
    renderer.outputColorSpace = Three.SRGBColorSpace;
    renderer.toneMapping = Three.ACESFilmicToneMapping;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    host.appendChild(renderer.domElement);

    const scene = new Three.Scene();
    scene.add(new Three.AmbientLight(0xffffff, 0.9));
    const key = new Three.DirectionalLight(0xfff8f0, 2.2);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new Three.DirectionalLight(0xc7d2fe, 0.8);
    rim.position.set(-4, 2, -3);
    scene.add(rim);
    const camera = new Three.PerspectiveCamera(30, 1, 0.01, 100);
    const pivot = new Three.Group();
    scene.add(pivot);

    const draco = new DRACOLoader().setDecoderPath(DRACO_DECODER_PATH);
    const loader = new GLTFLoader().setDRACOLoader(draco);
    let disposed = false;
    loader.load(`${base}${model}`, (gltf) => {
      if (disposed) {
        return;
      }
      const model = gltf.scene;
      const sphere = new Three.Box3()
        .setFromObject(model)
        .getBoundingSphere(new Three.Sphere());
      model.position.sub(sphere.center);
      pivot.add(model);
      pivot.rotation.x = 0.25;
      camera.position.set(
        0,
        0,
        (sphere.radius * 1.05) /
          Math.sin(Three.MathUtils.degToRad(camera.fov / 2)),
      );
      camera.lookAt(0, 0, 0);
    });

    // Follow the label's size (it is larger on desktop than on phones).
    const resize = new ResizeObserver(() => {
      const next = host.clientWidth;
      if (next) {
        renderer.setSize(next, next);
      }
    });
    resize.observe(host);

    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!activeRef.current || document.hidden) {
        return;
      }
      pivot.rotation.y += dt * 0.6;
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      draco.dispose();
      scene.traverse((object) => {
        const mesh = object as Three.Mesh;
        if (!mesh.isMesh) {
          return;
        }
        mesh.geometry.dispose();
        for (const material of Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material]) {
          (material as Three.MeshStandardMaterial).map?.dispose();
          material.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [base, model]);

  return <div className="ore-thumb" ref={hostRef} aria-hidden="true" />;
}
