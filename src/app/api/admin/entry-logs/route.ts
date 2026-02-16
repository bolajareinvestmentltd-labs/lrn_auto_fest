import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/entry-logs
 * Get entry logs with optional filtering
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const filter = searchParams.get("filter") || "all";
        const limit = parseInt(searchParams.get("limit") || "100");

        // Build where clause based on filter
        let whereClause = {};
        if (filter === "success") {
            whereClause = { entryStatus: "SUCCESS" };
        } else if (filter === "failed") {
            whereClause = {
                entryStatus: {
                    in: ["BLOCKED", "ALREADY_USED", "INVALID"]
                }
            };
        }

        // Fetch logs
        const logs = await prisma.entryLog.findMany({
            where: whereClause,
            orderBy: { entryTime: "desc" },
            take: limit
        });

        // Get stats
        const total = await prisma.entryLog.count();
        const success = await prisma.entryLog.count({ where: { entryStatus: "SUCCESS" } });
        const blocked = await prisma.entryLog.count({ where: { entryStatus: "BLOCKED" } });
        const alreadyUsed = await prisma.entryLog.count({ where: { entryStatus: "ALREADY_USED" } });
        const invalid = await prisma.entryLog.count({ where: { entryStatus: "INVALID" } });
        const attendees = await prisma.entryLog.count({ where: { accessType: "ATTENDEE", entryStatus: "SUCCESS" } });
        const vendors = await prisma.entryLog.count({ where: { accessType: "VENDOR", entryStatus: "SUCCESS" } });
        const cashEntries = await prisma.entryLog.count({ where: { paymentMethod: "CASH", entryStatus: "SUCCESS" } });
        const onlineEntries = await prisma.entryLog.count({
            where: {
                paymentMethod: { not: "CASH" },
                entryStatus: "SUCCESS"
            }
        });

        return NextResponse.json({
            success: true,
            logs,
            stats: {
                total,
                success,
                blocked,
                alreadyUsed,
                invalid,
                attendees,
                vendors,
                cashEntries,
                onlineEntries
            }
        });

    } catch (error) {
        console.error("Error fetching entry logs:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch entry logs",
            logs: [],
            stats: null
        }, { status: 500 });
    }
}
