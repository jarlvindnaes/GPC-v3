import { AnimatePresence, motion, useMotionValue, useTransform } from "motion/react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { brandConfig } from "./dppBrandConfig";
import { slopeChair } from "./dppProductData";
import type { PurchasablePart } from "./dppTypes";

const data = slopeChair;

const parts: Record<string, PurchasablePart> = {};
for (const part of data.materialsAndComponents.purchasableParts) {
	parts[part.id] = part;
}

const CHAIR_MODEL = `${import.meta.env.BASE_URL}models/west_elm_slope_leather_chair.glb`;
const STUDIO_HDR = `${import.meta.env.BASE_URL}hdri/studio_small_03_1k.hdr`;

/**
 * World-space Y threshold for splitting the chair into upper (seat) and
 * lower (legs) halves. Set well above the geometric midpoint so the legs
 * clickable area extends up to the seat surface level — only the top
 * face of the cushion counts as "seat", everything below is "leg".
 */
const CHAIR_Y_MIDPOINT = 0.35;

/* ------------------------------------------------------------------ */
/*  Imperative Three.js chair viewer (avoids R3F StrictMode ctx loss)  */
/* ------------------------------------------------------------------ */

function useChairCanvas(
	containerRef: React.RefObject<HTMLDivElement | null>,
	onPartClick: (partId: string) => void,
) {
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	const sceneRef = useRef<THREE.Scene | null>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const chairGroupRef = useRef<THREE.Group | null>(null);
	const raycasterRef = useRef(new THREE.Raycaster());
	const pointerRef = useRef(new THREE.Vector2());
	const rotationRef = useRef({ y: -Math.PI / 5, x: 0.08 });
	const isDraggingRef = useRef(false);
	const prevPointerRef = useRef({ x: 0, y: 0 });
	const animFrameRef = useRef(0);
	const floatTimeRef = useRef(0);

	// Stable callback ref so the effect doesn't re-run when onPartClick changes
	const onPartClickRef = useRef(onPartClick);
	onPartClickRef.current = onPartClick;

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const width = container.clientWidth;
		const height = container.clientHeight;

		// ── Scene ──
		const scene = new THREE.Scene();
		sceneRef.current = scene;

		// ── Camera ──
		const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
		camera.position.set(0, 0.5, 5.0);
		cameraRef.current = camera;

		// ── Renderer ──
		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setSize(width, height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setClearColor(0x000000, 0);
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1.0;
		container.appendChild(renderer.domElement);
		rendererRef.current = renderer;

		// ── Lights ──
		const ambient = new THREE.AmbientLight(0xffffff, 0.8);
		scene.add(ambient);

		const spot = new THREE.SpotLight(0xfff8f0, 3, 0, 0.2, 1);
		spot.position.set(6, 10, 6);
		scene.add(spot);

		const dir = new THREE.DirectionalLight(0xc7d2fe, 0.5);
		dir.position.set(-3, 5, -3);
		scene.add(dir);

		// ── Chair group (rotation target) ──
		const chairGroup = new THREE.Group();
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
		});

		// ── Load HDR environment ──
		import("three/examples/jsm/loaders/RGBELoader.js").then(({ RGBELoader }) => {
			const rgbeLoader = new RGBELoader();
			rgbeLoader.load(STUDIO_HDR, (texture) => {
				texture.mapping = THREE.EquirectangularReflectionMapping;
				scene.environment = texture;
			});
		});

		// ── Contact shadow (radial gradient for soft fade) ──
		const SHADOW_SIZE = 4;
		const shadowCanvas = document.createElement("canvas");
		shadowCanvas.width = 256;
		shadowCanvas.height = 256;
		const ctx = shadowCanvas.getContext("2d")!;
		const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
		gradient.addColorStop(0, "rgba(0,0,0,0.15)");
		gradient.addColorStop(0.6, "rgba(0,0,0,0.06)");
		gradient.addColorStop(1, "rgba(0,0,0,0)");
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, 256, 256);
		const shadowTex = new THREE.CanvasTexture(shadowCanvas);
		const shadowGeo = new THREE.PlaneGeometry(SHADOW_SIZE, SHADOW_SIZE);
		const shadowMat = new THREE.MeshBasicMaterial({
			map: shadowTex,
			transparent: true,
			depthWrite: false,
		});
		const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
		shadowPlane.rotation.x = -Math.PI / 2;
		shadowPlane.position.y = -0.6;
		scene.add(shadowPlane);

		// ── Render loop ──
		const animate = () => {
			animFrameRef.current = requestAnimationFrame(animate);
			floatTimeRef.current += 0.016;

			// Gentle float oscillation
			if (chairGroup.children.length > 0) {
				const model = chairGroup.children[0];
				model.position.y = -0.5 + Math.sin(floatTimeRef.current * 1.5) * 0.02;
			}

			renderer.render(scene, camera);
		};
		animFrameRef.current = requestAnimationFrame(animate);

		// ── Pointer interaction (drag to rotate + click to select) ──
		const canvas = renderer.domElement;
		canvas.style.cursor = "grab";

		// Ignore clicks that arrive right after mount (e.g. the "Parts" tab click)
		const mountTime = Date.now();
		const MOUNT_GUARD_MS = 400;

		const onPointerDown = (e: PointerEvent) => {
			isDraggingRef.current = false;
			prevPointerRef.current = { x: e.clientX, y: e.clientY };
			canvas.style.cursor = "grabbing";
		};

		const onPointerMove = (e: PointerEvent) => {
			if (e.buttons === 0) return;

			const dx = e.clientX - prevPointerRef.current.x;
			const dy = e.clientY - prevPointerRef.current.y;

			if (!isDraggingRef.current) {
				if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
					isDraggingRef.current = true;
					// Reset to current position so the first rotation delta is zero
					prevPointerRef.current = { x: e.clientX, y: e.clientY };
					return;
				}
				return; // Still within dead-zone
			}

			rotationRef.current.y += dx * 0.008;
			rotationRef.current.x += dy * 0.004;
			rotationRef.current.x = Math.max(-Math.PI / 6, Math.min(Math.PI / 6, rotationRef.current.x));
			chairGroup.rotation.set(rotationRef.current.x, rotationRef.current.y, 0);
			prevPointerRef.current = { x: e.clientX, y: e.clientY };
		};

		const doRaycast = (clientX: number, clientY: number) => {
			if (Date.now() - mountTime < MOUNT_GUARD_MS) return;
			if (chairGroup.children.length === 0) return;
			const rect = canvas.getBoundingClientRect();
			const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
			const ndcY = -((clientY - rect.top) / rect.height) * 2 + 1;
			pointerRef.current.set(ndcX, ndcY);

			raycasterRef.current.setFromCamera(pointerRef.current, camera);
			const intersects = raycasterRef.current.intersectObjects(chairGroup.children, true);

			if (intersects.length > 0) {
				// Direct hit on geometry — use 3D intersection point
				const hitY = intersects[0].point.y;
				onPartClickRef.current(hitY > CHAIR_Y_MIDPOINT ? "seat-cushion" : "leg");
			} else {
				// No geometry hit (thin legs are hard to raycast).
				// Fall back to 2D screen position: lower ~55% of canvas → legs.
				const SCREEN_LEG_THRESHOLD = 0.3; // NDC y below this → legs
				if (ndcY < SCREEN_LEG_THRESHOLD) {
					onPartClickRef.current("leg");
				}
				// If above threshold but missed geometry, ignore (empty space above chair)
			}
		};

		let handledByPointerUp = false;

		const onPointerUp = (e: PointerEvent) => {
			canvas.style.cursor = "grab";
			if (!isDraggingRef.current) {
				handledByPointerUp = true;
				doRaycast(e.clientX, e.clientY);
			}
		};

		// Fallback for environments (e.g. Playwright) that only fire click events
		const onClick = (e: MouseEvent) => {
			if (handledByPointerUp) {
				handledByPointerUp = false;
				return; // Already handled by pointerup
			}
			doRaycast(e.clientX, e.clientY);
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
			renderer.dispose();
			dracoLoader.dispose();
			if (container.contains(renderer.domElement)) {
				container.removeChild(renderer.domElement);
			}
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps
}

/* ------------------------------------------------------------------ */
/*  Add-to-basket icon                                                */
/* ------------------------------------------------------------------ */

function AddToBasketIcon() {
	return (
		<div className="relative shrink-0 size-[18px]">
			<svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18" aria-hidden="true">
				<rect fill="white" fillOpacity="0.01" height="18" width="18" />
				<path
					d="M7.875 12.375C9.11764 12.375 10.125 13.3824 10.125 14.625C10.125 15.8676 9.11764 16.875 7.875 16.875C6.63236 16.875 5.625 15.8676 5.625 14.625C5.625 13.3824 6.63236 12.375 7.875 12.375ZM13.5 12.375C14.7426 12.375 15.75 13.3824 15.75 14.625C15.75 15.8676 14.7426 16.875 13.5 16.875C12.2574 16.875 11.25 15.8676 11.25 14.625C11.25 13.3824 12.2574 12.375 13.5 12.375ZM7.875 13.5C7.25368 13.5 6.75 14.0037 6.75 14.625C6.75 15.2463 7.25368 15.75 7.875 15.75C8.49632 15.75 9 15.2463 9 14.625C9 14.0037 8.49632 13.5 7.875 13.5ZM13.5 13.5C12.8787 13.5 12.375 14.0037 12.375 14.625C12.375 15.2463 12.8787 15.75 13.5 15.75C14.1213 15.75 14.625 15.2463 14.625 14.625C14.625 14.0037 14.1213 13.5 13.5 13.5ZM3.9375 2.25C4.18865 2.25 4.40952 2.41672 4.47852 2.6582L6.61133 10.125H14.748L16.1543 4.5H14.625C14.3143 4.5 14.0625 4.24816 14.0625 3.9375C14.0625 3.62684 14.3143 3.375 14.625 3.375H16.875C17.0482 3.375 17.2118 3.45527 17.3184 3.5918C17.4248 3.72829 17.4629 3.90629 17.4209 4.07422L15.7334 10.8242C15.6707 11.0745 15.4455 11.25 15.1875 11.25H6.1875C5.93635 11.25 5.71548 11.0833 5.64648 10.8418L3.51367 3.375H1.125C0.81434 3.375 0.5625 3.12316 0.5625 2.8125C0.5625 2.50184 0.81434 2.25 1.125 2.25H3.9375ZM10.6875 3.9375C10.9982 3.9375 11.25 4.18934 11.25 4.5V5.625H12.375C12.6857 5.625 12.9375 5.87684 12.9375 6.1875C12.9375 6.49816 12.6857 6.75 12.375 6.75H11.25V7.875C11.25 8.18566 10.9982 8.4375 10.6875 8.4375C10.3768 8.4375 10.125 8.18566 10.125 7.875V6.75H9C8.68934 6.75 8.4375 6.49816 8.4375 6.1875C8.4375 5.87684 8.68934 5.625 9 5.625H10.125V4.5C10.125 4.18934 10.3768 3.9375 10.6875 3.9375Z"
					fill="white"
				/>
			</svg>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  Main view                                                         */
/* ------------------------------------------------------------------ */

interface DppProductViewProps {
	scrollRef?: React.RefObject<HTMLDivElement | null>;
	overlayRef?: React.RefObject<HTMLDivElement | null>;
}

export function DppProductView({ scrollRef, overlayRef }: DppProductViewProps) {
	const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
	const [hasInteracted, setHasInteracted] = useState(false);
	const [quantity, setQuantity] = useState(1);

	const canvasContainerRef = useRef<HTMLDivElement>(null);

	// Motion values for drag-to-dismiss
	const dragYMotion = useMotionValue(0);
	const backdropOpacity = useTransform(dragYMotion, [0, 200], [1, 0]);
	const sheetScale = useTransform(dragYMotion, [0, 200], [1, 0.95]);
	const sheetOpacity = useTransform(dragYMotion, [0, 200], [1, 0]);

	// Reset drag value when part changes
	useEffect(() => {
		dragYMotion.set(0);
	}, [selectedPartId, dragYMotion]);

	const handlePartClick = useCallback((partId: string) => {
		setSelectedPartId(partId);
		setQuantity(1);
		setHasInteracted(true);
	}, []);

	const handleClose = useCallback(() => {
		setSelectedPartId(null);
	}, []);

	// Imperative Three.js scene
	useChairCanvas(canvasContainerRef, handlePartClick);

	// Close on Escape
	useEffect(() => {
		if (!selectedPartId) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") handleClose();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [selectedPartId, handleClose]);

	const part = selectedPartId ? parts[selectedPartId] : null;

	return (
		<div className="relative w-full" style={{ height: `${812 - 145 - 94}px` }}>
			{/* Three.js canvas container */}
			<div
				ref={canvasContainerRef}
				className="absolute inset-0"
			/>

			{/* Highlight label for selected part */}
			<AnimatePresence>
				{selectedPartId && (
					<motion.div
						key={selectedPartId}
						className="absolute left-[16px] right-[16px] pointer-events-none z-10"
						style={{ top: "12px" }}
						initial={{ opacity: 0, y: -8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.2 }}
					>
						<div
							className="inline-flex items-center gap-[6px] rounded-full px-[10px] py-[4px] text-white text-[11px] font-medium backdrop-blur-md"
							style={{ backgroundColor: `${brandConfig.colors.primary}cc` }}
						>
							<div className="size-[6px] rounded-full bg-white animate-pulse" />
							{selectedPartId === "seat-cushion" ? "Seat" : "Legs"} selected
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Onboarding Hint */}
			<AnimatePresence>
				{!selectedPartId && !hasInteracted && (
					<motion.div
						className="absolute left-[16px] right-[16px] z-20"
						style={{ bottom: 16 }}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 10 }}
						transition={{ duration: 0.3, ease: "easeOut" }}
					>
						<div className="backdrop-blur-lg bg-black/30 rounded-[10px] overflow-hidden">
							<p className="font-['SF_Pro:Regular',sans-serif] text-[13px] text-white tracking-[-0.02px] px-[16px] py-[12px] leading-[18px] text-center">
								Tap a part of the chair to explore spare parts
							</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Bottom Sheet Overlay — portalled to the phone's overlay container
			   so it isn't clipped by the scroll area's overflow:auto */}
			{overlayRef?.current && createPortal(
				<AnimatePresence>
					{selectedPartId && part && (
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
								className="absolute left-[16px] right-[16px] bg-white rounded-[16px] shadow-[0_-4px_24px_rgba(0,0,0,0.12)]"
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
										dragYMotion.set(info.offset.y);
									}
								}}
								onDragEnd={(_e, { offset, velocity }) => {
									if (offset.y > 100 || velocity.y > 500) {
										handleClose();
									} else {
										dragYMotion.set(0);
									}
								}}
							>
								{/* Drag Handle */}
								<div className="flex justify-center pt-[8px] pb-[4px]">
									<div className="bg-[rgba(0,8,47,0.20)] h-[4px] rounded-[2px] w-[36px]" />
								</div>

								{/* Content */}
								<div className="px-[20px] pt-[8px] pb-[28px]">
									{/* Part Image + Info Row */}
									<div className="flex gap-[16px] items-start mb-[20px]">
										{/* Part Image */}
										<div className="rounded-[10px] size-[80px] shrink-0 overflow-hidden relative p-[4px]">
											<img
												src={part.image}
												alt={part.name}
												className="object-contain rounded-[8px] size-full"
											/>
											<div
												aria-hidden="true"
												className="absolute border border-[rgba(1,6,47,0.12)] inset-0 pointer-events-none rounded-[10px]"
											/>
										</div>

										{/* Part Details */}
										<div className="flex-1 min-w-0 pt-[2px]">
											<h3 className="font-['SF_Pro:Bold',sans-serif] font-bold text-[18px] text-[rgba(0,7,19,0.72)] leading-[24px] mb-[2px] overflow-hidden text-ellipsis text-nowrap font-width-normal">
												{part.name}
											</h3>
											<p className="font-['SF_Pro:Regular',sans-serif] font-normal text-[14px] text-[rgba(0,4,29,0.58)] leading-[20px] mb-[4px] font-width-normal">
												{part.weight} · {part.material}
											</p>
											<p className="font-['SF_Pro:Bold',sans-serif] font-bold text-[18px] text-[rgba(0,7,19,0.72)] leading-[24px] font-width-normal">
												{part.price}
											</p>
										</div>
									</div>

									{/* Quantity + Add to Cart Row */}
									<div className="flex gap-[12px] items-center">
										{/* Quantity Selector */}
										<div className="flex items-center bg-[rgba(0,0,0,0.04)] rounded-[8px] h-[44px] shrink-0">
											<button
												type="button"
												onClick={() => setQuantity(Math.max(1, quantity - 1))}
												className="flex items-center justify-center size-[44px] text-[20px] text-[rgba(0,7,19,0.58)] font-medium cursor-pointer select-none rounded-l-[8px] hover:bg-[rgba(0,0,0,0.04)] transition-colors"
												aria-label="Decrease quantity"
											>
												-
											</button>
											<span className="w-[32px] text-center font-['SF_Pro:Medium',sans-serif] font-[510] text-[16px] text-[rgba(0,7,19,0.72)] leading-[24px] font-width-normal">
												{quantity}
											</span>
											<button
												type="button"
												onClick={() => setQuantity(quantity + 1)}
												className="flex items-center justify-center size-[44px] text-[20px] text-[rgba(0,7,19,0.58)] font-medium cursor-pointer select-none rounded-r-[8px] hover:bg-[rgba(0,0,0,0.04)] transition-colors"
												aria-label="Increase quantity"
											>
												+
											</button>
										</div>

										{/* Add to Cart Button */}
										<button
											type="button"
											onClick={() => handleClose()}
											className="flex-1 h-[44px] rounded-[8px] cursor-pointer hover:opacity-100 transition-opacity opacity-[0.92]"
											style={{ backgroundColor: brandConfig.colors.primary }}
											aria-label={`Add ${part.name} to cart`}
										>
											<div className="flex items-center justify-center gap-[10px] size-full">
												<span className="font-['SF_Pro:Medium',sans-serif] font-[510] text-[16px] text-white leading-[24px] font-width-normal">
													Add to cart
												</span>
												<AddToBasketIcon />
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
