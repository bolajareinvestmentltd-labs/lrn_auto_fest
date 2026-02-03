import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Mock data for development when database is unavailable
const MOCK_STATS = {
    totalSales: 247,
    totalRevenue: 4850000,
    totalAttendees: 412,
    parkingPasses: 198,
    salesByTier: [
        { tier: "Bronze", sold: 120, revenue: 1080000, available: 380 },
        { tier: "Silver", sold: 65, revenue: 1365000, available: 135 },
        { tier: "Gold", sold: 42, revenue: 1344000, available: 58 },
        { tier: "Diamond", sold: 20, revenue: 1061000, available: 30 },
    ],
    recentOrders: [
        { id: "1", ticketId: "IAF26-GOLD-001", customerName: "Aisha Mohammed", email: "aisha@email.com", tier: "Gold", groupSize: "group2", amount: 60000, status: "COMPLETED", createdAt: "2026-01-31T14:30:00Z" },
        { id: "2", ticketId: "IAF26-SILVER-002", customerName: "Ibrahim Yusuf", email: "ibrahim@email.com", tier: "Silver", groupSize: "single", amount: 21000, status: "COMPLETED", createdAt: "2026-01-31T12:15:00Z" },
        { id: "3", ticketId: "IAF26-DIAMOND-003", customerName: "Fatima Bello", email: "fatima@email.com", tier: "Diamond", groupSize: "group2", amount: 105000, status: "COMPLETED", createdAt: "2026-01-31T10:00:00Z" },
        { id: "4", ticketId: "IAF26-BRONZE-004", customerName: "Chukwudi Okonkwo", email: "chukwudi@email.com", tier: "Bronze", groupSize: "group4", amount: 27000, status: "PENDING", createdAt: "2026-01-30T18:45:00Z" },
        { id: "5", ticketId: "IAF26-SILVER-005", customerName: "Blessing Adeyemi", email: "blessing@email.com", tier: "Silver", groupSize: "group4", amount: 78000, status: "COMPLETED", createdAt: "2026-01-30T16:20:00Z" },
    ]
};

export async function GET() {
    try {
        // Try to fetch from database
        const [orders, ticketPrices] = await Promise.all([
            prisma.order.findMany({
                where: { orderStatus: "COMPLETED" },
                include: {
                    user: { select: { firstName: true, lastName: true, email: true } },
                    tickets: true,
                    ticketPrice: true,
                },
                orderBy: { createdAt: "desc" },
                take: 50,
            }),
            prisma.ticketPrice.findMany(),
        ]);

        // Calculate stats from real data
        const totalSales = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

        // Count attendees (considering group sizes)
        let totalAttendees = 0;
        let parkingPasses = 0;

        orders.forEach(order => {
            const groupMultiplier =
                order.groupSize === "GROUP_4" ? 4 :
                    order.groupSize === "GROUP_2" ? 2 : 1;
            totalAttendees += groupMultiplier * order.quantity;
            parkingPasses += order.parkingPasses;
        });

        // Sales by tier
        const salesByTier = ticketPrices.map(price => {
            const tierOrders = orders.filter(o => o.ticketPriceId === price.id);
            const sold = tierOrders.reduce((sum, o) => sum + o.quantity, 0);
            const revenue = tierOrders.reduce((sum, o) => sum + o.totalPrice, 0);

            return {
                tier: price.name,
                sold,
                revenue,
                available: price.totalUnits - price.soldUnits,
            };
        });

        // Recent orders for table
        const recentOrders = orders.slice(0, 10).map(order => ({
            id: order.id,
            ticketId: order.orderNumber,
            customerName: order.customerName,
            email: order.customerEmail,
            tier: order.ticketPrice?.name || "Unknown",
            groupSize: order.groupSize.toLowerCase().replace("_", ""),
            amount: order.totalPrice,
            status: order.orderStatus,
            createdAt: order.createdAt.toISOString(),
        }));

        return NextResponse.json({
            success: true,
            data: {
                totalSales,
                totalRevenue,
                totalAttendees,
                parkingPasses,
                salesByTier,
                recentOrders,
            }
        });

    } catch (error) {
        console.error("Admin stats error:", error);

        // Return mock data in development mode
        if (process.env.NODE_ENV === "development") {
            return NextResponse.json({
                success: true,
                mock: true,
                data: MOCK_STATS,
            });
        }

        return NextResponse.json(
            { success: false, error: "Failed to fetch stats" },
            { status: 500 }
        );
    }
}
