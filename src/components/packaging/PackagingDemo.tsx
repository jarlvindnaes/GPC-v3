import React, { useState, useRef, useMemo, useEffect, useId } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, RoundedBox, OrthographicCamera } from "@react-three/drei";
import { Box, Layers, Package, ArrowRight, ArrowLeft, Check, Leaf } from "lucide-react";
import * as THREE from "three";
import "./packaging.css";
import { calculate, normalize } from "./calculations.mjs";

const stages = ["Indre emballage", "Forsendelseskasse", "Palletering"];
function Cube({ position = [0, 0, 0], size = [1, 1, 1], color = "#c59761", opacity = 1 }: any) {
  const ref = useRef<THREE.Mesh>(null);
  const edges = useMemo(() => {
    const box = new THREE.BoxGeometry(...size);
    const result = new THREE.EdgesGeometry(box);
    box.dispose();
    return result;
  }, [...size]);
  useEffect(() => () => edges.dispose(), [edges]);
  useFrame((_, dt) => {
    if (ref.current) ref.current.scale.setScalar(THREE.MathUtils.damp(ref.current.scale.x, 1, 9, dt));
  });
  return (
    <mesh ref={ref} scale={0.01} position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} />
      <lineSegments>
        <primitive object={edges} attach="geometry" />
        <lineBasicMaterial color={color === "#c59761" ? "#987344" : "#4f6861"} transparent opacity={0.18} />
      </lineSegments>
    </mesh>
  );
}
function Product() {
  return (
    <group>
      <RoundedBox args={[0.74, 0.9, 0.74]} radius={0.08} position={[0, 0.45, 0]}>
        <meshStandardMaterial color="#527d6d" roughness={0.65} />
      </RoundedBox>
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.23, 0.23, 0.14, 32]} />
        <meshStandardMaterial color="#294c40" />
      </mesh>
      <Cube position={[0, 0.46, 0.375]} size={[0.49, 0.35, 0.007]} color="#f3f5ed" />
    </group>
  );
}
function Scene({
  stage,
  inner,
  weight,
  protection,
  units,
  mode,
  layers,
  perLayer,
  wrap,
  boxes,
  spread,
  material,
  protectionMaterial,
  totalBoxes
}: any) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (group.current) {
      const scale = stage === 0 ? 1.75 : stage === 1 ? (mode === "multi" && boxes > 6 ? 0.85 : 1.25) : 0.72;
      group.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 1 - Math.exp(-dt * 5));
      group.current.position.y = THREE.MathUtils.damp(group.current.position.y, stage === 2 ? -1.05 : -0.5, 5, dt);
    }
  });
  const cartonColor = material === "Massivpap" ? "#b6a28b" : "#c59761";
  const carton = (p: number[], key: number) => (
    <group position={p as any} key={key}>
      <Cube color={cartonColor} size={[1.3, 1.05, 1.12]} position={[0, 0.525, 0]} />
      <Cube size={[0.18, 0.012, 1.13]} position={[0, 1.056, 0]} color="#e8d6ae" />
      <Cube size={[0.18, 1.02, 0.009]} position={[0, 0.54, 0.565]} color="#e8d6ae" />
      <Cube size={[0.32, 0.23, 0.014]} position={[0.33, 0.62, 0.57]} color="#f4f3eb" />
    </group>
  );
  return (
    <>
      <OrthographicCamera makeDefault position={[7, 6, 8]} zoom={80} onUpdate={(camera) => camera.lookAt(0, 0, 0)} />
      <ambientLight intensity={1.6} />
      <directionalLight position={[5, 9, 4]} intensity={2} />
      <group ref={group}>
        {stage === 0 ? (
          <group>
            <Product />
            {inner !== "Ingen" && weight > 0 && (
              <Cube
                size={[0.95, 1.2, 0.94]}
                position={[0, spread ? 1.25 : 0.53, 0]}
                color={inner === "Papir" ? "#d2bb95" : "#b1d5cd"}
                opacity={0.15 + weight / 400}
              />
            )}
            {protectionMaterial !== "Ingen" &&
              protection > 0 &&
              [-1, 1].map((i) => (
                <Cube
                  key={i}
                  size={[0.1 + protection / 180, 0.9, 1.05]}
                  position={[i * (0.56 + (spread ? 0.25 : 0)), 0.4, 0]}
                  color={protectionMaterial === "EPE-skum" ? "#c6dce3" : "#e3ddd1"}
                />
              ))}
          </group>
        ) : stage === 1 ? (
          <group>
            {mode === "multi" ? (
              Array.from({ length: boxes }, (_, i) =>
                carton([((i % 3) - 1) * 1.5, Math.floor(i / 3) * (spread ? 1.5 : 1.13), 0], i)
              )
            ) : (
              <>
                <Cube color={cartonColor} size={[2, 0.07, 1.7]} position={[0, -0.05, 0]} />
                <Cube color={cartonColor} size={[2, 1.1, 0.055]} position={[0, 0.5, -0.85]} />
                <Cube color={cartonColor} size={[0.055, 1.1, 1.7]} position={[-1, 0.5, 0]} />
                <Cube color={cartonColor} size={[2, 0.6, 0.045]} position={[0, 0.2, 0.85]} opacity={0.5} />
                {Array.from({ length: Math.min(units, 12) }, (_, i) => (
                  <group
                    key={i}
                    scale={0.43}
                    position={[
                      ((i % 3) - 1) * 0.59,
                      0.04 + Math.floor(i / 6) * 0.52 + (spread ? 0.6 : 0),
                      ((Math.floor(i / 3) % 2) - 0.5) * 0.7
                    ]}
                  >
                    <Product />
                  </group>
                ))}
                <group rotation={[-0.55, 0, 0]} position={[0, 1.05, -0.85]}>
                  <Cube color={cartonColor} size={[2, 0.6, 0.045]} position={[0, 0.3, 0]} />
                </group>
              </>
            )}
          </group>
        ) : (
          <group>
            {[-1.6, 0, 1.6].map((x) => (
              <Cube key={x} position={[x, -0.19, 0]} size={[0.28, 0.27, 3.6]} color="#a58359" />
            ))}
            {Array.from({ length: 5 }, (_, i) => (
              <Cube key={i} position={[0, 0, (i - 2) * 0.79]} size={[4.2, 0.12, 0.51]} color="#ccab7a" />
            ))}
            {Array.from({ length: totalBoxes }, (_, i) => {
              const cols = Math.ceil(Math.sqrt(perLayer));
              const j = i % perLayer;
              return carton(
                [
                  ((j % cols) - (cols - 1) / 2) * 1.35,
                  0.09 + Math.floor(i / perLayer) * (1.1 + (spread ? 0.2 : 0)),
                  (Math.floor(j / cols) - (Math.ceil(perLayer / cols) - 1) / 2) * 1.2
                ],
                i
              );
            })}
            {wrap > 0 && totalBoxes > 0 && (
              <Cube
                position={[0, layers * 0.55, 0]}
                size={[4.12, layers * 1.1 + 0.12, 3.6]}
                color="#cee5df"
                opacity={0.06 + wrap / 2000}
              />
            )}
          </group>
        )}
      </group>
      <ContactShadows position={[0, -1.25, 0]} opacity={0.22} scale={18} blur={2.8} far={8} />
    </>
  );
}
class SceneBoundary extends React.Component<React.PropsWithChildren, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <p role="status" className="scene-error">
        3D-visningen kunne ikke indlæses. Du kan stadig bruge alle felter og beregninger.
      </p>
    ) : (
      this.props.children
    );
  }
}
function Slider({ label, value, onChange, min = 0, max = 100, unit = "g", step = 1 }: any) {
  const id = useId();
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  const commit = () => {
    const next = draft.trim() === "" ? value : normalize(draft, min, max, step);
    setDraft(String(next));
    onChange(next);
  };
  return (
    <div className="slider-field">
      <span>
        <label htmlFor={id}>{label}</label>
        <strong>
          <input
            aria-label={`${label} — tal`}
            type="number"
            min={min}
            max={max}
            step={step}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              const n = Number(e.target.value);
              if (e.target.value !== "" && Number.isFinite(n) && n >= min && n <= max)
                onChange(normalize(n, min, max, step));
            }}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
            }}
          />{" "}
          <small>{unit}</small>
        </strong>
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(normalize(e.target.value, min, max, step))}
      />
      <span className="range-ends">
        <small>
          {min} {unit}
        </small>
        <small>
          {max} {unit}
        </small>
      </span>
    </div>
  );
}
export default function PackagingDemo() {
  const [stage, setStage] = useState(0),
    [inner, setInner] = useState("LDPE-plast"),
    [weight, setWeight] = useState(12),
    [protectionMaterial, setProtectionMaterial] = useState("Papirbaseret indlæg"),
    [protection, setProtection] = useState(24),
    [material, setMaterial] = useState("Bølgepap"),
    [boxWeight, setBoxWeight] = useState(320),
    [mode, setMode] = useState("single"),
    [units, setUnits] = useState(6),
    [boxes, setBoxes] = useState(2),
    [layers, setLayers] = useState(3),
    [perLayer, setPerLayer] = useState(6),
    [wrap, setWrap] = useState(180),
    [spread, setSpread] = useState(false);
  const { capacity, totalBoxes, products, innerMass, cartonPerProduct, filmPerProduct, totalPerProduct, palletMass } =
    calculate({ layers, perLayer, mode, boxes, units, inner, weight, protectionMaterial, protection, boxWeight, wrap });
  const f = (n: number | null) => (n === null ? "—" : n.toLocaleString("da-DK", { maximumFractionDigits: 1 }));
  return (
    <div className="pack-app">
      <header className="topbar">
        <a href="/" className="brand">
          <span className="brand-icon">
            <Package size={22} />
          </span>
          product<span>connect</span>
        </a>
        <div className="app-title">
          Emballage Studio <span className="demo-pill">INTERAKTIV DEMO</span>
        </div>
        <span className="draft">
          <i /> Eksempelprodukt
        </span>
      </header>
      <main className="workspace">
        <section className="visual">
          <div className="visual-heading">
            <div>
              <div className="eyebrow">FRA PRODUKT TIL PALLE</div>
              <h1>Hvert lag tæller.</h1>
              <p>Byg din emballage. Se sammenhængen.</p>
            </div>
            <button
              className={"view-button " + (spread ? "selected" : "")}
              onClick={() => setSpread(!spread)}
              aria-pressed={spread}
            >
              <Layers size={17} />
              {spread ? "Saml lag" : "Adskil lag"}
            </button>
          </div>
          <div className="scene">
            <div className="scene-grid" />
            <SceneBoundary>
              <Canvas
                dpr={[1, 2]}
                fallback={<p>3D-visningen kræver WebGL. Alle kontroller og beregninger kan stadig bruges.</p>}
              >
                <Scene
                  {...{
                    stage,
                    inner,
                    weight,
                    protection,
                    units,
                    mode,
                    layers,
                    perLayer,
                    wrap,
                    boxes,
                    spread,
                    material,
                    protectionMaterial,
                    totalBoxes
                  }}
                />
              </Canvas>
            </SceneBoundary>
            <div className="scene-tag">
              <span className="tag-dot" />
              {stage === 0
                ? "01 / Produkt + beskyttelse"
                : stage === 1
                  ? "02 / Samlet i forsendelseskasse"
                  : "03 / Klar til transport"}
            </div>
            <div className="scene-caption">
              {stage === 0 ? "01" : stage === 1 ? "02" : "03"}
              <span>
                {stage === 0
                  ? "Et godt produkt starter med god beskyttelse."
                  : stage === 1
                    ? "Fra enkeltprodukt til en samlet forsendelse."
                    : "Hele emballagehierarkiet, samlet på én palle."}
              </span>
            </div>
          </div>
          <div className="journey">
            {stages.map((s, i) => (
              <React.Fragment key={s}>
                {i > 0 && <div className={"connector " + (stage >= i ? "active" : "")} />}
                <button onClick={() => setStage(i)} className={stage === i ? "current" : stage > i ? "done" : ""}>
                  <span>{stage > i ? <Check size={16} /> : i + 1}</span>
                  {s}
                </button>
              </React.Fragment>
            ))}
          </div>
          <div className="stats">
            <div>
              <span>Emballage / produkt</span>
              <strong>
                {f(totalPerProduct)} <small>g</small>
              </strong>
            </div>
            <div>
              <span>Produkter / palle</span>
              <strong>
                {f(products)} <small>stk.</small>
              </strong>
            </div>
            <div>
              <span>Emballage / palle</span>
              <strong>
                {f(palletMass / 1000)} <small>kg</small>
              </strong>
            </div>
            <div className="live">
              <span />
              <small>Opdateres live</small>
            </div>
          </div>
          <p className="calculation-note">
            Inkl. indre emballage, kasser og strækfilm. Ekskl. pallens egenvægt.{" "}
            {capacity !== totalBoxes
              ? `${totalBoxes} kasser pakket i hele produktsæt. ${capacity - totalBoxes} ledige kassepladser.${products === 0 ? " Øg antal lag eller kasser pr. lag for at rumme ét produkt." : ""}`
              : ""}
          </p>
        </section>
        <aside className="controls">
          <div className="panel-top">
            <span>EMBALLAGEOPSÆTNING</span>
            <span>TRIN {stage + 1} AF 3</span>
          </div>
          <div className="step-tabs">
            {[Package, Box, Layers].map((Icon, i) => (
              <button
                key={i}
                className={stage === i ? "active" : ""}
                onClick={() => setStage(i)}
                aria-label={stages[i]}
              >
                <Icon size={19} />
                <span>0{i + 1}</span>
              </button>
            ))}
          </div>
          <div className="panel-body" key={stage}>
            <div className="section-heading">
              <h2>{stages[stage]}</h2>
              <p>
                {
                  [
                    "Det, der er tættest på dit produkt.",
                    "Sådan pakkes produktet til transport.",
                    "Saml kasserne til en komplet palle."
                  ][stage]
                }
              </p>
            </div>
            {stage === 0 ? (
              <>
                <div className="product-card">
                  <span>
                    <Package size={23} />
                  </span>
                  <div>
                    <strong>Care / 500 ml</strong>
                    <small>Eksempelprodukt · 1 stk.</small>
                  </div>
                  <span className="tiny-pill">PRODUKT</span>
                </div>
                <fieldset>
                  <legend>Indpakning</legend>
                  <div className="material-grid">
                    {["LDPE-plast", "Papir", "Ingen"].map((m) => (
                      <button
                        onClick={() => setInner(m)}
                        aria-pressed={inner === m}
                        className={inner === m ? "chosen" : ""}
                        key={m}
                      >
                        <span
                          className={"material-dot " + (m === "Papir" ? "paper" : m === "Ingen" ? "none" : "plastic")}
                        />
                        {m}
                        {inner === m && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </fieldset>
                {inner !== "Ingen" && (
                  <Slider label="Indpakningens vægt" value={weight} onChange={setWeight} max={80} />
                )}
                <div className="divider" />
                <label className="select-field">
                  Beskyttelsesmateriale
                  <select value={protectionMaterial} onChange={(e) => setProtectionMaterial(e.target.value)}>
                    <option>Papirbaseret indlæg</option>
                    <option>EPE-skum</option>
                    <option>Ingen</option>
                  </select>
                </label>
                {protectionMaterial !== "Ingen" && (
                  <Slider label="Beskyttelsens vægt" value={protection} onChange={setProtection} max={150} />
                )}
                <div className="info-box">
                  <Leaf size={19} />
                  <p>Registrér hvert materiale for sig. Vægten angives for ét produkt.</p>
                </div>
              </>
            ) : stage === 1 ? (
              <>
                <fieldset className="ratio-control">
                  <legend>Pakkeforhold</legend>
                  <div className="ratio-result" aria-live="polite">
                    <strong>
                      {mode === "multi" ? `${boxes} kasser` : `${units} ${units === 1 ? "produkt" : "produkter"}`}
                    </strong>
                    <span>{mode === "multi" ? "pr. produkt" : "pr. kasse"}</span>
                  </div>
                  <label htmlFor="packing-ratio" className="ratio-hint">
                    {mode === "multi"
                      ? "Ét produkt fordelt på flere kasser"
                      : units === 1
                        ? "Ét produkt i én kasse"
                        : "Flere produkter samlet i én kasse"}
                  </label>
                  <input
                    id="packing-ratio"
                    type="range"
                    min={-11}
                    max={11}
                    step={1}
                    value={mode === "multi" ? 1 - boxes : units - 1}
                    aria-valuetext={mode === "multi" ? `${boxes} kasser pr. produkt` : `${units} produkter pr. kasse`}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value < 0) {
                        setMode("multi");
                        setBoxes(1 - value);
                      } else {
                        setMode("single");
                        setUnits(1 + value);
                      }
                    }}
                  />
                  <div className="ratio-labels">
                    <span>
                      ← Flere kasser
                      <br />
                      pr. produkt
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("single");
                        setUnits(1);
                      }}
                      aria-label="Nulstil pakkeforhold til ét produkt i én kasse"
                    >
                      1 : 1
                    </button>
                    <span>
                      Flere produkter →<br />
                      pr. kasse
                    </span>
                  </div>
                  <p className="ratio-hint">
                    Midten er 1:1. Træk til venstre for at dele produktet i flere kasser, eller til højre for at samle
                    flere produkter.
                  </p>
                </fieldset>
                <div className="divider" />
                <label className="select-field">
                  Kassens materiale
                  <select value={material} onChange={(e) => setMaterial(e.target.value)}>
                    <option>Bølgepap</option>
                    <option>Massivpap</option>
                  </select>
                </label>
                <Slider
                  label="Vægt pr. kasse"
                  min={50}
                  max={1000}
                  step={10}
                  value={boxWeight}
                  onChange={setBoxWeight}
                />
                <div className="info-box">
                  <Box size={19} />
                  <p>
                    {mode === "single"
                      ? `${units} produkter deler kassens vægt. Det svarer til ${f(cartonPerProduct)} g ${material.toLowerCase()} pr. produkt.`
                      : `Ét produkt fordeles på ${boxes} ens kasser. Samlet kassevægt: ${f(cartonPerProduct)} g pr. produkt.`}
                  </p>
                </div>
              </>
            ) : (
              <>
                <Slider label="Kasser pr. lag" unit="stk." min={1} max={9} value={perLayer} onChange={setPerLayer} />
                <Slider label="Antal lag" unit="lag" min={1} max={5} value={layers} onChange={setLayers} />
                <div className="pallet-summary">
                  <span>Kasser / kapacitet</span>
                  <strong>
                    {totalBoxes} / {capacity}
                  </strong>
                </div>
                <div className="divider" />
                <Slider label="Strækfilm pr. palle · LDPE" value={wrap} onChange={setWrap} max={600} step={10} />
                <div className="info-box">
                  <Layers size={19} />
                  <p>
                    {products > 0
                      ? `Strækfilmens vægt fordeles på pallens ${f(products)} produkter.`
                      : "Der er ikke plads til et helt produktsæt. Øg pallens kapacitet for at beregne vægten pr. produkt."}{" "}
                    Pallen er vist skematisk; mål og bæreevne er ikke kontrolleret.
                  </p>
                </div>
              </>
            )}
            <div className="subtotal">
              <span>
                {stage === 0
                  ? "Indre emballage / produkt"
                  : stage === 1
                    ? "Kasseemballage / produkt"
                    : "Transportfilm / produkt"}
              </span>
              <strong>{f(stage === 0 ? innerMass : stage === 1 ? cartonPerProduct : filmPerProduct)} g</strong>
            </div>
          </div>
          <div className="panel-bottom">
            <button
              className="back"
              disabled={stage === 0}
              onClick={() => setStage(stage - 1)}
              aria-label="Forrige trin"
            >
              <ArrowLeft size={19} />
            </button>
            <button className="next" onClick={() => setStage(stage === 2 ? 0 : stage + 1)}>
              {stage === 2 ? "Tilbage til produkt" : stage === 0 ? "Til forsendelseskasse" : "Til palletering"}
              <ArrowRight size={18} />
            </button>
          </div>
          <p className="prototype-note">Prototype · Eksempeldata, ikke myndighedsindberetning.</p>
        </aside>
      </main>
    </div>
  );
}
