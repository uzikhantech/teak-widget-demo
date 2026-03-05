// ============================================
// Pricing Utilities
// ============================================

const SERVICE_FEE_RATE = 0.1; // 10%
const TAX_RATE = 0.08; // 8%

/**
 * Calculates the final item cost including
 * taxes and service fees with discounts (if any)
 *
 * Teak requires taxes and fees to be included
 * inside the line item cost for each item.
 */

export const calculateItemCostWithFeesandDiscounts = (
  price: number,
  subtotal: number,
  totalDiscount: number
): string => {
  // Determine what percentage of the subtotal this item represents.
  // Example: if item price is 50 and subtotal is 100, the share is 0.5 (50% of the cart)
  const share = subtotal > 0 ? price / subtotal : 0;
  console.log(price);
  // Calculate how much of the total discount should be applied to this item
  // based on its proportional share of the subtotal.
  const itemDiscount = totalDiscount * share;
  console.log(itemDiscount);

  // Apply the item's portion of the discount to get the discounted ticket price
  const discountedPrice = price - itemDiscount;
  console.log(discountedPrice);

  // Calculate tax based on the discounted ticket price
  const tax = discountedPrice * TAX_RATE;
  console.log(tax);

  // Calculate service/processing fee based on the discounted ticket price
  const serviceFee = discountedPrice * SERVICE_FEE_RATE;
  console.log(serviceFee);

  // Calculate the final item cost including discounted price, tax, and service fee
  const finalCost = discountedPrice + tax + serviceFee;
  console.log(finalCost);

  // Return the final cost formatted to two decimal places for currency consistency
  return finalCost.toFixed(2);
};
