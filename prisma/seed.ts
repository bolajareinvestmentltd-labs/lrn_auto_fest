import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seeding...')

    // 1. Create REGULAR Ticket Tier
    const regular = await prisma.ticketPrice.upsert({
        where: { ticketType: 'REGULAR' },
        update: {},
        create: {
            ticketType: 'REGULAR',
            name: 'Regular Access',
            description: 'General access to all event zones, food court, and main viewing areas',
            totalUnits: 5000,
            soldUnits: 0,
            presaleActive: true,
            presaleEndDate: new Date('2026-03-31T23:59:59Z'),
            presaleSinglePrice: 3000,
            presaleGroup2Price: null, // Regular doesn't have group pricing
            presaleGroup4Price: null,
            onsaleSinglePrice: 5000,
            onsaleGroup2Price: null,
            onsaleGroup4Price: null,
            vipSeating: false,
            eventPack: false,
            merchandise: false
        }
    })
    console.log('✅ Regular ticket tier created')

    // 2. Create BRONZE VIP Ticket Tier
    const bronzeVip = await prisma.ticketPrice.upsert({
        where: { ticketType: 'VIP_BRONZE' },
        update: {},
        create: {
            ticketType: 'VIP_BRONZE',
            name: 'Bronze VIP',
            description: 'VIP seating, event pack with refreshments, VIP wristband & parking',
            totalUnits: 80,
            soldUnits: 0,
            presaleActive: true,
            presaleEndDate: new Date('2026-03-31T23:59:59Z'),
            presaleSinglePrice: 7500,
            presaleGroup2Price: 14000,
            presaleGroup4Price: 27000,
            onsaleSinglePrice: 9000,
            onsaleGroup2Price: 17000,
            onsaleGroup4Price: 33000,
            vipSeating: true,
            eventPack: true,
            merchandise: false
        }
    })
    console.log('✅ Bronze VIP tier created')

    // 3. Create SILVER VIP Ticket Tier
    const silverVip = await prisma.ticketPrice.upsert({
        where: { ticketType: 'VIP_SILVER' },
        update: {},
        create: {
            ticketType: 'VIP_SILVER',
            name: 'Silver VIP',
            description: 'All Bronze benefits + exclusive festival merchandise (top + cap)',
            totalUnits: 70,
            soldUnits: 0,
            presaleActive: true,
            presaleEndDate: new Date('2026-03-31T23:59:59Z'),
            presaleSinglePrice: 21000,
            presaleGroup2Price: 40000,
            presaleGroup4Price: 78000,
            onsaleSinglePrice: 25000,
            onsaleGroup2Price: 48000,
            onsaleGroup4Price: 92000,
            vipSeating: true,
            eventPack: true,
            merchandise: true
        }
    })
    console.log('✅ Silver VIP tier created')

    // 4. Create GOLD VIP Ticket Tier
    const goldVip = await prisma.ticketPrice.upsert({
        where: { ticketType: 'VIP_GOLD' },
        update: {},
        create: {
            ticketType: 'VIP_GOLD',
            name: 'Gold VIP',
            description: 'All Silver benefits + premium drift car OR bike ride experience with safety gear',
            totalUnits: 30,
            soldUnits: 0,
            presaleActive: true,
            presaleEndDate: new Date('2026-03-31T23:59:59Z'),
            presaleSinglePrice: 32000,
            presaleGroup2Price: 60000,
            presaleGroup4Price: null, // Gold doesn't offer Group 4
            onsaleSinglePrice: 38000,
            onsaleGroup2Price: 72000,
            onsaleGroup4Price: null,
            vipSeating: true,
            eventPack: true,
            merchandise: true,
            premiumExperience: 'drift_car_ride',
            priorityRide: false,
            pradoPickup: false
        }
    })
    console.log('✅ Gold VIP tier created')

    // 5. Create DIAMOND VIP Ticket Tier
    const diamondVip = await prisma.ticketPrice.upsert({
        where: { ticketType: 'VIP_DIAMOND' },
        update: {},
        create: {
            ticketType: 'VIP_DIAMOND',
            name: 'Diamond VIP',
            description: 'Ultimate experience: Priority rides, Prado pickup, dedicated content creation (1 video + 5 photos)',
            totalUnits: 20,
            soldUnits: 0,
            presaleActive: true,
            presaleEndDate: new Date('2026-03-31T23:59:59Z'),
            presaleSinglePrice: 55000,
            presaleGroup2Price: 105000,
            presaleGroup4Price: null, // Diamond doesn't offer Group 4
            onsaleSinglePrice: 60000,
            onsaleGroup2Price: 115000,
            onsaleGroup4Price: null,
            vipSeating: true,
            eventPack: true,
            merchandise: true,
            premiumExperience: 'drift_car_ride',
            priorityRide: true,
            pradoPickup: true,
            highlightVideo: 1,
            highlightPhotos: 5
        }
    })
    console.log('✅ Diamond VIP tier created')

    // 6. Create Event Configuration
    await prisma.eventConfig.upsert({
        where: { id: 'default' },
        update: {},
        create: {
            id: 'default',
            eventName: 'Ilorin Automotive Festival 2026',
            eventDate: new Date('2026-05-30T09:00:00Z'),
            eventLocation: 'Metropolitan Square, Asadam Road, Ilorin, Nigeria',
            presaleEndDate: new Date('2026-03-31T23:59:59Z'),
            onSaleStartDate: new Date('2026-04-01T00:00:00Z'),
            maxVendors: 20,
            vendorBookingFee: 100000,
            maintenanceMode: false
        }
    })
    console.log('✅ Event configuration created')

    console.log('🎉 Database seeding completed!')
    console.log({ regular, bronzeVip, silverVip, goldVip, diamondVip })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
