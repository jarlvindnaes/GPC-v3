import { DppPhoneScreen } from "../components/dpp/DppPhoneScreen";

/**
 * Standalone test page that renders just the DPP phone content
 * in a centered 375×812 container with the real phone status bar.
 * No navbar, footer, 3D canvas, or smooth scroll.
 *
 * Visit: /#/dpp-test
 */
export function DppTest() {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				minHeight: "100vh",
				background: "#1e1e2e",
			}}
		>
			<div
				style={{
					width: 375,
					height: 812,
					borderRadius: 40,
					overflow: "hidden",
					boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
					flexShrink: 0,
					position: "relative",
					background: "#fff",
				}}
			>
				<DppPhoneScreen />
			</div>
		</div>
	);
}
