import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCartStore } from "@/store/cartStore";
import { buildTeakPayload } from "@/lib/buildTeakPayload";
import { validateTeakQuoteToken } from "@/lib/utils";

export function CheckoutPage() {
  const navigate = useNavigate();
  const {
    items,
    clearCart,
    appliedCoupon,
    getTotal,
    getDiscount,
    refundProtectionPrice,
    refundProtectionToken,
  } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  //for storing teak order failure:
  let protectionWarning: string | null = null;
  let protectionAdded: boolean | null = null;
  const optedIn = window.tg?.isProtected() === true;

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  if (items.length === 0) {
    return (
      <div className="bg-neutral-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-6 py-16">
            <h1 className="text-2xl font-bold text-neutral-900">Your cart is empty</h1>
            <p className="text-neutral-600">Add some tickets to your cart before checking out.</p>
            <Button asChild>
              <Link to="/events">Browse Events</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Calculate totals with discount
      const subtotal = getTotal();
      const discount = getDiscount();
      const discountedSubtotal = subtotal - discount;
      // Fees and tax calculated on discounted subtotal
      const serviceFee = discountedSubtotal * 0.1;
      const tax = discountedSubtotal * 0.08;

      // Use protection price from cart store
      const refundProtectionFee = refundProtectionPrice || 0;

      // Include protection in total
      const total = discountedSubtotal + serviceFee + tax + refundProtectionFee;

      // ============Step 1: Process payment first======================//
      const paymentResponse = await fetch("http://localhost:3001/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
          paymentMethod: "card",
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error("Payment processing failed");
      }

      const paymentResult = await paymentResponse.json();

      if (!paymentResult.success) {
        throw new Error("Payment was declined");
      }

      // =========Step 2: Create order with payment reference==========//
      const orderData = {
        customer: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || undefined,
        },
        items: items.map((item) => ({
          eventId: item.event.id,
          eventName: item.event.name,
          ticketTypeId: item.ticketType.id,
          ticketTypeName: item.ticketType.name,
          quantity: item.quantity,
          price: item.ticketType.price,
        })),
        totals: {
          subtotal,
          discount,
          serviceFee,
          tax,
          refundProtectionFee, //adding ticket refund protection to backend order
          total,
        },
        coupon: appliedCoupon
          ? {
              code: appliedCoupon.code,
              type: appliedCoupon.type,
              value: appliedCoupon.value,
            }
          : undefined,
        paymentTransactionId: paymentResult.transactionId,
      };

      // Submit order to API
      const orderResponse = await fetch("http://localhost:3001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to submit order");
      }

      const orderResult = await orderResponse.json();

      //check we definetly have an order created before ordering refund protection
      if (!orderResult.orderId) {
        throw new Error("Order creation failed");
      }

      //=========STEP 3 - Create TEAK protection order========//
      let teakResult = null;
      if (refundProtectionToken && discountedSubtotal > 0) {
        try {
          const protectionQuote = window.tg?.get("quote");
          const protectionToken = window.tg?.get("token");

          //does the quote match the quote in the token?
          const isValidQuote =
            protectionQuote && protectionQuote
              ? validateTeakQuoteToken(Number(protectionQuote), protectionToken)
              : false;

          //if not valid don't proceed with the refund prtotection order
          if (!isValidQuote) {
            console.error("Teak quote token mismatch");
            //make sure we set the warning message for the confirmation page if opted in
            if (optedIn) {
              protectionWarning =
                "Your tickets were successfully purchased, but refund protection could not be verified and was not added. You will not be charged for protection.";
            } else {
              protectionWarning = null;
            }
          } else {
            const teakPayload = buildTeakPayload(
              orderResult.orderId,
              refundProtectionToken,
              items,
              formData,
              getTotal(),
              getDiscount()
            );

            console.log("===== SENDING TO TEAK =====");
            console.log(JSON.stringify(teakPayload, null, 2));

            const teakResponse = await fetch("http://localhost:3001/api/teak/order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(teakPayload),
            });

            teakResult = await teakResponse.json();

            if (!teakResult.success) {
              console.error("Teak Protection Error");
              if (optedIn) {
                protectionWarning =
                  "Your tickets were successfully purchased, but refund protection could not be added. You will not be charged for protection. Please call us at 1800-321-3232";
              } else {
                protectionWarning = null;
              }
            }
            //teak order good and protection order was created
            if (teakResult.success && teakResult.protectionCreated) {
              protectionAdded = true;
            }
          }
        } catch (teakError) {
          console.error("Teak Protection Error:" + teakError);
          if (optedIn) {
            protectionWarning =
              "Your tickets were successfully purchased, but refund protection could not be added. You will not be charged for protection. Please call us at 1800-321-3232";
          } else {
            protectionWarning = null;
          }
        }
      }

      //=========STEP 4 - Success: Clear cart and navigate to confirmation=========//
      clearCart();
      console.log("protection added: " + protectionAdded);
      console.log("protection warning: " + protectionWarning);
      navigate("/order-confirmation", {
        state: {
          orderNumber: orderResult.orderId,
          email: formData.email,
          paymentTransactionId: paymentResult.transactionId,
          //policy the refund policy details to the confirmation
          refundPolicy: teakResult?.refundPolicy || null,
          //pass protection warning to confirmation order page
          protectionWarning,
          protectionAdded,
        },
      });
    } catch (error) {
      console.error("Order submission failed:", error);
      alert(error instanceof Error ? error.message : "Failed to submit order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link to="/cart">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Link>
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Checkout</h1>
        <form onSubmit={handleSubmit}>
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      required
                      className="mt-1"
                    />
                    <p className="mt-1 text-xs text-neutral-500">
                      Your tickets will be sent to this email
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567"
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Section - INTEGRATION POINT */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 p-8">
                    <div className="text-center">
                      <CreditCard className="mx-auto h-12 w-12 text-neutral-400" />
                      <h3 className="mt-4 text-lg font-semibold text-neutral-700">
                        Payment Integration Placeholder
                      </h3>
                      <p className="mt-2 text-sm text-neutral-500">
                        This is where RefundTix integrates Stripe, PayPal, or another payment
                        processor.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500">
                    <Lock className="h-3 w-3" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => {
                      const formattedDate = new Date(item.event.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      });

                      return (
                        <div key={`${item.event.id}-${item.ticketType.id}`} className="flex gap-4">
                          <img
                            src={item.event.image}
                            alt={item.event.name}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-neutral-900">{item.event.name}</h4>
                            <p className="text-sm text-neutral-600">
                              {item.ticketType.name} × {item.quantity}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {formattedDate} • {item.event.time}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-medium text-neutral-900">
                              ${(item.ticketType.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <CartSummary showCheckoutButton={false} />

                <Separator />

                <Button type="submit" size="lg" className="w-full" disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Complete Purchase
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-neutral-500">
                  By completing this purchase, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
