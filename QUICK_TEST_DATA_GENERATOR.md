# 🎟️ QUICK TEST DATA GENERATOR

## How to Create Test Tickets for Barcode Scanner Testing

### **Method 1: Using the Test API** (Easiest)

#### **Create a Single Test Ticket:**

```bash
curl -X POST http://localhost:3000/api/test/generate-ticket \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User One",
    "customerEmail": "test1@example.com",
    "customerPhone": "08012345671",
    "ticketType": "REGULAR",
    "groupSize": "SINGLE",
    "quantity": 1
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Created 1 test ticket(s)",
  "order": {
    "id": "order-abc123",
    "customerName": "Test User One",
    "ticketType": "REGULAR",
    "groupSize": "SINGLE",
    "totalAmount": 5000,
    "parkingPasses": 1
  },
  "tickets": [
    {
      "ticketCode": "REG-XXXXX-YYYY",
      "qrCode": "QR:REG-XXXXX-YYYY",
      "id": "ticket-123"
    }
  ],
  "testInstructions": {
    "step1": "Go to: https://ilorincarshow.com/gate",
    "step2": "Enter ticket code: REG-XXXXX-YYYY",
    "step3": "Press Enter to verify",
    "step4": "Expected: GREEN ✅",
    "step5": "Try same code again",
    "step6": "Expected: RED ❌ (duplicate blocked)"
  }
}
```

---

#### **Create Multiple Test Tickets at Once:**

```bash
# Create 3 test tickets for multiple scanning scenarios
curl -X POST http://localhost:3000/api/test/generate-ticket \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User Bulk",
    "customerEmail": "testbulk@example.com",
    "customerPhone": "08012345672",
    "ticketType": "REGULAR",
    "groupSize": "SINGLE",
    "quantity": 3
  }'
```

This creates 3 separate ticket codes you can use for sequential scanning tests.

---

#### **Create VIP Test Ticket:**

```bash
curl -X POST http://localhost:3000/api/test/generate-ticket \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "VIP Test User",
    "customerEmail": "viptest@example.com",
    "customerPhone": "08012345673",
    "ticketType": "VIP",
    "groupSize": "SINGLE",
    "quantity": 1
  }'
```

---

### **Method 2: Using Postman** (GUI)

1. **Open Postman**
2. **Create New Request**
3. **Method**: POST
4. **URL**: `http://localhost:3000/api/test/generate-ticket`
5. **Headers**:
   - Key: `Content-Type`
   - Value: `application/json`
6. **Body** (Raw JSON):

```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "08012345674",
  "ticketType": "REGULAR",
  "groupSize": "SINGLE",
  "quantity": 1
}
```

7. **Click Send**
2. **View Response** → Copy ticket code

---

### **Method 3: Using Browser Console**

1. Open `/gate` page
2. Press `F12` (Developer Tools)
3. Go to **Console** tab
4. Paste this code:

```javascript
fetch('/api/test/generate-ticket', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerName: 'Browser Test User',
    customerEmail: 'browsertest@example.com',
    customerPhone: '08012345675',
    ticketType: 'REGULAR',
    groupSize: 'SINGLE',
    quantity: 1
  })
})
  .then(r => r.json())
  .then(d => {
    console.log('✅ Test ticket created!');
    console.log('Ticket Code:', d.tickets[0].ticketCode);
    alert('Ticket: ' + d.tickets[0].ticketCode + '\n\nNow scan this in the gate system!');
  })
  .catch(e => console.error('❌ Error:', e));
```

1. **Press Enter**
2. **Copy the Ticket Code** from console output
3. Use in barcode scanner test

---

## 🧪 Complete Testing Scenario

### **Test Set: Create 5 Different Tickets**

**Ticket 1: REGULAR - First Valid Scan**

```bash
curl -X POST http://localhost:3000/api/test/generate-ticket \
  -H "Content-Type: application/json" \
  -d '{"customerName":"User A","customerEmail":"a@test.com","customerPhone":"08011111111","ticketType":"REGULAR","groupSize":"SINGLE","quantity":1}'
```

Save ticket code → **Use for first gate scan (should be ✅ GREEN)**

**Ticket 2: REGULAR - Second Valid Scan**

```bash
curl -X POST http://localhost:3000/api/test/generate-ticket \
  -H "Content-Type: application/json" \
  -d '{"customerName":"User B","customerEmail":"b@test.com","customerPhone":"08022222222","ticketType":"REGULAR","groupSize":"SINGLE","quantity":1}'
```

Save ticket code → **Use for second gate scan (should be ✅ GREEN)**

**Ticket 3: VIP - VIP Ticket Test**

```bash
curl -X POST http://localhost:3000/api/test/generate-ticket \
  -H "Content-Type: application/json" \
  -d '{"customerName":"User C VIP","customerEmail":"c@test.com","customerPhone":"08033333333","ticketType":"VIP","groupSize":"GROUP_2","quantity":1}'
```

Save ticket code → **Use for VIP scan test**

**Ticket 4: GROUP SIZE TEST**

```bash
curl -X POST http://localhost:3000/api/test/generate-ticket \
  -H "Content-Type: application/json" \
  -d '{"customerName":"User D Group","customerEmail":"d@test.com","customerPhone":"08044444444","ticketType":"REGULAR","groupSize":"GROUP_4","quantity":1}'
```

Save ticket code → **Verify shows 2 parking passes**

**Ticket 5: DUPLICATE TEST (Same as Ticket 1)**

```
Take the ticket code from Ticket 1
Scan it again after first successful scan
Should show: ❌ "Already scanned"
```

---

## 🎯 Testing Workflow

### **Step 1: Generate Test Tickets**

```
1. Create Ticket 1 (REGULAR)
2. Create Ticket 2 (REGULAR)
3. Create Ticket 3 (VIP)
4. Create Ticket 4 (GROUP)
5. Note all 4 ticket codes
```

### **Step 2: Go to Gate Page**

```
Navigate to: https://ilorincarshow.com/gate
```

### **Step 3: Execute Tests**

```
TEST 1: Scan Ticket 1 → ✅ GREEN
TEST 2: Scan Ticket 2 → ✅ GREEN
TEST 3: Scan Ticket 3 (VIP) → ✅ GREEN (shows VIP details)
TEST 4: Scan Ticket 4 (Group) → ✅ GREEN (shows 2 parking)
TEST 5: Scan Ticket 1 again → ❌ RED "Already scanned"
TEST 6: Scan invalid code → ❌ RED "Not found"
```

### **Step 4: Verify Results**

```
✅ All GREEN tests show correct customer details
✅ All RED tests show appropriate error messages
✅ Dashboard stats update correctly
✅ Recent scans history populates
✅ Duplicate prevention works
✅ Each ticket type displays correctly
```

---

## 📊 Retrieve Generated Test Tickets

### **Get All Test Tickets Created:**

```bash
curl -X GET http://localhost:3000/api/test/generate-ticket
```

**Response:**

```json
{
  "success": true,
  "count": 5,
  "testTickets": [
    {
      "ticketCode": "REG-XXXXX-YYYY",
      "customerName": "Test User One",
      "ticketType": "REGULAR",
      "scanStatus": "PENDING",
      "createdAt": "2026-03-22T10:30:00Z"
    },
    // ... more tickets
  ]
}
```

---

## 📝 Documentation

### **API Request/Response Examples**

**CREATE TEST TICKET - POST**

```
Endpoint: /api/test/generate-ticket
Method: POST
Content-Type: application/json

Request Body:
{
  "customerName": "string (required)",
  "customerEmail": "string (required)",
  "customerPhone": "string (required)",
  "ticketType": "REGULAR|VIP (optional, default: REGULAR)",
  "groupSize": "SINGLE|GROUP_2|GROUP_4 (optional, default: SINGLE)",
  "quantity": "number (optional, default: 1)"
}

Response:
{
  "success": true,
  "message": "Created X test ticket(s)",
  "order": { ... },
  "tickets": [ { ticketCode, qrCode, id }, ... ],
  "testInstructions": { ... }
}
```

**RETRIEVE TEST TICKETS - GET**

```
Endpoint: /api/test/generate-ticket
Method: GET
No parameters needed

Response:
{
  "success": true,
  "count": number,
  "testTickets": [ { ticketCode, customerName, ticketType, scanStatus, createdAt }, ... ]
}
```

---

## ⚡ Quick Commands (Copy-Paste)

### **Generate 1 Quick Test Ticket:**

```bash
curl -X POST http://localhost:3000/api/test/generate-ticket -H "Content-Type: application/json" -d '{"customerName":"Quick Test","customerEmail":"quick@test.com","customerPhone":"08001234567","ticketType":"REGULAR","groupSize":"SINGLE","quantity":1}'
```

### **Generate 3 Tickets for Sequential Testing:**

```bash
curl -X POST http://localhost:3000/api/test/generate-ticket -H "Content-Type: application/json" -d '{"customerName":"Sequential Test","customerEmail":"seq@test.com","customerPhone":"08001234568","ticketType":"REGULAR","groupSize":"SINGLE","quantity":3}'
```

### **Get All Test Tickets:**

```bash
curl -X GET http://localhost:3000/api/test/generate-ticket
```

---

## 🎊 Ready to Test

1. **Generate test tickets** using one of the methods above
2. **Go to `/gate` page**
3. **Scan or enter ticket codes** in the input field
4. **Verify results** (✅ GREEN or ❌ RED)
5. **Document findings** in testing checklist

**Next**: Once barcode scanning tests pass, proceed with email & PDF testing! ✅
