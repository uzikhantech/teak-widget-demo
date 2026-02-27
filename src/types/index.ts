export interface TicketType {
  id: string;
  name: string;
  price: number;
  available: number;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  image: string;
  category: "Concerts" | "Sports" | "Theater";
  ticketTypes: TicketType[];
}

export interface CartItem {
  event: Event;
  ticketType: TicketType;
  quantity: number;
}

// Order-related types
export interface OrderItem {
  eventId: string;
  eventName: string;
  ticketTypeId: string;
  ticketTypeName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  items: OrderItem[];
  totals: {
    subtotal: number;
    discount?: number;
    serviceFee: number;
    tax: number;
    total: number;
  };
  coupon?: {
    code: string;
    type: string;
    value: number;
  };
  paymentTransactionId: string;
  status: "confirmed" | "refunded";
  createdAt: string;
}
