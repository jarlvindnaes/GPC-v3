import { AnimatePresence, motion, useMotionValue, useTransform } from "motion/react";
import type React from "react";
import { useEffect, useState } from "react";
import { brandConfig } from "./dppBrandConfig";
import { aivenTable } from "./dppProductData";
import type { PurchasablePart } from "./dppTypes";

const data = aivenTable;

const parts: Record<string, PurchasablePart> = {};
for (const part of data.materialsAndComponents.purchasableParts) {
  parts[part.id] = part;
}

function AddToBasketIcon() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Objects / add-to-basket">
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

interface DppProductViewProps {
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}

export function DppProductView({ scrollRef }: DppProductViewProps) {
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Motion values for drag-to-dismiss
  const dragYMotion = useMotionValue(0);
  const backdropOpacity = useTransform(dragYMotion, [0, 200], [1, 0]);
  const sheetScale = useTransform(dragYMotion, [0, 200], [1, 0.95]);

  useEffect(() => {
    if (scrollRef?.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [scrollRef]);

  // Reset drag value when part changes
  useEffect(() => {
    dragYMotion.set(0);
  }, [selectedPartId, dragYMotion]);

  const handlePartClick = (partId: string) => {
    setSelectedPartId(partId);
    setQuantity(1);
  };

  const handleClose = () => {
    setSelectedPartId(null);
  };

  // Close on Escape
  useEffect(() => {
    if (!selectedPartId) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPartId]);

  const part = selectedPartId ? parts[selectedPartId] : null;
  const purchasableParts = data.materialsAndComponents.purchasableParts;

  return (
    <div className="relative bg-white w-full min-h-full">
      {/* Hero Product Image */}
      <div className="aspect-[600/400] relative w-full">
        <img
          alt={`${data.categorization.displayName} by ${data.identity.brandName}`}
          className="absolute inset-0 max-w-none object-center object-cover pointer-events-none size-full"
          src={data.commerce.photographs.hero}
        />
      </div>

      {/* Spare Parts Header */}
      <div className="px-[16px] pt-[24px] pb-[16px]">
        <h2 className="font-['SF_Pro:Medium',sans-serif] font-[510] text-[16px] text-[rgba(0,7,19,0.62)] leading-[24px] mb-[4px] font-width-normal">
          Spare Parts
        </h2>
        <p className="font-['SF_Pro:Regular',sans-serif] font-normal text-[14px] text-[rgba(0,4,24,0.58)] leading-[20px] font-width-normal">
          Select a component for spare parts
        </p>
      </div>

      {/* Parts Grid */}
      <div className="px-[16px] pb-[100px]">
        <div className="grid grid-cols-2 gap-[12px]">
          {purchasableParts.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePartClick(p.id)}
              className="bg-white rounded-[12px] overflow-hidden text-left cursor-pointer border border-[rgba(0,0,0,0.08)] hover:border-[rgba(0,0,0,0.16)] transition-colors"
            >
              {/* Part Image */}
              <div className="aspect-square relative w-full bg-[rgba(0,0,0,0.02)]">
                <img src={p.image} alt={p.name} className="absolute inset-0 object-cover size-full" />
              </div>

              {/* Part Info */}
              <div className="p-[10px]">
                <p className="font-['SF_Pro:Medium',sans-serif] font-[510] text-[13px] text-[rgba(0,7,19,0.72)] leading-[18px] mb-[2px] overflow-hidden text-ellipsis text-nowrap font-width-normal">
                  {p.name}
                </p>
                <p className="font-['SF_Pro:Light',sans-serif] font-[274.315] text-[11px] text-[rgba(0,7,19,0.58)] leading-[16px] mb-[4px] font-width-normal">
                  {p.weight} · {p.material}
                </p>
                <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] text-[14px] text-[rgba(0,7,19,0.72)] leading-[20px] font-width-normal">
                  {p.price}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Sheet Overlay */}
      <AnimatePresence>
        {selectedPartId && part && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="absolute inset-0 bg-black/30 z-20"
              style={{ opacity: backdropOpacity }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={handleClose}
            />

            {/* Sheet */}
            <motion.div
              key="bottom-sheet"
              role="dialog"
              aria-label="Part details"
              className="absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-[16px] shadow-[0_-4px_24px_rgba(0,0,0,0.12)]"
              style={{ scale: sheetScale }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
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

              {/* Close Button */}
              <button
                type="button"
                aria-label="Close part details"
                onClick={handleClose}
                className="absolute right-[16px] top-[12px] flex items-center justify-center size-[28px] rounded-full bg-[rgba(0,8,47,0.08)] hover:bg-[rgba(0,8,47,0.16)] transition-colors cursor-pointer z-10"
              >
                <span aria-hidden="true" className="text-[rgba(0,8,47,0.5)] text-[16px] leading-none font-bold">
                  &times;
                </span>
              </button>

              {/* Content */}
              <div className="px-[20px] pt-[8px] pb-[28px]">
                {/* Part Image + Info Row */}
                <div className="flex gap-[16px] items-start mb-[20px]">
                  {/* Part Image */}
                  <div className="rounded-[10px] size-[80px] shrink-0 overflow-hidden relative">
                    <img
                      src={part.image}
                      alt={part.name}
                      className="absolute inset-0 object-cover rounded-[10px] size-full"
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
                    <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] text-[18px] text-[rgba(0,7,19,0.72)] leading-[24px] font-width-normal">
                      {part.price}
                    </p>
                  </div>
                </div>

                {/* Quantity + Add to Cart Row */}
                <div className="flex gap-[12px] items-center">
                  {/* Quantity Selector */}
                  <div className="flex items-center bg-[rgba(0,0,0,0.04)] rounded-[8px] h-[44px] shrink-0">
                    <button
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
                      onClick={() => setQuantity(quantity + 1)}
                      className="flex items-center justify-center size-[44px] text-[20px] text-[rgba(0,7,19,0.58)] font-medium cursor-pointer select-none rounded-r-[8px] hover:bg-[rgba(0,0,0,0.04)] transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => {
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
                      <AddToBasketIcon />
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
