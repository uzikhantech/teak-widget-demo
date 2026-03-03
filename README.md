# Teak Widget Integration Demo

## Overview

This project demonstrates integration of the Teak Refund Protection widget into a React application.

The project originally began from the official RefundTix demo repository and was refactored to:

## Features

### 1. Event Discovery

- Browse events across 3 categories: Concerts, Sports, and Theater
- 12 sample events with rich descriptions, venue details, and imagery
- Category filtering and featured event highlights on the homepage
- Individual event detail pages with multiple ticket tiers

### 2. Shopping Cart

- Persistent cart with local storage
- Add tickets with quantity selection
- Multiple ticket types per event (GA, VIP, Floor, etc.)
- Real-time cart item count and totals

### 3. Coupon/Promo Codes

- Percentage-based discounts (e.g., SAVE10 = 10% off, WELCOME = 15% off)
- Fixed amount discounts (e.g., FLAT20 = $20 off)
- Free order code (FREE = 100% off)
- Real-time discount calculation in cart summary

### 4. Checkout Flow

- Customer information collection (email, name, phone)
- Payment integration placeholder (mock successes)
- Order summary with itemized breakdown
- Service fee (10%) and tax (8%) calculations
- Order confirmation with unique order ID

### 5. Account & Order Management

- Email-based order lookup (no authentication required)
- Order history with status tracking (Confirmed/Refunded)
- Detailed order breakdowns including discounts and fees

## Setup

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

## Run

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### 5. DEV NOTES

- The Teak order should ONLY be submitted after your primary transaction (on the ticketing platform) is successfully completed.
- Each line item in the cart needs to be submitted as an item in order API call.
- Submit an Order for a single line item.
- Submit an Order for multiple line items.
- Each line item in the cart receives its own policy.
