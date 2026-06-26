import { useEffect, useRef } from "react";
import * as Three from "three";
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
const FRAME_PAD = 1.15; // > 1 leaves margin around the screw so it never clips while turning
const TILT = 0.62; // lean the screw off vertical so the spin reads as a 3D tumble, not an axial spin
const SPIN_SPEED = 0.7; // radians / second

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
    renderer.toneMappingExposure = 0.62; // a touch brighter than the chair so the lone screw reads on light
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

    scene.add(new Three.AmbientLight(0xffffff, 0.7));
    const key = new Three.DirectionalLight(0xfff8f0, 0.5);
    key.position.set(4, 5, 6);
    scene.add(key);
    const fill = new Three.DirectionalLight(0xffe9d5, 0.3);
    fill.position.set(-5, 2, -3);
    scene.add(fill);

    const spinner = new Three.Group(); // rotates on world Y; the screw sits inside it pre-tilted
    scene.add(spinner);

    let ready = false;

    const frameScrew = () => {
      const radius = new Three.Box3().setFromObject(spinner).getBoundingSphere(new Three.Sphere()).radius * FRAME_PAD;
      if (!radius) {
        return;
      }
      const fovV = Three.MathUtils.degToRad(camera.fov);
      const fovH = 2 * Math.atan(Math.tan(fovV / 2) * camera.aspect);
      const dist = radius / Math.sin(Math.min(fovV, fovH) / 2);
      const dir = new Three.Vector3(0.4, 0.25, 1).normalize();
      camera.position.copy(dir.multiplyScalar(dist));
      camera.lookAt(0, 0, 0);
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
        gltf.scene.updateMatrixWorld(true);

        let screw: Three.Mesh | null = null;
        gltf.scene.traverse((object) => {
          const mesh = object as Three.Mesh;
          if (!screw && mesh.isMesh && mesh.name.startsWith("Metal_Screw")) {
            screw = mesh;
          }
        });
        if (!screw) {
          host.setAttribute("data-loading", "Screw not found");
          return;
        }

        // Bake the screw's place in the chair into its geometry, then recentre it at the origin so the
        // group can spin it about its own centre. applyMatrix4 transforms the normals too (no recompute).
        const geometry = (screw as Three.Mesh).geometry.clone();
        geometry.applyMatrix4((screw as Three.Mesh).matrixWorld);
        geometry.computeBoundingBox();
        const center = (geometry.boundingBox as Three.Box3).getCenter(new Three.Vector3());
        geometry.translate(-center.x, -center.y, -center.z);

        const material = new Three.MeshStandardMaterial({
          color: 0xb4b7bc,
          metalness: 0.85,
          roughness: 0.38
        });
        const mesh = new Three.Mesh(geometry, material);
        mesh.rotation.z = TILT;
        spinner.add(mesh);

        frameScrew();
        host.removeAttribute("data-loading");
        ready = true;
      },
      undefined,
      (err) => {
        host.setAttribute("data-loading", "Failed to load screw model");
        console.error(err);
      }
    );

    let raf = 0;
    const clock = new Three.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!isNear.current) {
        return;
      }
      const dt = clock.getDelta();
      if (ready && !reduceMotion) {
        spinner.rotation.y += dt * SPIN_SPEED;
      }
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
      draco.dispose();

      spinner.traverse((object) => {
        const mesh = object as Three.Mesh;
        if (!mesh.isMesh) {
          return;
        }
        mesh.geometry.dispose();
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const material of mats) {
          material.dispose();
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
