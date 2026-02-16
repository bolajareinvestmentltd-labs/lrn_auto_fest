import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/manual-sales/stats
 * Get statistics for cash vs online sales
 */
export async function GET() {
    try {
        // Get total sales by source
        const onlineSales = await prisma.order.count({
            where: {
                orderStatus: 'COMPLETED',
                ticketSource: 'ONLINE'
            }
        });

        const cashSales = await prisma.order.count({
            where: {
                orderStatus: 'COMPLETED',
                ticketSource: 'CASH_GATE'
            }
        });

        // Get revenue by source
        const onlineRevenue = await prisma.order.aggregate({
            _sum: { totalPrice: true },
            where: {
                orderStatus: 'COMPLETED',
                ticketSource: 'ONLINE'
            }
        });

        const cashRevenue = await prisma.order.aggregate({
            _sum: { totalPrice: true },
            where: {
                orderStatus: 'COMPLETED',
                ticketSource: 'CASH_GATE'
            }
        });

        // Get today's cash sales
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayCashSales = await prisma.order.count({
            where: {
                orderStatus: 'COMPLETED',
                ticketSource: 'CASH_GATE',
                createdAt: { gte: today }
            }
        });

        // Get entry stats
        const totalEntries = await prisma.entryLog.count({
            where: { entryStatus: 'SUCCESS' }
        });

        const blockedEntries = await prisma.entryLog.count({
            where: {
                entryStatus: {
                    in: ['BLOCKED', 'ALREADY_USED', 'INVALID']
                }
            }
        });

        // Get entry breakdown by payment method
        const cashEntries = await prisma.entryLog.count({
            where: {
                entryStatus: 'SUCCESS',
                paymentMethod: 'CASH'
            }
        });

        const onlineEntries = await prisma.entryLog.count({
            where: {
                entryStatus: 'SUCCESS',
                paymentMethod: { not: 'CASH' }
            }
        });

        return NextResponse.json({
            success: true,
            totalOnlineSales: onlineSales,
            totalCashSales: cashSales,
            onlineRevenue: onlineRevenue._sum.totalPrice || 0,
            cashRevenue: cashRevenue._sum.totalPrice || 0,
            todayCashSales,
            totalEntries,
            blockedEntries,
            cashEntries,
            onlineEntries
        });

    } catch (error) {
        console.error("Error fetching manual sales stats:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch stats",
            totalOnlineSales: 0,
            totalCashSales: 0,
            onlineRevenue: 0,
            cashRevenue: 0,
            todayCashSales: 0
        }, { status: 500 });
    }
}
