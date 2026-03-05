import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Event, TicketType } from "@/types";
import type { Coupon } from "@/data/coupons";
import { findCoupon, calculateDiscount } from "@/data/coupons";

/* NEW — cart id generator */
const generateCartId = () => `CART-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

interface CartState {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  //refund price protection states
  refundProtectionPrice: number;
  isProtectionSelected: boolean;
  refundProtectionToken: string | null;
  teakReady: boolean;
  cartId: string;
  previousCartId: string | null;
  setPreviousCartId: (id: string) => void;
  regenerateCartId: () => void;
  setTeakReady: (ready: boolean) => void;
  setRefundProtectionToken: (token: string | null) => void;
  setRefundProtectionPrice: (price: number, selected: boolean) => void;
  addItem: (event: Event, ticketType: TicketType, quantity?: number) => void;
  removeItem: (eventId: string, ticketTypeId: string) => void;
  updateQuantity: (eventId: string, ticketTypeId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  applyCoupon: (code: string) => { success: boolean; error?: string };
  removeCoupon: () => void;
  getDiscount: () => number;
  getDiscountedTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,

      //for tracking new car when cart is emptied
      previousCartId: null,
      setPreviousCartId: (id) =>
        set({
          previousCartId: id,
        }),

      //create a cart ID when tickets are added to the cart
      cartId: generateCartId(),
      regenerateCartId: () =>
        set({
          cartId: generateCartId(),
        }),

      //initialize the refund protection
      refundProtectionPrice: 0, //price genereated by the widget
      isProtectionSelected: false, //OPT IN or OPT out?
      setRefundProtectionPrice: (price: number, selected: boolean) => {
        set({
          refundProtectionPrice: selected ? price : 0,
          isProtectionSelected: selected,
        });
      },

      //initial the refund protection token
      //this is the qoute token we send to the backed
      refundProtectionToken: null,
      setRefundProtectionToken: (token: string | null) => {
        set({
          refundProtectionToken: token,
        });
      },

      teakReady: false,
      setTeakReady: (ready) => set({ teakReady: ready }),

      addItem: (event, ticketType, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.event.id === event.id && item.ticketType.id === ticketType.id
          );

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex] = {
              ...newItems[existingItemIndex],
              quantity: newItems[existingItemIndex].quantity + quantity,
            };
            return { items: newItems };
          }

          return {
            items: [...state.items, { event, ticketType, quantity }],
          };
        });
      },

      removeItem: (eventId, ticketTypeId) => {
        set((state) => {
          const updatedItems = state.items.filter(
            (item) => !(item.event.id === eventId && item.ticketType.id === ticketTypeId)
          );

          //if we clear the last itme from the cart reinitialize and generate a new card ID
          if (updatedItems.length === 0) {
            return {
              items: [],
              appliedCoupon: null,
              isProtectionSelected: false,
              refundProtectionPrice: 0,
              refundProtectionToken: null,
              cartId: generateCartId(),
            };
          }

          return { items: updatedItems };
        });
      },

      updateQuantity: (eventId, ticketTypeId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(eventId, ticketTypeId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.event.id === eventId && item.ticketType.id === ticketTypeId
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({
          items: [],
          appliedCoupon: null,
          isProtectionSelected: false,
          refundProtectionPrice: 0,
          refundProtectionToken: null,
          cartId: generateCartId(),
        });
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.ticketType.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      applyCoupon: (code: string) => {
        const coupon = findCoupon(code);
        if (!coupon) {
          return { success: false, error: "Invalid coupon code" };
        }
        set({ appliedCoupon: coupon });
        return { success: true };
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });
      },

      getDiscount: () => {
        const { appliedCoupon, getTotal } = get();
        if (!appliedCoupon) return 0;
        return calculateDiscount(appliedCoupon, getTotal());
      },

      getDiscountedTotal: () => {
        const { getTotal, getDiscount } = get();
        return getTotal() - getDiscount();
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
