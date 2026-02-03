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
                    <div className="text-center space-y-6 bg-white/5 border border-green-500/30 rounded-xl p-8">
                        <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-white">
                                Payment Successful!
                            </h1>
                            <p className="text-gray-400">
                                Your tickets have been confirmed
                            </p>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-left space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Order Number:</span>
                                <span className="text-white font-semibold">
                                    {orderDetails.orderNumber}
                                </span>
                            </div>
                            {orderDetails.ticketType && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Ticket Type:</span>
                                    <span className="text-brand-orange font-semibold">
                                        {orderDetails.ticketType}
                                    </span>
                                </div>
                            )}
                            {orderDetails.quantity && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Quantity:</span>
                                    <span className="text-white font-semibold">
                                        {orderDetails.quantity} ticket{orderDetails.quantity > 1 ? 's' : ''}
                                    </span>
                                </div>
                            )}
                            <div className="border-t border-white/10 pt-3 flex justify-between">
                                <span className="text-gray-400">Status:</span>
                                <span className="text-green-400 font-semibold">✓ Confirmed</span>
                            </div>
                        </div>

                        {/* Event Details */}
                        <div className="bg-brand-orange/10 border border-brand-orange/30 rounded-lg p-4 space-y-2">
                            <div className="flex items-center gap-2 text-white">
                                <Calendar className="w-4 h-4 text-brand-orange" />
                                <span className="font-semibold">May 30, 2026</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                                <MapPin className="w-4 h-4 text-brand-orange" />
                                <span>Metropolitan Square, Asadam Road, Ilorin</span>
                            </div>
                        </div>

                        {/* QR Code Preview */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-center gap-2">
                                <Ticket className="w-5 h-5 text-brand-orange" />
                                <h3 className="text-white font-semibold">Your Ticket QR Code</h3>
                            </div>

                            <div className="bg-white p-4 rounded-lg inline-block mx-auto">
                                {/* Placeholder QR - Real QR would come from API */}
                                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                                    <div className="text-center">
                                        <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-xs text-gray-500">QR Code</p>
                                        <p className="text-xs text-gray-400 mt-1">{orderDetails.orderNumber}</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-gray-400">
                                Present this QR code at the event entrance
                            </p>
                        </div>

                        {/* Email Notice */}
                        <div className="space-y-3">
                            <p className="text-sm text-gray-400">
                                A confirmation email with your ticket(s) and QR code(s) has been sent to{" "}
                                <span className="text-brand-orange">{orderDetails.customerEmail}</span>
                            </p>
                            <p className="text-sm text-gray-500 bg-white/5 p-3 rounded">
                                📧 Check your inbox (and spam folder) for download instructions
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 pt-4">
                            <Button className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold h-12 uppercase gap-2">
                                <Download className="w-4 h-4" />
                                Download Tickets (PDF)
                            </Button>
                            <Link href="/" className="block">
                                <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/5 h-12 uppercase">
                                    Return to Home
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}

                {status === "failed" && (
                    <div className="text-center space-y-6 bg-white/5 border border-red-500/30 rounded-lg p-8">
                        <XCircle className="h-20 w-20 text-red-500 mx-auto" />
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-white">
                                Payment Failed
                            </h1>
                            <p className="text-gray-400">
                                We couldn&apos;t process your payment
                            </p>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>

                        <div className="space-y-2">
                            <Link href="/tickets">
                                <Button className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold h-12 uppercase">
                                    Try Again
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/5 h-12 uppercase">
                                    Back to Home
                                </Button>
                            </Link>
                        </div>

                        <p className="text-xs text-gray-500">
                            If you continue to experience issues, please contact{" "}
                            <a href="mailto:support@ilorinautofest.com" className="text-brand-orange hover:underline">
                                support@ilorinautofest.com
                            </a>
                        </p>
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
