import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // 1. Update Regular Tickets
        const reg = prisma.ticketPrice.updateMany({
            where: { ticketType: "REGULAR" },
            data: { 
                presaleSinglePrice: 3000, 
                onsaleSinglePrice: 5000,
                presaleGroup2Price: null,
                presaleGroup4Price: null,
                onsaleGroup2Price: null,
                onsaleGroup4Price: null
            }
        });

        // 2. Update Bronze VIP
        const bronze = prisma.ticketPrice.updateMany({
            where: { ticketType: "VIP_BRONZE" },
            data: {
                presaleSinglePrice: 7500, presaleGroup2Price: 14000, presaleGroup4Price: 27000,
                onsaleSinglePrice: 9000, onsaleGroup2Price: 17000, onsaleGroup4Price: 33000
            }
        });

        // 3. Update Silver VIP
        const silver = prisma.ticketPrice.updateMany({
            where: { ticketType: "VIP_SILVER" },
            data: {
                presaleSinglePrice: 21000, presaleGroup2Price: 40000, presaleGroup4Price: 78000,
                onsaleSinglePrice: 25000, onsaleGroup2Price: 48000, onsaleGroup4Price: 92000
            }
        });

        // 4. Update Gold VIP
        const gold = prisma.ticketPrice.updateMany({
            where: { ticketType: "VIP_GOLD" },
            data: {
                presaleSinglePrice: 32000, presaleGroup2Price: 60000, presaleGroup4Price: null,
                onsaleSinglePrice: 38000, onsaleGroup2Price: 72000, onsaleGroup4Price: null
            }
        });

        // 5. Update Diamond VIP
        const diamond = prisma.ticketPrice.updateMany({
            where: { ticketType: "VIP_DIAMOND" },
            data: {
                presaleSinglePrice: 55000, presaleGroup2Price: 105000, presaleGroup4Price: null,
                onsaleSinglePrice: 60000, onsaleGroup2Price: 115000, onsaleGroup4Price: null
            }
        });

        // Execute all updates simultaneously
        await prisma.$transaction([reg, bronze, silver, gold, diamond]);

        return NextResponse.json({
            success: true,
            message: "MISSION ACCOMPLISHED: All ticket prices have been perfectly synced with your master rules!"
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
