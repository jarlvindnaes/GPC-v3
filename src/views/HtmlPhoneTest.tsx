import { Environment, Float, Html, PresentationControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import * as Three from "three";
import { DppPhoneScreen } from "../components/dpp/DppPhoneScreen";

const IPHONE_MODEL = `${import.meta.env.BASE_URL}models/iphone_17_pro_max.glb`;
const STUDIO_HDR = `${import.meta.env.BASE_URL}hdri/studio_small_03_1k.hdr`;

function PhoneModel() {
  const { scene: originalScene } = useGLTF(IPHONE_MODEL);

  const { scene, offset, screenCenter, displayW } = useMemo(() => {
    const cloned = originalScene.clone(true);

    const displayCenter = new Three.Vector3();
    let dW = 0.36;
    cloned.traverse((child) => {
      if (child.name === "Display001_display_0" && (child as Three.Mesh).isMesh) {
        const box = new Three.Box3().setFromObject(child);
        box.getCenter(displayCenter);
        dW = box.getSize(new Three.Vector3()).x;
      }
    });

    cloned.traverse((child) => {
      if (child.name.includes("002")) {
        child.visible = false;
      }
      if (child.name === "Glass_over_display001_Glass_0" && (child as Three.Mesh).isMesh) {
        const mesh = child as Three.Mesh;
        const mat = mesh.material as Three.MeshPhysicalMaterial;
        mat.transmission = 0;
        mat.transparent = false;
        mat.opacity = 1;
        mat.color = new Three.Color(0x000000);
        mat.roughness = 0.3;
        mat.metalness = 0;
        mat.depthWrite = false;
        mesh.renderOrder = 1;
      }
      if (child.name === "Display001_display_0" && (child as Three.Mesh).isMesh) {
        (child as Three.Mesh).material = new Three.MeshPhysicalMaterial({
          color: new Three.Color(0x000000),
          roughness: 1.0,
          metalness: 0,
          envMapIntensity: 0.0
        });
      }
    });

    const visibleBox = new Three.Box3();
    cloned.traverse((child) => {
      if ((child as Three.Mesh).isMesh && child.visible) {
        visibleBox.expandByObject(child);
      }
    });
    const center = visibleBox.getCenter(new Three.Vector3());

    return {
      scene: cloned,
      offset: [-center.x, -center.y, -center.z] as [number, number, number],
      screenCenter: [displayCenter.x, displayCenter.y, displayCenter.z + 0.003] as [number, number, number],
      displayW: dW
    };
  }, [originalScene]);

  return (
    <Float floatIntensity={0.3} rotationIntensity={0} speed={1.2}>
      <group position={offset}>
        <primitive object={scene} />
        <Html transform={true} position={screenCenter} distanceFactor={displayW * 1.09} center={true}>
          <div
            style={{
              width: 375,
              height: 812,
              overflow: "hidden",
              borderRadius: 62,
              background: "#fff"
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <DppPhoneScreen />
          </div>
        </Html>
      </group>
    </Float>
  );
}

export function HtmlPhoneTest() {
  return (
    <div style={{ width: "100%", height: "100vh", background: "#1e1e2e" }}>
      <Canvas camera={{ position: [0, 0, 3], fov: 34 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <spotLight position={[5, 10, 5]} angle={0.2} penumbra={1} intensity={2.5} color="#fff8f0" />
          <directionalLight position={[-3, 5, -3]} intensity={0.5} color="#c7d2fe" />
          <PresentationControls
            global={true}
            snap={false}
            rotation={[0.05, 0, 0]}
            polar={[-Math.PI / 6, Math.PI / 6]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
          >
            <PhoneModel />
          </PresentationControls>
          <Environment files={STUDIO_HDR} />
        </Suspense>
      </Canvas>
    </div>
  );
}
