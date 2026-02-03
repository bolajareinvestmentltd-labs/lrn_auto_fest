"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Loader2,
  Crown,
  Star,
  Gem,
  Car,
  Camera,
  Utensils,
  Shirt,
  Ticket,
  Users,
  Sparkles,
} from "lucide-react";
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

// VIP tier configuration
const VIP_CONFIG: Record<string, {
  icon: any;
  gradient: string;
  border: string;
  bg: string;
  accent: string;
  badge: string;
  shadow: string;
  benefits: { icon: any; text: string }[];
}> = {
  VIP_BRONZE: {
    icon: Crown,
    gradient: "from-amber-700 via-amber-600 to-amber-500",
    border: "border-amber-600",
    bg: "bg-gradient-to-br from-amber-900/30 to-amber-800/10",
    accent: "text-amber-500",
    badge: "bg-amber-600",
    shadow: "shadow-amber-600/20",
    benefits: [
      { icon: Ticket, text: "VIP seating area with premium view" },
      { icon: Utensils, text: "Event pack (chops + drink + pen)" },
      { icon: Sparkles, text: "VIP wristband" },
      { icon: Car, text: "VIP parking (Single/Group 2 = 1, Group 4 = 2)" },
    ],
  },
  VIP_SILVER: {
    icon: Star,
    gradient: "from-gray-400 via-gray-300 to-gray-200",
    border: "border-gray-400",
    bg: "bg-gradient-to-br from-gray-700/30 to-gray-600/10",
    accent: "text-gray-300",
    badge: "bg-gray-400",
    shadow: "shadow-gray-400/20",
    benefits: [
      { icon: Check, text: "All Bronze VIP benefits" },
      { icon: Shirt, text: "VIP merch (exclusive top + cap)" },
      { icon: Crown, text: "Premium viewing location" },
      { icon: Car, text: "VIP parking included" },
    ],
  },
  VIP_GOLD: {
    icon: Gem,
    gradient: "from-yellow-500 via-yellow-400 to-amber-300",
    border: "border-yellow-500",
    bg: "bg-gradient-to-br from-yellow-900/30 to-yellow-800/10",
    accent: "text-yellow-400",
    badge: "bg-yellow-500",
    shadow: "shadow-yellow-500/20",
    benefits: [
      { icon: Check, text: "All Silver VIP benefits" },
      { icon: Car, text: "One premium experience (drift car OR bike ride)" },
      { icon: Sparkles, text: "Safety gear provided" },
      { icon: Car, text: "Priority VIP parking" },
    ],
  },
  VIP_DIAMOND: {
    icon: Gem,
    gradient: "from-cyan-400 via-blue-400 to-purple-500",
    border: "border-cyan-400",
    bg: "bg-gradient-to-br from-cyan-900/30 to-purple-900/10",
    accent: "text-cyan-400",
    badge: "bg-gradient-to-r from-cyan-400 to-purple-500",
    shadow: "shadow-cyan-400/30",
    benefits: [
      { icon: Check, text: "All Gold VIP benefits" },
      { icon: Star, text: "Priority drift/bike ride (first in line)" },
      { icon: Car, text: "Prado pickup/drop-off (scheduled)" },
      { icon: Camera, text: "1 highlight video + 5 photos per booking" },
      { icon: Crown, text: "Dedicated concierge service" },
    ],
  },
};

export default function VIPPage() {
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
        // Filter only VIP tiers
        const vipTiers = data.filter((tier: TicketTier) => tier.ticketType.includes("VIP"));
        setTiers(vipTiers);
        // Initialize group sizes
        const initialGroupSizes: Record<string, GroupSize> = {};
        vipTiers.forEach((tier: TicketTier) => {
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

  const getOnSalePrice = (tier: TicketTier, groupSize: GroupSize): number | null => {
    switch (groupSize) {
      case "SINGLE": return tier.onsaleSinglePrice;
      case "GROUP_2": return tier.onsaleGroup2Price;
      case "GROUP_4": return tier.onsaleGroup4Price;
    }
    return null;
  };

  const handleBuyClick = (tier: TicketTier) => {
    const groupSize = selectedGroupSize[tier.id] || "SINGLE";
    setSelectedTier(tier);
    setSelectedGroup(groupSize);
    setIsModalOpen(true);
  };

  const getRemainingUnits = (tier: TicketTier): number => tier.totalUnits - tier.soldUnits;
  const isSoldOut = (tier: TicketTier): boolean => getRemainingUnits(tier) <= 0;

  return (
    <main className="bg-[#050505] min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange/20 to-cyan-500/20 border border-white/10 px-6 py-2 rounded-full mb-6"
          >
            <Gem className="w-5 h-5 text-cyan-400" />
            <span className="text-white/80 font-semibold">Premium Experiences</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter"
          >
            VIP <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-yellow-400 to-cyan-400">Packages</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mt-4 max-w-2xl mx-auto text-lg"
          >
            Elevate your festival experience with exclusive access, premium seating,
            merchandise, and once-in-a-lifetime automotive experiences.
          </motion.p>
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
            <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
          </div>
        </div>
      )}

      {/* VIP Packages Grid */}
      {!loading && !error && (
        <section className="pb-24 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tiers.map((tier, index) => {
                const config = VIP_CONFIG[tier.ticketType];
                if (!config) return null;

                const groupSize = selectedGroupSize[tier.id] || "SINGLE";
                const price = getPrice(tier, groupSize);
                const onSalePrice = getOnSalePrice(tier, groupSize);
                const remaining = getRemainingUnits(tier);
                const soldOut = isSoldOut(tier);
                const IconComponent = config.icon;

                return (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                  >
                    <Card className={`relative h-full flex flex-col border-2 ${config.border} ${config.bg} overflow-hidden ${config.shadow} shadow-2xl`}>
                      {/* Gradient Header */}
                      <div className={`bg-gradient-to-r ${config.gradient} p-4 flex items-center justify-between`}>
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-8 h-8 text-black" />
                          <div>
                            <h3 className="font-heading text-2xl font-black text-black uppercase">
                              {tier.name}
                            </h3>
                            <p className="text-black/70 text-sm">{tier.totalUnits} units available</p>
                          </div>
                        </div>
                        {remaining <= 10 && remaining > 0 && (
                          <span className="bg-black/20 text-black px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                            Only {remaining} left!
                          </span>
                        )}
                      </div>

                      {/* Sold Out Overlay */}
                      {soldOut && (
                        <div className="absolute inset-0 bg-black/90 z-10 flex items-center justify-center">
                          <span className="text-3xl font-bold text-red-500 uppercase tracking-wider rotate-[-15deg] border-4 border-red-500 px-8 py-3">
                            Sold Out
                          </span>
                        </div>
                      )}

                      <CardHeader className="pb-2">
                        <p className="text-gray-400 text-sm">{tier.description}</p>
                      </CardHeader>

                      <CardContent className="flex-1 space-y-6">
                        {/* Price Selection */}
                        <div className="space-y-3">
                          <label className="text-xs text-gray-500 uppercase tracking-wider">Select Your Package</label>
                          <div className="space-y-2">
                            {(["SINGLE", "GROUP_2", "GROUP_4"] as GroupSize[]).map((gs) => {
                              const gsPrice = getPrice(tier, gs);
                              const gsOnSale = getOnSalePrice(tier, gs);
                              if (gsPrice === null) return null;

                              const labels: Record<GroupSize, string> = {
                                SINGLE: "Single (1 person)",
                                GROUP_2: "Group of 2",
                                GROUP_4: "Group of 4",
                              };

                              return (
                                <button
                                  key={gs}
                                  onClick={() => setSelectedGroupSize({ ...selectedGroupSize, [tier.id]: gs })}
                                  disabled={soldOut}
                                  className={`w-full flex justify-between items-center p-4 rounded-lg border-2 transition-all ${groupSize === gs
                                      ? `${config.border} ${config.bg}`
                                      : "border-white/10 hover:border-white/30"
                                    }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-gray-400" />
                                    <span className="text-white font-medium">{labels[gs]}</span>
                                  </div>
                                  <div className="text-right">
                                    <span className={`text-xl font-bold ${config.accent}`}>
                                      ₦{gsPrice.toLocaleString()}
                                    </span>
                                    {gsOnSale && gsOnSale > gsPrice && (
                                      <p className="text-xs text-gray-500 line-through">
                                        ₦{gsOnSale.toLocaleString()} after March 31
                                      </p>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Benefits */}
                        <div className="space-y-3">
                          <label className="text-xs text-gray-500 uppercase tracking-wider">What&apos;s Included</label>
                          <ul className="space-y-3">
                            {config.benefits.map((benefit, i) => {
                              const BenefitIcon = benefit.icon;
                              return (
                                <li key={i} className="flex items-start gap-3 text-gray-300">
                                  <BenefitIcon className={`w-5 h-5 mt-0.5 shrink-0 ${config.accent}`} />
                                  <span className="text-sm">{benefit.text}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-4 flex-col gap-3">
                        <Button
                          onClick={() => handleBuyClick(tier)}
                          disabled={soldOut}
                          className={`w-full h-14 font-bold text-lg uppercase tracking-wider rounded-full transition-all ${soldOut
                              ? "bg-gray-600 cursor-not-allowed"
                              : `bg-gradient-to-r ${config.gradient} hover:opacity-90 text-black shadow-lg ${config.shadow}`
                            }`}
                        >
                          {soldOut ? "Sold Out" : `Get ${tier.name} Access`}
                        </Button>
                        <p className="text-xs text-gray-500 text-center">
                          Secured by Paystack • Non-refundable
                        </p>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Benefits Comparison Table */}
      <section className="py-16 px-4 bg-white/5 border-y border-white/10">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-heading text-3xl font-bold text-white text-center mb-12 uppercase">
            Compare <span className="text-brand-orange">VIP Tiers</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="py-4 px-4 text-gray-400 font-medium">Feature</th>
                  <th className="py-4 px-4 text-amber-500 font-bold text-center">Bronze</th>
                  <th className="py-4 px-4 text-gray-300 font-bold text-center">Silver</th>
                  <th className="py-4 px-4 text-yellow-400 font-bold text-center">Gold</th>
                  <th className="py-4 px-4 text-cyan-400 font-bold text-center">Diamond</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { feature: "VIP Seating", bronze: true, silver: true, gold: true, diamond: true },
                  { feature: "Event Pack (chops + drink)", bronze: true, silver: true, gold: true, diamond: true },
                  { feature: "VIP Wristband", bronze: true, silver: true, gold: true, diamond: true },
                  { feature: "VIP Parking", bronze: true, silver: true, gold: true, diamond: true },
                  { feature: "Exclusive Merch (top + cap)", bronze: false, silver: true, gold: true, diamond: true },
                  { feature: "Premium Experience Ride", bronze: false, silver: false, gold: true, diamond: true },
                  { feature: "Priority Ride Access", bronze: false, silver: false, gold: false, diamond: true },
                  { feature: "Prado Pickup/Drop-off", bronze: false, silver: false, gold: false, diamond: true },
                  { feature: "Highlight Video + Photos", bronze: false, silver: false, gold: false, diamond: true },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/10">
                    <td className="py-3 px-4 text-white">{row.feature}</td>
                    <td className="py-3 px-4 text-center">{row.bronze ? <Check className="w-5 h-5 text-amber-500 mx-auto" /> : <span className="text-gray-600">—</span>}</td>
                    <td className="py-3 px-4 text-center">{row.silver ? <Check className="w-5 h-5 text-gray-300 mx-auto" /> : <span className="text-gray-600">—</span>}</td>
                    <td className="py-3 px-4 text-center">{row.gold ? <Check className="w-5 h-5 text-yellow-400 mx-auto" /> : <span className="text-gray-600">—</span>}</td>
                    <td className="py-3 px-4 text-center">{row.diamond ? <Check className="w-5 h-5 text-cyan-400 mx-auto" /> : <span className="text-gray-600">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

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
