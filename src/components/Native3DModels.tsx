import { ContactShadows, Environment, Float, Html, PresentationControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as Three from "three";

const CHAIR_MODEL = `${import.meta.env.BASE_URL}models/west_elm_slope_leather_chair.glb`;
const BOLT_MODEL = `${import.meta.env.BASE_URL}models/bolt_m10x25_hexagon_head (1).glb`;
const EMERALD_MODEL = `${import.meta.env.BASE_URL}models/emerald_in_quartz__for_games.glb`;

function CustomRockModel() {
  const { scene } = useGLTF(EMERALD_MODEL);
  const mesh = useRef<Three.Group>(null);
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.003;
    }
  });
  return (
    <Float floatIntensity={0.4} rotationIntensity={0} speed={1.2}>
      <group ref={mesh}>
        <primitive object={scene} scale={1.035} />
      </group>
    </Float>
  );
}

function BoltModel() {
  const { scene } = useGLTF(BOLT_MODEL);
  const mesh = useRef<Three.Group>(null);
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.003;
    }
  });
  return (
    <Float floatIntensity={0.3} rotationIntensity={0} speed={1.5}>
      <group ref={mesh} position={[0, 0.2, 0]} rotation={[Math.PI / 5, 0, 0]} scale={14}>
        <primitive object={scene} />
      </group>
    </Float>
  );
}

export function RawMaterialCanvas() {
  return (
    <div
      role="img"
      aria-label="3D raw material model viewer"
      className="h-full w-full cursor-grab active:cursor-grabbing"
    >
      <Canvas camera={{ position: [0, 0.5, 5], fov: 38 }} gl={{ alpha: true }} style={{ background: "transparent" }}>
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
            <CustomRockModel />
          </group>
        </PresentationControls>
        <ContactShadows position={[0, -1.5, 0]} opacity={0.3} scale={10} blur={3} far={5} />
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}

export function ComponentsCanvas() {
  return (
    <div role="img" aria-label="3D component model viewer" className="h-full w-full cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0.5, 5], fov: 38 }} gl={{ alpha: true }} style={{ background: "transparent" }}>
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
          <BoltModel />
        </PresentationControls>
        <ContactShadows position={[0, -1.2, 0]} opacity={0.3} scale={10} blur={3} far={5} />
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}

function WireframeChairModel() {
  const { scene } = useGLTF(CHAIR_MODEL);
  const spinRef = useRef<Three.Group>(null);
  const wireScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as Three.Mesh).isMesh) {
        const mesh = child as Three.Mesh;
        mesh.material = new Three.MeshBasicMaterial({
          color: new Three.Color("#818cf8"),
          wireframe: true,
          transparent: true,
          opacity: 0.7
        });
      }
    });
    return clone;
  }, [scene]);

  useFrame(() => {
    if (spinRef.current) {
      spinRef.current.rotation.y += 0.003;
    }
  });

  return (
    <Float floatIntensity={0.3} rotationIntensity={0} speed={1.5}>
      <group ref={spinRef} position={[0, -0.6, 0]}>
        <primitive object={wireScene} scale={2.6} />
      </group>
    </Float>
  );
}

export function FinishedProductCanvas() {
  return (
    <div
      role="img"
      aria-label="3D finished product model viewer"
      className="h-full w-full cursor-grab active:cursor-grabbing"
    >
      <Canvas camera={{ position: [0, 0.8, 5], fov: 38 }} gl={{ alpha: true }} style={{ background: "transparent" }}>
        <ambientLight intensity={0.8} />
        <PresentationControls
          global={true}
          snap={false}
          rotation={[0.08, -Math.PI / 4, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI, Math.PI]}
          config={{ mass: 4, tension: 120, friction: 40 }}
        >
          <WireframeChairModel />
        </PresentationControls>
        <ContactShadows position={[0, -0.3, 0]} opacity={0.15} scale={12} blur={3} far={5} color="#6366f1" />
      </Canvas>
    </div>
  );
}

function PassportChairModel({ onHover }: { onHover: (hovered: boolean) => void }) {
  const { scene } = useGLTF(CHAIR_MODEL);
  const passportScene = useMemo(() => scene.clone(), [scene]);
  return (
    <Float floatIntensity={0.8} rotationIntensity={0.03} speed={1.2}>
      <group position={[0, -1.0, 0]}>
        <primitive object={passportScene} scale={3.17} />
        {/* QR tag on the seat — positioned in 3D space */}
        <Html position={[0.0, 1.13, 0.35]} center={true}>
          <button
            type="button"
            aria-label="View Digital Product Passport"
            className="relative cursor-pointer border-none bg-transparent p-0"
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
            onClick={() => onHover(true)}
            onTouchStart={() => onHover(true)}
          >
            {/* Radiating rings */}
            <div className="absolute -inset-2 animate-[ping_3s_ease-in-out_infinite] rounded-full border border-indigo-400/25" />
            <div className="absolute -inset-4 animate-[ping_3s_ease-in-out_0.5s_infinite] rounded-full border border-indigo-400/12" />
            {/* Glow halo */}
            <div className="absolute -inset-1.5 animate-pulse rounded-full bg-indigo-500/20 blur-sm" />
            {/* Core QR icon */}
            <div className="relative flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_0_14px_rgba(99,102,241,0.6)] ring-[1.5px] ring-white/30">
              <svg
                className="h-2.5 w-2.5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <title>QR code icon</title>
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
            {/* Floating particles */}
            {[0, 1, 2, 3].map((particleIndex) => (
              <div
                key={particleIndex}
                className="absolute h-0.5 w-0.5 rounded-full bg-indigo-400"
                style={{
                  left: `${Math.cos((particleIndex * 90 * Math.PI) / 180) * 14 + 7}px`,
                  top: `${Math.sin((particleIndex * 90 * Math.PI) / 180) * 14 + 7}px`,
                  animation: `pulse 2s ease-in-out ${particleIndex * 0.4}s infinite`,
                  opacity: 0.5
                }}
              />
            ))}
          </button>
        </Html>
      </group>
    </Float>
  );
}

export function PassportChairCanvas() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      role="img"
      aria-label="Interactive 3D chair with product passport"
      className="relative mx-auto h-[min(80vw,600px)] w-[min(90vw,800px)]"
    >
      <Canvas camera={{ position: [0, 0.3, 5], fov: 38 }} gl={{ alpha: true }} style={{ background: "transparent" }}>
        <ambientLight intensity={0.8} />
        <spotLight position={[6, 10, 6]} angle={0.2} penumbra={1} intensity={3} color="#fff8f0" />
        <directionalLight position={[-3, 5, -3]} intensity={0.5} color="#c7d2fe" />
        <PresentationControls
          global={true}
          snap={false}
          rotation={[0.08, -Math.PI / 4, 0]}
          polar={[-Math.PI / 6, Math.PI / 6]}
          azimuth={[-Math.PI / 3, Math.PI / 3]}
          config={{ mass: 6, tension: 80, friction: 50 }}
        >
          <PassportChairModel onHover={setHovered} />
        </PresentationControls>
        <ContactShadows position={[0, -0.3, 0]} opacity={0.3} scale={14} blur={3} far={6} color="#000" />
        <Environment preset="studio" />
      </Canvas>

      {/* Intelligent Product panel — slides in on hover/tap */}
      <div
        className={`absolute top-2 right-0 w-[min(240px,60vw)] overflow-hidden rounded-2xl border transition-all duration-500 ease-out sm:top-4 sm:w-60 ${hovered ? "translate-x-0 border-indigo-500/30 bg-slate-800/95 opacity-100 shadow-2xl shadow-indigo-500/10" : "pointer-events-none translate-x-4 border-slate-700 bg-slate-800/95 opacity-0 shadow-none"} backdrop-blur-md`}
      >
        <div className="border-slate-700/50 border-b p-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
              <svg
                className="h-3 w-3 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <title>QR code icon</title>
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
            <span className="font-bold text-[10px] text-indigo-400 uppercase tracking-widest">Intelligent Product</span>
          </div>
          <p className="font-bold text-sm text-white leading-tight">West Elm Slope Leather Chair</p>
        </div>
        <div className="space-y-1.5 p-3">
          {[
            { icon: "📋", label: "Product Passport", description: "Full DPP & compliance docs" },
            { icon: "🔧", label: "Spare Parts", description: "Order replacements directly" },
            { icon: "📖", label: "Care & Manuals", description: "Maintenance guides & tips" },
            { icon: "♻️", label: "End of Life", description: "Recycling & take-back info" },
            { icon: "🌍", label: "Impact Data", description: "CO₂, materials & certifications" },
            { icon: "🛒", label: "Accessories", description: "Compatible add-ons & upgrades" }
          ].map((item) => (
            <div
              key={item.label}
              className="group flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-700/50 bg-slate-900/60 px-3 py-2 transition-colors hover:border-indigo-500/30 hover:bg-slate-900"
            >
              <span className="text-sm">{item.icon}</span>
              <div className="min-w-0">
                <p className="font-semibold text-[11px] text-white transition-colors group-hover:text-indigo-300">
                  {item.label}
                </p>
                <p className="text-[9px] text-slate-500 leading-tight">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-3 pb-3">
          <div className="flex h-8 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 transition-colors hover:from-indigo-500 hover:to-violet-500">
            <span className="font-semibold text-[11px] text-white">Scan or Share</span>
          </div>
        </div>
      </div>

      {/* Hint label — fades out when hovered */}
      <div
        className={`pointer-events-none absolute bottom-16 left-1/2 -translate-x-1/2 transition-all duration-300 ${hovered ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"}`}
      >
        <p className="whitespace-nowrap text-center text-slate-500 text-xs">
          <span className="hidden sm:inline">Hover</span>
          <span className="sm:hidden">Tap</span> the tag to explore
        </p>
      </div>
    </div>
  );
}

function DppChairModel() {
  const { scene } = useGLTF(CHAIR_MODEL);
  const productScene = useMemo(() => scene.clone(), [scene]);
  const group = useRef<Three.Group>(null);
  useFrame(() => {
    if (group.current) {
      // Slow continuous rotation
      group.current.rotation.y += 0.002;
    }
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

export function DppInteractiveProduct() {
  return (
    <div className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/60">
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

          <Canvas camera={{ position: [0, 0.8, 7], fov: 42 }} style={{ width: "100%", height: "100%", minHeight: 380 }}>
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
              <DppChairModel />
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
            <Environment preset="studio" />
          </Canvas>
        </div>

        {/* ── Right: Info panel ── */}
        <div className="flex flex-col gap-5 overflow-y-auto border-slate-100 border-t bg-white p-5 sm:p-7 lg:border-t-0 lg:border-l lg:p-9">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="mb-1.5 font-semibold text-indigo-500 text-xs uppercase tracking-widest">
                Digital Product Passport
              </p>
              <h2 className="font-bold text-2xl text-slate-900 leading-snug">
                West Elm Slope
                <br />
                Leather Chair
              </h2>
              <p className="mt-1 font-mono text-slate-400 text-xs">DPP-2024-WE-SL-0042</p>
            </div>
            <div className="mt-1 shrink-0 rounded-lg bg-slate-900 px-2.5 py-1 font-bold text-[10px] text-white">
              ESPR 2026
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Hotspot detail cards */}
          <div className="space-y-2.5">
            <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5 transition-colors hover:border-indigo-200 hover:bg-indigo-50/40">
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
                <span className="mt-1.5 inline-block rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 font-medium text-[11px] text-indigo-600">
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
              <p className="mb-0.5 font-semibold text-[11px] text-slate-700">🔧 Spare Parts</p>
              <p className="text-[11px] text-slate-400 leading-snug">4 parts available in-passport</p>
            </div>
            <div className="cursor-pointer rounded-xl border border-slate-100 bg-slate-50 p-3 transition-colors hover:border-slate-200">
              <p className="mb-0.5 font-semibold text-[11px] text-slate-700">♻️ End of Life</p>
              <p className="text-[11px] text-slate-400 leading-snug">Certified recycling partner</p>
            </div>
            <div className="cursor-pointer rounded-xl border border-slate-100 bg-slate-50 p-3 transition-colors hover:border-slate-200">
              <p className="mb-0.5 font-semibold text-[11px] text-slate-700">📋 Care Guide</p>
              <p className="text-[11px] text-slate-400 leading-snug">Leather maintenance tips</p>
            </div>
            <div className="cursor-pointer rounded-xl border border-slate-100 bg-slate-50 p-3 transition-colors hover:border-slate-200">
              <p className="mb-0.5 font-semibold text-[11px] text-slate-700">🌍 Resale Market</p>
              <p className="text-[11px] text-slate-400 leading-snug">Verified second-hand listing</p>
            </div>
          </div>

          {/* CTA */}
          <div>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-sm text-white transition-colors hover:bg-slate-800"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <title>QR code icon</title>
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Scan or Share Passport
            </button>
            <p className="mt-2.5 text-center text-slate-400 text-xs">
              GS1-compliant · ESPR 2026 ready · Verified by Product Connect
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
