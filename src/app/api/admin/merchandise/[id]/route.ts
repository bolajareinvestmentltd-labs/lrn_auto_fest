import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT - Update merchandise item
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { params } = context;
    const { id } = await params;

    try {
        const body = await request.json();
        const { name, description, price, imageUrl, totalStock, soldCount, isAvailable, merchType } = body;

        const item = await prisma.merchItem.update({
            where: { id },
            data: {
                name,
                description,
                price,
                imageUrl,
                totalStock,
                soldCount,
                isAvailable,
                merchType,
            },
        });

        return NextResponse.json({ success: true, item });
    } catch (error) {
        console.error("Failed to update merchandise:", error);
        return NextResponse.json({ success: false, error: "Failed to update item" }, { status: 500 });
    }
}

// DELETE - Delete merchandise item
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { params } = context;
    const { id } = await params;

    try {
        // Check if there are any orders for this item
        const orderCount = await prisma.merchOrder.count({
            where: { merchItemId: id },
        });

        if (orderCount > 0) {
            return NextResponse.json(
                { success: false, error: "Cannot delete item with existing orders. Deactivate it instead." },
                { status: 400 }
            );
        }

        await prisma.merchItem.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete merchandise:", error);
        return NextResponse.json({ success: false, error: "Failed to delete item" }, { status: 500 });
    }
}
