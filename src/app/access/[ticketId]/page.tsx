"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
    Users,
    MapPin,
    ExternalLink,
} from "lucide-react";
import Image from "next/image";

const GOOGLE_MAPS_URL =
    "https://www.google.com/maps/dir/?api=1&destination=8.4799,4.5418&travelmode=driving";

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
        groupSize?: string;
        parkingPasses?: number;
        usedAccess?: number;
        totalAccess?: number;
        remainingAccess?: number;
    };
    error?: string;
}

export default function TicketVerificationPage() {
    const params = useParams();
    const ticketId = (params.ticketId as string)?.toUpperCase() || "";
    const [isVerifying, setIsVerifying] = useState(true);
    const [result, setResult] = useState<VerificationResult | null>(null);

    useEffect(() => {
        if (!ticketId) return;

        async function verify() {
            setIsVerifying(true);
            try {
                const response = await fetch("/api/access/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ticketId }),
                });
                const data = await response.json();
                setResult(data);
            } catch {
                setResult({
                    success: false,
                    message: "Network error. Please try again.",
                    accessType: "ATTENDEE",
                    error: "Could not connect to server",
                });
            } finally {
                setIsVerifying(false);
            }
        }

        verify();
    }, [ticketId]);

    const getStatusIcon = () => {
        if (!result?.data) return null;
        switch (result.data.status) {
            case "VALID":
                return <CheckCircle2 className="w-20 h-20 text-green-400" />;
            case "ALREADY_USED":
                return <AlertTriangle className="w-20 h-20 text-yellow-400" />;
            case "ACCESS_LIMIT_REACHED":
                return <Shield className="w-20 h-20 text-red-400" />;
            default:
                return <XCircle className="w-20 h-20 text-red-500" />;
        }
    };

    const getStatusColor = () => {
        if (!result?.data) return "border-red-500/30 bg-red-500/5";
        switch (result.data.status) {
            case "VALID":
                return "border-green-500/30 bg-green-500/5";
            case "ALREADY_USED":
                return "border-yellow-500/30 bg-yellow-500/5";
            default:
                return "border-red-500/30 bg-red-500/5";
        }
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
                    {/* Loading State */}
                    {isVerifying && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center space-y-4"
                        >
                            <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto" />
                            <p className="text-gray-400 text-lg">Verifying ticket...</p>
                            <p className="text-gray-600 font-mono text-sm">{ticketId}</p>
                        </motion.div>
                    )}

                    {/* Result */}
                    {!isVerifying && result && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-md space-y-6"
                        >
                            {/* Status Card */}
                            <div className={`border-2 rounded-2xl p-8 text-center ${getStatusColor()}`}>
                                <div className="flex justify-center mb-4">
                                    {result.data ? getStatusIcon() : <XCircle className="w-20 h-20 text-red-500" />}
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-2">{result.message}</h2>

                                {result.data?.status === "VALID" && (
                                    <p className="text-green-300 text-sm font-medium">
                                        ✅ Proceed to wristband issuance
                                    </p>
                                )}

                                {result.data?.status === "ALREADY_USED" && (
                                    <p className="text-yellow-300 text-sm font-medium">
                                        ⚠️ This ticket has already been used for entry
                                    </p>
                                )}

                                {result.data?.status === "ACCESS_LIMIT_REACHED" && (
                                    <p className="text-red-300 text-sm font-medium">
                                        🚫 All access entries for this vendor have been used
                                    </p>
                                )}

                                {result.error && !result.data && (
                                    <p className="text-red-300 text-sm">{result.error}</p>
                                )}
                            </div>

                            {/* Details Card */}
                            {result.data && result.data.status === "VALID" && (
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                                    <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                                        {result.data.accessType === "Vendor" ? (
                                            <Store className="w-5 h-5 text-brand-orange" />
                                        ) : (
                                            <Ticket className="w-5 h-5 text-brand-orange" />
                                        )}
                                        Entry Details
                                    </h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Name</p>
                                            <p className="text-white font-medium flex items-center gap-1">
                                                <User className="w-4 h-4 text-gray-400" />
                                                {result.data.name}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Ticket Type</p>
                                            <p className="text-white font-medium">{result.data.ticketType}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Access Type</p>
                                            <p className="text-white font-medium flex items-center gap-1">
                                                {result.data.accessType === "Vendor" ? (
                                                    <Store className="w-4 h-4 text-brand-orange" />
                                                ) : (
                                                    <Users className="w-4 h-4 text-brand-blue" />
                                                )}
                                                {result.data.accessType}
                                            </p>
                                        </div>
                                        {result.data.groupSize && (
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase">Group</p>
                                                <p className="text-white font-medium">{result.data.groupSize}</p>
                                            </div>
                                        )}
                                        {result.data.parkingPasses !== undefined && result.data.parkingPasses > 0 && (
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase">Parking</p>
                                                <p className="text-white font-medium">{result.data.parkingPasses} pass(es)</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Vendor access counter */}
                                    {result.data.totalAccess !== undefined && (
                                        <div className="pt-4 border-t border-white/10">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-400">Access Used</span>
                                                <span className="text-white font-mono">
                                                    {result.data.usedAccess} of {result.data.totalAccess}
                                                </span>
                                            </div>
                                            <progress
                                                className="w-full h-2 rounded-full [&::-webkit-progress-bar]:bg-white/10 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:bg-brand-orange [&::-webkit-progress-value]:rounded-full [&::-moz-progress-bar]:bg-brand-orange [&::-moz-progress-bar]:rounded-full"
                                                value={result.data.usedAccess || 0}
                                                max={result.data.totalAccess || 1}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                {result.data.remainingAccess} entries remaining
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Ticket ID display */}
                            <div className="text-center text-sm text-gray-600 font-mono">
                                Ticket: {ticketId}
                            </div>

                            {/* Venue Info */}
                            <a
                                href={GOOGLE_MAPS_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 text-gray-500 hover:text-brand-blue transition-colors text-xs"
                            >
                                <MapPin className="w-3 h-3" />
                                <span>Metropolitan Square, Asadam Road, Ilorin</span>
                                <ExternalLink className="w-3 h-3" />
                            </a>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <a
                                    href="/access"
                                    className="flex-1 text-center py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                                >
                                    Verify Another
                                </a>
                            </div>
                        </motion.div>
                    )}

                    {/* No ticket ID */}
                    {!isVerifying && !result && (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center space-y-4"
                        >
                            <QrCode className="w-16 h-16 text-gray-600 mx-auto" />
                            <p className="text-gray-400">No ticket ID provided</p>
                            <a
                                href="/access"
                                className="inline-block py-3 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
                            >
                                Go to Verification Page
                            </a>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Footer */}
            <footer className="p-4 border-t border-white/10 text-center">
                <p className="text-gray-600 text-xs">
                    Show this screen to event staff for wristband issuance.
                </p>
            </footer>
        </div>
    );
}
