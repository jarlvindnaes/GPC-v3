import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { DppPartThumb } from "./DppPartThumb";
import { brandConfig } from "./dppBrandConfig";
import type { CartItem, PurchasablePart } from "./dppTypes";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface DppCheckoutOverlayProps {
  cartItems: CartItem[];
  parts: Record<string, PurchasablePart>;
  onClose: () => void;
  onOrderPlaced: () => void;
  onRemoveItem: (partId: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Shared constants & helpers                                         */
/* ------------------------------------------------------------------ */

const SHIPPING_OPTIONS = [
  { id: "standard", label: "Standard", time: "3–5 business days", price: 0 },
  { id: "express", label: "Express", time: "1–2 business days", price: 12 }
] as const;

const PAYMENT_OPTIONS = [
  { id: "apple-pay", label: "", icon: "" },
  { id: "card", label: "Card ending ···4242", icon: "💳" }
] as const;

function formatEur(cents: number) {
  return `${cents} €`;
}

/* ------------------------------------------------------------------ */
/*  Step indicator                                                     */
/* ------------------------------------------------------------------ */

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-0 py-[12px]">
      {[1, 2, 3].map((s, i) => (
        <div key={s} className="flex items-center">
          {i > 0 && (
            <div
              className="h-[2px] w-[28px] rounded-full"
              style={{
                backgroundColor: step > i ? brandConfig.colors.primary : "rgba(50,47,49,0.12)"
              }}
            />
          )}
          <div
            className="size-[8px] rounded-full transition-colors duration-200"
            style={{
              backgroundColor: step >= s ? brandConfig.colors.primary : "rgba(50,47,49,0.12)"
            }}
          />
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 1 — Basket preview                                           */
/* ------------------------------------------------------------------ */

function AddToBasketIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg className="block shrink-0" width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
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

function StepBasket({
  cartItems,
  parts,
  total,
  onContinue,
  onRemoveItem
}: {
  cartItems: CartItem[];
  parts: Record<string, PurchasablePart>;
  total: number;
  onContinue: () => void;
  onRemoveItem: (partId: string) => void;
}) {
  const isEmpty = cartItems.length === 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-[16px] pb-[8px]">
        <h2
          className="mb-[16px] font-['SF_Pro:Bold',sans-serif] font-bold text-[18px] leading-[24px]"
          style={{ color: brandConfig.colors.textPrimary }}
        >
          Your Basket
        </h2>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center gap-[12px] pt-[60px]">
            <AddToBasketIcon size={48} color="rgba(50,47,49,0.2)" />
            <div className="text-center">
              <p
                className="font-['SF_Pro:Medium',sans-serif] font-[510] text-[15px] leading-[20px]"
                style={{ color: "rgba(50,47,49,0.38)" }}
              >
                Your cart is empty
              </p>
              <p
                className="mx-auto mt-[4px] max-w-[200px] text-[13px] leading-[18px]"
                style={{ color: "rgba(50,47,49,0.38)" }}
              >
                Select parts in the product model on the 'parts' page to order
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-[12px]">
              {cartItems.map((item) => {
                const part = parts[item.partId];
                if (!part) {
                  return null;
                }
                const lineTotal = (part.priceValue?.value ?? 0) * item.quantity;
                return (
                  <div key={item.partId} className="flex items-center gap-[12px]">
                    <div className="size-[60px] shrink-0 rounded-[8px] border border-[rgba(50,47,49,0.12)] p-[3px]">
                      {part.image ? (
                        <img src={part.image} alt={part.name} className="size-full rounded-[6px] object-contain" />
                      ) : (
                        <DppPartThumb partId={part.id} label={`3D view of the ${part.name}`} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate font-['SF_Pro:Bold',sans-serif] font-bold text-[15px] leading-[20px]"
                        style={{ color: "rgba(50,47,49,0.72)" }}
                      >
                        {part.name}
                      </p>
                      <p className="text-[13px] leading-[18px]" style={{ color: "rgba(50,47,49,0.58)" }}>
                        {part.material}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p
                        className="font-['SF_Pro:Bold',sans-serif] font-bold text-[15px] leading-[20px]"
                        style={{ color: "rgba(50,47,49,0.72)" }}
                      >
                        {formatEur(lineTotal)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[12px] leading-[16px]" style={{ color: "rgba(50,47,49,0.58)" }}>
                          {item.quantity} × {part.price}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.partId)}
                      className="flex size-[28px] shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[rgba(0,0,0,0.05)]"
                      aria-label={`Remove ${parts[item.partId]?.name ?? "item"} from cart`}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path
                          d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5"
                          stroke="rgba(50,47,49,0.4)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-[16px] border-[rgba(50,47,49,0.1)] border-t pt-[12px]">
              <div className="flex items-center justify-between">
                <span
                  className="font-['SF_Pro:Bold',sans-serif] font-bold text-[17px] leading-[22px]"
                  style={{ color: brandConfig.colors.textPrimary }}
                >
                  Total
                </span>
                <span
                  className="font-['SF_Pro:Bold',sans-serif] font-bold text-[17px] leading-[22px]"
                  style={{ color: brandConfig.colors.textPrimary }}
                >
                  {formatEur(total)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {!isEmpty && (
        <div className="px-[16px] pt-[8px] pb-[16px]">
          <button
            type="button"
            onClick={onContinue}
            className="h-[44px] w-full cursor-pointer rounded-[8px] transition-opacity hover:opacity-90"
            style={{ backgroundColor: brandConfig.colors.primary }}
          >
            <span className="font-['SF_Pro:Medium',sans-serif] font-[510] text-[16px] text-white leading-[24px]">
              Continue
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 2 — Address & Shipping                                       */
/* ------------------------------------------------------------------ */

function StepAddress({
  shipping,
  onShippingChange,
  onContinue
}: {
  shipping: string;
  onShippingChange: (id: string) => void;
  onContinue: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-[16px] pb-[8px]">
        <h2
          className="mb-[14px] font-['SF_Pro:Bold',sans-serif] font-bold text-[18px] leading-[24px]"
          style={{ color: brandConfig.colors.textPrimary }}
        >
          Shipping Address
        </h2>

        <div className="flex flex-col gap-[10px]">
          <FormField label="Full Name" value="Anna Lindqvist" />
          <FormField label="Street Address" value="Vestergade 12" />
          <div className="flex gap-[10px]">
            <FormField label="City" value="Copenhagen" className="flex-1" />
            <FormField label="Postal Code" value="1456" className="w-[100px]" />
          </div>
          <FormField label="Country" value="Denmark" />
        </div>

        <h3
          className="mt-[18px] mb-[10px] font-['SF_Pro:Bold',sans-serif] font-bold text-[16px] leading-[22px]"
          style={{ color: brandConfig.colors.textPrimary }}
        >
          Shipping Method
        </h3>

        <div className="flex flex-col gap-[8px]">
          {SHIPPING_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onShippingChange(opt.id)}
              className="flex cursor-pointer items-center justify-between rounded-[10px] border p-[12px] text-left transition-colors"
              style={{
                borderColor: shipping === opt.id ? brandConfig.colors.primary : "rgba(50,47,49,0.12)",
                backgroundColor: shipping === opt.id ? `rgba(${brandConfig.colors.primaryRgb},0.06)` : "transparent"
              }}
            >
              <div>
                <p
                  className="font-['SF_Pro:Medium',sans-serif] font-[510] text-[15px] leading-[20px]"
                  style={{ color: "rgba(50,47,49,0.72)" }}
                >
                  {opt.label}
                </p>
                <p className="text-[13px] leading-[18px]" style={{ color: "rgba(50,47,49,0.58)" }}>
                  {opt.time}
                </p>
              </div>
              <span
                className="font-['SF_Pro:Bold',sans-serif] font-bold text-[15px]"
                style={{ color: "rgba(50,47,49,0.72)" }}
              >
                {opt.price === 0 ? "Free" : formatEur(opt.price)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-[16px] pt-[8px] pb-[16px]">
        <button
          type="button"
          onClick={onContinue}
          className="h-[44px] w-full cursor-pointer rounded-[8px] transition-opacity hover:opacity-90"
          style={{ backgroundColor: brandConfig.colors.primary }}
        >
          <span className="font-['SF_Pro:Medium',sans-serif] font-[510] text-[16px] text-white leading-[24px]">
            Continue
          </span>
        </button>
      </div>
    </div>
  );
}

function FormField({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <span
        className="mb-[4px] block font-['SF_Pro:Medium',sans-serif] font-[510] text-[12px] leading-[16px]"
        style={{ color: "rgba(50,47,49,0.58)" }}
      >
        {label}
      </span>
      <div
        className="flex h-[40px] items-center rounded-[8px] border border-[rgba(50,47,49,0.12)] px-[12px]"
        style={{ backgroundColor: "rgba(0,0,0,0.02)" }}
      >
        <span
          className="font-['SF_Pro:Regular',sans-serif] text-[15px] leading-[20px]"
          style={{ color: "rgba(50,47,49,0.72)" }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Apple Pay icon                                                     */
/* ------------------------------------------------------------------ */

function ApplePayIcon() {
  return (
    <svg width="42" height="18" viewBox="0 0 120.3 51.2" fill="currentColor" aria-hidden="true">
      <path d="M22.8 6.6c1.4-1.8 2.4-4.2 2.1-6.6-2.1.1-4.6 1.4-6.1 3.1-1.3 1.5-2.5 4-2.2 6.3 2.4.3 4.7-1 6.2-2.8M24.9 10c-3.4-.2-6.3 1.9-7.9 1.9-1.6 0-4.1-1.8-6.8-1.8-3.5.1-6.7 2-8.5 5.2-3.6 6.3-1 15.6 2.6 20.7 1.7 2.5 3.8 5.3 6.5 5.2 2.6-.1 3.6-1.7 6.7-1.7s4 1.7 6.8 1.6 4.6-2.5 6.3-5.1c2-2.9 2.8-5.7 2.8-5.8-.1-.1-5.5-2.1-5.5-8.3-.1-5.2 4.2-7.7 4.4-7.8-2.3-3.6-6.1-4-7.4-4.1" />
      <path d="M54.3 2.9c7.4 0 12.5 5.1 12.5 12.4 0 7.4-5.2 12.5-12.7 12.5H46v12.9h-5.9V2.9h14.2zm-8.3 20h6.7c5.1 0 8-2.8 8-7.5 0-4.8-2.9-7.5-8-7.5h-6.8v15h.1zM68.3 33c0-4.8 3.7-7.8 10.3-8.2l7.6-.4v-2.1c0-3.1-2.1-4.9-5.5-4.9-3.3 0-5.3 1.6-5.8 4h-5.4c.3-5 4.6-8.7 11.4-8.7 6.7 0 11 3.5 11 9.1v19h-5.4v-4.5h-.1c-1.6 3.1-5.1 5-8.7 5-5.6 0-9.4-3.4-9.4-8.3zm17.9-2.5v-2.2l-6.8.4c-3.4.2-5.3 1.7-5.3 4.1 0 2.4 2 4 5 4 4 0 7.1-2.7 7.1-6.3zM96.9 51v-4.6c.4.1 1.4.1 1.8.1 2.6 0 4-1.1 4.9-3.9 0-.1.5-1.7.5-1.7l-10-27.6h6.1l7 22.5h.1l7-22.5h6L110 42.4c-2.4 6.7-5.1 8.8-10.8 8.8-.4-.1-1.8-.1-2.3-.2z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 3 — Payment & Summary                                        */
/* ------------------------------------------------------------------ */

function StepPayment({
  cartItems,
  parts,
  subtotal,
  shippingCost,
  payment,
  onPaymentChange,
  onPlaceOrder,
  processing
}: {
  cartItems: CartItem[];
  parts: Record<string, PurchasablePart>;
  subtotal: number;
  shippingCost: number;
  payment: string;
  onPaymentChange: (id: string) => void;
  onPlaceOrder: () => void;
  processing: boolean;
}) {
  const total = subtotal + shippingCost;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-[16px] pb-[8px]">
        <h2
          className="mb-[14px] font-['SF_Pro:Bold',sans-serif] font-bold text-[18px] leading-[24px]"
          style={{ color: brandConfig.colors.textPrimary }}
        >
          Payment
        </h2>

        <div className="mb-[18px] flex flex-col gap-[8px]">
          {PAYMENT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onPaymentChange(opt.id)}
              className="flex cursor-pointer items-center gap-[10px] rounded-[10px] border p-[12px] text-left transition-colors"
              style={{
                borderColor: payment === opt.id ? brandConfig.colors.primary : "rgba(50,47,49,0.12)",
                backgroundColor: payment === opt.id ? `rgba(${brandConfig.colors.primaryRgb},0.06)` : "transparent"
              }}
            >
              {opt.id === "apple-pay" ? <ApplePayIcon /> : <span className="text-[18px]">{opt.icon}</span>}
              <span
                className="font-['SF_Pro:Medium',sans-serif] font-[510] text-[15px] leading-[20px]"
                style={{ color: "rgba(50,47,49,0.72)" }}
              >
                {opt.label}
              </span>
            </button>
          ))}
        </div>

        <h3
          className="mb-[10px] font-['SF_Pro:Bold',sans-serif] font-bold text-[16px] leading-[22px]"
          style={{ color: brandConfig.colors.textPrimary }}
        >
          Order Summary
        </h3>

        <div className="flex flex-col gap-[6px]">
          {cartItems.map((item) => {
            const part = parts[item.partId];
            if (!part) {
              return null;
            }
            const lineTotal = (part.priceValue?.value ?? 0) * item.quantity;
            return (
              <div
                key={item.partId}
                className="flex justify-between text-[14px] leading-[20px]"
                style={{ color: "rgba(50,47,49,0.72)" }}
              >
                <span>
                  {item.quantity}× {part.name}
                </span>
                <span>{formatEur(lineTotal)}</span>
              </div>
            );
          })}

          <div className="flex justify-between text-[14px] leading-[20px]" style={{ color: "rgba(50,47,49,0.58)" }}>
            <span>Shipping</span>
            <span>{shippingCost === 0 ? "Free" : formatEur(shippingCost)}</span>
          </div>

          <div className="mt-[6px] flex justify-between border-[rgba(50,47,49,0.1)] border-t pt-[8px]">
            <span
              className="font-['SF_Pro:Bold',sans-serif] font-bold text-[17px] leading-[22px]"
              style={{ color: brandConfig.colors.textPrimary }}
            >
              Total
            </span>
            <span
              className="font-['SF_Pro:Bold',sans-serif] font-bold text-[17px] leading-[22px]"
              style={{ color: brandConfig.colors.textPrimary }}
            >
              {formatEur(total)}
            </span>
          </div>
        </div>
      </div>

      <div className="px-[16px] pt-[8px] pb-[16px]">
        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={processing}
          className="h-[44px] w-full cursor-pointer rounded-[8px] transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-60"
          style={{ backgroundColor: brandConfig.colors.primary }}
        >
          <span className="font-['SF_Pro:Medium',sans-serif] font-[510] text-[16px] text-white leading-[24px]">
            {processing ? "Processing…" : "Place Order"}
          </span>
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Success screen                                                     */
/* ------------------------------------------------------------------ */

function SuccessScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <button
      type="button"
      onClick={onDone}
      className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-[16px]"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 200 }}
        className="flex size-[64px] items-center justify-center rounded-full"
        style={{ backgroundColor: `rgba(${brandConfig.colors.primaryRgb},0.12)` }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <motion.path
            d="M8 16.5L13.5 22L24 11"
            stroke={brandConfig.colors.primary}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
          />
        </svg>
      </motion.div>
      <div className="text-center">
        <p
          className="font-['SF_Pro:Bold',sans-serif] font-bold text-[20px] leading-[26px]"
          style={{ color: brandConfig.colors.textPrimary }}
        >
          Order Confirmed
        </p>
        <p className="mt-[4px] text-[14px] leading-[20px]" style={{ color: "rgba(50,47,49,0.58)" }}>
          Order #PC-28491
        </p>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Main checkout overlay                                              */
/* ------------------------------------------------------------------ */

export function DppCheckoutOverlay({
  cartItems,
  parts,
  onClose,
  onOrderPlaced,
  onRemoveItem
}: DppCheckoutOverlayProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [shipping, setShipping] = useState("standard");
  const [payment, setPayment] = useState("apple-pay");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => {
    const part = parts[item.partId];
    return sum + (part?.priceValue?.value ?? 0) * item.quantity;
  }, 0);

  const shippingCost = SHIPPING_OPTIONS.find((o) => o.id === shipping)?.price ?? 0;

  function goForward() {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  }

  function handlePlaceOrder() {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
    }, 800);
  }

  function handleDone() {
    onOrderPlaced();
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.4)", pointerEvents: "auto" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Card */}
      <motion.div
        className="absolute right-[16px] left-[16px] flex flex-col overflow-hidden rounded-[16px] bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.12)]"
        style={{
          top: 157,
          bottom: 100,
          pointerEvents: "auto"
        }}
        initial={{ y: 300, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 300, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
      >
        {/* Top bar — back + close */}
        <div className="relative flex h-[44px] shrink-0 items-center justify-center">
          {step > 1 && !success && (
            <button
              type="button"
              onClick={goBack}
              className="absolute top-[6px] left-[8px] flex size-[32px] cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[rgba(0,0,0,0.05)]"
              aria-label="Go back"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path
                  d="M11 4L6 9L11 14"
                  stroke="rgba(50,47,49,0.6)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="absolute top-[6px] right-[8px] flex size-[32px] cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[rgba(0,0,0,0.05)]"
            aria-label="Close checkout"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 4L12 12M12 4L4 12" stroke="rgba(50,47,49,0.6)" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Step indicator */}
        {!success && <StepIndicator step={step} />}

        {/* Step content */}
        <div className="min-h-0 flex-1">
          {success ? (
            <SuccessScreen onDone={handleDone} />
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                className="h-full"
                initial={{ x: direction * 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction * -60, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {step === 1 && (
                  <StepBasket
                    cartItems={cartItems}
                    parts={parts}
                    total={subtotal}
                    onContinue={goForward}
                    onRemoveItem={onRemoveItem}
                  />
                )}
                {step === 2 && (
                  <StepAddress shipping={shipping} onShippingChange={setShipping} onContinue={goForward} />
                )}
                {step === 3 && (
                  <StepPayment
                    cartItems={cartItems}
                    parts={parts}
                    subtotal={subtotal}
                    shippingCost={shippingCost}
                    payment={payment}
                    onPaymentChange={setPayment}
                    onPlaceOrder={handlePlaceOrder}
                    processing={processing}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </>
  );
}
