import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type GroupSize = "SINGLE" | "GROUP_2" | "GROUP_4";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            email,
            amount,
            fullName,
            phone,
            tierId,
            quantity,
            groupSize = "SINGLE" as GroupSize,
        } = body;

        if (!email || !amount || !fullName || !phone || !tierId || !quantity) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Get ticket price info
        const ticketPrice = await prisma.ticketPrice.findUnique({
            where: { id: tierId },
        });

        if (!ticketPrice) {
            return NextResponse.json(
                { error: "Invalid ticket type" },
                { status: 404 }
            );
        }

        // Calculate people count based on group size
        const peoplePerTicket = groupSize === "SINGLE" ? 1 : groupSize === "GROUP_2" ? 2 : 4;
        const totalPeople = peoplePerTicket * quantity;

        // Check available units
        const availableUnits = ticketPrice.totalUnits - ticketPrice.soldUnits;
        if (totalPeople > availableUnits) {
            return NextResponse.json(
                {
                    error: `Only ${availableUnits} tickets available`,
                },
                { status: 400 }
            );
        }

        // Calculate parking passes: Single/Group2 = 1, Group4 = 2
        const parkingPasses = groupSize === "GROUP_4" ? 2 * quantity : 1 * quantity;

        // Create or find user
        let user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            const nameParts = fullName.split(' ');
            user = await prisma.user.create({
                data: {
                    email,
                    firstName: nameParts[0] || fullName,
                    lastName: nameParts.slice(1).join(' ') || '',
                    phone,
                },
            });
        }

        // Create order in database
        const order = await prisma.order.create({
            data: {
                orderNumber: `IAF-2026-${Date.now()}`,
                userId: user.id,
                ticketPriceId: tierId,
                quantity: totalPeople, // Store total people count
                totalPrice: amount,
                groupSize: groupSize,
                parkingPasses,
                paymentMethod: "PAYSTACK",
                paymentStatus: "PENDING",
                orderStatus: "PENDING",
                customerEmail: email,
                customerPhone: phone,
                customerName: fullName,
                expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
            },
        });

        // Initialize Paystack payment
        const paystackUrl = "https://api.paystack.co/transaction/initialize";
        const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment-confirmation`;

        const paystackResponse = await fetch(paystackUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
            body: JSON.stringify({
                email,
                amount: amount * 100, // Paystack expects amount in kobo
                reference: order.id,
                callback_url: callbackUrl,
                metadata: {
                    order_id: order.id,
                    order_number: order.orderNumber,
                    customer_name: fullName,
                    customer_phone: phone,
                    ticket_type: ticketPrice.name,
                    group_size: groupSize,
                    quantity: totalPeople,
                    parking_passes: parkingPasses,
                },
            }),
        });

        const paystackData = await paystackResponse.json();

        if (!paystackData.status) {
            // Delete the order if Paystack initialization fails
            await prisma.order.delete({
                where: { id: order.id },
            });

            console.error("Paystack API error:", paystackData);

            return NextResponse.json(
                { error: paystackData.message || "Failed to initialize payment" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            authorizationUrl: paystackData.data.authorization_url,
            accessCode: paystackData.data.access_code,
            reference: paystackData.data.reference,
            orderId: order.id,
            orderNumber: order.orderNumber,
        });
    } catch (error) {
        console.error("Paystack initialization error:", error);
        return NextResponse.json(
            {
                error: "Internal server error",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}
