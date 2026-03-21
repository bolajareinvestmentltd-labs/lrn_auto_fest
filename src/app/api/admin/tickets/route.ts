import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all ticket types
export async function GET() {
    try {
        const tickets = await prisma.ticketPrice.findMany({
            orderBy: { presaleSinglePrice: "asc" },
        });

        return NextResponse.json({
            success: true,
            tickets: tickets.map((t) => ({
                id: t.id,
                ticketType: t.ticketType,
                name: t.name,
                description: t.description || "",
                presaleSinglePrice: t.presaleSinglePrice,
                presaleGroup2Price: t.presaleGroup2Price,
                presaleGroup4Price: t.presaleGroup4Price,
                onsaleSinglePrice: t.onsaleSinglePrice,
                onsaleGroup2Price: t.onsaleGroup2Price,
                onsaleGroup4Price: t.onsaleGroup4Price,
                totalUnits: t.totalUnits,
                soldUnits: t.soldUnits,
                presaleActive: t.presaleActive,
                vipSeating: t.vipSeating,
                eventPack: t.eventPack,
                merchandise: t.merchandise,
                premiumExperience: t.premiumExperience,
                priorityRide: t.priorityRide,
                pradoPickup: t.pradoPickup,
                highlightVideo: t.highlightVideo,
                highlightPhotos: t.highlightPhotos,
                isAvailable: t.presaleActive,
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

        if (!name || !presaleSinglePrice) {
            return NextResponse.json({ success: false, error: "Name and presaleSinglePrice are required" }, { status: 400 });
        }

        const ticket = await prisma.ticketPrice.create({
            data: {
                ticketType: ticketType || "REGULAR",
                name,
                description: description || "",
                totalUnits: totalUnits || 100,
                soldUnits: soldUnits || 0,
                presaleActive: presaleActive !== false,
                presaleEndDate: presaleEndDate ? new Date(presaleEndDate) : new Date("2026-03-31T23:59:59Z"),
                presaleSinglePrice: presaleSinglePrice || 3000,
                presaleGroup2Price: presaleGroup2Price || null,
                presaleGroup4Price: presaleGroup4Price || null,
                onsaleSinglePrice: onsaleSinglePrice || null,
                onsaleGroup2Price: onsaleGroup2Price || null,
                onsaleGroup4Price: onsaleGroup4Price || null,
                vipSeating: vipSeating === true,
                eventPack: eventPack === true,
                merchandise: merchandise === true,
                premiumExperience: premiumExperience || null,
                priorityRide: priorityRide === true,
                pradoPickup: pradoPickup === true,
                highlightVideo: highlightVideo || 0,
                highlightPhotos: highlightPhotos || 0,
            },
        });

        return NextResponse.json({ success: true, ticket });
    } catch (error) {
        console.error("Failed to create ticket:", error);
        return NextResponse.json({ success: false, error: "Failed to create ticket" }, { status: 500 });
    }
}
