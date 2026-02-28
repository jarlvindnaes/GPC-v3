import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, PresentationControls, ContactShadows, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const CHAIR_MODEL = import.meta.env.BASE_URL + "models/west_elm_slope_leather_chair.glb";
const BOLT_MODEL = import.meta.env.BASE_URL + "models/bolt_m10x25_hexagon_head (1).glb";
const COPPER_ORE_MODEL = import.meta.env.BASE_URL + "models/copper_ore.glb";

// ----------------------------------------------------------------------------
// 1. Raw Material Model (using copper_ore.glb)
// ----------------------------------------------------------------------------
function CustomRockModel() {
    const { scene } = useGLTF(COPPER_ORE_MODEL);
    const mesh = useRef<THREE.Group>(null);
    useFrame(() => {
        if (mesh.current) {
            // Slow continuous rotation
            mesh.current.rotation.y += 0.003;
        }
    });
    return (
        <Float floatIntensity={1.5} rotationIntensity={0} speed={1.2}>
            <group ref={mesh}>
                <primitive object={scene} scale={1.5} />
            </group>
        </Float>
    );
}

// ----------------------------------------------------------------------------
// Components/Bolt Model (using bolt_m10x25_hexagon_head GLB)
// ----------------------------------------------------------------------------
function BoltModel() {
    const { scene } = useGLTF(BOLT_MODEL);
    const mesh = useRef<THREE.Group>(null);
    useFrame(() => {
        if (mesh.current) {
            // Slow continuous rotation
            mesh.current.rotation.y += 0.003;
        }
    });
    return (
        <Float floatIntensity={0.3} rotationIntensity={0} speed={1.5}>
            <group ref={mesh} position={[0, -0.5, 0]} scale={2.5}>
                <primitive object={scene} />
            </group>
        </Float>
    );
}

export function RawMaterial3DCanvas() {
    return (
        <div className="w-full h-full cursor-grab active:cursor-grabbing">
            <Canvas camera={{ position: [0, 0.5, 6], fov: 42 }} gl={{ alpha: true }} style={{ background: 'transparent' }}>
                <ambientLight intensity={0.7} />
                <spotLight position={[8, 12, 8]} angle={0.2} penumbra={1} intensity={2.5} color="#fff8f0" />
                <directionalLight position={[-4, 6, -4]} intensity={0.6} color="#c7d2fe" />
                {/* 45° iso view */}
                <PresentationControls
                    global
                    snap={false}
                    rotation={[0.1, -Math.PI / 4, 0]}
                    polar={[-Math.PI / 4, Math.PI / 4]}
                    azimuth={[-Math.PI, Math.PI]}
                    config={{ mass: 2, tension: 200, friction: 30 }}
                >
                    <group position={[0, -0.5, 0]} scale={2.5}>
                        <CustomRockModel />
                    </group>
                </PresentationControls>
                <ContactShadows position={[0, -1.5, 0]} opacity={0.3} scale={10} blur={3} far={5} />
                <Environment preset="studio" />
            </Canvas>
        </div>
    );
}

// ----------------------------------------------------------------------------
// 1b. Components Canvas (for bolts/fasteners)
// ----------------------------------------------------------------------------
export function Components3DCanvas() {
    return (
        <div className="w-full h-full cursor-grab active:cursor-grabbing">
            <Canvas camera={{ position: [0, 0.5, 6], fov: 42 }} gl={{ alpha: true }} style={{ background: 'transparent' }}>
                <ambientLight intensity={0.7} />
                <spotLight position={[8, 12, 8]} angle={0.2} penumbra={1} intensity={3} color="#fff8f0" />
                <directionalLight position={[-4, 6, -4]} intensity={0.5} color="#c7d2fe" />
                {/* 45° iso view */}
                <PresentationControls
                    global
                    snap={false}
                    rotation={[0.1, -Math.PI / 4, 0]}
                    polar={[-Math.PI / 4, Math.PI / 4]}
                    azimuth={[-Math.PI, Math.PI]}
                    config={{ mass: 2, tension: 200, friction: 30 }}
                >
                    <BoltModel />
                </PresentationControls>
                <ContactShadows position={[0, -1.2, 0]} opacity={0.3} scale={10} blur={3} far={5} />
                <Environment preset="studio" />
            </Canvas>
        </div>
    );
}

// ----------------------------------------------------------------------------
// 2. Finished Product Canvas (StorytellingScroll)
// ----------------------------------------------------------------------------
function CustomChairModel() {
    const { scene } = useGLTF(CHAIR_MODEL);
    const group = useRef<THREE.Group>(null);
    useFrame(() => {
        if (group.current) {
            // Slow continuous rotation
            group.current.rotation.y += 0.002;
        }
    });
    return (
        <group ref={group} position={[0, -1, 0]}>
            <primitive object={scene} scale={1.5} />
        </group>
    );
}

export function FinishedProduct3DCanvas() {
    return (
        <div className="w-full h-full cursor-grab active:cursor-grabbing">
            <Canvas camera={{ position: [0, 0.8, 6], fov: 42 }} gl={{ alpha: true }} style={{ background: 'transparent' }}>
                <ambientLight intensity={0.7} />
                <spotLight position={[6, 10, 6]} angle={0.2} penumbra={1} intensity={3} color="#fff8f0" />
                <directionalLight position={[-3, 5, -3]} intensity={0.5} color="#c7d2fe" />
                {/* 45° iso default: rotation [slight tilt down, -π/4 yaw, 0] */}
                <PresentationControls
                    global
                    snap={false}
                    rotation={[0.08, -Math.PI / 4, 0]}
                    polar={[-Math.PI / 4, Math.PI / 4]}
                    azimuth={[-Math.PI, Math.PI]}
                    config={{ mass: 2, tension: 200, friction: 30 }}
                >
                    <Float floatIntensity={0.3} rotationIntensity={0} speed={1.5}>
                        <group position={[0, -0.3, 0]}>
                            <primitive object={useGLTF(CHAIR_MODEL).scene} scale={3.0} />
                        </group>
                    </Float>
                </PresentationControls>
                <ContactShadows position={[0, -0.3, 0]} opacity={0.25} scale={12} blur={3} far={5} color="#000" />
                <Environment preset="studio" />
            </Canvas>
        </div>
    );
}


// ----------------------------------------------------------------------------
// 3. DPP Interactive Product — Large hero 3D + Stripe-style info panel
// ----------------------------------------------------------------------------
function DPPChairModel() {
    const { scene } = useGLTF(CHAIR_MODEL);
    const productScene = useMemo(() => scene.clone(), [scene]);
    const group = useRef<THREE.Group>(null);
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
    { position: [0, 3.2, 0], color: "#f59e0b", label: "Frame" },
];

export function DPPInteractiveProduct() {
    return (
        <div className="w-full rounded-3xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-200/60 bg-white">
            <div className="grid lg:grid-cols-[1fr_420px] min-h-[640px]">

                {/* ── Left: 3D canvas ── */}
                <div className="relative bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50 cursor-grab active:cursor-grabbing min-h-[380px] lg:min-h-0">
                    <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
                        backgroundSize: '28px 28px'
                    }} />

                    <div className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-full px-4 py-2 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Live Passport</span>
                    </div>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-xs text-slate-400 font-medium flex items-center gap-1.5 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-100">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 11V7a5 5 0 0 1 10 0v4" /><rect x="3" y="11" width="18" height="11" rx="2" /></svg>
                        Drag to explore
                    </div>

                    <Canvas camera={{ position: [0, 0.8, 7], fov: 42 }} style={{ width: '100%', height: '100%', minHeight: 380 }}>
                        <color attach="background" args={['transparent']} />
                        <ambientLight intensity={0.9} />
                        <spotLight position={[8, 14, 8]} angle={0.2} penumbra={1} intensity={2.5} castShadow />
                        <directionalLight position={[-4, 6, -4]} intensity={0.6} color="#e0e7ff" />
                        <PresentationControls
                            global
                            snap={false}
                            rotation={[0.08, -Math.PI / 4, 0]}
                            polar={[-Math.PI / 4, Math.PI / 4]}
                            azimuth={[-Math.PI, Math.PI]}
                            config={{ mass: 2, tension: 200, friction: 30 }}
                        >
                            <DPPChairModel />
                            {hotspots.map((h, i) => (
                                <Html key={i} position={h.position} center>
                                    <div className="w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-pointer relative"
                                        style={{ backgroundColor: h.color, boxShadow: `0 0 12px ${h.color}80` }}>
                                        <div className="w-full h-full rounded-full animate-ping opacity-60 absolute inset-0"
                                            style={{ backgroundColor: h.color }} />
                                    </div>
                                </Html>
                            ))}
                        </PresentationControls>
                        <ContactShadows position={[0, -0.3, 0]} opacity={0.3} scale={14} blur={3} far={6} />
                        <Environment preset="studio" />
                    </Canvas>
                </div>

                {/* ── Right: Info panel ── */}
                <div className="flex flex-col p-7 lg:p-9 gap-5 border-l border-slate-100 bg-white overflow-y-auto">

                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold text-indigo-500 tracking-widest uppercase mb-1.5">Digital Product Passport</p>
                            <h2 className="text-2xl font-bold text-slate-900 leading-snug">West Elm Slope<br />Leather Chair</h2>
                            <p className="text-xs text-slate-400 mt-1 font-mono">DPP-2024-WE-SL-0042</p>
                        </div>
                        <div className="shrink-0 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg mt-1">ESPR 2026</div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Hotspot detail cards */}
                    <div className="space-y-2.5">
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5 flex gap-3 items-start hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: '#6366f115' }}>
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6366f1' }} />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800 mb-0.5">Local Manufacturing</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">Assembled in Gdańsk, Poland. 85% lower carbon footprint vs. global average. Certified ISO 14001.</p>
                                <span className="inline-block mt-1.5 text-[11px] font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-2 py-0.5">CO₂: 12kg · 85% lower</span>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5 flex gap-3 items-start hover:border-emerald-200 hover:bg-emerald-50/40 transition-colors">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: '#10b98115' }}>
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10b981' }} />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800 mb-0.5">Sustainable Fabric</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">Full-grain, vegetable-tanned leather. Easily replaceable. View repair manuals and find local service centres.</p>
                                <span className="inline-block mt-1.5 text-[11px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">Repairability: 9/10</span>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5 flex gap-3 items-start hover:border-amber-200 hover:bg-amber-50/40 transition-colors">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: '#f59e0b15' }}>
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800 mb-0.5">FSC Certified Oak Frame</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">Responsibly harvested. Expected lifecycle 25+ years. Structural warranty included via passport.</p>
                                <span className="inline-block mt-1.5 text-[11px] font-medium text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-2 py-0.5">FSC-C123456 · 25yr lifecycle</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Material composition */}
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">Material Composition</p>
                        <div className="space-y-1.5">
                            {[
                                { label: 'Full-grain leather', pct: 54, color: '#a16207' },
                                { label: 'FSC oak (frame)', pct: 28, color: '#4d7c0f' },
                                { label: 'Recycled steel legs', pct: 14, color: '#475569' },
                                { label: 'Natural foam padding', pct: 4, color: '#0e7490' },
                            ].map(m => (
                                <div key={m.label} className="flex items-center gap-2">
                                    <span className="text-[11px] text-slate-500 w-36 shrink-0">{m.label}</span>
                                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${m.pct}%`, backgroundColor: m.color }} />
                                    </div>
                                    <span className="text-[11px] font-semibold text-slate-600 w-7 text-right">{m.pct}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Certifications */}
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">Certifications & Compliance</p>
                        <div className="flex flex-wrap gap-1.5">
                            {[
                                { label: 'FSC Certified', color: '#16a34a' },
                                { label: 'ISO 14001', color: '#0284c7' },
                                { label: 'ESPR 2026', color: '#6366f1' },
                                { label: 'REACH Compliant', color: '#0e7490' },
                                { label: 'EU Ecolabel', color: '#15803d' },
                                { label: 'GS1 Digital Link', color: '#7c3aed' },
                            ].map(c => (
                                <span key={c.label} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border"
                                    style={{ color: c.color, borderColor: `${c.color}30`, backgroundColor: `${c.color}08` }}>
                                    ✓ {c.label}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Sustainability score */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Sustainability Score</span>
                            <span className="text-sm font-bold text-emerald-600">94 / 100</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" style={{ width: '94%' }} />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                            <span>ESPR Compliant</span>
                            <span>Top 3% in category</span>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Spare parts & end of life */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 hover:border-slate-200 transition-colors cursor-pointer">
                            <p className="text-[11px] font-semibold text-slate-700 mb-0.5">🔧 Spare Parts</p>
                            <p className="text-[11px] text-slate-400 leading-snug">4 parts available in-passport</p>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 hover:border-slate-200 transition-colors cursor-pointer">
                            <p className="text-[11px] font-semibold text-slate-700 mb-0.5">♻️ End of Life</p>
                            <p className="text-[11px] text-slate-400 leading-snug">Certified recycling partner</p>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 hover:border-slate-200 transition-colors cursor-pointer">
                            <p className="text-[11px] font-semibold text-slate-700 mb-0.5">📋 Care Guide</p>
                            <p className="text-[11px] text-slate-400 leading-snug">Leather maintenance tips</p>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 hover:border-slate-200 transition-colors cursor-pointer">
                            <p className="text-[11px] font-semibold text-slate-700 mb-0.5">🌍 Resale Market</p>
                            <p className="text-[11px] text-slate-400 leading-snug">Verified second-hand listing</p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div>
                        <button className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-3 px-5 rounded-xl transition-colors flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                            Scan or Share Passport
                        </button>
                        <p className="text-center text-xs text-slate-400 mt-2.5">GS1-compliant · ESPR 2026 ready · Verified by Product Connect</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
