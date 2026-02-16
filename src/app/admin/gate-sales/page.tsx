"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Ticket,
    Plus,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    AlertCircle,
    DollarSign,
    Phone,
    User,
    Clipboard,
    Copy,
    RefreshCw,
    ShieldCheck,
    Banknote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface TicketType {
    id: string;
    ticketType: string;
    name: string;
    price: number;
    available: number;
    manualSalesAllowed: boolean;
    manualSalesRemaining: number;
}

interface ManualSaleResult {
    success: boolean;
    ticketCode?: string;
    orderNumber?: string;
    message?: string;
    error?: string;
}

interface SalesStats {
    totalCashSales: number;
    totalOnlineSales: number;
    cashRevenue: number;
    onlineRevenue: number;
    todayCashSales: number;
}

export default function ManualTicketSalesPage() {
    const router = useRouter();
    const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<ManualSaleResult | null>(null);
    const [stats, setStats] = useState<SalesStats | null>(null);
    const [copied, setCopied] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        ticketType: "",
        quantity: 1,
        buyerPhone: "",
        buyerName: ""
    });

    // Check authentication
    useEffect(() => {
        const auth = sessionStorage.getItem("iaf_admin_auth");
        if (auth !== "true") {
            router.push("/admin");
        }
    }, [router]);

    // Fetch ticket types and stats
    const fetchData = useCallback(async () => {
        try {
            const [ticketsRes, statsRes] = await Promise.all([
                fetch("/api/admin/manual-sales/ticket-types"),
                fetch("/api/admin/manual-sales/stats")
            ]);

            if (ticketsRes.ok) {
                const data = await ticketsRes.json();
                setTicketTypes(data.ticketTypes || []);
            }

            if (statsRes.ok) {
                const data = await statsRes.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.ticketType || !formData.buyerPhone) {
            setResult({
                success: false,
                error: "Please fill in all required fields"
            });
            return;
        }

        // Validate phone number (Nigerian format)
        const phoneRegex = /^(0[7-9][0-1]\d{8}|\+234[7-9][0-1]\d{8})$/;
        if (!phoneRegex.test(formData.buyerPhone.replace(/\s/g, ""))) {
            setResult({
                success: false,
                error: "Please enter a valid Nigerian phone number"
            });
            return;
        }

        setSubmitting(true);
        setResult(null);

        try {
            const response = await fetch("/api/admin/manual-sales/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ticketType: formData.ticketType,
                    quantity: formData.quantity,
                    buyerPhone: formData.buyerPhone,
                    buyerName: formData.buyerName || "Walk-in Customer",
                    paymentMethod: "CASH",
                    adminId: sessionStorage.getItem("iaf_admin_user") || "unknown"
                })
            });

            const data = await response.json();

            if (data.success) {
                setResult({
                    success: true,
                    ticketCode: data.ticketCode,
                    orderNumber: data.orderNumber,
                    message: "Ticket created successfully!"
                });
                // Reset form
                setFormData({
                    ticketType: "",
                    quantity: 1,
                    buyerPhone: "",
                    buyerName: ""
                });
                // Refresh data
                fetchData();
            } else {
                setResult({
                    success: false,
                    error: data.error || "Failed to create ticket"
                });
            }
        } catch (error) {
            setResult({
                success: false,
                error: "Network error. Please try again."
            });
        } finally {
            setSubmitting(false);
        }
    };

    const copyToClipboard = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const selectedTicket = ticketTypes.find(t => t.id === formData.ticketType);
    const totalPrice = selectedTicket ? selectedTicket.price * formData.quantity : 0;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 0
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/dashboard"
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Banknote className="w-6 h-6 text-green-400" />
                                Manual Ticket Sales
                            </h1>
                            <p className="text-sm text-gray-400">Gate Cash Sales (Admin Only)</p>
                        </div>
                    </div>
                    <Button
                        onClick={fetchData}
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-xs text-gray-400">Today&apos;s Cash Sales</p>
                            <p className="text-2xl font-bold text-green-400">{stats.todayCashSales}</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-xs text-gray-400">Total Cash Sales</p>
                            <p className="text-2xl font-bold text-white">{stats.totalCashSales}</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-xs text-gray-400">Cash Revenue</p>
                            <p className="text-lg font-bold text-green-400">{formatCurrency(stats.cashRevenue)}</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-xs text-gray-400">Online Revenue</p>
                            <p className="text-lg font-bold text-blue-400">{formatCurrency(stats.onlineRevenue)}</p>
                        </div>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Booking Form */}
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-orange-500" />
                            Create Manual Ticket
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Ticket Type Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="ticketType" className="text-gray-300">Ticket Type *</Label>
                                <select
                                    id="ticketType"
                                    aria-label="Select ticket type"
                                    value={formData.ticketType}
                                    onChange={(e) => setFormData({ ...formData, ticketType: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-orange-500"
                                    required
                                >
                                    <option value="">Select ticket type</option>
                                    {ticketTypes.map((ticket) => (
                                        <option
                                            key={ticket.id}
                                            value={ticket.id}
                                            disabled={!ticket.manualSalesAllowed || ticket.manualSalesRemaining <= 0}
                                        >
                                            {ticket.name} - {formatCurrency(ticket.price)}
                                            {!ticket.manualSalesAllowed ? " (Disabled)" :
                                                ticket.manualSalesRemaining <= 0 ? " (Limit Reached)" :
                                                    ` (${ticket.manualSalesRemaining} left)`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Quantity */}
                            <div className="space-y-2">
                                <Label className="text-gray-300">Quantity</Label>
                                <div className="flex items-center gap-3">
                                    <Button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, quantity: Math.max(1, formData.quantity - 1) })}
                                        className="bg-white/10 hover:bg-white/20 text-white"
                                        disabled={formData.quantity <= 1}
                                    >
                                        -
                                    </Button>
                                    <span className="text-2xl font-bold text-white w-12 text-center">
                                        {formData.quantity}
                                    </span>
                                    <Button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, quantity: Math.min(10, formData.quantity + 1) })}
                                        className="bg-white/10 hover:bg-white/20 text-white"
                                        disabled={formData.quantity >= 10}
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>

                            {/* Buyer Phone */}
                            <div className="space-y-2">
                                <Label className="text-gray-300">Buyer Phone Number *</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <Input
                                        type="tel"
                                        value={formData.buyerPhone}
                                        onChange={(e) => setFormData({ ...formData, buyerPhone: e.target.value })}
                                        placeholder="08012345678"
                                        className="pl-10 bg-white/5 border-white/20 text-white"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-500">Nigerian number required</p>
                            </div>

                            {/* Buyer Name (Optional) */}
                            <div className="space-y-2">
                                <Label className="text-gray-300">Buyer Name (Optional)</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <Input
                                        type="text"
                                        value={formData.buyerName}
                                        onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                                        placeholder="Customer name"
                                        className="pl-10 bg-white/5 border-white/20 text-white"
                                    />
                                </div>
                            </div>

                            {/* Total Price Display */}
                            {selectedTicket && (
                                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">Total to Collect (Cash)</span>
                                        <span className="text-2xl font-bold text-green-400">
                                            {formatCurrency(totalPrice)}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={submitting || !formData.ticketType || !formData.buyerPhone}
                                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Creating Ticket...
                                    </>
                                ) : (
                                    <>
                                        <Ticket className="w-5 h-5 mr-2" />
                                        Create Ticket & Mark Paid
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Result Display */}
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Clipboard className="w-5 h-5 text-blue-400" />
                            Ticket Result
                        </h2>

                        {!result && (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                                <Ticket className="w-16 h-16 mb-4 opacity-30" />
                                <p>Create a ticket to see result here</p>
                            </div>
                        )}

                        {result && result.success && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                                    <div>
                                        <p className="text-green-400 font-semibold">Ticket Created!</p>
                                        <p className="text-sm text-green-300/70">{result.message}</p>
                                    </div>
                                </div>

                                {/* Ticket Code - Large Display */}
                                <div className="p-6 bg-white/5 border border-white/20 rounded-xl text-center">
                                    <p className="text-xs text-gray-400 mb-2">TICKET ID (Give to customer)</p>
                                    <p className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-wider mb-4">
                                        {result.ticketCode}
                                    </p>
                                    <Button
                                        onClick={() => copyToClipboard(result.ticketCode || "")}
                                        className="bg-white/10 hover:bg-white/20 text-white"
                                    >
                                        {copied ? (
                                            <>
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4 mr-2" />
                                                Copy Ticket ID
                                            </>
                                        )}
                                    </Button>
                                </div>

                                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                                    <p className="text-xs text-blue-300 mb-1">Order Number</p>
                                    <p className="font-mono text-white">{result.orderNumber}</p>
                                </div>

                                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                        <div>
                                            <p className="text-yellow-300 font-semibold text-sm">Next Steps</p>
                                            <ul className="text-yellow-200/70 text-xs mt-1 space-y-1">
                                                <li>1. Collect cash payment from customer</li>
                                                <li>2. Give customer the Ticket ID above</li>
                                                <li>3. Customer scans QR at entry for wristband</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {result && !result.success && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
                            >
                                <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
                                <div>
                                    <p className="text-red-400 font-semibold">Error</p>
                                    <p className="text-sm text-red-300/70">{result.error}</p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                        Cash Sale Guidelines
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li>• Only create tickets after receiving cash payment</li>
                        <li>• Each ticket is immediately marked as PAID and usable</li>
                        <li>• Phone number is mandatory for record keeping</li>
                        <li>• Manual sales are capped per ticket type - check availability</li>
                        <li>• All sales are logged with your admin ID</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
