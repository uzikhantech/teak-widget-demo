import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cartStore";
import { CouponInput } from "./CouponInput";
import TeakWidget from "../teak/TeakWidget"

interface CartSummaryProps {
    showCheckoutButton?: boolean;
    showCouponInput?: boolean;
}

export function CartSummary({ showCheckoutButton = true, showCouponInput = true }: CartSummaryProps) {
    const { items, getTotal, appliedCoupon, getDiscount, refundProtectionPrice, isProtectionSelected, teakReady } = useCartStore();
    const subtotal = getTotal();
    const discount = getDiscount();
    const discountedSubtotal = subtotal - discount;

    // Fees and tax calculated on discounted subtotal
    const serviceFee = discountedSubtotal * 0.1; // 10% service fee
    const tax = discountedSubtotal * 0.08; // 8% tax
    const protectionPrice =  isProtectionSelected ? refundProtectionPrice : 0; //TEAK Protection price when OPT IN
    const total = discountedSubtotal + serviceFee + tax + protectionPrice;

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900">Order Summary</h2>

            <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="font-medium text-neutral-900">
                        ${subtotal.toFixed(2)}
                    </span>
                </div>

                {appliedCoupon && discount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-emerald-600">
                            Discount ({appliedCoupon.code})
                        </span>
                        <span className="font-medium text-emerald-600">
                            -${discount.toFixed(2)}
                        </span>
                    </div>
                )}

                <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">
                        Service Fee
                    </span>
                    <span className="font-medium text-neutral-900">
                        ${serviceFee.toFixed(2)}
                    </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">
                        Tax
                    </span>
                    <span className="font-medium text-neutral-900">
                        ${tax.toFixed(2)}
                    </span>
                </div>
            </div>


            {/* Teak Refund Protection */}
            <Separator className="my-4" />
            <div className="space-y-2">
                <TeakWidget totalAmount={Number(discountedSubtotal.toFixed(2))} />
            </div>
            {/* <Separator className="my-4" /> */}

            {/*Add in line protection price to cart summary component or show a warning*/}
          {teakReady && (
                <>
                    <Separator className="my-4" />

                    {isProtectionSelected && refundProtectionPrice > 0 ? (
                    <div className="mt-3 rounded-md bg-emerald-50 px-3 py-2">
                        <div className="flex items-center justify-between text-sm">
                        <div>
                            <p className="font-medium text-emerald-800">
                            Refund Protection
                            </p>
                            <p className="text-xs text-emerald-700">
                            Your tickets are covered if you can’t attend.
                            </p>
                        </div>
                        <span className="font-semibold text-emerald-900">
                            ${refundProtectionPrice.toFixed(2)}
                        </span>
                        </div>
                    </div>
                    ) : (
                    <div className="mt-3 rounded-md bg-amber-50 px-3 py-2">
                        <div className="flex items-start gap-2 text-sm">
                        <span className="text-amber-600">⚠️</span>
                        <div>
                            <p className="font-medium text-amber-800">
                            Tickets are not protected
                            </p>
                            <p className="text-xs text-amber-700">
                            You will not be eligible for a refund if you cannot attend.
                            </p>
                        </div>
                        </div>
                    </div>
                    )}

                    <Separator className="my-4" />
                </>
            )}

            <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-neutral-900">Total</span>
                <span className="text-xl font-bold text-neutral-900">
                    ${total.toFixed(2)}
                </span>
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
