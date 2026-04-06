"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle, Store, AlertTriangle } from "lucide-react";

const VENDOR_BOOKING_FEE = 103500;
const MAX_VENDORS = 10;
const PRODUCT_TYPES = [
    { id: "food", label: "Food" },
    { id: "drink", label: "Drink" },
    { id: "eatables", label: "Eatables" },
] as const;

export default function VendorPage() {
    const [formData, setFormData] = useState({
        businessName: "",
        contactPerson: "",
        phone: "",
        email: "",
        productType: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [paystackLoaded, setPaystackLoaded] = useState(false);
    const [ticketId, setTicketId] = useState("");
    const [confirmedVendors, setConfirmedVendors] = useState(0);
    const [countLoading, setCountLoading] = useState(true);

    const slotsLeft = Math.max(MAX_VENDORS - confirmedVendors, 0);

    // Get booking fee (no additional charges or VAT)
    const getTotal = () => VENDOR_BOOKING_FEE;

    // Load Paystack script
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://js.paystack.co/v1/inline.js";
        script.async = true;
        script.onload = () => {
            setPaystackLoaded(true);
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        const fetchVendorCount = async () => {
            try {
                const response = await fetch("/api/vendors");
                if (!response.ok) {
                    throw new Error("Failed to fetch vendor slots");
                }

                const data = await response.json();
                setConfirmedVendors(data.count || 0);
            } catch (error) {
                console.error("Failed to load vendor count:", error);
            } finally {
                setCountLoading(false);
            }
        };

        fetchVendorCount();
    }, [submitted]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.businessName || !formData.contactPerson || !formData.phone || !formData.email || !formData.productType) {
            alert("Please fill in all required fields");
            return;
        }

        if (!formData.email.includes("@")) {
            alert("Please enter a valid email");
            return;
        }

        if (slotsLeft <= 0) {
            alert("Vendor booking is currently full.");
            return;
        }

        if (!paystackLoaded || !(window as unknown as Record<string, unknown>).PaystackPop) {
            alert("Payment system is loading. Please try again.");
            return;
        }

        setIsSubmitting(true);

        const generateTicketId = () => {
            return `VND-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        };

        const newTicketId = generateTicketId();
        const totalAmount = getTotal();

        // Use environment variable for Paystack key
        const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

        if (!paystackKey) {
            alert("Payment configuration error. Please contact support.");
            setIsSubmitting(false);
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handler = ((window as unknown) as Record<string, any>).PaystackPop.setup({
            key: paystackKey,
            email: formData.email,
            amount: totalAmount * 100, // Paystack uses kobo (multiply by 100)
            ref: newTicketId,
            currency: "NGN",
            onClose: () => {
                setIsSubmitting(false);
                alert("Payment cancelled. Your application was not submitted.");
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onSuccess: async (transaction: any) => {
                try {
                    // Save vendor application to database
                    const response = await fetch("/api/vendors", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            businessName: formData.businessName,
                            contactPerson: formData.contactPerson,
                            phone: formData.phone,
                            email: formData.email,
                            productType: formData.productType,
                            ticketId: newTicketId,
                            paymentReference: transaction.reference,
                            amount: VENDOR_BOOKING_FEE,
                            totalAmount: totalAmount,
                        })
                    });

                    if (response.ok) {
                        setSubmitted(true);
                        setTicketId(newTicketId);
                        // Redirect to vendor payment confirmation page to show success with QR code
                        window.location.href = `/vendor-payment-confirmation?reference=${transaction.reference}&ticketId=${newTicketId}`;
                    } else {
                        throw new Error("Failed to save vendor application");
                    }
                } catch (error) {
                    console.error("Error:", error);
                    alert("Payment verified but failed to save application. Please contact support.");
                    setIsSubmitting(false);
                }
            }
        });
        handler.openIframe();
    };

    return (
        <main className="bg-[#050505] min-h-screen text-white">

            <div className="container mx-auto px-4 py-32">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="font-heading text-4xl md:text-6xl font-black italic uppercase">
                        Become a <span className="text-brand-blue">Vendor</span>
                    </h1>
                    <p className="text-gray-400 mt-6 text-lg">
                        Vendor slots is strictly limited to Food, Drinks and Eatables only.<br />
                        <span className="text-brand-orange font-bold">Only 10 slots available!</span>
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* PRICING INFO */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-heading uppercase text-brand-orange">Vendor Booking Details</h3>

                        <Card className="border-2 border-brand-orange/40 bg-brand-orange/10">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Store className="w-5 h-5 text-brand-orange" />
                                    Standard Vendor Slot
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-gray-300">
                                <div className="space-y-2">
                                    <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Total Amount</p>
                                    <p className="text-4xl font-black text-brand-orange">₦{VENDOR_BOOKING_FEE.toLocaleString()}</p>
                                </div>
                                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                                    <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Availability</p>
                                    {countLoading ? (
                                        <p className="mt-2 text-sm text-gray-400">Loading available slots...</p>
                                    ) : (
                                        <>
                                            <p className={`mt-2 text-lg font-bold ${slotsLeft <= 5 ? "text-red-400" : "text-white"}`}>
                                                {slotsLeft} of {MAX_VENDORS} slots remaining
                                            </p>
                                            <progress
                                                className="mt-3 h-2 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-white/10 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-brand-blue [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-brand-blue"
                                                max={MAX_VENDORS}
                                                value={confirmedVendors}
                                            />
                                        </>
                                    )}
                                </div>

                                <div className="space-y-2 text-sm">
                                    <p>• Booking limit: 10 vendors only</p>
                                    <p>• Allowed products: food, drink, eatables only</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-white/10 bg-white/5">
                            <CardHeader>
                                <CardTitle className="text-white">Items of choice.</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-3 sm:grid-cols-3">
                                {PRODUCT_TYPES.map((product) => {
                                    const isSelected = formData.productType === product.id;

                                    return (
                                        <button
                                            key={product.id}
                                            type="button"
                                            onClick={() => setFormData((prev) => ({ ...prev, productType: product.id }))}
                                            className={`rounded-xl border px-4 py-4 text-left transition ${isSelected
                                                ? "border-brand-orange bg-brand-orange/10 text-white"
                                                : "border-white/10 bg-black/20 text-gray-400 hover:border-brand-orange/40"
                                                }`}
                                        >
                                            <p className="font-semibold capitalize">{product.label}</p>
                                            <p className="mt-1 text-xs text-gray-500">Approved for vendor booking</p>
                                        </button>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        {slotsLeft <= 0 && !countLoading && (
                            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="mt-0.5 h-5 w-5 text-red-400" />
                                    <div>
                                        <p className="font-semibold">Vendor booking is currently full.</p>
                                        <p className="mt-1 text-sm text-red-200/80">
                                            All 10 vendor slots have been reserved. The form is disabled until a slot becomes available.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* APPLICATION FORM */}
                    <div className="bg-white/5 border border-white/10 p-8 rounded-xl">
                        <h3 className="text-xl font-bold uppercase mb-6 text-brand-orange">Application Form</h3>

                        {submitted ? (
                            <div className="text-center space-y-6 py-8">
                                <div className="text-5xl animate-bounce"><CheckCircle className="w-16 h-16 text-green-400 mx-auto" /></div>
                                <div>
                                    <p className="text-xl font-bold text-green-400 mb-2">✅ Application Approved!</p>
                                    <p className="text-sm text-gray-300 mb-4">Your payment has been verified, your vendor slot is confirmed, and the admin team has been notified.</p>
                                </div>

                                <div className="bg-brand-orange/10 border border-brand-orange/50 p-4 rounded-lg">
                                    <p className="text-xs text-gray-500 uppercase mb-1">Your Confirmation Ticket ID</p>
                                    <p className="text-lg font-mono font-bold text-brand-orange break-all">{ticketId}</p>
                                    <p className="text-xs text-gray-400 mt-3">📧 Confirmation email sent to your registered email address with your vendor booking details.</p>
                                </div>

                                <div className="bg-blue-500/10 border border-brand-blue/30 p-3 rounded-lg text-left">
                                    <p className="text-xs text-gray-400">💡 <strong>Next Steps:</strong></p>
                                    <ul className="text-xs text-gray-400 mt-2 space-y-1">
                                        <li>✓ Check your email for your payment receipt and confirmation</li>
                                        <li>✓ Your vendor slot is confirmed for food, drink, or eatables sales</li>
                                        <li>✓ Event setup details will be shared before the festival</li>
                                        <li>✓ Admin will reach out if additional coordination is needed</li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs uppercase text-gray-500 block mb-2">Business Name *</label>
                                    <Input
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleInputChange}
                                        placeholder="Your Business Name"
                                        disabled={isSubmitting || slotsLeft <= 0}
                                        className="bg-black/50 border-white/10 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs uppercase text-gray-500 block mb-2">Contact Person *</label>
                                    <Input
                                        name="contactPerson"
                                        value={formData.contactPerson}
                                        onChange={handleInputChange}
                                        placeholder="Your Name"
                                        disabled={isSubmitting || slotsLeft <= 0}
                                        className="bg-black/50 border-white/10 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs uppercase text-gray-500 block mb-2">Email Address *</label>
                                    <Input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="your@email.com"
                                        disabled={isSubmitting || slotsLeft <= 0}
                                        className="bg-black/50 border-white/10 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs uppercase text-gray-500 block mb-2">Phone / WhatsApp *</label>
                                    <Input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="08012345678"
                                        type="tel"
                                        disabled={isSubmitting || slotsLeft <= 0}
                                        className="bg-black/50 border-white/10 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs uppercase text-gray-500 block mb-2">Product Type *</label>
                                    <div className="grid gap-3 sm:grid-cols-3">
                                        {PRODUCT_TYPES.map((product) => {
                                            const isSelected = formData.productType === product.id;

                                            return (
                                                <button
                                                    key={product.id}
                                                    type="button"
                                                    onClick={() => setFormData((prev) => ({ ...prev, productType: product.id }))}
                                                    disabled={isSubmitting || slotsLeft <= 0}
                                                    className={`rounded-xl border px-4 py-3 text-left transition ${isSelected
                                                        ? "border-brand-orange bg-brand-orange/10 text-white"
                                                        : "border-white/10 bg-black/20 text-gray-400 hover:border-brand-orange/40"
                                                        }`}
                                                >
                                                    <p className="font-semibold capitalize">{product.label}</p>
                                                    <p className="mt-1 text-[11px] text-gray-500">Choose one</p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="bg-brand-orange/10 border border-brand-orange/50 p-4 rounded-lg space-y-3">
                                    <p className="text-xs text-gray-400">💰 Booking Summary</p>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-300">Standard Vendor Slot</span>
                                            <span className="font-bold text-white">₦{VENDOR_BOOKING_FEE.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-brand-orange/20 flex justify-between">
                                        <span className="font-bold text-white uppercase text-sm">Total Due</span>
                                        <span className="font-black text-brand-orange text-xl">₦{getTotal().toLocaleString()}</span>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting || slotsLeft <= 0}
                                    className="w-full bg-brand-blue hover:bg-brand-blue/80 text-white py-6 text-lg font-bold uppercase tracking-widest mt-4"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "PAY NOW"
                                    )}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
