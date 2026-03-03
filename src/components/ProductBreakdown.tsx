import { ContactShadows, Environment, Float, PresentationControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { motion } from "motion/react";
import { useRef } from "react";
import type * as Three from "three";

const CHAIR_MODEL = `${import.meta.env.BASE_URL}models/west_elm_slope_leather_chair.glb`;
const QUARTZ_MODEL = `${import.meta.env.BASE_URL}models/quartz.glb`;

// 3D Model Components
function Chair3D() {
  const { scene } = useGLTF(CHAIR_MODEL);
  const group = useRef<Three.Group>(null);

  return (
    <group ref={group} position={[0, -0.8, 0]}>
      <primitive object={scene} scale={2.5} />
    </group>
  );
}

function Bolt3D() {
  // Placeholder procedural bolt until actual model is uploaded
  const mesh = useRef<Three.Mesh>(null);

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
function Model3dCanvas({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="group relative">
      <div className="h-64 w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm md:h-80">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
          <directionalLight position={[-5, 5, -5]} intensity={0.4} color="#a5b4fc" />
          <PresentationControls
            global={true}
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
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2 opacity-80 shadow-lg backdrop-blur-md transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
        <p className="font-semibold text-sm text-white">{label}</p>
        <p className="text-slate-400 text-xs">Drag to rotate</p>
      </div>
    </div>
  );
}

export function ProductBreakdown() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-24 md:py-32">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_60%)]"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <h2 className="mb-6 font-display font-semibold text-3xl tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Product Journey
          </h2>
          <p className="mx-auto max-w-3xl text-base text-slate-400 leading-relaxed sm:text-lg md:text-xl">
            From raw materials to finished product. Every component tracked, every material verified, every step
            transparent. This is the future of sustainable manufacturing.
          </p>
        </motion.div>

        {/* 3D Models Grid */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Finished Product */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0 }}
          >
            <div className="mb-4">
              <h3 className="mb-2 font-bold text-white text-xl sm:text-2xl">Finished Product</h3>
              <p className="text-slate-400">
                West Elm Slope Leather Chair — assembled with care, designed for longevity, ready for certification.
              </p>
            </div>
            <Model3dCanvas label="West Elm Slope Leather Chair">
              <Chair3D />
            </Model3dCanvas>
          </motion.div>

          {/* Components */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-4">
              <h3 className="mb-2 font-bold text-white text-xl sm:text-2xl">Components</h3>
              <p className="text-slate-400">
                Every bolt, every screw, every fastener tracked. Bill of materials down to the smallest detail.
              </p>
            </div>
            <Model3dCanvas label="Steel Bolt — ISO 4762 M8x30">
              <Bolt3D />
            </Model3dCanvas>
          </motion.div>

          {/* Raw Materials */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="mb-4">
              <h3 className="mb-2 font-bold text-white text-xl sm:text-2xl">Raw Materials</h3>
              <p className="text-slate-400">
                Trace back to the source. Metal ore, raw timber, natural fibers — verified origin and sustainability.
              </p>
            </div>
            <Model3dCanvas label="Iron Ore — Raw Material">
              <Material3D />
            </Model3dCanvas>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 text-center">
            <div className="mb-2 font-bold text-4xl text-indigo-400">247</div>
            <div className="text-slate-400 text-sm">Individual components tracked</div>
          </div>
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
            <div className="mb-2 font-bold text-4xl text-emerald-400">18</div>
            <div className="text-slate-400 text-sm">Suppliers in supply chain</div>
          </div>
          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6 text-center">
            <div className="mb-2 font-bold text-4xl text-violet-400">100%</div>
            <div className="text-slate-400 text-sm">Material origin verified</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
