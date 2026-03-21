import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch single ticket
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { params } = context;
    const { id } = await params;

    try {
        const ticket = await prisma.ticketPrice.findUnique({
            where: { id },
        });

        if (!ticket) {
            return NextResponse.json({ success: false, error: "Ticket not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, ticket });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch ticket" }, { status: 500 });
    }
}

// PUT - Update ticket
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { params } = context;
    const { id } = await params;

    try {
        const body = await request.json();
        const {
            ticketType,
            name,
            description,
            totalUnits,
            soldUnits,
            presaleActive,
            presaleEndDate,
            presaleSinglePrice,
            presaleGroup2Price,
            presaleGroup4Price,
            onsaleSinglePrice,
            onsaleGroup2Price,
            onsaleGroup4Price,
            vipSeating,
            eventPack,
            merchandise,
            premiumExperience,
            priorityRide,
            pradoPickup,
            highlightVideo,
            highlightPhotos,
        } = body;

        const existingTicket = await prisma.ticketPrice.findUnique({
            where: { id },
        });

        if (!existingTicket) {
            return NextResponse.json({ success: false, error: "Ticket not found" }, { status: 404 });
        }

        const ticket = await prisma.ticketPrice.update({
            where: { id },
            data: {
                ticketType: ticketType || existingTicket.ticketType,
                name,
                description,
                totalUnits,
                soldUnits,
                presaleActive,
                presaleEndDate: presaleEndDate ? new Date(presaleEndDate) : existingTicket.presaleEndDate,
                presaleSinglePrice,
                presaleGroup2Price,
                presaleGroup4Price,
                onsaleSinglePrice,
                onsaleGroup2Price,
                onsaleGroup4Price,
                vipSeating,
                eventPack,
                merchandise,
                premiumExperience,
                priorityRide,
                pradoPickup,
                highlightVideo,
                highlightPhotos,
            },
        });

        return NextResponse.json({ success: true, ticket });
    } catch (error) {
        console.error("Failed to update ticket:", error);
        return NextResponse.json({ success: false, error: "Failed to update ticket" }, { status: 500 });
    }
}

// DELETE - Delete ticket
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { params } = context;
    const { id } = await params;

    try {
        // Check if there are any orders for this ticket
        const orderCount = await prisma.order.count({
            where: { ticketPriceId: id },
        });

        if (orderCount > 0) {
            return NextResponse.json(
                { success: false, error: "Cannot delete ticket with existing orders. Deactivate it instead." },
                { status: 400 }
            );
        }

        await prisma.ticketPrice.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete ticket:", error);
        return NextResponse.json({ success: false, error: "Failed to delete ticket" }, { status: 500 });
    }
}
