import { useEffect, useRef, useState } from "react";
import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

import { useIsNearViewport } from "../../utilities/useIsNearViewport";
import { ChairDofShader } from "./chair-dof";

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
// Share of the explode cycle the leading parts (all the screws) get to themselves at each
// end: they start backing out first, and are the last to go back in. Everything else moves inside it.
const LEAD = 0.14;
const FRAME_PAD = 0.85; // < 1 zooms the camera in (the chair fills the frame)
const DRACO_DECODER_PATH =
  "https://www.gstatic.com/draco/versioned/decoders/1.5.6/";

interface PartUserData {
  basePos: Three.Vector3;
  dir: Three.Vector3;
  leads: boolean; // moves over the full cycle (out first, back last); others move inside the LEAD margin
}

// `framePad` overrides FRAME_PAD per placement (smaller = camera closer = chair larger).
// `offsetX` / `offsetY` shift the rendered chair as a fraction of the canvas size (offsetX 0.2 = 20%
// to the right, offsetY 0.1 = 10% down) via the camera's view offset, so the canvas can span the
// full hero without clipping parts at its own edges.
export function ExplodingChair({
  framePad = FRAME_PAD,
  autoRotate = true,
  offsetX = 0,
  offsetY = 0,
  explodeAmount = EXPLODE_START,
  view = [0.55, 0.28, 1],
  media,
  depthOfField = 0,
}: {
  framePad?: number;
  autoRotate?: boolean;
  offsetX?: number;
  offsetY?: number;
  explodeAmount?: number; // peak explosion of the loop (framing still assumes EXPLODE_START)
  view?: [number, number, number]; // camera direction from the chair (x = right, y = up, z = front)
  media?: string; // only start the scene (and load the model) while this media query matches
  // Depth of field: largest blur radius as a fraction of the canvas width (e.g. 0.007). Everything up
  // to the chair's centre is sharp; parts about one chair-radius further away reach full blur. 0 = off.
  depthOfField?: number;
} = {}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const isNear = useIsNearViewport(hostRef);
  const [active, setActive] = useState(
    () => !media || window.matchMedia(media).matches,
  );

  useEffect(() => {
    if (!media) {
      return;
    }
    const query = window.matchMedia(media);
    const onChange = () => setActive(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [media]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !active) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

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
    rgbeLoader.load(
      `${import.meta.env.BASE_URL}hdri/studio_small_03_1k.hdr`,
      (hdr) => {
        hdr.mapping = Three.EquirectangularReflectionMapping;
        envMap = pmrem.fromEquirectangular(hdr).texture;
        scene.environment = envMap;
        hdr.dispose();
      },
    );

    const camera = new Three.PerspectiveCamera(
      35,
      host.clientWidth / host.clientHeight,
      0.01,
      1000,
    );

    // Optional depth of field: render (MSAA) -> tone map + sRGB -> depth-aware blur (chair-dof.ts).
    // Depth comes from a separate cheap pass with a flat material.
    let composer: EffectComposer | null = null;
    let dof: ShaderPass | null = null;
    let depthTarget: Three.WebGLRenderTarget | null = null;
    const depthMaterial = new Three.MeshBasicMaterial({
      side: Three.DoubleSide,
    });
    const sizeDof = (w: number, h: number) => {
      if (!composer || !dof || !depthTarget) {
        return;
      }
      const pr = renderer.getPixelRatio();
      composer.setSize(w, h);
      depthTarget.setSize(Math.round(w * pr), Math.round(h * pr));
      dof.uniforms.aspect.value = w / h;
    };
    if (depthOfField > 0) {
      const target = new Three.WebGLRenderTarget(1, 1, {
        type: Three.HalfFloatType,
        samples: 4,
      });
      composer = new EffectComposer(renderer, target);
      composer.addPass(new RenderPass(scene, camera));
      // Tone mapping + sRGB are non-linear, so applying them to premultiplied antialiased edge pixels
      // (colour already scaled by coverage) brightens the edges into a light fringe. Un-premultiply
      // before and re-premultiply after.
      const output = new OutputPass();
      const fs = output.material.fragmentShader;
      const end = fs.lastIndexOf("}");
      output.material.fragmentShader = `${fs
        .slice(0, end)
        .replace(
          "gl_FragColor = texture2D( tDiffuse, vUv );",
          "gl_FragColor = texture2D( tDiffuse, vUv );\n\t\t\tfloat coverage = gl_FragColor.a;\n\t\t\tif ( coverage > 0.0 ) gl_FragColor.rgb /= coverage;",
        )}\tgl_FragColor.rgb *= coverage;\n}`;
      composer.addPass(output);
      dof = new ShaderPass(ChairDofShader);
      depthTarget = new Three.WebGLRenderTarget(1, 1, {
        depthTexture: new Three.DepthTexture(1, 1),
      });
      dof.uniforms.tDepth.value = depthTarget.depthTexture;
      dof.uniforms.maxblur.value = depthOfField;
      dof.uniforms.cameraNear.value = camera.near;
      dof.uniforms.cameraFar.value = camera.far;
      composer.addPass(dof);
      sizeDof(host.clientWidth, host.clientHeight);
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.enableZoom = false; // let the wheel scroll the page, not zoom the chair
    controls.maxPolarAngle = Math.PI / 1.9;
    controls.autoRotate = autoRotate && !reduceMotion; // keeps turning; resumes after a drag
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
    const viewDir = new Three.Vector3(...view).normalize();
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
      const radius =
        new Three.Box3()
          .setFromObject(modelRef)
          .getBoundingSphere(new Three.Sphere()).radius * framePad;
      // ...but aim at the ASSEMBLED chair's centre, so the splayed legs / dropped cross don't drag it low.
      for (const part of parts) {
        part.position.copy((part.userData as PartUserData).basePos);
      }
      const assembled = new Three.Box3()
        .setFromObject(modelRef)
        .getBoundingSphere(new Three.Sphere());
      const center = assembled.center;
      const fovV = Three.MathUtils.degToRad(camera.fov);
      const fovH = 2 * Math.atan(Math.tan(fovV / 2) * camera.aspect);
      const dist = radius / Math.sin(Math.min(fovV, fovH) / 2);
      controls.target.copy(center);
      camera.position.copy(center).addScaledVector(viewDir, dist);
      // Slide the image without moving the camera (negative view offsets move content right / down).
      const w = host.clientWidth;
      const h = host.clientHeight;
      if ((offsetX || offsetY) && w && h) {
        camera.setViewOffset(w, h, -offsetX * w, -offsetY * h, w, h);
      } else {
        camera.clearViewOffset();
      }
      camera.updateProjectionMatrix();
      controls.update();
      if (dof) {
        dof.uniforms.focus.value = dist;
        dof.uniforms.aperture.value = depthOfField / assembled.radius;
      }
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
          const mats = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];
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
          const dir = new Three.Box3()
            .setFromObject(mesh)
            .getCenter(new Three.Vector3())
            .sub(mCenter);
          // Explode directions tuned to how the chair actually comes apart:
          if (mesh.name === "Cross") {
            dir.set(0, -0.3, 0); // centre cross drops straight down
          } else if (mesh.name.startsWith("Metal_Screw")) {
            dir.set(0, -0.72, 0); // underframe screws drop just clear below the chair's feet
          } else if (mesh.name.startsWith("Hex_Socket")) {
            // Backrest screws back out along their own shaft (local +Y points towards the head), so
            // they leave at the angle they were driven in instead of cutting through the wood.
            dir
              .set(0, 1, 0)
              .applyQuaternion(mesh.getWorldQuaternion(new Three.Quaternion()))
              .multiplyScalar(0.5);
          }
          mesh.userData = {
            basePos: mesh.position.clone(),
            dir,
            leads:
              mesh.name.startsWith("Hex_Socket") ||
              mesh.name.startsWith("Metal_Screw"),
          } satisfies PartUserData;
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
      },
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
        const m =
          phase > HOLD_ASSEMBLED
            ? (phase - HOLD_ASSEMBLED) / EXPLODE_SECONDS
            : 0;
        const ease = (t: number) =>
          (explodeAmount *
            (1 - Math.cos(Math.min(Math.max(t, 0), 1) * Math.PI * 2))) /
          2;
        const kLead = EXPLODE_FACTOR * ease(m);
        const kRest = EXPLODE_FACTOR * ease((m - LEAD) / (1 - 2 * LEAD));
        for (const part of parts) {
          const data = part.userData as PartUserData;
          const b = data.basePos;
          const d = data.dir;
          const k = data.leads ? kLead : kRest;
          part.position.set(b.x + d.x * k, b.y + d.y * k, b.z + d.z * k);
        }
      }
      controls.update();
      if (composer && depthTarget) {
        scene.overrideMaterial = depthMaterial;
        renderer.setRenderTarget(depthTarget);
        renderer.clear();
        renderer.render(scene, camera);
        renderer.setRenderTarget(null);
        scene.overrideMaterial = null;
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
    };
    raf = requestAnimationFrame(animate);

    const onResize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) {
        return;
      }
      renderer.setSize(w, h);
      sizeDof(w, h);
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
        const mats = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
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
      depthTarget?.depthTexture?.dispose();
      depthTarget?.dispose();
      depthMaterial.dispose();
      dof?.dispose();
      composer?.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [
    isNear,
    active,
    framePad,
    autoRotate,
    offsetX,
    offsetY,
    explodeAmount,
    depthOfField,
    ...view,
  ]);

  return (
    <div
      className="chair-explode"
      id="chair-explode"
      aria-hidden={true}
      ref={hostRef}
    />
  );
}
