import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Mock data for development when database is unavailable
const MOCK_TICKETS = [
    {
        id: "mock-regular",
        ticketType: "REGULAR",
        name: "Regular Access",
        description: "General access to all event zones, food court, and main viewing areas",
        totalUnits: 5000,
        soldUnits: 127,
        presaleActive: true,
        presaleEndDate: new Date("2026-03-31T23:59:59Z"),
        presaleSinglePrice: 3000,
        presaleGroup2Price: null,
        presaleGroup4Price: null,
        onsaleSinglePrice: 5000,
        onsaleGroup2Price: null,
        onsaleGroup4Price: null,
        vipSeating: false,
        eventPack: false,
        merchandise: false,
        premiumExperience: null,
        priorityRide: false,
        pradoPickup: false,
        highlightVideo: 0,
        highlightPhotos: 0,
    },
    {
        id: "mock-bronze",
        ticketType: "VIP_BRONZE",
        name: "Bronze VIP",
        description: "VIP seating, event pack with refreshments, VIP wristband & parking",
        totalUnits: 80,
        soldUnits: 12,
        presaleActive: true,
        presaleEndDate: new Date("2026-03-31T23:59:59Z"),
        presaleSinglePrice: 7500,
        presaleGroup2Price: 14000,
        presaleGroup4Price: 27000,
        onsaleSinglePrice: 9000,
        onsaleGroup2Price: 17000,
        onsaleGroup4Price: 33000,
        vipSeating: true,
        eventPack: true,
        merchandise: false,
        premiumExperience: null,
        priorityRide: false,
        pradoPickup: false,
        highlightVideo: 0,
        highlightPhotos: 0,
    },
    {
        id: "mock-silver",
        ticketType: "VIP_SILVER",
        name: "Silver VIP",
        description: "All Bronze benefits + exclusive festival merchandise (top + cap)",
        totalUnits: 70,
        soldUnits: 8,
        presaleActive: true,
        presaleEndDate: new Date("2026-03-31T23:59:59Z"),
        presaleSinglePrice: 21000,
        presaleGroup2Price: 40000,
        presaleGroup4Price: 78000,
        onsaleSinglePrice: 25000,
        onsaleGroup2Price: 48000,
        onsaleGroup4Price: 92000,
        vipSeating: true,
        eventPack: true,
        merchandise: true,
        premiumExperience: null,
        priorityRide: false,
        pradoPickup: false,
        highlightVideo: 0,
        highlightPhotos: 0,
    },
    {
        id: "mock-gold",
        ticketType: "VIP_GOLD",
        name: "Gold VIP",
        description: "All Silver benefits + premium drift car OR bike ride experience with safety gear",
        totalUnits: 30,
        soldUnits: 5,
        presaleActive: true,
        presaleEndDate: new Date("2026-03-31T23:59:59Z"),
        presaleSinglePrice: 32000,
        presaleGroup2Price: 60000,
        presaleGroup4Price: null,
        onsaleSinglePrice: 38000,
        onsaleGroup2Price: 72000,
        onsaleGroup4Price: null,
        vipSeating: true,
        eventPack: true,
        merchandise: true,
        premiumExperience: "drift_car_ride",
        priorityRide: false,
        pradoPickup: false,
        highlightVideo: 0,
        highlightPhotos: 0,
    },
    {
        id: "mock-diamond",
        ticketType: "VIP_DIAMOND",
        name: "Diamond VIP",
        description: "Ultimate experience: Priority rides, Prado pickup, dedicated content creation (1 video + 5 photos)",
        totalUnits: 20,
        soldUnits: 3,
        presaleActive: true,
        presaleEndDate: new Date("2026-03-31T23:59:59Z"),
        presaleSinglePrice: 55000,
        presaleGroup2Price: 105000,
        presaleGroup4Price: null,
        onsaleSinglePrice: 60000,
        onsaleGroup2Price: 115000,
        onsaleGroup4Price: null,
        vipSeating: true,
        eventPack: true,
        merchandise: true,
        premiumExperience: "drift_car_ride",
        priorityRide: true,
        pradoPickup: true,
        highlightVideo: 1,
        highlightPhotos: 5,
    },
];

export async function GET() {
    try {
        // Check if DATABASE_URL is configured
        if (!process.env.DATABASE_URL) {
            console.log("No DATABASE_URL configured, returning mock data");
            return NextResponse.json(MOCK_TICKETS, { status: 200 });
        }

        // Fetch all ticket tiers from the database, ordered by price
        const tiers = await prisma.ticketPrice.findMany({
            orderBy: { presaleSinglePrice: 'asc' }
        });

        // If no tiers found in DB, return mock data
        if (!tiers || tiers.length === 0) {
            console.log("No tickets found in database, returning mock data");
            return NextResponse.json(MOCK_TICKETS, { status: 200 });
        }

        return NextResponse.json(tiers, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch tickets from database, using mock data:", error);

        // Always return mock data when database is unavailable
        return NextResponse.json(MOCK_TICKETS, { status: 200 });
    }
}
