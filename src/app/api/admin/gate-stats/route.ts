import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Get total tickets sold (completed orders)
        const totalTickets = await prisma.ticketOrder.count({
            where: {
                order: {
                    orderStatus: 'COMPLETED'
                }
            }
        });

        // Get scanned tickets count
        const scannedTickets = await prisma.ticketOrder.count({
            where: {
                scanStatus: 'SCANNED'
            }
        });

        // Get total parking passes
        const parkingResult = await prisma.order.aggregate({
            _sum: {
                parkingPasses: true
            },
            where: {
                orderStatus: 'COMPLETED'
            }
        });

        // Get VIP ticket breakdown by counting tickets per price tier
        const recentScans = await prisma.ticketOrder.findMany({
            where: {
                scanStatus: 'SCANNED'
            },
            take: 10,
            orderBy: {
                scannedAt: 'desc'
            },
            include: {
                order: {
                    include: {
                        ticketPrice: true
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            stats: {
                totalTickets,
                scannedTickets,
                remainingTickets: totalTickets - scannedTickets,
                totalParkingPasses: parkingResult._sum.parkingPasses || 0,
                scanPercentage: totalTickets > 0
                    ? Math.round((scannedTickets / totalTickets) * 100)
                    : 0
            },
            hourlyData: {},
            recentScans: recentScans.map(scan => ({
                ticketCode: scan.ticketCode,
                customerName: scan.order.customerName,
                tier: scan.order.ticketPrice?.ticketType,
                scannedAt: scan.scannedAt?.toISOString()
            }))
        });

    } catch (error) {
        console.error("Gate stats error:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch gate statistics"
        }, { status: 500 });
    }
}
