# Paystack Integration - Code Reference

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── paystack/
│   │   │   ├── initialize/
│   │   │   │   └── route.ts          [NEW - Payment initialization]
│   │   │   └── verify/
│   │   │       └── route.ts          [NEW - Payment verification]
│   │   └── tickets/
│   │       └── route.ts              [EXISTING - Get ticket prices]
│   ├── payment-confirmation/
│   │   └── page.tsx                  [NEW - Confirmation page]
│   └── page.tsx                       [EXISTING - Homepage]
├── components/
│   ├── CheckoutModal.tsx             [MODIFIED - Paystack integration]
│   ├── Tickets.tsx                    [EXISTING - Display tickets]
│   └── ...
└── lib/
    ├── prisma.ts                     [EXISTING - DB client]
    └── ...

.env.local                             [MODIFIED - Paystack keys]
```

---

## API Endpoints

### 1. Initialize Payment

**Route**: `POST /api/paystack/initialize`  
**Purpose**: Create order and get Paystack payment URL

**Request**:

```json
{
  "email": "user@example.com",
  "amount": 7500,
  "fullName": "John Doe",
  "phone": "08012345678",
  "tierId": "ticket-id",
  "quantity": 2
}
```

**Response (Success)**:

```json
{
  "success": true,
  "authorizationUrl": "https://checkout.paystack.com/...",
  "accessCode": "abc123",
  "reference": "order-id",
  "orderId": "order-id"
}
```

**Response (Error)**:

```json
{
  "error": "Only 5 tickets available"
}
```

### 2. Verify Payment

**Route**: `POST /api/paystack/verify`  
**Purpose**: Verify payment and update order status

**Request**:

```json
{
  "reference": "order-id"
}
```

**Response (Success)**:

```json
{
  "success": true,
  "message": "Payment verified successfully",
  "orderId": "order-id",
  "orderNumber": "IAF-2026-1234567890"
}
```

**Response (Failed)**:

```json
{
  "success": false,
  "message": "Payment was not successful"
}
```

### 3. Get Tickets (Existing)

**Route**: `GET /api/tickets`  
**Purpose**: Fetch all available tickets

**Response**:

```json
[
  {
    "id": "ticket-id",
    "ticketType": "REGULAR",
    "name": "Regular",
    "presaleSinglePrice": 3000,
    "totalUnits": 5000,
    "soldUnits": 150
  },
  {
    "id": "ticket-id-2",
    "ticketType": "VIP_BRONZE",
    "name": "Bronze VIP",
    "presaleSinglePrice": 7500,
    "totalUnits": 80,
    "soldUnits": 12
  }
]
```

---

## Component: CheckoutModal

**File**: `src/components/CheckoutModal.tsx`

**Props**:

```tsx
interface CheckoutModalProps {
  isOpen: boolean;           // Show/hide modal
  onClose: () => void;       // Close callback
  tier: TicketTier | null;   // Selected ticket tier
}
```

**State**:

```tsx
const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [quantity, setQuantity] = useState(1);
const [isProcessing, setIsProcessing] = useState(false);
```

**Key Function**:

```tsx
const handlePayment = async (e: React.FormEvent) => {
  // 1. Validate form
  // 2. Call /api/paystack/initialize
  // 3. Redirect to Paystack payment page
}
```

**Form Fields**:

- Name (required, text)
- Email (required, email)
- Phone (required, tel, min 10 chars)
- Quantity (required, number 1-10)

**Displays**:

- ✅ Ticket name & price
- ✅ Price breakdown (qty × unit price)
- ✅ Total amount in NGN
- ✅ Loading state with spinner
- ✅ Error messages

---

## Page: Payment Confirmation

**File**: `src/app/payment-confirmation/page.tsx`  
**Route**: `/payment-confirmation?reference=<order-id>`

**Lifecycle**:

1. Component mounts
2. Extracts `reference` from URL
3. Calls `POST /api/paystack/verify`
4. Shows loading spinner
5. Displays success/error based on response

**States**:

- **Loading**: Shows spinner + "Verifying Payment..."
- **Success**: Shows order details + home link
- **Failed**: Shows error + retry link

**Displayed Info (Success)**:

- ✅ Checkmark icon
- ✅ "Payment Successful!" message
- ✅ Order Number: IAF-2026-XXXXXXXXX
- ✅ Payment Status: Completed
- ✅ Links to home page

**Displayed Info (Failed)**:

- ❌ X icon
- ❌ "Payment Failed" message
- ❌ Error message
- ❌ Retry button
- ❌ Support email link

---

## Database Models

### Order Model

```prisma
model Order {
  id                String   @id @default(cuid())
  orderNumber       String   @unique
  userId            String
  ticketPriceId     String
  quantity          Int
  totalPrice        Int      // in NGN
  
  // Payment info
  paymentMethod     PaymentMethod @default(PAYSTACK)
  paymentStatus     PaymentStatus @default(PENDING)
  paymentRefId      String?       // Paystack reference
  paidAt            DateTime?
  
  // Customer info
  customerEmail     String
  customerPhone     String
  customerName      String
  
  // Status
  orderStatus       OrderStatus @default(PENDING)
  
  // Timestamps
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  expiresAt         DateTime?
  
  // Relations
  user              User @relation(...)
  ticketPrice       TicketPrice @relation(...)
  tickets           TicketOrder[]
}
```

### TicketPrice Model (Relevant Fields)

```prisma
model TicketPrice {
  id                String   @id @default(cuid())
  ticketType        TicketType @unique
  name              String       // "Regular", "Bronze VIP", etc.
  totalUnits        Int          // Total available
  soldUnits         Int @default(0)  // Updated on successful payment
  presaleSinglePrice Int
  
  // Relations
  orders            Order[]
}
```

### Enums Used

```prisma
enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

enum OrderStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
  CANCELLED
}

enum PaymentMethod {
  PAYSTACK
  FLUTTERWAVE
  OPAY
  BANK_TRANSFER
}
```

---

## Environment Variables

**File**: `.env.local`

```dotenv
# Paystack API Keys (Test Mode)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_bb8e2d529f9c5854aad5762f67bd405c8ea7c673
PAYSTACK_SECRET_KEY=sk_test_90be186ba4d40249ee8bb3a405c3cea33cb34c72

# Callback URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://...

# Other configs
NODE_ENV=development
```

---

## HTTP Status Codes

### Success Responses

- `200 OK`: Payment initialized / verified successfully
- `201 Created`: Order created

### Error Responses

- `400 Bad Request`: Missing fields, invalid data, insufficient tickets
- `404 Not Found`: Ticket type not found
- `500 Internal Server Error`: API error, database error

---

## Payment Flow Sequence Diagram

```
User                CheckoutModal         Backend              Paystack
 |                      |                    |                   |
 |---Fill Form-------→  |                    |                   |
 |                      |                    |                   |
 |---Click Pay Now---→  |                    |                   |
 |                      |--POST /initialize→ |                   |
 |                      |                    |---Create Order    |
 |                      |                    |---Init Paystack--→|
 |                      |  ←--Auth URL---    |                   |
 |  ←--Redirect---------|                    |                   |
 |---Redirect to URL------------------------→|                   |
 |                      |                    |---Enter Card----→|
 |                      |                    |                   |
 |                      |                    |                 [Process]
 |                      |                    |                   |
 |                      |                    |←--Redirect---   |
 |---Redirect---→ /confirmation?ref=X       |                   |
 |                      |--POST /verify------→|                   |
 |                      |                    |--Verify Paystack--→|
 |                      |                    |←--Confirmed-----|
 |                      |                    |---Update Order    |
 |                      |                    |---Update Tickets  |
 |  ←--Success Page--   |                    |                   |
 |                      |                    |                   |
```

---

## Error Handling

### Client-Side

```tsx
try {
  const response = await fetch("/api/paystack/initialize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({...})
  });
  
  const data = await response.json();
  
  if (!data.success) {
    alert("Error: " + data.error);
    return;
  }
  
  window.location.href = data.authorizationUrl;
} catch (error) {
  console.error("Payment error:", error);
  alert("Error processing payment");
}
```

### Server-Side

```tsx
try {
  // Validate request
  if (!email || !amount) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }
  
  // Check availability
  if (quantity > available) {
    return NextResponse.json(
      { error: "Not enough tickets" },
      { status: 400 }
    );
  }
  
  // Process payment...
} catch (error) {
  console.error("Error:", error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
```

---

## Testing Endpoints (cURL)

### Initialize Payment

```bash
curl -X POST http://localhost:3000/api/paystack/initialize \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "amount": 7500,
    "fullName": "John Doe",
    "phone": "08012345678",
    "tierId": "tier-id-here",
    "quantity": 1
  }'
```

### Verify Payment

```bash
curl -X POST http://localhost:3000/api/paystack/verify \
  -H "Content-Type: application/json" \
  -d '{"reference": "order-id-here"}'
```

### Get Tickets

```bash
curl http://localhost:3000/api/tickets
```

---

**Last Updated**: January 31, 2026
