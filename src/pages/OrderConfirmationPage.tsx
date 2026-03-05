import { Link, useLocation } from "react-router-dom";
import { CheckCircle, Mail, Calendar, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface LocationState {
  orderNumber?: string;
  email?: string;
  protectionWarning?: string;
  protectionAdded?: boolean;
}

export function OrderConfirmationPage() {
  const location = useLocation();
  const state = location.state as LocationState | null;

  const orderNumber = state?.orderNumber || "EVT-DEMO12345";
  const email = state?.email || "your email";
  const protectionWarning = state?.protectionWarning;
  const protectionAdded = state?.protectionAdded;

  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Success Icon */}
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-neutral-900">Order Confirmed!</h1>
          <p className="mt-2 text-lg text-neutral-600">Thank you for your purchase</p>
        </div>

        {/* Order Details */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-neutral-500">Order Number</p>
              <p className="mt-1 text-xl font-bold text-neutral-900 font-mono">{orderNumber}</p>
            </div>

            <Separator className="my-6" />

            {/* Graceful Protection Warning if order protection fails */}
            {(protectionWarning || protectionAdded) && (
              <div
                className={`mb-6 rounded-md border p-4 text-sm ${
                  protectionWarning
                    ? "border-yellow-200 bg-yellow-50 text-yellow-800"
                    : "border-green-200 bg-green-50 text-green-800"
                }`}
              >
                {protectionWarning
                  ? protectionWarning
                  : "Ticket Protection has been successfully added to your order. If you need to cancel for a covered reason, you can submit a refund request through your order details."}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                  <Mail className="h-5 w-5 text-neutral-700" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Confirmation Email</h3>
                  <p className="text-sm text-neutral-600">
                    We've sent a confirmation email to <span className="font-medium">{email}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                  <Ticket className="h-5 w-5 text-neutral-700" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Your Tickets</h3>
                  <p className="text-sm text-neutral-600">
                    Your e-tickets will be emailed to you shortly. You can also access them in your
                    account.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                  <Calendar className="h-5 w-5 text-neutral-700" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Event Reminders</h3>
                  <p className="text-sm text-neutral-600">
                    We'll send you a reminder before your event so you don't miss it!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <div className="mt-8 rounded-lg bg-neutral-100 p-6">
          <h2 className="font-semibold text-neutral-900">What's Next?</h2>
          <ul className="mt-3 space-y-2 text-sm text-neutral-600">
            <li>• Check your email for order confirmation and tickets</li>
            <li>• Save your tickets to your phone's wallet (if available)</li>
            <li>• Arrive at the venue at least 30 minutes early</li>
            <li>• Have your tickets ready to scan at entry</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link to="/account">View Your Orders</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/events">Browse More Events</Link>
          </Button>
        </div>

        {/* Support */}
        <p className="mt-8 text-center text-sm text-neutral-500">
          Questions about your order?{" "}
          <a href="#" className="text-neutral-900 underline hover:no-underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
