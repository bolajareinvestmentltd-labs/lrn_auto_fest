"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, Users, Car, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CheckoutModal from "@/components/CheckoutModal";

interface TicketTier {
  id: string;
  ticketType: string;
  name: string;
  description: string;
  presaleSinglePrice: number | null;
  presaleGroup2Price: number | null;
  presaleGroup4Price: number | null;
  onsaleSinglePrice: number | null;
  onsaleGroup2Price: number | null;
  onsaleGroup4Price: number | null;
  totalUnits: number;
  soldUnits: number;
  presaleActive: boolean;
  vipSeating: boolean;
  eventPack: boolean;
  merchandise: boolean;
  premiumExperience: string | null;
  priorityRide: boolean;
  pradoPickup: boolean;
  highlightVideo: number;
  highlightPhotos: number;
}

type GroupSize = "SINGLE" | "GROUP_2" | "GROUP_4";

const GROUP_OPTIONS: { value: GroupSize; label: string; parking: number }[] = [
  { value: "SINGLE", label: "Single (1 person)", parking: 1 },
  { value: "GROUP_2", label: "Group of 2", parking: 1 },
  { value: "GROUP_4", label: "Group of 4", parking: 2 },
];

// Benefits mapping per tier type
const TIER_BENEFITS: Record<string, string[]> = {
  REGULAR: [
    "General event access",
    "Main stunt/drift viewing area",
    "Access to food court vendors",
  ],
  VIP_BRONZE: [
    "VIP seating area",
    "Event pack (chops + drink + pen)",
    "VIP wristband",
    "VIP parking",
  ],
  VIP_SILVER: [
    "All Bronze benefits",
    "VIP merch (top + cap)",
    "Premium viewing location",
    "VIP parking",
  ],
  VIP_GOLD: [
    "All Silver benefits",
    "One premium experience (drift car OR bike ride)",
    "Safety gear provided",
    "Priority VIP parking",
  ],
  VIP_DIAMOND: [
    "All Gold benefits",
    "Priority drift/bike ride",
    "Prado pickup/drop-off (scheduled)",
    "1 highlight video + 5 photos per booking",
    "Dedicated concierge service",
  ],
};

const TIER_COLORS: Record<string, { border: string; bg: string; accent: string; badge: string }> = {
  REGULAR: { border: "border-white/20", bg: "bg-white/5", accent: "text-brand-blue", badge: "" },
  VIP_BRONZE: { border: "border-amber-600/50", bg: "bg-amber-900/10", accent: "text-amber-500", badge: "bg-amber-600" },
  VIP_SILVER: { border: "border-gray-400/50", bg: "bg-gray-500/10", accent: "text-gray-300", badge: "bg-gray-400" },
  VIP_GOLD: { border: "border-yellow-500/50", bg: "bg-yellow-900/10", accent: "text-yellow-400", badge: "bg-yellow-500" },
  VIP_DIAMOND: { border: "border-cyan-400/50", bg: "bg-cyan-900/10", accent: "text-cyan-400", badge: "bg-gradient-to-r from-cyan-400 to-purple-500" },
};

export default function TicketsPage() {
  const [tiers, setTiers] = useState<TicketTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroupSize, setSelectedGroupSize] = useState<Record<string, GroupSize>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<TicketTier | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<GroupSize>("SINGLE");

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch("/api/tickets");
        if (!res.ok) throw new Error("Failed to fetch tickets");
        const data = await res.json();
        setTiers(data);
        // Initialize group size selection for each tier
        const initialGroupSizes: Record<string, GroupSize> = {};
        data.forEach((tier: TicketTier) => {
          initialGroupSizes[tier.id] = "SINGLE";
        });
        setSelectedGroupSize(initialGroupSizes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  const getPrice = (tier: TicketTier, groupSize: GroupSize): number | null => {
    const isPresale = tier.presaleActive && new Date() < new Date("2026-03-31T23:59:59Z");

    if (isPresale) {
      switch (groupSize) {
        case "SINGLE": return tier.presaleSinglePrice;
        case "GROUP_2": return tier.presaleGroup2Price;
        case "GROUP_4": return tier.presaleGroup4Price;
      }
    } else {
      switch (groupSize) {
        case "SINGLE": return tier.onsaleSinglePrice;
        case "GROUP_2": return tier.onsaleGroup2Price;
        case "GROUP_4": return tier.onsaleGroup4Price;
      }
    }
    return null;
  };

  const getParking = (groupSize: GroupSize): number => {
    return groupSize === "GROUP_4" ? 2 : 1;
  };

  const handleBuyClick = (tier: TicketTier) => {
    const groupSize = selectedGroupSize[tier.id] || "SINGLE";
    setSelectedTier(tier);
    setSelectedGroup(groupSize);
    setIsModalOpen(true);
  };

  const isAvailable = (tier: TicketTier, groupSize: GroupSize): boolean => {
    const price = getPrice(tier, groupSize);
    if (price === null) return false;

    const peopleCount = groupSize === "SINGLE" ? 1 : groupSize === "GROUP_2" ? 2 : 4;
    const remaining = tier.totalUnits - tier.soldUnits;
    return remaining >= peopleCount;
  };

  const getRemainingUnits = (tier: TicketTier): number => {
    return tier.totalUnits - tier.soldUnits;
  };

  const isSoldOut = (tier: TicketTier): boolean => {
    return getRemainingUnits(tier) <= 0;
  };

  return (
    <main className="bg-[#050505] min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter"
          >
            Get Your <span className="text-brand-orange">Tickets</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mt-4 max-w-xl mx-auto"
          >
            Choose your experience level for the biggest automotive event in West Africa.
            VIP packages include exclusive perks and limited availability.
          </motion.p>

          {/* Presale Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 inline-flex items-center gap-2 bg-brand-orange/20 border border-brand-orange/40 px-6 py-3 rounded-full"
          >
            <AlertCircle className="w-5 h-5 text-brand-orange" />
            <span className="text-brand-orange font-semibold">
              Early Bird Pricing Ends March 31, 2026
            </span>
          </motion.div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-20">
          <Loader2 className="w-12 h-12 text-brand-orange animate-spin" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex justify-center py-20">
          <div className="text-center">
            <p className="text-red-500 text-lg">Error: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Tickets Grid */}
      {!loading && !error && (
        <section className="pb-24 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tiers.map((tier, index) => {
                const colors = TIER_COLORS[tier.ticketType] || TIER_COLORS.REGULAR;
                const benefits = TIER_BENEFITS[tier.ticketType] || [];
                const groupSize = selectedGroupSize[tier.id] || "SINGLE";
                const price = getPrice(tier, groupSize);
                const remaining = getRemainingUnits(tier);
                const soldOut = isSoldOut(tier);
                const available = isAvailable(tier, groupSize);
                const parking = getParking(groupSize);
                const isVip = tier.ticketType.includes("VIP");

                return (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`relative h-full flex flex-col border-2 ${colors.border} ${colors.bg} overflow-hidden`}>
                      {/* Tier Badge */}
                      {isVip && (
                        <div className={`absolute top-0 right-0 ${colors.badge} text-black text-xs font-bold px-3 py-1 rounded-bl-lg`}>
                          {tier.ticketType.replace("VIP_", "")} VIP
                        </div>
                      )}

                      {/* Sold Out Overlay */}
                      {soldOut && (
                        <div className="absolute inset-0 bg-black/80 z-10 flex items-center justify-center">
                          <span className="text-2xl font-bold text-red-500 uppercase tracking-wider rotate-[-15deg] border-4 border-red-500 px-6 py-2">
                            Sold Out
                          </span>
                        </div>
                      )}

                      <CardHeader className="pb-2">
                        <CardTitle className={`font-heading text-2xl text-white uppercase tracking-wide ${colors.accent}`}>
                          {tier.name}
                        </CardTitle>
                        <p className="text-gray-400 text-sm mt-1">{tier.description}</p>
                      </CardHeader>

                      <CardContent className="flex-1 space-y-6">
                        {/* Group Size Selector */}
                        <div className="space-y-2">
                          <label className="text-xs text-gray-500 uppercase tracking-wider">Select Package</label>
                          <div className="grid grid-cols-1 gap-2">
                            {GROUP_OPTIONS.map((opt) => {
                              const optPrice = getPrice(tier, opt.value);
                              if (optPrice === null) return null;

                              return (
                                <button
                                  key={opt.value}
                                  onClick={() => setSelectedGroupSize({ ...selectedGroupSize, [tier.id]: opt.value })}
                                  className={`flex justify-between items-center p-3 rounded-lg border transition-all ${groupSize === opt.value
                                      ? `${colors.border} ${colors.bg} border-2`
                                      : "border-white/10 hover:border-white/30"
                                    }`}
                                  disabled={soldOut}
                                >
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-400" />
                                    <span className="text-white text-sm">{opt.label}</span>
                                  </div>
                                  <span className={`font-bold ${colors.accent}`}>
                                    ₦{optPrice.toLocaleString()}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Parking Info */}
                        {isVip && (
                          <div className="flex items-center gap-2 text-gray-400 text-sm bg-white/5 p-3 rounded-lg">
                            <Car className="w-4 h-4" />
                            <span>Includes {parking} parking pass{parking > 1 ? "es" : ""}</span>
                          </div>
                        )}

                        {/* Benefits */}
                        <div className="space-y-3">
                          <label className="text-xs text-gray-500 uppercase tracking-wider">What&apos;s Included</label>
                          <ul className="space-y-2">
                            {benefits.map((benefit, i) => (
                              <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                                <Check className={`w-4 h-4 mt-0.5 shrink-0 ${colors.accent}`} />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Availability */}
                        <div className="pt-2">
                          {remaining <= 10 && remaining > 0 ? (
                            <p className="text-red-400 text-sm font-semibold animate-pulse">
                              ⚠️ Only {remaining} tickets left!
                            </p>
                          ) : remaining > 0 ? (
                            <p className="text-gray-500 text-sm">
                              {remaining} of {tier.totalUnits} available
                            </p>
                          ) : null}
                        </div>
                      </CardContent>

                      <CardFooter className="pt-4">
                        <Button
                          onClick={() => handleBuyClick(tier)}
                          disabled={soldOut || !available}
                          className={`w-full h-12 font-bold text-lg uppercase tracking-wider rounded-full transition-all ${soldOut || !available
                              ? "bg-gray-600 cursor-not-allowed"
                              : isVip
                                ? "bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-900/30"
                                : "bg-brand-blue hover:bg-blue-600 text-white"
                            }`}
                        >
                          {soldOut ? "Sold Out" : !available ? "Unavailable" : "Buy Now"}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tier={selectedTier ? {
          ...selectedTier,
          presaleSinglePrice: getPrice(selectedTier, selectedGroup) || 0
        } : null}
        groupSize={selectedGroup}
      />
    </main>
  );
}
