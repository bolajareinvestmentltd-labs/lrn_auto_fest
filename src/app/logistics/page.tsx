"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import {
    Bus,
    MapPin,
    Clock,
    CheckCircle2,
    AlertTriangle,
    ArrowLeft,
    Ticket,
    Gift,
    Info,
    Shield,
} from "lucide-react";

// Pickup routes from MERCHANDIZE UPDATE.md
const PICKUP_ROUTES = [
    {
        id: "unilorin",
        name: "University of Ilorin (Unilorin Campus)",
        price: 3000,
        icon: "🎓",
    },
    {
        id: "kwasu",
        name: "KWASU, Malete",
        price: 5000,
        icon: "🏫",
    },
    {
        id: "kwara-poly",
        name: "Kwara Poly / UITH Axis",
        price: 3000,
        icon: "🏥",
    },
    {
        id: "geri-alimi",
        name: "Geri Alimi / Mandate / Adeta Axis",
        price: 3000,
        icon: "🏙️",
    },
];

const IMPORTANT_INFO = [
    "Logistics booking closes 48 hours before the event",
    "Pickup and drop-off times will be communicated via WhatsApp",
    "Late arrival forfeits seat",
    "One Ticket ID equals one logistics seat",
    "Logistics bookings are non-transferable",
];

export default function LogisticsPage() {
    const [ticketId, setTicketId] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [freeSlots, _setFreeSlots] = useState(50); // First 50 get free logistics

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleVerifyTicket = async () => {
        if (!ticketId.trim()) return;

        setIsVerifying(true);
        // Simulate verification - in production, this would call an API
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsVerified(true);
        setIsVerifying(false);
    };

    const handleBookLogistics = () => {
        if (!selectedRoute) return;
        // In production, this would process the booking
        alert(
            `Logistics booked for route: ${PICKUP_ROUTES.find((r) => r.id === selectedRoute)?.name}\n${freeSlots > 0 ? "🎉 You qualify for FREE logistics!" : ""}`
        );
    };

    return (
        <main className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-orange/10 to-transparent" />
                <div className="container mx-auto px-4 relative z-10">
                    {/* Back Link */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <Image
                            src="/iaf_logo.jpeg"
                            alt="Ilorin Car Show Logo"
                            width={120}
                            height={120}
                            className="object-contain"
                        />
                    </div>

                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
                            <Bus className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-400 text-sm font-semibold">Event Logistics</span>
                        </div>

                        <h1 className="font-heading text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-4">
                            Event Logistics &{" "}
                            <span className="text-brand-orange">Transportation</span>
                        </h1>

                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            To ensure a smooth and stress-free festival experience, we are providing
                            scheduled pick-up and drop-off transportation from selected locations
                            across Ilorin and its environs.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Special Offer Banner */}
            <section className="py-6 bg-gradient-to-r from-green-500/20 via-green-500/10 to-green-500/20 border-y border-green-500/30">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center gap-3 text-center"
                    >
                        <Gift className="w-6 h-6 text-green-400" />
                        <p className="text-green-400 font-bold text-lg">
                            🔥 SPECIAL OFFER: FREE logistics for the first 50 successful registrations!
                        </p>
                        <span className="bg-green-500/30 text-green-300 px-3 py-1 rounded-full text-sm font-bold">
                            {freeSlots} slots left
                        </span>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Ticket Verification Notice */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-12"
                    >
                        <Card className="bg-yellow-500/10 border-yellow-500/30">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-yellow-500/20 p-3 rounded-full">
                                        <AlertTriangle className="w-6 h-6 text-yellow-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-yellow-400 font-bold text-lg mb-2">
                                            Ticket Verification Required
                                        </h3>
                                        <p className="text-gray-300">
                                            Logistics booking is only available to{" "}
                                            <span className="text-yellow-400 font-semibold">
                                                confirmed ticket holders
                                            </span>
                                            . Please enter your Ticket ID to verify eligibility before
                                            accessing logistics options.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Ticket Verification Form */}
                    {!isVerified && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mb-12"
                        >
                            <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10">
                                <CardContent className="p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Ticket className="w-6 h-6 text-brand-orange" />
                                        <h2 className="text-xl font-bold text-white">
                                            Verify Your Ticket
                                        </h2>
                                    </div>

                                    <div className="flex gap-4">
                                        <Input
                                            type="text"
                                            placeholder="Enter your Ticket ID (e.g., ICS-2026-XXXX)"
                                            value={ticketId}
                                            onChange={(e) => setTicketId(e.target.value)}
                                            className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                                        />
                                        <Button
                                            onClick={handleVerifyTicket}
                                            disabled={!ticketId.trim() || isVerifying}
                                            className="bg-brand-orange hover:bg-orange-600 text-white font-bold px-8"
                                        >
                                            {isVerifying ? "Verifying..." : "Verify"}
                                        </Button>
                                    </div>

                                    <p className="text-gray-500 text-sm mt-4">
                                        <Shield className="w-4 h-4 inline mr-1" />
                                        Only attendees with valid tickets can book event logistics.
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Verified - Show Routes */}
                    {isVerified && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {/* Verification Success */}
                            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                                <CheckCircle2 className="w-6 h-6 text-green-400" />
                                <span className="text-green-400 font-semibold">
                                    Ticket verified! You can now book logistics.
                                </span>
                            </div>

                            {/* Pickup Routes */}
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <MapPin className="w-6 h-6 text-brand-orange" />
                                    Select Your Pickup Route
                                </h2>

                                <div className="grid gap-4">
                                    {PICKUP_ROUTES.map((route) => (
                                        <Card
                                            key={route.id}
                                            className={`cursor-pointer transition-all duration-300 ${
                                                selectedRoute === route.id
                                                    ? "bg-brand-orange/20 border-brand-orange"
                                                    : "bg-white/5 border-white/10 hover:border-white/30"
                                            }`}
                                            onClick={() => setSelectedRoute(route.id)}
                                        >
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-3xl">{route.icon}</span>
                                                        <div>
                                                            <h3 className="text-white font-bold text-lg">
                                                                {route.name}
                                                            </h3>
                                                            <p className="text-gray-400 text-sm">
                                                                Round Trip
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-brand-orange font-bold text-xl">
                                                            {formatPrice(route.price)}
                                                        </p>
                                                        {freeSlots > 0 && (
                                                            <p className="text-green-400 text-sm font-semibold">
                                                                FREE for early birds!
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Book Button */}
                            <Button
                                onClick={handleBookLogistics}
                                disabled={!selectedRoute}
                                className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-6 text-lg"
                            >
                                <Bus className="w-5 h-5 mr-2" />
                                Book Logistics
                                {freeSlots > 0 && " (FREE!)"}
                            </Button>
                        </motion.div>
                    )}

                    {/* Important Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-16"
                    >
                        <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10">
                            <CardContent className="p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <Info className="w-6 h-6 text-blue-400" />
                                    <h2 className="text-xl font-bold text-white">
                                        Important Logistics Information
                                    </h2>
                                </div>

                                <ul className="space-y-4">
                                    {IMPORTANT_INFO.map((info, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start gap-3 text-gray-300"
                                        >
                                            <Clock className="w-5 h-5 text-brand-orange mt-0.5 flex-shrink-0" />
                                            <span>{info}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Confirmation Notice */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8"
                    >
                        <Card className="bg-green-500/10 border-green-500/30">
                            <CardContent className="p-6">
                                <h3 className="text-green-400 font-bold mb-3">
                                    Upon successful booking, you will receive:
                                </h3>
                                <ul className="space-y-2 text-gray-300">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        Logistics confirmation
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        Assigned pickup route
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        Further instructions closer to the event date
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Disclaimer */}
                    <p className="text-gray-500 text-sm text-center mt-8">
                        Ilorin Automotive Festival reserves the right to adjust logistics schedules
                        to ensure safety and efficiency.
                    </p>
                </div>
            </section>
        </main>
    );
}
