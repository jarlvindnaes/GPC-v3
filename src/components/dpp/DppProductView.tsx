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

export const parts: Record<string, PurchasablePart> = {};
for (const part of data.materialsAndComponents.purchasableParts) {
	parts[part.id] = part;
}

const CHAIR_MODEL = `${import.meta.env.BASE_URL}models/west_elm_slope_leather_chair.glb`;
const STUDIO_HDR = `${import.meta.env.BASE_URL}hdri/studio_small_03_1k.hdr`;

// Pre-baked texture variants: default, seat highlighted, legs highlighted
const TEX_DEFAULT = `${import.meta.env.BASE_URL}models/chair_default.jpg`;
const TEX_SEAT = `${import.meta.env.BASE_URL}models/chair_seat_selected.jpg`;
const TEX_LEGS = `${import.meta.env.BASE_URL}models/chair_legs_selected.jpg`;

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
	selectedPartId: string | null,
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

	// Pre-loaded texture variants keyed by part id (null = default)
	const texturesRef = useRef<Map<string | null, THREE.Texture>>(new Map());
	const chairMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
	const [texturesReady, setTexturesReady] = useState(false);

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
		camera.position.set(0, 0.03, 5.0);
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

			// Grab the material for texture swapping
			model.traverse((child) => {
				if ((child as THREE.Mesh).isMesh) {
					const mesh = child as THREE.Mesh;
					const mat = mesh.material as THREE.MeshStandardMaterial;
					chairMaterialRef.current = mat;

					// Preload texture variants
					const texLoader = new THREE.TextureLoader();
					const variants: [string | null, string][] = [
						[null, TEX_DEFAULT],
						["seat-cushion", TEX_SEAT],
						["leg", TEX_LEGS],
					];
					let loaded = 0;
					for (const [key, url] of variants) {
						texLoader.load(url, (tex) => {
							// Match encoding & settings from the original
							tex.colorSpace = THREE.SRGBColorSpace;
							tex.flipY = mat.map?.flipY ?? false;
							tex.wrapS = mat.map?.wrapS ?? THREE.RepeatWrapping;
							tex.wrapT = mat.map?.wrapT ?? THREE.RepeatWrapping;
							texturesRef.current.set(key, tex);
							loaded++;
							if (loaded === variants.length) {
								setTexturesReady(true);
							}
						});
					}
				}
			});
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
		canvas.style.touchAction = "none"; // Prevent browser touch gestures

		// Ignore clicks that arrive right after mount (e.g. the "Parts" tab click)
		const mountTime = Date.now();
		const MOUNT_GUARD_MS = 400;

		// Drag detection: require both distance (>6px) and time (>80ms) to
		// distinguish an intentional drag from a slightly messy tap/click.
		const DRAG_DEAD_ZONE = 6; // px
		const DRAG_TIME_MS = 80; // ms after pointerdown before drag can start
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
			if (e.buttons === 0) return;

			const dx = e.clientX - prevPointerRef.current.x;
			const dy = e.clientY - prevPointerRef.current.y;

			if (!isDraggingRef.current) {
				const totalDx = e.clientX - pointerDownPos.x;
				const totalDy = e.clientY - pointerDownPos.y;
				const dist = Math.sqrt(totalDx * totalDx + totalDy * totalDy);
				const elapsed = Date.now() - pointerDownTime;

				if (dist > DRAG_DEAD_ZONE && elapsed > DRAG_TIME_MS) {
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

	// Swap base-color texture when selection changes (or when textures finish loading)
	useEffect(() => {
		const mat = chairMaterialRef.current;
		if (!mat) return;
		const tex = texturesRef.current.get(selectedPartId);
		if (tex && mat.map !== tex) {
			mat.map = tex;
			mat.needsUpdate = true;
		}
	}, [selectedPartId, texturesReady]);
}

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

/** Cart icon with a + sign — used on the "Add to cart" button */
function AddToBasketIcon({ size = 16, color = "white" }: { size?: number; color?: string }) {
	return (
		<svg
			className="block shrink-0"
			width={size}
			height={size}
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden="true"
		>
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
		<svg
			className="block shrink-0"
			width={size}
			height={size}
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden="true"
		>
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

export function DppProductView({ scrollRef, overlayRef, onAddToCart }: DppProductViewProps) {
	const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [hasInteracted, setHasInteracted] = useState(false);
	const [quantity, setQuantity] = useState(1);

	const canvasContainerRef = useRef<HTMLDivElement>(null);

	// Motion values for drag-to-dismiss
	const dragYMotion = useMotionValue(0);
	const backdropOpacity = useTransform(dragYMotion, [0, 200], [1, 0]);
	const sheetScale = useTransform(dragYMotion, [0, 200], [1, 0.95]);
	const sheetOpacity = useTransform(dragYMotion, [0, 200], [1, 0]);

	// Reset drag value when sheet opens
	useEffect(() => {
		dragYMotion.set(0);
	}, [sheetOpen, dragYMotion]);

	const handlePartClick = useCallback((partId: string) => {
		setSelectedPartId(partId);
		setSheetOpen(true);
		setQuantity(1);
		setHasInteracted(true);
	}, []);

	const handleClose = useCallback(() => {
		setSheetOpen(false);
		setSelectedPartId(null);
	}, []);

	// Imperative Three.js scene
	useChairCanvas(canvasContainerRef, handlePartClick, selectedPartId);

	// Close on Escape
	useEffect(() => {
		if (!sheetOpen) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") handleClose();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [sheetOpen, handleClose]);

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

			{/* Onboarding Hint — portalled to overlay so it's not clipped by scroll overflow */}
			{overlayRef?.current && createPortal(
				<AnimatePresence>
					{!selectedPartId && (
						<motion.div
							className="absolute left-[20px] right-[20px]"
							style={{ bottom: 168, pointerEvents: "auto" }}
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{ duration: 0.2, ease: "easeOut" }}
						>
							<div className="backdrop-blur-lg bg-black/30 rounded-[10px] overflow-hidden relative">
								<p className="font-['SF_Pro:Regular',sans-serif] text-[13px] text-white tracking-[-0.02px] px-[16px] py-[12px] pr-[70px] leading-[18px]">
									Use touch gestures to navigate the model and select the individual parts
								</p>
								<div className="absolute top-0 bottom-0 right-[8px] w-[55px] pointer-events-none">
									<iframe
										src={`${import.meta.env.BASE_URL}TouchGestureAnimationMobile.svg`}
										className="w-full h-full border-none bg-transparent"
										title="Touch gesture animation"
										tabIndex={-1}
										aria-hidden="true"
									/>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>,
				overlayRef.current,
			)}

			{/* Bottom Sheet Overlay — portalled to the phone's overlay container
			   so it isn't clipped by the scroll area's overflow:auto */}
			{overlayRef?.current && createPortal(
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
											onClick={() => {
												onAddToCart?.(selectedPartId!, quantity);
												handleClose();
											}}
											className="flex-1 h-[44px] rounded-[8px] cursor-pointer hover:opacity-100 transition-opacity opacity-[0.92]"
											style={{ backgroundColor: brandConfig.colors.primary }}
											aria-label={`Add ${part.name} to cart`}
										>
											<div className="flex items-center justify-center gap-[10px] size-full">
												<span className="font-['SF_Pro:Medium',sans-serif] font-[510] text-[16px] text-white leading-[24px] font-width-normal">
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
