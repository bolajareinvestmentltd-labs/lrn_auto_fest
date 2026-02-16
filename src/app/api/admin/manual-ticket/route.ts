import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes, createHash } from "crypto";
import { cookies } from "next/headers";

// Verify admin authentication
async function verifyAdmin() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("admin_session")?.value;

    if (!sessionToken) {
        return null;
    }

    // Hash the token to compare with stored hash
    const tokenHash = createHash("sha256").update(sessionToken).digest("hex");

    // Find admin with matching session
    const admin = await prisma.adminUser.findFirst({
        where: {
            isActive: true,
        },
    });

    return admin;
}

// Generate order number
async function generateOrderNumber(): Promise<string> {
    const count = await prisma.order.count();
    const num = count + 1;
    return `IAF-2026-${num.toString().padStart(4, "0")}`;
}

// Generate ticket code
function generateTicketCode(ticketType: string, index: number): string {
    const prefix = ticketType.includes("VIP") ? "VIP" : "REG";
    const random = randomBytes(4).toString("hex").toUpperCase();
    const timestamp = Date.now().toString(36).toUpperCase();
    return `${prefix}-${timestamp}-${random}${index}`;
}

// Generate QR code data
function generateQRCode(ticketCode: string): string {
    const hash = createHash("sha256")
        .update(ticketCode + process.env.QR_SECRET || "iaf-2026-secret")
        .digest("hex")
        .substring(0, 16);
    return `IAF2026:${ticketCode}:${hash}`;
}

// GET - Fetch ticket types with availability
export async function GET() {
    try {
        const admin = await verifyAdmin();
        if (!admin) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get ticket types with pricing and availability
        const ticketPrices = await prisma.ticketPrice.findMany({
            orderBy: { ticketType: "asc" },
        });

        // Get manual sales configuration
        const manualSalesConfigs = await prisma.manualSalesConfig.findMany();

        // Get current manual sales count per ticket type
        const manualSalesCounts = await prisma.order.groupBy({
            by: ["ticketPriceId"],
            where: {
                ticketSource: "CASH_GATE",
                orderStatus: "COMPLETED",
            },
            _count: true,
        });

        // Map ticket types with manual sales limits
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ticketTypes = ticketPrices.map((tp: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const config = manualSalesConfigs.find(
                (c: any) => c.ticketType === tp.ticketType
            );
            const salesCount = manualSalesCounts.find(
                (c: { ticketPriceId: string; _count: number }) => c.ticketPriceId === tp.id
            );
            const currentManualSales = salesCount?._count || 0;
            const maxManualSales = config?.maxManualSales || 100;
            const remaining = tp.totalUnits - tp.soldUnits;

            return {
                id: tp.id,
                ticketType: tp.ticketType,
                name: tp.name,
                // Use on-sale price for gate sales
                singlePrice: tp.onsaleSinglePrice || tp.presaleSinglePrice || 0,
                group2Price: tp.onsaleGroup2Price || tp.presaleGroup2Price || 0,
                group4Price: tp.onsaleGroup4Price || tp.presaleGroup4Price || 0,
                totalUnits: tp.totalUnits,
                soldUnits: tp.soldUnits,
                remaining,
                manualSalesAllowed: config?.isEnabled !== false,
                manualSalesMax: maxManualSales,
                manualSalesCurrent: currentManualSales,
                manualSalesRemaining: maxManualSales - currentManualSales,
            };
        });

        // Get today's stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayStats = await prisma.order.aggregate({
            where: {
                ticketSource: "CASH_GATE",
                orderStatus: "COMPLETED",
                createdAt: { gte: today },
            },
            _count: true,
            _sum: { totalPrice: true },
        });

        return NextResponse.json({
            success: true,
            ticketTypes,
            todayStats: {
                ticketsSold: todayStats._count || 0,
                revenue: todayStats._sum.totalPrice || 0,
            },
        });
    } catch (error) {
        console.error("Error fetching ticket types:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch ticket types" },
            { status: 500 }
        );
    }
}

// POST - Create manual ticket
export async function POST(request: NextRequest) {
    try {
        const admin = await verifyAdmin();
        if (!admin) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { ticketPriceId, quantity, buyerPhone, buyerName } = body;

        // Validate required fields
        if (!ticketPriceId || !quantity || !buyerPhone) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Get ticket price info
        const ticketPrice = await prisma.ticketPrice.findUnique({
            where: { id: ticketPriceId },
        });

        if (!ticketPrice) {
            return NextResponse.json(
                { success: false, error: "Invalid ticket type" },
                { status: 400 }
            );
        }

        // Check availability
        const remaining = ticketPrice.totalUnits - ticketPrice.soldUnits;
        if (remaining < quantity) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Only ${remaining} tickets remaining for ${ticketPrice.name}`,
                },
                { status: 400 }
            );
        }

        // Check manual sales limit
        const manualSalesConfig = await prisma.manualSalesConfig.findUnique({
            where: { ticketType: ticketPrice.ticketType },
        });

        if (manualSalesConfig && !manualSalesConfig.isEnabled) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Manual sales disabled for this ticket type",
                },
                { status: 400 }
            );
        }

        const currentManualSales = await prisma.order.count({
            where: {
                ticketPriceId,
                ticketSource: "CASH_GATE",
                orderStatus: "COMPLETED",
            },
        });

        const maxManualSales = manualSalesConfig?.maxManualSales || 100;
        if (currentManualSales + quantity > maxManualSales) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Manual sales limit reached. Max: ${maxManualSales}, Current: ${currentManualSales}`,
                },
                { status: 400 }
            );
        }

        // Calculate price (single price per ticket)
        const pricePerTicket =
            ticketPrice.onsaleSinglePrice || ticketPrice.presaleSinglePrice || 0;
        const totalPrice = pricePerTicket * quantity;

        // Calculate parking passes (1 per ticket for manual sales)
        const parkingPasses = quantity;

        // Create or find user
        let user = await prisma.user.findFirst({
            where: { phone: buyerPhone },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: `cash_${Date.now()}@gate.iaf2026.com`,
                    firstName: buyerName || "Cash",
                    lastName: "Buyer",
                    phone: buyerPhone,
                },
            });
        }

        // Generate order number
        const orderNumber = await generateOrderNumber();

        // Create order
        const order = await prisma.order.create({
            data: {
                orderNumber,
                userId: user.id,
                ticketPriceId,
                groupSize: "SINGLE",
                quantity,
                totalPrice,
                parkingPasses,
                paymentMethod: "CASH",
                paymentStatus: "COMPLETED",
                paidAt: new Date(),
                orderStatus: "COMPLETED",
                ticketSource: "CASH_GATE",
                soldByAdminId: admin.id,
                customerEmail: user.email,
                customerPhone: buyerPhone,
                customerName: buyerName || "Cash Buyer",
            },
        });

        // Create individual tickets
        const tickets = [];
        for (let i = 0; i < quantity; i++) {
            const ticketCode = generateTicketCode(ticketPrice.ticketType, i);
            const qrCode = generateQRCode(ticketCode);

            const ticket = await prisma.ticketOrder.create({
                data: {
                    orderId: order.id,
                    userId: user.id,
                    ticketCode,
                    qrCode,
                    scanStatus: "PENDING",
                    parkingPass1: `PKG-${ticketCode}`,
                },
            });

            tickets.push({
                id: ticket.id,
                ticketCode: ticket.ticketCode,
                qrCode: ticket.qrCode,
            });
        }

        // Update sold units
        await prisma.ticketPrice.update({
            where: { id: ticketPriceId },
            data: {
                soldUnits: { increment: quantity },
            },
        });

        // Update manual sales config if exists
        if (manualSalesConfig) {
            await prisma.manualSalesConfig.update({
                where: { ticketType: ticketPrice.ticketType },
                data: {
                    currentSales: { increment: quantity },
                },
            });
        }

        // Create audit log
        await prisma.auditLog.create({
            data: {
                action: "manual_ticket_created",
                entityType: "Order",
                entityId: order.id,
                userId: admin.id,
                changes: {
                    ticketType: ticketPrice.ticketType,
                    quantity,
                    totalPrice,
                    buyerPhone,
                    tickets: tickets.map((t) => t.ticketCode),
                },
            },
        });

        return NextResponse.json({
            success: true,
            order: {
                id: order.id,
                orderNumber: order.orderNumber,
                quantity,
                totalPrice,
                ticketType: ticketPrice.name,
            },
            tickets,
            message: `Successfully created ${quantity} ${ticketPrice.name} ticket(s)`,
        });
    } catch (error) {
        console.error("Error creating manual ticket:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create ticket" },
            { status: 500 }
        );
    }
}
