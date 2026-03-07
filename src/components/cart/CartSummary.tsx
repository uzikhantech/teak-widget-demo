import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cartStore";
import { CouponInput } from "./CouponInput";
import TeakWidget from "../teak/TeakWidget";
import { useState, useEffect } from "react";

interface CartSummaryProps {
  showCheckoutButton?: boolean;
  showCouponInput?: boolean;
}

export function CartSummary({
  showCheckoutButton = true,
  showCouponInput = true,
}: CartSummaryProps) {
  const {
    items,
    getTotal,
    appliedCoupon,
    getDiscount,
    refundProtectionPrice,
    isProtectionSelected,
  } = useCartStore();
  const subtotal = getTotal();
  const discount = getDiscount();
  const discountedSubtotal = subtotal - discount;

  // Fees and tax calculated on discounted subtotal
  const serviceFee = discountedSubtotal * 0.1; // 10% service fee
  const tax = discountedSubtotal * 0.08; // 8% tax
  const protectionPrice = isProtectionSelected ? refundProtectionPrice : 0; //TEAK Protection price when OPT IN
  const total = discountedSubtotal + serviceFee + tax + protectionPrice;

  const [highlightProtection, setHighlightProtection] = useState(false);

  useEffect(() => {
    if (isProtectionSelected) return;

    const timer = setTimeout(() => {
      setHighlightProtection(true);

      setTimeout(() => {
        setHighlightProtection(false);
      }, 2500);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isProtectionSelected]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-neutral-900">Order Summary</h2>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600">Subtotal</span>
          <span className="font-medium text-neutral-900">${subtotal.toFixed(2)}</span>
        </div>

        {appliedCoupon && discount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-emerald-600">Discount ({appliedCoupon.code})</span>
            <span className="font-medium text-emerald-600">-${discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600">Service Fee</span>
          <span className="font-medium text-neutral-900">${serviceFee.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600">Tax</span>
          <span className="font-medium text-neutral-900">${tax.toFixed(2)}</span>
        </div>
      </div>

      {/* Teak Refund Protection */}
      <Separator className="my-4" />
      {discountedSubtotal > 0 && (
        <>
          {/* Refund Protection Wrapper */}
          <div className="relative rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
            {/* Recommended badge intersecting border */}
            <div className="absolute -top-3 right-4 bg-emerald-600 text-white text-xs font-medium px-2 py-1 rounded shadow">
              Recommended
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold text-neutral-900 mb-2">Refund Protection</h3>

            {/* Explanation */}
            <p className="text-xs text-neutral-600 mb-4">
              Protect your tickets and receive a refund if you can't attend due to illness,
              emergencies, or travel disruptions. Coverage is available for only{" "}
              <span className="font-semibold text-emerald-700">${window.tg?.get("quote")}</span>.
            </p>

            {/* Teak Widget */}
            <div
              id="teak-widget"
              className={`rounded-md transition-all duration-700 ease-out ${
                highlightProtection
                  ? "ring-2 ring-emerald-400 ring-offset-2 bg-emerald-50 shadow-lg -translate-y-1"
                  : ""
              }`}
            >
              <TeakWidget totalAmount={Number(discountedSubtotal.toFixed(2))} />
            </div>
          </div>

          <Separator className="my-4" />

          {/* Cart line item when protection selected */}
          {window.tg?.isProtected() && (
            <div className="flex items-center justify-between text-sm">
              <span>Refund Protection</span>
              <span className="font-medium text-neutral-900">
                ${refundProtectionPrice.toFixed(2)}
              </span>
            </div>
          )}
        </>
      )}

      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-neutral-900">Total</span>
        <span className="text-xl font-bold text-neutral-900">${total.toFixed(2)}</span>
      </div>

      {showCouponInput && (
        <>
          <Separator className="my-4" />
          <CouponInput />
        </>
      )}

      {showCheckoutButton && (
        <Button asChild className="mt-6 w-full" size="lg">
          <Link to="/checkout">Proceed to Checkout</Link>
        </Button>
      )}
    </div>
  );
}
