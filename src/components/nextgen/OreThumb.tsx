import { useEffect, useRef } from "react";
import * as Three from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Small turning 3D model for a label in the chair story: the ore in "Material information" (same model
// as the raw-material step on our original How it works page) and the open cardboard box in
// "Packaging information". Renders only while `active` (label shown).
const DEFAULT_MODEL = "models/emerald_in_quartz__for_games.glb";

/** Fine corrugation ribs as a tangent-space normal map (rows along the texture's v direction). */
function corrugationNormalMap() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return null;
  }
  const image = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    const slope = Math.cos((y / size) * Math.PI * 2 * 16) * 0.55; // 16 ribs across the texture
    const len = Math.hypot(slope, 1);
    const ny = slope / len;
    const nz = 1 / len;
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      image.data[i] = 128;
      image.data[i + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      image.data[i + 2] = Math.round((nz * 0.5 + 0.5) * 255);
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  const texture = new Three.CanvasTexture(canvas);
  texture.wrapS = Three.RepeatWrapping;
  texture.wrapT = Three.RepeatWrapping;
  return texture;
}

const DRACO_DECODER_PATH =
  "https://www.gstatic.com/draco/versioned/decoders/1.5.6/";

export function OreThumb({
  base,
  active,
  model = DEFAULT_MODEL,
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
    // The cardboard box is a simple, flat-textured model: give it studio lighting, soft shadows (its
    // flaps shade the inside) and corrugated ribs so it sits with the scanned ore and the chair.
    // The ore keeps its original look.
    const studio = model !== DEFAULT_MODEL;
    let envMap: Three.Texture | null = null;
    let ribs: Three.Texture | null = null;
    if (studio) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = Three.PCFSoftShadowMap;
      const pmrem = new Three.PMREMGenerator(renderer);
      envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      pmrem.dispose();
      scene.environment = envMap;
      scene.environmentIntensity = 0.55;
      ribs = corrugationNormalMap();
    }
    scene.add(new Three.AmbientLight(0xffffff, studio ? 0.12 : 0.9));
    const key = new Three.DirectionalLight(0xfff8f0, studio ? 2.4 : 2.2);
    key.position.set(3, 4, 5);
    key.castShadow = studio;
    key.shadow.mapSize.set(512, 512);
    key.shadow.radius = 4;
    key.shadow.bias = -0.0005;
    scene.add(key);
    const rim = new Three.DirectionalLight(0xc7d2fe, studio ? 0.35 : 0.8);
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
      if (studio) {
        model.traverse((object) => {
          const mesh = object as Three.Mesh;
          if (!mesh.isMesh) {
            return;
          }
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          const m = mesh.material as Three.MeshStandardMaterial;
          m.roughness = 0.92;
          if (ribs) {
            m.normalMap = ribs;
            m.normalScale.set(0.35, 0.35);
          }
          m.needsUpdate = true;
        });
        // Fit the shadow camera to the model.
        const r = sphere.radius * 1.2;
        const cam = key.shadow.camera;
        cam.left = -r;
        cam.right = r;
        cam.top = r;
        cam.bottom = -r;
        cam.near = 0.01;
        cam.far = r * 20;
        key.position.set(3, 4, 5).normalize().multiplyScalar(r * 6);
        cam.updateProjectionMatrix();
      }
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
      envMap?.dispose();
      ribs?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [base, model]);

  return <div className="ore-thumb" ref={hostRef} aria-hidden="true" />;
}
