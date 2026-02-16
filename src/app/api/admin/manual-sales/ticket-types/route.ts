import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/manual-sales/ticket-types
 * Get available ticket types for manual sales with limits
 */
export async function GET() {
    try {
        // Get all ticket prices
        const ticketPrices = await prisma.ticketPrice.findMany({
            orderBy: { ticketType: 'asc' }
        });

        // Get manual sales config
        const manualConfigs = await prisma.manualSalesConfig.findMany();
        const configMap = new Map(manualConfigs.map(c => [c.ticketType, c]));

        // Get current manual sales counts
        const manualSalesCounts = await prisma.order.groupBy({
            by: ['ticketPriceId'],
            where: {
                ticketSource: 'CASH_GATE'
            },
            _count: true
        });
        const salesCountMap = new Map(manualSalesCounts.map(s => [s.ticketPriceId, s._count]));

        // Get current on-sale prices (after presale)
        const now = new Date();

        const ticketTypes = ticketPrices.map(tp => {
            const isPresale = tp.presaleActive && new Date(tp.presaleEndDate) > now;
            const price = isPresale ? (tp.presaleSinglePrice || 0) : (tp.onsaleSinglePrice || 0);
            const config = configMap.get(tp.ticketType);
            const currentSales = salesCountMap.get(tp.id) || 0;
            const maxSales = config?.maxManualSales || 100;
            const isEnabled = config?.isEnabled !== false;
            const available = tp.totalUnits - tp.soldUnits;

            return {
                id: tp.id,
                ticketType: tp.ticketType,
                name: tp.name,
                description: tp.description,
                price,
                available,
                manualSalesAllowed: isEnabled && available > 0 && currentSales < maxSales,
                manualSalesRemaining: Math.min(maxSales - currentSales, available),
                maxManualSales: maxSales,
                currentManualSales: currentSales
            };
        });

        return NextResponse.json({
            success: true,
            ticketTypes
        });

    } catch (error) {
        console.error("Error fetching ticket types:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch ticket types",
            ticketTypes: []
        }, { status: 500 });
    }
}
