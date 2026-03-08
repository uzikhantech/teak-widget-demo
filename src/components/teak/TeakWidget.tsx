import { useEffect, useRef } from "react";
import { useCartStore } from "@/store/cartStore";

interface TeakWidgetProps {
  totalAmount: number;
}

declare global {
  interface Window {
    tg?: any;
    __teakScriptLoaded?: boolean;
  }
}

export default function TeakWidget({ totalAmount }: TeakWidgetProps) {
  const configuredRef = useRef(false);

  console.log("teakScriptLoaded:", window.__teakScriptLoaded);

  useEffect(() => {
    // ============================================
    // FREE CART GUARD
    // ============================================
    // Teak cannot accept cost = 0
    // When coupon makes cart free we clear the widget
    if (totalAmount <= 0) {
      console.log("Cart total is free — clearing Teak widget");

      // Tear down the widget completely
      window.tg?.("clear");

      const store = useCartStore.getState();
      store.setRefundProtectionPrice(0, false);
      store.setRefundProtectionToken(null);
      store.setTeakReady(false);

      configuredRef.current = false;

      return;
    }
    // ============================================
    // LOAD SCRIPT (ONLY ONCE)
    // ============================================
    if (!window.__teakScriptLoaded) {
      window.__teakScriptLoaded = true; //In React development mode, React intentionally runs effects twice.

      (function (w: any, d: Document, c: string, n: string, s?: any, p?: any) {
        w[n] =
          w[n] ||
          function () {
            (w[n].q = w[n].q || []).push(arguments);
          };

        w[n].l = +new Date();

        s = d.createElement(c);
        p = d.getElementsByTagName(c)[0];

        s.async = true;
        s.src = "https://icw.protecht.com/client-widget.min.js?v=4";

        s.onerror = function () {
          console.error("Teak script failed to load");
        };

        p.parentNode?.insertBefore(s, p);
      })(window, document, "script", "tg");
    }

    // ============================================
    // CONFIGURE WIDGET (ONLY ONCE)
    // ============================================
    if (!configuredRef.current) {
      configuredRef.current = true;

      window.tg?.("configure", {
        apiKey: import.meta.env.VITE_TEAK_API_PUB_KEY,
        items: [{ cost: Math.max(totalAmount, 1) }],
        referenceNumber: useCartStore.getState().cartId,
        persist: true,
        sandbox: true,

        loadedCb: function () {
          console.log("Teak loaded:", useCartStore.getState().cartId);

          const store = useCartStore.getState();
          const currentCartId = store.cartId;
          const previousCartId = store.previousCartId;

          console.log("Current cart:", currentCartId);
          console.log("Previous cart:", previousCartId);

          // Detect new cart session
          if (previousCartId && previousCartId !== currentCartId) {
            console.log("New cart session detected — clearing widget");

            window.tg?.("update", {
              items: [{ cost: Math.max(totalAmount, 1) }],
              referenceNumber: currentCartId,
              clearSelection: true,
            });

            store.setPreviousCartId(currentCartId);
          }

          // TEAK READY
          store.setTeakReady(true);

          const quote = window.tg?.get("quote");
          const isProtected = window.tg?.isProtected();

          console.log("Teak protection:", isProtected);

          if (quote) {
            store.setRefundProtectionPrice(Number(quote), true);
          } else {
            store.setRefundProtectionPrice(0, false);
          }
        },

        optInCb: function () {
          console.log("Opt in for protection");

          const quote = window.tg?.get("quote");
          const isProtected = window.tg?.isProtected();
          const quoteToken = window.tg?.get("token");

          if (quote && quoteToken) {
            const store = useCartStore.getState();
            store.setRefundProtectionPrice(Number(quote), isProtected);
            store.setRefundProtectionToken(quoteToken);
          }
        },

        optOutCb: function () {
          console.log("Opt out for protection");

          const isProtected = window.tg?.isProtected();
          const quoteToken = window.tg?.get("token");

          const store = useCartStore.getState();

          if (quoteToken) {
            store.setRefundProtectionToken(quoteToken);
          }

          store.setRefundProtectionPrice(0, isProtected);
        },

        updatedCb: function () {
          console.log("Quote updated");

          const quote = window.tg?.get("quote");
          const isProtected = window.tg?.isProtected();
          const quoteToken = window.tg?.get("token");

          const store = useCartStore.getState();

          if (quoteToken) {
            store.setRefundProtectionToken(quoteToken);
          }

          if (quote) {
            store.setRefundProtectionPrice(Number(quote), true);
          } else {
            store.setRefundProtectionPrice(0, false);
          }
        },

        onErrorCb: function (message: string) {
          console.error("Teak error:", message);

          const store = useCartStore.getState();
          store.setTeakReady(false);
          store.setRefundProtectionPrice(0, false);
          store.setRefundProtectionToken(null);
        },
      });
    } else {
      // ============================================
      // UPDATE PRICE WHEN CART CHANGES
      // ============================================
      console.log("PRICE UPDATED");

      window.tg?.("update", {
        items: [{ cost: totalAmount }],
        clearSelection: false,
      });
    }
  }, [totalAmount]);

  return <div id="tg-placeholder"></div>;
}
