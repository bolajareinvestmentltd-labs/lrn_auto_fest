# Paystack Payment Testing Guide

## Quick Test (2 minutes)

### Test Environment

- **URL**: <http://localhost:3000>
- **Paystack Mode**: Test (No real charges)
- **Test Card**: 4084 0840 8408 4081

### Step-by-Step Test

1. **Start Dev Server** (if not running)

   ```bash
   npm run dev
   ```

   - Opens on <http://localhost:3000>

2. **Navigate to Tickets**
   - Scroll down on homepage
   - Find "Tickets" section
   - See ticket prices displayed

3. **Click "Buy Now"** on any ticket
   - Modal slides open from right
   - Shows ticket details and price

4. **Fill Checkout Form**

   ```
   Name: John Doe
   Email: test@example.com
   Phone: 08012345678
   Quantity: 2
   ```

   - Total should auto-calculate
   - All fields required before submit

5. **Click "Pay Now"**
   - Button shows "Redirecting to Paystack..."
   - Page redirects to Paystack payment page

6. **Complete Paystack Payment**

   **Payment Details Page:**
   - Email: Already filled
   - Amount: Shows calculated total

   **Card Details:**

   ```
   Card Number: 4084084084084081
   Name: Any name
   Expiry: Any future date (e.g., 12/25)
   CVV: Any 3 digits (e.g., 123)
   ```

   - Click "Pay"

   **OTP Page** (Appears after card details):

   ```
   OTP: 123456
   ```

   - Click "Verify OTP"

7. **Success Page**
   - Redirects to `/payment-confirmation?reference=<order-id>`
   - Shows "Payment Successful!" message
   - Displays Order Number: `IAF-2026-XXXXXXXXX`
   - Shows "Completed" status
   - Links to home page

### Expected Results

✅ **Order Created in Database**

```bash
# Check order was created
npx prisma studio
# → Database → Order table → Should see new record
```

✅ **TicketPrice Updated**

- `soldUnits` should increment by quantity purchased

✅ **Status Changes**

- Order: PENDING → COMPLETED
- Payment: PENDING → COMPLETED

---

## Test Scenarios

### Scenario 1: Successful Payment ✅

**Expected**: Full transaction, order completed
**Test Card**: 4084 0840 8408 4081
**Result**: Confirmation page with order number

### Scenario 2: Failed Card ❌

**Expected**: Payment declined
**Test Card**: 5555555555554444
**Result**: Payment failed, can retry

### Scenario 3: Insufficient Funds ❌

**Expected**: Transaction declined
**Test Card**: 5200828282828210
**Result**: Error message shown

### Scenario 4: Invalid Email ❌

**Expected**: Modal validation error
**Test Email**: invalidemail
**Result**: "Please enter a valid email" message

### Scenario 5: Low Quantity ❌

**Expected**: Form validation
**Test Quantity**: 0
**Result**: Can't submit, must be 1-10

---

## Database Verification

### Check Order Was Created

```bash
npx prisma studio
```

**Order Table Should Show**:

- orderNumber: IAF-2026-1234567890
- paymentStatus: COMPLETED
- orderStatus: COMPLETED
- customerEmail: <test@example.com>
- totalPrice: Correct amount

### Check Ticket Sales Updated

```bash
npx prisma studio
```

**TicketPrice Table Should Show**:

- soldUnits: Incremented by purchase quantity

---

## API Testing (Advanced)

### Test Initialize Endpoint

```bash
curl -X POST http://localhost:3000/api/paystack/initialize \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "amount": 7500,
    "fullName": "Test User",
    "phone": "08012345678",
    "tierId": "YOUR_TIER_ID",
    "quantity": 1
  }'
```

**Expected Response**:

```json
{
  "success": true,
  "authorizationUrl": "https://checkout.paystack.com/...",
  "reference": "order-id",
  "orderId": "clp..."
}
```

### Test Verify Endpoint

```bash
curl -X POST http://localhost:3000/api/paystack/verify \
  -H "Content-Type: application/json" \
  -d '{
    "reference": "your-order-id"
  }'
```

---

## Troubleshooting

### Issue: "Module not found" error

**Solution**:

- Restart dev server: `npm run dev`
- Check all files created in correct paths

### Issue: "Can't resolve '@/lib/prisma'"

**Solution**:

- Verify prisma.ts exists in src/lib/
- Check .env.local has DATABASE_URL

### Issue: Paystack page shows "Invalid public key"

**Solution**:

- Check NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY in .env.local
- Ensure it's the correct test key
- Restart dev server

### Issue: Payment processes but no confirmation

**Solution**:

- Check browser console for errors
- Verify /payment-confirmation route exists
- Check if order was created in database
- Review API response in Network tab

### Issue: Ticket quantity not updating in database

**Solution**:

- Check verify API response is successful
- Verify TicketPrice record exists
- Check Prisma migrations ran

---

## Success Indicators ✅

After complete test, you should see:

1. **On Confirmation Page**:
   - ✅ "Payment Successful!" message
   - ✅ Order number displayed
   - ✅ Status shows "Completed"
   - ✅ Return home button works

2. **In Database**:
   - ✅ Order record exists
   - ✅ paymentStatus = "COMPLETED"
   - ✅ orderStatus = "COMPLETED"
   - ✅ TicketPrice.soldUnits incremented

3. **In Logs**:
   - ✅ No errors in console
   - ✅ API calls logged

---

## Test Card Reference

| Scenario | Card Number | Status |
|----------|-------------|--------|
| Successful | 4084084084084081 | ✅ Approved |
| Visa Decline | 4000000000000002 | ❌ Declined |
| Insufficient Funds | 5200828282828210 | ❌ Declined |
| Mastercard | 5555555555554444 | ❌ Declined (test) |

**All test cards**:

- Expiry: Any future date
- CVV: Any 3 digits
- OTP: 123456

---

## Next: Production Deployment

When ready to go live:

1. Update Paystack keys to production
2. Update NEXT_PUBLIC_APP_URL to production domain
3. Test with small real transactions
4. Enable email confirmations
5. Set up payment webhooks
6. Monitor Paystack dashboard

---

**Last Updated**: January 31, 2026
