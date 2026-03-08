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

### 5. Refund Protection (Teak Integration)

This project integrates the Teak Refund Protection widget to allow customers to optionally protect their ticket purchase.

#### Widget Behavior

- The widget dynamically calculates refund protection pricing based on the cart total.
- Customers may opt in or opt out of protection during checkout.
- If selected, a protection token is generated and stored for order submission.

#### Protection Order Flow

1. Customer completes the primary ticket purchase.
2. If protection was selected, the backend submits a request to the Teak Orders API.
3. Each ticket line item is submitted to Teak as its own protected item.
4. Protection confirmation is stored with the order record.

#### Important Integration Rules

- Protection must only be submitted after the primary ticket purchase succeeds.
- Each cart line item is submitted as a separate protected item.
- Orders with multiple ticket types create multiple protection items within a single Teak order.

#### Error Handling

The integration is designed with resilience in mind:

- Protection failures do not block ticket purchases.
- Customers are notified if protection fails while their tickets remain confirmed.
- Retry logic is used for temporary API failures.

### 6. Account & Order Management

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

## Environment Variables

This project uses environment variables to securely configure the Teak widget and backend API integration.

### Frontend Environment Variables

Create a `.env` file in the root of the project.

```env
VITE_TEAK_PUBLIC_KEY=your_teak_public_key
```

### Backend Environment Variables

Create a `.env` file in the server folder of the project.

```env
TEAK_PUBLIC_KEY=your_teak_public_key
TEAK_SECRET_KEY=your_teak_secret_key
TEAK_API_BASE=https://api.sandbox.protecht.com/api/
TEAK_API_VERSION=v2
```
