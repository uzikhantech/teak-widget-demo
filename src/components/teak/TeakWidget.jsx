import { useEffect } from "react";

export default function TeakWidget() {
  useEffect(() => {
    // 1️⃣ Bootstrap exactly like their example
    (function (w, d, c, n, s, p) {
      w[n] =
        w[n] ||
        function () {
          (w[n].q = w[n].q || []).push(arguments);
        };
      w[n].l = +new Date();

      s = d.createElement(c);
      p = d.getElementsByTagName(c)[0];

      s.onerror = function () {
        console.log("Teak script failed to load");
      };

      s.async = true;
      s.src = "https://icw.protecht.com/client-widget.min.js?v=4";

      p.parentNode.insertBefore(s, p);
    })(window, document, "script", "tg");

    // 2️⃣ Configure immediately (just like example)
    window.tg("configure", {
      apiKey: "pk_sandbox_171d94514de020b84871ddd965ab3059910cfaf8", // 🔥 HARD CODED
      items: [
        { cost: "80.00" }, // 🔥 HARD CODED
      ],
      sandbox: true, // 🔥 VERY IMPORTANT FOR SANDBOX KEY

      loadedCb: function () {
        console.log("loaded callback");
      },

      optInCb: function () {
        console.log("opted in callback");
      },

      optOutCb: function () {
        console.log("opted out callback");
      },

      updatedCb: function () {
        console.log("updated callback");
      },

      onErrorCb: function (message) {
        console.log("Teak error:", message);
      },
    });
  }, []);

  return <div id="tg-placeholder"></div>;
}
