import * as Three from "three";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { ChairDofShader } from "../wireframe/chair-dof";
import { CHAIR_MODEL as SOFT_CHAIR_MODEL } from "../dpp/dppChairModel";
import { placeStaged, softMovesFor } from "../wireframe/softChairStages";
import { getStoryFrame } from "./productStoryMath";

// "The intelligence inside" story, driven by scroll / the slider (same contract as productStoryScene).
// It starts as a copy of the hero's exploding chair (wireframe/ExplodingChair.tsx): same model,
// materials, explode directions, screw lead timing, camera angle and depth of field. The story:
//   01 More than meets the eye — the hero's framing, assembled.
//   02 Every part has a story  — fully exploded; the camera flies in close to the top black screw,
//                                which slowly turns around the vertical axis while the step is held.
//   03 One product…            — back to the starting point.
// `separation` (0..1, from getStoryFrame) drives both the explosion and the camera move.
// `variant` "soft" plays the Soft Lounge Chair from the passport instead (same split model, same
// collision-free staged disassembly as the hero), with the connector bolt nearest the camera taking
// the screw's role in the close-up. The Cross Chair stays available as "cross".

const DRACO_DECODER_PATH =
  "https://www.gstatic.com/draco/versioned/decoders/1.5.6/";
const EXPLODE_FACTOR = 2.2;
const EXPLODE_AMOUNT = 0.15; // as in the hero
const LEAD = 0.14; // screws leave first and return last (as in the hero)
const VIEW = new Three.Vector3(1.6, 0.7, 1).normalize(); // hero camera direction
const FRAME_PAD = 0.48; // start zoom: a touch wider than the hero's 0.4 (same fit rule)
const OFFSET_Y = 0.22; // start shift down (fraction of the canvas height); the hero uses 0.16
const DOF = 0.007; // hero depth of field (max blur, canvas widths)
const CLOSE_DOF = 0.012; // stronger blur behind the screw in the close-up
const CLOSE_DISTANCE = 2.6; // close-up camera distance, in screw lengths
const SPIN_SPEED = 0.45; // rad/s while the close-up is held

interface Part {
  mesh: Three.Object3D; // a mesh (Cross Chair) or a named piece holding meshes (Soft chair)
  basePos: Three.Vector3;
  baseQuat: Three.Quaternion;
  dir: Three.Vector3;
  leads: boolean;
  moves?: number[][]; // Soft chair: staged moves (see softChairStages.ts)
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

export async function createChairStoryScene(
  host: HTMLDivElement,
  base: string,
  getProgress: () => number,
  onTick: (dt: number) => void,
  onReady: () => void,
  onError: () => void,
  isCancelled: () => boolean,
  reduceMotion: () => boolean,
  // Screen position (canvas px) of the close-up screw's centre, every frame. The labels' leader lines
  // all end there and follow the turning screw.
  onAnchors?: (points: [number, number][]) => void,
  variant: "cross" | "soft" = "cross",
) {
  let renderer: Three.WebGLRenderer;
  try {
    renderer = new Three.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    onError();
    return () => {};
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = Three.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.4;
  renderer.outputColorSpace = Three.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.display = "block";
  renderer.domElement.style.touchAction = "pan-y";
  host.appendChild(renderer.domElement);

  const scene = new Three.Scene();
  const pmrem = new Three.PMREMGenerator(renderer);
  let envMap: Three.Texture | null = null;
  // RGBELoader is heavy-ish; load it lazily like the rest of the scene.
  const { RGBELoader } =
    await import("three/examples/jsm/loaders/RGBELoader.js");
  new RGBELoader().load(`${base}hdri/studio_small_03_1k.hdr`, (hdr) => {
    hdr.mapping = Three.EquirectangularReflectionMapping;
    envMap = pmrem.fromEquirectangular(hdr).texture;
    scene.environment = envMap;
    hdr.dispose();
  });
  scene.add(new Three.AmbientLight(0xffffff, 0.78));
  const key = new Three.DirectionalLight(0xfff8f0, 0.18);
  key.position.set(5, 3.5, 4);
  scene.add(key);
  const fill = new Three.DirectionalLight(0xffe9d5, 0.35);
  fill.position.set(-4, 6, -4);
  scene.add(fill);

  const camera = new Three.PerspectiveCamera(35, 1, 0.005, 1000);

  // Render -> tone map + sRGB (premultiplied-safe) -> depth-aware blur, as in the hero.
  const target = new Three.WebGLRenderTarget(1, 1, {
    type: Three.HalfFloatType,
    samples: 4,
  });
  const composer = new EffectComposer(renderer, target);
  composer.addPass(new RenderPass(scene, camera));
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
  const dof = new ShaderPass(ChairDofShader);
  const depthTarget = new Three.WebGLRenderTarget(1, 1, {
    depthTexture: new Three.DepthTexture(1, 1),
  });
  dof.uniforms.tDepth.value = depthTarget.depthTexture;
  dof.uniforms.cameraNear.value = camera.near;
  dof.uniforms.cameraFar.value = camera.far;
  composer.addPass(dof);
  const depthMaterial = new Three.MeshBasicMaterial({ side: Three.DoubleSide });

  // The model sits in a pivot so a drag can turn it without fighting the story camera.
  const pivot = new Three.Group();
  scene.add(pivot);
  const parts: Part[] = [];
  let model: Three.Object3D | null = null;
  let hero: Part | null = null; // the black backrest screw the close-up visits
  const heroCenter = new Three.Vector3(); // its geometric centre, local space (scaled)
  const heroAnchors: Three.Vector3[] = []; // points along its shaft, local space
  const start = {
    position: new Three.Vector3(),
    target: new Three.Vector3(),
    radius: 1,
  };
  const close = {
    center: new Three.Vector3(),
    dir: new Three.Vector3(),
    length: 0.03,
  };

  const size = () => {
    const w = Math.max(1, host.clientWidth);
    const h = Math.max(1, host.clientHeight);
    renderer.setSize(w, h);
    composer.setSize(w, h);
    const pr = renderer.getPixelRatio();
    depthTarget.setSize(Math.round(w * pr), Math.round(h * pr));
    dof.uniforms.aspect.value = w / h;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    frameStart();
  };

  const placeParts = (amountLead: number, amountRest: number) => {
    for (const part of parts) {
      if (part.moves) {
        // Soft chair: staged, driven by the separation itself (amountLead carries it).
        placeStaged(part.mesh, part.basePos, part.moves, amountLead, 1);
        continue;
      }
      const k =
        EXPLODE_FACTOR *
        EXPLODE_AMOUNT *
        (part.leads ? amountLead : amountRest);
      part.mesh.position.copy(part.basePos).addScaledVector(part.dir, k);
    }
  };

  // Hero framing: fit the fully exploded chair, aim at the assembled chair's centre.
  const frameStart = () => {
    if (!model) {
      return;
    }
    placeParts(1, 1);
    const radius = new Three.Box3()
      .setFromObject(model)
      .getBoundingSphere(new Three.Sphere()).radius;
    placeParts(0, 0);
    const assembled = new Three.Box3()
      .setFromObject(model)
      .getBoundingSphere(new Three.Sphere());
    const fovV = Three.MathUtils.degToRad(camera.fov);
    const fovH = 2 * Math.atan(Math.tan(fovV / 2) * camera.aspect);
    const dist = (radius * FRAME_PAD) / Math.sin(Math.min(fovV, fovH) / 2);
    start.target.copy(assembled.center);
    start.position.copy(assembled.center).addScaledVector(VIEW, dist);
    start.radius = assembled.radius;
  };

  const draco = new DRACOLoader().setDecoderPath(DRACO_DECODER_PATH);
  const loader = new GLTFLoader().setDRACOLoader(draco);
  loader.setMeshoptDecoder(MeshoptDecoder);
  let disposed = false;

  loader.load(
    variant === "soft" ? SOFT_CHAIR_MODEL : `${base}wireframes/cross-chair-04.glb`,
    (gltf) => {
      if (disposed || isCancelled()) {
        return;
      }
      const loaded = gltf.scene;
      loaded.traverse((object) => {
        const mesh = object as Three.Mesh;
        if (!mesh.isMesh) {
          return;
        }
        for (const material of Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material]) {
          const m = material as Three.MeshStandardMaterial;
          m.transparent = false;
          m.depthWrite = true;
          m.alphaTest = 0;
          m.side = Three.DoubleSide;
          if (variant === "soft") {
            m.envMapIntensity = 0.55; // its own oak, leather and steel finishes (as in the hero)
            m.needsUpdate = true;
            continue;
          }
          if (m.normalMap) {
            m.normalScale.set(0.4, 0.4);
          }
          m.envMapIntensity = 0.32;
          if (m.map) {
            m.roughnessMap = null;
            m.roughness = 0.85;
            m.color = new Three.Color(0xeeca9d);
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

      const box = new Three.Box3().setFromObject(loaded);
      const center = box.getCenter(new Three.Vector3());
      loaded.position.x -= center.x;
      loaded.position.z -= center.z;
      loaded.position.y -= box.min.y;
      pivot.add(loaded);
      pivot.updateMatrixWorld(true);

      const mCenter = new Three.Box3()
        .setFromObject(loaded)
        .getCenter(new Three.Vector3());
      if (variant === "soft") {
        // One part per named piece, with the hero's staged moves.
        let best = -Infinity;
        for (const piece of loaded.getObjectByName("Soft_Lounge_Chair")?.children ?? []) {
          const name = piece.name.replace(/_/g, " ");
          const c = new Three.Box3().setFromObject(piece).getCenter(new Three.Vector3());
          const part: Part = {
            mesh: piece,
            basePos: piece.position.clone(),
            baseQuat: piece.quaternion.clone(),
            dir: new Three.Vector3(),
            leads: false,
            moves: softMovesFor(name, Math.sign(c.x - mCenter.x) || 1),
          };
          parts.push(part);
          // The close-up visits the connector bolt nearest the camera.
          if (name.startsWith("Connector bolt")) {
            const towardCamera = c.clone().sub(mCenter).dot(VIEW);
            if (towardCamera > best) {
              best = towardCamera;
              hero = part;
            }
          }
        }
      }
      loaded.traverse((object) => {
        const mesh = object as Three.Mesh;
        if (!mesh.isMesh || variant === "soft") {
          return;
        }
        const dir = new Three.Box3()
          .setFromObject(mesh)
          .getCenter(new Three.Vector3())
          .sub(mCenter);
        if (mesh.name === "Cross") {
          dir.set(0, -0.3, 0);
        } else if (mesh.name.startsWith("Metal_Screw")) {
          dir.set(0, -0.72, 0);
        } else if (mesh.name.startsWith("Hex_Socket")) {
          dir
            .set(0, 1, 0)
            .applyQuaternion(mesh.getWorldQuaternion(new Three.Quaternion()))
            .multiplyScalar(0.5);
        }
        const part: Part = {
          mesh,
          basePos: mesh.position.clone(),
          baseQuat: mesh.quaternion.clone(),
          dir,
          leads:
            mesh.name.startsWith("Hex_Socket") ||
            mesh.name.startsWith("Metal_Screw"),
        };
        parts.push(part);
        // The close-up visits the black screw on the camera's side (+x).
        if (
          mesh.name.startsWith("Hex_Socket") &&
          mesh.getWorldPosition(new Three.Vector3()).x > 0
        ) {
          hero = part;
        }
      });

      model = loaded;
      if (hero && variant === "soft") {
        // The bolt fully backed out: its centre, size (it is a short head, so its diameter sets the
        // close-up distance) and a three-quarter view onto its hex socket from the hero's side.
        const h: Part = hero;
        placeParts(1, 1);
        pivot.updateMatrixWorld(true);
        const boltBox = new Three.Box3().setFromObject(h.mesh);
        const worldCenter = boltBox.getCenter(new Three.Vector3());
        close.center.copy(pivot.worldToLocal(worldCenter.clone()));
        const extent = boltBox.getSize(new Three.Vector3());
        // The close-up distance is CLOSE_DISTANCE "screw lengths"; the bolt head is short and wide,
        // so count it as ~2.6 diameters long to show the whole head with room around it.
        close.length = Math.max(extent.x, extent.y, extent.z) * 2.6;
        heroCenter.copy(h.mesh.worldToLocal(worldCenter.clone()));
        heroAnchors.push(heroCenter.clone());
        close.dir.copy(VIEW);
        placeParts(0, 0);
      } else if (hero) {
        // Where the screw ends up when fully exploded, its shaft direction and its length
        // (all in pivot space, so a drag turn carries the close-up with it).
        const h: Part = hero;
        placeParts(1, 1);
        pivot.updateMatrixWorld(true);
        const screwBox = new Three.Box3().setFromObject(h.mesh);
        close.center.copy(
          pivot.worldToLocal(screwBox.getCenter(new Three.Vector3())),
        );
        const shaft = new Three.Vector3(0, 1, 0).applyQuaternion(
          h.mesh.getWorldQuaternion(new Three.Quaternion()),
        );
        const geo = (h.mesh as Three.Mesh).geometry;
        geo.computeBoundingBox();
        const scaleY = h.mesh.getWorldScale(new Three.Vector3()).y;
        close.length =
          (geo.boundingBox
            ? geo.boundingBox.max.y - geo.boundingBox.min.y
            : 30) * scaleY;
        if (geo.boundingBox) {
          geo.boundingBox.getCenter(heroCenter).multiply(h.mesh.scale);
          const { min, max } = geo.boundingBox;
          // The screw's centre: every label's leader line ends here.
          heroAnchors.push(new Three.Vector3(0, (min.y + max.y) / 2, 0));
        }
        // Look at the screw side-on (perpendicular to its shaft), from the hero's side of the chair.
        close.dir
          .copy(VIEW)
          .addScaledVector(shaft, -VIEW.dot(shaft))
          .normalize();
        placeParts(0, 0);
      }
      size();
      host.removeAttribute("data-loading");
      onReady();
    },
    undefined,
    onError,
  );

  // Drag to turn the chair (yaw), damped; the story keeps control of the camera.
  let yaw = 0;
  let yawTarget = 0;
  let dragX: number | null = null;
  const onDown = (event: PointerEvent) => {
    dragX = event.clientX;
    renderer.domElement.setPointerCapture(event.pointerId);
  };
  const onMove = (event: PointerEvent) => {
    if (dragX === null) {
      return;
    }
    yawTarget +=
      ((event.clientX - dragX) / Math.max(1, host.clientWidth)) * Math.PI * 1.4;
    dragX = event.clientX;
  };
  const onUp = () => {
    dragX = null;
  };
  renderer.domElement.addEventListener("pointerdown", onDown);
  renderer.domElement.addEventListener("pointermove", onMove);
  renderer.domElement.addEventListener("pointerup", onUp);
  renderer.domElement.addEventListener("pointercancel", onUp);

  let separation = getStoryFrame(getProgress()).separation;
  let spin = 0;
  const axisY = new Three.Vector3(0, 1, 0);
  const spinQuat = new Three.Quaternion();
  const spinOffset = new Three.Vector3();
  const projected = new Three.Vector3();
  const camTarget = new Three.Vector3();
  const closePos = new Three.Vector3();
  const closeCenter = new Three.Vector3();
  let visible = true;
  let last = performance.now();
  let frame = 0;

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
    if (model) {
      const goal = getStoryFrame(getProgress()).separation;
      separation = reduceMotion()
        ? goal
        : Three.MathUtils.damp(separation, goal, 9, dt);
      const s = separation;
      // Screws lead on the way out and trail on the way back (as in the hero); the Soft chair's
      // staged moves carry their own order.
      if (variant === "soft") {
        placeParts(s, s);
      } else {
        placeParts(
          Math.min(s / (1 - LEAD), 1),
          Math.max((s - LEAD) / (1 - LEAD), 0),
        );
      }

      yaw = Three.MathUtils.damp(yaw, yawTarget, 8, dt);
      pivot.rotation.y = yaw;
      pivot.updateMatrixWorld(true);

      // Camera: hero framing -> close-up on the screw once the chair is mostly apart.
      const e = smooth(0.35, 1, s);
      closeCenter.copy(close.center).applyMatrix4(pivot.matrixWorld);
      closePos
        .copy(close.dir)
        .applyQuaternion(pivot.quaternion)
        .multiplyScalar(close.length * CLOSE_DISTANCE)
        .add(closeCenter);
      camera.position.lerpVectors(start.position, closePos, e);
      camTarget.lerpVectors(start.target, closeCenter, e);
      camera.lookAt(camTarget);
      // The hero's downward shift at the start, eased out as the camera flies to the screw.
      const w = Math.max(1, host.clientWidth);
      const h = Math.max(1, host.clientHeight);
      const shift = OFFSET_Y * (1 - e);
      if (shift > 0.0005) {
        camera.setViewOffset(w, h, 0, -shift * h, w, h);
      } else {
        camera.clearViewOffset();
      }

      // The screw turns slowly around the vertical axis (through its own centre, like a turntable)
      // while the close-up is held; leaving the step it eases back to the nearest whole turn so it
      // slots back in cleanly.
      if (hero) {
        const h: Part = hero;
        if (e > 0.97 && !reduceMotion()) {
          spin += SPIN_SPEED * dt;
        } else {
          spin = Three.MathUtils.damp(
            spin,
            Math.round(spin / (Math.PI * 2)) * Math.PI * 2,
            4,
            dt,
          );
        }
        spinQuat.setFromAxisAngle(axisY, spin);
        h.mesh.quaternion.copy(spinQuat).multiply(h.baseQuat);
        // Rotating about the mesh origin would swing the screw; shift it so its centre stays put.
        spinOffset.copy(heroCenter).applyQuaternion(h.baseQuat);
        h.mesh.position
          .add(spinOffset)
          .sub(spinOffset.applyQuaternion(spinQuat));
        if (onAnchors && heroAnchors.length) {
          h.mesh.updateMatrixWorld(true);
          camera.updateMatrixWorld();
          const w2 = host.clientWidth;
          const h2 = host.clientHeight;
          onAnchors(
            heroAnchors.map((local) => {
              const p = h.mesh
                .localToWorld(projected.copy(local))
                .project(camera);
              return [((p.x + 1) / 2) * w2, ((1 - p.y) / 2) * h2];
            }),
          );
        }
      }

      // Depth of field: hero settings at the start, a stronger blur behind the screw up close.
      const focus = camera.position.distanceTo(camTarget);
      dof.uniforms.focus.value = focus;
      dof.uniforms.maxblur.value = Three.MathUtils.lerp(DOF, CLOSE_DOF, e);
      dof.uniforms.aperture.value = Three.MathUtils.lerp(
        DOF / start.radius,
        CLOSE_DOF / (close.length * 1.5),
        e,
      );
    }
    scene.overrideMaterial = depthMaterial;
    renderer.setRenderTarget(depthTarget);
    renderer.clear();
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    scene.overrideMaterial = null;
    composer.render();
    host.dataset.separation = separation.toFixed(3);
  };
  frame = requestAnimationFrame(render);

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  observer.observe(host);
  const resize = new ResizeObserver(size);
  resize.observe(host);
  size();
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
    draco.dispose();
    renderer.domElement.removeEventListener("pointerdown", onDown);
    renderer.domElement.removeEventListener("pointermove", onMove);
    renderer.domElement.removeEventListener("pointerup", onUp);
    renderer.domElement.removeEventListener("pointercancel", onUp);
    renderer.domElement.removeEventListener("webglcontextlost", onLost);
    scene.traverse((object) => {
      const mesh = object as Three.Mesh;
      if (!mesh.isMesh) {
        return;
      }
      mesh.geometry.dispose();
      for (const material of Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material]) {
        const m = material as Three.MeshStandardMaterial;
        m.map?.dispose();
        m.normalMap?.dispose();
        m.roughnessMap?.dispose();
        m.metalnessMap?.dispose();
        m.dispose();
      }
    });
    envMap?.dispose();
    pmrem.dispose();
    depthTarget.depthTexture?.dispose();
    depthTarget.dispose();
    depthMaterial.dispose();
    dof.dispose();
    composer.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
