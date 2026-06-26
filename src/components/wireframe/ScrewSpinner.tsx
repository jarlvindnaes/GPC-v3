import { useEffect, useRef } from "react";
import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

import { useIsNearViewport } from "../../utilities/useIsNearViewport";

// A single metal screw lifted straight out of the Cross Chair GLB, isolated and slowly turning in the
// top-right of the #components section. It reuses the chair model (already loaded + browser-cached on this
// page) and the same studio HDR as the other 3D islands, so it adds no new asset. On load it finds the
// first "Metal_Screw" mesh, bakes its world transform, recentres the geometry, and spins it on its own.

const DRACO_DECODER_PATH = "https://www.gstatic.com/draco/versioned/decoders/1.5.6/";
// The original site's bolt ships a "BoltSteel" PBR material (baseColor + metallicRoughness + normal +
// occlusion maps) that gives it its natural, worn-metal look. We lift that material onto the chair screw.
const BOLT_MODEL = `${import.meta.env.BASE_URL}models/bolt_m10x25_hexagon_head (1).glb`;
const FRAME_PAD = 1.25; // > 1 leaves margin around the screw's bounding sphere so it never clips at any angle
const TILT = 0.62; // lean the screw off vertical so the idle spin reads as a 3D tumble, not an axial spin

export function ScrewSpinner() {
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
    renderer.toneMappingExposure = 0.9; // close to the original bolt viewer so the BoltSteel material reads
    renderer.outputColorSpace = Three.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    host.appendChild(renderer.domElement);

    const scene = new Three.Scene();

    const pmrem = new Three.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    let envMap: Three.Texture | null = null;
    const rgbeLoader = new RGBELoader();
    // Shared with the chair + passport phone (hdri/studio_small_03_1k.hdr) so the page loads one HDR.
    rgbeLoader.load(`${import.meta.env.BASE_URL}hdri/studio_small_03_1k.hdr`, (hdr) => {
      hdr.mapping = Three.EquirectangularReflectionMapping;
      envMap = pmrem.fromEquirectangular(hdr).texture;
      scene.environment = envMap;
      hdr.dispose();
    });

    const camera = new Three.PerspectiveCamera(35, host.clientWidth / host.clientHeight, 0.01, 1000);

    // Drag to rotate (same feel as the chair); idle auto-rotate that resumes after a drag.
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.enableZoom = false; // let the wheel scroll the page, not zoom the screw
    controls.autoRotate = !reduceMotion;
    controls.autoRotateSpeed = 1.1;

    scene.add(new Three.AmbientLight(0xffffff, 0.7));
    const key = new Three.DirectionalLight(0xfff8f0, 0.5);
    key.position.set(4, 5, 6);
    scene.add(key);
    const fill = new Three.DirectionalLight(0xffe9d5, 0.3);
    fill.position.set(-5, 2, -3);
    scene.add(fill);

    const spinner = new Three.Group(); // holds the pre-tilted screw; the camera orbits it
    scene.add(spinner);

    const frameScrew = () => {
      const sphere = new Three.Box3().setFromObject(spinner).getBoundingSphere(new Three.Sphere());
      if (!sphere.radius) {
        return;
      }
      const radius = sphere.radius * FRAME_PAD;
      const fovV = Three.MathUtils.degToRad(camera.fov);
      const fovH = 2 * Math.atan(Math.tan(fovV / 2) * camera.aspect);
      // Fit the bounding SPHERE (rotation-invariant), so the screw never clips however it's dragged.
      const dist = radius / Math.sin(Math.min(fovV, fovH) / 2);
      const dir = new Three.Vector3(0.4, 0.25, 1).normalize();
      camera.position.copy(sphere.center).addScaledVector(dir, dist);
      controls.target.copy(sphere.center);
      controls.update();
    };

    const draco = new DRACOLoader().setDecoderPath(DRACO_DECODER_PATH);
    const loader = new GLTFLoader().setDRACOLoader(draco);
    loader.setMeshoptDecoder(MeshoptDecoder);

    let disposed = false;

    const loadGltf = (url: string): Promise<{ scene: Three.Group }> =>
      new Promise((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
      });

    // Load the chair (for the screw geometry) and the bolt (for its BoltSteel material) together.
    Promise.all([loadGltf(`${import.meta.env.BASE_URL}wireframes/cross-chair-04.glb`), loadGltf(BOLT_MODEL)])
      .then(([chair, bolt]) => {
        if (disposed) {
          return;
        }
        chair.scene.updateMatrixWorld(true);

        let screw: Three.Mesh | null = null;
        chair.scene.traverse((object) => {
          const mesh = object as Three.Mesh;
          if (!screw && mesh.isMesh && mesh.name.startsWith("Metal_Screw")) {
            screw = mesh;
          }
        });
        if (!screw) {
          host.setAttribute("data-loading", "Screw not found");
          return;
        }

        // Lift the bolt's PBR material (with its baked maps + correct colour spaces from GLTFLoader).
        let boltMaterial: Three.MeshStandardMaterial | null = null;
        bolt.scene.traverse((object) => {
          const mesh = object as Three.Mesh;
          if (!boltMaterial && mesh.isMesh && mesh.material) {
            boltMaterial = (
              Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
            ) as Three.MeshStandardMaterial;
          }
        });

        // Bake the screw's place in the chair into its geometry, then recentre it at the origin so the
        // group can spin it about its own centre. applyMatrix4 transforms the normals too (no recompute).
        const geometry = (screw as Three.Mesh).geometry.clone();
        geometry.applyMatrix4((screw as Three.Mesh).matrixWorld);
        geometry.computeBoundingBox();
        const center = (geometry.boundingBox as Three.Box3).getCenter(new Three.Vector3());
        geometry.translate(-center.x, -center.y, -center.z);

        const material =
          boltMaterial ?? new Three.MeshStandardMaterial({ color: 0xb4b7bc, metalness: 0.85, roughness: 0.38 });
        material.side = Three.DoubleSide;
        material.envMapIntensity = 1;
        material.needsUpdate = true;

        const mesh = new Three.Mesh(geometry, material);
        mesh.rotation.z = TILT;
        spinner.add(mesh);

        frameScrew();
        host.removeAttribute("data-loading");
      })
      .catch((err) => {
        host.setAttribute("data-loading", "Failed to load screw model");
        console.error(err);
      });

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!isNear.current) {
        return;
      }
      controls.update(); // drives damping + idle auto-rotate
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
      frameScrew();
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(host);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      controls.dispose();
      draco.dispose();

      spinner.traverse((object) => {
        const mesh = object as Three.Mesh;
        if (!mesh.isMesh) {
          return;
        }
        mesh.geometry.dispose();
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const material of mats) {
          const m = material as Three.MeshStandardMaterial;
          m.map?.dispose();
          m.normalMap?.dispose();
          m.roughnessMap?.dispose();
          m.metalnessMap?.dispose();
          m.aoMap?.dispose();
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

  return <div className="screw-spinner" aria-hidden={true} ref={hostRef} />;
}
