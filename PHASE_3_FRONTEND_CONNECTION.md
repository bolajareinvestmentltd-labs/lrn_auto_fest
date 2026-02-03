# ⚡ PHASE 3: THE DRIVETRAIN (Connecting Frontend to Backend)

## 🎯 Mission: Make "Buy Tickets" Actually Work

Your database and API are **LIVE**. Now let's wire them together so:

- ✅ TicketPreview component fetches real prices from database
- ✅ "Buy Tickets" button knows what's available
- ✅ Prices update dynamically

---

## 📊 Current Status

### Database ✅ LIVE

- Regular: 5,000 tickets @ ₦3,000 (presale)
- Bronze VIP: 80 tickets @ ₦7,500
- Silver VIP: 70 tickets @ ₦15,000
- Gold VIP: 30 tickets @ ₦35,000
- Diamond VIP: 20 tickets @ ₦55,000

### API ✅ LIVE

- Endpoint: `http://localhost:3001/api/tickets`
- Returns: All 5 ticket tiers with full data
- Test: Open endpoint in browser → See JSON with all tickets

### Frontend 🟡 NOT YET CONNECTED

- Components render mock data
- Need to fetch from API instead

---

## 🔌 STEP 1: Update TicketPreview Component

**File:** `src/components/TicketPreview.tsx`

This component currently has hardcoded ticket data. Let's make it fetch real data from the API!

**Current Code Structure:**

```typescript
const tickets = [
  { id: 'regular', name: 'Regular Access', ... },
  { id: 'bronze', name: 'Bronze VIP', ... },
  { id: 'diamond', name: 'Diamond VIP', ... }
];

// Renders mock data
```

**New Code Structure:**

```typescript
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'

interface TicketTier {
  id: string
  ticketType: string
  name: string
  presaleSinglePrice: number
  onsaleSinglePrice: number
  totalUnits: number
  soldUnits: number
  vipSeating: boolean
  eventPack: boolean
  merchandise: boolean
}

export default function TicketPreview() {
  const [tickets, setTickets] = useState<TicketTier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('/api/tickets')
        if (!response.ok) throw new Error('Failed to fetch tickets')
        const data = await response.json()
        setTickets(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setTickets([])
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  if (loading) return <div className="text-center py-12">Loading tickets...</div>
  if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>
  if (!tickets.length) return <div className="text-center py-12">No tickets available</div>

  // Determine which tier to highlight
  const popularId = 'VIP_BRONZE' // Bronze is middle tier, highlight it

  return (
    <section className="py-20 px-4 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Get Your <span className="text-[#FF4500]">Tickets</span>
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Presale ends March 31. Lock in early pricing now!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tickets.map((ticket) => {
            const isPopular = ticket.ticketType === popularId
            const remaining = ticket.totalUnits - ticket.soldUnits

            return (
              <motion.div
                key={ticket.id}
                whileHover={isPopular ? { scale: 1.05 } : {}}
                className={isPopular ? "md:scale-105" : ""}
              >
                <Card
                  className={`relative h-full ${
                    isPopular
                      ? 'bg-gradient-to-b from-[#FF4500] to-black border-[#FF4500]'
                      : 'bg-gradient-to-b from-gray-900 to-black border-gray-700'
                  } border-2 hover:border-[#00F0FF] transition-colors`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-[#FF4500] px-4 py-1 rounded-full flex items-center gap-2 whitespace-nowrap">
                        <Zap size={16} />
                        <span className="text-sm font-bold">Most Popular</span>
                      </div>
                    </div>
                  )}

                  <CardContent className="p-6 pt-8">
                    <h3 className="text-2xl font-bold mb-2">{ticket.name}</h3>
                    
                    <div className="mb-6">
                      <p className="text-gray-400 text-sm mb-3">Presale Price</p>
                      <p className="text-3xl font-bold text-[#00F0FF]">
                        ₦{ticket.presaleSinglePrice?.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        After March 31: ₦{ticket.onsaleSinglePrice?.toLocaleString()}
                      </p>
                    </div>

                    <div className="mb-6 pb-6 border-b border-gray-700">
                      <p className="text-xs text-gray-400 mb-3">PERKS INCLUDED</p>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm">
                          <span className="text-[#FF4500]">✓</span>
                          General Access
                        </li>
                        {ticket.eventPack && (
                          <li className="flex items-center gap-2 text-sm">
                            <span className="text-[#FF4500]">✓</span>
                            Food Package & Drinks
                          </li>
                        )}
                        {ticket.vipSeating && (
                          <li className="flex items-center gap-2 text-sm">
                            <span className="text-[#FF4500]">✓</span>
                            VIP Seating
                          </li>
                        )}
                        {ticket.merchandise && (
                          <li className="flex items-center gap-2 text-sm">
                            <span className="text-[#FF4500]">✓</span>
                            Festival Merchandise
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-gray-400 mb-2">
                        {remaining} of {ticket.totalUnits} remaining
                      </p>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-[#FF4500] h-2 rounded-full transition-all"
                          style={{
                            width: `${((ticket.totalUnits - remaining) / ticket.totalUnits) * 100}%`
                          }}
                        />
                      </div>
                    </div>

                    <Button
                      className={`w-full mb-3 ${
                        isPopular
                          ? 'bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90'
                          : 'bg-[#FF4500] text-white hover:bg-[#FF4500]/90'
                      }`}
                      onClick={() => {
                        // TODO: Implement checkout flow
                        console.log(`Buy ${ticket.name}`)
                      }}
                    >
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            className="border-[#FF4500] text-[#FF4500] hover:bg-[#FF4500]/10"
            onClick={() => {
              // TODO: Navigate to full tickets page
              console.log('Navigate to /tickets')
            }}
          >
            View All Pricing Options
          </Button>
        </div>
      </div>
    </section>
  )
}
```

---

## 📝 What Changed?

### 1. Added `'use client'` Directive

```typescript
'use client'  // Component uses hooks (useState, useEffect)
```

### 2. Added State Management

```typescript
const [tickets, setTickets] = useState<TicketTier[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
```

### 3. Fetch Data on Mount

```typescript
useEffect(() => {
  const fetchTickets = async () => {
    const response = await fetch('/api/tickets')
    const data = await response.json()
    setTickets(data)
  }
  fetchTickets()
}, [])
```

### 4. Dynamic Pricing Display

```typescript
<p className="text-3xl font-bold text-[#00F0FF]">
  ₦{ticket.presaleSinglePrice?.toLocaleString()}
</p>
```

### 5. Dynamic Perks Display

```typescript
{ticket.eventPack && (
  <li>Food Package & Drinks</li>
)}
{ticket.vipSeating && (
  <li>VIP Seating</li>
)}
```

### 6. Capacity Progress Bar

```typescript
<div className="w-full bg-gray-700 rounded-full h-2">
  <div
    style={{
      width: `${((ticket.totalUnits - remaining) / ticket.totalUnits) * 100}%`
    }}
  />
</div>
```

---

## 🔄 Data Flow

```
Database (Neon PostgreSQL)
    ↓ Contains 5 ticket tiers
API Endpoint (/api/tickets)
    ↓ Returns JSON array
TicketPreview Component
    ↓ Fetches in useEffect
Browser Display
    ↓ Shows real prices & availability
```

---

## 🚀 Next Steps After This

1. **Create Full Tickets Page**
   - Route: `/tickets`
   - Show all tiers with calculator
   - Add group discounts (2 & 4 person packages)

2. **Add Checkout Flow**
   - Button → Paystack integration
   - Order summary
   - Payment processing

3. **Create Vendor Booking Page**
   - Form to register vendors
   - Booth selection
   - Payment setup

4. **Create VIP Packages Page**
   - Detailed benefits per tier
   - Comparison table
   - Rider/experience bookings

---

## ✅ Verification Checklist

After implementing:

- [ ] Component fetches tickets from API
- [ ] Prices display correctly (₦3,000 for Regular, etc.)
- [ ] Loading state shows while fetching
- [ ] All perks display correctly
- [ ] Capacity bar fills properly
- [ ] Popular badge on Bronze VIP
- [ ] No console errors (F12 → Console)
- [ ] Responsive on mobile

---

## 🆘 Troubleshooting

### "Cannot find module '@/components/ui/card'"

→ These components are already installed. Check import paths are correct.

### "fetch is not defined"

→ Already available in Next.js. Just use `fetch()`.

### "TicketPreview not showing data"

→ Check: (1) API endpoint working at `/api/tickets`, (2) Browser console for errors, (3) Network tab sees the API call

### "Prices showing as undefined"

→ Database seed might not have run. Run: `npx prisma db seed`

---

## 🎯 THE BIG PICTURE

**What We Just Built:**

| Phase | Component | Status |
|-------|-----------|--------|
| 1 | Database (Neon) | ✅ Live with 5 tiers |
| 2 | API Endpoint | ✅ Live at /api/tickets |
| 3 | Frontend Connection | 👈 You are here |
| 4 | Checkout Flow | Next |
| 5 | Vendor Booking | Next |
| 6 | Payment Gateway | Next |

**Your Ferrari now has:**

- 🏎️ Engine (Database)
- ⚙️ Transmission (API)
- 🔌 Drivetrain (TicketPreview component) ← Building this

---

**Ready to start the engine? Implement the updated TicketPreview.tsx!** 🚀
