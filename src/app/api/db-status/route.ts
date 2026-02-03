import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get database statistics
    const userCount = await prisma.user.count();
    const orderCount = await prisma.order.count();
    const ticketPrices = await prisma.ticketPrice.findMany();
    const eventConfig = await prisma.eventConfig.findFirst();

    return Response.json({
      status: '✅ NEON DATABASE CONNECTED!',
      timestamp: new Date().toISOString(),
      database: {
        type: 'PostgreSQL (Neon)',
        location: 'AWS us-east-1',
        status: 'Ready'
      },
      tables: {
        users: userCount,
        orders: orderCount,
        ticketTypes: ticketPrices.length,
        eventConfigured: !!eventConfig
      },
      eventDetails: eventConfig ? {
        name: eventConfig.eventName,
        date: eventConfig.eventDate,
        location: eventConfig.eventLocation,
        presaleEndDate: eventConfig.presaleEndDate
      } : null,
      message: 'Your Neon database is fully operational! 🚀',
      nextSteps: [
        '1. Add test data via Prisma Studio (http://localhost:5555)',
        '2. Build API endpoints for ticket purchases',
        '3. Integrate payment gateway (Paystack)',
        '4. Deploy to Vercel with DATABASE_URL secret'
      ]
    });
  } catch (error) {
    return Response.json({
      status: '❌ CONNECTION ERROR',
      error: error instanceof Error ? error.message : String(error),
      help: 'Try restarting: npm run dev'
    }, { status: 500 });
  }
}
