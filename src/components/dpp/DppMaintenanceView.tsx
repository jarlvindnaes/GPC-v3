import { type RefObject, useEffect, useState } from "react";
import { DppCollapsibleSection } from "./DppCollapsibleSection";
import { slopeChair } from "./dppProductData";

const data = slopeChair;

/** Simple inline divider */
function Divider() {
  return <div aria-hidden="true" className="h-px w-full shrink-0 bg-[#d5d5d5]" />;
}

function Chart2() {
  // 100% replaceable - single continuous green arch
  return (
    <figure
      className="relative m-0 h-[75px] w-[150px] shrink-0"
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

interface DppMaintenanceViewProps {
  scrollRef?: RefObject<HTMLDivElement | null>;
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
      <div className="w-full shrink-0" data-name="hero image">
        <img
          alt={`${data.categorization.displayName} — detail view`}
          className="pointer-events-none block w-full"
          src={data.commerce.photographs.detail}
        />
      </div>

      {/* Title Section */}
      <div className="relative w-full shrink-0">
        <div className="flex size-full flex-row items-end overflow-clip rounded-[inherit]">
          <div className="relative box-border flex w-full content-stretch items-end pt-[10px] pr-[20px] pb-[40px] pl-0">
            <div className="relative min-h-px min-w-px shrink-0 grow basis-0" data-name="Title">
              <div className="flex size-full flex-row items-center overflow-clip rounded-[inherit]">
                <div className="relative box-border flex w-full content-stretch items-center px-[16px] py-[10px]">
                  <div className="relative shrink-0 whitespace-pre text-nowrap font-['SF_Pro:Regular',sans-serif] font-normal font-width-normal text-[16px] text-[rgba(0,4,24,0.58)] leading-[24px]">
                    <h1 className="mb-0 font-['SF_Pro:Bold',sans-serif] font-bold font-width-normal text-[rgba(0,7,19,0.62)]">
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
              <div className="mb-[6px] flex items-baseline gap-[8px]">
                <span className="font-['SF_Pro:Bold',sans-serif] font-bold font-width-normal text-[28px] text-[rgba(0,7,19,0.72)] leading-[32px]">
                  {`${data.lifecycleAndMaintenance.expectedLifetimeValue.value}+`}
                </span>
                <span className="font-['SF_Pro:Regular',sans-serif] font-width-normal text-[16px] text-[rgba(0,7,19,0.50)] leading-[20px]">
                  {`${data.lifecycleAndMaintenance.expectedLifetimeValue.unit} expected lifetime`}
                </span>
              </div>
              <p className="mb-0 font-['SF_Pro:Regular',sans-serif] font-normal font-width-normal text-[16px] text-[rgba(0,7,19,0.62)] leading-[24px]">
                With regular care. The oiled oak develops a patina over time, and surface marks can be repaired with
                light sanding and a new coat of oil.
              </p>
            </div>
          )}
          {data.lifecycleAndMaintenance.warrantyDuration && (
            <div>
              <div className="mb-[6px] flex items-baseline gap-[8px]">
                <span className="font-['SF_Pro:Bold',sans-serif] font-bold font-width-normal text-[28px] text-[rgba(0,7,19,0.72)] leading-[32px]">
                  {data.lifecycleAndMaintenance.warrantyDuration.value}
                </span>
                <span className="font-['SF_Pro:Regular',sans-serif] font-width-normal text-[16px] text-[rgba(0,7,19,0.50)] leading-[20px]">
                  {`${data.lifecycleAndMaintenance.warrantyDuration.unit} warranty`}
                </span>
              </div>
              <p className="mb-0 font-['SF_Pro:Regular',sans-serif] font-normal font-width-normal text-[16px] text-[rgba(0,7,19,0.62)] leading-[24px]">
                Spare parts are available through support, and the leather seat can be bought on its own.
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
        <div className="relative w-full shrink-0 pb-[20px] font-['SF_Pro:Regular',sans-serif] font-normal font-width-normal text-[16px] text-[rgba(0,7,19,0.62)] leading-[24px]">
          {data.lifecycleAndMaintenance.maintenanceInstructions.map((instruction, index) => (
            <p
              key={instruction}
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
        <div className="relative w-full shrink-0 pb-[20px] font-['SF_Pro:Regular',sans-serif] font-normal font-width-normal text-[16px] text-[rgba(0,7,19,0.62)] leading-[24px]">
          {data.lifecycleAndMaintenance.refurbishAndRepair.map((text, index) => (
            <p
              key={text}
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
          className="relative box-border flex w-full shrink-0 flex-col content-stretch items-center gap-[8px] overflow-clip px-0 py-[8px]"
          data-name="Graph"
        >
          <div className="relative w-full shrink-0" data-name="Chart-Parts">
            <div className="flex size-full flex-col items-center">
              <div className="relative box-border flex w-full flex-col content-stretch items-center gap-[24px] p-[12px]">
                <Chart2 />
                <div
                  className="relative flex w-full shrink-0 flex-wrap content-center items-center justify-between gap-[13px]"
                  data-name="Part types"
                >
                  <div className="relative flex shrink-0 content-stretch items-center gap-[8px]" data-name="Wood">
                    <div className="size-[16px] shrink-0 rounded-[3px] bg-[#b5f7d5]" />
                    <p className="relative shrink-0 whitespace-pre text-nowrap font-['SF_Pro:Light',sans-serif] font-[274.315] font-width-normal text-[12px] text-[rgba(0,7,19,0.62)] leading-[16px] tracking-[0.04px]">
                      Replaceable
                    </p>
                  </div>
                  <div className="relative flex shrink-0 content-stretch items-center gap-[8px]" data-name="Assemblies">
                    <div className="size-[16px] shrink-0 rounded-[3px] bg-[#fcbfbf]" />
                    <p className="relative shrink-0 whitespace-pre text-nowrap font-['SF_Pro:Light',sans-serif] font-[274.315] font-width-normal text-[12px] text-[rgba(0,7,19,0.62)] leading-[16px] tracking-[0.04px]">
                      Non-Replaceable
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="relative h-[287px] w-full shrink-0 overflow-hidden rounded-[8px] border border-[rgba(0,0,0,0.1)]">
          <div className="h-full max-h-[287px] overflow-y-auto">
            <table className="w-full border-collapse bg-white" data-name="Table">
              <thead className="sticky top-0 z-10 bg-[#f0f0f0]">
                <tr className="border-[rgba(1,1,46,0.13)] border-b">
                  <th
                    scope="col"
                    className="min-h-[44px] text-nowrap p-[12px] text-left font-['SF_Pro:Medium',sans-serif] font-[510] font-width-normal text-[#1c2024] text-[14px] leading-[20px]"
                  >
                    Component
                  </th>
                  <th
                    scope="col"
                    className="min-h-[44px] whitespace-pre text-nowrap p-[12px] text-left font-['SF_Pro:Medium',sans-serif] font-[510] font-width-normal text-[#1c2024] text-[14px] leading-[20px]"
                  >
                    Replaceable
                  </th>
                </tr>
              </thead>
              <tbody>
                {componentData.map((component, index) => (
                  <tr
                    key={component.name}
                    className={
                      index > 0 && index < componentData.length - 1 ? "border-[rgba(1,1,46,0.13)] border-t" : ""
                    }
                  >
                    <td className="min-h-[44px] px-[16px] py-[10px]">
                      <p className="max-w-full overflow-hidden overflow-ellipsis text-nowrap font-['SF_Pro:Regular',sans-serif] font-normal font-width-normal text-[#3451b2] text-[14px] leading-[20px] [white-space-collapse:collapse]">
                        {component.name}
                      </p>
                      {(component.material || component.weight) && (
                        <p className="mt-[2px] max-w-full overflow-hidden overflow-ellipsis text-nowrap font-['SF_Pro:Light',sans-serif] font-[274.315] font-width-normal text-[12px] text-[rgba(0,7,19,0.58)] leading-[16px]">
                          {[
                            component.material,
                            component.weight ? `${component.weight.value} ${component.weight.unit}` : null
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}
                    </td>
                    <td className="min-h-[44px] w-[107px] p-[12px]">
                      {component.replaceable ? (
                        <span className="inline-flex items-center justify-center text-nowrap rounded-[4px] bg-[rgba(2,186,60,0.09)] px-[16px] py-[6px] font-['SF_Pro:Medium',sans-serif] font-[510] font-width-normal text-[14px] text-[rgba(0,107,59,0.91)] leading-[20px]">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center text-nowrap rounded-[4px] bg-[rgba(255,1,1,0.06)] px-[16px] py-[6px] font-['SF_Pro:Medium',sans-serif] font-[510] font-width-normal text-[14px] text-[rgba(187,0,7,0.84)] leading-[20px]">
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
            className="pointer-events-none absolute inset-0 rounded-[6px] border border-[rgba(1,1,46,0.13)] border-solid"
          />
        </div>

        <div
          className="relative box-border flex w-full shrink-0 content-stretch items-center justify-center gap-[8px] overflow-clip px-0 pt-[8px] pb-0"
          data-name="Sub Info"
        >
          <p className="relative min-h-px min-w-px shrink-0 grow basis-0 text-right font-['SF_Pro:Light',sans-serif] font-[274.315] font-width-normal text-[16px] text-[rgba(0,7,19,0.62)] leading-[14px]">
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
        <div className="relative w-full shrink-0 pb-[20px] font-['SF_Pro:Regular',sans-serif] font-normal font-width-normal text-[16px] text-[rgba(0,7,19,0.62)] leading-[24px]">
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
        <div className="relative w-full shrink-0 pb-[20px] font-['SF_Pro:Regular',sans-serif] font-normal font-width-normal text-[16px] text-[rgba(0,7,19,0.62)] leading-[24px]">
          <p className="mb-0">{data.lifecycleAndMaintenance.endOfLife}</p>
        </div>
      </DppCollapsibleSection>

      {/* Image 3 */}
      <div className="w-full shrink-0" data-name="image 3">
        <img
          alt={`${data.materialsAndComponents.primaryMaterial} — material source`}
          className="pointer-events-none block w-full"
          src={data.commerce.photographs.materialSource}
        />
      </div>
    </div>
  );
}
