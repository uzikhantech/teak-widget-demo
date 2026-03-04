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
  console.log("teackScriptLoded: "+  window.__teakScriptLoaded)

  useEffect(() => {
    if (!window.__teakScriptLoaded) {
      window.__teakScriptLoaded = true;

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

    // Only configure once
    if (!configuredRef.current) {
      configuredRef.current = true;

      window.tg?.("configure", {
        apiKey: import.meta.env.VITE_TEAK_API_PUB_KEY,
        items: [{ cost: totalAmount }],
        sandbox: true,

         loadedCb: function () {
            console.log("Teak loaded");

            //TEAK READY
            useCartStore.getState().setTeakReady(true); 

            const quote = window.tg?.get("quote");
            const isProtected = window.tg?.isProtected();
            console.log("Teak protection:" + isProtected);
            
              // consumer opts in update the refund protection price
            if (isProtected && quote) {
              useCartStore.getState().setRefundProtection(Number(quote), true);
            } else {
              useCartStore.getState().setRefundProtection(0, false);
            }
        },

        optInCb: function () {
           console.log("Opt in for protection");

          const quote = window.tg?.get("quote");
          const isProtected = window.tg?.isProtected();
          const quoteToken = window.tg?.get("token"); 

          // consumer opts in update the refud protection price
          if (quote && quoteToken) {
            useCartStore.getState().setRefundProtection(Number(quote), isProtected);
            useCartStore.getState().setRefundProtectionToken(quoteToken);
          }
        },

        optOutCb: function () {
          console.log("Opt out for protection");

          const isProtected = window.tg?.isProtected();
          const quoteToken = window.tg?.get("token"); 

          if (quoteToken) {
              useCartStore.getState().setRefundProtectionToken(quoteToken);
          }

          useCartStore.getState().setRefundProtection(0, isProtected);
      
        },

        updatedCb: function () {
          console.log("Quote updated");

          const quote = window.tg?.get("quote");
          const isProtected = window.tg?.isProtected();
          const quoteToken = window.tg?.get("token"); 

          if(quoteToken) {
            useCartStore.getState().setRefundProtectionToken(quoteToken);
          }

          //if consumer adjusts cart products make sure update the protection price
          if (isProtected && quote) {
            useCartStore
              .getState()
              .setRefundProtection(Number(quote), true);
          } else {
            useCartStore
              .getState()
              .setRefundProtection(0, false);
          }
        },

        onErrorCb: function (message: string) {
          console.error("Teak error:", message);
          useCartStore
            .getState()
            .setRefundProtection(0, false); 
            useCartStore.getState().setRefundProtectionToken(null);
        },

      });
    } else {
      // If price changes AFTER init, update items
      // If subtotal changes after initial load
      console.log("Calling tg update with:", totalAmount)

      window.tg?.("update", {
        items: [{ cost: totalAmount }],
      });
    }
  }, [totalAmount]);

  return <div id="tg-placeholder"></div>;
}