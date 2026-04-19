"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Download, QrCode, Copy } from "lucide-react";
import Link from "next/link";
import * as QRCode from "qrcode";

interface VendorDetails {
    success: boolean;
    ticketId: string;
    businessName: string;
    contactPerson: string;
    phone: string;
    email: string;
    productType: string;
    amount: number;
    paymentReference: string;
}

function VendorPaymentConfirmationContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
    const [vendorDetails, setVendorDetails] = useState<VendorDetails | null>(null);
    const [error, setError] = useState("");
    const [qrCode, setQrCode] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const verifyVendorPayment = async () => {
            const reference = searchParams.get("reference");
            const ticketId = searchParams.get("ticketId");

            if (!reference || !ticketId) {
                setStatus("failed");
                setError("No payment reference or ticket ID found");
                return;
            }

            try {
                // Fetch vendor details directly from the database using the ticket ID
                const vendorResponse = await fetch(`/api/vendors?ticketId=${ticketId}`);
                const vendorData = await vendorResponse.json();

                if (vendorData.success && vendorData.status === "CONFIRMED") {
                    setVendorDetails({
                        success: true,
                        ticketId: vendorData.ticketId,
                        businessName: vendorData.businessName,
                        contactPerson: vendorData.contactPerson,
                        phone: vendorData.phone,
                        email: vendorData.email,
                        productType: vendorData.productType,
                        amount: vendorData.bookingFee || 103500, // Handle property naming mapping
                        paymentReference: reference,
                    });

                    // Generate QR code for vendor ticket
                    const qrData = `VND:${vendorData.ticketId}:${vendorData.email}:VENDOR_PASS`;
                    const qrImage = await QRCode.toDataURL(qrData, {
                        width: 300,
                        margin: 2,
                        color: { dark: "#000000", light: "#FFFFFF" },
                    });
                    
                    setQrCode(qrImage);
                    setStatus("success");
                } else {
                    setStatus("failed");
                    setError("Failed to fetch verified vendor details from the database.");
                }
            } catch (err) {
                console.error("Verification error:", err);
                setStatus("failed");
                setError("Error retrieving your booking. Please contact support.");
            }
        };

        verifyVendorPayment();
    }, [searchParams]);

    const handleCopyTicketId = () => {
        if (vendorDetails?.ticketId) {
            navigator.clipboard.writeText(vendorDetails.ticketId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const downloadQRCode = () => {
        if (qrCode && vendorDetails) {
            const link = document.createElement("a");
            link.href = qrCode;
            link.download = `vendor-pass-${vendorDetails.ticketId}.png`;
            link.click();
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl">
                {status === "loading" && (
                    <div className="text-center space-y-4">
                        <Loader2 className="h-16 w-16 text-brand-orange animate-spin mx-auto" />
                        <h1 className="text-2xl font-bold text-white">
                            Verifying Vendor Payment...
                        </h1>
                        <p className="text-gray-400">Please wait while we confirm your payment</p>
                    </div>
                )}

                {status === "success" && vendorDetails && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Success Toast */}
                        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-l-4 border-green-500 rounded-lg p-4 flex items-start gap-3">
                            <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h2 className="text-green-400 font-bold">Vendor Booking Confirmed!</h2>
                                <p className="text-green-300/80 text-sm">Your payment has been verified and your vendor slot is secured.</p>
                            </div>
                        </div>

                        {/* Main Success Box */}
                        <div className="text-center space-y-8 bg-gradient-to-br from-white/10 to-white/5 border border-green-500/30 rounded-2xl p-8 shadow-2xl">
                            <div className="flex justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse" />
                                    <CheckCircle className="h-24 w-24 text-green-500 relative" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                                    🎉 Vendor Booking Approved!
                                </h1>
                                <p className="text-gray-300 text-lg">
                                    Your vendor slot is confirmed for the Ilorin Auto Festival 2026
                                </p>
                            </div>

                            {/* Vendor Details */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-left space-y-4">
                                <h3 className="text-white font-bold mb-4 text-center">Vendor Information</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                        <span className="text-gray-400">Business Name:</span>
                                        <span className="text-white font-bold text-lg">{vendorDetails.businessName}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                        <span className="text-gray-400">Contact Person:</span>
                                        <span className="text-white font-bold">{vendorDetails.contactPerson}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                        <span className="text-gray-400">Product Type:</span>
                                        <span className="text-brand-orange font-bold capitalize">{vendorDetails.productType}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                        <span className="text-gray-400">Phone:</span>
                                        <span className="text-white font-mono">{vendorDetails.phone}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                                        <span className="text-gray-400">Email:</span>
                                        <span className="text-white font-mono text-sm">{vendorDetails.email}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Payment Amount:</span>
                                        <span className="text-white font-bold text-lg">₦{vendorDetails.amount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Your Vendor Pass - Ticket ID */}
                            <div className="bg-brand-orange/15 border border-brand-orange/40 rounded-xl p-6 space-y-4">
                                <div className="flex items-center gap-2 justify-center">
                                    <QrCode className="w-5 h-5 text-brand-orange" />
                                    <h3 className="text-white font-bold">Your Vendor Pass</h3>
                                </div>

                                {/* QR Code Display */}
                                {qrCode && (
                                    <div className="bg-white p-4 rounded-lg inline-block mx-auto">
                                        <img
                                            src={qrCode}
                                            alt="Vendor QR Code"
                                            className="w-48 h-48"
                                        />
                                    </div>
                                )}

                                {/* Ticket ID with Copy */}
                                <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
                                    <p className="text-xs text-gray-500 uppercase">Vendor Pass ID</p>
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-lg font-mono font-bold text-brand-orange break-all flex-1">
                                            {vendorDetails.ticketId}
                                        </p>
                                        <button
                                            onClick={handleCopyTicketId}
                                            className="bg-brand-orange/20 hover:bg-brand-orange/30 text-brand-orange px-3 py-2 rounded transition-colors flex items-center gap-2"
                                        >
                                            <Copy className="w-4 h-4" />
                                            {copied ? "Copied!" : "Copy"}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-3">
                                        📱 Save this ID or scan the QR code for entrance verification
                                    </p>
                                </div>

                                {/* Download Button */}
                                <button
                                    onClick={downloadQRCode}
                                    className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Download QR Code
                                </button>
                            </div>

                            {/* Event Information */}
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 text-left space-y-3">
                                <h3 className="text-blue-300 font-bold mb-3">Next Steps:</h3>
                                <ol className="space-y-2 text-blue-300/90 text-sm">
                                    <li className="flex gap-3">
                                        <span className="font-bold text-blue-400 flex-shrink-0">1.</span>
                                        <span>Check your email for confirmation and setup details</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-bold text-blue-400 flex-shrink-0">2.</span>
                                        <span>Save your Vendor Pass ID and QR code for entrance</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-bold text-blue-400 flex-shrink-0">3.</span>
                                        <span>Bring the QR code (printed or on your phone) on event day</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-bold text-blue-400 flex-shrink-0">4.</span>
                                        <span>Scan the QR code at the entrance for vendor access</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-bold text-blue-400 flex-shrink-0">5.</span>
                                        <span>Contact admin if you need additional information</span>
                                    </li>
                                </ol>
                            </div>

                            {/* Payment Details */}
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-sm">
                                <p className="text-gray-500">Payment Reference: <span className="text-gray-300 font-mono">{vendorDetails.paymentReference}</span></p>
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
                                <a href={`mailto:${vendorDetails.email}`}>📧 Send Confirmation Email to Myself</a>
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
                                <h2 className="text-red-400 font-bold">Vendor Booking Failed</h2>
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
                                    We couldn&apos;t complete your vendor booking
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

export default function VendorPaymentConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <Loader2 className="h-16 w-16 text-brand-orange animate-spin" />
            </div>
        }>
            <VendorPaymentConfirmationContent />
        </Suspense>
    );
}
