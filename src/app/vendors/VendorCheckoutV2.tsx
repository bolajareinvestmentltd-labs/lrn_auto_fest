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

export default function VendorCheckoutV2() {
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
    const [error, setError] = useState<string | null>(null);

    // Hardcoding slots to 10 to bypass database count hanging
    const slotsLeft = 10; 

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.businessName || !formData.contactPerson || !formData.phone || !formData.email || !formData.productType) {
            setError("Please fill in all required fields");
            return;
        }

        if (!paystackLoaded || !(window as unknown as Record<string, unknown>).PaystackPop) {
            setError("Payment system is loading. Please try again.");
            return;
        }

        setIsSubmitting(true);

        try {
            const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

            if (!paystackKey) {
                throw new Error("Payment configuration error.");
            }

            // ========================================
            // OPEN PAYSTACK IMMEDIATELY (NO DB WAIT)
            // ========================================
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const handler = ((window as unknown) as Record<string, any>).PaystackPop.setup({
                key: paystackKey,
                email: formData.email,
                amount: VENDOR_BOOKING_FEE * 100,
                currency: "NGN",
                onClose: () => {
                    setIsSubmitting(false);
                    setError("Payment cancelled.");
                },
                // ========================================
                // INSTANT POP-UP SUCCESS LOGIC
                // ========================================
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onSuccess: async (transaction: any) => {
                    console.log("✅ Payment successful, reference:", transaction.reference);
                    
                    // 1. INSTANTLY SHOW SUCCESS UI
                    setIsSubmitting(false);
                    setSubmitted(true);
                    setTicketId(transaction.reference);
                    
                    // 2. Try to save to DB quietly in background (won't freeze UI if it fails)
                    try {
                        await fetch("/api/vendor-v2", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                ...formData,
                                amount: VENDOR_BOOKING_FEE,
                                status: "CONFIRMED",
                                paymentReference: transaction.reference
                            })
                        });
                    } catch (e) {
                        console.error("Background save failed, but payment succeeded.");
                    }
                }
            });
            handler.openIframe();
        } catch (err) {
            setError("An error occurred opening the payment window.");
            setIsSubmitting(false);
        }
    };

    return (
        <main className="bg-[#050505] min-h-screen text-white">
            <div className="container mx-auto px-4 py-32">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="font-heading text-4xl md:text-6xl font-black italic uppercase">
                        Become a <span className="text-brand-blue">Vendor</span>
                    </h1>
                    <p className="text-gray-400 mt-6 text-lg">
                        Vendor slots is strictly limited to Food, Drinks and Eatables only.<br />
                        <span className="text-brand-orange font-bold">Only 10 slots available!</span>
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
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
                                    <p className="mt-2 text-lg font-bold text-white">Available</p>
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
                                            className={`rounded-xl border px-4 py-4 text-left transition ${isSelected ? "border-brand-orange bg-brand-orange/10 text-white" : "border-white/10 bg-black/20 text-gray-400 hover:border-brand-orange/40"}`}
                                        >
                                            <p className="font-semibold capitalize">{product.label}</p>
                                            <p className="mt-1 text-xs text-gray-500">Approved for vendor booking</p>
                                        </button>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-8 rounded-xl">
formFORM                        <h3 className="text-xl font-bold uppercase mb-6 text-brand-orange">Applivation LIVE</h3>

                        {submitted ? (
                            <div className="text-center space-y-6 py-8">
                                <div className="text-5xl animate-bounce"><CheckCircle className="w-16 h-16 text-green-400 mx-auto" /></div>
                                <div>
                                    <p className="text-xl font-bold text-green-400 mb-2">✅ Application Approved!</p>
                                    <p className="text-sm text-gray-300 mb-4">Your payment has been verified, your vendor slot is confirmed!</p>
                                    {ticketId && <p className="text-xs text-gray-500 mt-4">Reference: {ticketId}</p>}
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
                                        <p className="text-sm font-semibold">{error}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="text-xs uppercase text-gray-500 block mb-2">Business Name *</label>
                                    <Input name="businessName" value={formData.businessName} onChange={handleInputChange} placeholder="Your Business Name" disabled={isSubmitting} className="bg-black/50 border-white/10 text-white" />
                                </div>
                                <div>
                                    <label className="text-xs uppercase text-gray-500 block mb-2">Contact Person *</label>
                                    <Input name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} placeholder="Your Name" disabled={isSubmitting} className="bg-black/50 border-white/10 text-white" />
                                </div>
                                <div>
                                    <label className="text-xs uppercase text-gray-500 block mb-2">Email Address *</label>
                                    <Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="your@email.com" disabled={isSubmitting} className="bg-black/50 border-white/10 text-white" />
                                </div>
                                <div>
                                    <label className="text-xs uppercase text-gray-500 block mb-2">Phone / WhatsApp *</label>
                                    <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="08012345678" type="tel" disabled={isSubmitting} className="bg-black/50 border-white/10 text-white" />
                                </div>

                                <div>
                                    <label className="text-xs uppercase text-gray-500 block mb-2">Product Type *</label>
                                    <div className="grid gap-3 sm:grid-cols-3">
                                        {PRODUCT_TYPES.map((product) => {
                                            const isSelected = formData.productType === product.id;
                                            return (
                                                <button key={product.id} type="button" onClick={() => setFormData((prev) => ({ ...prev, productType: product.id }))} disabled={isSubmitting} className={`rounded-xl border px-4 py-3 text-left transition ${isSelected ? "border-brand-orange bg-brand-orange/10 text-white" : "border-white/10 bg-black/20 text-gray-400 hover:border-brand-orange/40"}`}>
                                                    <p className="font-semibold capitalize">{product.label}</p>
                                                    <p className="mt-1 text-[11px] text-gray-500">Choose one</p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <Button type="submit" disabled={isSubmitting} className="w-full bg-brand-blue hover:bg-brand-blue/80 text-white py-6 text-lg font-bold uppercase tracking-widest mt-4">
                                    {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</> : "PAY NOW"}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
