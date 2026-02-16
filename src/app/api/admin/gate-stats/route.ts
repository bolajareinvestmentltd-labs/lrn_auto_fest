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

        // Cash vs Online breakdown
        const onlineTickets = await prisma.ticketOrder.count({
            where: {
                order: {
                    orderStatus: 'COMPLETED',
                    ticketSource: 'ONLINE'
                }
            }
        });

        const cashTickets = await prisma.ticketOrder.count({
            where: {
                order: {
                    orderStatus: 'COMPLETED',
                    ticketSource: 'CASH_GATE'
                }
            }
        });

        // Revenue breakdown
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

        // Entry log stats
        const successfulEntries = await prisma.entryLog.count({
            where: { entryStatus: 'SUCCESS' }
        });

        const blockedEntries = await prisma.entryLog.count({
            where: {
                entryStatus: {
                    in: ['BLOCKED', 'ALREADY_USED', 'INVALID']
                }
            }
        });

        // Today's entries
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayEntries = await prisma.entryLog.count({
            where: {
                entryStatus: 'SUCCESS',
                entryTime: { gte: today }
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
            // Legacy format for existing gate page
            scanned: scannedTickets,
            total: totalTickets,
            parkingUsed: parkingResult._sum.parkingPasses || 0,
            // Enhanced stats
            stats: {
                totalTickets,
                scannedTickets,
                remainingTickets: totalTickets - scannedTickets,
                totalParkingPasses: parkingResult._sum.parkingPasses || 0,
                scanPercentage: totalTickets > 0
                    ? Math.round((scannedTickets / totalTickets) * 100)
                    : 0,
                // Cash vs Online breakdown
                onlineTickets,
                cashTickets,
                onlineRevenue: onlineRevenue._sum.totalPrice || 0,
                cashRevenue: cashRevenue._sum.totalPrice || 0,
                // Entry stats
                successfulEntries,
                blockedEntries,
                todayEntries
            },
            hourlyData: {},
            recentScans: recentScans.map(scan => ({
                ticketCode: scan.ticketCode,
                customerName: scan.order.customerName,
                tier: scan.order.ticketPrice?.ticketType,
                scannedAt: scan.scannedAt?.toISOString(),
                source: scan.order.ticketSource
            }))
        });

    } catch (error) {
        console.error("Gate stats error:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch gate statistics",
            scanned: 0,
            total: 0,
            parkingUsed: 0
        }, { status: 500 });
    }
}
