"use client";

// ========================================
// COMING SOON DISPLAY
// ========================================
// To re-enable the full tickets page, replace this entire file with the backup
// or uncomment the code below and remove the ComingSoon import/render

import ComingSoon from "@/components/ComingSoon";

export default function TicketsPage() {
  return (
    <ComingSoon
      title="Premium Ticket Booking"
      description="We're preparing an amazing ticket purchasing experience for the Ilorin Automotive Festival 2026. Stay tuned!"
      releaseDate="May 15, 2026"
    />
  );
}

/*
// ========================================
// ORIGINAL FULL TICKETS PAGE CODE
// ========================================
// Restore this section to re-enable full functionality

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, Car, AlertCircle, X } from "lucide-react";
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
  // TODO: PAYMENT POPUP - Remove this state when payment is ready
  const [showPaymentUnavailable, setShowPaymentUnavailable] = useState(false);

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
    // TODO: PAYMENT POPUP - Replace this with actual payment redirect when ready
    // Temporarily show unavailable popup instead of redirecting to payment
    setShowPaymentUnavailable(true);
    // UNCOMMENT BELOW WHEN READY: window.open(EXTERNAL_PAYMENT_URL, "_blank");
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

export default function TicketsPage() {
  return (
    <ComingSoon
      title="Premium Ticket Booking"
      description="We're preparing an amazing ticket purchasing experience for the Ilorin Automotive Festival 2026. Stay tuned!"
      releaseDate="May 15, 2026"
    />
  );
}

/* FULL TICKET PAGE CODE COMMENTED OUT - Restore to re-enable
declare: Will add implementation when payment system is ready
const FullTicketsPageCode = `... implementation here ...`;
*/
*/
