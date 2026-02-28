import { useEffect } from "react";

export default function TeakWidget() {
  useEffect(() => {
    console.log("Teak useEffect started");

    /**
     * 1️⃣ Prevent double initialization (React Strict Mode safe)
     */
    if (window.__teakInitialized) {
      console.log("Teak already initialized — skipping");
      return;
    }
    window.__teakInitialized = true;

    /**
     * 2️⃣ Create bootstrap stub (queue system)
     * This allows tg() calls before the real script fully loads.
     */
    if (!window.tg) {
      window.tg = function () {
        (window.tg.q = window.tg.q || []).push(arguments);
      };
      window.tg.l = +new Date();
    }

    /**
     * 3️⃣ Load Teak external script (only once)
     */
    const existingScript = document.querySelector(
      'script[src*="client-widget.min.js"]',
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://icw.protecht.com/client-widget.min.js?v=4";
      script.async = true;

      script.onload = () => {
        console.log("Teak script loaded");
        configureWidget();
      };

      script.onerror = () => {
        console.error("Failed to load Teak script");
      };

      document.head.appendChild(script);
    } else {
      configureWidget();
    }

    /**
     * 4️⃣ Configure widget
     */
    function configureWidget() {
      console.log("Configuring Teak widget");

      window.tg("configure", {
        apiKey: "pk_sandbox_171d94514de020b84871ddd965ab3059910cfaf8",
        sandbox: true,
        items: [
          {
            cost: 80.0, // Always use number, not string
          },
        ],

        // Lifecycle callbacks
        loadedCb: () => console.log("Teak loaded"),
        optInCb: () => console.log("User opted in"),
        optOutCb: () => console.log("User opted out"),
        updatedCb: () => console.log("Widget updated"),
        onErrorCb: (msg) => console.error("Teak error:", msg),
      });
    }
  }, []);

  /**
   * 5️⃣ Placeholder container
   * Teak renders into this element.
   */
  return <div id="tg-placeholder"></div>;
}
