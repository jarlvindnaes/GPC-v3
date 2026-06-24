// Scroll-driven exploded-assembly of the TAKT Cross Chair for the SMV #components section.
// Starts ~30% exploded; assembles as the user scrolls down, re-explodes scrolling up.
// Auto-rotates, draggable to orbit. No explode slider, no scroll-zoom (so the page still scrolls).
// Same look as Drafts/3d-chair/cross-chair-04.html (lighting, materials, explode math).
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

const EXPLODE_START = 0.3;   // 30% exploded when the section first appears
const EXPLODE_FACTOR = 2.2;  // matches the chair viewer's slider mapping
const ASSEMBLED_GAP = 10;  // px below the sticky nav where the chair is fully assembled

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function initChair(container) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.65;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.display = "block";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  new RGBELoader().load("./studio.hdr", (hdr) => {
    hdr.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = pmrem.fromEquirectangular(hdr).texture;
    hdr.dispose();
  });

  const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.01, 1000);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.enableZoom = false;          // let the wheel scroll the page, not zoom the chair
  controls.maxPolarAngle = Math.PI / 1.9;
  controls.autoRotate = true;           // keeps turning; resumes after a drag
  controls.autoRotateSpeed = 0.9;

  // High-key studio fill (near-shadowless, matches the manufacturer shot)
  scene.add(new THREE.AmbientLight(0xffffff, 0.78));
  const key = new THREE.DirectionalLight(0xfff8f0, 0.18);
  key.position.set(5, 3.5, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffe9d5, 0.35);
  fill.position.set(-4, 6, -4);
  scene.add(fill);

  const parts = [];
  let ready = false;
  let modelRef = null;

  // Frame the camera so the *fully exploded* chair fits with margin at any rotation (bounding-sphere fit -> never clips the sides).
  const FRAME_PAD = 0.85;   // < 1 zooms the camera in (the chair fills the frame; exploded tips may crop slightly)
  const VIEW_DIR = new THREE.Vector3(0.55, 0.28, 1).normalize();
  function frameModel() {
    if (!modelRef) return;
    // Radius from the fully-exploded extent so it never clips during the animation...
    const k = EXPLODE_FACTOR * EXPLODE_START;
    for (const o of parts) { const b = o.userData.basePos, d = o.userData.dir; o.position.set(b.x + d.x * k, b.y + d.y * k, b.z + d.z * k); }
    const R = new THREE.Box3().setFromObject(modelRef).getBoundingSphere(new THREE.Sphere()).radius * FRAME_PAD;
    // ...but aim at the ASSEMBLED chair's centre, so the splayed legs / dropped cross don't drag the chair low in frame.
    for (const o of parts) o.position.copy(o.userData.basePos);
    const center = new THREE.Box3().setFromObject(modelRef).getBoundingSphere(new THREE.Sphere()).center;
    const fovV = THREE.MathUtils.degToRad(camera.fov);
    const fovH = 2 * Math.atan(Math.tan(fovV / 2) * camera.aspect);
    const dist = R / Math.sin(Math.min(fovV, fovH) / 2);
    controls.target.copy(center);
    camera.position.copy(center).addScaledVector(VIEW_DIR, dist);
    controls.update();
  }

  const draco = new DRACOLoader().setDecoderPath("https://unpkg.com/three@0.160.0/examples/jsm/libs/draco/");
  const loader = new GLTFLoader().setDRACOLoader(draco);
  loader.setMeshoptDecoder(MeshoptDecoder);

  loader.load("./cross-chair-04.glb", (gltf) => {
    const model = gltf.scene;

    model.traverse((o) => {
      if (!o.isMesh) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach((m) => {
        if (!m) return;
        m.transparent = false;
        m.depthWrite = true;
        m.alphaTest = 0;
        m.side = THREE.DoubleSide;
        if (m.normalMap) m.normalScale.set(0.4, 0.4);
        m.envMapIntensity = 0.32;
        if (m.map) { m.roughnessMap = null; m.roughness = 0.85; m.color = new THREE.Color(0xffe6c6); }  // warm honey oak
        if (o.name.startsWith("Metal_Screw")) { m.color = new THREE.Color(0xa0a3a8); m.metalness = 0.8; m.roughness = 0.42; m.metalnessMap = null; m.roughnessMap = null; }
        else if (o.name.startsWith("Hex_Socket")) { m.color = new THREE.Color(0x202022); m.metalness = 0.8; m.roughness = 0.45; m.metalnessMap = null; m.roughnessMap = null; }
        m.needsUpdate = true;
      });
    });

    // Center on floor and frame it
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.x -= center.x;
    model.position.z -= center.z;
    model.position.y -= box.min.y;
    scene.add(model);

    // Per-part base position + 3D explode direction (offset of its centre from the chair's centre)
    const mBox = new THREE.Box3().setFromObject(model);
    const mCenter = mBox.getCenter(new THREE.Vector3());
    model.traverse((o) => {
      if (!o.isMesh) return;
      o.userData.basePos = o.position.clone();
      o.userData.dir = new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3()).sub(mCenter);
      if (o.name === "Cross") o.userData.dir.set(0, -0.3, 0);   // dead-centre part: send it straight down
      parts.push(o);
    });

    modelRef = model;
    frameModel();

    container.removeAttribute("data-loading");
    ready = true;
  }, undefined, (err) => {
    container.setAttribute("data-loading", "Failed to load chair model");
    console.error(err);
  });

  // Stay fully exploded until the trigger enters view, then assemble as it scrolls up.
  // Desktop and mobile stack differently, so each has its own trigger element.
  const triggerDesktop = document.querySelector("[data-chair-trigger]") || container;
  // On mobile the chair stacks ABOVE the copy, so drive the assembly off the chair's own position
  // (otherwise it only finishes after the chair has scrolled off the top).
  const triggerMobile = container;
  const nav = document.querySelector(".nav");
  function explodeAmount() {
    const trigger = matchMedia("(max-width: 820px)").matches ? triggerMobile : triggerDesktop;
    const rect = trigger.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const assembledAt = (nav ? nav.offsetHeight : 0) + ASSEMBLED_GAP;   // just below the sticky nav
    // 0 (exploded) when the trigger enters from the bottom, 1 (assembled) when it's `assembledAt` from the top
    const p = clamp((vh - rect.top) / (vh - assembledAt), 0, 1);
    return EXPLODE_START * (1 - p);
  }

  let isNear = true;
  new IntersectionObserver(
    (entries) => { for (const e of entries) isNear = e.isIntersecting; },
    { rootMargin: "200px" }
  ).observe(container);

  function animate() {
    requestAnimationFrame(animate);
    if (!isNear) return;
    if (ready) {
      const k = EXPLODE_FACTOR * explodeAmount();
      for (const o of parts) {
        const b = o.userData.basePos, d = o.userData.dir;
        o.position.set(b.x + d.x * k, b.y + d.y * k, b.z + d.z * k);
      }
    }
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  new ResizeObserver(() => {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    frameModel();   // re-fit for the new aspect (narrow widths need the camera further back)
  }).observe(container);
}

const container = document.getElementById("chair-explode");
if (container) initChair(container);
