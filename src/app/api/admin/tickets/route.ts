import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all ticket types
export async function GET() {
    try {
        const tickets = await prisma.ticketType.findMany({
            orderBy: { price: "asc" },
        });

        return NextResponse.json({
            success: true,
            tickets: tickets.map((t) => ({
                id: t.id,
                name: t.name,
                description: t.description || "",
                price: t.price,
                originalPrice: t.originalPrice || t.price,
                available: t.available,
                totalQuantity: t.totalQuantity,
                features: t.features || [],
                color: t.color || "#FF6B00",
                isActive: t.isActive,
            })),
        });
    } catch (error) {
        console.error("Failed to fetch tickets:", error);
        // Return mock data if database unavailable
        return NextResponse.json({
            success: true,
            tickets: [
                {
                    id: "bronze",
                    name: "Bronze",
                    description: "Standard entry pass",
                    price: 9000,
                    originalPrice: 12000,
                    available: 500,
                    totalQuantity: 500,
                    features: ["General Admission", "Access to Displays"],
                    color: "#CD7F32",
                    isActive: true,
                },
                {
                    id: "silver",
                    name: "Silver",
                    description: "Enhanced experience",
                    price: 21000,
                    originalPrice: 28000,
                    available: 200,
                    totalQuantity: 200,
                    features: ["Priority Entry", "Exclusive Area Access", "Event T-Shirt"],
                    color: "#C0C0C0",
                    isActive: true,
                },
                {
                    id: "gold",
                    name: "Gold",
                    description: "Premium experience",
                    price: 32000,
                    originalPrice: 42000,
                    available: 100,
                    totalQuantity: 100,
                    features: ["VIP Entry", "VIP Lounge", "Complimentary Drinks", "Meet & Greet"],
                    color: "#FFD700",
                    isActive: true,
                },
                {
                    id: "diamond",
                    name: "Diamond",
                    description: "Ultimate VIP",
                    price: 53000,
                    originalPrice: 70000,
                    available: 50,
                    totalQuantity: 50,
                    features: ["All Gold Perks", "Private Viewing", "Luxury Gift Bag", "Dinner with Sponsors"],
                    color: "#B9F2FF",
                    isActive: true,
                },
            ],
        });
    }
}

// POST - Create new ticket type
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, price, originalPrice, available, totalQuantity, features, color, isActive } = body;

        if (!name || !price) {
            return NextResponse.json({ success: false, error: "Name and price are required" }, { status: 400 });
        }

        const ticket = await prisma.ticketType.create({
            data: {
                name,
                description: description || "",
                price,
                originalPrice: originalPrice || price,
                available: available || 100,
                totalQuantity: totalQuantity || available || 100,
                features: features || [],
                color: color || "#FF6B00",
                isActive: isActive !== false,
            },
        });

        return NextResponse.json({ success: true, ticket });
    } catch (error) {
        console.error("Failed to create ticket:", error);
        return NextResponse.json({ success: false, error: "Failed to create ticket" }, { status: 500 });
    }
}
