import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Types
interface OrderItem {
    eventId: string;
    eventName: string;
    ticketTypeId: string;
    ticketTypeName: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    customer: {
        email: string;
        firstName: string;
        lastName: string;
        phone?: string;
    };
    items: OrderItem[];
    totals: {
        subtotal: number;
        discount?: number;
        serviceFee: number;
        tax: number;
        refundProtection?: number; //make sure orders knows about the protection coverage
        total: number;
    };
    coupon?: {
        code: string;
        type: string;
        value: number;
    };
    paymentTransactionId: string;
    status: "confirmed" | "refunded";
    createdAt: string;
}

interface OrderRequest {
    customer: {
        email: string;
        firstName: string;
        lastName: string;
        phone?: string;
    };
    items: OrderItem[];
    totals: {
        subtotal: number;
        discount?: number;
        serviceFee: number;
        tax: number;
        refundProtection?: number; //make sure order request knows about protection coverage, if any
        total: number;
    };
    coupon?: {
        code: string;
        type: string;
        value: number;
    };
    paymentTransactionId: string;
}

interface PaymentRequest {
    amount: number;
    paymentMethod?: string;
}

// ============================================
// IN-MEMORY ORDER STORE
// ============================================
// Stores orders in memory for demo purposes.
// Orders persist while server is running but reset on restart.
// ============================================

const orders = new Map<string, Order>();

// ============================================
// PAYMENT PROCESSING ENDPOINT
// ============================================
// Mock payment endpoint that simulates successful payment processing.
// In production, this would integrate with Stripe, PayPal, etc.
// ============================================

app.post("/api/payments", (req, res) => {
    const paymentData: PaymentRequest = req.body;

    console.log("\n========================================");
    console.log("💳 PAYMENT PROCESSING");
    console.log("========================================");
    console.log("Amount:", paymentData.amount);
    console.log("Payment Method:", paymentData.paymentMethod || "card");
    console.log("========================================\n");

    // Simulate payment processing delay
    setTimeout(() => {
        const transactionId = `TXN-${Date.now().toString(36).toUpperCase()}`;

        console.log("✅ Payment successful:", transactionId);

        res.json({
            success: true,
            transactionId,
            amount: paymentData.amount,
            status: "completed",
            timestamp: new Date().toISOString(),
        });
    }, 500);
});

// ============================================
// ORDER SUBMISSION ENDPOINT
// ============================================
// Creates a new order with customer info, cart items, and totals.
// Stores order in memory and returns order details.
// ============================================

app.post("/api/orders", (req, res) => {
    const orderData: OrderRequest = req.body;

    // Generate a mock order ID
    const orderId = `EVT-${Date.now().toString(36).toUpperCase()}`;

    // Create the full order object
    const order: Order = {
        id: orderId,
        customer: orderData.customer,
        items: orderData.items,
        totals: orderData.totals,
        coupon: orderData.coupon,
        paymentTransactionId: orderData.paymentTransactionId,
        status: "confirmed",
        createdAt: new Date().toISOString(),
    };

    // Store order in memory
    orders.set(orderId, order);

    // Log the incoming order for debugging
    console.log("\n========================================");
    console.log("📦 NEW ORDER RECEIVED");
    console.log("========================================");
    console.log("Order ID:", orderId);
    console.log("Customer:", orderData.customer);
    console.log("Items:", JSON.stringify(orderData.items, null, 2));
    console.log("Totals:", orderData.totals);
    console.log("Payment Transaction ID:", orderData.paymentTransactionId);
    console.log("Total Orders in Store:", orders.size);
    console.log("========================================\n");

    // Simulate processing delay
    setTimeout(() => {
        res.json({
            success: true,
            orderId,
            order,
            message: "Order created successfully",
            timestamp: new Date().toISOString(),
        });
    }, 500);
});

// ============================================
// GET ORDERS BY EMAIL
// ============================================
// Fetches all orders for a given email address.
// Used by the Account page to display order history.
// ============================================

app.get("/api/orders", (req, res) => {
    const email = req.query.email as string;

    if (!email) {
        res.status(400).json({ error: "Email query parameter is required" });
        return;
    }

    const userOrders = [...orders.values()]
        .filter((order) => order.customer.email.toLowerCase() === email.toLowerCase())
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    console.log(`\n📋 Fetching orders for: ${email}`);
    console.log(`   Found ${userOrders.length} orders\n`);

    res.json(userOrders);
});

// ============================================
// GET SINGLE ORDER
// ============================================
// Fetches a single order by ID.
// ============================================

app.get("/api/orders/:orderId", (req, res) => {
    const { orderId } = req.params;

    const order = orders.get(orderId);

    if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
    }

    res.json(order);
});

// ============================================
// CANCEL ORDER ENDPOINT
// ============================================
// Cancels an order by updating its status to "refunded".
// In production, this would also trigger a refund via payment provider.
// ============================================

app.post("/api/orders/:orderId/cancel", (req, res) => {
    const { orderId } = req.params;

    const order = orders.get(orderId);

    if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
    }

    if (order.status === "refunded") {
        res.status(400).json({ error: "Order has already been cancelled" });
        return;
    }

    // Update order status to refunded
    order.status = "refunded";
    orders.set(orderId, order);

    console.log("\n========================================");
    console.log("❌ ORDER CANCELLED");
    console.log("========================================");
    console.log("Order ID:", orderId);
    console.log("Customer:", order.customer.email);
    console.log("Refund Amount:", order.totals.total);
    console.log("========================================\n");

    // Simulate processing delay
    setTimeout(() => {
        res.json({
            success: true,
            order,
            message: "Order cancelled successfully",
            timestamp: new Date().toISOString(),
        });
    }, 500);
});



// ============================================
// CREATE TEAK PROTECTION ORDER
// ============================================
// Per documentation - The Teak order should ONLY be submitted after your 
// primary transaction (on the ticketing platform) is successfully completed.
// ============================================

app.post("/api/teak/order", async (req, res) => {

    console.log("Calling refund protection order");

    const TEAK_API_BASE = process.env.TEAK_API_BASE;
    const TEAK_API_VERSION = process.env.TEAK_API_VERSION;

    //Handle failure - Missing Teak API ENV Variables
    if (!TEAK_API_BASE || !TEAK_API_VERSION) {
        console.error("Missing TEAK API environment variables");

        return res.status(200).json({
            success: false,
            protectionCreated: false,
            message: "Refund protection service unavailable: TEAK API Url malformed"
        });
    }

    const API_URL = `${TEAK_API_BASE}${TEAK_API_VERSION}`;

    try {
        const teakOrderPayload = req.body;
        console.log("request body: " + JSON.stringify(teakOrderPayload, null, 2));


        // STEP 1 — Obtain the JWT token
        const authResponse = await fetch(API_URL+'/auth/token',
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            },
            body: JSON.stringify({
            public_key: process.env.TEAK_PUBLIC_KEY,
            secret_key: process.env.TEAK_SECRET_KEY,
            }),
        });

        //Handle Failure - Auth API fetch failure
        if (!authResponse.ok) {
            const errorText = await authResponse.text();
            console.error("Teak JWT Error:", errorText);

            return res.status(200).json({
                success: false,
                protectionCreated: false,
                message: "Refund protection service unavailable: Unable to communicate with auth token endpoint"
            });
        }

        //get the token
        const authData = await authResponse.json();

        // Handle Failure - missing token from /auth/token auth response
        if (!authData.token) {
            console.error("JWT token missing in response");

            return res.status(200).json({
                success: false,
                protectionCreated: false,
                message: "Refund protection service unavailable: JWT token missing from auth response"
            });
        }


        // STEP 2 — Create Order
        const orderResponse = await fetch(API_URL+'/orders',
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${authData.token}`,
            },
            body: JSON.stringify(teakOrderPayload),
        });
        
        //Handle Failure - miss protection order from /orders
        if (!orderResponse.ok) {
            const errorBody = await orderResponse.text();
            console.error("Teak Order Creation Failed:", errorBody);

            return res.status(200).json({
                success: false,
                protectionCreated: false,
                message: "Refund protection service unavailable: Unable to communicate with order endpoint"
            });
        }

        const orderData = await orderResponse.json();

        //Handle Success
         return res.status(200).json({
            success: true,
            protectionCreated: true,
            teakOrder: orderData,
            message:"Refund Protection Success"
        });


    } catch (err: any) {
        console.log("Teak Refund Protection Order Error");
         return res.status(200).json({
            success: false,
            protectionCreated: false,
            message: "Refund protection service temporarily unavailable"
        });
    }
});

// ============================================
// Health Check endpoint
// ============================================
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Server running at http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health`);
    console.log(`   Payments API: POST http://localhost:${PORT}/api/payments`);
    console.log(`   Orders API: POST http://localhost:${PORT}/api/orders`);
    console.log(`   Orders API: GET http://localhost:${PORT}/api/orders?email=...`);
    console.log(`   Cancel Order: POST http://localhost:${PORT}/api/orders/:orderId/cancel`);
    console.log(`   Refund Protection Order: POST http://localhost:${PORT}/api/teak/order\n`);
});
