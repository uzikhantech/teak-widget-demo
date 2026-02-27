import { useState } from "react";
import { Tag, X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cartStore";

export function CouponInput() {
  const { appliedCoupon, applyCoupon, removeCoupon, getDiscount } = useCartStore();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const discount = getDiscount();

  const handleApply = async () => {
    if (!code.trim()) {
      setError("Please enter a coupon code");
      return;
    }

    setIsApplying(true);
    setError(null);

    // Simulate a brief delay for UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    const result = applyCoupon(code.trim());

    if (!result.success) {
      setError(result.error || "Invalid coupon code");
    } else {
      setCode("");
    }

    setIsApplying(false);
  };

  const handleRemove = () => {
    removeCoupon();
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleApply();
    }
  };

  // Show applied coupon state
  if (appliedCoupon) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-emerald-800">
                  {appliedCoupon.code}
                </span>
                <span className="text-sm text-emerald-600">
                  {appliedCoupon.description}
                </span>
              </div>
              <p className="text-sm text-emerald-600">
                You save ${discount.toFixed(2)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="h-8 w-8 p-0 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove coupon</span>
          </Button>
        </div>
      </div>
    );
  }

  // Show input state
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            type="text"
            placeholder="Enter coupon code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError(null);
            }}
            onKeyDown={handleKeyDown}
            className="pl-9"
            disabled={isApplying}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleApply}
          disabled={isApplying || !code.trim()}
        >
          {isApplying ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Apply"
          )}
        </Button>
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
