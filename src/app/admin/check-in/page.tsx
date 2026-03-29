"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, ShieldCheck } from "lucide-react";

export default function GateCheckIn() {
    const [ticketCode, setTicketCode] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ticketCode) return;

        setLoading(true);
        setResult(null);

        try {
            const response = await fetch("/api/admin/verify-ticket", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticketCode: ticketCode.trim().toUpperCase() }),
            });

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setResult({ success: false, message: "Network Error. Check Signal." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6">
            <div className="max-w-md mx-auto space-y-8">
                <div className="flex flex-col items-center space-y-2">
                    <ShieldCheck className="w-12 h-12 text-brand-orange" />
                    <h1 className="text-xl font-black uppercase tracking-widest text-white">IAF 2026 GATE CONTROL</h1>
                </div>

                <form onSubmit={handleVerify} className="space-y-4">
                    <input
                        type="text"
                        placeholder="ENTER TICKET ID (e.g. ORD-XXXX)"
                        value={ticketCode}
                        onChange={(e) => setTicketCode(e.target.value)}
                        className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl p-5 text-center text-2xl font-mono text-brand-orange focus:border-brand-orange outline-none"
                    />
                    <Button 
                        disabled={loading}
                        className="w-full bg-brand-orange hover:bg-orange-600 py-8 rounded-2xl text-xl font-bold"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "VERIFY ACCESS"}
                    </Button>
                </form>

                {result && (
                    <div className={`p-8 rounded-3xl border-2 text-center animate-in zoom-in duration-300 ${result.success ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500'}`}>
                        {result.success ? (
                            <div className="space-y-4">
                                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                                <h2 className="text-2xl font-black text-green-500">APPROVED</h2>
                                <div className="text-left bg-black/40 p-4 rounded-xl">
                                    <p className="text-[10px] text-zinc-500 uppercase">Attendee</p>
                                    <p className="text-lg font-bold text-white">{result.attendee}</p>
                                    <p className="text-[10px] text-zinc-500 uppercase mt-3">Tier</p>
                                    <p className="text-cyan-400 font-bold">{result.tier}</p>
                                </div>
                                <Button onClick={() => {setResult(null); setTicketCode("");}} className="w-full bg-white text-black font-bold">SCAN NEXT</Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                                <h2 className="text-2xl font-black text-red-500">DENIED</h2>
                                <p className="text-zinc-400 text-sm">{result.message}</p>
                                <Button onClick={() => setResult(null)} variant="outline" className="w-full border-zinc-800">TRY AGAIN</Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
