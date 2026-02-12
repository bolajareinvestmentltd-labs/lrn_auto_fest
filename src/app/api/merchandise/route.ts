import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Mock merchandise data for when database is unavailable
const MOCK_MERCHANDISE = [
    {
        id: "merch-cap",
        merchType: "CAP",
        name: "IAF 2026 Cap",
        description: "Premium quality cap with embroidered IAF logo. Adjustable strap for perfect fit.",
        price: 5000,
        imageUrl: "/images/merch/cap.jpg",
        totalStock: 100,
        soldCount: 0,
        isAvailable: true,
    },
    {
        id: "merch-short-sleeve",
        merchType: "SHORT_SLEEVE",
        name: "Short Sleeve T-Shirt",
        description: "Comfortable cotton blend t-shirt with bold IAF 2026 graphic print. Available in multiple sizes.",
        price: 15000,
        imageUrl: "/images/merch/short-sleeve.jpg",
        totalStock: 100,
        soldCount: 0,
        isAvailable: true,
    },
    {
        id: "merch-long-sleeve",
        merchType: "LONG_SLEEVE",
        name: "Long Sleeve T-Shirt",
        description: "Premium long sleeve shirt with exclusive festival artwork. Perfect for cooler evenings.",
        price: 22000,
        imageUrl: "/images/merch/long-sleeve.jpg",
        totalStock: 100,
        soldCount: 0,
        isAvailable: true,
    },
];

export async function GET() {
    try {
        if (!process.env.DATABASE_URL) {
            return NextResponse.json(MOCK_MERCHANDISE, { status: 200 });
        }

        const items = await prisma.merchItem.findMany({
            where: { isAvailable: true },
            orderBy: { price: 'asc' }
        });

        if (!items || items.length === 0) {
            return NextResponse.json(MOCK_MERCHANDISE, { status: 200 });
        }

        return NextResponse.json(items, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch merchandise:", error);
        return NextResponse.json(MOCK_MERCHANDISE, { status: 200 });
    }
}
