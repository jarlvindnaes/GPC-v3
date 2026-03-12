import type React from "react";
import { useEffect, useState } from "react";
import { DppCollapsibleSection } from "./DppCollapsibleSection";
import { certIcons } from "./dppIcons";
import { slopeChair } from "./dppProductData";

const data = slopeChair;

/** Simple inline divider */
function Divider() {
  return <div aria-hidden="true" className="w-full h-px bg-[#d5d5d5] shrink-0" />;
}

function ForestStewardshipCouncilLogo() {
  return (
    <div className="h-[79px] relative shrink-0 w-[66px]" data-name="Forest_Stewardship_Council_(logo) 1">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 66 79"
        role="img"
        aria-label="FSC — Forest Stewardship Council certified"
      >
        <g clipPath="url(#clip0_dpp_maint_21275)" id="Forest_Stewardship_Council_(logo) 1">
          <path d={certIcons.p3208700} fill="var(--fill-0, #231F20)" id="Vector" />
          <path d={certIcons.p3208700} fill="var(--fill-0, #231F20)" id="Vector_2" />
          <path d={certIcons.p38c3d100} fill="var(--fill-0, #231F20)" id="Vector_3" />
          <path d={certIcons.pc1d6f00} fill="var(--fill-0, #231F20)" id="Vector_4" />
          <path d={certIcons.peea6400} fill="var(--fill-0, #231F20)" id="Vector_5" />
          <path d={certIcons.p153b6100} fill="var(--fill-0, #231F20)" id="Vector_6" />
          <path d={certIcons.p2c27a2c0} fill="var(--fill-0, #231F20)" id="Vector_7" />
          <path d={certIcons.p30a1fa00} fill="var(--fill-0, #231F20)" id="Vector_8" />
          <path d={certIcons.p2f41f900} fill="var(--fill-0, #231F20)" id="Vector_9" />
          <path d={certIcons.p14bf3f00} fill="var(--fill-0, #231F20)" id="Vector_10" />
        </g>
        <defs>
          <clipPath id="clip0_dpp_maint_21275">
            <rect fill="white" height="79" width="66" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Chart2() {
  // 100% replaceable - single continuous green arch
  return (
    <figure
      className="h-[75px] relative shrink-0 w-[150px] m-0"
      data-name="chart"
      aria-label="Component replaceability gauge"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 150 75"
        role="img"
        aria-label="100% of components are replaceable"
      >
        {/* Outer arc from left to right, inner arc back - creates donut/arch shape */}
        <path d="M 3 75 A 72 72 0 0 1 147 75 L 130.5 75 A 54 54 0 0 0 19.5 75 Z" fill="#B5F7D5" />
      </svg>
    </figure>
  );
}

function EcoLabel() {
  return (
    <div className="relative shrink-0 size-[80px]" data-name="EcoLabel">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 80 80"
        role="img"
        aria-label="EU Ecolabel certified"
      >
        <g id="EcoLabel">
          <path d={certIcons.p3465ec00} fill="var(--fill-0, white)" id="Vector" />
          <path d={certIcons.p17cafb80} fill="var(--fill-0, #2B689D)" id="Vector_2" />
          <g id="Union">
            <path d={certIcons.p29504bf0} fill="var(--fill-0, #2B689D)" />
            <path d={certIcons.p1faa1e00} fill="var(--fill-0, #2B689D)" />
            <path d={certIcons.p52b0a80} fill="var(--fill-0, #2B689D)" />
            <path d={certIcons.p23b48400} fill="var(--fill-0, #2B689D)" />
            <path d={certIcons.p3c1a2700} fill="var(--fill-0, #2B689D)" />
            <path d={certIcons.p9e98580} fill="var(--fill-0, #2B689D)" />
            <path d={certIcons.p14091b40} fill="var(--fill-0, #2B689D)" />
            <path d={certIcons.p3f266500} fill="var(--fill-0, #2B689D)" />
            <path d={certIcons.pf0a1d00} fill="var(--fill-0, #2B689D)" />
            <path d={certIcons.p114c36f0} fill="var(--fill-0, #2B689D)" />
            <path d={certIcons.p24adde00} fill="var(--fill-0, #2B689D)" />
            <path d={certIcons.p24c93e80} fill="var(--fill-0, #2B689D)" />
          </g>
          <g id="Group 20">
            <path d={certIcons.p4860580} id="Vector_3" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p709db00} id="Vector_4" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p46a2700} id="Vector_5" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p269437f2} id="Vector_6" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p276fe70} id="Vector_7" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p2e5f100} fill="var(--fill-0, #53AE47)" id="Vector_8" />
            <path d={certIcons.p3e23f400} id="Vector_9" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p3ae744f0} id="Vector_10" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p37c77600} id="Vector_11" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p2064a000} id="Vector_12" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p38ea8580} id="Vector_13" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p17da8200} id="Vector_14" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p1da6180} id="Vector_15" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p13fb3f00} id="Vector_16" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.pd63f300} id="Vector_17" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p4860580} fill="var(--fill-0, #53AE47)" id="Vector_18" />
            <path d={certIcons.p709db00} fill="var(--fill-0, #53AE47)" id="Vector_19" />
            <path d={certIcons.p46a2700} fill="var(--fill-0, #53AE47)" id="Vector_20" />
            <path d={certIcons.p269437f2} fill="var(--fill-0, #53AE47)" id="Vector_21" />
            <path d={certIcons.p276fe70} fill="var(--fill-0, #53AE47)" id="Vector_22" />
            <path d={certIcons.p2c199980} id="Vector_23" stroke="var(--stroke-0, #53AE47)" strokeWidth="0.13" />
            <path d={certIcons.p1ab04f00} fill="var(--fill-0, #53AE47)" id="Vector_24" />
            <path d={certIcons.p3ae744f0} fill="var(--fill-0, #53AE47)" id="Vector_25" />
            <path d={certIcons.p37c77600} fill="var(--fill-0, #53AE47)" id="Vector_26" />
            <path d={certIcons.p25e91500} fill="var(--fill-0, #53AE47)" id="Vector_27" />
            <path d={certIcons.p38ea8580} fill="var(--fill-0, #53AE47)" id="Vector_28" />
            <path d={certIcons.p17da8200} fill="var(--fill-0, #53AE47)" id="Vector_29" />
            <path d={certIcons.p1da6180} fill="var(--fill-0, #53AE47)" id="Vector_30" />
            <path d={certIcons.p13fb3f00} fill="var(--fill-0, #53AE47)" id="Vector_31" />
            <path d={certIcons.pd63f300} fill="var(--fill-0, #53AE47)" id="Vector_32" />
          </g>
          <g id="Union_2">
            <path d={certIcons.p23dd8580} fill="var(--fill-0, #53AE47)" />
            <path d={certIcons.pf385af2} fill="var(--fill-0, #53AE47)" />
            <path d={certIcons.p667fe00} fill="var(--fill-0, #53AE47)" />
            <path d={certIcons.p6eb4000} fill="var(--fill-0, #53AE47)" />
            <path d={certIcons.p150da800} fill="var(--fill-0, #53AE47)" />
            <path d={certIcons.p26d5d600} fill="var(--fill-0, #53AE47)" />
            <path d={certIcons.p36a76700} fill="var(--fill-0, #53AE47)" />
            <path d={certIcons.pa789500} fill="var(--fill-0, #53AE47)" />
          </g>
          <g id="Union_3">
            <path d={certIcons.p3214c280} fill="var(--fill-0, #2B689D)" />
            <path d={certIcons.p2eea9640} fill="var(--fill-0, #2B689D)" />
            <path clipRule="evenodd" d={certIcons.p3b0dc00} fill="var(--fill-0, #2B689D)" fillRule="evenodd" />
            <path d={certIcons.pd4effb0} fill="var(--fill-0, #2B689D)" />
            <path clipRule="evenodd" d={certIcons.p2f188d00} fill="var(--fill-0, #2B689D)" fillRule="evenodd" />
            <path clipRule="evenodd" d={certIcons.p24984f00} fill="var(--fill-0, #2B689D)" fillRule="evenodd" />
            <path clipRule="evenodd" d={certIcons.p261f0cf0} fill="var(--fill-0, #2B689D)" fillRule="evenodd" />
            <path d={certIcons.p3e4f0b30} fill="var(--fill-0, #2B689D)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function NordicSwan() {
  return (
    <div className="relative shrink-0 size-[80px]" data-name="Nordic Swan">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 80 80"
        role="img"
        aria-label="Nordic Swan Ecolabel certified"
      >
        <g clipPath="url(#clip0_dpp_maint_21249)" id="Nordic Swan">
          <circle cx="40.0053" cy="40" fill="var(--fill-0, white)" id="Ellipse 10" r="40" />
          <g id="Group">
            <path d={certIcons.p33c88c80} fill="var(--fill-0, #00A65D)" id="Vector" />
            <path d={certIcons.p1be8ee00} fill="var(--fill-0, #00A65D)" id="Vector_2" />
            <path d={certIcons.pe046c00} fill="var(--fill-0, #00A65D)" id="Vector_3" />
            <path d={certIcons.p7dafa30} fill="var(--fill-0, #00A65D)" id="Vector_4" />
            <path d={certIcons.p23c16e00} fill="var(--fill-0, #00A65D)" id="Vector_5" />
            <path d={certIcons.p261e2df0} fill="var(--fill-0, #00A65D)" id="Vector_6" />
            <path d={certIcons.p3396bfc0} fill="var(--fill-0, #00A65D)" id="Vector_7" />
            <path d={certIcons.pdd68200} fill="var(--fill-0, #00A65D)" id="Vector_8" />
            <path d={certIcons.p23b9ae00} fill="var(--fill-0, #00A65D)" id="Vector_9" />
            <path d={certIcons.p226dc100} fill="var(--fill-0, #00A65D)" id="Vector_10" />
            <path d={certIcons.pac87080} fill="var(--fill-0, #00A65D)" id="Vector_11" />
            <path d={certIcons.pa15b700} fill="var(--fill-0, #00A65D)" id="Vector_12" />
            <path d={certIcons.p3cbad280} fill="var(--fill-0, #00A65D)" id="Vector_13" />
            <path d={certIcons.pbcea840} fill="var(--fill-0, #00A65D)" id="Vector_14" />
            <path d={certIcons.p27ba3dc0} fill="var(--fill-0, #00A65D)" id="Vector_15" />
            <path d={certIcons.p1282f300} fill="var(--fill-0, #00A65D)" id="Vector_16" />
            <path d={certIcons.p24665600} fill="var(--fill-0, #00A65D)" id="Vector_17" />
            <path d={certIcons.p18306e00} fill="var(--fill-0, #00A65D)" id="Vector_18" />
          </g>
          <path d={certIcons.p359fb080} fill="var(--fill-0, #00A65D)" id="Vector_19" />
        </g>
        <defs>
          <clipPath id="clip0_dpp_maint_21249">
            <rect fill="white" height="80" width="80" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function EpDverified() {
  return (
    <div className="relative shrink-0 size-[80px]" data-name="EPDverified">
      <div className="absolute inset-[-40%_-49.96%_-59.96%_-50%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 160 160"
          role="img"
          aria-label="EPD Verified — Environmental Product Declaration"
        >
          <g clipPath="url(#clip0_dpp_maint_21244)" filter="url(#filter0_dd_dpp_maint_21244)" id="EPDverified">
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
              id="filter0_dd_dpp_maint_21244"
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
            <clipPath id="clip0_dpp_maint_21244">
              <rect fill="white" height="80" transform="translate(40 32)" width="80" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
}

interface DppMaintenanceViewProps {
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}

export function DppMaintenanceView({ scrollRef }: DppMaintenanceViewProps) {
  const [lifespanWarrantyOpen, setLifespanWarrantyOpen] = useState(true);
  const [maintenanceCareOpen, setMaintenanceCareOpen] = useState(false);
  const [refurbishRepairOpen, setRefurbishRepairOpen] = useState(false);
  const [componentsOpen, setComponentsOpen] = useState(false);
  const [reuseOpen, setReuseOpen] = useState(false);
  const [endOfLifeOpen, setEndOfLifeOpen] = useState(false);

  useEffect(() => {
    if (scrollRef?.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [scrollRef]);

  const componentData = data.materialsAndComponents.components;

  return (
    <div className="relative w-full pb-[80px]">
      {/* Hero Image */}
      <div className="shrink-0 w-full" data-name="hero image">
        <img
          alt={`${data.categorization.displayName} — detail view`}
          className="w-full block pointer-events-none"
          src={data.commerce.photographs.detail}
        />
      </div>

      {/* Title Section */}
      <div className="relative shrink-0 w-full">
        <div className="flex flex-row items-end overflow-clip rounded-[inherit] size-full">
          <div className="box-border content-stretch flex items-end pb-[40px] pl-0 pr-[20px] pt-[10px] relative w-full">
            <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Title">
              <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                <div className="box-border content-stretch flex items-center px-[16px] py-[10px] relative w-full">
                  <div className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[16px] text-[rgba(0,4,24,0.58)] text-nowrap whitespace-pre font-width-normal">
                    <h1 className="font-['SF_Pro:Bold',sans-serif] font-bold mb-0 text-[rgba(0,7,19,0.62)] font-width-normal">
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

      {/* Lifespan & Warranty Section */}
      <DppCollapsibleSection
        title="Lifespan & Warranty"
        isOpen={lifespanWarrantyOpen}
        onToggle={() => setLifespanWarrantyOpen(!lifespanWarrantyOpen)}
      >
        <div className="flex flex-col gap-[20px] pb-[20px]">
          {data.lifecycleAndMaintenance.expectedLifetimeValue && (
            <div>
              <div className="flex items-baseline gap-[8px] mb-[6px]">
                <span className="font-['SF_Pro:Bold',sans-serif] font-bold text-[28px] text-[rgba(0,7,19,0.72)] leading-[32px] font-width-normal">
                  {`${data.lifecycleAndMaintenance.expectedLifetimeValue.value}+`}
                </span>
                <span className="font-['SF_Pro:Regular',sans-serif] text-[16px] text-[rgba(0,7,19,0.50)] leading-[20px] font-width-normal">
                  {`${data.lifecycleAndMaintenance.expectedLifetimeValue.unit} expected lifetime`}
                </span>
              </div>
              <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[24px] text-[16px] text-[rgba(0,7,19,0.62)] mb-0 font-width-normal">
                With regular care. Leather cushions can be re-dyed or replaced, and the walnut frame can be sanded and re-oiled to extend functional life.
              </p>
            </div>
          )}
          {data.lifecycleAndMaintenance.warrantyDuration && (
            <div>
              <div className="flex items-baseline gap-[8px] mb-[6px]">
                <span className="font-['SF_Pro:Bold',sans-serif] font-bold text-[28px] text-[rgba(0,7,19,0.72)] leading-[32px] font-width-normal">
                  {data.lifecycleAndMaintenance.warrantyDuration.value}
                </span>
                <span className="font-['SF_Pro:Regular',sans-serif] text-[16px] text-[rgba(0,7,19,0.50)] leading-[20px] font-width-normal">
                  {`${data.lifecycleAndMaintenance.warrantyDuration.unit} warranty`}
                </span>
              </div>
              <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[24px] text-[16px] text-[rgba(0,7,19,0.62)] mb-0 font-width-normal">
                Warranty against defective materials and workmanship. Lifetime Repair Promise ensures replacement parts remain available.
              </p>
            </div>
          )}
        </div>
      </DppCollapsibleSection>

      <Divider />

      {/* Maintenance & Care Section */}
      <DppCollapsibleSection
        title="Maintenance & Care"
        isOpen={maintenanceCareOpen}
        onToggle={() => setMaintenanceCareOpen(!maintenanceCareOpen)}
      >
        <div className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[16px] text-[rgba(0,7,19,0.62)] w-full pb-[20px] font-width-normal">
          {data.lifecycleAndMaintenance.maintenanceInstructions.map((instruction, index) => (
            <p
              key={index}
              className={index < data.lifecycleAndMaintenance.maintenanceInstructions.length - 1 ? "mb-4" : "mb-0"}
            >
              {instruction}
            </p>
          ))}
        </div>
      </DppCollapsibleSection>

      <Divider />

      {/* Refurbish & Repair Section */}
      <DppCollapsibleSection
        title="Refurbish & Repair"
        isOpen={refurbishRepairOpen}
        onToggle={() => setRefurbishRepairOpen(!refurbishRepairOpen)}
      >
        <div className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[16px] text-[rgba(0,7,19,0.62)] w-full pb-[20px] font-width-normal">
          {data.lifecycleAndMaintenance.refurbishAndRepair.map((text, index) => (
            <p
              key={index}
              className={index < data.lifecycleAndMaintenance.refurbishAndRepair.length - 1 ? "mb-4" : "mb-0"}
            >
              {text}
            </p>
          ))}
        </div>
      </DppCollapsibleSection>

      <Divider />

      {/* Component Replaceability Section */}
      <DppCollapsibleSection
        title="Component Replaceability"
        isOpen={componentsOpen}
        onToggle={() => setComponentsOpen(!componentsOpen)}
      >
        <div
          className="box-border content-stretch flex flex-col gap-[8px] items-center overflow-clip px-0 py-[8px] relative shrink-0 w-full"
          data-name="Graph"
        >
          <div className="relative shrink-0 w-full" data-name="Chart-Parts">
            <div className="flex flex-col items-center size-full">
              <div className="box-border content-stretch flex flex-col gap-[24px] items-center p-[12px] relative w-full">
                <Chart2 />
                <div
                  className="content-center flex flex-wrap gap-[13px] items-center justify-between relative shrink-0 w-full"
                  data-name="Part types"
                >
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Wood">
                    <div className="bg-[#b5f7d5] rounded-[3px] shrink-0 size-[16px]" />
                    <p className="font-['SF_Pro:Light',sans-serif] font-[274.315] leading-[16px] relative shrink-0 text-[12px] text-[rgba(0,7,19,0.62)] text-nowrap tracking-[0.04px] whitespace-pre font-width-normal">
                      Replaceable
                    </p>
                  </div>
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Assemblies">
                    <div className="bg-[#fcbfbf] rounded-[3px] shrink-0 size-[16px]" />
                    <p className="font-['SF_Pro:Light',sans-serif] font-[274.315] leading-[16px] relative shrink-0 text-[12px] text-[rgba(0,7,19,0.62)] text-nowrap tracking-[0.04px] whitespace-pre font-width-normal">
                      Non-Replaceable
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="relative shrink-0 w-full h-[287px] overflow-hidden rounded-[8px] border border-[rgba(0,0,0,0.1)]">
          <div className="overflow-y-auto h-full max-h-[287px]">
            <table className="w-full border-collapse bg-white" data-name="Table">
              <thead className="bg-[#f0f0f0] sticky top-0 z-10">
                <tr className="border-b border-[rgba(1,1,46,0.13)]">
                  <th
                    scope="col"
                    className="min-h-[44px] p-[12px] text-left font-['SF_Pro:Medium',sans-serif] font-[510] leading-[20px] text-[#1c2024] text-[14px] text-nowrap font-width-normal"
                  >
                    Component
                  </th>
                  <th
                    scope="col"
                    className="min-h-[44px] p-[12px] text-left font-['SF_Pro:Medium',sans-serif] font-[510] leading-[20px] text-[#1c2024] text-[14px] text-nowrap whitespace-pre font-width-normal"
                  >
                    Replaceable
                  </th>
                </tr>
              </thead>
              <tbody>
                {componentData.map((component, index) => (
                  <tr
                    key={index}
                    className={
                      index > 0 && index < componentData.length - 1 ? "border-t border-[rgba(1,1,46,0.13)]" : ""
                    }
                  >
                    <td className="min-h-[44px] px-[16px] py-[10px]">
                      <p className="[white-space-collapse:collapse] font-['SF_Pro:Regular',sans-serif] font-normal leading-[20px] overflow-ellipsis overflow-hidden text-[#3451b2] text-[14px] text-nowrap max-w-full font-width-normal">
                        {component.name}
                      </p>
                      {(component.material || component.weight) && (
                        <p className="mt-[2px] font-['SF_Pro:Light',sans-serif] font-[274.315] leading-[16px] overflow-ellipsis overflow-hidden text-[12px] text-[rgba(0,7,19,0.58)] text-nowrap max-w-full font-width-normal">
                          {[
                            component.material,
                            component.weight ? `${component.weight.value} ${component.weight.unit}` : null
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}
                    </td>
                    <td className="min-h-[44px] p-[12px] w-[107px]">
                      {component.replaceable ? (
                        <span className="inline-flex items-center justify-center bg-[rgba(2,186,60,0.09)] px-[16px] py-[6px] rounded-[4px] font-['SF_Pro:Medium',sans-serif] font-[510] text-[14px] text-[rgba(0,107,59,0.91)] leading-[20px] text-nowrap font-width-normal">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center bg-[rgba(255,1,1,0.06)] px-[16px] py-[6px] rounded-[4px] font-['SF_Pro:Medium',sans-serif] font-[510] text-[14px] text-[rgba(187,0,7,0.84)] leading-[20px] text-nowrap font-width-normal">
                          No
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            aria-hidden="true"
            className="absolute border border-[rgba(1,1,46,0.13)] border-solid inset-0 pointer-events-none rounded-[6px]"
          />
        </div>

        <div
          className="box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip pb-0 pt-[8px] px-0 relative shrink-0 w-full"
          data-name="Sub Info"
        >
          <p className="basis-0 font-['SF_Pro:Light',sans-serif] font-[274.315] grow leading-[14px] min-h-px min-w-px relative shrink-0 text-[16px] text-[rgba(0,7,19,0.62)] text-right font-width-normal">
            <span className="font-['SF_Pro:Bold',sans-serif] font-bold font-width-normal">
              {data.materialsAndComponents.components.length}
            </span>
            <span>{" individual components"}</span>
          </p>
        </div>
      </DppCollapsibleSection>

      <Divider />

      {/* Reuse Section */}
      <DppCollapsibleSection title="Reuse" isOpen={reuseOpen} onToggle={() => setReuseOpen(!reuseOpen)}>
        <div className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[16px] text-[rgba(0,7,19,0.62)] w-full pb-[20px] font-width-normal">
          <p className="mb-0">{data.lifecycleAndMaintenance.takeBackProgram}</p>
        </div>
      </DppCollapsibleSection>

      <Divider />

      {/* End of Life Section */}
      <DppCollapsibleSection
        title="End of Life"
        isOpen={endOfLifeOpen}
        onToggle={() => setEndOfLifeOpen(!endOfLifeOpen)}
      >
        <div className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[16px] text-[rgba(0,7,19,0.62)] w-full pb-[20px] font-width-normal">
          <p className="mb-0">{data.lifecycleAndMaintenance.endOfLife}</p>
        </div>
      </DppCollapsibleSection>

      {/* Image 3 */}
      <div className="shrink-0 w-full" data-name="image 3">
        <img
          alt={`${data.materialsAndComponents.primaryMaterial} — material source`}
          className="w-full block pointer-events-none"
          src={data.commerce.photographs.materialSource}
        />
      </div>
    </div>
  );
}
