import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch single ticket
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const ticket = await prisma.ticketType.findUnique({
            where: { id: params.id },
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
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { name, description, price, originalPrice, available, totalQuantity, features, color, isActive } = body;

        const ticket = await prisma.ticketType.update({
            where: { id: params.id },
            data: {
                name,
                description,
                price,
                originalPrice,
                available,
                totalQuantity,
                features,
                color,
                isActive,
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
    { params }: { params: { id: string } }
) {
    try {
        // Check if there are any orders for this ticket
        const orderCount = await prisma.order.count({
            where: { ticketTypeId: params.id },
        });

        if (orderCount > 0) {
            return NextResponse.json(
                { success: false, error: "Cannot delete ticket with existing orders. Deactivate it instead." },
                { status: 400 }
            );
        }

        await prisma.ticketType.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete ticket:", error);
        return NextResponse.json({ success: false, error: "Failed to delete ticket" }, { status: 500 });
    }
}
