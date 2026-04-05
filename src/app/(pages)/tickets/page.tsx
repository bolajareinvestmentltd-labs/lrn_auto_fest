"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, Car, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CountdownTimer from "@/components/CountdownTimer";

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

type SalePeriod = "presale" | "onsale";

const PRESALE_END_DATE = "2026-03-31T23:59:59Z";

// External payment link - placeholder using Paystack
const EXTERNAL_PAYMENT_URL = "https://paystack.com/pay/ilorinautofest";

const GROUP_OPTIONS: { value: GroupSize; label: string; parking: number }[] = [
  { value: "SINGLE", label: "Single (1 person)", parking: 1 },
  { value: "GROUP_2", label: "Group of 2", parking: 1 },
  { value: "GROUP_4", label: "Group of 4", parking: 2 },
];

// Benefits mapping per tier type
const TIER_BENEFITS: Record<string, string[]> = {
  REGULAR: [
    "General access",
    "Food vendors access",
    "Main stunt/drift view",
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

  const getPriceForPeriod = (
    tier: TicketTier,
    groupSize: GroupSize,
    period: SalePeriod
  ): number | null => {
    if (period === "presale") {
      switch (groupSize) {
        case "SINGLE": return tier.presaleSinglePrice;
        case "GROUP_2": return tier.presaleGroup2Price;
        case "GROUP_4": return tier.presaleGroup4Price;
      }
    }

    switch (groupSize) {
      case "SINGLE": return tier.onsaleSinglePrice;
      case "GROUP_2": return tier.onsaleGroup2Price;
      case "GROUP_4": return tier.onsaleGroup4Price;
    }
  };

  const getPrice = (tier: TicketTier, groupSize: GroupSize): number | null => {
    const isPresale = tier.presaleActive && new Date() < new Date(PRESALE_END_DATE);
    return getPriceForPeriod(tier, groupSize, isPresale ? "presale" : "onsale");
  };

  const getParking = (groupSize: GroupSize): number => {
    return groupSize === "GROUP_4" ? 2 : 1;
  };

  const handleBuyClick = () => {
    // Redirect directly to external payment link
    window.open(EXTERNAL_PAYMENT_URL, "_blank");
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

  const getPackageOptions = (tier: TicketTier) => {
    return GROUP_OPTIONS.filter((option) => {
      // RULE 1: Regular tickets are Single only
      if (tier.ticketType === "REGULAR" && option.value !== "SINGLE") {
        return false;
      }

      // RULE 2: Gold and Diamond VIPs are Single and Group of 2 ONLY (No Group of 4)
      if ((tier.ticketType === "VIP_GOLD" || tier.ticketType === "VIP_DIAMOND") && option.value === "GROUP_4") {
        return false;
      }

      // RULE 3: Bronze and Silver automatically pass through and get all 3 options
      // (assuming they have a price configured in the database)
      return (
        getPriceForPeriod(tier, option.value, "presale") !== null ||
        getPriceForPeriod(tier, option.value, "onsale") !== null
      );
    });
  };


  const regularTiers = tiers.filter((tier) => tier.ticketType === "REGULAR");
  const vipTiers = tiers.filter((tier) => tier.ticketType !== "REGULAR");

  const renderTierCard = (tier: TicketTier, index: number) => {
    const colors = TIER_COLORS[tier.ticketType] || TIER_COLORS.REGULAR;
    const benefits = TIER_BENEFITS[tier.ticketType] || [];
    const packageOptions = getPackageOptions(tier);
    const chosenGroupSize = selectedGroupSize[tier.id] || packageOptions[0]?.value || "SINGLE";
    const price = getPrice(tier, chosenGroupSize);
    const remaining = getRemainingUnits(tier);
    const soldOut = isSoldOut(tier);
    const available = isAvailable(tier, chosenGroupSize);
    const isVip = tier.ticketType.includes("VIP");

    return (
      <motion.div
        key={tier.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
      >
        <Card className={`relative h-full flex flex-col border-2 ${colors.border} ${colors.bg} overflow-hidden`}>
          <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${remaining <= 10 ? "bg-red-500/20 text-red-300 border border-red-500/40" : "bg-white/10 text-white border border-white/15"}`}>
              {remaining > 0 ? `${remaining} left` : "0 left"}
            </span>
            {isVip && !soldOut && (
              <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-black ${colors.badge}`}>
                {tier.ticketType.replace("VIP_", "")} VIP
              </span>
            )}
          </div>

          {soldOut && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/75 backdrop-blur-[1px]">
              <span className="rounded-full border-2 border-red-500 px-6 py-2 text-lg font-black uppercase tracking-[0.25em] text-red-400">
                0 left
              </span>
            </div>
          )}

          <CardHeader className="pb-2 pt-20">
            <CardTitle className={`font-heading text-2xl text-white uppercase tracking-wide ${colors.accent}`}>
              {tier.name}
            </CardTitle>
            <p className="text-gray-400 text-sm mt-1">{tier.description}</p>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] uppercase tracking-[0.25em] text-gray-500">Selected package</p>
              <div className="mt-2 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {GROUP_OPTIONS.find((option) => option.value === chosenGroupSize)?.label || "Single"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {tier.presaleActive && new Date() < new Date(PRESALE_END_DATE) ? "Current price: Pre-sale" : "Current price: On-sale"}
                  </p>
                </div>
                <p className="text-3xl font-black text-brand-orange">
                  ₦{(price || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 space-y-6">
            <div className="space-y-2">
              <label className="text-xs text-gray-500 uppercase tracking-wider">Pricing</label>
              <div className="space-y-2">
                {packageOptions.map((option) => {
                  const presalePrice = getPriceForPeriod(tier, option.value, "presale");
                  const onSalePrice = getPriceForPeriod(tier, option.value, "onsale");
                  const isSelected = chosenGroupSize === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSelectedGroupSize({ ...selectedGroupSize, [tier.id]: option.value })}
                      disabled={soldOut}
                      className={`w-full rounded-xl border p-4 text-left transition-all ${isSelected
                        ? `${colors.border} ${colors.bg} shadow-[0_0_0_1px_rgba(255,255,255,0.08)]`
                        : "border-white/10 bg-white/5 hover:border-white/30"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-white">{option.label}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            {isVip ? `Parking: ${option.parking} vehicle${option.parking > 1 ? "s" : ""}` : "General access package"}
                          </p>
                        </div>
                        <div className="text-right text-xs">
                          <p className="text-gray-400">Pre-sale: <span className="font-semibold text-white">{presalePrice !== null ? `₦${presalePrice.toLocaleString()}` : "—"}</span></p>
                          <p className="mt-1 text-gray-400">On-sale: <span className="font-semibold text-white">{onSalePrice !== null ? `₦${onSalePrice.toLocaleString()}` : "—"}</span></p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {isVip && (
              <div className="flex items-center gap-2 text-gray-300 text-sm rounded-lg border border-white/10 bg-white/5 p-3">
                <Car className="w-4 h-4 text-brand-orange" />
                <span>
                  Parking rule for this package: {chosenGroupSize === "GROUP_4" ? "2 vehicles" : "1 vehicle"}
                </span>
              </div>
            )}

            <div className="space-y-3">
              <label className="text-xs text-gray-500 uppercase tracking-wider">Benefits</label>
              <ul className="space-y-2">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 ${colors.accent}`} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Availability countdown</p>
                <p className={`text-sm font-semibold ${remaining <= 10 ? "text-red-400" : "text-gray-300"}`}>
                  {remaining > 0 ? `${remaining} left` : "0 left"}
                </p>
              </div>
              <progress
                className="h-2 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-white/10 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-brand-orange [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-brand-orange"
                max={tier.totalUnits || 1}
                value={soldOut ? tier.totalUnits : Math.max(tier.soldUnits, remaining === tier.totalUnits ? 0 : 1)}
              />
        
           </div>
          </CardContent>

          <CardFooter className="pt-4">
            <Button
              onClick={() => handleBuyClick()}
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
  };

  return (
    <main className="bg-[#050505] min-h-screen">

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
            Choose regular access or one of the limited VIP packages. Every option below is already wired to the live checkout flow.
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

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 rounded-3xl border border-white/10 bg-white/5 px-6 py-6"
          >
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-gray-500">Pre-sale countdown</p>
            <CountdownTimer targetDate={PRESALE_END_DATE} />
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
            <div className="space-y-14">
              <div>
                <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Regular tickets</p>
                    <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-white">General access</h2>
                  </div>
                  <p className="max-w-2xl text-sm text-gray-400">
                    Regular entry includes general access, food vendors, and the main stunt/drift viewing zone.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {regularTiers.map((tier, index) => renderTierCard(tier, index))}
                </div>
              </div>

              <div>
                <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-gray-500">VIP packages</p>
                    <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-white">Premium tiers</h2>
                  </div>
                  <p className="max-w-2xl text-sm text-gray-400">
                    Bronze, Silver, Gold, and Diamond all include live inventory status, sold-out handling, and direct checkout from the Buy Now button.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {vipTiers.map((tier, index) => renderTierCard(tier, index + regularTiers.length))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tier={selectedTier}
        groupSize={selectedGroup}
      />
    </main>
  );
}
