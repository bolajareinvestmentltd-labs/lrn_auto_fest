"use client";
import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import CheckoutModal from "./CheckoutModal";

// Define what a Ticket looks like (matching your Prisma schema)
interface TicketTier {
    id: string;
    ticketType: string;
    name: string;
    description?: string;
    presaleSinglePrice: number;
    onsaleSinglePrice: number;
    totalUnits: number;
    soldUnits: number;
    vipSeating?: boolean;
    eventPack?: boolean;
    merchandise?: boolean;
}

export default function Tickets() {
    const [tiers, setTiers] = useState<TicketTier[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTier, setSelectedTier] = useState<TicketTier | null>(null);

    // FETCH THE ENGINE DATA
    useEffect(() => {
        async function fetchTickets() {
            try {
                const res = await fetch('/api/tickets');
                if (!res.ok) throw new Error('Failed to fetch tickets');
                const data = await res.json();
                setTiers(data);
                setError(null);
            } catch (error) {
                console.error("Failed to load tickets", error);
                setError(error instanceof Error ? error.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        }
        fetchTickets();
    }, []);

    // Handle ticket selection and modal open
    const handleBuyClick = (tier: TicketTier) => {
        setSelectedTier(tier);
        setIsModalOpen(true);
    };

    // Helper function to determine if tier is VIP
    const isVipTier = (tierType: string) => tierType.includes('VIP');

    // Helper function to build perks list from tier data
    const getPerks = (tier: TicketTier) => {
        const perks = ['General Access'];
        if (tier.eventPack) perks.push('Event Pack & Drinks');
        if (tier.vipSeating) perks.push('VIP Seating');
        if (tier.merchandise) perks.push('Festival Merchandise');
        return perks;
    };

    return (
        <>
            <section id="tickets" className="py-24 bg-[#050505] relative border-t border-white/10">
                <div className="container mx-auto px-4">

                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <h2 className="font-heading text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">
                            Get Your <span className="text-brand-orange">Access</span>
                        </h2>
                        <p className="text-gray-400 mt-4 max-w-lg mx-auto">
                            Secure your spot at the biggest automotive event in West Africa.
                        </p>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="flex justify-center py-20">
                            <p className="text-red-500">Error: {error}</p>
                        </div>
                    )}

                    {/* TICKET GRID - Show only Regular and Bronze VIP for homepage preview */}
                    {!loading && !error && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {tiers.slice(0, 2).map((tier, index) => {
                                const isVip = isVipTier(tier.ticketType);
                                const perks = getPerks(tier);
                                const remaining = tier.totalUnits - tier.soldUnits;

                                return (
                                    <motion.div
                                        key={tier.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.2 }}
                                        viewport={{ once: true }}
                                    >
                                        <Card className={`relative h-full flex flex-col border-2 
                      ${isVip ? 'border-brand-orange bg-brand-orange/5 shadow-[0_0_30px_rgba(255,69,0,0.1)]' : 'border-white/10 bg-white/5'}`}>

                                            {/* VIP Badge */}
                                            {isVip && (
                                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-orange text-black font-bold px-4 py-1 rounded-full text-sm uppercase tracking-wider">
                                                    Most Popular
                                                </div>
                                            )}

                                            <CardHeader className="text-center pb-2">
                                                <CardTitle className="font-heading text-2xl text-white uppercase tracking-wide">
                                                    {tier.name}
                                                </CardTitle>
                                                <div className="mt-4">
                                                    <span className="text-4xl font-bold text-white">
                                                        ₦{tier.presaleSinglePrice.toLocaleString()}
                                                    </span>
                                                    <p className="text-xs text-gray-400 mt-2">
                                                        Presale Price (ends March 31)
                                                    </p>
                                                </div>
                                                <div className="mt-3 text-xs text-gray-500">
                                                    {remaining} of {tier.totalUnits} remaining
                                                </div>
                                            </CardHeader>

                                            <CardContent className="flex-1 mt-6">
                                                <ul className="space-y-4">
                                                    {perks.map((perk, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-gray-300">
                                                            <Check className={`w-5 h-5 shrink-0 mt-0.5 ${isVip ? 'text-brand-orange' : 'text-brand-blue'}`} />
                                                            <span className="text-sm">{perk}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>

                                            <CardFooter>
                                                <Button
                                                    className={`w-full h-12 font-bold text-lg uppercase tracking-wider rounded-full
                            ${isVip ? 'bg-brand-orange hover:bg-orange-600 text-white' : 'bg-transparent border border-white/20 hover:bg-white/10 text-white'}`}
                                                    onClick={() => handleBuyClick(tier)}
                                                >
                                                    {isVip ? 'Get VIP Access' : 'Buy Regular'}
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {/* View All Tickets CTA */}
                    <div className="text-center mt-16">
                        <a href="/tickets">
                            <Button className="bg-brand-blue hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-full uppercase">
                                View All Ticket Options →
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* Checkout Modal */}
            <CheckoutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                tier={selectedTier}
                groupSize="SINGLE"
            />
        </>
    );
}
