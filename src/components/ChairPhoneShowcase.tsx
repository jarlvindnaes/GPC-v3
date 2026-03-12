import { ContactShadows, Environment, Float, Html, PresentationControls, useGLTF, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { QrCode } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useIsNearViewport } from "../utilities/useIsNearViewport";
import { CHAIR_MODEL, HtmlPhoneCanvas, RenderController, STUDIO_HDR } from "./Native3DModels";
import { DppPhoneScreen } from "./dpp/DppPhoneScreen";

function PassportChairModel({ onHover, onLock }: { onHover: (hovered: boolean) => void; onLock: () => void }) {
	const { scene } = useGLTF(CHAIR_MODEL);
	const passportScene = useMemo(() => scene.clone(), [scene]);
	return (
		<Float floatIntensity={0.8} rotationIntensity={0.03} speed={1.2}>
			<group position={[0, -1.0, 0]}>
				<primitive object={passportScene} scale={3.17} />
				{/* QR tag on the seat - positioned in 3D space */}
				<Html position={[0.0, 1.13, 0.35]} center={true} zIndexRange={[10, 0]}>
					<button
						type="button"
						aria-label="View Digital Product Passport"
						className="relative cursor-pointer border-none bg-transparent p-0"
						onMouseEnter={() => onHover(true)}
						onMouseLeave={() => onHover(false)}
						onClick={() => onLock()}
						onTouchStart={() => onLock()}
					>
						{/* Radiating rings */}
						<div className="absolute -inset-5 animate-[ping_3s_ease-in-out_infinite] rounded-full border border-indigo-400/25" />
						<div className="absolute -inset-10 animate-[ping_3s_ease-in-out_0.5s_infinite] rounded-full border border-indigo-400/12" />
						{/* Glow halo */}
						<div className="absolute -inset-3 animate-pulse rounded-full bg-indigo-500/20 blur-md" />
						{/* Core QR icon */}
						<div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_0_20px_rgba(99,102,241,0.6)] ring-2 ring-white/30">
							<QrCode className="h-6 w-6 text-white" />
						</div>
						{/* Floating particles */}
						{[0, 1, 2, 3].map((particleIndex) => (
							<div
								key={particleIndex}
								className="absolute h-1.5 w-1.5 rounded-full bg-indigo-400"
								style={{
									left: `${Math.cos((particleIndex * 90 * Math.PI) / 180) * 30 + 20}px`,
									top: `${Math.sin((particleIndex * 90 * Math.PI) / 180) * 30 + 20}px`,
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

/** Progress overlay shown while the 3D chair model + HDR are loading. */
function LoadingOverlay({ variant }: { variant: "light" | "dark" }) {
	const { progress, active } = useProgress();
	const [visible, setVisible] = useState(true);

	// Keep overlay visible briefly after loading finishes so the fade-out plays
	useEffect(() => {
		if (!active && progress === 100) {
			const t = setTimeout(() => setVisible(false), 600);
			return () => clearTimeout(t);
		}
	}, [active, progress]);

	if (!visible) return null;

	const isDark = variant === "dark";
	const labelColor = isDark ? "text-slate-500" : "text-slate-400";
	const trackBg = isDark ? "bg-slate-200" : "bg-white/20";
	const barBg = isDark ? "bg-brand-accent" : "bg-indigo-400";

	return (
		<div
			className={`absolute inset-0 z-20 flex flex-col items-center justify-center transition-opacity duration-500 ${
				!active && progress === 100 ? "opacity-0" : "opacity-100"
			}`}
		>
			<p className={`mb-3 text-xs font-medium tracking-wide ${labelColor}`}>
				Loading your DPP solution …
			</p>
			<div className={`h-1 w-48 overflow-hidden rounded-full ${trackBg}`}>
				<div
					className={`h-full rounded-full ${barBg} transition-[width] duration-300 ease-out`}
					style={{ width: `${progress}%` }}
				/>
			</div>
		</div>
	);
}

export function ChairPhoneShowcase({ buttonStyle = "light" }: { /** "light" = white glassmorphic buttons (for dark backgrounds), "dark" = grey buttons (for light backgrounds). Only affects the small phone; expanded always uses light. */ buttonStyle?: "light" | "dark" } = {}) {
	const btnClass = buttonStyle === "dark"
		? "border-slate-400/40 bg-slate-500/30 text-slate-700 backdrop-blur-md hover:bg-slate-500/40"
		: "border-white/30 bg-white/20 text-white backdrop-blur-md hover:bg-white/30";

	const [qrHovered, setQrHovered] = useState(false);
	const [locked, setLocked] = useState(false);
	const [expanded, setExpanded] = useState(false);
	const containerReference = useRef<HTMLDivElement>(null);
	const isNearReference = useIsNearViewport(containerReference);
	const hideTimeout = useRef<ReturnType<typeof setTimeout>>(null);

	const cancelHide = () => {
		if (hideTimeout.current) {
			clearTimeout(hideTimeout.current);
			hideTimeout.current = null;
		}
	};

	const scheduleHide = () => {
		cancelHide();
		hideTimeout.current = setTimeout(() => setQrHovered(false), 200);
	};

	// QR hover triggers the phone; leaving either QR or phone schedules dismissal
	const handleQrHover = (value: boolean) => {
		if (value) {
			cancelHide();
			setQrHovered(true);
		} else {
			scheduleHide();
		}
	};

	const phoneVisible = locked || qrHovered;

	// Lock body scroll when phone is expanded to fullscreen
	useEffect(() => {
		if (expanded) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => { document.body.style.overflow = ""; };
	}, [expanded]);

	return (
		<div className="relative">
			<div
				ref={containerReference}
				role="img"
				aria-label="Interactive 3D chair with product passport"
				className="relative mx-auto h-[min(80vw,600px)] w-[min(90vw,800px)]"
			>
				<Canvas
					frameloop="demand"
					camera={{ position: [0, 0.3, 5], fov: 42 }}
					gl={{ alpha: true }}
					style={{ background: "transparent" }}
				>
					<RenderController isActive={isNearReference} />
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
						<PassportChairModel onHover={handleQrHover} onLock={() => setLocked(true)} />
					</PresentationControls>
					<ContactShadows position={[0, -1.1, 0]} opacity={0.3} scale={14} blur={3} far={6} color="#000" />
					<Environment files={STUDIO_HDR} />
				</Canvas>

				<LoadingOverlay variant={buttonStyle} />

				{/* 3D Phone with HTML content - slides in on hover/tap, overlaps chair.
				     `inert` disables ALL interaction on the element tree when the phone
				     is hidden, preventing the inner Canvas / overlay from stealing
				     pointer events from the chair and QR tag underneath. */}
				{!expanded && (
					<div
						// @ts-expect-error -- React 19 types support inert, but @types/react may lag
						inert={!phoneVisible || undefined}
						className={`absolute top-[28%] z-50 h-[min(490px,calc(72vh-90px))] w-[min(230px,calc(82vw-90px))] transition-all duration-500 ease-out sm:top-1/2 sm:right-[5%] sm:h-[min(630px,calc(90vh-90px))] sm:w-[min(310px,calc(75vw-90px))] ${
							phoneVisible
								? "cursor-grab active:cursor-grabbing left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100 opacity-100 sm:left-auto sm:translate-x-0"
								: "pointer-events-none left-1/2 -translate-x-1/2 -translate-y-[40%] scale-95 opacity-0 sm:left-auto sm:-translate-y-1/2 sm:scale-100 sm:translate-x-16"
						}`}
						onMouseEnter={cancelHide}
						onMouseLeave={scheduleHide}
					>
						<div className="relative h-full w-full">
							<HtmlPhoneCanvas isPlaying={phoneVisible} noChrome rotation={[0.05, 0.55, 0]}>
								<DppPhoneScreen />
							</HtmlPhoneCanvas>
							{/* Expand button - top left corner (visible on hover and click) */}
							<button
								type="button"
								aria-label="Expand phone to fullscreen"
								className={`absolute top-2 left-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 sm:h-11 sm:w-11 ${btnClass} ${phoneVisible ? "scale-100 opacity-100" : "pointer-events-none scale-75 opacity-0"}`}
								onClick={() => { setExpanded(true); setLocked(true); }}
							>
								<svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<title>Expand</title>
									<polyline points="15 3 21 3 21 9" />
									<polyline points="9 21 3 21 3 15" />
									<line x1="21" y1="3" x2="14" y2="10" />
									<line x1="3" y1="21" x2="10" y2="14" />
								</svg>
							</button>
							{/* Close button - top right corner (only when QR clicked / locked) */}
							<button
								type="button"
								aria-label="Close phone preview"
								className={`absolute top-2 right-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 sm:h-11 sm:w-11 ${btnClass} ${locked ? "scale-100 opacity-100" : "pointer-events-none scale-75 opacity-0"}`}
								onClick={() => { cancelHide(); setLocked(false); setQrHovered(false); }}
							>
								<svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
									<title>Close</title>
									<line x1="18" y1="6" x2="6" y2="18" />
									<line x1="6" y1="6" x2="18" y2="18" />
								</svg>
							</button>
						</div>
					</div>
				)}

				{/* Expanded fullscreen phone — portalled to document.body to escape
				     all stacking contexts (motion transforms, relative containers)
				     and reliably sit above the site header. */}
				{expanded && createPortal(
					<div
						className="fixed inset-0 z-[99999] flex items-center justify-start bg-black/40 backdrop-blur-xl transition-opacity duration-300"
						style={{ flexDirection: "column", paddingTop: 8 }}
						onClick={(e) => { if (e.target === e.currentTarget) { setExpanded(false); cancelHide(); setLocked(false); setQrHovered(false); } }}
					>
						<div className="relative cursor-grab active:cursor-grabbing" style={{ height: "calc(100vh - 8px)", aspectRatio: "375 / 812", maxWidth: "100vw" }}>
							<HtmlPhoneCanvas isPlaying noChrome resetKey={1}>
								<DppPhoneScreen />
							</HtmlPhoneCanvas>
							{/* Close button */}
							<button
								type="button"
								aria-label="Close phone preview"
								className="absolute top-2 right-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/30 sm:h-11 sm:w-11"
								onClick={() => { setExpanded(false); cancelHide(); setLocked(false); setQrHovered(false); }}
							>
								<svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
									<title>Close</title>
									<line x1="18" y1="6" x2="6" y2="18" />
									<line x1="6" y1="6" x2="18" y2="18" />
								</svg>
							</button>
						</div>
					</div>,
					document.body
				)}
			</div>

			{/* Hint label - outside canvas container to avoid stacking issues, clickable on mobile */}
			<button
				type="button"
				onClick={() => setLocked(true)}
				className={`mx-auto block cursor-pointer border-none bg-transparent pt-1 transition-all duration-300 sm:pointer-events-none ${phoneVisible ? "pointer-events-none translate-y-2 opacity-0" : "translate-y-0 opacity-100"}`}
			>
				<p className="whitespace-nowrap text-center text-slate-500 text-xs">
					<span className="hidden sm:inline">Hover</span>
					<span className="sm:hidden">Tap</span> the tag to explore
				</p>
			</button>
		</div>
	);
}
