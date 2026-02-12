"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Search, 
    CheckCircle2, 
    XCircle, 
    Ticket, 
    ShoppingBag, 
    Loader2,
    QrCode,
    User,
    Calendar,
    MapPin,
    Clock
} from "lucide-react";
import Image from "next/image";

interface VerificationResult {
    valid: boolean;
    type: "ticket" | "merch";
    data: {
        orderNumber: string;
        customerName: string;
        customerEmail: string;
        itemName: string;
        quantity?: number;
        size?: string;
        status: string;
        purchaseDate: string;
        checkInTime?: string;
    };
}

export default function CheckInPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [result, setResult] = useState<VerificationResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCheckedIn, setIsCheckedIn] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setError("Please enter your ticket number or email");
            return;
        }

        setIsSearching(true);
        setError(null);
        setResult(null);
        setIsCheckedIn(false);

        try {
            const response = await fetch(`/api/check-in?query=${encodeURIComponent(searchQuery.trim())}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Ticket not found");
            }

            setResult(data);
            
            // Auto check-in after verification
            if (data.valid && data.data.status === "PAID") {
                await handleCheckIn(data.data.orderNumber, data.type);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsSearching(false);
        }
    };

    const handleCheckIn = async (orderNumber: string, type: string) => {
        try {
            const response = await fetch("/api/check-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderNumber, type }),
            });

            if (response.ok) {
                setIsCheckedIn(true);
            }
        } catch (err) {
            console.error("Check-in failed:", err);
        }
    };

    const eventDate = new Date("2026-05-30T09:00:00");

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#050505] flex flex-col">
            {/* Header */}
            <header className="p-4 border-b border-white/10">
                <div className="flex items-center justify-center gap-3">
                    <Image
                        src="/images/logo.png"
                        alt="IAF 2026"
                        width={40}
                        height={40}
                        className="rounded-lg"
                    />
                    <h1 className="text-xl font-bold text-white">IAF 2026 Check-In</h1>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6">
                <AnimatePresence mode="wait">
                    {!result ? (
                        /* Search Form */
                        <motion.div
                            key="search"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-md space-y-6"
                        >
                            {/* Welcome Message */}
                            <div className="text-center space-y-2">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-orange/20 mb-4">
                                    <QrCode className="w-10 h-10 text-brand-orange" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Welcome to IAF 2026!</h2>
                                <p className="text-gray-400">
                                    Enter your ticket number or email to verify your entry
                                </p>
                            </div>

                            {/* Search Input */}
                            <div className="space-y-4">
                                <div className="relative">
                                    <Input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                        placeholder="Ticket number or email..."
                                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 h-14 text-lg pl-12"
                                    />
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                </div>

                                <Button
                                    onClick={handleSearch}
                                    disabled={isSearching}
                                    className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-6 text-lg"
                                >
                                    {isSearching ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-5 h-5 mr-2" />
                                            Verify My Ticket
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3"
                                >
                                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                                    <p className="text-red-400">{error}</p>
                                </motion.div>
                            )}

                            {/* Event Info */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-3">
                                <div className="flex items-center gap-3 text-gray-400">
                                    <Calendar className="w-5 h-5 text-brand-orange" />
                                    <span>May 30, 2026</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-400">
                                    <Clock className="w-5 h-5 text-brand-orange" />
                                    <span>Gates open at 9:00 AM</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-400">
                                    <MapPin className="w-5 h-5 text-brand-orange" />
                                    <span>Metropolitan Square, Ilorin</span>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        /* Verification Result */
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full max-w-md"
                        >
                            {result.valid ? (
                                /* Valid Ticket */
                                <div className="space-y-6">
                                    {/* Big Green Checkmark */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", delay: 0.2 }}
                                        className="flex flex-col items-center"
                                    >
                                        <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
                                            isCheckedIn 
                                                ? "bg-green-500" 
                                                : "bg-green-500/20 border-4 border-green-500"
                                        }`}>
                                            <CheckCircle2 className={`w-16 h-16 ${
                                                isCheckedIn ? "text-white" : "text-green-500"
                                            }`} />
                                        </div>
                                        <h2 className="text-3xl font-black text-green-500 mt-4">
                                            {isCheckedIn ? "CHECKED IN!" : "VALID TICKET"}
                                        </h2>
                                        <p className="text-gray-400 text-center mt-2">
                                            {isCheckedIn 
                                                ? "Show this screen to gate staff" 
                                                : "Your ticket has been verified"
                                            }
                                        </p>
                                    </motion.div>

                                    {/* Ticket Details Card */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 overflow-hidden"
                                    >
                                        {/* Type Badge */}
                                        <div className={`px-4 py-3 flex items-center gap-2 ${
                                            result.type === "ticket" 
                                                ? "bg-brand-orange/20" 
                                                : "bg-brand-blue/20"
                                        }`}>
                                            {result.type === "ticket" ? (
                                                <Ticket className="w-5 h-5 text-brand-orange" />
                                            ) : (
                                                <ShoppingBag className="w-5 h-5 text-brand-blue" />
                                            )}
                                            <span className={`font-bold ${
                                                result.type === "ticket" 
                                                    ? "text-brand-orange" 
                                                    : "text-brand-blue"
                                            }`}>
                                                {result.type === "ticket" ? "EVENT TICKET" : "MERCHANDISE"}
                                            </span>
                                        </div>

                                        {/* Details */}
                                        <div className="p-5 space-y-4">
                                            {/* Customer Name */}
                                            <div className="flex items-center gap-3">
                                                <User className="w-5 h-5 text-gray-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase">Guest Name</p>
                                                    <p className="text-xl font-bold text-white">
                                                        {result.data.customerName}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Item */}
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <p className="text-xs text-gray-500 uppercase mb-1">
                                                    {result.type === "ticket" ? "Ticket Type" : "Item"}
                                                </p>
                                                <p className="text-lg font-semibold text-white">
                                                    {result.data.itemName}
                                                    {result.data.size && ` (Size: ${result.data.size})`}
                                                    {result.data.quantity && result.data.quantity > 1 && ` x${result.data.quantity}`}
                                                </p>
                                            </div>

                                            {/* Order Number */}
                                            <div className="flex justify-between items-center pt-3 border-t border-white/10">
                                                <span className="text-gray-500 text-sm">Order #</span>
                                                <span className="text-white font-mono font-bold">
                                                    {result.data.orderNumber}
                                                </span>
                                            </div>

                                            {/* Check-in Time */}
                                            {isCheckedIn && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-500 text-sm">Checked In</span>
                                                    <span className="text-green-400 font-semibold">
                                                        {new Date().toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>

                                    {/* Search Again */}
                                    <Button
                                        onClick={() => {
                                            setResult(null);
                                            setSearchQuery("");
                                            setIsCheckedIn(false);
                                        }}
                                        variant="outline"
                                        className="w-full border-white/20 text-white hover:bg-white/10"
                                    >
                                        Check Another Ticket
                                    </Button>
                                </div>
                            ) : (
                                /* Invalid Ticket */
                                <div className="space-y-6 text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="flex flex-col items-center"
                                    >
                                        <div className="w-32 h-32 rounded-full bg-red-500/20 border-4 border-red-500 flex items-center justify-center">
                                            <XCircle className="w-16 h-16 text-red-500" />
                                        </div>
                                        <h2 className="text-3xl font-black text-red-500 mt-4">
                                            INVALID
                                        </h2>
                                        <p className="text-gray-400 mt-2">
                                            This ticket could not be verified
                                        </p>
                                    </motion.div>

                                    <Button
                                        onClick={() => {
                                            setResult(null);
                                            setSearchQuery("");
                                        }}
                                        className="w-full bg-brand-orange hover:bg-orange-600"
                                    >
                                        Try Again
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Footer */}
            <footer className="p-4 border-t border-white/10 text-center">
                <p className="text-gray-500 text-sm">
                    Ilorin Automotive Festival 2026
                </p>
            </footer>
        </div>
    );
}
