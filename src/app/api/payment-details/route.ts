import { NextRequest, NextResponse } from "next/server";

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

    if (!reference || !type) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Check mock data first
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
    // In production, verify with Paystack API
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
