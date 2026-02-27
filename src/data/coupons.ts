export interface Coupon {
  code: string;
  type: "percentage" | "fixed";
  value: number; // percentage (0-100) or dollar amount
  description: string;
}

export const VALID_COUPONS: Coupon[] = [
  { code: "SAVE10", type: "percentage", value: 10, description: "10% off" },
  { code: "FLAT20", type: "fixed", value: 20, description: "$20 off" },
  { code: "WELCOME", type: "percentage", value: 15, description: "15% off" },
  { code: "FREE", type: "percentage", value: 100, description: "100% off" },
];

export function findCoupon(code: string): Coupon | undefined {
  return VALID_COUPONS.find(
    (coupon) => coupon.code.toUpperCase() === code.toUpperCase()
  );
}

export function calculateDiscount(coupon: Coupon, subtotal: number): number {
  if (coupon.type === "percentage") {
    return subtotal * (coupon.value / 100);
  }
  // Fixed discount - ensure we don't go negative
  return Math.min(coupon.value, subtotal);
}
