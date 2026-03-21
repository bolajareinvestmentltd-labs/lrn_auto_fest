"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Download, Ticket, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface OrderDetails {
    success: boolean;
    orderId: string;
    orderNumber: string;
    ticketType?: string;
    quantity?: number;
    customerName?: string;
    customerEmail?: string;
    tickets?: {
        ticketCode: string;
        qrCodeUrl: string;
    }[];
}

function PaymentConfirmationContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const verifyPayment = async () => {
            const reference = searchParams.get("reference");

            if (!reference) {
                setStatus("failed");
                setError("No payment reference found");
                return;
            }

            try {
                // Verify payment with our API
                const response = await fetch("/api/paystack/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ reference }),
                });

                const data = await response.json();

                if (data.success) {
                    setStatus("success");
                    setOrderDetails(data);
                } else {
                    setStatus("failed");
                    setError(data.message || "Payment verification failed");
                }
            } catch (err) {
                console.error("Verification error:", err);
                setStatus("failed");
                setError("Error verifying payment. Please contact support.");
            }
        };

        verifyPayment();
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg">
                {status === "loading" && (
                    <div className="text-center space-y-4">
                        <Loader2 className="h-16 w-16 text-brand-orange animate-spin mx-auto" />
                        <h1 className="text-2xl font-bold text-white">
                            Verifying Payment...
                        </h1>
                        <p className="text-gray-400">Please wait while we confirm your payment</p>
                    </div>
                )}

                {status === "success" && orderDetails && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Success Toast */}
                        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-l-4 border-green-500 rounded-lg p-4 flex items-start gap-3">
                            <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h2 className="text-green-400 font-bold">Payment Confirmed</h2>
                                <p className="text-green-300/80 text-sm">Your tickets are ready! A confirmation email has been sent.</p>
                            </div>
                        </div>

                        {/* Main Success Box */}
                        <div className="text-center space-y-6 bg-gradient-to-br from-white/10 to-white/5 border border-green-500/30 rounded-2xl p-8 shadow-2xl">
                            <div className="flex justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse" />
                                    <CheckCircle className="h-24 w-24 text-green-500 relative" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                                    🎉 Payment Successful!
                                </h1>
                                <p className="text-gray-300 text-lg">
                                    Your tickets have been confirmed
                                </p>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-left space-y-3">
                                <h3 className="text-white font-bold mb-4">Order Details</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                        <span className="text-gray-400">Order Number:</span>
                                        <span className="text-white font-mono font-bold text-lg">
                                            {orderDetails.orderNumber}
                                        </span>
                                    </div>
                                    {orderDetails.ticketType && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Ticket Type:</span>
                                            <span className="text-brand-orange font-bold text-lg">
                                                {orderDetails.ticketType}
                                            </span>
                                        </div>
                                    )}
                                    {orderDetails.quantity && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Quantity:</span>
                                            <span className="text-white font-bold text-lg">
                                                {orderDetails.quantity} ticket{orderDetails.quantity > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Event Details */}
                            <div className="bg-brand-orange/15 border border-brand-orange/40 rounded-xl p-6 space-y-3">
                                <h3 className="text-white font-bold mb-2">Event Information</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-brand-orange flex-shrink-0" />
                                        <span className="text-white font-semibold">May 30, 2026</span>
                                    </div>
                                    <a
                                        href="https://www.google.com/maps/dir/?api=1&destination=8.4799,4.5418&travelmode=driving"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 text-brand-orange hover:text-orange-300 transition-colors group"
                                    >
                                        <MapPin className="w-5 h-5 flex-shrink-0" />
                                        <span className="font-semibold group-hover:underline">Metropolitan Square, Asadam Road, Ilorin</span>
                                    </a>
                                </div>
                            </div>

                            {/* Next Steps */}
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 text-left">
                                <h3 className="text-blue-300 font-bold mb-3">Next Steps:</h3>
                                <ol className="space-y-2 text-blue-300/90 text-sm">
                                    <li className="flex gap-3">
                                        <span className="font-bold text-blue-400">1.</span>
                                        <span>Check your email ({orderDetails.customerEmail}) for your ticket QR code</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-bold text-blue-400">2.</span>
                                        <span>Download and save your ticket - you'll need it at the gate</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-bold text-blue-400">3.</span>
                                        <span>Arrive early on May 30th for smooth entry</span>
                                    </li>
                                </ol>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3">
                            <Button
                                className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 rounded-lg text-lg uppercase tracking-wide transition-all hover:shadow-lg hover:shadow-orange-500/30"
                                asChild
                            >
                                <Link href="/">← Back to Home</Link>
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full text-white border-white/30 hover:bg-white/10 py-3 rounded-lg font-semibold"
                                asChild
                            >
                                <a href={`mailto:${orderDetails.customerEmail}`}>View Confirmation Email</a>
                            </Button>
                        </div>
                    </div>
                )}

                {status === "failed" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Error Toast */}
                        <div className="bg-gradient-to-r from-red-600/20 to-rose-600/20 border-l-4 border-red-500 rounded-lg p-4 flex items-start gap-3">
                            <XCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h2 className="text-red-400 font-bold">Payment Not Completed</h2>
                                <p className="text-red-300/80 text-sm">{error || "An error occurred during payment processing"}</p>
                            </div>
                        </div>

                        {/* Main Failure Box */}
                        <div className="text-center space-y-6 bg-gradient-to-br from-white/10 to-white/5 border border-red-500/30 rounded-2xl p-8 shadow-2xl">
                            <div className="flex justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl animate-pulse" />
                                    <XCircle className="h-24 w-24 text-red-500 relative" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                                    Payment Failed
                                </h1>
                                <p className="text-gray-300 text-lg">
                                    We couldn&apos;t complete your payment
                                </p>
                            </div>

                            {/* Error Details */}
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-left">
                                <h3 className="text-red-300 font-bold mb-2">What Happened?</h3>
                                <p className="text-red-300/80 text-sm">
                                    {error || "Your payment could not be processed. This may be due to:"}
                                </p>
                                <ul className="space-y-1 text-red-300/70 text-sm mt-3">
                                    <li>• Insufficient funds in your account</li>
                                    <li>• Card declined by your bank</li>
                                    <li>• Network connection issues</li>
                                    <li>• Incorrect payment details</li>
                                </ul>
                            </div>

                            {/* Support Info */}
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                <h3 className="text-blue-300 font-bold mb-2">Need Help?</h3>
                                <p className="text-blue-300/80 text-sm">
                                    Contact our support team at{" "}
                                    <a href="mailto:support@iaf2026.com" className="text-blue-400 hover:text-blue-300 font-semibold">
                                        support@iaf2026.com
                                    </a>
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 pt-4">
                                <Button
                                    className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 rounded-lg text-lg uppercase tracking-wide transition-all hover:shadow-lg hover:shadow-orange-500/30"
                                    asChild
                                >
                                    <Link href="/tickets">← Try Again</Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full text-white border-white/30 hover:bg-white/10 py-3 rounded-lg font-semibold"
                                    asChild
                                >
                                    <Link href="/">Return to Home</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PaymentConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <Loader2 className="h-16 w-16 text-brand-orange animate-spin" />
            </div>
        }>
            <PaymentConfirmationContent />
        </Suspense>
    );
}
