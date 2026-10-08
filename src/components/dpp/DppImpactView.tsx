import type React from "react";
import { useEffect, useState } from "react";
import { DppCollapsibleSection } from "./DppCollapsibleSection";
import { certIcons, redListIcons } from "./dppIcons";
import { slopeChair } from "./dppProductData";

const data = slopeChair;

/** Simple inline divider */
function Divider() {
  return <div aria-hidden="true" className="h-px w-full shrink-0 bg-[#d5d5d5]" />;
}

function PefcLogo() {
  return (
    <div className="relative h-[79px] w-[66px] shrink-0" data-name="PEFC_Logo">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 67 80"
        role="img"
        aria-label="PEFC certified sustainable forestry"
      >
        <g clipPath="url(#clip0_11527_15330)">
          <rect x="1" y="1" width="64" height="78" rx="6" fill="white" />
          <path
            d="M61.5997 0C64.3639 0.465753 66.4417 2.6758 67 5.38813V74.7032C66.7712 75.6621 66.5332 76.5571 65.9749 77.379C65.0138 78.8037 63.531 79.6438 61.8743 80H5.12568C2.47131 79.3699 0.530874 77.2694 0 74.6119V5.2968C0.375273 2.66667 2.60861 0.292237 5.30874 0H61.5997ZM5.56503 2.21918C3.70697 2.47489 2.34317 3.92694 2.19672 5.79909V74.1187C2.34317 75.8539 3.9541 77.6621 5.72063 77.8174H61.3801C63.3571 77.5708 64.6751 76.0822 64.8124 74.1187V5.89041C64.6019 4.11872 63.0184 2.34703 61.197 2.19178L5.56503 2.21918Z"
            fill="black"
          />
          <path
            d="M47.2297 27.8539L47.5043 25.6164C47.5043 16.7306 40.2276 12.137 31.8343 13.6347C27.8894 14.3379 24.5119 16.3014 21.5097 18.8584C20.7775 19.4886 20.4297 20.1187 19.3496 20.3653C18.2696 20.6119 19.2032 20.3653 19.2215 20.2374C22.5623 16.3196 27.0839 13.1963 32.0906 11.7991C37.2621 10.347 43.184 10.6575 47.5866 13.9452C51.6597 16.9863 53.4995 22.137 52.8588 27.1324L52.6299 27.0868L50.5797 24.8493L47.2297 27.863V27.8539Z"
            fill="black"
          />
          <path
            d="M50.2501 27.4886L52.3187 29.9635C50.0945 38.0822 42.9918 44.8311 34.9463 47.1507C28.2371 49.0776 20.4113 47.9726 16.2742 41.8995C13.8212 38.2922 13.2445 33.0685 14.5809 28.9406C14.6083 28.8493 14.6083 28.6667 14.7365 28.6849C14.7365 29.242 15.011 29.8265 15.0202 30.3744C15.0294 31.2603 14.8005 32.1827 14.828 33.1142C15.011 38.2283 18.2878 42.5936 23.2304 44C32.594 46.6667 43.1291 39.6986 46.4059 31.0137L50.0213 27.589L50.2501 27.4977V27.4886Z"
            fill="black"
          />
          <path
            d="M24.9879 39.1781H21.1437V34.5206C15.8532 33.0228 14.3247 26.2101 18.6266 22.6484C22.9285 19.0868 32.4568 23.79 29.6743 30.5662C28.823 32.6393 27.0748 33.9635 24.9879 34.6575V39.1781Z"
            fill="black"
          />
          <path
            d="M42.7447 35.0685H37.0699V39.0868H33.3172V35.0685H27.4592C28.2738 34.4749 29.1342 33.927 29.7932 33.1507C31.5232 31.1324 31.9808 28.7215 31.7154 26.1187L35.1478 19.5434L42.7447 35.0685Z"
            fill="black"
          />
          <path
            d="M32.31 51.2329V53.3334H26.7267V54.5206H30.571V56.621H26.7267V57.9909H32.31V60.0914H24.3469V51.2329H32.31Z"
            fill="black"
          />
          <path
            d="M15.8347 57.5343V60.0914H13.455V55.4338H18.8095C18.8827 55.4338 19.1568 55.3824 19.4044 55.1142C19.7248 54.7672 19.7522 54.0548 19.441 53.6987C19.1298 53.3425 18.782 53.3334 18.7088 53.3334H13.4458V51.2329H18.8003C21.4272 51.2329 23.1571 54.3927 21.2716 56.4384C20.1757 57.5343 19.6332 57.5343 18.9834 57.5343H15.8256H15.8347Z"
            fill="black"
          />
          <path
            d="M49.225 51.0685C50.662 51.0411 52.2638 51.6073 53.2615 52.6576C53.2981 52.8585 51.6597 53.8539 51.3943 54.0366C49.6643 52.0731 45.9025 53.7078 46.7079 56.3653C47.5134 59.0229 49.9756 58.7306 51.3943 57.4429L53.2706 58.6758C50.8542 61.379 45.3441 60.5297 44.3098 56.9315C43.3762 53.6987 46.1221 51.1233 49.2342 51.0685H49.225Z"
            fill="black"
          />
          <path
            d="M42.9277 51.2329V53.3334H37.3444V54.5206H41.1886V56.621H37.3444V60.0914H34.9646V51.2329H42.9277Z"
            fill="black"
          />
          <path
            d="M19.8622 65.2968V65.6621H17.757V66.758H19.6791V67.2146H17.757V68.4018H19.9537L19.8164 68.8585H17.2993V65.2968H19.8622Z"
            fill="black"
          />
          <path
            d="M33.317 66.2101C32.7312 66.3288 32.9966 65.7352 32.4383 65.6621C31.88 65.5891 31.5138 66.2831 31.5779 66.8493C33.6373 65.4886 34.1865 69.1598 32.0905 68.8493C30.6718 68.6393 30.8457 65.5799 32.0081 65.3151C33.1705 65.0502 33.3444 65.4612 33.317 66.2101ZM32.7403 68.3744C33.2804 67.9452 32.9051 66.4658 31.9074 67.0411C30.9097 67.6165 31.9166 69.032 32.7403 68.3744Z"
            fill="black"
          />
          <path
            d="M14.4618 67.3973V68.8585H14.0042V65.2968H15.972C16.21 65.2968 16.5853 65.7534 16.6402 66C16.924 67.4155 15.4869 67.4795 14.4618 67.3973ZM14.4618 66.9406C16.7958 67.2877 16.7775 65.3425 14.4618 65.6621V66.9406Z"
            fill="black"
          />
          <path
            d="M26.4523 66.3014L26.0862 66.3562C25.8299 65.7443 25.5187 65.589 24.8506 65.6621C24.1824 65.7352 23.8254 67.0411 24.0451 67.7534C24.3654 68.7854 25.9947 68.7397 26.0862 67.589L26.5439 67.6804C26.5347 68.2101 25.9947 68.7763 25.4821 68.8585C22.8735 69.2694 22.7728 65.3059 25.0336 65.2055C25.656 65.1781 26.4889 65.5982 26.4432 66.3014H26.4523Z"
            fill="black"
          />
          <path
            d="M51.6231 65.7534L51.44 66.6667C52.511 66.1096 53.3713 66.7854 53.1608 67.9726C52.9503 69.1598 50.9092 69.1872 50.8909 67.8539H51.3394C51.5957 69.1142 53.1334 68.4292 52.6482 67.242C52.1631 66.0548 51.5224 67.1507 50.9824 67.1233L51.257 65.2968H52.9503C53.1242 65.2968 53.1242 65.7534 52.9503 65.7534H51.6231Z"
            fill="black"
          />
          <path
            d="M43.2023 68.4019H44.9414V68.8585H42.5616C42.5341 67.9178 44.4379 67.0959 44.4837 66.3379C44.5386 65.3973 42.9918 65.3973 43.1108 66.3927L42.6531 66.3014C42.6256 65.2877 44.1817 64.9224 44.7125 65.6621C45.518 66.7854 43.7606 67.653 43.2023 68.4019Z"
            fill="black"
          />
          <path
            d="M37.1612 66.8493C37.1978 67.0046 37.4358 66.9863 37.5731 67.1233C37.8111 67.3425 37.8385 67.6804 37.7928 67.9909C37.6097 69.2146 35.5503 69.1872 35.5137 67.863L35.953 67.8813C36.0629 68.8493 37.39 68.6758 37.3443 67.7352C37.3168 67.1507 36.8226 67.0228 36.3283 67.1416C36.2642 66.6119 36.9507 66.8128 37.1063 66.5023C37.39 65.9178 36.9598 65.5982 36.3924 65.6986C35.8249 65.7991 36.1361 66.0822 35.9622 66.1827C35.4496 66.4932 35.4679 65.7808 35.9896 65.4795C37.1154 64.8219 38.3511 66.1827 37.1521 66.8676L37.1612 66.8493Z"
            fill="black"
          />
          <path
            d="M47.0465 66.8493C47.0831 67.0046 47.3211 66.9863 47.4584 67.1233C47.6963 67.3425 47.7238 67.6804 47.678 67.9909C47.495 69.2146 45.4355 69.1872 45.3989 67.863L45.8383 67.8813C45.9481 68.8493 47.2753 68.6758 47.2295 67.7352C47.2021 67.1507 46.7078 67.0228 46.2135 67.1416C46.1495 66.6119 46.8359 66.8128 46.9916 66.5023C47.2753 65.9178 46.8451 65.5982 46.2776 65.6986C45.7101 65.7991 46.0213 66.0822 45.8474 66.1827C45.3349 66.4932 45.3532 65.7808 45.8749 65.4795C47.0007 64.8219 48.2364 66.1827 47.0373 66.8676L47.0465 66.8493Z"
            fill="black"
          />
          <path
            d="M22.974 65.2968V65.6621H21.0519V66.758H22.6994V67.2146H21.0519V68.8585H20.5942V65.2968H22.974Z"
            fill="black"
          />
          <path
            d="M40.5478 65.2968C40.6393 65.7717 40.2366 65.9817 40.0169 66.3653C39.5684 67.169 39.3121 67.9361 39.1657 68.8493L38.8087 68.8676C38.7721 68.1827 39.0101 67.3881 39.3121 66.7671C39.6142 66.1461 39.7698 66.1187 39.9071 65.7626H38.2595V65.3059H40.5478V65.2968Z"
            fill="black"
          />
          <path
            d="M50.433 65.2968C50.5246 65.7717 50.1218 65.9817 49.9022 66.3653C49.4537 67.169 49.1974 67.9361 49.0509 68.8493L48.694 68.8676C48.6573 68.1827 48.8953 67.3881 49.1974 66.7671C49.4994 66.1461 49.655 66.1187 49.7923 65.7626H48.1448V65.3059H50.433V65.2968Z"
            fill="black"
          />
          <path
            d="M30.0218 65.2968V68.8585H29.5641V66.1187L28.7861 66.5753C28.6305 66.6027 28.6397 66.5753 28.6488 66.4384C28.6672 66.0274 29.0241 66.0365 29.2987 65.7991C29.5733 65.5616 29.6191 65.1964 30.031 65.2968H30.0218Z"
            fill="black"
          />
          <path d="M28.0998 65.2968L27.1753 68.9407L26.8184 68.9498L27.7428 65.3059L28.0998 65.2968Z" fill="black" />
          <path d="M35.1476 67.306H33.7747V67.7626H35.1476V67.306Z" fill="black" />
          <path d="M42.287 67.306H40.9141V67.7626H42.287V67.306Z" fill="black" />
        </g>
        <defs>
          <clipPath id="clip0_11527_15330">
            <rect width="67" height="80" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

/**
 * Donut chart drawn from the data: one segment per entry, sized by its percentage, with a
 * small gap between segments. (Replaces two fixed-shape charts from the design export that did not
 * follow the numbers.)
 */
function DonutChart({
  segments,
  label
}: {
  segments: { label: string; percentage: number; chartColor: string }[];
  label: string;
}) {
  const size = 150;
  const stroke = 22;
  const r = (size - stroke) / 2;
  const c = size / 2;
  const total = segments.reduce((sum, seg) => sum + seg.percentage, 0) || 1;
  // Square ends and a small gap, so each segment's arc is exactly its share (rounded ends would add
  // ~10 degrees to each end and make small shares look much bigger).
  const gapDeg = segments.length > 1 ? 2.5 : 0;
  const outer = r + stroke / 2;
  const inner = r - stroke / 2;
  const point = (deg: number, radius: number) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return `${(c + radius * Math.cos(a)).toFixed(2)} ${(c + radius * Math.sin(a)).toFixed(2)}`;
  };
  let start = 0;
  const arcs = segments.map((seg) => {
    const sweep = (seg.percentage / total) * 360;
    const from = start + gapDeg / 2;
    const to = Math.max(start + sweep - gapDeg / 2, from + 0.5);
    start += sweep;
    const large = to - from > 180 ? 1 : 0;
    // A filled ring segment (outer arc, then back along the inner arc) rather than a thick stroke:
    // filled shapes survive the passport phone's 3D transform cleanly, thick stroked arcs can break up.
    return {
      seg,
      d: `M ${point(from, outer)} A ${outer} ${outer} 0 ${large} 1 ${point(to, outer)} L ${point(to, inner)} A ${inner} ${inner} 0 ${large} 0 ${point(from, inner)} Z`
    };
  });
  const description = `${label}: ${segments.map((seg) => `${seg.label} ${seg.percentage}%`).join(", ")}`;
  return (
    <figure className="relative m-0 size-[150px] shrink-0" data-name="chart">
      <svg className="block size-full" viewBox={`0 0 ${size} ${size}`} role="img" aria-label={description}>
        {arcs.map(({ seg, d }) => (
          <path key={seg.label} d={d} fill={seg.chartColor} />
        ))}
      </svg>
    </figure>
  );
}

function RedListLogo() {
  return (
    <div className="relative size-[80px] shrink-0" data-name="Red List">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 80 80"
        role="img"
        aria-label="International Living Future Institute — Red List Free"
      >
        <g clipPath="url(#clip0_dpp_impact_14988)">
          <path d={redListIcons.d1} fill="#EE4D24" />
          <path d={redListIcons.d2} fill="#F37E71" />
          <path d={redListIcons.d3} fill="#F37E71" />
          <path d={redListIcons.d4} fill="#F37E71" />
          <path d={redListIcons.d5} fill="#F26F58" />
          <path d={redListIcons.redListFreeText} fill="white" />
          <path d={redListIcons.edText} fill="white" />
          <path d={redListIcons.dText} fill="white" />
          <path d={redListIcons.lText} fill="white" />
          <path d={redListIcons.iText} fill="white" />
          <path d={redListIcons.sText} fill="white" />
          <path d={redListIcons.tText} fill="white" />
          <path d={redListIcons.freeText} fill="white" />
          <path d={redListIcons.internationalText} fill="black" />
          <path d={redListIcons.livingText} fill="black" />
          <path d={redListIcons.futureText} fill="black" />
          <path d={redListIcons.instituteText} fill="black" />
        </g>
        <defs>
          <clipPath id="clip0_dpp_impact_14988">
            <rect width="80" height="80" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function EpDverified() {
  return (
    <div className="relative size-[80px] shrink-0" data-name="EPDverified">
      <div className="absolute inset-[-40%_-49.96%_-59.96%_-50%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 160 160"
          role="img"
          aria-label="EPD Verified — Environmental Product Declaration"
        >
          <g clipPath="url(#clip0_dpp_impact_21244)" filter="url(#filter0_dd_dpp_impact_21244)" id="EPDverified">
            <path d={certIcons.p204ab580} fill="var(--fill-0, #62B345)" id="Union" />
            <g id="Union_2">
              <path d={certIcons.p22e70c00} fill="var(--fill-0, white)" />
              <path d={certIcons.p24620b80} fill="var(--fill-0, white)" />
            </g>
            <g id="Text">
              <path clipRule="evenodd" d={certIcons.p3177d100} fill="var(--fill-0, #62B345)" fillRule="evenodd" />
              <path clipRule="evenodd" d={certIcons.p19322900} fill="var(--fill-0, #62B345)" fillRule="evenodd" />
              <path d={certIcons.p1f81b80} fill="var(--fill-0, #62B345)" />
              <path d={certIcons.p22fc47c0} fill="var(--fill-0, #62B345)" />
              <path clipRule="evenodd" d={certIcons.p30dcb500} fill="var(--fill-0, #62B345)" fillRule="evenodd" />
              <path d={certIcons.p193d5000} fill="var(--fill-0, #62B345)" />
              <path d={certIcons.pf59a280} fill="var(--fill-0, #62B345)" />
              <path clipRule="evenodd" d={certIcons.p338f5e80} fill="var(--fill-0, #62B345)" fillRule="evenodd" />
              <path d={certIcons.p29264670} fill="var(--fill-0, #62B345)" />
              <path d={certIcons.pe4b4c00} fill="var(--fill-0, #62B345)" />
              <path clipRule="evenodd" d={certIcons.p19608080} fill="var(--fill-0, #62B345)" fillRule="evenodd" />
              <path clipRule="evenodd" d={certIcons.p19f58900} fill="var(--fill-0, #62B345)" fillRule="evenodd" />
              <path d={certIcons.pa0a0e80} fill="var(--fill-0, #62B345)" />
            </g>
          </g>
          <defs>
            <filter
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
              height="160"
              id="filter0_dd_dpp_impact_21244"
              width="160"
              x="0"
              y="0"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                result="hardAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset dy="8" />
              <feGaussianBlur stdDeviation="20" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.012 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow" />
              <feColorMatrix
                in="SourceAlpha"
                result="hardAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feMorphology in="SourceAlpha" operator="erode" radius="16" result="effect2_dropShadow" />
              <feOffset dy="12" />
              <feGaussianBlur stdDeviation="16" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.000348066 0 0 0 0 0.000348066 0 0 0 0 0.231652 0 0 0 0.051 0"
              />
              <feBlend in2="effect1_dropShadow" mode="normal" result="effect2_dropShadow" />
              <feBlend in="SourceGraphic" in2="effect2_dropShadow" mode="normal" result="shape" />
            </filter>
            <clipPath id="clip0_dpp_impact_21244">
              <rect fill="white" height="80" transform="translate(40 32)" width="80" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
}

interface DppImpactViewProps {
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}

export default function DppImpactView({ scrollRef }: DppImpactViewProps) {
  const [materialDistributionOpen, setMaterialDistributionOpen] = useState(true);
  const [carbonFootprintOpen, setCarbonFootprintOpen] = useState(false);
  const [toxicityOpen, setToxicityOpen] = useState(false);
  const [recyclabilityOpen, setRecyclabilityOpen] = useState(false);
  const [certificationsOpen, setCertificationsOpen] = useState(true);

  useEffect(() => {
    if (scrollRef?.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [scrollRef]);

  return (
    <div className="relative w-full pb-[80px]">
      {/* Hero Image */}
      <div className="w-full shrink-0" data-name="hero image">
        <img
          alt={`${data.materialsAndComponents.primaryMaterial} — sustainably sourced material`}
          className="pointer-events-none block w-full"
          src={data.commerce.photographs.materialSource}
        />
      </div>

      {/* Title Section */}
      <div className="relative w-full shrink-0">
        <div className="flex size-full flex-row items-end overflow-clip rounded-[inherit]">
          <div className="relative box-border flex w-full content-stretch items-end pt-[10px] pr-[20px] pb-[40px] pl-0">
            <div className="relative min-h-px min-w-px shrink-0 grow basis-0" data-name="Title">
              <div className="flex size-full flex-row items-center overflow-clip rounded-[inherit]">
                <div className="relative box-border flex w-full content-stretch items-center px-[16px] py-[10px]">
                  <div className="relative shrink-0 whitespace-pre text-nowrap font-['SF_Pro:Regular',sans-serif] font-normal font-width-normal text-[16px] text-[rgba(50,47,49,0.58)] leading-[24px]">
                    <h1 className="mb-0 font-['SF_Pro:Bold',sans-serif] font-bold font-width-normal text-[rgba(50,47,49,0.62)]">
                      {data.categorization.displayName}
                    </h1>
                    <p>{`Designed by ${data.categorization.designer}`}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      {/* Material Distribution Section */}
      <DppCollapsibleSection
        title="Material distribution"
        isOpen={materialDistributionOpen}
        onToggle={() => setMaterialDistributionOpen(!materialDistributionOpen)}
      >
        <div
          className="relative box-border flex w-full shrink-0 flex-col content-stretch items-center gap-[8px] overflow-clip px-0 py-[8px]"
          data-name="Graph"
        >
          <div className="relative w-full shrink-0" data-name="Chart-Parts">
            <div className="flex size-full flex-col items-center">
              <div className="relative box-border flex w-full flex-col content-stretch items-center gap-[24px] p-[12px]">
                <div
                  className="relative flex w-full shrink-0 content-stretch items-start bg-[rgba(255,255,255,0)]"
                  data-name="Heading"
                >
                  <h3 className="relative min-h-px min-w-px shrink-0 grow basis-0 text-center font-['SF_Pro:Bold',sans-serif] font-bold font-width-normal text-[#1c2024] text-[14px] leading-[20px]">
                    What it's made from
                  </h3>
                </div>
                <DonutChart
                  segments={data.materialsAndComponents.materialComposition}
                  label="Material distribution"
                />
                <div
                  className="relative flex w-full shrink-0 flex-wrap content-center items-center justify-between gap-[13px]"
                  data-name="Part types"
                >
                  {data.materialsAndComponents.materialComposition.map((mat) => (
                    <div key={mat.material} className="relative flex shrink-0 content-stretch items-center gap-[8px]">
                      <div className="size-[16px] shrink-0 rounded-[3px]" style={{ backgroundColor: mat.chartColor }} />
                      <p className="relative shrink-0 whitespace-pre text-nowrap font-['SF_Pro:Light',sans-serif] font-[274.315] font-width-normal text-[12px] text-[rgba(50,47,49,0.62)] leading-[16px] tracking-[0.04px]">
                        {`${mat.label} ${mat.percentage}%`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="relative box-border flex w-full shrink-0 content-stretch items-center justify-center gap-[8px] overflow-clip px-0 pt-[8px] pb-[20px]"
          data-name="Sub Info"
        >
          <p className="relative min-h-px min-w-px shrink-0 grow basis-0 whitespace-pre-wrap text-right font-['SF_Pro:Light',sans-serif] font-[274.315] font-width-normal text-[0px] text-[14px] text-[rgba(50,47,49,0.62)] leading-[24px]">
            <span className="font-['SF_Pro:Bold',sans-serif] font-bold font-width-normal">{`${data.materialsAndComponents.totalWeight.value} `}</span>
            <span>{" kilograms"}</span>
          </p>
        </div>

        <div className="relative w-full shrink-0 px-[16px] pb-[20px] font-['SF_Pro:Regular',sans-serif] font-normal font-width-normal text-[16px] text-[rgba(50,47,49,0.62)] leading-[24px]">
          {data.materialsAndComponents.materialDescriptions.map((mat) => (
            <p key={mat.material} className="mb-4">
              <span className="font-['SF_Pro:Bold',sans-serif] font-bold font-width-normal">
                {mat.description ? `${mat.material}:` : mat.material}
              </span>
              {mat.description && ` ${mat.description}`}
            </p>
          ))}
          {data.materialsAndComponents.adhesive && (
            <p className="mb-4">
              <span className="font-['SF_Pro:Bold',sans-serif] font-bold font-width-normal">Adhesive:</span>
              {` ${data.materialsAndComponents.adhesive}`}
            </p>
          )}
          {data.materialsAndComponents.fasteners && (
            <p className="mb-4">
              <span className="font-['SF_Pro:Bold',sans-serif] font-bold font-width-normal">Fasteners:</span>
              {` ${data.materialsAndComponents.fasteners}`}
            </p>
          )}
          <p className="mb-4">
            <span className="font-['SF_Pro:Bold',sans-serif] font-bold font-width-normal">Packaging:</span>
            {` ${data.materialsAndComponents.packaging.summary}`}
          </p>
          <p className="mb-4">{data.materialsAndComponents.packaging.domestic}</p>
          <p className="mb-0">{data.materialsAndComponents.packaging.international}</p>
        </div>
      </DppCollapsibleSection>

      <Divider />

      {/* Carbon Footprint Section */}
      <DppCollapsibleSection
        title="Carbon footprint"
        isOpen={carbonFootprintOpen}
        onToggle={() => setCarbonFootprintOpen(!carbonFootprintOpen)}
      >
        <div
          className="relative box-border flex w-full shrink-0 flex-col content-stretch items-center gap-[8px] overflow-clip px-0 py-[8px]"
          data-name="Graph"
        >
          <div className="relative w-full shrink-0" data-name="Chart-Parts">
            <div className="flex size-full flex-col items-center">
              <div className="relative box-border flex w-full flex-col content-stretch items-center gap-[24px] p-[12px]">
                <div
                  className="relative flex w-full shrink-0 content-stretch items-start bg-[rgba(255,255,255,0)]"
                  data-name="Heading"
                >
                  <h3 className="relative min-h-px min-w-px shrink-0 grow basis-0 text-center font-['SF_Pro:Bold',sans-serif] font-bold font-width-normal text-[#1c2024] text-[14px] leading-[20px]">
                    Where emissions come from
                  </h3>
                </div>
                <DonutChart
                  segments={data.sustainabilityAndImpact.carbonFootprintByStage}
                  label="Carbon footprint by stage"
                />
                <div
                  className="relative flex w-full shrink-0 flex-wrap content-center items-center justify-between gap-[13px]"
                  data-name="Part types"
                >
                  {data.sustainabilityAndImpact.carbonFootprintByStage.map((stage) => (
                    <div key={stage.stage} className="relative flex shrink-0 content-stretch items-center gap-[8px]">
                      <div
                        className="size-[16px] shrink-0 rounded-[3px]"
                        style={{ backgroundColor: stage.chartColor }}
                      />
                      <p className="relative shrink-0 whitespace-pre text-nowrap font-['SF_Pro:Light',sans-serif] font-[274.315] font-width-normal text-[12px] text-[rgba(50,47,49,0.62)] leading-[16px] tracking-[0.04px]">
                        {`${stage.label} ${stage.percentage}%`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="relative box-border flex w-full shrink-0 flex-col content-stretch items-end gap-[4px] overflow-clip px-[12px] pt-[8px] pb-[20px]"
          data-name="Sub Info"
        >
          <p className="relative shrink-0 text-right font-['SF_Pro:Light',sans-serif] font-[274.315] font-width-normal text-[14px] text-[rgba(50,47,49,0.62)] leading-[24px]">
            <span className="font-['SF_Pro:Bold',sans-serif] font-bold font-width-normal text-[14px]">
              {data.sustainabilityAndImpact.carbonFootprintTotal.value}
            </span>
            <span className="text-[14px]">{" kg CO"}</span>
            <span className="text-[11px]">2</span>
            <span className="text-[16px]"> </span>
            <span className="text-[14px]">equivalent</span>
          </p>
          {data.sustainabilityAndImpact.carbonFootprintScope && (
            <p className="relative shrink-0 text-right font-['SF_Pro:Light',sans-serif] font-[274.315] font-width-normal text-[12px] text-[rgba(50,47,49,0.58)] leading-[16px]">
              {`Scope: ${data.sustainabilityAndImpact.carbonFootprintScope}`}
            </p>
          )}
          {data.sustainabilityAndImpact.carbonFootprintNote && (
            <p className="relative mt-[6px] shrink-0 text-right font-['SF_Pro:Regular',sans-serif] font-normal font-width-normal text-[12px] text-[rgba(50,47,49,0.58)] leading-[17px]">
              {data.sustainabilityAndImpact.carbonFootprintNote}
            </p>
          )}
        </div>
      </DppCollapsibleSection>

      <Divider />

      {/* Toxicity Section */}
      <DppCollapsibleSection title="Toxicity" isOpen={toxicityOpen} onToggle={() => setToxicityOpen(!toxicityOpen)}>
        <div className="relative w-full shrink-0 px-[16px] pb-[20px] font-['SF_Pro:Regular',sans-serif] font-normal font-width-normal text-[16px] text-[rgba(50,47,49,0.62)] leading-[24px]">
          <p className="mb-4">
            <span className="font-['SF_Pro:Bold',sans-serif] font-bold font-width-normal">VOC emissions:</span>
            {` ${data.sustainabilityAndImpact.vocData}`}
          </p>
          {data.sustainabilityAndImpact.redListFreeStatement && (
            <p className="mb-0">
              <span className="font-['SF_Pro:Bold',sans-serif] font-bold font-width-normal">Red List Free:</span>
              {` ${data.sustainabilityAndImpact.redListFreeStatement}`}
            </p>
          )}
        </div>
      </DppCollapsibleSection>

      <Divider />

      {/* Recyclability & Circularity Section */}
      <DppCollapsibleSection
        title="Recyclability & Circularity"
        isOpen={recyclabilityOpen}
        onToggle={() => setRecyclabilityOpen(!recyclabilityOpen)}
      >
        <div className="relative w-full shrink-0 px-[16px] pb-[20px] font-['SF_Pro:Regular',sans-serif] font-normal font-width-normal text-[16px] text-[rgba(50,47,49,0.62)] leading-[24px]">
          {/* Key circularity metrics */}
          <div className="mb-6 flex gap-[12px]">
            {data.sustainabilityAndImpact.recyclableContentPercent != null && (
              <div className="flex-1 rounded-[8px] border border-[rgba(173,245,209,0.50)] bg-[rgba(173,245,209,0.18)] p-[12px] text-center">
                <p className="mb-0 font-['SF_Pro:Bold',sans-serif] font-bold font-width-normal text-[#2D7A4F] text-[24px] leading-[28px]">
                  {`${data.sustainabilityAndImpact.recyclableContentPercent}%`}
                </p>
                <p className="mb-0 text-[12px] text-[rgba(50,47,49,0.58)] leading-[16px]">Recyclable</p>
              </div>
            )}
            {data.sustainabilityAndImpact.recycledContentPercent != null && (
              <div className="flex-1 rounded-[8px] border border-[rgba(182,212,252,0.55)] bg-[rgba(182,212,252,0.22)] p-[12px] text-center">
                <p className="mb-0 font-['SF_Pro:Bold',sans-serif] font-bold font-width-normal text-[#3560A0] text-[24px] leading-[28px]">
                  {`${data.sustainabilityAndImpact.recycledContentPercent}%`}
                </p>
                <p className="mb-0 text-[12px] text-[rgba(50,47,49,0.58)] leading-[16px]">Recycled content</p>
              </div>
            )}
          </div>

          {data.sustainabilityAndImpact.recyclabilityAssessment && (
            <p className="mb-4">{data.sustainabilityAndImpact.recyclabilityAssessment}</p>
          )}

          {data.sustainabilityAndImpact.substancesOfConcern && (
            <p className="mb-0">
              <span className="font-['SF_Pro:Bold',sans-serif] font-bold font-width-normal">
                Substances of concern (REACH):
              </span>
              {` ${data.sustainabilityAndImpact.substancesOfConcern}`}
            </p>
          )}
        </div>
      </DppCollapsibleSection>

      <Divider />

      {/* Certifications Section */}
      <DppCollapsibleSection
        title="Certifications"
        isOpen={certificationsOpen}
        onToggle={() => setCertificationsOpen(!certificationsOpen)}
      >
        <div className="relative w-full shrink-0 px-[16px] pb-[16px]" data-name="content">
          {data.certificationsAndCompliance.buildingRatingContributions && (
            <p className="mb-4 font-['SF_Pro:Regular',sans-serif] font-normal font-width-normal text-[16px] text-[rgba(50,47,49,0.62)] leading-[24px]">
              {data.certificationsAndCompliance.buildingRatingContributions}
            </p>
          )}
          <div className="flex flex-col gap-[10px]">
            {data.certificationsAndCompliance.certifications.map((cert) => (
              <div
                key={cert.name}
                className="flex items-center gap-[14px] rounded-[8px] border border-[rgba(0,0,0,0.05)] bg-[rgba(0,0,0,0.02)] p-[12px]"
              >
                {cert.logo && (
                  <img
                    src={cert.logo}
                    alt={`${cert.name} logo`}
                    className="h-[52px] w-[52px] shrink-0 object-contain"
                    loading="lazy"
                  />
                )}
                <div className="min-w-0">
                <p className="mb-[2px] font-['SF_Pro:Bold',sans-serif] font-bold font-width-normal text-[14px] text-[rgba(50,47,49,0.72)] leading-[20px]">
                  {cert.name}
                </p>
                {cert.issuingBody && (
                  <p className="mb-[6px] font-['SF_Pro:Light',sans-serif] font-[274.315] font-width-normal text-[11px] text-[rgba(50,47,49,0.58)] leading-[14px]">
                    {cert.issuingBody}
                  </p>
                )}
                <p className="mb-0 font-['SF_Pro:Regular',sans-serif] font-normal font-width-normal text-[13px] text-[rgba(50,47,49,0.56)] leading-[20px]">
                  {cert.description}
                </p>
                {(cert.certificationId || cert.expiryDate) && (
                  <p className="mt-[6px] mb-0 font-['SF_Pro:Light',sans-serif] font-normal font-width-normal text-[11px] text-[rgba(50,47,49,0.58)] leading-[14px]">
                    {[
                      cert.certificationId && `Licence ${cert.certificationId}`,
                      cert.expiryDate &&
                        `valid until ${new Date(cert.expiryDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
                </div>
              </div>
            ))}
          </div>

          {/* Additional ESPR-required compliance data */}
          <div className="mt-[14px] font-['SF_Pro:Regular',sans-serif] font-normal font-width-normal text-[13px] text-[rgba(50,47,49,0.58)] leading-[22px]">
            {data.sustainabilityAndImpact.epdReference && (
              <p className="mb-[6px]">
                <span className="font-['SF_Pro:Bold',sans-serif] font-bold font-width-normal text-[rgba(50,47,49,0.62)]">
                  EPD reference:{" "}
                </span>
                {data.sustainabilityAndImpact.epdReference}
                {data.sustainabilityAndImpact.lcaMethodology && (
                  <span className="text-[rgba(50,47,49,0.58)]">{` (${data.sustainabilityAndImpact.lcaMethodology})`}</span>
                )}
              </p>
            )}
            {data.certificationsAndCompliance.fireSafety && (
              <p className="mb-[6px]">
                <span className="font-['SF_Pro:Bold',sans-serif] font-bold font-width-normal text-[rgba(50,47,49,0.62)]">
                  Fire safety:{" "}
                </span>
                {data.certificationsAndCompliance.fireSafety}
              </p>
            )}
            {data.certificationsAndCompliance.indoorAirQuality && (
              <p className="mb-0">
                <span className="font-['SF_Pro:Bold',sans-serif] font-bold font-width-normal text-[rgba(50,47,49,0.62)]">
                  Indoor air quality:{" "}
                </span>
                {data.certificationsAndCompliance.indoorAirQuality}
              </p>
            )}
          </div>
        </div>

      </DppCollapsibleSection>
    </div>
  );
}
