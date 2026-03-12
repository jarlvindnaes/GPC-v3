import { useEffect, useRef, useState } from "react";
import { DppApp } from "./DppApp";

/**
 * Formats a Date into a clock string like "9:41" (24h, no leading zero).
 */
function formatStatusBarTime(date: Date): string {
	const h = date.getHours();
	const m = date.getMinutes().toString().padStart(2, "0");
	return `${h}:${m}`;
}

/** Live clock that updates every minute, styled to match the iPhone status bar. */
function LiveClock({ color }: { color: string }) {
	const [time, setTime] = useState(() => formatStatusBarTime(new Date()));
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		const tick = () => setTime(formatStatusBarTime(new Date()));
		const now = new Date();
		const msUntilNextMinute =
			(60 - now.getSeconds()) * 1000 - now.getMilliseconds();
		const timeout = setTimeout(() => {
			tick();
			intervalRef.current = setInterval(tick, 60_000);
		}, msUntilNextMinute);
		return () => {
			clearTimeout(timeout);
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, []);

	return (
		<span
			style={{
				position: "absolute",
				top: 17,
				left: 35,
				fontFamily:
					'"SF Pro Text", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
				fontWeight: 600,
				fontSize: 15,
				color,
				zIndex: 50,
				pointerEvents: "none",
				lineHeight: 1,
				letterSpacing: 0,
			}}
		>
			{time}
		</span>
	);
}

/** Right-side iPhone status bar icons (cellular, WiFi, battery) as inline SVG. */
function StatusBarIcons({ color }: { color: string }) {
	return (
		<svg
			width="213"
			height="19"
			viewBox="0 0 213 19"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			style={{
				position: "absolute",
				top: 10,
				left: "50%",
				transform: "translateX(-50%)",
				width: "88%",
				height: "auto",
				zIndex: 50,
				pointerEvents: "none",
			}}
		>
			<g transform="translate(-8, 0)">
				{/* Battery outline */}
				<path
					opacity="0.35"
					d="M197.84 5.2923H208.313C209.693 5.29232 210.813 6.4116 210.813 7.7923V10.3577C210.813 11.7384 209.693 12.8577 208.313 12.8577H197.84C196.459 12.8577 195.34 11.7384 195.34 10.3577V7.7923C195.34 6.41159 196.459 5.2923 197.84 5.2923Z"
					stroke={color}
				/>
				{/* Battery nub */}
				<path
					opacity="0.4"
					d="M211.972 8.08679V10.8676C212.531 10.6321 212.895 10.0842 212.895 9.47719C212.895 8.87019 212.531 8.32231 211.972 8.08679Z"
					fill={color}
				/>
				{/* Battery fill */}
				<path
					d="M196.158 8.11011C196.158 7.00554 197.053 6.11011 198.158 6.11011H205.359C206.464 6.11011 207.359 7.00554 207.359 8.11011V10.0403C207.359 11.1448 206.464 12.0402 205.359 12.0402H198.158C197.053 12.0402 196.158 11.1448 196.158 10.0402V8.11011Z"
					fill={color}
				/>
				{/* WiFi */}
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M183.056 11.3284C183.991 10.5207 185.361 10.5207 186.297 11.3284C186.344 11.3717 186.372 11.4327 186.373 11.4973C186.374 11.5621 186.349 11.6248 186.304 11.6702L184.839 13.179C184.796 13.2232 184.738 13.2482 184.677 13.2483C184.616 13.2483 184.557 13.2233 184.514 13.179L183.049 11.6702C183.003 11.6248 182.978 11.5621 182.979 11.4973C182.981 11.4328 183.009 11.3717 183.056 11.3284ZM181.075 9.52272C183.091 7.60887 186.212 7.60887 188.227 9.52272C188.273 9.5676 188.299 9.62905 188.3 9.69362C188.3 9.758 188.276 9.81977 188.231 9.8655L187.385 10.7395C187.297 10.8287 187.156 10.8303 187.066 10.7434C186.404 10.1317 185.543 9.79318 184.65 9.79323C183.758 9.7937 182.898 10.1321 182.236 10.7434C182.147 10.8302 182.006 10.8285 181.919 10.7395L181.072 9.8655C181.028 9.81981 181.002 9.7581 181.003 9.69362C181.003 9.62914 181.03 9.56758 181.075 9.52272ZM179.097 7.71901C182.188 4.69484 187.066 4.69495 190.157 7.71901C190.202 7.76394 190.227 7.82584 190.227 7.88991C190.228 7.95387 190.203 8.01542 190.159 8.06081L189.311 8.93386C189.224 9.02349 189.082 9.02503 188.993 8.93679C187.815 7.79381 186.252 7.15659 184.627 7.15651C183.002 7.15662 181.439 7.79376 180.261 8.93679C180.172 9.02509 180.031 9.02351 179.943 8.93386L179.095 8.06081C179.051 8.0154 179.026 7.95385 179.026 7.88991C179.027 7.82584 179.052 7.76391 179.097 7.71901Z"
					fill={color}
				/>
				{/* Cellular bars */}
				<path
					d="M168.484 7.42789C168.484 7.06398 168.779 6.76898 169.143 6.76898H169.802C170.166 6.76898 170.461 7.06398 170.461 7.42789V12.6991C170.461 13.063 170.166 13.358 169.802 13.358H169.143C168.779 13.358 168.484 13.063 168.484 12.6991V7.42789Z"
					fill={color}
				/>
				<path
					d="M171.778 6.11008C171.778 5.74617 172.073 5.45117 172.437 5.45117H173.096C173.46 5.45117 173.755 5.74617 173.755 6.11008V12.6991C173.755 13.063 173.46 13.358 173.096 13.358H172.437C172.073 13.358 171.778 13.063 171.778 12.6991V6.11008Z"
					fill={color}
				/>
				<path
					d="M165.189 9.73405C165.189 9.37015 165.484 9.07515 165.848 9.07515H166.507C166.871 9.07515 167.166 9.37015 167.166 9.73405V12.6991C167.166 13.063 166.871 13.358 166.507 13.358H165.848C165.484 13.358 165.189 13.063 165.189 12.6991V9.73405Z"
					fill={color}
				/>
				<path
					d="M161.895 11.3813C161.895 11.0174 162.19 10.7224 162.554 10.7224H163.213C163.576 10.7224 163.871 11.0174 163.871 11.3813V12.6991C163.871 13.063 163.576 13.358 163.213 13.358H162.554C162.19 13.358 161.895 13.063 161.895 12.6991V11.3813Z"
					fill={color}
				/>
			</g>
		</svg>
	);
}

/**
 * DppPhoneScreen — The complete phone screen content including DppApp and
 * all iOS chrome (status bar, Dynamic Island, Safari bottom bar).
 *
 * This is the single source of truth shared between the standalone DppTest
 * page and the 3D phone on the marketing front page, ensuring both are
 * always identical.
 */
export function DppPhoneScreen() {
	const statusBarColor = "#1B1B1B";

	return (
		<>
			<DppApp />

			{/* iPhone status bar: Dynamic Island SVG + real icons & clock */}
			<img
				src={`${import.meta.env.BASE_URL}images/top-chrome.svg`}
				alt=""
				draggable={false}
				style={{
					position: "absolute",
					top: 10,
					left: "50%",
					transform: "translateX(calc(-50% + 7px))",
					width: "88%",
					height: "auto",
					zIndex: 50,
					pointerEvents: "none",
				}}
			/>
			<StatusBarIcons color={statusBarColor} />
			<LiveClock color={statusBarColor} />

			{/* iOS Safari bottom chrome (back, URL bar, more) */}
			<img
				src={`${import.meta.env.BASE_URL}images/ios-chrome.svg`}
				alt=""
				draggable={false}
				style={{
					position: "absolute",
					bottom: 8,
					left: 21,
					right: 21,
					width: "calc(100% - 42px)",
					height: "auto",
					zIndex: 50,
					pointerEvents: "none",
				}}
			/>
		</>
	);
}
