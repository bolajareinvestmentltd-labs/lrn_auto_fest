# 🗃️ NEON DATABASE SETUP - Complete Guide

## Overview

This guide will help you set up your Neon PostgreSQL database for the IAF 2026 website.

---

## 📋 STEP 1: Create a Neon Account & Database

### 1.1 Sign Up for Neon

1. Go to [https://neon.tech](https://neon.tech)
2. Click **"Sign Up"** (you can use GitHub, Google, or email)
3. Verify your email if required

### 1.2 Create a New Project

1. After login, click **"Create a project"**
2. Configure your project:
   - **Project name:** `iaf-2026`
   - **Database name:** `iaf_database`
   - **Region:** Choose closest to Nigeria (e.g., `Frankfurt` or `London`)
   - **PostgreSQL version:** 16 (latest)
3. Click **"Create project"**

### 1.3 Get Your Connection String

1. After project creation, you'll see your **Connection Details**
2. Copy the **Connection string** - it looks like:

   ```
   postgresql://username:password@ep-xxxxx.eu-central-1.aws.neon.tech/iaf_database?sslmode=require
   ```

3. **IMPORTANT:** Save this securely!

---

## 📋 STEP 2: Configure Your Project

### 2.1 Update .env.local

Open `C:\Users\HP-PC\Desktop\LRN_AUTO_FESTIVAL\.env.local` and add/update:

```env
# ==============================================
# DATABASE (NEON POSTGRES)
# ==============================================
DATABASE_URL="postgresql://username:password@ep-xxxxx.eu-central-1.aws.neon.tech/iaf_database?sslmode=require"

# ==============================================
# PAYSTACK PAYMENT GATEWAY
# ==============================================
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxx

# ==============================================
# EMAIL (RESEND)
# ==============================================
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxx

# ==============================================
# APP CONFIG
# ==============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

Replace:

- `username:password@ep-xxxxx...` with your actual Neon connection string
- `pk_test_xxx` with your Paystack public key
- `sk_test_xxx` with your Paystack secret key
- `re_xxx` with your Resend API key

---

## 📋 STEP 3: Push Database Schema (Prisma)

### 3.1 Generate Prisma Client

Open your terminal in the project folder and run:

```powershell
cd "C:\Users\HP-PC\Desktop\LRN_AUTO_FESTIVAL"

# Install dependencies (if not done)
npm install

# Generate Prisma Client
npx prisma generate
```

### 3.2 Push Schema to Neon Database

This command creates all tables in your Neon database:

```powershell
npx prisma db push
```

You should see output like:

```
🚀  Your database is now in sync with your Prisma schema.
```

### 3.3 Verify Tables Were Created

Open Prisma Studio to view your database:

```powershell
npx prisma studio
```

This opens a web interface at `http://localhost:5555` where you can see all tables.

---

## 📋 STEP 4: Seed Initial Data

### 4.1 Run the Seed Script

The project has a seed script that populates ticket tiers:

```powershell
npx prisma db seed
```

### 4.2 What Gets Seeded

The seed script creates:

- ✅ 5 Ticket Tiers (Regular, Bronze, Silver, Gold, Diamond)
- ✅ Event Configuration
- ✅ Admin User (if configured)

---

## 📋 STEP 5: Alternative - Direct SQL Commands

If you prefer to run SQL directly in Neon's SQL Editor:

### 5.1 Open Neon SQL Editor

1. Go to your Neon dashboard
2. Click on your project
3. Click **"SQL Editor"** in the sidebar

### 5.2 Run These SQL Commands

Copy and paste this **COMPLETE SQL SCRIPT** into the SQL Editor and click **Run**:

```sql
-- ============================================
-- IAF 2026 DATABASE SETUP - COMPLETE SQL
-- Run this in Neon SQL Editor
-- ============================================

-- Create ENUM types first
CREATE TYPE "TicketType" AS ENUM ('REGULAR', 'VIP_BRONZE', 'VIP_SILVER', 'VIP_GOLD', 'VIP_DIAMOND');
CREATE TYPE "GroupSize" AS ENUM ('SINGLE', 'GROUP_2', 'GROUP_4');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED');
CREATE TYPE "PaymentMethod" AS ENUM ('PAYSTACK', 'FLUTTERWAVE', 'OPAY', 'BANK_TRANSFER');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
CREATE TYPE "VendorStatus" AS ENUM ('PENDING_PAYMENT', 'CONFIRMED', 'SETUP_COMPLETE', 'CANCELLED');
CREATE TYPE "ScanStatus" AS ENUM ('PENDING', 'SCANNED', 'USED');

-- ============================================
-- USER TABLE
-- ============================================
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "email" TEXT NOT NULL UNIQUE,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "phoneCountry" TEXT NOT NULL DEFAULT '+234',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "User_email_idx" ON "User"("email");

-- ============================================
-- TICKET PRICING TABLE
-- ============================================
CREATE TABLE "TicketPrice" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "ticketType" "TicketType" NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "totalUnits" INTEGER NOT NULL,
    "soldUnits" INTEGER NOT NULL DEFAULT 0,
    "presaleActive" BOOLEAN NOT NULL DEFAULT true,
    "presaleEndDate" TIMESTAMP(3) NOT NULL DEFAULT '2026-03-31T23:59:59Z',
    "presaleSinglePrice" INTEGER,
    "presaleGroup2Price" INTEGER,
    "presaleGroup4Price" INTEGER,
    "onsaleSinglePrice" INTEGER,
    "onsaleGroup2Price" INTEGER,
    "onsaleGroup4Price" INTEGER,
    "vipSeating" BOOLEAN NOT NULL DEFAULT false,
    "eventPack" BOOLEAN NOT NULL DEFAULT false,
    "merchandise" BOOLEAN NOT NULL DEFAULT false,
    "premiumExperience" TEXT,
    "priorityRide" BOOLEAN NOT NULL DEFAULT false,
    "pradoPickup" BOOLEAN NOT NULL DEFAULT false,
    "highlightVideo" INTEGER NOT NULL DEFAULT 0,
    "highlightPhotos" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "TicketPrice_ticketType_idx" ON "TicketPrice"("ticketType");

-- ============================================
-- ORDER TABLE
-- ============================================
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "orderNumber" TEXT NOT NULL UNIQUE,
    "userId" TEXT NOT NULL,
    "ticketPriceId" TEXT NOT NULL,
    "groupSize" "GroupSize" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "parkingPasses" INTEGER NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentRefId" TEXT,
    "paidAt" TIMESTAMP(3),
    "orderStatus" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    FOREIGN KEY ("ticketPriceId") REFERENCES "TicketPrice"("id")
);
CREATE INDEX "Order_userId_idx" ON "Order"("userId");
CREATE INDEX "Order_orderNumber_idx" ON "Order"("orderNumber");
CREATE INDEX "Order_paymentStatus_idx" ON "Order"("paymentStatus");
CREATE INDEX "Order_orderStatus_idx" ON "Order"("orderStatus");

-- ============================================
-- TICKET ORDER (Individual Tickets)
-- ============================================
CREATE TABLE "TicketOrder" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "orderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ticketCode" TEXT NOT NULL UNIQUE,
    "qrCode" TEXT NOT NULL UNIQUE,
    "qrCodeUrl" TEXT,
    "parkingPass1" TEXT,
    "parkingPass2" TEXT,
    "scanStatus" "ScanStatus" NOT NULL DEFAULT 'PENDING',
    "scannedAt" TIMESTAMP(3),
    "scannedBy" TEXT,
    "entryLocation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);
CREATE INDEX "TicketOrder_orderId_idx" ON "TicketOrder"("orderId");
CREATE INDEX "TicketOrder_ticketCode_idx" ON "TicketOrder"("ticketCode");
CREATE INDEX "TicketOrder_qrCode_idx" ON "TicketOrder"("qrCode");
CREATE INDEX "TicketOrder_userId_idx" ON "TicketOrder"("userId");
CREATE INDEX "TicketOrder_scanStatus_idx" ON "TicketOrder"("scanStatus");

-- ============================================
-- TICKET INVENTORY LOG
-- ============================================
CREATE TABLE "TicketInventoryLog" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "ticketPriceId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "previousUnits" INTEGER NOT NULL,
    "newUnits" INTEGER NOT NULL,
    "orderId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "TicketInventoryLog_ticketPriceId_idx" ON "TicketInventoryLog"("ticketPriceId");
CREATE INDEX "TicketInventoryLog_createdAt_idx" ON "TicketInventoryLog"("createdAt");

-- ============================================
-- PAYMENT WEBHOOKS
-- ============================================
CREATE TABLE "PaymentWebhook" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "orderId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "webhookData" JSONB NOT NULL,
    "reference" TEXT,
    "isProcessed" BOOLEAN NOT NULL DEFAULT false,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE
);
CREATE INDEX "PaymentWebhook_orderId_idx" ON "PaymentWebhook"("orderId");
CREATE INDEX "PaymentWebhook_reference_idx" ON "PaymentWebhook"("reference");
CREATE INDEX "PaymentWebhook_isProcessed_idx" ON "PaymentWebhook"("isProcessed");

-- ============================================
-- VENDOR TABLE
-- ============================================
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "ticketId" TEXT NOT NULL UNIQUE,
    "userId" TEXT,
    "businessName" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "phone" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "productDescription" TEXT,
    "boothType" TEXT NOT NULL,
    "bookingFee" INTEGER NOT NULL DEFAULT 100000,
    "status" "VendorStatus" NOT NULL DEFAULT 'CONFIRMED',
    "paymentRefId" TEXT,
    "paidAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "businessLicense" TEXT,
    "insuranceDoc" TEXT,
    "vendorGuideDownloaded" BOOLEAN NOT NULL DEFAULT false,
    "receipt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL
);
CREATE INDEX "Vendor_userId_idx" ON "Vendor"("userId");
CREATE INDEX "Vendor_status_idx" ON "Vendor"("status");
CREATE INDEX "Vendor_email_idx" ON "Vendor"("email");

-- ============================================
-- EVENT CONFIG
-- ============================================
CREATE TABLE "EventConfig" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "eventName" TEXT NOT NULL DEFAULT 'Ilorin Automotive Festival 2026',
    "eventDate" TIMESTAMP(3) NOT NULL DEFAULT '2026-05-30T00:00:00Z',
    "eventLocation" TEXT NOT NULL DEFAULT 'Metropolitan Square, Asadam Road, Ilorin, Nigeria',
    "presaleEndDate" TIMESTAMP(3) NOT NULL DEFAULT '2026-03-31T23:59:59Z',
    "onSaleStartDate" TIMESTAMP(3) NOT NULL DEFAULT '2026-04-01T00:00:00Z',
    "maxVendors" INTEGER NOT NULL DEFAULT 20,
    "vendorBookingFee" INTEGER NOT NULL DEFAULT 100000,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ADMIN USERS
-- ============================================
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "email" TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'viewer',
    "lastLogin" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "AdminUser_email_idx" ON "AdminUser"("email");

-- ============================================
-- AUDIT LOG
-- ============================================
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "userId" TEXT,
    "changes" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- ============================================
-- INSERT TICKET TIERS (SEED DATA)
-- ============================================
INSERT INTO "TicketPrice" (
    "ticketType", "name", "description", "totalUnits",
    "presaleSinglePrice", "presaleGroup2Price", "presaleGroup4Price",
    "onsaleSinglePrice", "onsaleGroup2Price", "onsaleGroup4Price",
    "vipSeating", "eventPack", "merchandise", "premiumExperience", 
    "priorityRide", "pradoPickup", "highlightVideo", "highlightPhotos"
) VALUES 
(
    'REGULAR', 'Regular Access', 
    'General access to all event zones, food court, and main viewing areas',
    5000, 3000, NULL, NULL, 5000, NULL, NULL,
    false, false, false, NULL, false, false, 0, 0
),
(
    'VIP_BRONZE', 'Bronze VIP',
    'VIP seating, event pack with refreshments, VIP wristband & parking',
    80, 7500, 14000, 27000, 9000, 17000, 33000,
    true, true, false, NULL, false, false, 0, 0
),
(
    'VIP_SILVER', 'Silver VIP',
    'All Bronze benefits + exclusive festival merchandise (top + cap)',
    70, 21000, 40000, 78000, 25000, 48000, 92000,
    true, true, true, NULL, false, false, 0, 0
),
(
    'VIP_GOLD', 'Gold VIP',
    'All Silver benefits + premium drift car OR bike ride experience with safety gear',
    30, 32000, 60000, NULL, 38000, 72000, NULL,
    true, true, true, 'drift_car_ride', false, false, 0, 0
),
(
    'VIP_DIAMOND', 'Diamond VIP',
    'Ultimate experience: Priority rides, Prado pickup, dedicated content creation (1 video + 5 photos)',
    20, 55000, 105000, NULL, 60000, 115000, NULL,
    true, true, true, 'drift_car_ride', true, true, 1, 5
);

-- Insert Event Configuration
INSERT INTO "EventConfig" (
    "eventName", "eventDate", "eventLocation", 
    "presaleEndDate", "onSaleStartDate", 
    "maxVendors", "vendorBookingFee"
) VALUES (
    'Ilorin Automotive Festival 2026',
    '2026-05-30T00:00:00Z',
    'Metropolitan Square, Asadam Road, Ilorin, Nigeria',
    '2026-03-31T23:59:59Z',
    '2026-04-01T00:00:00Z',
    20, 100000
);

-- ============================================
-- DONE! Your database is ready.
-- ============================================
```

---

## 📋 STEP 6: Verify Setup

### 6.1 Test the Connection

After setup, restart your dev server:

```powershell
cd "C:\Users\HP-PC\Desktop\LRN_AUTO_FESTIVAL"
npm run dev
```

### 6.2 Check Tickets Page

1. Open [http://localhost:3000/tickets](http://localhost:3000/tickets)
2. You should see all ticket tiers loading from the database

### 6.3 Check Prisma Studio

```powershell
npx prisma studio
```

This opens at `http://localhost:5555` - you can view/edit all tables.

---

## 🔧 Troubleshooting

### Error: "Can't reach database server"

- Check your DATABASE_URL in `.env.local`
- Make sure it has `?sslmode=require` at the end
- Verify your Neon project is active

### Error: "Table doesn't exist"

Run the schema push again:

```powershell
npx prisma db push --force-reset
npx prisma db seed
```

### Error: "ENUM type already exists"

If running SQL manually after Prisma, types may already exist. You can drop them:

```sql
DROP TYPE IF EXISTS "TicketType" CASCADE;
-- (repeat for other types)
```

Then run the SQL script again.

---

## 📱 Quick Reference Commands

```powershell
# Generate Prisma Client (after schema changes)
npx prisma generate

# Push schema to database
npx prisma db push

# Seed initial data
npx prisma db seed

# Open Prisma Studio (visual database editor)
npx prisma studio

# Reset database (WARNING: deletes all data!)
npx prisma db push --force-reset

# Check database status
npx prisma db pull
```

---

## ✅ Setup Complete

Your Neon database is now configured with:

- ✅ All tables created
- ✅ Ticket tiers seeded (Regular, Bronze, Silver, Gold, Diamond)
- ✅ Event configuration set
- ✅ Ready for orders!

**Next Steps:**

1. Configure Paystack (get API keys from [paystack.com](https://paystack.com))
2. Configure Resend email (get API key from [resend.com](https://resend.com))
3. Add your gallery images to `/public/images/gallery/`
4. Add your hero video to `/public/videos/`
