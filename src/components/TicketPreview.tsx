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

    if (loading) return (
        <section className="py-20 px-4 bg-black text-white">
            <div className="max-w-7xl mx-auto text-center">
                <p className="text-gray-400">Loading tickets...</p>
            </div>
        </section>
    )

    if (error) return (
        <section className="py-20 px-4 bg-black text-white">
            <div className="max-w-7xl mx-auto text-center">
                <p className="text-red-500">Error: {error}</p>
            </div>
        </section>
    )

    if (!tickets.length) return (
        <section className="py-20 px-4 bg-black text-white">
            <div className="max-w-7xl mx-auto text-center">
                <p className="text-gray-400">No tickets available</p>
            </div>
        </section>
    )

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
                                    className={`relative h-full ${isPopular
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
                                            className={`w-full mb-3 ${isPopular
                                                    ? 'bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90'
                                                    : 'bg-[#FF4500] text-white hover:bg-[#FF4500]/90'
                                                }`}
                                            onClick={() => {
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
