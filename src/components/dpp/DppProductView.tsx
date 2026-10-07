import { AnimatePresence, motion, useMotionValue, useTransform } from "motion/react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as Three from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { DppPartThumb } from "./DppPartThumb";
import { brandConfig } from "./dppBrandConfig";
import { CHAIR_MODEL, partForPiece } from "./dppChairModel";
import { slopeChair } from "./dppProductData";
import type { PurchasablePart } from "./dppTypes";

const data = slopeChair;

export const parts: Record<string, PurchasablePart> = {};
for (const part of data.materialsAndComponents.purchasableParts) {
  parts[part.id] = part;
}

const STUDIO_HDR = `${import.meta.env.BASE_URL}hdri/studio_small_03_1k.hdr`;

/* ------------------------------------------------------------------ */
/*  Imperative Three.js chair viewer (avoids R3F StrictMode ctx loss)  */
/* ------------------------------------------------------------------ */

function useChairCanvas(
  containerRef: React.RefObject<HTMLDivElement | null>,
  onPartClick: (partId: string) => void,
  selectedPartId: string | null
) {
  const rendererRef = useRef<Three.WebGLRenderer | null>(null);
  const sceneRef = useRef<Three.Scene | null>(null);
  const cameraRef = useRef<Three.PerspectiveCamera | null>(null);
  const chairGroupRef = useRef<Three.Group | null>(null);
  const raycasterRef = useRef(new Three.Raycaster());
  const pointerRef = useRef(new Three.Vector2());
  const rotationRef = useRef({ y: -Math.PI / 5, x: 0.08 });
  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef(0);

  // Each purchasable part's meshes get their own material copies, so one part can glow on its own.
  const partMaterialsRef = useRef<Map<string, Three.MeshStandardMaterial[]>>(new Map());
  const partMeshesRef = useRef<Map<string, Three.Mesh[]>>(new Map());
  const outlineRef = useRef<OutlinePass | null>(null);
  const [modelReady, setModelReady] = useState(false);

  // Stable callback ref so the effect doesn't re-run when onPartClick changes
  const onPartClickRef = useRef(onPartClick);
  onPartClickRef.current = onPartClick;

  // biome-ignore lint/correctness/useExhaustiveDependencies: one-time 3D scene setup on mount; refs are read imperatively, not reactive deps
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    // ── Scene ──
    const scene = new Three.Scene();
    sceneRef.current = scene;

    // ── Camera ──
    const camera = new Three.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 0.03, 5.0);
    cameraRef.current = camera;

    // ── Renderer ──
    const renderer = new Three.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = Three.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8; // pale white-oiled oak washes out at 1.0
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── Lights ──
    const ambient = new Three.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);

    const spot = new Three.SpotLight(0xfff8f0, 1.8, 0, 0.2, 1);
    spot.position.set(6, 10, 6);
    scene.add(spot);

    const dir = new Three.DirectionalLight(0xc7d2fe, 0.5);
    dir.position.set(-3, 5, -3);
    scene.add(dir);

    // ── Chair group (rotation target) ──
    const chairGroup = new Three.Group();
    chairGroup.rotation.set(rotationRef.current.x, rotationRef.current.y, 0);
    scene.add(chairGroup);
    chairGroupRef.current = chairGroup;

    // ── Load GLB model ──
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.5/");
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load(CHAIR_MODEL, (gltf) => {
      const model = gltf.scene;
      model.scale.setScalar(3.0);
      model.position.set(0, -0.5, 0);
      chairGroup.add(model);

      // Tag every mesh with its purchasable part and give that part its own materials.
      for (const piece of model.getObjectByName("Soft_Lounge_Chair")?.children ?? []) {
        const partId = partForPiece(piece);
        if (!partId) {
          continue;
        }
        piece.traverse((child) => {
          const mesh = child as Three.Mesh;
          if (!mesh.isMesh) {
            return;
          }
          const mat = (mesh.material as Three.MeshStandardMaterial).clone();
          mesh.material = mat;
          mesh.userData.partId = partId;
          const list = partMaterialsRef.current.get(partId) ?? [];
          list.push(mat);
          partMaterialsRef.current.set(partId, list);
          const meshes = partMeshesRef.current.get(partId) ?? [];
          meshes.push(mesh);
          partMeshesRef.current.set(partId, meshes);
        });
      }
      setModelReady(true);
    });

    // ── Load HDR environment ──
    import("three/examples/jsm/loaders/RGBELoader.js").then(({ RGBELoader }) => {
      const rgbeLoader = new RGBELoader();
      rgbeLoader.load(STUDIO_HDR, (texture) => {
        texture.mapping = Three.EquirectangularReflectionMapping;
        scene.environment = texture;
        scene.environmentIntensity = 0.75;
      });
    });

    // ── Contact shadow (radial gradient for soft fade) ──
    const ShadowSize = 4;
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const ctx = shadowCanvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      gradient.addColorStop(0, "rgba(0,0,0,0.15)");
      gradient.addColorStop(0.6, "rgba(0,0,0,0.06)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new Three.CanvasTexture(shadowCanvas);
    const shadowGeo = new Three.PlaneGeometry(ShadowSize, ShadowSize);
    const shadowMat = new Three.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false
    });
    const shadowPlane = new Three.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.6;
    scene.add(shadowPlane);

    // ── Selection outline ──
    // Brand-coloured outline around the selected part, also traced faintly where other pieces hide it.
    // Post-processing runs only while something is selected; otherwise the plain render is used.
    const composer = new EffectComposer(
      renderer,
      new Three.WebGLRenderTarget(width, height, { type: Three.HalfFloatType, samples: 4 })
    );
    composer.setPixelRatio(renderer.getPixelRatio());
    composer.setSize(width, height);
    composer.addPass(new RenderPass(scene, camera));
    const outline = new OutlinePass(new Three.Vector2(width, height), scene, camera);
    outline.visibleEdgeColor.set(brandConfig.colors.primary);
    outline.hiddenEdgeColor.set(brandConfig.colors.primary).multiplyScalar(0.45);
    outline.edgeStrength = 6;
    outline.edgeThickness = 1.6;
    outline.edgeGlow = 0;
    outline.pulsePeriod = 0;
    composer.addPass(outline);
    outlineRef.current = outline;
    // Tone map + sRGB like a plain render, un-premultiplying so edges over the transparent canvas
    // don't darken (same patch as the chair story scene).
    const output = new OutputPass();
    const fs = output.material.fragmentShader;
    const end = fs.lastIndexOf("}");
    output.material.fragmentShader = `${fs
      .slice(0, end)
      .replace(
        "gl_FragColor = texture2D( tDiffuse, vUv );",
        "gl_FragColor = texture2D( tDiffuse, vUv );\n\t\t\tfloat coverage = gl_FragColor.a;\n\t\t\tif ( coverage > 0.0 ) gl_FragColor.rgb /= coverage;"
      )}\tgl_FragColor.rgb *= coverage;\n}`;
    composer.addPass(output);

    // ── Render loop ──
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      if (outline.selectedObjects.length) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
    };
    animFrameRef.current = requestAnimationFrame(animate);

    // ── Pointer interaction (drag to rotate + click to select) ──
    const canvas = renderer.domElement;
    canvas.style.cursor = "grab";
    canvas.style.touchAction = "none"; // Prevent browser touch gestures

    // Ignore clicks that arrive right after mount (e.g. the "Parts" tab click)
    const mountTime = Date.now();
    const MountGuardMs = 400;

    // Drag detection: require both distance (>6px) and time (>80ms) to
    // distinguish an intentional drag from a slightly messy tap/click.
    const DragDeadZone = 6; // px
    const DragTimeMs = 80; // ms after pointerdown before drag can start
    let pointerDownTime = 0;
    let pointerDownPos = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = false;
      pointerDownTime = Date.now();
      pointerDownPos = { x: e.clientX, y: e.clientY };
      prevPointerRef.current = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.buttons === 0) {
        return;
      }

      const dx = e.clientX - prevPointerRef.current.x;
      const dy = e.clientY - prevPointerRef.current.y;

      if (!isDraggingRef.current) {
        const totalDx = e.clientX - pointerDownPos.x;
        const totalDy = e.clientY - pointerDownPos.y;
        const dist = Math.sqrt(totalDx * totalDx + totalDy * totalDy);
        const elapsed = Date.now() - pointerDownTime;

        if (dist > DragDeadZone && elapsed > DragTimeMs) {
          isDraggingRef.current = true;
          // Reset to current position so the first rotation delta is zero
          prevPointerRef.current = { x: e.clientX, y: e.clientY };
        }
        return; // Not yet dragging
      }

      rotationRef.current.y += dx * 0.008;
      rotationRef.current.x += dy * 0.004;
      rotationRef.current.x = Math.max(-Math.PI / 6, Math.min(Math.PI / 6, rotationRef.current.x));
      chairGroup.rotation.set(rotationRef.current.x, rotationRef.current.y, 0);
      prevPointerRef.current = { x: e.clientX, y: e.clientY };
    };

    // offsetX/Y are in the canvas's own (untransformed) pixels, so taps stay accurate while the
    // passport sits inside the tilted, scaled 3D phone; client coords + getBoundingClientRect don't.
    const doRaycast = (offsetX: number, offsetY: number) => {
      if (Date.now() - mountTime < MountGuardMs) {
        return;
      }
      if (chairGroup.children.length === 0) {
        return;
      }
      const ndcX = (offsetX / canvas.clientWidth) * 2 - 1;
      const ndcY = -(offsetY / canvas.clientHeight) * 2 + 1;
      pointerRef.current.set(ndcX, ndcY);

      raycasterRef.current.setFromCamera(pointerRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(chairGroup.children, true);

      // Every piece belongs to a purchasable part; a tap on empty space selects nothing.
      const partId = intersects[0]?.object.userData.partId as string | undefined;
      if (partId) {
        onPartClickRef.current(partId);
      }
    };

    let handledByPointerUp = false;

    const onPointerUp = (e: PointerEvent) => {
      canvas.style.cursor = "grab";
      if (!isDraggingRef.current) {
        handledByPointerUp = true;
        doRaycast(e.offsetX, e.offsetY);
      }
    };

    // Fallback for environments (e.g. Playwright) that only fire click events
    const onClick = (e: MouseEvent) => {
      if (handledByPointerUp) {
        handledByPointerUp = false;
        return; // Already handled by pointerup
      }
      doRaycast(e.offsetX, e.offsetY);
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("click", onClick);

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("click", onClick);
      composer.dispose();
      outline.dispose();
      output.dispose();
      outlineRef.current = null;
      renderer.dispose();
      dracoLoader.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Tint and outline the selected part in the brand colour (pale oak needs a colour shift, a glow alone
  // doesn't show); everything else returns to its own finish.
  // biome-ignore lint/correctness/useExhaustiveDependencies: modelReady is an intentional trigger — apply the highlight once the model has loaded
  useEffect(() => {
    const brand = new Three.Color(brandConfig.colors.primary);
    for (const [partId, materials] of partMaterialsRef.current) {
      for (const mat of materials) {
        const original: Three.Color = (mat.userData.baseColor ??= mat.color.clone());
        const on = partId === selectedPartId;
        mat.color.copy(original);
        if (on) {
          mat.color.lerp(brand, 0.7);
        }
        mat.emissive.set(on ? brand : 0x000000);
        mat.emissiveIntensity = on ? 0.35 : 0;
      }
    }
    if (outlineRef.current) {
      outlineRef.current.selectedObjects = selectedPartId ? (partMeshesRef.current.get(selectedPartId) ?? []) : [];
    }
  }, [selectedPartId, modelReady]);
}

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

/** Cart icon with a + sign — used on the "Add to cart" button */
function AddToBasketIcon({ size = 16, color = "white" }: { size?: number; color?: string }) {
  return (
    <svg className="block shrink-0" width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M0.5 2.5C0.5 2.22386 0.723858 2 1 2H3.5C3.72324 2 3.91943 2.14799 3.98076 2.36264L5.87715 9H13.1096L14.3596 4H13C12.7239 4 12.5 3.77614 12.5 3.5C12.5 3.22386 12.7239 3 13 3H15C15.154 3 15.2993 3.07094 15.3941 3.19229C15.4889 3.31365 15.5224 3.4719 15.4851 3.62127L13.9851 9.62127C13.9294 9.84385 13.7294 10 13.5 10H5.5C5.27676 10 5.08057 9.85201 5.01924 9.63736L3.12285 3H1C0.723858 3 0.5 2.77614 0.5 2.5Z"
        fill={color}
      />
      <path
        d="M9.5 3.5C9.77614 3.5 10 3.72386 10 4V5H11C11.2761 5 11.5 5.22386 11.5 5.5C11.5 5.77614 11.2761 6 11 6H10V7C10 7.27614 9.77614 7.5 9.5 7.5C9.22386 7.5 9 7.27614 9 7V6H8C7.72386 6 7.5 5.77614 7.5 5.5C7.5 5.22386 7.72386 5 8 5H9V4C9 3.72386 9.22386 3.5 9.5 3.5Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 15C8.10457 15 9 14.1046 9 13C9 11.8954 8.10457 11 7 11C5.89543 11 5 11.8954 5 13C5 14.1046 5.89543 15 7 15ZM7 14C7.55228 14 8 13.5523 8 13C8 12.4477 7.55228 12 7 12C6.44772 12 6 12.4477 6 13C6 13.5523 6.44772 14 7 14Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 13C14 14.1046 13.1046 15 12 15C10.8954 15 10 14.1046 10 13C10 11.8954 10.8954 11 12 11C13.1046 11 14 11.8954 14 13ZM13 13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13C11 12.4477 11.4477 12 12 12C12.5523 12 13 12.4477 13 13Z"
        fill={color}
      />
    </svg>
  );
}

/** Plain cart icon — used on the checkout button */
export function BasketIcon({ size = 18, color = "white" }: { size?: number; color?: string }) {
  return (
    <svg className="block shrink-0" width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M7 11C8.10457 11 9 11.8954 9 13C9 14.1046 8.10457 15 7 15C5.89543 15 5 14.1046 5 13C5 11.8954 5.89543 11 7 11ZM12 11C13.1046 11 14 11.8954 14 13C14 14.1046 13.1046 15 12 15C10.8954 15 10 14.1046 10 13C10 11.8954 10.8954 11 12 11ZM7 12C6.44772 12 6 12.4477 6 13C6 13.5523 6.44772 14 7 14C7.55228 14 8 13.5523 8 13C8 12.4477 7.55228 12 7 12ZM12 12C11.4477 12 11 12.4477 11 13C11 13.5523 11.4477 14 12 14C12.5523 14 13 13.5523 13 13C13 12.4477 12.5523 12 12 12ZM3.5 2C3.72311 2 3.91901 2.14786 3.98047 2.3623L5.87695 9H13.1094L14.3594 4H7C6.72386 4 6.5 3.77614 6.5 3.5C6.5 3.22386 6.72386 3 7 3H15C15.154 3 15.2998 3.07102 15.3945 3.19238C15.4891 3.31364 15.5226 3.4719 15.4854 3.62109L13.9854 9.62109C13.9297 9.84368 13.7294 10 13.5 10H5.5C5.27689 10 5.08099 9.85214 5.01953 9.6377L3.12305 3H1C0.723858 3 0.5 2.77614 0.5 2.5C0.5 2.22386 0.723858 2 1 2H3.5Z"
        fill={color}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Main view                                                         */
/* ------------------------------------------------------------------ */

interface DppProductViewProps {
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  overlayRef?: React.RefObject<HTMLDivElement | null>;
  onAddToCart?: (partId: string, quantity: number) => void;
}

export function DppProductView({ overlayRef, onAddToCart }: DppProductViewProps) {
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Motion values for drag-to-dismiss
  const dragY = useMotionValue(0);
  const sheetScale = useTransform(dragY, [0, 200], [1, 0.95]);
  const sheetOpacity = useTransform(dragY, [0, 200], [1, 0]);

  // Reset drag value when the sheet opens. sheetOpen is an intentional trigger (the body resets
  // dragY every time the sheet toggles open), not a value read in the effect.
  // biome-ignore lint/correctness/useExhaustiveDependencies: sheetOpen is the reset trigger, not a read dependency
  useEffect(() => {
    dragY.set(0);
  }, [sheetOpen, dragY]);

  const handlePartClick = useCallback((partId: string) => {
    setSelectedPartId(partId);
    setSheetOpen(true);
    setQuantity(1);
  }, []);

  const handleClose = useCallback(() => {
    setSheetOpen(false);
    setSelectedPartId(null);
  }, []);

  // Imperative Three.js scene
  useChairCanvas(canvasContainerRef, handlePartClick, selectedPartId);

  // Close on Escape
  useEffect(() => {
    if (!sheetOpen) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sheetOpen, handleClose]);

  const part = selectedPartId ? parts[selectedPartId] : null;

  return (
    <div className="relative w-full" style={{ height: `${812 - 145 - 94}px` }}>
      {/* Three.js canvas container */}
      <div ref={canvasContainerRef} className="absolute inset-0" />

      {/* Highlight label for selected part */}
      <AnimatePresence>
        {selectedPartId && (
          <motion.div
            key={selectedPartId}
            className="pointer-events-none absolute right-[16px] left-[16px] z-10"
            style={{ top: "12px" }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="inline-flex items-center gap-[6px] rounded-full px-[10px] py-[4px] font-medium text-[11px] text-white backdrop-blur-md"
              style={{ backgroundColor: `${brandConfig.colors.primary}cc` }}
            >
              <div className="size-[6px] animate-pulse rounded-full bg-white" />
              {parts[selectedPartId]?.name} selected
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onboarding Hint — portalled to overlay so it's not clipped by scroll overflow */}
      {overlayRef?.current &&
        createPortal(
          <AnimatePresence>
            {!selectedPartId && (
              <motion.div
                className="absolute right-[20px] left-[20px]"
                style={{ bottom: 168, pointerEvents: "auto" }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="relative overflow-hidden rounded-[10px] bg-black/30 backdrop-blur-lg">
                  <p className="px-[16px] py-[12px] pr-[70px] font-['SF_Pro:Regular',sans-serif] text-[13px] text-white leading-[18px] tracking-[-0.02px]">
                    Use touch gestures to navigate the model and select the individual parts
                  </p>
                  <div className="pointer-events-none absolute top-0 right-[8px] bottom-0 w-[55px]">
                    <iframe
                      src={`${import.meta.env.BASE_URL}TouchGestureAnimationMobile.svg`}
                      className="h-full w-full border-none bg-transparent"
                      title="Touch gesture animation"
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          overlayRef.current
        )}

      {/* Bottom Sheet Overlay — portalled to the phone's overlay container
			   so it isn't clipped by the scroll area's overflow:auto */}
      {overlayRef?.current &&
        createPortal(
          <AnimatePresence>
            {sheetOpen && part && (
              <>
                {/* Backdrop — tapping outside the card closes it */}
                <motion.div
                  key="backdrop"
                  className="absolute inset-0"
                  style={{ pointerEvents: "auto" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleClose}
                />
                {/* Sheet */}
                <motion.div
                  key="bottom-sheet"
                  role="dialog"
                  aria-label="Part details"
                  className="absolute right-[16px] left-[16px] rounded-[16px] bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.12)]"
                  style={{ bottom: 84, scale: sheetScale, opacity: sheetOpacity, pointerEvents: "auto" }}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "100%", opacity: 0 }}
                  transition={{ type: "spring", damping: 28, stiffness: 300 }}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ top: 0, bottom: 0.6 }}
                  onDrag={(_e, info) => {
                    if (info.offset.y > 0) {
                      dragY.set(info.offset.y);
                    }
                  }}
                  onDragEnd={(_e, { offset, velocity }) => {
                    if (offset.y > 100 || velocity.y > 500) {
                      handleClose();
                    } else {
                      dragY.set(0);
                    }
                  }}
                >
                  {/* Drag Handle */}
                  <div className="flex justify-center pt-[8px] pb-[4px]">
                    <div className="h-[4px] w-[36px] rounded-[2px] bg-[rgba(0,8,47,0.20)]" />
                  </div>

                  {/* Content */}
                  <div className="px-[20px] pt-[8px] pb-[28px]">
                    {/* Part Image + Info Row */}
                    <div className="mb-[20px] flex items-start gap-[16px]">
                      {/* Part Image */}
                      <div className="relative size-[80px] shrink-0 overflow-hidden rounded-[10px] p-[4px]">
                        {part.image ? (
                          <img src={part.image} alt={part.name} className="size-full rounded-[8px] object-contain" />
                        ) : (
                          <DppPartThumb partId={part.id} label={`3D view of the ${part.name}`} />
                        )}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 rounded-[10px] border border-[rgba(1,6,47,0.12)]"
                        />
                      </div>

                      {/* Part Details */}
                      <div className="min-w-0 flex-1 pt-[2px]">
                        <h3 className="mb-[2px] overflow-hidden text-ellipsis text-nowrap font-['SF_Pro:Bold',sans-serif] font-bold font-width-normal text-[18px] text-[rgba(0,7,19,0.72)] leading-[24px]">
                          {part.name}
                        </h3>
                        <p className="mb-[4px] font-['SF_Pro:Regular',sans-serif] font-normal font-width-normal text-[14px] text-[rgba(0,4,29,0.58)] leading-[20px]">
                          {part.weight} · {part.material}
                        </p>
                        <p className="font-['SF_Pro:Bold',sans-serif] font-bold font-width-normal text-[18px] text-[rgba(0,7,19,0.72)] leading-[24px]">
                          {part.price}
                        </p>
                      </div>
                    </div>

                    {/* Quantity + Add to Cart Row */}
                    <div className="flex items-center gap-[12px]">
                      {/* Quantity Selector */}
                      <div className="flex h-[44px] shrink-0 items-center rounded-[8px] bg-[rgba(0,0,0,0.04)]">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="flex size-[44px] cursor-pointer select-none items-center justify-center rounded-l-[8px] font-medium text-[20px] text-[rgba(0,7,19,0.58)] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-[32px] text-center font-['SF_Pro:Medium',sans-serif] font-[510] font-width-normal text-[16px] text-[rgba(0,7,19,0.72)] leading-[24px]">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="flex size-[44px] cursor-pointer select-none items-center justify-center rounded-r-[8px] font-medium text-[20px] text-[rgba(0,7,19,0.58)] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedPartId) {
                            onAddToCart?.(selectedPartId, quantity);
                          }
                          handleClose();
                        }}
                        className="h-[44px] flex-1 cursor-pointer rounded-[8px] opacity-[0.92] transition-opacity hover:opacity-100"
                        style={{ backgroundColor: brandConfig.colors.primary }}
                        aria-label={`Add ${part.name} to cart`}
                      >
                        <div className="flex size-full items-center justify-center gap-[10px]">
                          <span className="font-['SF_Pro:Medium',sans-serif] font-[510] font-width-normal text-[16px] text-white leading-[24px]">
                            Add to cart
                          </span>
                          <AddToBasketIcon size={24} />
                        </div>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          overlayRef.current
        )}
    </div>
  );
}
