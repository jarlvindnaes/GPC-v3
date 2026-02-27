import { motion } from "motion/react";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, PresentationControls, ContactShadows, useGLTF } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

const CHAIR_MODEL = import.meta.env.BASE_URL + "models/west_elm_slope_leather_chair.glb";
const QUARTZ_MODEL = import.meta.env.BASE_URL + "models/quartz.glb";

// 3D Model Components
function Chair3D() {
  const { scene } = useGLTF(CHAIR_MODEL);
  const group = useRef<THREE.Group>(null);

  return (
    <group ref={group} position={[0, -0.8, 0]}>
      <primitive object={scene} scale={2.5} />
    </group>
  );
}

function Bolt3D() {
  // Placeholder procedural bolt until actual model is uploaded
  const mesh = useRef<THREE.Mesh>(null);

  return (
    <group position={[0, -0.2, 0]}>
      <mesh ref={mesh}>
        {/* Bolt head */}
        <cylinderGeometry args={[0.3, 0.3, 0.15, 6]} />
        <meshStandardMaterial color="#8b8b8b" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.4, 0]}>
        {/* Bolt shaft */}
        <cylinderGeometry args={[0.15, 0.15, 0.6, 16]} />
        <meshStandardMaterial color="#a8a8a8" metalness={0.85} roughness={0.25} />
      </mesh>
    </group>
  );
}

function Material3D() {
  const { scene } = useGLTF(QUARTZ_MODEL);

  return (
    <group position={[0, -0.5, 0]}>
      <primitive object={scene} scale={1.8} />
    </group>
  );
}

// Canvas wrapper for each 3D model
function Model3DCanvas({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="relative group">
      <div className="w-full h-80 rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
          <directionalLight position={[-5, 5, -5]} intensity={0.4} color="#a5b4fc" />
          <PresentationControls
            global
            snap={true}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 2, Math.PI / 2]}
            config={{ mass: 2, tension: 200, friction: 30 }}
          >
            <Float floatIntensity={0.4} rotationIntensity={0.2} speed={1.5}>
              {children}
            </Float>
          </PresentationControls>
          <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={8} blur={2.5} far={4} />
          <Environment preset="city" />
        </Canvas>
      </div>

      {/* Label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl px-4 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-slate-400">Drag to rotate</p>
      </div>
    </div>
  );
}

export function ProductBreakdown() {
  return (
    <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_60%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-semibold tracking-tight mb-6">
            Product Journey
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            From raw materials to finished product. Every component tracked, every material verified,
            every step transparent. This is the future of sustainable manufacturing.
          </p>
        </motion.div>

        {/* 3D Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Finished Product */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0 }}
          >
            <div className="mb-4">
              <h3 className="text-2xl font-bold mb-2 text-white">Finished Product</h3>
              <p className="text-slate-400">
                West Elm Slope Leather Chair — assembled with care, designed for longevity,
                ready for certification.
              </p>
            </div>
            <Model3DCanvas label="West Elm Slope Leather Chair">
              <Chair3D />
            </Model3DCanvas>
          </motion.div>

          {/* Components */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-4">
              <h3 className="text-2xl font-bold mb-2 text-white">Components</h3>
              <p className="text-slate-400">
                Every bolt, every screw, every fastener tracked. Bill of materials down to the smallest detail.
              </p>
            </div>
            <Model3DCanvas label="Steel Bolt — ISO 4762 M8x30">
              <Bolt3D />
            </Model3DCanvas>
          </motion.div>

          {/* Raw Materials */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="mb-4">
              <h3 className="text-2xl font-bold mb-2 text-white">Raw Materials</h3>
              <p className="text-slate-400">
                Trace back to the source. Metal ore, raw timber, natural fibers —
                verified origin and sustainability.
              </p>
            </div>
            <Model3DCanvas label="Iron Ore — Raw Material">
              <Material3D />
            </Model3DCanvas>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center p-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5">
            <div className="text-4xl font-bold text-indigo-400 mb-2">247</div>
            <div className="text-sm text-slate-400">Individual components tracked</div>
          </div>
          <div className="text-center p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
            <div className="text-4xl font-bold text-emerald-400 mb-2">18</div>
            <div className="text-sm text-slate-400">Suppliers in supply chain</div>
          </div>
          <div className="text-center p-6 rounded-2xl border border-violet-500/20 bg-violet-500/5">
            <div className="text-4xl font-bold text-violet-400 mb-2">100%</div>
            <div className="text-sm text-slate-400">Material origin verified</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
