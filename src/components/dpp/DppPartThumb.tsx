import { useEffect, useRef } from "react";
import * as Three from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { CHAIR_MODEL, pieceName } from "./dppChairModel";
import { slopeChair } from "./dppProductData";

// Small turning 3D model of one purchasable part (one representative piece, e.g. one of the two
// armrests), cut from the same product model as the parts viewer. Every thumbnail on the page shares
// one offscreen WebGL renderer and copies its frame into its own 2D canvas, so a cart full of parts
// still uses a single WebGL context. Draws only while on screen, at ~30 fps; still under reduced motion.

const FRAME_MS = 1000 / 30;

interface Thumb {
  canvas: HTMLCanvasElement;
  partId: string;
  object: Three.Object3D | null;
  distance: number;
  visible: boolean;
  drawn: boolean;
}

const thumbs = new Set<Thumb>();
let shared: {
  renderer: Three.WebGLRenderer;
  scene: Three.Scene;
  camera: Three.PerspectiveCamera;
  pivot: Three.Group;
  model: Promise<Three.Object3D>;
} | null = null;
let frame = 0;
let last = 0;
let angle = 0;

function getShared() {
  if (shared) {
    return shared;
  }
  const renderer = new Three.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = Three.SRGBColorSpace;
  renderer.toneMapping = Three.ACESFilmicToneMapping;
  const scene = new Three.Scene();
  scene.environment = new Three.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
  const key = new Three.DirectionalLight(0xfff8f0, 1.4);
  key.position.set(2, 3, 4);
  scene.add(key);
  const camera = new Three.PerspectiveCamera(30, 1, 0.01, 50);
  const pivot = new Three.Group();
  pivot.rotation.x = 0.35;
  scene.add(pivot);

  const draco = new DRACOLoader().setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.5/");
  const model = new Promise<Three.Object3D>((resolve, reject) => {
    new GLTFLoader().setDRACOLoader(draco).load(CHAIR_MODEL, (gltf) => resolve(gltf.scene), undefined, reject);
  });
  shared = { renderer, scene, camera, pivot, model };
  return shared;
}

/** One piece of the part, centred on the origin. Prefers the left-hand piece of a pair. */
function cutPiece(model: Three.Object3D, partId: string) {
  const prefixes = slopeChair.materialsAndComponents.purchasableParts.find((p) => p.id === partId)?.modelPieces;
  if (!prefixes) {
    return null;
  }
  const root = model.getObjectByName("Soft_Lounge_Chair");
  const candidates = (root?.children ?? []).filter((piece) =>
    prefixes.some((prefix) => pieceName(piece).startsWith(prefix))
  );
  const source = candidates.find((piece) => pieceName(piece).includes("left")) ?? candidates[0];
  if (!source) {
    return null;
  }
  const piece = source.clone();
  const holder = new Three.Group();
  holder.add(piece);
  const sphere = new Three.Box3().setFromObject(holder).getBoundingSphere(new Three.Sphere());
  piece.position.sub(sphere.center);
  return { object: holder, radius: sphere.radius };
}

function tick(now: number) {
  frame = requestAnimationFrame(tick);
  if (document.hidden || now - last < FRAME_MS) {
    return;
  }
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!still) {
    angle += dt * 0.7;
  }
  const s = getShared();
  for (const thumb of thumbs) {
    if (!(thumb.visible && thumb.object) || (still && thumb.drawn)) {
      continue;
    }
    const { canvas } = thumb;
    const width = canvas.width;
    const height = canvas.height;
    if (!(width && height)) {
      continue;
    }
    s.renderer.setSize(width, height, false);
    s.camera.aspect = width / height;
    s.camera.position.set(0, 0, thumb.distance);
    s.camera.updateProjectionMatrix();
    s.pivot.clear();
    s.pivot.add(thumb.object);
    s.pivot.rotation.y = angle;
    s.renderer.render(s.scene, s.camera);
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, width, height);
    ctx?.drawImage(s.renderer.domElement, 0, 0, width, height);
    thumb.drawn = true;
  }
}

export function DppPartThumb({ partId, label }: { partId: string; label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    let s: ReturnType<typeof getShared>;
    try {
      s = getShared();
    } catch {
      return; // no WebGL: the thumbnail stays empty
    }
    const thumb: Thumb = { canvas, partId, object: null, distance: 1, visible: false, drawn: false };
    thumbs.add(thumb);
    if (!frame) {
      frame = requestAnimationFrame(tick);
    }

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      thumb.drawn = false;
    };
    size();
    const resize = new ResizeObserver(size);
    resize.observe(canvas);
    const seen = new IntersectionObserver(([entry]) => {
      thumb.visible = entry.isIntersecting;
    });
    seen.observe(canvas);

    s.model.then((model) => {
      const cut = cutPiece(model, partId);
      if (cut && thumbs.has(thumb)) {
        thumb.object = cut.object;
        thumb.distance = (cut.radius * 1.08) / Math.sin(Three.MathUtils.degToRad(s.camera.fov / 2));
      }
    });

    return () => {
      thumbs.delete(thumb);
      resize.disconnect();
      seen.disconnect();
      if (!thumbs.size) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
  }, [partId]);

  return <canvas ref={canvasRef} className="block size-full" role="img" aria-label={label} />;
}
