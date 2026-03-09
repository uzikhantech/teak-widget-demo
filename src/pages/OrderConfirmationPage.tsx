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
  refundPolicy: any;
}

export function OrderConfirmationPage() {
  const location = useLocation();
  const state = location.state as LocationState | null;

  const orderNumber = state?.orderNumber || "EVT-DEMO12345";
  const email = state?.email || "your email";
  const protectionWarning = state?.protectionWarning;
  const protectionAdded = state?.protectionAdded;
  const refundPolicy = state?.refundPolicy;

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
            {protectionWarning && (
              <div className="mb-6 rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                {protectionWarning}
              </div>
            )}

            {/* Refund Protection Links */}
            {refundPolicy && protectionAdded && (
              <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-5">
                {/* Success Message */}
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-emerald-900">Refund Protection Added</h3>
                    <p className="text-sm text-emerald-800">
                      Your ticket purchase is protected. If you cannot attend due to a covered
                      reason, you may request a refund through the links below.
                    </p>
                  </div>
                </div>

                <Separator className="my-4 bg-emerald-200" />

                {/* Protection Actions */}
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 mb-3">
                    Refund Protection Details
                  </h4>

                  <div className="grid gap-2 text-sm">
                    {refundPolicy.refund_request_url && (
                      <a
                        href={refundPolicy.refund_request_url}
                        target="_blank"
                        className="flex items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2 hover:bg-neutral-50"
                      >
                        Submit a Refund Request
                      </a>
                    )}

                    {refundPolicy.certificate_url && (
                      <a
                        href={refundPolicy.certificate_url}
                        target="_blank"
                        className="flex items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2 hover:bg-neutral-50"
                      >
                        View Protection Certificate
                      </a>
                    )}

                    {refundPolicy.policy_pdf && (
                      <a
                        href={refundPolicy.policy_pdf}
                        target="_blank"
                        className="flex items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2 hover:bg-neutral-50"
                      >
                        Download Policy PDF
                      </a>
                    )}

                    {refundPolicy.faq_url && (
                      <a
                        href={refundPolicy.faq_url}
                        target="_blank"
                        className="flex items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2 hover:bg-neutral-50"
                      >
                        Protection FAQ
                      </a>
                    )}
                  </div>
                </div>
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
