import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Event, TicketType } from "@/types";
import type { Coupon } from "@/data/coupons";
import { findCoupon, calculateDiscount } from "@/data/coupons";

interface CartState {
    items: CartItem[];
    appliedCoupon: Coupon | null;
    //refund price protection states
    refundProtectionPrice: number;
    isProtectionSelected: boolean;
    refundProtectionToken: string | null
    setRefundProtectionToken: (token: string | null) => void;
    setRefundProtection: (price: number, selected: boolean) => void;
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

            //initialize the refund protection
            refundProtectionPrice: 0,
            isProtectionSelected: false,

            setRefundProtection: (price: number, selected: boolean) => {
                set({
                    refundProtectionPrice: selected ? price : 0,
                    isProtectionSelected: selected,
                 });
            },

            //initial the refund protection token
            refundProtectionToken: null,
            setRefundProtectionToken: (token: string | null) => {
                set({
                    refundProtectionToken: token
                });
            },

            addItem: (event, ticketType, quantity = 1) => {
                set((state) => {
                    const existingItemIndex = state.items.findIndex(
                        (item) =>
                            item.event.id === event.id && item.ticketType.id === ticketType.id
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
                set((state) => ({
                    items: state.items.filter(
                        (item) =>
                            !(item.event.id === eventId && item.ticketType.id === ticketTypeId)
                    ),
                }));
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
                set({ items: [], appliedCoupon: null,   isProtectionSelected: false,
    refundProtectionPrice: 0, });
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
