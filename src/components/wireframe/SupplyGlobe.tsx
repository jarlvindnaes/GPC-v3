import { useEffect, useRef } from "react";
import * as Three from "three";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";

import { useIsNearViewport } from "../../utilities/useIsNearViewport";

// Supply-chain globe island — faithful port of the static wireframe's globe.js.
// An OrthographicCamera dotted globe built by sampling world-map.png: land pixels become
// brand-coloured points on a sphere, special supply-chain nodes get pulsation rings and
// flight-path arcs, and DOM label pills track each node in screen space.
// Three is loaded from npm (r0.183) instead of the CDN importmap; the texture loads via
// BASE_URL; the render loop pauses off-screen via useIsNearViewport.

const GLOBE_RADIUS = 120;
const AUTO_ROTATION_SPEED = 0.0015;
const HOVER_RADIUS = 60;
const HOVER_PARTICLE_SIZE = 3;
const SPECIAL_PARTICLE_SIZE = 6;
const FACTORY_PARTICLE_SIZE = 20;
const PIXEL_SAMPLE_STRIDE = 6;
const FLIGHT_PATH_ARC_HEIGHT = 0.4;
const FLIGHT_PATH_SEGMENTS = 48;
const FLIGHT_PATH_LINE_WIDTH = 2;
const PULSATION_RING_MIN_SCALE = 0;
const PULSATION_RING_MAX_SCALE = 28;
const TOOLTIP_OFFSET_Y = 18;
// Fit the whole globe inside the container instead of letting it bleed past the edges.
const GLOBE_FIT = 0.78;
const WORLD_MAP_URL = `${import.meta.env.BASE_URL}wireframes/world-map.png`;

// Brand colors (from the wireframe's index.css).
const BRAND = {
  light: "#5B7EE5",
  dark: "#1E3A8A",
  deep: "#0F1D45",
  accent: "#F5A623",
  cyan: "#22d3ee",
  amber: "#fbbf24",
  violet: "#8b5cf6"
} as const;

interface GeoLocation {
  latitude: number;
  longitude: number;
}

const FACTORY_LOCATION: GeoLocation = { latitude: 55.7, longitude: 12.6 };

const SUPPLIER_LOCATIONS: GeoLocation[] = [
  { latitude: 52.2, longitude: 21.0 },
  { latitude: 48.1, longitude: 11.6 }
];

const RAW_MATERIAL_LOCATIONS: GeoLocation[] = [
  { latitude: 31.2, longitude: 121.5 },
  { latitude: 51.3, longitude: 9.5 },
  { latitude: -29.9, longitude: 31.0 }
];

const PRODUCT_USER_LOCATIONS: GeoLocation[] = [{ latitude: 34.1, longitude: -118.2 }];

function geoToPosition(location: GeoLocation): Three.Vector3 {
  const theta = ((location.longitude + 180) * Math.PI) / 180;
  const latitudeRadians = (location.latitude * Math.PI) / 180;
  const colatitude = ((90 - location.latitude) * Math.PI) / 180;
  return new Three.Vector3(
    GLOBE_RADIUS * Math.cos(theta) * Math.sin(colatitude),
    GLOBE_RADIUS * Math.sin(latitudeRadians),
    GLOBE_RADIUS * Math.sin(theta) * Math.sin(colatitude)
  );
}

function findNearestParticle(
  target: Three.Vector3,
  positions: number[],
  particleCount: number,
  excludeIndices: Set<number>
): number {
  let nearestIndex = 0;
  let nearestDistanceSquared = Number.POSITIVE_INFINITY;
  for (let i = 0; i < particleCount; i++) {
    if (excludeIndices.has(i)) {
      continue;
    }
    const dx = positions[i * 3] - target.x;
    const dy = positions[i * 3 + 1] - target.y;
    const dz = positions[i * 3 + 2] - target.z;
    const distanceSquared = dx * dx + dy * dy + dz * dz;
    if (distanceSquared < nearestDistanceSquared) {
      nearestDistanceSquared = distanceSquared;
      nearestIndex = i;
    }
  }
  return nearestIndex;
}

interface BrandColors {
  land: Three.Color;
  flightPath: Three.Color;
  pulsationRing: string;
  backdropCenter: Three.Color;
  backdropEdge: Three.Color;
}

const BRAND_COLORS: BrandColors = {
  land: new Three.Color(BRAND.light).lerp(new Three.Color(1, 1, 1), 0.65),
  flightPath: new Three.Color(BRAND.accent),
  pulsationRing: "rgba(255, 255, 255, 0.7)",
  backdropCenter: new Three.Color(BRAND.dark),
  backdropEdge: new Three.Color(BRAND.deep)
};

type TooltipAnchor = "top" | "bottom-left";

interface TooltipConfig {
  label: string;
  dotColor: string;
  anchor?: TooltipAnchor;
}

const TOOLTIP_CONFIGS: TooltipConfig[] = [
  { label: "Home Factory", dotColor: BRAND.accent },
  { label: "Component Supplier", dotColor: BRAND.cyan, anchor: "bottom-left" },
  { label: "Raw Material", dotColor: BRAND.amber },
  { label: "Raw Material", dotColor: BRAND.amber },
  { label: "Product User", dotColor: BRAND.violet }
];

interface SupplyChainEdge {
  sourceIndex: number;
  targetIndex: number;
}

interface TooltipData {
  nodeIndex: number;
  anchor: TooltipAnchor;
}

interface ParticleSystemData {
  points: Three.Points;
  originalPositions: Float32Array;
  originalColors: Float32Array;
  originalSizes: Float32Array;
  particleCount: number;
  specialIndices: number[];
  supplyChainEdges: SupplyChainEdge[];
  ringSprites: Three.Sprite[];
  flightPaths: Line2[];
  tooltips: TooltipData[];
}

function createCircleTexture(): Three.CanvasTexture {
  const size = 32;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (context) {
    context.beginPath();
    context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    context.fillStyle = "white";
    context.fill();
  }
  return new Three.CanvasTexture(canvas);
}

function createRingTexture(ringColor: string): Three.CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (context) {
    context.beginPath();
    context.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
    context.strokeStyle = ringColor;
    context.lineWidth = 5;
    context.stroke();
  }
  return new Three.CanvasTexture(canvas);
}

function createBackdropMesh(centerColor: Three.Color, edgeColor: Three.Color): Three.Mesh {
  const geometry = new Three.CircleGeometry(GLOBE_RADIUS * 0.98, 64);
  const material = new Three.ShaderMaterial({
    uniforms: {
      centerColor: { value: centerColor },
      edgeColor: { value: edgeColor }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 centerColor;
      uniform vec3 edgeColor;
      varying vec2 vUv;
      void main() {
        float dist = clamp(distance(vUv, vec2(0.5, 0.5)) * 2.0, 0.0, 1.0);
        vec3 color = mix(centerColor, edgeColor, dist);
        gl_FragColor = vec4(color, 0.2);
      }
    `,
    transparent: true,
    depthWrite: false
  });
  const mesh = new Three.Mesh(geometry, material);
  mesh.position.z = -10;
  mesh.renderOrder = -1;
  return mesh;
}

function createFlightPaths(
  edgeCount: number,
  globeGroup: Three.Group,
  pathColor: Three.Color,
  rendererSize: { width: number; height: number }
): Line2[] {
  const flightPaths: Line2[] = [];
  for (let i = 0; i < edgeCount; i++) {
    const geometry = new LineGeometry();
    const material = new LineMaterial({
      color: pathColor.getHex(),
      linewidth: FLIGHT_PATH_LINE_WIDTH,
      transparent: true,
      opacity: 0.6,
      depthTest: false,
      resolution: new Three.Vector2(rendererSize.width, rendererSize.height)
    });
    const line = new Line2(geometry, material);
    line.renderOrder = 0;
    globeGroup.add(line);
    flightPaths.push(line);
  }
  return flightPaths;
}

function updateFlightPaths(
  flightPaths: Line2[],
  supplyChainEdges: SupplyChainEdge[],
  positionAttribute: Three.BufferAttribute
): void {
  const startPosition = new Three.Vector3();
  const endPosition = new Three.Vector3();
  const midpoint = new Three.Vector3();
  const controlPoint = new Three.Vector3();

  for (let i = 0; i < flightPaths.length; i++) {
    const edge = supplyChainEdges[i];
    startPosition.set(
      positionAttribute.getX(edge.sourceIndex),
      positionAttribute.getY(edge.sourceIndex),
      positionAttribute.getZ(edge.sourceIndex)
    );
    endPosition.set(
      positionAttribute.getX(edge.targetIndex),
      positionAttribute.getY(edge.targetIndex),
      positionAttribute.getZ(edge.targetIndex)
    );
    midpoint.addVectors(startPosition, endPosition).multiplyScalar(0.5);
    const pairDistance = startPosition.distanceTo(endPosition);
    const arcHeight = pairDistance * FLIGHT_PATH_ARC_HEIGHT;
    controlPoint
      .copy(midpoint)
      .normalize()
      .multiplyScalar(GLOBE_RADIUS + arcHeight);
    const curve = new Three.QuadraticBezierCurve3(startPosition, controlPoint, endPosition);
    const curvePoints = curve.getPoints(FLIGHT_PATH_SEGMENTS);
    const flatPositions: number[] = [];
    for (const point of curvePoints) {
      flatPositions.push(point.x, point.y, point.z);
    }
    (flightPaths[i].geometry as LineGeometry).setPositions(flatPositions);
    flightPaths[i].computeLineDistances();
  }
}

interface BuildParticleSystemArguments {
  imageData: Uint8ClampedArray;
  imageWidth: number;
  imageHeight: number;
  circleTexture: Three.CanvasTexture;
  globeGroup: Three.Group;
  scene: Three.Scene;
  ringTexture: Three.CanvasTexture;
  brandColors: BrandColors;
  rendererSize: { width: number; height: number };
  tooltipConfigs: TooltipConfig[];
}

function buildParticleSystem(args: BuildParticleSystemArguments): ParticleSystemData {
  const {
    imageData,
    imageWidth,
    imageHeight,
    circleTexture,
    globeGroup,
    scene,
    ringTexture,
    brandColors,
    rendererSize,
    tooltipConfigs
  } = args;

  const positions: number[] = [];
  const colors: number[] = [];
  const sizes: number[] = [];

  const horizontalAngle = (2 * Math.PI) / imageWidth;
  const verticalAngle = Math.PI / imageHeight;

  for (let j = 0; j <= imageHeight; j += PIXEL_SAMPLE_STRIDE) {
    for (let i = 0; i < imageWidth; i += PIXEL_SAMPLE_STRIDE) {
      const imageIndex = j * imageWidth + i;
      const red = imageData[imageIndex * 4];
      const green = imageData[imageIndex * 4 + 1];
      const blue = imageData[imageIndex * 4 + 2];
      const alpha = imageData[imageIndex * 4 + 3];
      if (red < 10 && green < 10 && blue < 10 && alpha === 255) {
        const rx = GLOBE_RADIUS * Math.cos(horizontalAngle * i) * Math.sin(verticalAngle * j);
        const rz = GLOBE_RADIUS * Math.sin(horizontalAngle * i) * Math.sin(verticalAngle * j);
        const ry = -GLOBE_RADIUS * Math.cos(verticalAngle * (imageHeight - j));
        positions.push(rx, ry, rz);
        colors.push(brandColors.land.r, brandColors.land.g, brandColors.land.b);
        sizes.push(3);
      }
    }
  }

  const particleCount = positions.length / 3;
  const usedIndices = new Set<number>();

  const factoryTarget = geoToPosition(FACTORY_LOCATION);
  const factoryIndex = findNearestParticle(factoryTarget, positions, particleCount, usedIndices);
  usedIndices.add(factoryIndex);

  const supplierIndices: number[] = [];
  for (const location of SUPPLIER_LOCATIONS) {
    const index = findNearestParticle(geoToPosition(location), positions, particleCount, usedIndices);
    usedIndices.add(index);
    supplierIndices.push(index);
  }

  const rawMaterialIndices: number[] = [];
  for (const location of RAW_MATERIAL_LOCATIONS) {
    const index = findNearestParticle(geoToPosition(location), positions, particleCount, usedIndices);
    usedIndices.add(index);
    rawMaterialIndices.push(index);
  }

  const productUserIndices: number[] = [];
  for (const location of PRODUCT_USER_LOCATIONS) {
    const index = findNearestParticle(geoToPosition(location), positions, particleCount, usedIndices);
    usedIndices.add(index);
    productUserIndices.push(index);
  }

  const specialIndices = [factoryIndex, ...supplierIndices, ...rawMaterialIndices, ...productUserIndices];

  const supplyChainEdges: SupplyChainEdge[] = [
    { sourceIndex: rawMaterialIndices[0], targetIndex: supplierIndices[0] },
    { sourceIndex: rawMaterialIndices[1], targetIndex: supplierIndices[1] },
    { sourceIndex: rawMaterialIndices[2], targetIndex: supplierIndices[1] },
    { sourceIndex: supplierIndices[0], targetIndex: factoryIndex },
    { sourceIndex: supplierIndices[1], targetIndex: factoryIndex },
    { sourceIndex: factoryIndex, targetIndex: productUserIndices[0] }
  ];

  for (const index of specialIndices) {
    colors[index * 3] = 1;
    colors[index * 3 + 1] = 1;
    colors[index * 3 + 2] = 1;
    sizes[index] = SPECIAL_PARTICLE_SIZE;
  }
  sizes[factoryIndex] = FACTORY_PARTICLE_SIZE;

  const positionArray = new Float32Array(positions);
  const colorArray = new Float32Array(colors);
  const sizeArray = new Float32Array(sizes);
  const originalPositions = new Float32Array(positionArray);
  const originalColors = new Float32Array(colorArray);
  const originalSizes = new Float32Array(sizeArray);

  const geometry = new Three.BufferGeometry();
  geometry.setAttribute("position", new Three.BufferAttribute(positionArray, 3));
  geometry.setAttribute("color", new Three.BufferAttribute(colorArray, 3));
  geometry.setAttribute("size", new Three.BufferAttribute(sizeArray, 1));

  const material = new Three.ShaderMaterial({
    uniforms: {
      pointTexture: { value: circleTexture },
      sizeScale: { value: 1.0 },
      pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
    },
    vertexShader: `
      attribute float size;
      uniform float sizeScale;
      uniform float pixelRatio;
      varying vec3 vColor;
      varying float vFacing;
      void main() {
        vColor = color;
        vec3 worldNormal = normalize((modelMatrix * vec4(normalize(position), 0.0)).xyz);
        vec3 viewDir = normalize(cameraPosition - (modelMatrix * vec4(position, 1.0)).xyz);
        vFacing = dot(worldNormal, viewDir);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * sizeScale * pixelRatio;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D pointTexture;
      varying vec3 vColor;
      varying float vFacing;
      void main() {
        vec4 texColor = texture2D(pointTexture, gl_PointCoord);
        if (texColor.a < 0.3) discard;
        float alpha = mix(0.3, 1.0, smoothstep(-0.2, 0.5, vFacing));
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    depthTest: false
  });

  const points = new Three.Points(geometry, material);
  points.renderOrder = 0;
  globeGroup.add(points);

  const ringsGroup = new Three.Group();
  scene.add(ringsGroup);

  const ringSprites: Three.Sprite[] = [];
  for (const _index of specialIndices) {
    const spriteMaterial = new Three.SpriteMaterial({
      map: ringTexture,
      transparent: true,
      depthWrite: false,
      depthTest: false
    });
    const sprite = new Three.Sprite(spriteMaterial);
    sprite.renderOrder = 1;
    sprite.scale.setScalar(PULSATION_RING_MIN_SCALE);
    ringsGroup.add(sprite);
    ringSprites.push(sprite);
  }

  const flightPaths = createFlightPaths(supplyChainEdges.length, globeGroup, brandColors.flightPath, rendererSize);

  const tooltipNodeMapping = [
    factoryIndex,
    supplierIndices[0],
    rawMaterialIndices[0],
    rawMaterialIndices[2],
    productUserIndices[0]
  ];
  const tooltips: TooltipData[] = tooltipNodeMapping.map((nodeIndex, index) => ({
    nodeIndex,
    anchor: tooltipConfigs[index].anchor ?? "top"
  }));

  return {
    points,
    originalPositions,
    originalColors,
    originalSizes,
    particleCount,
    specialIndices,
    supplyChainEdges,
    ringSprites,
    flightPaths,
    tooltips
  };
}

function createTooltipElements(container: HTMLDivElement, tooltipConfigs: TooltipConfig[]): HTMLDivElement[] {
  return tooltipConfigs.map((config) => {
    const wrap = document.createElement("div");
    wrap.style.cssText =
      "position:absolute;top:0;left:0;pointer-events:none;will-change:transform;transform:translate(-9999px,-9999px)";
    const pill = document.createElement("div");
    pill.style.cssText =
      "display:flex;align-items:center;gap:8px;border-radius:999px;border:1px solid rgba(255,255,255,0.3);" +
      "background:rgba(255,255,255,0.14);padding:7px 13px;backdrop-filter:blur(8px)";
    const dot = document.createElement("span");
    dot.style.cssText = `height:10px;width:10px;flex-shrink:0;border-radius:50%;background:${config.dotColor}`;
    const label = document.createElement("span");
    label.style.cssText = "white-space:nowrap;font-weight:600;font-size:13px;color:#fff";
    label.textContent = config.label;
    pill.appendChild(dot);
    pill.appendChild(label);
    wrap.appendChild(pill);
    container.appendChild(wrap);
    return wrap;
  });
}

export function SupplyGlobe() {
  const hostRef = useRef<HTMLDivElement>(null);
  const isNearViewport = useIsNearViewport(hostRef);

  useEffect(() => {
    const container = hostRef.current;
    if (!container) {
      return;
    }

    const tooltipElements = createTooltipElements(container, TOOLTIP_CONFIGS);

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new Three.Scene();
    const camera = new Three.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0.1, 2000);
    camera.position.z = 900;

    const renderer = new Three.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    let globeScale = (Math.min(width, height) * GLOBE_FIT) / (GLOBE_RADIUS * 2);
    const globeGroup = new Three.Group();
    globeGroup.scale.setScalar(globeScale);
    globeGroup.rotation.y = -Math.PI * 0.57;
    globeGroup.rotation.x = 0.7;
    scene.add(globeGroup);

    const brandColors = BRAND_COLORS;
    const backdropMesh = createBackdropMesh(brandColors.backdropCenter, brandColors.backdropEdge);
    backdropMesh.scale.setScalar(globeScale);
    scene.add(backdropMesh);

    const circleTexture = createCircleTexture();
    const ringTexture = createRingTexture(brandColors.pulsationRing);

    let particleData: ParticleSystemData | null = null;
    let animationFrameId = 0;

    const mousePosition: { x: number | null; y: number | null } = { x: null, y: null };
    const dragState = { isDragging: false, previousX: 0, previousY: 0 };

    const worldMapImage = new Image();
    worldMapImage.crossOrigin = "Anonymous";
    worldMapImage.src = WORLD_MAP_URL;
    worldMapImage.onload = () => {
      const offscreenCanvas = document.createElement("canvas");
      const offscreenContext = offscreenCanvas.getContext("2d");
      if (!offscreenContext) {
        return;
      }
      offscreenCanvas.width = worldMapImage.width;
      offscreenCanvas.height = worldMapImage.height;
      offscreenContext.drawImage(worldMapImage, 0, 0);
      const imagePixelData = offscreenContext.getImageData(0, 0, worldMapImage.width, worldMapImage.height).data;
      particleData = buildParticleSystem({
        imageData: imagePixelData,
        imageWidth: worldMapImage.width,
        imageHeight: worldMapImage.height,
        circleTexture,
        globeGroup,
        scene,
        ringTexture,
        brandColors,
        rendererSize: { width, height },
        tooltipConfigs: TOOLTIP_CONFIGS
      });
      const initialPositionAttribute = particleData.points.geometry.getAttribute("position") as Three.BufferAttribute;
      updateFlightPaths(particleData.flightPaths, particleData.supplyChainEdges, initialPositionAttribute);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const canvasRect = renderer.domElement.getBoundingClientRect();
      mousePosition.x = event.clientX - canvasRect.left;
      mousePosition.y = event.clientY - canvasRect.top;
      if (dragState.isDragging) {
        const deltaX = event.clientX - dragState.previousX;
        const deltaY = event.clientY - dragState.previousY;
        globeGroup.rotation.y += deltaX * 0.005;
        globeGroup.rotation.x += deltaY * 0.005;
        dragState.previousX = event.clientX;
        dragState.previousY = event.clientY;
      }
    };
    const handleMouseDown = (event: MouseEvent) => {
      dragState.isDragging = true;
      dragState.previousX = event.clientX;
      dragState.previousY = event.clientY;
      container.style.cursor = "grabbing";
    };
    const handleMouseUp = () => {
      dragState.isDragging = false;
      container.style.cursor = "grab";
    };
    const handleMouseOut = () => {
      mousePosition.x = null;
      mousePosition.y = null;
      dragState.isDragging = false;
      container.style.cursor = "grab";
    };

    container.style.cursor = "grab";
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mouseleave", handleMouseOut);

    const tempVector = new Three.Vector3();
    const cameraRight = new Three.Vector3();
    const cameraUp = new Three.Vector3();
    const inverseMatrix = new Three.Matrix4();
    const offset = new Three.Vector3();
    const zeroTransformed = new Three.Vector3();
    const spriteWorldPosition = new Three.Vector3();
    const tooltipPosition = new Three.Vector3();
    const edgeNormal = new Three.Vector3();
    const cameraDirection = new Three.Vector3();
    const edgeNormalMatrix = new Three.Matrix3();

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      if (!isNearViewport.current) {
        return;
      }

      if (!dragState.isDragging) {
        globeGroup.rotation.y += AUTO_ROTATION_SPEED;
      }

      if (!particleData) {
        renderer.render(scene, camera);
        return;
      }

      const positionAttribute = particleData.points.geometry.getAttribute("position") as Three.BufferAttribute;
      const colorAttribute = particleData.points.geometry.getAttribute("color") as Three.BufferAttribute;
      const sizeAttribute = particleData.points.geometry.getAttribute("size") as Three.BufferAttribute;
      const canvasWidth = renderer.domElement.clientWidth;
      const canvasHeight = renderer.domElement.clientHeight;

      for (let i = 0; i < particleData.particleCount; i++) {
        positionAttribute.setXYZ(
          i,
          particleData.originalPositions[i * 3],
          particleData.originalPositions[i * 3 + 1],
          particleData.originalPositions[i * 3 + 2]
        );
        colorAttribute.setXYZ(
          i,
          particleData.originalColors[i * 3],
          particleData.originalColors[i * 3 + 1],
          particleData.originalColors[i * 3 + 2]
        );
        sizeAttribute.setX(i, particleData.originalSizes[i]);
      }

      const mouseX = mousePosition.x;
      const mouseY = mousePosition.y;

      if (mouseX !== null && mouseY !== null) {
        globeGroup.updateMatrixWorld();
        cameraRight.setFromMatrixColumn(camera.matrixWorld, 0);
        cameraUp.setFromMatrixColumn(camera.matrixWorld, 1);

        for (let i = 0; i < particleData.particleCount; i++) {
          tempVector.set(positionAttribute.getX(i), positionAttribute.getY(i), positionAttribute.getZ(i));
          tempVector.applyMatrix4(globeGroup.matrixWorld);
          tempVector.project(camera);
          const screenParticleX = (tempVector.x * 0.5 + 0.5) * canvasWidth;
          const screenParticleY = (-tempVector.y * 0.5 + 0.5) * canvasHeight;
          const dx = mouseX - screenParticleX;
          const dy = mouseY - screenParticleY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < HOVER_RADIUS) {
            const factor = 1 - distance / HOVER_RADIUS;
            const newSize = particleData.originalSizes[i] + factor * (HOVER_PARTICLE_SIZE - 1);
            sizeAttribute.setX(i, newSize);
            const brightnessFactor = 0.5;
            const originalRed = particleData.originalColors[i * 3];
            const originalGreen = particleData.originalColors[i * 3 + 1];
            const originalBlue = particleData.originalColors[i * 3 + 2];
            colorAttribute.setXYZ(
              i,
              Math.min(1, originalRed + brightnessFactor * (1 - originalRed) * factor),
              Math.min(1, originalGreen + brightnessFactor * (1 - originalGreen) * factor),
              Math.min(1, originalBlue + brightnessFactor * (1 - originalBlue) * factor)
            );
            const moveFactor = (newSize - particleData.originalSizes[i]) * 4;
            if (distance > 0.001) {
              const moveDirectionX = dx / distance;
              const moveDirectionY = dy / distance;
              inverseMatrix.copy(globeGroup.matrixWorld).invert();
              offset.set(0, 0, 0);
              offset.addScaledVector(cameraRight, moveDirectionX * moveFactor);
              offset.addScaledVector(cameraUp, -moveDirectionY * moveFactor);
              offset.applyMatrix4(inverseMatrix);
              zeroTransformed.set(0, 0, 0).applyMatrix4(inverseMatrix);
              offset.sub(zeroTransformed);
              positionAttribute.setXYZ(
                i,
                particleData.originalPositions[i * 3] + offset.x,
                particleData.originalPositions[i * 3 + 1] + offset.y,
                particleData.originalPositions[i * 3 + 2] + offset.z
              );
            }
          }
        }
      }

      positionAttribute.needsUpdate = true;
      colorAttribute.needsUpdate = true;
      sizeAttribute.needsUpdate = true;

      updateFlightPaths(particleData.flightPaths, particleData.supplyChainEdges, positionAttribute);

      camera.getWorldDirection(cameraDirection);
      const positions = particleData.originalPositions;
      for (let e = 0; e < particleData.supplyChainEdges.length; e++) {
        const edge = particleData.supplyChainEdges[e];
        const si = edge.sourceIndex * 3;
        const ti = edge.targetIndex * 3;
        edgeNormal.set(
          (positions[si] + positions[ti]) / 2,
          (positions[si + 1] + positions[ti + 1]) / 2,
          (positions[si + 2] + positions[ti + 2]) / 2
        );
        edgeNormal.normalize();
        edgeNormal.applyMatrix3(edgeNormalMatrix.setFromMatrix4(globeGroup.matrixWorld)).normalize();
        const facing = -edgeNormal.dot(cameraDirection);
        const smoothFacing = facing * 0.5 + 0.5;
        const lineOpacity = 0.15 + smoothFacing * 0.45;
        (particleData.flightPaths[e].material as LineMaterial).opacity = lineOpacity;
      }

      const containerWidth = renderer.domElement.clientWidth;
      const containerHeight = renderer.domElement.clientHeight;
      const compactScale = Math.min(1, containerWidth / 700);
      (particleData.points.material as Three.ShaderMaterial).uniforms.sizeScale.value = compactScale;

      const pulsePhase = (Math.sin(Date.now() / 500) + 1) / 2;
      const pulseRadius =
        (PULSATION_RING_MIN_SCALE + pulsePhase * (PULSATION_RING_MAX_SCALE - PULSATION_RING_MIN_SCALE)) *
        globeScale *
        compactScale;
      globeGroup.updateMatrixWorld();
      for (let s = 0; s < particleData.specialIndices.length; s++) {
        const particleIndex = particleData.specialIndices[s];
        spriteWorldPosition.set(
          particleData.originalPositions[particleIndex * 3],
          particleData.originalPositions[particleIndex * 3 + 1],
          particleData.originalPositions[particleIndex * 3 + 2]
        );
        spriteWorldPosition.applyMatrix4(globeGroup.matrixWorld);
        particleData.ringSprites[s].position.copy(spriteWorldPosition);
        particleData.ringSprites[s].scale.setScalar(pulseRadius);
      }

      const tooltipOffsetPixels = TOOLTIP_OFFSET_Y * Math.sqrt(globeScale);
      for (let tooltipIndex = 0; tooltipIndex < particleData.tooltips.length; tooltipIndex++) {
        const tooltip = particleData.tooltips[tooltipIndex];
        const tooltipElement = tooltipElements[tooltipIndex];
        if (!tooltipElement) {
          continue;
        }
        tooltipPosition.set(
          particleData.originalPositions[tooltip.nodeIndex * 3],
          particleData.originalPositions[tooltip.nodeIndex * 3 + 1],
          particleData.originalPositions[tooltip.nodeIndex * 3 + 2]
        );
        tooltipPosition.applyMatrix4(globeGroup.matrixWorld);
        const screenX = tooltipPosition.x + containerWidth / 2;
        const screenY = containerHeight / 2 - tooltipPosition.y;
        if (tooltip.anchor === "bottom-left") {
          tooltipElement.style.transform = `translate(${screenX}px, ${screenY + tooltipOffsetPixels}px) translate(-100%, 0%) scale(${compactScale})`;
        } else {
          tooltipElement.style.transform = `translate(${screenX}px, ${screenY - tooltipOffsetPixels}px) translate(-50%, -100%) scale(${compactScale})`;
        }
      }

      renderer.render(scene, camera);
    }

    animate();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth === 0 || newHeight === 0) {
          return;
        }
        renderer.setSize(newWidth, newHeight);
        camera.left = -newWidth / 2;
        camera.right = newWidth / 2;
        camera.top = newHeight / 2;
        camera.bottom = -newHeight / 2;
        camera.updateProjectionMatrix();
        globeScale = (Math.min(newWidth, newHeight) * GLOBE_FIT) / (GLOBE_RADIUS * 2);
        globeGroup.scale.setScalar(globeScale);
        backdropMesh.scale.setScalar(globeScale);
        if (particleData) {
          for (const line of particleData.flightPaths) {
            (line.material as LineMaterial).resolution.set(newWidth, newHeight);
          }
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      worldMapImage.onload = null;
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mouseleave", handleMouseOut);
      resizeObserver.disconnect();

      scene.traverse((object) => {
        if (object instanceof Three.Mesh || object instanceof Three.Points) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            for (const material of object.material) {
              material.dispose();
            }
          } else {
            object.material.dispose();
          }
        }
        if (object instanceof Three.Sprite) {
          object.material.map?.dispose();
          object.material.dispose();
        }
        if (object instanceof Line2) {
          object.geometry.dispose();
          (object.material as LineMaterial).dispose();
        }
      });

      circleTexture.dispose();
      ringTexture.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      for (const tooltipElement of tooltipElements) {
        if (tooltipElement.parentNode === container) {
          container.removeChild(tooltipElement);
        }
      }
    };
  }, [isNearViewport]);

  return <div className="globe" id="globe" aria-hidden={true} ref={hostRef} />;
}
