import { Link } from "react-router-dom";
import { Ticket } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <Ticket className="h-6 w-6 text-neutral-900" />
              <span className="text-xl font-semibold tracking-tight text-neutral-900">
                RefundTix
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-neutral-600">
              Your gateway to unforgettable experiences. Find and book tickets
              to concerts, sports, theater, and more.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/events"
                  className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                >
                  Browse Events
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                >
                  My Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Support</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <p className="text-center text-sm text-neutral-500">
          © {currentYear} RefundTix. All rights reserved. Demo site for interview
          exercises.
        </p>
      </div>
    </footer>
  );
}
