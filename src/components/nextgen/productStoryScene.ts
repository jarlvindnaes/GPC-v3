import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { getStoryFrame } from "./productStoryMath";

export async function createProductScene(
  host: HTMLDivElement,
  base: string,
  getProgress: () => number,
  onTick: (dt: number) => void,
  onReady: () => void,
  onError: () => void,
  isCancelled: () => boolean,
  reduceMotion: () => boolean
) {
  let renderer: Three.WebGLRenderer;
  try {
    renderer = new Three.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    onError();
    return () => {};
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = Three.SRGBColorSpace;
  renderer.toneMapping = Three.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  host.appendChild(renderer.domElement);
  renderer.domElement.style.touchAction = "pan-y";
  const scene = new Three.Scene();
  scene.add(new Three.HemisphereLight(0xf5f8ff, 0x7e8da7, 2.5));
  const key = new Three.DirectionalLight(0xffefd8, 3.2);
  key.position.set(4, 6, 5);
  scene.add(key);
  const rim = new Three.DirectionalLight(0xc6d3ff, 2);
  rim.position.set(-4, 2, -3);
  scene.add(rim);
  const camera = new Three.PerspectiveCamera(33, 1, 0.01, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.09;
  controls.minPolarAngle = Math.PI / 6;
  controls.maxPolarAngle = Math.PI / 1.7;
  controls.touches.ONE = Three.TOUCH.ROTATE;
  const draco = new DRACOLoader().setDecoderPath(`${base}nextgen/draco/`);
  const loader = new GLTFLoader().setDRACOLoader(draco);
  const parts: { mesh: Three.Mesh; origin: Three.Vector3; offset: Three.Vector3 }[] = [];
  let model: Three.Object3D | undefined;
  let disposed = false;
  let visible = true;
  let radius = 1;
  let center = new Three.Vector3();
  let currentAmount = 0;
  const size = () => {
    const width = Math.max(1, host.clientWidth),
      height = Math.max(1, host.clientHeight);
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (model) {
      const angle = Math.min(
        Three.MathUtils.degToRad(camera.fov),
        2 * Math.atan(Math.tan(Three.MathUtils.degToRad(camera.fov) / 2) * camera.aspect)
      );
      camera.position
        .copy(center)
        .addScaledVector(new Three.Vector3(0.8, 0.42, 1.25).normalize(), (radius / Math.sin(angle / 2)) * 1.1);
      controls.target.copy(center);
      controls.update();
    }
  };
  size();
  const disposeModel = (object: Three.Object3D) => {
    const textures = new Set<Three.Texture>();
    const materials = new Set<Three.Material>();
    object.traverse((child) => {
      const mesh = child as Three.Mesh;
      if (!mesh.isMesh) {
        return;
      }
      mesh.geometry.dispose();
      for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
        materials.add(material);
        for (const value of Object.values(material)) {
          if (value instanceof Three.Texture) {
            textures.add(value);
          }
        }
      }
    });
    for (const texture of textures) {
      texture.dispose();
    }
    for (const material of materials) {
      material.dispose();
    }
  };
  loader.load(
    `${base}wireframes/cross-chair-04.glb`,
    (gltf) => {
      if (disposed || isCancelled()) {
        disposeModel(gltf.scene);
        return;
      }
      model = gltf.scene;
      const box = new Three.Box3().setFromObject(model);
      const height = box.getSize(new Three.Vector3()).y;
      const middle = box.getCenter(new Three.Vector3());
      model.position.sub(middle);
      scene.add(model);
      model.updateMatrixWorld(true);
      model.traverse((child) => {
        const mesh = child as Three.Mesh;
        if (!mesh.isMesh) {
          return;
        }
        const partCenter = new Three.Box3().setFromObject(mesh).getCenter(new Three.Vector3());
        const name = mesh.name.toLowerCase();
        let offset = partCenter.clone().multiplyScalar(0.75);
        if (name === "seat") {
          offset = new Three.Vector3(0, height * 0.24, height * 0.18);
        } else if (name === "back") {
          offset = new Three.Vector3(0, height * 0.4, -height * 0.15);
        } else if (name === "cross") {
          offset = new Three.Vector3(0, -height * 0.18, 0);
        } else if (name.includes("metal_screw")) {
          offset = new Three.Vector3(partCenter.x * 0.5, -height * 0.45, partCenter.z * 0.6);
        } else if (name.includes("hex_socket")) {
          offset = new Three.Vector3(Math.sign(partCenter.x) * height * 0.2, height * 0.22, height * 0.4);
        } else if (name.includes("leg")) {
          offset = new Three.Vector3(
            Math.sign(partCenter.x) * height * 0.26,
            -height * 0.1,
            Math.sign(partCenter.z) * height * 0.25
          );
        }
        if (mesh.parent) {
          offset = mesh.parent
            .worldToLocal(partCenter.clone().add(offset))
            .sub(mesh.parent.worldToLocal(partCenter.clone()));
        }
        parts.push({ mesh, origin: mesh.position.clone(), offset });
        for (const raw of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
          const material = raw as Three.MeshStandardMaterial;
          material.side = Three.DoubleSide;
          if (name.includes("screw") || name.includes("hex")) {
            material.metalness = 0.35;
            material.roughness = 0.5;
          } else {
            material.roughness = 0.72;
          }
        }
      });
      for (const part of parts) {
        part.mesh.position.copy(part.origin).add(part.offset);
      }
      const sphere = new Three.Box3().setFromObject(model).getBoundingSphere(new Three.Sphere());
      radius = sphere.radius;
      center = sphere.center;
      for (const part of parts) {
        part.mesh.position.copy(part.origin);
      }
      size();
      onReady();
    },
    undefined,
    onError
  );
  let last = performance.now(),
    frame = 0,
    uiTime = 0;
  const render = (now: number) => {
    if (disposed) {
      return;
    }
    frame = requestAnimationFrame(render);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!visible || document.hidden) {
      return;
    }
    onTick(dt);
    const target = getStoryFrame(getProgress()).separation;
    currentAmount = reduceMotion() ? target : Three.MathUtils.damp(currentAmount, target, 9, dt);
    for (const part of parts) {
      part.mesh.position.copy(part.origin).addScaledVector(part.offset, currentAmount);
    }
    controls.update();
    renderer.render(scene, camera);
    uiTime += dt;
    if (uiTime > 0.1) {
      host.dataset.separation = currentAmount.toFixed(3);
      uiTime = 0;
    }
  };
  frame = requestAnimationFrame(render);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  observer.observe(host);
  const resize = new ResizeObserver(size);
  resize.observe(host);
  const onLost = (event: Event) => {
    event.preventDefault();
    onError();
  };
  renderer.domElement.addEventListener("webglcontextlost", onLost);
  return () => {
    if (disposed) {
      return;
    }
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    resize.disconnect();
    controls.dispose();
    draco.dispose();
    if (model) {
      disposeModel(model);
    }
    renderer.domElement.removeEventListener("webglcontextlost", onLost);
    renderer.dispose();
    renderer.domElement.remove();
  };
}
