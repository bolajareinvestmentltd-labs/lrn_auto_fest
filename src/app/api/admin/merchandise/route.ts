import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all merchandise items
export async function GET() {
    try {
        const items = await prisma.merchItem.findMany({
            orderBy: { price: "asc" },
        });

        return NextResponse.json({
            success: true,
            items: items.map((item) => ({
                id: item.id,
                name: item.name,
                description: item.description || "",
                price: item.price,
                imageUrl: item.imageUrl || "/images/merch/placeholder.jpg",
                stock: item.stock,
                isActive: item.isActive,
                type: item.type,
            })),
        });
    } catch (error) {
        console.error("Failed to fetch merchandise:", error);
        return NextResponse.json({
            success: true,
            items: [
                {
                    id: "cap",
                    name: "IAF 2026 Cap",
                    description: "Premium quality cap with embroidered IAF logo",
                    price: 5000,
                    imageUrl: "/images/merch/cap.jpg",
                    stock: 100,
                    isActive: true,
                    type: "CAP",
                },
                {
                    id: "short-sleeve",
                    name: "Short Sleeve T-Shirt",
                    description: "Comfortable cotton blend t-shirt",
                    price: 15000,
                    imageUrl: "/images/merch/short-sleeve.jpg",
                    stock: 100,
                    isActive: true,
                    type: "SHORT_SLEEVE",
                },
                {
                    id: "long-sleeve",
                    name: "Long Sleeve T-Shirt",
                    description: "Premium long sleeve shirt",
                    price: 22000,
                    imageUrl: "/images/merch/long-sleeve.jpg",
                    stock: 100,
                    isActive: true,
                    type: "LONG_SLEEVE",
                },
            ],
        });
    }
}

// POST - Create new merchandise item
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, price, imageUrl, stock, isActive, type } = body;

        if (!name || !price) {
            return NextResponse.json({ success: false, error: "Name and price are required" }, { status: 400 });
        }

        const item = await prisma.merchItem.create({
            data: {
                name,
                description: description || "",
                price,
                imageUrl: imageUrl || "/images/merch/placeholder.jpg",
                stock: stock || 100,
                isActive: isActive !== false,
                type: type || "OTHER",
            },
        });

        return NextResponse.json({ success: true, item });
    } catch (error) {
        console.error("Failed to create merchandise:", error);
        return NextResponse.json({ success: false, error: "Failed to create item" }, { status: 500 });
    }
}
