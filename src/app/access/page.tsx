"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    QrCode,
    CheckCircle2,
    XCircle,
    Loader2,
    Ticket,
    User,
    Shield,
    AlertTriangle,
    Store,
    Users
} from "lucide-react";
import Image from "next/image";

interface VerificationResult {
    success: boolean;
    message: string;
    accessType: "ATTENDEE" | "VENDOR";
    data?: {
        name: string;
        ticketType: string;
        accessType: string;
        status: "VALID" | "ALREADY_USED" | "INVALID" | "ACCESS_LIMIT_REACHED";
        instruction?: string;
        // For attendees
        groupSize?: string;
        parkingPasses?: number;
        // For vendors
        usedAccess?: number;
        totalAccess?: number;
        remainingAccess?: number;
    };
    error?: string;
}

export default function PublicAccessPage() {
    const [ticketId, setTicketId] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [result, setResult] = useState<VerificationResult | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus input on load
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Clear result after 15 seconds
    useEffect(() => {
        if (result) {
            const timer = setTimeout(() => {
                setResult(null);
                setTicketId("");
                inputRef.current?.focus();
            }, 15000);
            return () => clearTimeout(timer);
        }
    }, [result]);

    const handleVerify = async () => {
        if (!ticketId.trim()) return;

        setIsVerifying(true);
        setResult(null);

        try {
            const response = await fetch("/api/access/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticketId: ticketId.trim().toUpperCase() }),
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({
                success: false,
                message: "Network error. Please try again.",
                accessType: "ATTENDEE",
                error: "Could not connect to server",
            });
        } finally {
            setIsVerifying(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleVerify();
        }
    };

    const handleReset = () => {
        setResult(null);
        setTicketId("");
        inputRef.current?.focus();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#050505] flex flex-col">
            {/* Header */}
            <header className="p-4 border-b border-white/10 bg-black/50">
                <div className="flex items-center justify-center gap-3">
                    <Image
                        src="/images/logo.png"
                        alt="IAF 2026"
                        width={48}
                        height={48}
                        className="rounded-lg"
                    />
                    <div className="text-center">
                        <h1 className="text-xl font-bold text-white">Ilorin Automotive Festival 2026</h1>
                        <p className="text-sm text-gray-400">Ticket Verification System</p>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
                <AnimatePresence mode="wait">
                    {!result ? (
                        /* Verification Form */
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-md space-y-6"
                        >
                            {/* QR Icon */}
                            <div className="text-center space-y-4">
                                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-orange-500/20 mb-4">
                                    <QrCode className="w-12 h-12 text-orange-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Verify Your Entry</h2>
                                <p className="text-gray-400 text-sm px-4">
                                    Scan this code, enter your Ticket ID, and show the confirmation screen to event staff for wristband issuance.
                                </p>
                            </div>

                            {/* Input Form */}
                            <div className="space-y-4">
                                <div className="relative">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={ticketId}
                                        onChange={(e) => setTicketId(e.target.value.toUpperCase())}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Enter Ticket ID (e.g., ICS-XXX-XXX)"
                                        className="w-full px-5 py-4 bg-white/5 border border-white/20 rounded-xl text-white text-lg font-mono tracking-wider placeholder:text-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                                        autoComplete="off"
                                        autoCapitalize="characters"
                                    />
                                    <Ticket className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                </div>

                                <button
                                    onClick={handleVerify}
                                    disabled={isVerifying || !ticketId.trim()}
                                    className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    {isVerifying ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="w-5 h-5" />
                                            Verify Ticket
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Help Text */}
                            <div className="text-center text-xs text-gray-500 space-y-1">
                                <p>Your Ticket ID is on your confirmation email or ticket PDF</p>
                                <p>Format: ICS-XXXXXX-XXXX or VND-XXXXX</p>
                            </div>
                        </motion.div>
                    ) : (
                        /* Result Display */
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md"
                        >
                            <div
                                className={`rounded-3xl p-6 sm:p-8 border-4 ${result.success
                                    ? "bg-green-500/10 border-green-500"
                                    : "bg-red-500/10 border-red-500"
                                    }`}
                            >
                                {/* Status Icon */}
                                <div className="flex justify-center mb-6">
                                    {result.success ? (
                                        <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <CheckCircle2 className="w-16 h-16 text-green-400" />
                                        </div>
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center">
                                            <XCircle className="w-16 h-16 text-red-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Status Message */}
                                <h2
                                    className={`text-2xl sm:text-3xl font-bold text-center mb-4 ${result.success ? "text-green-400" : "text-red-400"
                                        }`}
                                >
                                    {result.data?.status === "VALID"
                                        ? "✅ VALID"
                                        : result.data?.status === "ALREADY_USED"
                                            ? "⛔ Ticket Already Used"
                                            : result.data?.status === "ACCESS_LIMIT_REACHED"
                                                ? "⛔ Access Limit Reached"
                                                : "❌ Invalid Ticket ID"}
                                </h2>

                                {/* Details */}
                                {result.data && result.success && (
                                    <div className="space-y-4 mt-6">
                                        {/* Name */}
                                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                                            <User className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-500">Name</p>
                                                <p className="text-white font-semibold text-lg">{result.data.name}</p>
                                            </div>
                                        </div>

                                        {/* Ticket Type */}
                                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                                            <Ticket className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-500">Ticket Type</p>
                                                <p className="text-white font-semibold">
                                                    {result.data.ticketType?.replace("VIP_", "").replace("_", " ")}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Access Type */}
                                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                                            {result.accessType === "VENDOR" ? (
                                                <Store className="w-5 h-5 text-gray-400" />
                                            ) : (
                                                <Users className="w-5 h-5 text-gray-400" />
                                            )}
                                            <div>
                                                <p className="text-xs text-gray-500">Access Type</p>
                                                <p className="text-white font-semibold">{result.data.accessType}</p>
                                            </div>
                                        </div>

                                        {/* Vendor Access Count */}
                                        {result.accessType === "VENDOR" && result.data.usedAccess !== undefined && (
                                            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                                                <p className="text-blue-300 text-sm font-medium mb-2">Vendor Access</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-white font-bold text-xl">
                                                        {result.data.usedAccess} of {result.data.totalAccess}
                                                    </span>
                                                    <span className="text-blue-300 text-sm">
                                                        {result.data.remainingAccess} remaining
                                                    </span>
                                                </div>
                                                <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full transition-all"
                                                        style={{
                                                            width: `${((result.data.usedAccess || 0) / (result.data.totalAccess || 5)) * 100}%`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Instruction */}
                                        {result.data.instruction && (
                                            <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl mt-4">
                                                <p className="text-green-300 font-semibold text-center">
                                                    {result.data.instruction}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Error Message */}
                                {!result.success && result.error && (
                                    <div className="flex items-center gap-3 p-4 bg-red-500/20 rounded-xl mt-4">
                                        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                        <p className="text-red-300">{result.error}</p>
                                    </div>
                                )}

                                {/* Reset Button */}
                                <button
                                    onClick={handleReset}
                                    className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors"
                                >
                                    Verify Another Ticket
                                </button>
                            </div>

                            {/* Staff Notice */}
                            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-yellow-300 font-semibold text-sm">Staff Notice</p>
                                        <p className="text-yellow-200/70 text-xs mt-1">
                                            Only issue wristband upon VALID status. Do not manually override system decisions.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Footer */}
            <footer className="p-4 text-center border-t border-white/10">
                <p className="text-xs text-gray-500">
                    IAF 2026 • Metropolitan Square, Ilorin • May 30, 2026
                </p>
            </footer>
        </div>
    );
}
