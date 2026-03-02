import { useEffect } from "react";

interface TeakWidgetProps {
  totalAmount: number;
}


export default function TeakWidget({ totalAmount }: TeakWidgetProps) {
  useEffect(() => {
    // Prevent duplicate initialization (React Strict Mode safe)
    if ((window as any).__teakInitialized) return;
    (window as any).__teakInitialized = true;

    // 🔥 Bootstrap stub exactly as docs show
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

    // 🔥 Configure immediately after stub
    (window as any).tg("configure", {
      apiKey: "pk_sandbox_171d94514de020b84871ddd965ab3059910cfaf8",
      items: [{ cost: totalAmount }],
      sandbox: true,

      loadedCb: function () {
        console.log("Teak loaded");
      },

      optInCb: function () {
        console.log("User opted in");

        const quote = (window as any).tg.get("quote");
        console.log("Protection cost:", quote);
      },

      optOutCb: function () {
        console.log("User opted out");
      },

      updatedCb: function () {
        console.log("Widget updated");
      },

      onErrorCb: function (message: string) {
        console.error("Teak error:", message);
      },
    });
  }, []);

  return <div id="tg-placeholder"></div>;
}