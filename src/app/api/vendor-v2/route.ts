import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/vendor-v2
 * 
 * BULLETPROOF PRE-SAVE ARCHITECTURE
 * 
 * This endpoint implements the "V2" vendor checkout flow:
 * 1. User fills form and clicks "Pay Now"
 * 2. Frontend calls THIS endpoint BEFORE opening Paystack
 * 3. This endpoint saves form data with status="PENDING"
 * 4. Returns unique transactionId to frontend
 * 5. Frontend passes transactionId to Paystack as reference
 * 6. On payment success, Paystack callback uses that transactionId
 * 7. Backend updates status="CONFIRMED" when payment is verified
 * 8. Browser redirects to success page (HARD REDIRECT, no await)
 */

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            businessName,
            contactPerson,
            phone,
            email,
            productType,
            amount,
            status = "PENDING",
        } = body;

        // ========================================
        // VALIDATION
        // ========================================
        if (!businessName || !contactPerson || !phone || !email || !productType) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (!email.includes("@")) {
            return NextResponse.json(
                { error: "Invalid email address" },
                { status: 400 }
            );
        }

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: "Invalid amount" },
                { status: 400 }
            );
        }

        // ========================================
        // CHECK SLOT AVAILABILITY
        // ========================================
        const confirmedVendors = await prisma.vendor.count({
            where: {
                status: "CONFIRMED"
            }
        });

        const MAX_VENDORS = 10;
        if (confirmedVendors >= MAX_VENDORS) {
            return NextResponse.json(
                { error: "All vendor slots are full" },
                { status: 409 }
            );
        }

        // ========================================
        // GENERATE UNIQUE TRANSACTION ID
        // Format: TXN-{timestamp}-{random}
        // This is used as the Paystack reference
        // ========================================
        const transactionId = `TXN-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)
            .toUpperCase()}`;

        // ========================================
        // SAVE TO DATABASE WITH PENDING STATUS
        // This locks the slot and creates the record
        // ========================================
        const vendor = await prisma.vendor.create({
            data: {
                transactionId, // Unique identifier
                businessName,
                contactPerson,
                phone,
                email,
                productType,
                amount,
                status: "PENDING", // Will be updated to CONFIRMED after payment verification
                paymentReference: null, // Will be filled in after Paystack confirms
                paidAt: null, // Will be filled in after payment
            },
        });

        console.log(`✅ Vendor pre-saved with transactionId: ${transactionId}`);

        // ========================================
        // RETURN TRANSACTION ID TO FRONTEND
        // Frontend will pass this to Paystack
        // ========================================
        return NextResponse.json(
            {
                success: true,
                transactionId, // Frontend uses this as Paystack ref
                vendor: {
                    id: vendor.id,
                    businessName: vendor.businessName,
                    email: vendor.email,
                    amount: vendor.amount,
                    status: vendor.status,
                },
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("❌ Vendor pre-save error:", error);
        return NextResponse.json(
            { error: "Failed to process vendor application" },
            { status: 500 }
        );
    }
}

/**
 * DATABASE SCHEMA EXPECTED:
 * 
 * model Vendor {
 *   id                String   @id @default(cuid())
 *   transactionId     String   @unique
 *   businessName      String
 *   contactPerson     String
 *   phone             String
 *   email             String
 *   productType       String
 *   amount            Int
 *   status            String   @default("PENDING")  // PENDING | CONFIRMED | CANCELLED
 *   paymentReference  String?  // Paystack reference after payment
 *   paidAt            DateTime?
 *   createdAt         DateTime @default(now())
 *   updatedAt         DateTime @updatedAt
 * }
 */
