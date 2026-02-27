import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Package, Search, Calendar, MapPin, Mail, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Order } from "@/types";

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

export function AccountPage() {
    const [email, setEmail] = useState("");
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

    const handleCancelOrder = async (orderId: string) => {
        setCancellingOrderId(orderId);

        try {
            const response = await fetch(
                `http://localhost:3001/api/orders/${orderId}/cancel`,
                { method: "POST" }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to cancel order");
            }

            const data = await response.json();

            // Update the order in local state
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId ? data.order : order
                )
            );

            toast.success("Order cancelled successfully", {
                description: `Order ${orderId} has been refunded.`,
            });
        } catch (err) {
            console.error("Error cancelling order:", err);
            toast.error("Failed to cancel order", {
                description: err instanceof Error ? err.message : "Please try again.",
            });
        } finally {
            setCancellingOrderId(null);
        }
    };

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `http://localhost:3001/api/orders?email=${encodeURIComponent(email)}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch orders");
            }

            const data = await response.json();
            setOrders(data);
            setHasSearched(true);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError("Unable to fetch orders. Please make sure the server is running.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-neutral-50 min-h-screen">
            {/* Header */}
            <div className="border-b border-neutral-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <div className="rounded-full bg-neutral-100 p-3">
                            <User className="h-6 w-6 text-neutral-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                                My Account
                            </h1>
                            <p className="text-neutral-600">
                                View your order history
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Email Lookup Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Find Your Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLookup} className="flex gap-4">
                            <div className="flex-1">
                                <Label htmlFor="email" className="sr-only">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Looking up...
                                    </>
                                ) : (
                                    "Look Up Orders"
                                )}
                            </Button>
                        </form>
                        {error && (
                            <p className="mt-3 text-sm text-red-600">{error}</p>
                        )}
                        <p className="mt-3 text-xs text-neutral-500">
                            Enter the email address you used during checkout to view your orders.
                        </p>
                    </CardContent>
                </Card>

                {/* Orders List */}
                {hasSearched && (
                    <div className="mt-8">
                        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                            {orders.length > 0
                                ? `Your Orders (${orders.length})`
                                : "No Orders Found"}
                        </h2>

                        {orders.length === 0 ? (
                            <Card>
                                <CardContent className="py-12">
                                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                                        <div className="rounded-full bg-neutral-100 p-4">
                                            <Package className="h-8 w-8 text-neutral-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-neutral-900">
                                                No orders found for this email
                                            </p>
                                            <p className="mt-1 text-sm text-neutral-600">
                                                Try a different email address or browse our events.
                                            </p>
                                        </div>
                                        <Button asChild>
                                            <Link to="/events">Browse Events</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <Card key={order.id}>
                                        <CardContent className="p-6">
                                            {/* Order Header */}
                                            <div className="flex flex-wrap items-start justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-mono text-sm font-semibold text-neutral-900">
                                                            {order.id}
                                                        </span>
                                                        <Badge
                                                            variant={
                                                                order.status === "confirmed"
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                        >
                                                            {order.status === "confirmed"
                                                                ? "Confirmed"
                                                                : "Refunded"}
                                                        </Badge>
                                                    </div>
                                                    <p className="mt-1 text-sm text-neutral-500">
                                                        Ordered on {formatDate(order.createdAt)}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <p className="text-lg font-semibold text-neutral-900">
                                                        ${order.totals.total.toFixed(2)}
                                                    </p>
                                                    {order.status === "confirmed" && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleCancelOrder(order.id)}
                                                            disabled={cancellingOrderId === order.id}
                                                            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                                                        >
                                                            {cancellingOrderId === order.id ? (
                                                                <>
                                                                    <span className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                                                                    Cancelling...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <XCircle className="mr-1.5 h-3.5 w-3.5" />
                                                                    Cancel Order
                                                                </>
                                                            )}
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            <Separator className="my-4" />

                                            {/* Order Items */}
                                            <div className="space-y-3">
                                                {order.items.map((item, idx) => (
                                                    <div
                                                        key={`${item.eventId}-${item.ticketTypeId}-${idx}`}
                                                        className="flex items-center justify-between"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="rounded bg-neutral-100 p-2">
                                                                <Calendar className="h-4 w-4 text-neutral-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-neutral-900">
                                                                    {item.eventName}
                                                                </p>
                                                                <p className="text-sm text-neutral-600">
                                                                    {item.ticketTypeName} × {item.quantity}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <p className="font-medium text-neutral-900">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Order Totals */}
                                            <div className="mt-4 pt-4 border-t border-neutral-100 space-y-1 text-sm">
                                                <div className="flex justify-between text-neutral-600">
                                                    <span>Subtotal</span>
                                                    <span>${order.totals.subtotal.toFixed(2)}</span>
                                                </div>
                                                {order.totals.discount && order.totals.discount > 0 && (
                                                    <div className="flex justify-between text-green-600">
                                                        <span>Discount</span>
                                                        <span>-${order.totals.discount.toFixed(2)}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between text-neutral-600">
                                                    <span>Service Fee</span>
                                                    <span>${order.totals.serviceFee.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-neutral-600">
                                                    <span>Tax</span>
                                                    <span>${order.totals.tax.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Help Section */}
                {!hasSearched && (
                    <div className="mt-8 rounded-lg bg-neutral-100 p-6">
                        <h2 className="font-semibold text-neutral-900">Need Help?</h2>
                        <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Check your confirmation email for your order number
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Arrive at the venue at least 30 minutes early
                            </li>
                            <li className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                E-tickets are sent to your email after purchase
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
