import { calculateItemCostWithFeesandDiscounts } from "./pricing";
import { formatDate, formatTimeTo24Hour } from "./utils";

// ============================================
// Teak Payload Types
// ============================================

export interface TeakEvent {
  name: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  location: string;
}

export interface TeakItem {
  name: string;
  reference_number: string;
  cost: string;
  event: TeakEvent;
}

export interface TeakPayload {
  quote: string; // Quote token from widget
  order_number: string | null; //merchants order id
  currency: string;
  event?: TeakEvent;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  billing_address: {
    address1: string;
    address2: string;
    city: string;
    zip_code: string;
    state: string;
    country: string;
  };
  items: TeakItem[];
  payment: {
    type: string;
  };
}

// ============================================
// Cart + Form Types
// ============================================

export interface CartItem {
  event: {
    id: string;
    name: string;
    date: string;
    time: string;
    venue: string;
  };
  ticketType: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

// ============================================
// Payload Builder
// ============================================

export const buildTeakPayload = (
  orderId: string,
  quoteToken: string | null, // widget quote token
  items: CartItem[],
  formData: CheckoutFormData,
  subtotal: number,
  discount: number
): TeakPayload => {
  if (!quoteToken) {
    throw new Error("Missing Teak quote token");
  }

  if (!items.length) {
    throw new Error("Cannot build Teak payload: cart is empty");
  }

  const firstItem = items[0];

  const payload: TeakPayload = {
    quote: quoteToken,
    order_number: orderId,
    currency: "USD",

    // Root event (safe for single-event carts)
    event: {
      name: firstItem.event.name,
      start_date: formatDate(firstItem.event.date, firstItem.event.time),
      start_time: formatTimeTo24Hour(firstItem.event.date, firstItem.event.time),
      end_date: formatDate(firstItem.event.date, firstItem.event.time),
      end_time: formatTimeTo24Hour(firstItem.event.date, firstItem.event.time),
      location: firstItem.event.venue,
    },

    customer: {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone || "5555555555",
    },

    billing_address: {
      address1: "123 Main St",
      address2: "Ste 1",
      city: "Phoenix",
      zip_code: "85020",
      state: "AZ",
      country: "US",
    },

    // Expand items per quantity
    items: items.flatMap((item, index) => {
      const expandedItems: TeakItem[] = [];

      for (let i = 0; i < item.quantity; i++) {
        expandedItems.push({
          name: `${item.event.name} - ${item.ticketType.name}`,
          reference_number: `${orderId}-item-${index + 1}-${i + 1}`,
          cost: calculateItemCostWithFeesandDiscounts(item.ticketType.price, subtotal, discount),
          event: {
            name: item.event.name,
            start_date: formatDate(item.event.date, item.event.time),
            start_time: formatTimeTo24Hour(item.event.date, item.event.time),
            end_date: formatDate(item.event.date, item.event.time),
            end_time: formatTimeTo24Hour(item.event.date, item.event.time),
            location: item.event.venue,
          },
        });
      }

      return expandedItems;
    }),

    payment: {
      type: "invoice",
    },
  };
  console.log(JSON.stringify(payload, null, 2));
  return payload;
};
