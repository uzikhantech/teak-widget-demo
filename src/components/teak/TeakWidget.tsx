import { useEffect, useRef } from "react";

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
        apiKey: "test",
        items: [{ cost: totalAmount }],
        sandbox: true,
      });
    } else {
      // If total changes AFTER init, update items
      window.tg?.("update", {
        items: [{ cost: totalAmount }],
      });
    }
  }, [totalAmount]);

  return <div id="tg-placeholder"></div>;
}