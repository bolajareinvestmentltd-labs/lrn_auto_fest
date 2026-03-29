"use client";

import { useState, useEffect } from "react";
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
    Clock,
    Camera,
    RefreshCw,
    Users,
    Lock // For Security UI
} from "lucide-react";
import Image from "next/image";
import Script from "next/script";

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
    // --- SECURITY STATE ---
    const [pin, setPin] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loginError, setLoginError] = useState(false);

    // --- ORIGINAL STATES ---
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [result, setResult] = useState<VerificationResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    
    // --- NEW STATES FOR SCANNER AND STATS ---
    const [isScannerActive, setIsScannerActive] = useState(false);
    const [stats, setStats] = useState({ total: 0, vip: 0, regular: 0 });

    // --- SECURITY LOGIC ---
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (pin === "2026") {
            setIsAuthorized(true);
            setLoginError(false);
        } else {
            setLoginError(true);
            setPin("");
        }
    };

    // --- SAFE CAMERA SCANNER LOGIC ---
    // 1. Simply trigger the UI state
    const startScanner = () => {
        setIsScannerActive(true);
        setError(null);
    };

    // 2. Safely launch the camera only AFTER the UI is visible
    useEffect(() => {
        let scanner: any = null;

        if (isScannerActive) {
            const initScanner = async () => {
                try {
                    // Check if the script has finished downloading
                    if (!(window as any).Html5Qrcode) {
                        setError("Camera library still loading... close and tap again.");
                        setIsScannerActive(false);
                        return;
                    }

                    scanner = new (window as any).Html5Qrcode("reader");
                    await scanner.start(
                        { facingMode: "environment" }, // Forces the back camera
                        { fps: 10, qrbox: { width: 250, height: 250 } },
                        (decodedText: string) => {
                            // On successful scan!
                            if (scanner) {
                                scanner.stop().then(() => {
                                    setIsScannerActive(false);
                                    handleSearch(decodedText);
                                });
                            }
                        },
                        (scanError: string) => { /* Ignore background scanning noise */ }
                    );
                } catch (err: any) {
                    console.error("Camera Boot Error:", err);
                    setError(`Camera Blocked: ${err?.message || "Please check phone permissions"}`);
                    setIsScannerActive(false);
                }
            };

            // Wait exactly 400ms for the Framer Motion animation to finish opening the box
            setTimeout(initScanner, 400); 
        }

        // Cleanup: Turn off the camera if the user hits "Cancel"
        return () => {
            if (scanner && scanner.isScanning) {
                scanner.stop().catch(console.error);
            }
        };
    }, [isScannerActive]);

    const handleSearch = async (manualCode?: string) => {
        const codeToUse = manualCode || searchQuery;
        if (!codeToUse.trim()) {
            setError("Please enter your ticket number");
            return;
        }

        setIsSearching(true);
        setError(null);
        setResult(null);
        setIsCheckedIn(false);

        try {
            // 1. Hit your ACTUAL API path
            const response = await fetch("/api/admin/verify-ticket", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticketCode: codeToUse.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Ticket not found");
            }

            // 2. Map Database Data to your VerificationResult Interface
            const newResult: VerificationResult = {
                valid: data.success,
                type: "ticket",
                data: {
                    orderNumber: data.ticket.ticketCode,
                    customerName: data.ticket.customerName,
                    customerEmail: data.ticket.email,
                    itemName: `${data.ticket.tier} (${data.ticket.groupSize})`,
                    status: "PAID",
                    purchaseDate: new Date().toLocaleDateString(),
                }
            };

            setResult(newResult);
            setIsCheckedIn(true);

            // Update Stats locally
            setStats(prev => ({
                total: prev.total + 1,
                vip: data.ticket.tier?.includes("VIP") ? prev.vip + 1 : prev.vip,
                regular: !data.ticket.tier?.includes("VIP") ? prev.regular + 1 : prev.regular,
            }));
            
        } catch (err) {
            setError(err instanceof Error ? err.message : "Invalid Ticket ID");
        } finally {
            setIsSearching(false);
        }
    };

    // --- SECURITY SHIELD RENDER ---
    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm space-y-8 text-center">
                    <div className="space-y-2">
                        <div className="inline-flex p-4 bg-orange-500/10 rounded-full border border-orange-500/20 mb-4">
                            <Lock className="w-8 h-8 text-orange-500" />
                        </div>
                        <h1 className="text-2xl font-black uppercase tracking-widest">GATE SECURE</h1>
                        <p className="text-zinc-500 text-xs uppercase tracking-widest">Staff PIN Required</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            inputMode="numeric"
                            placeholder="PIN"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className={`w-full bg-zinc-900 border-2 ${loginError ? 'border-red-500' : 'border-zinc-800'} rounded-2xl p-5 text-center text-4xl font-black text-orange-500 outline-none focus:border-orange-500 transition-all`}
                        />
                        <Button className="w-full bg-orange-500 hover:bg-orange-600 py-6 rounded-2xl text-lg font-bold uppercase italic">Unlock System</Button>
                        {loginError && <p className="text-red-500 text-xs font-bold uppercase">Invalid PIN</p>}
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#050505] flex flex-col">
            <Script src="https://unpkg.com/html5-qrcode" strategy="beforeInteractive" />

            <header className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Image src="/images/logo.png" alt="IAF 2026" width={40} height={40} className="rounded-lg" />
                    <h1 className="text-xl font-bold text-white">IAF 2026 Check-In</h1>
                </div>
                <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-full flex items-center gap-2">
                    <Users className="w-3 h-3 text-brand-orange" />
                    <span className="text-xs font-black text-white">{stats.total}</span>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6">
                <AnimatePresence mode="wait">
                    {isScannerActive ? (
                        <motion.div key="scanner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-md space-y-4">
                            <div id="reader" className="overflow-hidden rounded-3xl border-2 border-brand-orange bg-zinc-900 aspect-square shadow-2xl shadow-orange-500/20"></div>
                            <Button onClick={() => setIsScannerActive(false)} variant="outline" className="w-full border-white/10 text-white h-14 font-bold">
                                <RefreshCw className="mr-2 w-4 h-4" /> Cancel Scanner
                            </Button>
                        </motion.div>
                    ) : !result ? (
                        <motion.div key="search" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md space-y-6">
                            
                            {/* GATE STATS CARD */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl text-center">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Scanned</p>
                                    <p className="text-xl font-black text-white">{stats.total}</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl text-center">
                                    <p className="text-[10px] text-cyan-500 font-bold uppercase">VIP</p>
                                    <p className="text-xl font-black text-cyan-400">{stats.vip}</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl text-center">
                                    <p className="text-[10px] text-orange-500 font-bold uppercase">Regular</p>
                                    <p className="text-xl font-black text-brand-orange">{stats.regular}</p>
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-orange/20 mb-4">
                                    <QrCode className="w-10 h-10 text-brand-orange" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Welcome to IAF 2026!</h2>
                                <p className="text-gray-400">Scan QR code or enter ticket details</p>
                            </div>

                            <div className="space-y-4">
                                <Button 
                                    onClick={startScanner}
                                    className="w-full bg-white text-black hover:bg-gray-200 font-black py-10 text-xl rounded-[32px] flex flex-col items-center justify-center gap-1 shadow-2xl mb-4"
                                >
                                    <Camera className="w-8 h-8" />
                                    <span>TAP TO SCAN QR</span>
                                </Button>

                                <div className="relative flex items-center py-2">
                                    <div className="flex-grow border-t border-white/10"></div>
                                    <span className="flex-shrink mx-4 text-gray-500 text-[10px] font-black uppercase tracking-widest">Manual Entry</span>
                                    <div className="flex-grow border-t border-white/10"></div>
                                </div>

                                <div className="relative">
                                    <Input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                        placeholder="Ticket ID or Email..."
                                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 h-14 text-lg pl-12 font-mono"
                                    />
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                </div>

                                <Button onClick={() => handleSearch()} disabled={isSearching} className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-6 text-lg">
                                    {isSearching ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                                    {isSearching ? "Verifying..." : "Verify Manually"}
                                </Button>
                            </div>

                            {error && (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                                    <p className="text-red-400 font-bold uppercase text-xs italic">{error}</p>
                                </motion.div>
                            )}

                            <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-3">
                                <div className="flex items-center gap-3 text-gray-400"><Calendar className="w-5 h-5 text-brand-orange" /><span>May 30, 2026</span></div>
                                <div className="flex items-center gap-3 text-gray-400"><Clock className="w-5 h-5 text-brand-orange" /><span>Gates open at 9:00 AM</span></div>
                                <div className="flex items-center gap-3 text-gray-400"><MapPin className="w-5 h-5 text-brand-orange" /><span>Metropolitan Square, Ilorin</span></div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-md">
                            {result.valid ? (
                                <div className="space-y-6">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="flex flex-col items-center">
                                        <div className={`w-32 h-32 rounded-full flex items-center justify-center ${isCheckedIn ? "bg-green-500 shadow-2xl shadow-green-500/40" : "bg-green-500/20 border-4 border-green-500"}`}>
                                            <CheckCircle2 className={`w-16 h-16 ${isCheckedIn ? "text-white" : "text-green-500"}`} />
                                        </div>
                                        <h2 className="text-4xl font-black text-green-500 mt-4 uppercase italic">ACCESS GRANTED</h2>
                                        <p className="text-gray-400 text-center mt-2">Entry has been logged in the system</p>
                                    </motion.div>

                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-white/10 to-white/5 rounded-[40px] border border-white/20 overflow-hidden shadow-2xl p-8 space-y-6">
                                        <div><p className="text-[10px] text-gray-500 uppercase font-black mb-1">Pass Holder</p><p className="text-3xl font-black text-white leading-none tracking-tight italic">{result.data.customerName}</p></div>
                                        <div className="bg-white/5 rounded-3xl p-4 border border-white/5 text-center"><p className="text-[10px] text-gray-500 uppercase font-black mb-1">Pass Detail</p><p className="text-xl font-bold text-brand-orange italic tracking-tighter uppercase">{result.data.itemName}</p></div>
                                        <div className="flex justify-between items-center pt-3 border-t border-white/5"><span className="text-gray-500 text-xs font-black uppercase">Ticket ID</span><span className="text-white font-mono font-bold tracking-widest bg-white/5 px-2 py-1 rounded">{result.data.orderNumber}</span></div>
                                    </motion.div>

                                    <Button onClick={() => { setResult(null); setSearchQuery(""); setIsCheckedIn(false); }} className="w-full bg-white text-black hover:bg-gray-200 font-black h-20 rounded-[32px] text-xl shadow-xl uppercase italic">Next Scan</Button>
                                </div>
                            ) : (
                                <div className="space-y-6 text-center">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                                        <div className="w-32 h-32 rounded-full bg-red-500/20 border-4 border-red-500 flex items-center justify-center mx-auto"><XCircle className="w-16 h-16 text-red-500" /></div>
                                        <h2 className="text-3xl font-black text-red-500 mt-4 uppercase italic">INVALID TICKET</h2>
                                        <p className="text-gray-400 mt-2">Could not verify this ticket</p>
                                    </motion.div>
                                    <Button onClick={() => { setResult(null); setSearchQuery(""); }} className="w-full bg-brand-orange hover:bg-orange-600 font-bold h-14 rounded-xl">Try Again</Button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <footer className="p-4 border-t border-white/10 text-center">
                <p className="text-gray-600 text-xs font-bold tracking-widest uppercase italic">Ilorin Automotive Festival 2026 Gate Control</p>
            </footer>
        </div>
    );
}
