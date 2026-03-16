import { ContactShadows, Environment, Float, Html, PresentationControls, useGLTF, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { BookOpen, Globe, QrCode, Recycle, Wrench } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as Three from "three";
import { useIsNearViewport } from "../utilities/useIsNearViewport";
import { DppApp } from "./dpp/DppApp";
import { WebsiteButton } from "./WebsiteButton";

/**
 * Drives rendering for a demand-mode Canvas. Uses its own rAF loop to call
 * invalidate() only when the canvas should be active. When inactive, nothing
 * calls invalidate, so the Canvas does zero GPU work - no useFrame callbacks
 * run, no scene renders, drei's Float/PresentationControls are fully paused.
 */
export function RenderController({ isActive }: { isActive: React.RefObject<boolean> }) {
  const invalidate = useThree((state) => state.invalidate);

  // biome-ignore lint/correctness/useExhaustiveDependencies: isActive is a stable ref read inside rAF
  useEffect(() => {
    let animationFrameId: number;
    const loop = () => {
      animationFrameId = requestAnimationFrame(loop);
      if (isActive.current) {
        invalidate();
      }
    };
    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [invalidate]);

  return null;
}

export const CHAIR_MODEL = `${import.meta.env.BASE_URL}models/west_elm_slope_leather_chair.glb`;
const CHAIR_WIREFRAME_MODEL = `${import.meta.env.BASE_URL}models/chair-wireframe.glb`;
const BOLT_MODEL = `${import.meta.env.BASE_URL}models/bolt_m10x25_hexagon_head (1).glb`;
const EMERALD_MODEL = `${import.meta.env.BASE_URL}models/emerald_in_quartz__for_games.glb`;
const IPHONE_MODEL = `${import.meta.env.BASE_URL}models/iphone_17_pro_max.glb`;
export const STUDIO_HDR = `${import.meta.env.BASE_URL}hdri/studio_small_03_1k.hdr`;
const PASSPORT_PHONE_VIDEO = `${import.meta.env.BASE_URL}videos/passport-demo.mp4`;

function CustomRockModel({ isActiveReference }: { isActiveReference: React.RefObject<boolean> }) {
  const { scene } = useGLTF(EMERALD_MODEL);
  const mesh = useRef<Three.Group>(null);
  useFrame(() => {
    if (!isActiveReference.current || !mesh.current) {
      return;
    }
    mesh.current.rotation.y += 0.003;
  });
  return (
    <Float floatIntensity={0.4} rotationIntensity={0} speed={1.2}>
      <group ref={mesh}>
        <primitive object={scene} scale={1.035} />
      </group>
    </Float>
  );
}

function BoltModel({ isActiveReference }: { isActiveReference: React.RefObject<boolean> }) {
  const { scene } = useGLTF(BOLT_MODEL);
  const mesh = useRef<Three.Group>(null);
  useFrame(() => {
    if (!isActiveReference.current || !mesh.current) {
      return;
    }
    mesh.current.rotation.y += 0.003;
  });
  return (
    <Float floatIntensity={0.3} rotationIntensity={0} speed={1.5}>
      <group ref={mesh} position={[0, 0.2, 0]} rotation={[Math.PI / 5, 0, 0]} scale={14}>
        <primitive object={scene} />
      </group>
    </Float>
  );
}

export function RawMaterialCanvas({ isActiveReference }: { isActiveReference?: React.RefObject<boolean> }) {
  const containerReference = useRef<HTMLDivElement>(null);
  const internalNearReference = useIsNearViewport(containerReference);
  const effectiveReference = isActiveReference ?? internalNearReference;

  return (
    <div
      ref={containerReference}
      role="img"
      aria-label="3D raw material model viewer"
      className="h-full w-full touch-pan-y cursor-grab active:cursor-grabbing lg:touch-auto"
    >
      <Canvas
        frameloop="demand"
        camera={{ position: [0, 0.5, 5], fov: 38 }}
        gl={{ alpha: true }}
        style={{ background: "transparent" }}
      >
        <RenderController isActive={effectiveReference} />
        <ambientLight intensity={0.7} />
        <spotLight position={[8, 12, 8]} angle={0.2} penumbra={1} intensity={2.5} color="#fff8f0" />
        <directionalLight position={[-4, 6, -4]} intensity={0.6} color="#c7d2fe" />
        <PresentationControls
          global={true}
          snap={false}
          rotation={[0.1, -Math.PI / 4, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI, Math.PI]}
          config={{ mass: 4, tension: 120, friction: 40 }}
        >
          <group position={[0, -0.3, 0]} scale={1.31}>
            <CustomRockModel isActiveReference={effectiveReference} />
          </group>
        </PresentationControls>
        <ContactShadows position={[0, -1.5, 0]} opacity={0.3} scale={10} blur={3} far={5} />
        <Environment files={STUDIO_HDR} />
      </Canvas>
    </div>
  );
}

function AnimatedCamera({
  targetDistance,
  isActiveReference
}: {
  targetDistance: React.RefObject<number>;
  isActiveReference: React.RefObject<boolean>;
}) {
  const { camera } = useThree();
  useFrame(() => {
    if (!isActiveReference.current) {
      return;
    }
    const target = targetDistance.current;
    camera.position.z += (target - camera.position.z) * 0.1;
  });
  return null;
}

export function ComponentsCanvas({
  cameraDistanceRef,
  isActiveReference
}: {
  cameraDistanceRef?: React.RefObject<number>;
  isActiveReference?: React.RefObject<boolean>;
}) {
  const containerReference = useRef<HTMLDivElement>(null);
  const internalNearReference = useIsNearViewport(containerReference);
  const effectiveReference = isActiveReference ?? internalNearReference;
  const defaultDistance = useRef(5);
  const distanceRef = cameraDistanceRef ?? defaultDistance;

  return (
    <div
      ref={containerReference}
      role="img"
      aria-label="3D component model viewer"
      className="h-full w-full touch-pan-y cursor-grab active:cursor-grabbing lg:touch-auto"
    >
      <Canvas
        frameloop="demand"
        camera={{ position: [0, 0.5, 5], fov: 38 }}
        gl={{ alpha: true }}
        style={{ background: "transparent" }}
      >
        <RenderController isActive={effectiveReference} />
        <AnimatedCamera targetDistance={distanceRef} isActiveReference={effectiveReference} />
        <ambientLight intensity={0.7} />
        <spotLight position={[8, 12, 8]} angle={0.2} penumbra={1} intensity={3} color="#fff8f0" />
        <directionalLight position={[-4, 6, -4]} intensity={0.5} color="#c7d2fe" />
        <PresentationControls
          global={true}
          snap={false}
          rotation={[0.1, -Math.PI / 4, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI, Math.PI]}
          config={{ mass: 4, tension: 120, friction: 40 }}
        >
          <BoltModel isActiveReference={effectiveReference} />
        </PresentationControls>
        <ContactShadows position={[0, -1.2, 0]} opacity={0.3} scale={10} blur={3} far={5} />
        <Environment files={STUDIO_HDR} />
      </Canvas>
    </div>
  );
}

const wireframeLabelScale = 2.6 / 3.2;
const chairLabels: { label: string; position: [number, number, number]; dotColor: string }[] = [
  {
    label: "Legs",
    position: [0.8 * wireframeLabelScale, 0.15 * wireframeLabelScale, 0.6 * wireframeLabelScale],
    dotColor: "var(--color-brand-cyan)"
  },
  {
    label: "Seat",
    position: [1.2 * wireframeLabelScale, 1.2 * wireframeLabelScale, 1.0 * wireframeLabelScale],
    dotColor: "var(--color-brand-amber)"
  },
  {
    label: "Back",
    position: [0.0, 2.0 * wireframeLabelScale, -0.5 * wireframeLabelScale],
    dotColor: "var(--color-brand-violet)"
  }
];

function MouseLight({
  mouseRef,
  hoverRef,
  lightColor,
  isActiveReference
}: {
  mouseRef: React.RefObject<Three.Vector2>;
  hoverRef: React.RefObject<boolean>;
  lightColor: Three.Color;
  isActiveReference: React.RefObject<boolean>;
}) {
  const lightRef = useRef<Three.PointLight>(null);
  const targetPosition = useRef(new Three.Vector3(0, 0, 5));

  useFrame(() => {
    if (!isActiveReference.current || !lightRef.current) {
      return;
    }
    targetPosition.current.set(mouseRef.current.x * 2.5, mouseRef.current.y * 2 + 0.5, 0.5);
    lightRef.current.position.lerp(targetPosition.current, 0.15);
    const targetIntensity = hoverRef.current ? 6 : 0;
    lightRef.current.intensity = Three.MathUtils.lerp(lightRef.current.intensity, targetIntensity, 0.12);
  });

  return <pointLight ref={lightRef} intensity={0} distance={0} color={lightColor} />;
}

function WireframeChairModel({ isActiveReference }: { isActiveReference: React.RefObject<boolean> }) {
  const { scene } = useGLTF(CHAIR_WIREFRAME_MODEL);
  const { size } = useThree();
  const tooltipScale = Math.min(1, size.width / 480);
  const spinRef = useRef<Three.Group>(null);

  const wireScene = useMemo(() => {
    const brandLight = getComputedStyle(document.documentElement).getPropertyValue("--color-brand-light").trim();
    const wireColor = new Three.Color(brandLight || "#8B6FFF").lerp(new Three.Color(1, 1, 1), 0.25);
    const clone = scene.clone(true);

    const material = new Three.MeshStandardMaterial({
      wireframe: true,
      color: wireColor,
      emissive: wireColor,
      emissiveIntensity: 0.6,
      toneMapped: false,
      depthWrite: false
    });

    clone.traverse((child) => {
      if ((child as Three.Mesh).isMesh) {
        (child as Three.Mesh).material = material;
      }
    });
    return clone;
  }, [scene]);

  useFrame(() => {
    if (!isActiveReference.current || !spinRef.current) {
      return;
    }
    spinRef.current.rotation.y += 0.003;
  });

  return (
    <Float floatIntensity={0.3} rotationIntensity={0} speed={1.5}>
      <group ref={spinRef} position={[0, -0.6, 0]}>
        <primitive object={wireScene} scale={2.6} />
        {chairLabels.map((item) => (
          <Html key={item.label} position={item.position} center={true} zIndexRange={[0, 10]}>
            <div className="pointer-events-none select-none" style={{ transform: `scale(${tooltipScale})` }}>
              <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3.5 py-2.5 backdrop-blur-md">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.dotColor }} />
                <span className="whitespace-nowrap font-semibold text-[13px] text-white">{item.label}</span>
              </div>
            </div>
          </Html>
        ))}
      </group>
    </Float>
  );
}

export function FinishedProductCanvas({
  fieldOfView = 36,
  isActiveReference
}: {
  fieldOfView?: number;
  isActiveReference?: React.RefObject<boolean>;
}) {
  const containerReference = useRef<HTMLDivElement>(null);
  const internalNearReference = useIsNearViewport(containerReference);
  const effectiveReference = isActiveReference ?? internalNearReference;
  const mouseRef = useRef(new Three.Vector2(0, 0));
  const hoverRef = useRef(false);
  const lightColor = useMemo(() => {
    const brandLight = getComputedStyle(document.documentElement).getPropertyValue("--color-brand-light").trim();
    const color = new Three.Color(brandLight || "#8B6FFF");
    color.lerp(new Three.Color(1, 1, 1), 0.85);
    return color;
  }, []);

  return (
    <div
      ref={containerReference}
      role="img"
      aria-label="3D finished product model viewer"
      className="absolute inset-0 touch-pan-y cursor-grab active:cursor-grabbing lg:touch-auto"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        mouseRef.current.set(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          -((event.clientY - rect.top) / rect.height) * 2 + 1
        );
        hoverRef.current = true;
      }}
      onPointerLeave={() => {
        hoverRef.current = false;
      }}
    >
      <Canvas
        frameloop="demand"
        camera={{ position: [0, 0.7, 4], fov: fieldOfView }}
        gl={{ alpha: true }}
        style={{ background: "transparent" }}
      >
        <RenderController isActive={effectiveReference} />
        <ambientLight intensity={0.03} />
        <MouseLight
          mouseRef={mouseRef}
          hoverRef={hoverRef}
          lightColor={lightColor}
          isActiveReference={effectiveReference}
        />
        <PresentationControls
          global={true}
          snap={false}
          rotation={[0.08, -Math.PI / 4, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI, Math.PI]}
          config={{ mass: 4, tension: 120, friction: 40 }}
        >
          <WireframeChairModel isActiveReference={effectiveReference} />
        </PresentationControls>
      </Canvas>
    </div>
  );
}

function DppChairModel({ isActiveReference }: { isActiveReference: React.RefObject<boolean> }) {
  const { scene } = useGLTF(CHAIR_MODEL);
  const productScene = useMemo(() => scene.clone(), [scene]);
  const group = useRef<Three.Group>(null);
  useFrame(() => {
    if (!isActiveReference.current || !group.current) {
      return;
    }
    group.current.rotation.y += 0.002;
  });
  return (
    <Float floatIntensity={0.3} rotationIntensity={0} speed={1.5}>
      <group ref={group} position={[0, -0.3, 0]}>
        <primitive object={productScene} scale={3.2} />
      </group>
    </Float>
  );
}

const hotspots: { position: [number, number, number]; color: string; label: string }[] = [
  { position: [-1.0, 2.2, 1.0], color: "#6366f1", label: "Origin" },
  { position: [1.2, 0.8, 1.0], color: "#10b981", label: "Material" },
  { position: [0, 3.2, 0], color: "#f59e0b", label: "Frame" }
];

// ── iPhone Commerce ──────────────────────────────────────────────────────────

/**
 * Replace this image to change what's shown on the phone screen.
 * Recommended size: 720×1560px (portrait phone aspect ratio ≈ 1:2.17).
 */
const COMMERCE_SCREEN_IMAGE = `${import.meta.env.BASE_URL}images/commerce-screen02.jpg`;

export interface PhoneTooltip {
  label: string;
  position: [number, number, number];
  dotColor: string;
  side: "left" | "right";
}

export interface PhoneCameraConfig {
  small: { position: [number, number, number]; lookAt: [number, number, number] };
  large: { position: [number, number, number]; lookAt: [number, number, number] };
}

/** Glassmorphic tooltip bubble used by all phone canvas variants. */
function TooltipBubble({ tooltip, scale = 1 }: { tooltip: PhoneTooltip; scale?: number }) {
  return (
    <div className="pointer-events-none select-none" style={{ transform: `scale(${scale})` }}>
      <div
        className={`flex items-start gap-2 rounded-2xl border border-white/30 bg-white/20 px-3.5 py-2.5 backdrop-blur-md ${tooltip.side === "left" ? "flex-row-reverse" : ""}`}
      >
        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: tooltip.dotColor }} />
        <span className="min-w-[7rem] max-w-[16rem] font-semibold text-[13px] text-white leading-tight">
          {tooltip.label}
        </span>
      </div>
    </div>
  );
}

const commerceTooltips: PhoneTooltip[] = [
  {
    label: "Directly linked to ERP system",
    position: [-0.6, 0.6, 0],
    dotColor: "var(--color-brand-violet)",
    side: "left"
  },
  {
    label: "Use digital twin to locate parts",
    position: [-0.6, 0.4, 0],
    dotColor: "var(--color-brand-cyan)",
    side: "left"
  },
  {
    label: "Pay with any preferred method",
    position: [-0.22, -0.08, 0],
    dotColor: "var(--color-brand-amber)",
    side: "right"
  }
];

const commerceCameraConfig: PhoneCameraConfig = {
  small: { position: [0.15, -0.15, 0.5], lookAt: [0, -0.35, 0] },
  large: { position: [-0.9, -0.55, 1.2], lookAt: [-0.14, -0.12, 0] }
};

/** Adjusts camera zoom and vertical framing based on canvas size. */
function PhoneCameraRig({ config }: { config: PhoneCameraConfig }) {
  const { camera, size, invalidate } = useThree();

  useEffect(() => {
    const { position, lookAt } = size.height < 280 ? config.small : config.large;
    camera.position.set(...position);
    camera.lookAt(...lookAt);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size, invalidate, config]);

  return null;
}

function IphoneModel({ screenImage, tooltips }: { screenImage: string; tooltips: PhoneTooltip[] }) {
  const { scene: originalScene } = useGLTF(IPHONE_MODEL);
  const screenTexture = useTexture(screenImage);
  const { size } = useThree();
  const tooltipScale = Math.min(1, size.width / 480);

  // Process scene exactly once: clone, hide parts, remap UVs, apply material, center.
  // Using useMemo (not useEffect) prevents re-runs from flipping UVs back and forth.
  const { scene, offset } = useMemo(() => {
    const cloned = originalScene.clone(true);

    screenTexture.colorSpace = Three.SRGBColorSpace;
    screenTexture.flipY = true;

    // Hide the second phone copy (all 002 nodes).
    // Keep Glass_over_display001 visible - it seals the speaker grille holes at the bottom.
    // Ensure all remaining materials are DoubleSide (matches original model's doubleSided: true).
    cloned.traverse((child) => {
      if (child.name.includes("002")) {
        child.visible = false;
      }
      if ((child as Three.Mesh).isMesh) {
        const mat = (child as Three.Mesh).material as Three.MeshStandardMaterial;
        if (mat) {
          mat.side = Three.DoubleSide;
        }
      }
      // Glass overlay: make it opaque but don't write to depth buffer, so the display
      // (rendered after with higher renderOrder) paints over it on the screen area.
      // The glass still visually seals the speaker grille holes at the bottom edge.
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
        mat.blending = Three.NormalBlending;
        mesh.renderOrder = 1;
      }
      // Display renders after the glass so it paints over it
      if (child.name === "Display001_display_0" && (child as Three.Mesh).isMesh) {
        (child as Three.Mesh).renderOrder = 2;
      }
    });

    // Apply screen image to the display mesh, remapping UVs to span full [0,1].
    // The model's UVs are baked right-to-left so U is flipped to correct the mirror.
    cloned.traverse((child) => {
      if (child.name === "Display001_display_0" && (child as Three.Mesh).isMesh) {
        const mesh = child as Three.Mesh;
        const geo = (mesh.geometry as Three.BufferGeometry).clone();
        mesh.geometry = geo;
        const uv = geo.getAttribute("uv");
        if (uv) {
          let minU = Infinity;
          let maxU = -Infinity;
          let minV = Infinity;
          let maxV = -Infinity;
          for (let i = 0; i < uv.count; i++) {
            minU = Math.min(minU, uv.getX(i));
            maxU = Math.max(maxU, uv.getX(i));
            minV = Math.min(minV, uv.getY(i));
            maxV = Math.max(maxV, uv.getY(i));
          }
          const rangeU = maxU - minU || 1;
          const rangeV = maxV - minV || 1;
          for (let i = 0; i < uv.count; i++) {
            uv.setX(i, 1.0 - (uv.getX(i) - minU) / rangeU);
            uv.setY(i, (uv.getY(i) - minV) / rangeV);
          }
          uv.needsUpdate = true;
        }
        mesh.material = new Three.MeshPhysicalMaterial({
          color: new Three.Color(0x000000),
          emissive: new Three.Color(0xffffff),
          emissiveMap: screenTexture,
          emissiveIntensity: 1.0,
          roughness: 1.0,
          metalness: 0,
          clearcoat: 0.15,
          clearcoatRoughness: 0.1,
          envMapIntensity: 0.0,
          toneMapped: false
        });
      }
    });

    // Compute bounding box of visible meshes to center the phone
    const visibleBox = new Three.Box3();
    cloned.traverse((child) => {
      if ((child as Three.Mesh).isMesh && child.visible) {
        visibleBox.expandByObject(child);
      }
    });
    const center = visibleBox.getCenter(new Three.Vector3());

    return {
      scene: cloned,
      offset: [-center.x, -center.y, -center.z] as [number, number, number]
    };
  }, [originalScene, screenTexture]);

  return (
    <Float floatIntensity={0.3} rotationIntensity={0} speed={1.2}>
      <group position={offset}>
        <primitive object={scene} />
        {tooltips.map((item) => (
          <Html key={item.label} position={item.position} center={true} zIndexRange={[0, 10]}>
            <div className="pointer-events-none select-none" style={{ transform: `scale(${tooltipScale})` }}>
              <div
                className={`flex items-start gap-2 rounded-2xl border border-white/30 bg-white/20 px-3.5 py-2.5 backdrop-blur-md ${item.side === "left" ? "flex-row-reverse" : ""}`}
              >
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.dotColor }} />
                <span className="min-w-[7rem] max-w-[16rem] font-semibold text-[13px] text-white leading-tight">
                  {item.label}
                </span>
              </div>
            </div>
          </Html>
        ))}
      </group>
    </Float>
  );
}

export interface IphoneCanvasProps {
  screenImage: string;
  tooltips: PhoneTooltip[];
  cameraConfig: PhoneCameraConfig;
  ariaLabel?: string;
  /** Extra elements rendered inside PresentationControls (move with the phone on drag). */
  children?: React.ReactNode;
}

export function IphoneCanvas({
  screenImage,
  tooltips,
  cameraConfig,
  ariaLabel = "3D iPhone",
  children
}: IphoneCanvasProps) {
  const containerReference = useRef<HTMLDivElement>(null);
  const isNearReference = useIsNearViewport(containerReference);

  return (
    <div
      ref={containerReference}
      role="img"
      aria-label={ariaLabel}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
    >
      <Canvas
        frameloop="demand"
        camera={{ position: [0, 0, 1.8], fov: 34 }}
        gl={{ alpha: true }}
        style={{ background: "transparent" }}
      >
        <PhoneCameraRig config={cameraConfig} />
        <RenderController isActive={isNearReference} />
        <ambientLight intensity={0.8} />
        <spotLight position={[5, 10, 5]} angle={0.2} penumbra={1} intensity={2.5} color="#fff8f0" />
        <directionalLight position={[-3, 5, -3]} intensity={0.5} color="#c7d2fe" />
        <PresentationControls
          global={true}
          snap={false}
          rotation={[0.05, 0, 0]}
          polar={[-Math.PI / 6, Math.PI / 6]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
          config={{ mass: 4, tension: 120, friction: 40 }}
        >
          <IphoneModel screenImage={screenImage} tooltips={tooltips} />
          {children}
        </PresentationControls>
        <Environment files={STUDIO_HDR} />
      </Canvas>
    </div>
  );
}

export function IphoneCommerceCanvas() {
  return (
    <IphoneCanvas
      screenImage={COMMERCE_SCREEN_IMAGE}
      tooltips={commerceTooltips}
      cameraConfig={commerceCameraConfig}
      ariaLabel="3D iPhone with spare parts shop"
    />
  );
}

// ── iPhone Video (Passport hover phone) ─────────────────────────────────────

/** Creates a VideoTexture from a <video> element without Suspense.
 *  If the video fails to load (404), the phone still renders with a black screen. */
function useManualVideoTexture(src: string) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const textureRef = useRef<Three.VideoTexture | null>(null);

  if (!videoRef.current) {
    const video = document.createElement("video");
    video.src = src;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";
    video.crossOrigin = "anonymous";
    videoRef.current = video;

    const tex = new Three.VideoTexture(video);
    tex.colorSpace = Three.SRGBColorSpace;
    tex.flipY = true;
    textureRef.current = tex;
  }

  useEffect(() => {
    return () => {
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
      textureRef.current?.dispose();
    };
  }, []);

  return { video: videoRef.current, texture: textureRef.current as Three.VideoTexture };
}

function IphoneVideoModel({ videoSrc, isPlaying }: { videoSrc: string; isPlaying: boolean }) {
  const { scene: originalScene } = useGLTF(IPHONE_MODEL);
  const { video, texture: videoTexture } = useManualVideoTexture(videoSrc);

  // Play / pause based on hover state
  useEffect(() => {
    if (isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlaying, video]);

  const { scene, offset } = useMemo(() => {
    const cloned = originalScene.clone(true);

    // Hide the second phone copy (all 002 nodes).
    cloned.traverse((child) => {
      if (child.name.includes("002")) {
        child.visible = false;
      }
      if ((child as Three.Mesh).isMesh) {
        const mat = (child as Three.Mesh).material as Three.MeshStandardMaterial;
        if (mat) {
          mat.side = Three.DoubleSide;
        }
      }
      // Glass overlay
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
        mat.blending = Three.NormalBlending;
        mesh.renderOrder = 1;
      }
      if (child.name === "Display001_display_0" && (child as Three.Mesh).isMesh) {
        (child as Three.Mesh).renderOrder = 2;
      }
    });

    // Apply video texture to the display mesh, remapping UVs to span full [0,1].
    cloned.traverse((child) => {
      if (child.name === "Display001_display_0" && (child as Three.Mesh).isMesh) {
        const mesh = child as Three.Mesh;
        const geo = (mesh.geometry as Three.BufferGeometry).clone();
        mesh.geometry = geo;
        const uv = geo.getAttribute("uv");
        if (uv) {
          let minU = Infinity;
          let maxU = -Infinity;
          let minV = Infinity;
          let maxV = -Infinity;
          for (let i = 0; i < uv.count; i++) {
            minU = Math.min(minU, uv.getX(i));
            maxU = Math.max(maxU, uv.getX(i));
            minV = Math.min(minV, uv.getY(i));
            maxV = Math.max(maxV, uv.getY(i));
          }
          const rangeU = maxU - minU || 1;
          const rangeV = maxV - minV || 1;
          for (let i = 0; i < uv.count; i++) {
            uv.setX(i, 1.0 - (uv.getX(i) - minU) / rangeU);
            uv.setY(i, (uv.getY(i) - minV) / rangeV);
          }
          uv.needsUpdate = true;
        }
        mesh.material = new Three.MeshPhysicalMaterial({
          color: new Three.Color(0x000000),
          emissive: new Three.Color(0xffffff),
          emissiveMap: videoTexture,
          emissiveIntensity: 1.0,
          roughness: 1.0,
          metalness: 0,
          clearcoat: 0.15,
          clearcoatRoughness: 0.1,
          envMapIntensity: 0.0,
          toneMapped: false
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
      offset: [-center.x, -center.y, -center.z] as [number, number, number]
    };
  }, [originalScene, videoTexture]);

  return (
    <Float floatIntensity={0.3} rotationIntensity={0} speed={1.2}>
      <group position={offset}>
        <primitive object={scene} />
      </group>
    </Float>
  );
}

// ── iPhone HTML Screen ───────────────────────────────────────────────────────
//
// Renders live HTML/CSS/JS on the 3D phone screen using a manual screen-space
// projection with a CSS matrix3d homography.  This avoids drei's CSS3D
// preserve-3d chain which triggers a Chrome compositing bug that causes content
// to render at incorrect positions at certain viewport sizes.
//
// How it works:
//   1. Four 3D corners of the display mesh are projected to 2D screen coords
//      every frame via THREE.js camera projection.
//   2. A perspective homography matrix is computed that maps the 375×812 CSS
//      content rectangle onto the projected quadrilateral.
//   3. The homography is converted to a CSS matrix3d() and applied directly
//      to an absolutely-positioned overlay div — no preserve-3d needed.

const PHONE_SCREEN_WIDTH = 375;
const PHONE_SCREEN_HEIGHT = 812;

// Reusable vectors — avoid allocations inside the render loop
const _v = new Three.Vector3();
const _camPos = new Three.Vector3();
const _camDir = new Three.Vector3();

/**
 * Compute a CSS matrix3d that maps a (0,0)→(w,h) rectangle to a screen-space
 * quadrilateral defined by four projected corner points.
 *
 * Corner order: TL(x0,y0)  TR(x1,y1)  BR(x2,y2)  BL(x3,y3)
 */
function computeHomographyMatrix3d(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  w: number,
  h: number
): string {
  // Standard rectangle-to-quadrilateral homography derivation
  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const sx = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2;
  const dy2 = y3 - y2;
  const sy = y0 - y1 + y2 - y3;

  const det = dx1 * dy2 - dx2 * dy1;
  if (Math.abs(det) < 1e-10) {
    // Near-degenerate quad — return identity
    return "matrix3d(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1)";
  }

  const g = (sx * dy2 - dx2 * sy) / det;
  const hh = (dx1 * sy - sx * dy1) / det;

  // Homography for unit square → quad  (3×3)
  const a = x1 - x0 + g * x1;
  const b = x3 - x0 + hh * x3;
  const c = x0;
  const d = y1 - y0 + g * y1;
  const e = y3 - y0 + hh * y3;
  const f = y0;

  // Scale from [0,w]×[0,h] → [0,1]×[0,1] by dividing row entries
  const aw = a / w;
  const bh = b / h;
  const dw = d / w;
  const eh = e / h;
  const gw = g / w;
  const hh2 = hh / h;

  // Embed 3×3 homography into 4×4 (column-major for CSS matrix3d)
  //   | aw  bh  0  c |        CSS column-major:
  //   | dw  eh  0  f |        matrix3d(m00,m10,m20,m30, m01,m11,m21,m31, ...)
  //   | 0   0   1  0 |
  //   | gw  hh2 0  1 |
  return `matrix3d(${aw},${dw},0,${gw}, ${bh},${eh},0,${hh2}, 0,0,1,0, ${c},${f},0,1)`;
}

/**
 * Runs inside the R3F Canvas.  Every frame it projects the four corners of the
 * phone display to screen coordinates, computes a perspective-correct CSS
 * matrix3d, and applies it directly to the DOM overlay element.
 */
function ScreenProjector({
  screenGroupRef,
  overlayRef,
  halfW,
  halfH
}: {
  screenGroupRef: React.RefObject<Three.Group | null>;
  overlayRef: React.RefObject<HTMLDivElement | null>;
  /** Half-width of the display mesh in 3D units */
  halfW: number;
  /** Half-height of the display mesh in 3D units */
  halfH: number;
}) {
  const { camera, size } = useThree();

  // Local corner offsets (relative to the display centre group)
  // Order: TL, TR, BR, BL  (Y+ = up in 3D, maps to top of screen)
  const corners = useMemo(
    () => [
      new Three.Vector3(-halfW, +halfH, 0), // TL
      new Three.Vector3(+halfW, +halfH, 0), // TR
      new Three.Vector3(+halfW, -halfH, 0), // BR
      new Three.Vector3(-halfW, -halfH, 0) // BL
    ],
    [halfW, halfH]
  );

  useFrame(() => {
    const group = screenGroupRef.current;
    const overlay = overlayRef.current;
    if (!group || !overlay) {
      return;
    }

    camera.updateMatrixWorld();
    group.updateWorldMatrix(true, false);

    // Check if display centre is behind the camera
    _v.setFromMatrixPosition(group.matrixWorld);
    _camPos.setFromMatrixPosition(camera.matrixWorld);
    camera.getWorldDirection(_camDir);
    const delta = _v.clone().sub(_camPos);
    if (delta.dot(_camDir) <= 0) {
      overlay.style.display = "none";
      return;
    }
    overlay.style.display = "block";

    // Project four corners to screen coordinates
    const projected: [number, number][] = [];
    for (const corner of corners) {
      _v.copy(corner).applyMatrix4(group.matrixWorld);
      _v.project(camera);
      projected.push([(_v.x * 0.5 + 0.5) * size.width, (-_v.y * 0.5 + 0.5) * size.height]);
    }

    const [tl, tr, br, bl] = projected;

    // Compute CSS matrix3d from content rect → projected quad
    const matrix = computeHomographyMatrix3d(
      tl[0],
      tl[1],
      tr[0],
      tr[1],
      br[0],
      br[1],
      bl[0],
      bl[1],
      PHONE_SCREEN_WIDTH,
      PHONE_SCREEN_HEIGHT
    );

    overlay.style.transform = matrix;
  });

  return null;
}

// ── iPhone HTML (live React content on the phone screen) ─────────────────────

function IphoneHtmlModel({ overlayRef }: { overlayRef: React.RefObject<HTMLDivElement | null> }) {
  const { scene: originalScene } = useGLTF(IPHONE_MODEL);
  const screenGroupRef = useRef<Three.Group>(null);

  const { scene, offset, screenCenter, halfW, halfH } = useMemo(() => {
    const cloned = originalScene.clone(true);

    // Read display mesh centre and dimensions before modifying materials
    const displayCenter = new Three.Vector3();
    let displayW = 0.36; // fallback
    let displayH = 0.787; // fallback
    cloned.traverse((child) => {
      if (child.name === "Display001_display_0" && (child as Three.Mesh).isMesh) {
        const box = new Three.Box3().setFromObject(child);
        box.getCenter(displayCenter);
        const sz = box.getSize(new Three.Vector3());
        displayW = sz.x;
        displayH = sz.y;
      }
    });

    // Hide the second phone copy (all 002 nodes).
    cloned.traverse((child) => {
      if (child.name.includes("002")) {
        child.visible = false;
      }
      if ((child as Three.Mesh).isMesh) {
        const mat = (child as Three.Mesh).material as Three.MeshStandardMaterial;
        if (mat) {
          mat.side = Three.DoubleSide;
        }
      }
      // Glass overlay — solid black, same treatment as IphoneVideoModel.
      // The HTML overlay is a CSS layer on top of the canvas, so the glass
      // doesn't block it. Keeping it opaque prevents see-through holes.
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
        mat.blending = Three.NormalBlending;
        mesh.renderOrder = 1;
      }
      // Display — black backing surface behind the HTML overlay
      if (child.name === "Display001_display_0" && (child as Three.Mesh).isMesh) {
        const mesh = child as Three.Mesh;
        mesh.material = new Three.MeshPhysicalMaterial({
          color: new Three.Color(0x000000),
          roughness: 1.0,
          metalness: 0,
          envMapIntensity: 0.0
        });
      }
    });

    // Center the model
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
      // Display centre, nudged forward (+Z) so HTML sits in front of backing
      screenCenter: [displayCenter.x, displayCenter.y, displayCenter.z + 0.003] as [number, number, number],
      halfW: displayW / 2,
      halfH: displayH / 2
    };
  }, [originalScene]);

  return (
    <Float floatIntensity={0.3} rotationIntensity={0} speed={1.2}>
      <group position={offset}>
        <primitive object={scene} />
        {/* Invisible group at display centre — ScreenProjector reads its
             matrixWorld to project the four display corners each frame. */}
        <group ref={screenGroupRef} position={screenCenter} />
      </group>
      <ScreenProjector screenGroupRef={screenGroupRef} overlayRef={overlayRef} halfW={halfW} halfH={halfH} />
    </Float>
  );
}

/**
 * Renders a 3D iPhone with live HTML/CSS/JS content projected onto the screen
 * via 4-corner homography (CSS matrix3d).  Pass any React tree as children and
 * it will appear on the phone display, tracking rotation and perspective.
 *
 * When `isPlaying` is provided, the camera animates from an orbited position to
 * front-on (reusing `PassportPhoneCameraRig`) and rendering is gated to that
 * prop.  When omitted (e.g. on the test page) the phone renders immediately.
 *
 * Uses `frameloop="demand"` + `RenderController` (same pattern as every other
 * canvas in this file) for StrictMode-safe rendering.
 */
/** Formats a Date into a 12-hour clock string like "9:41" (no leading zero, no AM/PM). */
function formatStatusBarTime(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

/** Live clock that updates every minute, styled to match the iPhone status bar. */
function LiveClock({ color }: { color: string }) {
  const [time, setTime] = useState(() => formatStatusBarTime(new Date()));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatStatusBarTime(new Date()));
    const now = new Date();
    const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    const timeout = setTimeout(() => {
      tick();
      intervalRef.current = setInterval(tick, 60_000);
    }, msUntilNextMinute);
    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <span
      style={{
        position: "absolute",
        top: 17,
        left: 35,
        fontFamily: '"SF Pro Text", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
        fontWeight: 600,
        fontSize: 15,
        color,
        zIndex: 11,
        pointerEvents: "none",
        lineHeight: 1,
        letterSpacing: 0,
      }}
    >
      {time}
    </span>
  );
}

/** Right-side iPhone status bar icons (cellular, WiFi, battery) as inline SVG with configurable color. */
function StatusBarIcons({ color }: { color: string }) {
  return (
    <svg
      width="213"
      height="19"
      viewBox="0 0 213 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "absolute",
        top: 10,
        left: "50%",
        transform: "translateX(-50%)",
        width: "88%",
        height: "auto",
        zIndex: 11,
        pointerEvents: "none",
      }}
    >
      <g transform="translate(-8, 0)">
        {/* Battery outline */}
        <path
          opacity="0.35"
          d="M197.84 5.2923H208.313C209.693 5.29232 210.813 6.4116 210.813 7.7923V10.3577C210.813 11.7384 209.693 12.8577 208.313 12.8577H197.84C196.459 12.8577 195.34 11.7384 195.34 10.3577V7.7923C195.34 6.41159 196.459 5.2923 197.84 5.2923Z"
          stroke={color}
        />
        {/* Battery nub */}
        <path
          opacity="0.4"
          d="M211.972 8.08679V10.8676C212.531 10.6321 212.895 10.0842 212.895 9.47719C212.895 8.87019 212.531 8.32231 211.972 8.08679Z"
          fill={color}
        />
        {/* Battery fill */}
        <path
          d="M196.158 8.11011C196.158 7.00554 197.053 6.11011 198.158 6.11011H205.359C206.464 6.11011 207.359 7.00554 207.359 8.11011V10.0403C207.359 11.1448 206.464 12.0402 205.359 12.0402H198.158C197.053 12.0402 196.158 11.1448 196.158 10.0402V8.11011Z"
          fill={color}
        />
        {/* WiFi */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M183.056 11.3284C183.991 10.5207 185.361 10.5207 186.297 11.3284C186.344 11.3717 186.372 11.4327 186.373 11.4973C186.374 11.5621 186.349 11.6248 186.304 11.6702L184.839 13.179C184.796 13.2232 184.738 13.2482 184.677 13.2483C184.616 13.2483 184.557 13.2233 184.514 13.179L183.049 11.6702C183.003 11.6248 182.978 11.5621 182.979 11.4973C182.981 11.4328 183.009 11.3717 183.056 11.3284ZM181.075 9.52272C183.091 7.60887 186.212 7.60887 188.227 9.52272C188.273 9.5676 188.299 9.62905 188.3 9.69362C188.3 9.758 188.276 9.81977 188.231 9.8655L187.385 10.7395C187.297 10.8287 187.156 10.8303 187.066 10.7434C186.404 10.1317 185.543 9.79318 184.65 9.79323C183.758 9.7937 182.898 10.1321 182.236 10.7434C182.147 10.8302 182.006 10.8285 181.919 10.7395L181.072 9.8655C181.028 9.81981 181.002 9.7581 181.003 9.69362C181.003 9.62914 181.03 9.56758 181.075 9.52272ZM179.097 7.71901C182.188 4.69484 187.066 4.69495 190.157 7.71901C190.202 7.76394 190.227 7.82584 190.227 7.88991C190.228 7.95387 190.203 8.01542 190.159 8.06081L189.311 8.93386C189.224 9.02349 189.082 9.02503 188.993 8.93679C187.815 7.79381 186.252 7.15659 184.627 7.15651C183.002 7.15662 181.439 7.79376 180.261 8.93679C180.172 9.02509 180.031 9.02351 179.943 8.93386L179.095 8.06081C179.051 8.0154 179.026 7.95385 179.026 7.88991C179.027 7.82584 179.052 7.76391 179.097 7.71901Z"
          fill={color}
        />
        {/* Cellular bars */}
        <path
          d="M168.484 7.42789C168.484 7.06398 168.779 6.76898 169.143 6.76898H169.802C170.166 6.76898 170.461 7.06398 170.461 7.42789V12.6991C170.461 13.063 170.166 13.358 169.802 13.358H169.143C168.779 13.358 168.484 13.063 168.484 12.6991V7.42789Z"
          fill={color}
        />
        <path
          d="M171.778 6.11008C171.778 5.74617 172.073 5.45117 172.437 5.45117H173.096C173.46 5.45117 173.755 5.74617 173.755 6.11008V12.6991C173.755 13.063 173.46 13.358 173.096 13.358H172.437C172.073 13.358 171.778 13.063 171.778 12.6991V6.11008Z"
          fill={color}
        />
        <path
          d="M165.189 9.73405C165.189 9.37015 165.484 9.07515 165.848 9.07515H166.507C166.871 9.07515 167.166 9.37015 167.166 9.73405V12.6991C167.166 13.063 166.871 13.358 166.507 13.358H165.848C165.484 13.358 165.189 13.063 165.189 12.6991V9.73405Z"
          fill={color}
        />
        <path
          d="M161.895 11.3813C161.895 11.0174 162.19 10.7224 162.554 10.7224H163.213C163.576 10.7224 163.871 11.0174 163.871 11.3813V12.6991C163.871 13.063 163.576 13.358 163.213 13.358H162.554C162.19 13.358 161.895 13.063 161.895 12.6991V11.3813Z"
          fill={color}
        />
      </g>
    </svg>
  );
}

export function HtmlPhoneCanvas({
  children,
  isPlaying,
  statusBarStyle = "light",
  noChrome = false,
  resetKey = 0,
  rotation = [0.05, 0, 0],
}: {
  children: React.ReactNode;
  isPlaying?: boolean;
  /** "light" = white icons/clock (for dark backgrounds), "dark" = dark icons/clock (for light backgrounds) */
  statusBarStyle?: "light" | "dark";
  /** When true, skip rendering the built-in status bar chrome (Dynamic Island, clock, icons).
   *  Use this when children already include their own phone chrome (e.g. DppPhoneScreen). */
  noChrome?: boolean;
  /** Change this value to force-reset the 3D phone rotation back to default (remounts PresentationControls). */
  resetKey?: number;
  /** Default rotation for the 3D phone [x, y, z]. Use a Y value > 0 to show it from the side. */
  rotation?: [number, number, number];
}) {
  const statusBarColor = statusBarStyle === "light" ? "#E8E8E8" : "#1B1B1B";
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const isNearRef = useIsNearViewport(containerRef);

  // When isPlaying is provided, gate rendering on it; otherwise use viewport visibility
  const hasPlayingProp = isPlaying !== undefined;
  const isActiveRef = useRef(false);
  isActiveRef.current = hasPlayingProp ? isPlaying : true;
  const effectiveActiveRef = hasPlayingProp ? (isActiveRef as React.RefObject<boolean>) : isNearRef;

  // Camera: start orbited when isPlaying is used, front-on otherwise
  const cameraPosition = hasPlayingProp ? PHONE_CAM_START : PHONE_CAM_END;

  // Trap wheel events inside the phone overlay so scroll never leaks to the main page.
  // React's onWheel stopPropagation is not enough — the browser's native scroll chaining
  // still fires when the inner scroll container hits a boundary. We need a native listener
  // with { passive: false } so we can call preventDefault() at the boundary.
  const phoneContentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = phoneContentRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
      // Find the scrollable child (DppApp scroll container)
      const scroller = el.querySelector<HTMLElement>("[data-phone-scroll]") ?? el;
      const { scrollTop, scrollHeight, clientHeight } = scroller;
      const atTop = scrollTop <= 0 && e.deltaY < 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0;
      if (atTop || atBottom) {
        e.preventDefault();
      }
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="3D iPhone with interactive content"
      className="relative h-full w-full cursor-grab active:cursor-grabbing overflow-hidden"
    >
      <Canvas
        frameloop="demand"
        camera={{ position: cameraPosition, fov: 30 }}
        gl={{ alpha: true }}
        style={{ background: "transparent" }}
      >
        {hasPlayingProp && <PassportPhoneCameraRig isPlaying={isPlaying} />}
        <RenderController isActive={effectiveActiveRef} />
        <ambientLight intensity={0.8} />
        <spotLight position={[5, 10, 5]} angle={0.2} penumbra={1} intensity={2.5} color="#fff8f0" />
        <directionalLight position={[-3, 5, -3]} intensity={0.5} color="#c7d2fe" />
        <PresentationControls
          key={resetKey}
          global={true}
          snap={false}
          rotation={rotation}
          polar={[-Math.PI / 6, Math.PI / 6]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
          config={{ mass: 4, tension: 120, friction: 40 }}
        >
          <IphoneHtmlModel overlayRef={overlayRef} />
        </PresentationControls>
        <Environment files={STUDIO_HDR} />
      </Canvas>

      {/* HTML overlay — positioned via 4-corner homography projection.
           A CSS matrix3d maps the content rect onto the projected display
           quadrilateral each frame.  No preserve-3d = no Chrome CSS3D bug. */}
      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transformOrigin: "0 0",
          pointerEvents: "none",
          display: "none",
          willChange: "transform",
        }}
      >
        <div
          ref={phoneContentRef}
          style={{
            width: PHONE_SCREEN_WIDTH,
            height: PHONE_SCREEN_HEIGHT,
            overflow: "hidden",
            borderRadius: 62,
            background: "#000",
            pointerEvents: "auto",
            userSelect: "none",
            WebkitUserSelect: "none",
            position: "relative"
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {children}
          {!noChrome && (
            <>
              {/* iPhone status bar: Dynamic Island (always dark SVG) + colorable icons & clock */}
              <img
                src={`${import.meta.env.BASE_URL}images/top-chrome.svg`}
                alt=""
                draggable={false}
                style={{
                  position: "absolute",
                  top: 10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "88%",
                  height: "auto",
                  zIndex: 10,
                  pointerEvents: "none",
                }}
              />
              <StatusBarIcons color={statusBarColor} />
              <LiveClock color={statusBarColor} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Camera position: front-on (end state)
const PHONE_CAM_END: [number, number, number] = [0, 0, 1.8];
// Camera position: orbited to the right (start state)
const PHONE_CAM_START: [number, number, number] = [1.6, 0, 2.6];

/** Smoothly lerps the camera from the orbited start position to the front end position. */
function PassportPhoneCameraRig({ isPlaying }: { isPlaying: boolean }) {
  const { camera, invalidate } = useThree();
  const progress = useRef(0);
  const target = useRef(isPlaying ? 1 : 0);
  target.current = isPlaying ? 1 : 0;

  useFrame(() => {
    const prev = progress.current;
    progress.current += (target.current - progress.current) * 0.06;

    // Stop updating once settled
    if (Math.abs(progress.current - prev) < 0.0001) {
      return;
    }

    const t = progress.current;
    camera.position.set(
      PHONE_CAM_START[0] + (PHONE_CAM_END[0] - PHONE_CAM_START[0]) * t,
      PHONE_CAM_START[1] + (PHONE_CAM_END[1] - PHONE_CAM_START[1]) * t,
      PHONE_CAM_START[2] + (PHONE_CAM_END[2] - PHONE_CAM_START[2]) * t
    );
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    invalidate();
  });

  return null;
}

function PassportPhoneCanvas({ isPlaying }: { isPlaying: boolean }) {
  const isActiveRef = useRef(false);
  isActiveRef.current = isPlaying;

  return (
    <Canvas
      frameloop="demand"
      camera={{ position: PHONE_CAM_START, fov: 34 }}
      gl={{ alpha: true }}
      style={{ background: "transparent" }}
    >
      <PassportPhoneCameraRig isPlaying={isPlaying} />
      <RenderController isActive={isActiveRef as React.RefObject<boolean>} />
      <ambientLight intensity={0.8} />
      <spotLight position={[5, 10, 5]} angle={0.2} penumbra={1} intensity={2.5} color="#fff8f0" />
      <directionalLight position={[-3, 5, -3]} intensity={0.5} color="#c7d2fe" />
      <PresentationControls
        global={true}
        snap={false}
        rotation={[0.05, 0, 0]}
        polar={[-Math.PI / 8, Math.PI / 8]}
        azimuth={[-Math.PI / 6, Math.PI / 6]}
        config={{ mass: 4, tension: 120, friction: 40 }}
      >
        <IphoneVideoModel videoSrc={PASSPORT_PHONE_VIDEO} isPlaying={isPlaying} />
      </PresentationControls>
      <Environment files={STUDIO_HDR} />
    </Canvas>
  );
}

// ── iPhone DPP ──────────────────────────────────────────────────────────────

const DPP_SCREEN_IMAGE = `${import.meta.env.BASE_URL}images/DPP-screen01.jpg`;

const dppTooltips: PhoneTooltip[] = [
  {
    label: "ESPR-compliant digital passport",
    position: [-0.6, 0.85, 0],
    dotColor: "var(--color-brand-cyan)",
    side: "left"
  },
  {
    label: "Full lifecycle impact data",
    position: [-0.6, 0.65, 0],
    dotColor: "var(--color-brand-emerald)",
    side: "left"
  },
  {
    label: "Matches your brand",
    position: [-0.1, -0.1, 0],
    dotColor: "var(--color-brand-amber)",
    side: "right"
  }
];

const dppCameraConfig: PhoneCameraConfig = {
  small: { position: [0.15, 0.48, 0.5], lookAt: [0, 0.33, 0] },
  large: { position: [1.1, 0, 2.0], lookAt: [-0.04, -0.05, 0] }
};

/** QR module layout on a 21×21 grid (finder patterns + decorative data). */
const QR_MODULES: [number, number, number, number][] = [
  // Top-left finder
  [0, 0, 7, 1],
  [0, 6, 7, 1],
  [0, 1, 1, 5],
  [6, 1, 1, 5],
  [2, 2, 3, 3],
  // Top-right finder
  [14, 0, 7, 1],
  [14, 6, 7, 1],
  [14, 1, 1, 5],
  [20, 1, 1, 5],
  [16, 2, 3, 3],
  // Bottom-left finder
  [0, 14, 7, 1],
  [0, 20, 7, 1],
  [0, 15, 1, 5],
  [6, 15, 1, 5],
  [2, 16, 3, 3],
  // Data modules
  [8, 0, 1, 1],
  [10, 1, 1, 1],
  [9, 3, 1, 1],
  [11, 4, 1, 1],
  [8, 5, 1, 1],
  [12, 2, 1, 1],
  [8, 8, 1, 1],
  [10, 9, 1, 1],
  [12, 8, 1, 1],
  [9, 10, 1, 1],
  [11, 11, 1, 1],
  [13, 10, 1, 1],
  [0, 8, 1, 1],
  [2, 9, 1, 1],
  [4, 8, 1, 1],
  [1, 10, 1, 1],
  [3, 11, 1, 1],
  [5, 10, 1, 1],
  [14, 8, 1, 1],
  [16, 9, 1, 1],
  [18, 8, 1, 1],
  [15, 11, 1, 1],
  [17, 10, 1, 1],
  [19, 12, 1, 1],
  [8, 14, 1, 1],
  [10, 15, 1, 1],
  [12, 14, 1, 1],
  [9, 17, 1, 1],
  [11, 16, 1, 1],
  [14, 15, 1, 1],
  [16, 16, 1, 1],
  [18, 15, 1, 1],
  [20, 17, 1, 1],
  [15, 18, 1, 1],
  [17, 19, 1, 1],
  [19, 20, 1, 1],
  [10, 19, 1, 1],
  [12, 20, 1, 1]
];

function buildQrTexture(): Three.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  // Circle background - semi-transparent white (like tooltip bg-white/20)
  ctx.beginPath();
  ctx.arc(cx, cy, r - 2, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.20)";
  ctx.fill();

  // Circle border - (like tooltip border-white/30)
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.30)";
  ctx.stroke();

  // Clip QR drawing to the circle so modules don't poke out
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r - 6, 0, Math.PI * 2);
  ctx.clip();

  // Draw QR modules centered in the circle
  const grid = 21;
  const qrSize = r * 1.2; // QR occupies ~60% of diameter
  const cellSize = qrSize / grid;
  const offsetX = cx - qrSize / 2;
  const offsetY = cy - qrSize / 2;

  ctx.fillStyle = "rgb(255, 255, 255)";
  for (const [mx, my, mw, mh] of QR_MODULES) {
    ctx.fillRect(offsetX + mx * cellSize, offsetY + my * cellSize, mw * cellSize, mh * cellSize);
  }
  ctx.restore();

  const tex = new Three.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function FloatingQrCode() {
  const texture = useMemo(() => buildQrTexture(), []);

  return (
    <Float floatIntensity={0.15} rotationIntensity={0.02} speed={0.8}>
      <mesh position={[0.25, 0.35, -0.15]}>
        <planeGeometry args={[0.28, 0.28]} />
        <meshBasicMaterial map={texture} transparent={true} depthWrite={false} side={Three.DoubleSide} />
      </mesh>
    </Float>
  );
}

export function IphoneDppCanvas() {
  return (
    <IphoneCanvas
      screenImage={DPP_SCREEN_IMAGE}
      tooltips={dppTooltips}
      cameraConfig={dppCameraConfig}
      ariaLabel="3D iPhone with digital product passport"
    >
      <FloatingQrCode />
    </IphoneCanvas>
  );
}

export function DppInteractiveProduct() {
  const containerReference = useRef<HTMLDivElement>(null);
  const isNearReference = useIsNearViewport(containerReference);

  return (
    <div
      ref={containerReference}
      className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/60"
    >
      <div className="grid min-h-[400px] grid-cols-1 md:min-h-[640px] lg:grid-cols-[1fr_minmax(280px,420px)]">
        {/* ── Left: 3D canvas ── */}
        <div
          role="img"
          aria-label="Interactive 3D product model with passport hotspots"
          className="relative min-h-[280px] cursor-grab bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50 active:cursor-grabbing md:min-h-[380px] lg:min-h-0"
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
              backgroundSize: "28px 28px"
            }}
          />

          <div className="absolute top-6 left-6 z-10 flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="font-semibold text-slate-600 text-xs uppercase tracking-wide">Live Passport</span>
          </div>

          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-slate-100 bg-white/60 px-3 py-1.5 font-medium text-slate-400 text-xs backdrop-blur-sm">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <title>Drag to explore icon</title>
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <rect x="3" y="11" width="18" height="11" rx="2" />
            </svg>
            Drag to explore
          </div>

          <Canvas
            frameloop="demand"
            camera={{ position: [0, 0.8, 7], fov: 42 }}
            style={{ width: "100%", height: "100%", minHeight: 380 }}
          >
            <RenderController isActive={isNearReference} />
            <color attach="background" args={["transparent"]} />
            <ambientLight intensity={0.9} />
            <spotLight position={[8, 14, 8]} angle={0.2} penumbra={1} intensity={2.5} castShadow={true} />
            <directionalLight position={[-4, 6, -4]} intensity={0.6} color="#e0e7ff" />
            <PresentationControls
              global={true}
              snap={false}
              rotation={[0.08, -Math.PI / 4, 0]}
              polar={[-Math.PI / 4, Math.PI / 4]}
              azimuth={[-Math.PI, Math.PI]}
              config={{ mass: 2, tension: 200, friction: 30 }}
            >
              <DppChairModel isActiveReference={isNearReference} />
              {hotspots.map((hotspot) => (
                <Html key={hotspot.label} position={hotspot.position} center={true}>
                  <div
                    className="relative h-4 w-4 cursor-pointer rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: hotspot.color, boxShadow: `0 0 12px ${hotspot.color}80` }}
                  >
                    <div
                      className="absolute inset-0 h-full w-full animate-ping rounded-full opacity-60"
                      style={{ backgroundColor: hotspot.color }}
                    />
                  </div>
                </Html>
              ))}
            </PresentationControls>
            <ContactShadows position={[0, -0.3, 0]} opacity={0.3} scale={14} blur={3} far={6} />
            <Environment files={STUDIO_HDR} />
          </Canvas>
        </div>

        {/* ── Right: Info panel ── */}
        <div className="flex flex-col gap-5 overflow-y-auto border-slate-100 border-t bg-white p-5 sm:p-7 lg:border-t-0 lg:border-l lg:p-9">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="mb-1.5 font-semibold text-brand text-xs uppercase tracking-widest">
                Digital Product Passport
              </p>
              <h2 className="font-bold text-2xl text-balance text-brand-darkest leading-snug">
                West Elm Slope
                <br />
                Leather Chair
              </h2>
              <p className="mt-1 font-mono text-slate-400 text-xs">DPP-2024-WE-SL-0042</p>
            </div>
            <div className="mt-1 shrink-0 rounded-lg bg-brand-deep px-2.5 py-1 font-bold text-[10px] text-white">
              ESPR 2026
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Hotspot detail cards */}
          <div className="space-y-2.5">
            <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5 transition-colors hover:border-brand/30 hover:bg-brand-surface/40">
              <div
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "#6366f115" }}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#6366f1" }} />
              </div>
              <div>
                <h4 className="mb-0.5 font-semibold text-slate-800 text-sm">Local Manufacturing</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Assembled in Gdańsk, Poland. 85% lower carbon footprint vs. global average. Certified ISO 14001.
                </p>
                <span className="mt-1.5 inline-block rounded-full border border-brand/20 bg-brand-surface px-2 py-0.5 font-medium text-[11px] text-brand">
                  CO₂: 12kg · 85% lower
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5 transition-colors hover:border-emerald-200 hover:bg-emerald-50/40">
              <div
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "#10b98115" }}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#10b981" }} />
              </div>
              <div>
                <h4 className="mb-0.5 font-semibold text-slate-800 text-sm">Sustainable Fabric</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Full-grain, vegetable-tanned leather. Easily replaceable. View repair manuals and find local service
                  centres.
                </p>
                <span className="mt-1.5 inline-block rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 font-medium text-[11px] text-emerald-600">
                  Repairability: 9/10
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5 transition-colors hover:border-amber-200 hover:bg-amber-50/40">
              <div
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "#f59e0b15" }}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
              </div>
              <div>
                <h4 className="mb-0.5 font-semibold text-slate-800 text-sm">FSC Certified Oak Frame</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Responsibly harvested. Expected lifecycle 25+ years. Structural warranty included via passport.
                </p>
                <span className="mt-1.5 inline-block rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 font-medium text-[11px] text-amber-600">
                  FSC-C123456 · 25yr lifecycle
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Material composition */}
          <div>
            <p className="mb-2.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">Material Composition</p>
            <div className="space-y-1.5">
              {[
                { label: "Full-grain leather", percentage: 54, color: "#a16207" },
                { label: "FSC oak (frame)", percentage: 28, color: "#4d7c0f" },
                { label: "Recycled steel legs", percentage: 14, color: "#475569" },
                { label: "Natural foam padding", percentage: 4, color: "#0e7490" }
              ].map((material) => (
                <div key={material.label} className="flex items-center gap-2">
                  <span className="w-36 shrink-0 text-[11px] text-slate-500">{material.label}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${material.percentage}%`, backgroundColor: material.color }}
                    />
                  </div>
                  <span className="w-7 text-right font-semibold text-[11px] text-slate-600">
                    {material.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Certifications */}
          <div>
            <p className="mb-2.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">
              Certifications & Compliance
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "FSC Certified", color: "#16a34a" },
                { label: "ISO 14001", color: "#0284c7" },
                { label: "ESPR 2026", color: "#6366f1" },
                { label: "REACH Compliant", color: "#0e7490" },
                { label: "EU Ecolabel", color: "#15803d" },
                { label: "GS1 Digital Link", color: "#7c3aed" }
              ].map((certification) => (
                <span
                  key={certification.label}
                  className="rounded-lg border px-2.5 py-1 font-semibold text-[11px]"
                  style={{
                    color: certification.color,
                    borderColor: `${certification.color}30`,
                    backgroundColor: `${certification.color}08`
                  }}
                >
                  ✓ {certification.label}
                </span>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Sustainability score */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold text-slate-600 text-xs uppercase tracking-wide">Sustainability Score</span>
              <span className="font-bold text-emerald-600 text-sm">94 / 100</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                style={{ width: "94%" }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-slate-400">
              <span>ESPR Compliant</span>
              <span>Top 3% in category</span>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Spare parts & end of life */}
          <div className="grid grid-cols-2 gap-2">
            <div className="cursor-pointer rounded-xl border border-slate-100 bg-slate-50 p-3 transition-colors hover:border-slate-200">
              <p className="mb-0.5 flex items-center gap-1 font-semibold text-[11px] text-slate-700">
                <Wrench className="h-3 w-3" /> Spare Parts
              </p>
              <p className="text-[11px] text-slate-400 leading-snug">4 parts available in-passport</p>
            </div>
            <div className="cursor-pointer rounded-xl border border-slate-100 bg-slate-50 p-3 transition-colors hover:border-slate-200">
              <p className="mb-0.5 flex items-center gap-1 font-semibold text-[11px] text-slate-700">
                <Recycle className="h-3 w-3" /> End of Life
              </p>
              <p className="text-[11px] text-slate-400 leading-snug">Certified recycling partner</p>
            </div>
            <div className="cursor-pointer rounded-xl border border-slate-100 bg-slate-50 p-3 transition-colors hover:border-slate-200">
              <p className="mb-0.5 flex items-center gap-1 font-semibold text-[11px] text-slate-700">
                <BookOpen className="h-3 w-3" /> Care Guide
              </p>
              <p className="text-[11px] text-slate-400 leading-snug">Leather maintenance tips</p>
            </div>
            <div className="cursor-pointer rounded-xl border border-slate-100 bg-slate-50 p-3 transition-colors hover:border-slate-200">
              <p className="mb-0.5 flex items-center gap-1 font-semibold text-[11px] text-slate-700">
                <Globe className="h-3 w-3" /> Resale Market
              </p>
              <p className="text-[11px] text-slate-400 leading-snug">Verified second-hand listing</p>
            </div>
          </div>

          {/* CTA */}
          <div>
            <WebsiteButton size="small" className="w-full rounded-xl">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <title>QR code icon</title>
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Scan or Share Passport
            </WebsiteButton>
            <p className="mt-2.5 text-center text-slate-400 text-xs">
              GS1-compliant · ESPR 2026 ready · Verified by Product Connect
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
