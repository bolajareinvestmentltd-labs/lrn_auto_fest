"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Home, Loader2 } from "lucide-react";
import Link from "next/link";

interface TicketDetails {
    id: string;
    customerName: string;
    email: string;
    ticketType: string;
    quantity: number;
    groupSize: string;
    unitPrice: number;
    total: number;
    parkingSlots: number;
    vipSeats: number;
    reference: string;
}

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const reference = searchParams.get("reference");
        const ticketType = searchParams.get("type");

        if (!reference || !ticketType) {
            router.push("/");
            return;
        }

        // Fetch ticket details from API
        const fetchDetails = async () => {
            try {
                const response = await fetch(`/api/payment-details?reference=${reference}&type=${ticketType}`);
                if (response.ok) {
                    const data = await response.json();
                    setTicketDetails(data);
                }
            } catch (error) {
                console.error("Failed to fetch ticket details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();

        // Auto redirect to home after 5 minutes
        const redirectTimer = setTimeout(() => {
            router.push("/");
        }, 5 * 60 * 1000);

        return () => clearTimeout(redirectTimer);
    }, [searchParams, router]);

    const handleDownload = async () => {
        if (!ticketDetails) return;

        setDownloading(true);
        try {
            const response = await fetch("/api/download-ticket", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reference: ticketDetails.reference,
                    ticketType: ticketDetails.ticketType,
                }),
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `ticket-${ticketDetails.reference}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (error) {
            console.error("Failed to download ticket:", error);
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
            </div>
        );
    }

    if (!ticketDetails) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
                <div className="text-center">
                    <p className="text-white text-lg mb-4">Could not load ticket details</p>
                    <Link href="/">
                        <Button className="bg-brand-orange hover:bg-orange-600">Go Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4 animate-bounce" />
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Payment Successful!</h1>
                    <p className="text-gray-400 text-lg">Your transaction has been verified</p>
                </div>

                {/* Ticket Details Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
                    <div className="space-y-4">
                        <div className="border-b border-white/10 pb-4">
                            <p className="text-gray-500 text-sm uppercase mb-1">Order Reference</p>
                            <p className="text-white font-mono font-bold text-lg">{ticketDetails.reference}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-500 text-sm uppercase mb-1">Ticket Type</p>
                                <p className="text-white font-semibold">{ticketDetails.ticketType}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm uppercase mb-1">Quantity</p>
                                <p className="text-white font-semibold">{ticketDetails.quantity}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-500 text-sm uppercase mb-1">Parking Slots</p>
                                <p className="text-white font-semibold">{ticketDetails.parkingSlots}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm uppercase mb-1">VIP Seats</p>
                                <p className="text-white font-semibold">{ticketDetails.vipSeats}</p>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-4">
                            <p className="text-gray-500 text-sm uppercase mb-1">Total Amount Paid</p>
                            <p className="text-brand-orange font-bold text-2xl">₦{ticketDetails.total.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Email Notification Info */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-8">
                    <p className="text-blue-300 text-sm">
                        ✅ A detailed confirmation email has been sent to <strong>{ticketDetails.email}</strong> with all your ticket details, parking information, and VIP seat assignment.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3"
                    >
                        {downloading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Preparing Download...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4 mr-2" />
                                Download Ticket (PDF)
                            </>
                        )}
                    </Button>

                    <Link href="/" className="block">
                        <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10">
                            <Home className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                </div>

                {/* Auto Redirect Info */}
                <p className="text-center text-gray-500 text-sm mt-8">
                    You will be automatically redirected to the home page in 5 minutes
                </p>
            </div>
        </div>
    );
}
