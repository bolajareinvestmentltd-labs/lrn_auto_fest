import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // <-- ADDED PRISMA

// In a real application, you would fetch this from your database
// For now, we'll use mock data that matches the Paystack metadata
interface PaymentRecord {
    id: string;
    reference: string;
    email: string;
    amount: number;
    type: string;
    customerName: string;
    ticketType?: string;
    quantity?: number;
    parkingSlots?: number;
    vipSeats?: number;
}

// Mock database - in production, use actual database
const paymentRecords: Record<string, PaymentRecord> = {};

export async function GET(request: NextRequest) {
    try {
        const reference = request.nextUrl.searchParams.get("reference");
        const type = request.nextUrl.searchParams.get("type");

        if (!reference) {
            return NextResponse.json(
                { error: "Missing required parameters" },
                { status: 400 }
            );
        }

        // --- THE MAGIC UPGRADE: CHECK NEON DATABASE FIRST ---
        try {
            // Find the real order and INCLUDE the tickets to get the ICS code
            const realOrder = await prisma.order.findUnique({
                where: { paymentReference: reference },
                include: { 
                    tickets: true,
                    ticketPrice: true 
                }
            });

            if (realOrder) {
                return NextResponse.json({
                    // Send the real ICS ticket code as the ID
                    id: realOrder.tickets[0]?.ticketCode || realOrder.orderNumber,
                    reference: realOrder.paymentReference,
                    customerName: realOrder.customerName,
                    email: realOrder.customerEmail,
                    ticketType: realOrder.ticketPrice?.ticketType || type,
                    quantity: realOrder.groupSize === 'group4' ? 4 : realOrder.groupSize === 'group2' ? 2 : 1,
                    total: realOrder.totalAmount,
                    parkingSlots: realOrder.parkingPasses || 0,
                    vipSeats: 0,
                    // Send the full tickets array for the success page QR code
                    tickets: realOrder.tickets 
                });
            }
        } catch (dbError) {
            console.error("Database search failed, falling back to mock data:", dbError);
        }
        // --- END MAGIC UPGRADE ---


        // Check mock data if database fails
        const record = paymentRecords[reference];

        if (record) {
            return NextResponse.json({
                id: record.id,
                reference: record.reference,
                customerName: record.customerName,
                email: record.email,
                ticketType: record.ticketType || type,
                quantity: record.quantity || 1,
                total: record.amount,
                parkingSlots: record.parkingSlots || 1,
                vipSeats: record.vipSeats || 0,
            });
        }

        // If not found in mock data, generate from reference
        return NextResponse.json({
            id: `TICKET-${Date.now()}`,
            reference,
            customerName: "Guest",
            email: "guest@example.com",
            ticketType: type,
            quantity: 1,
            total: 0,
            parkingSlots: 1,
            vipSeats: 0,
        });
    } catch (error) {
        console.error("Error fetching payment details:", error);
        return NextResponse.json(
            { error: "Failed to fetch payment details" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Store payment record
        const record: PaymentRecord = {
            id: `TICKET-${Date.now()}`,
            reference: body.reference,
            email: body.email,
            amount: body.amount,
            type: body.type,
            customerName: body.customerName,
            ticketType: body.ticketType,
            quantity: body.quantity,
            parkingSlots: body.parkingSlots,
            vipSeats: body.vipSeats,
        };

        paymentRecords[body.reference] = record;

        return NextResponse.json({ success: true, id: record.id });
    } catch (error) {
        console.error("Error storing payment details:", error);
        return NextResponse.json(
            { error: "Failed to store payment details" },
            { status: 500 }
        );
    }
}
