import { useEffect, useRef } from "react";
import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

import { useIsNearViewport } from "../../utilities/useIsNearViewport";

// Exploded-assembly of the TAKT Cross Chair for the #components section. Adapted from
// Drafts/wireframes/chair-scroll.js (vanilla three.js + CDN importmap) to a hydrated React island.
// The chair continuously eases between fully assembled and ~30% exploded on a loop (independent of
// scroll), while it auto-rotates and stays drag-rotatable. The renderer canvas is created in the
// effect and appended into the aria-hidden host div so the existing #chair-explode CSS applies,
// with three r0.183 API updates (SRGBColorSpace / outputColorSpace / texture color-space) and
// BASE_URL asset paths.

const EXPLODE_START = 0.3; // peak "explosion" of the breathing loop (~30% apart)
const EXPLODE_FACTOR = 2.2; // matches the chair viewer's slider mapping
const HOLD_ASSEMBLED = 1; // seconds the chair rests fully assembled each loop
const EXPLODE_SECONDS = 6; // seconds for one explode-out-and-back
const FRAME_PAD = 0.85; // < 1 zooms the camera in (the chair fills the frame)
const DRACO_DECODER_PATH = "https://www.gstatic.com/draco/versioned/decoders/1.5.6/";

interface PartUserData {
  basePos: Three.Vector3;
  dir: Three.Vector3;
}

export function ExplodingChair() {
  const hostRef = useRef<HTMLDivElement>(null);
  const isNear = useIsNearViewport(hostRef);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new Three.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = Three.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.4;
    renderer.outputColorSpace = Three.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    host.appendChild(renderer.domElement);

    const scene = new Three.Scene();

    const pmrem = new Three.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    let envMap: Three.Texture | null = null;
    const rgbeLoader = new RGBELoader();
    // Shared with the passport phone (hdri/studio_small_03_1k.hdr) so the SME page loads one HDR, not two.
    rgbeLoader.load(`${import.meta.env.BASE_URL}hdri/studio_small_03_1k.hdr`, (hdr) => {
      hdr.mapping = Three.EquirectangularReflectionMapping;
      envMap = pmrem.fromEquirectangular(hdr).texture;
      scene.environment = envMap;
      hdr.dispose();
    });

    const camera = new Three.PerspectiveCamera(35, host.clientWidth / host.clientHeight, 0.01, 1000);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.enableZoom = false; // let the wheel scroll the page, not zoom the chair
    controls.maxPolarAngle = Math.PI / 1.9;
    controls.autoRotate = !reduceMotion; // keeps turning; resumes after a drag
    controls.autoRotateSpeed = 0.9;

    // High-key studio fill (near-shadowless, matches the manufacturer shot)
    scene.add(new Three.AmbientLight(0xffffff, 0.78));
    const key = new Three.DirectionalLight(0xfff8f0, 0.18);
    key.position.set(5, 3.5, 4);
    scene.add(key);
    const fill = new Three.DirectionalLight(0xffe9d5, 0.35);
    fill.position.set(-4, 6, -4);
    scene.add(fill);

    const parts: Three.Mesh[] = [];
    let ready = false;
    let modelRef: Three.Object3D | null = null;

    // Frame the camera so the fully-exploded chair fits with margin at any rotation
    // (bounding-sphere fit -> never clips the sides).
    const viewDir = new Three.Vector3(0.55, 0.28, 1).normalize();
    const frameModel = () => {
      if (!modelRef) {
        return;
      }
      // Radius from the fully-exploded extent so it never clips during the animation...
      const k = EXPLODE_FACTOR * EXPLODE_START;
      for (const part of parts) {
        const data = part.userData as PartUserData;
        const b = data.basePos;
        const d = data.dir;
        part.position.set(b.x + d.x * k, b.y + d.y * k, b.z + d.z * k);
      }
      const radius = new Three.Box3().setFromObject(modelRef).getBoundingSphere(new Three.Sphere()).radius * FRAME_PAD;
      // ...but aim at the ASSEMBLED chair's centre, so the splayed legs / dropped cross don't drag it low.
      for (const part of parts) {
        part.position.copy((part.userData as PartUserData).basePos);
      }
      const center = new Three.Box3().setFromObject(modelRef).getBoundingSphere(new Three.Sphere()).center;
      const fovV = Three.MathUtils.degToRad(camera.fov);
      const fovH = 2 * Math.atan(Math.tan(fovV / 2) * camera.aspect);
      const dist = radius / Math.sin(Math.min(fovV, fovH) / 2);
      controls.target.copy(center);
      camera.position.copy(center).addScaledVector(viewDir, dist);
      controls.update();
    };

    const draco = new DRACOLoader().setDecoderPath(DRACO_DECODER_PATH);
    const loader = new GLTFLoader().setDRACOLoader(draco);
    loader.setMeshoptDecoder(MeshoptDecoder);

    let disposed = false;

    loader.load(
      `${import.meta.env.BASE_URL}wireframes/cross-chair-04.glb`,
      (gltf) => {
        if (disposed) {
          return;
        }
        const model = gltf.scene;

        model.traverse((object) => {
          const mesh = object as Three.Mesh;
          if (!mesh.isMesh) {
            return;
          }
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          for (const material of mats) {
            const m = material as Three.MeshStandardMaterial;
            if (!m) {
              continue;
            }
            m.transparent = false;
            m.depthWrite = true;
            m.alphaTest = 0;
            m.side = Three.DoubleSide;
            if (m.normalMap) {
              m.normalScale.set(0.4, 0.4);
            }
            m.envMapIntensity = 0.32;
            if (m.map) {
              m.roughnessMap = null;
              m.roughness = 0.85;
              m.color = new Three.Color(0xeeca9d); // warm oak (browner than honey, eased back ~10%)
            }
            if (mesh.name.startsWith("Metal_Screw")) {
              m.color = new Three.Color(0xa0a3a8);
              m.metalness = 0.8;
              m.roughness = 0.42;
              m.metalnessMap = null;
              m.roughnessMap = null;
            } else if (mesh.name.startsWith("Hex_Socket")) {
              m.color = new Three.Color(0x202022);
              m.metalness = 0.8;
              m.roughness = 0.45;
              m.metalnessMap = null;
              m.roughnessMap = null;
            }
            m.needsUpdate = true;
          }
        });

        // Center on floor and frame it
        const box = new Three.Box3().setFromObject(model);
        const center = box.getCenter(new Three.Vector3());
        model.position.x -= center.x;
        model.position.z -= center.z;
        model.position.y -= box.min.y;
        scene.add(model);

        // Per-part base position + 3D explode direction (offset of its centre from the chair's centre)
        const mBox = new Three.Box3().setFromObject(model);
        const mCenter = mBox.getCenter(new Three.Vector3());
        model.traverse((object) => {
          const mesh = object as Three.Mesh;
          if (!mesh.isMesh) {
            return;
          }
          const dir = new Three.Box3().setFromObject(mesh).getCenter(new Three.Vector3()).sub(mCenter);
          // Explode directions tuned to how the chair actually comes apart:
          if (mesh.name === "Cross") {
            dir.set(0, -0.3, 0); // centre cross drops straight down
          } else if (mesh.name.startsWith("Metal_Screw")) {
            dir.set(0, -0.72, 0); // underframe screws drop just clear below the chair's feet
          } else if (mesh.name.startsWith("Hex_Socket")) {
            dir.set(0, 0.05, 0.8); // backrest screws pull forward, out in front of the chair (+Z)
          }
          mesh.userData = { basePos: mesh.position.clone(), dir } satisfies PartUserData;
          parts.push(mesh);
        });

        modelRef = model;
        frameModel();

        host.removeAttribute("data-loading");
        ready = true;
      },
      undefined,
      (err) => {
        host.setAttribute("data-loading", "Failed to load chair model");
        console.error(err);
      }
    );

    // Continuous "breathing" assembly (no scroll involvement): the chair eases from fully assembled
    // out to ~EXPLODE_START exploded and back, on a loop. The cosine easing dwells gently at each
    // extreme. Time only advances while the chair is on-screen, so it never jumps after being away.
    const clock = new Three.Clock();
    let elapsed = 0;
    const loopSeconds = HOLD_ASSEMBLED + EXPLODE_SECONDS;

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      if (!isNear.current) {
        return;
      }
      if (ready) {
        if (!reduceMotion) {
          elapsed += dt;
        }
        // Rest fully assembled (amount 0) for HOLD_ASSEMBLED, then ease out to EXPLODE_START and
        // back over EXPLODE_SECONDS. The cosine has zero slope at both ends, so entering/leaving
        // the hold is seamless. reduceMotion never advances elapsed, so it stays assembled.
        const phase = elapsed % loopSeconds;
        let amount = 0;
        if (phase > HOLD_ASSEMBLED) {
          const m = (phase - HOLD_ASSEMBLED) / EXPLODE_SECONDS;
          amount = (EXPLODE_START * (1 - Math.cos(m * Math.PI * 2))) / 2;
        }
        const k = EXPLODE_FACTOR * amount;
        for (const part of parts) {
          const data = part.userData as PartUserData;
          const b = data.basePos;
          const d = data.dir;
          part.position.set(b.x + d.x * k, b.y + d.y * k, b.z + d.z * k);
        }
      }
      controls.update();
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(animate);

    const onResize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) {
        return;
      }
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      frameModel(); // re-fit for the new aspect (narrow widths need the camera further back)
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(host);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      controls.dispose();
      draco.dispose();

      scene.traverse((object) => {
        const mesh = object as Three.Mesh;
        if (!mesh.isMesh) {
          return;
        }
        mesh.geometry.dispose();
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const material of mats) {
          const m = material as Three.MeshStandardMaterial;
          if (m.map) {
            m.map.dispose();
          }
          if (m.normalMap) {
            m.normalMap.dispose();
          }
          if (m.roughnessMap) {
            m.roughnessMap.dispose();
          }
          if (m.metalnessMap) {
            m.metalnessMap.dispose();
          }
          m.dispose();
        }
      });

      if (envMap) {
        envMap.dispose();
      }
      pmrem.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [isNear]);

  return <div className="chair-explode" id="chair-explode" aria-hidden={true} ref={hostRef} />;
}
