"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback } from "react";
import { Loader2, CheckCircle, Store, AlertTriangle } from "lucide-react";

// TEMPORARILY 100 FOR YOUR NEXT TEST
const VENDOR_BOOKING_FEE = 100; 
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
    const [isVerifying, setIsVerifying] = useState(false); // NEW: Loading state for verification
    const [submitted, setSubmitted] = useState(false);
    const [ticketId, setTicketId] = useState("");
    const [error, setError] = useState<string | null>(null);

    const [confirmedVendors, setConfirmedVendors] = useState(0);
    const [countLoading, setCountLoading] = useState(true);
    const slotsLeft = Math.max(MAX_VENDORS - confirmedVendors, 0);

    const fetchVendorCount = useCallback(async () => {
        try {
            const response = await fetch(`/api/vendors?t=${Date.now()}`, { cache: "no-store" });
            if (response.ok) {
                const data = await response.json();
                setConfirmedVendors(data.count || 0);
            }
        } catch (err) {
            console.error("Failed to load vendor count:", err);
        } finally {
            setCountLoading(false);
        }
    }, []);

    // 1. THE REDIRECT CATCHER (Now waits for verification!)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const isSuccess = urlParams.get("payment_success");
            const ref = urlParams.get("reference");

            if (isSuccess === "true" && ref) {
                setIsVerifying(true); // Show full-screen loading

                // Restore form data so we can display it
                const savedDataStr = localStorage.getItem("pendingVendorForm");
                if (savedDataStr) {
                    try {
                        setFormData(JSON.parse(savedDataStr));
                        localStorage.removeItem("pendingVendorForm");
                    } catch(e) {
                        console.error("Error parsing memory:", e);
                    }
                }

                // Verify with backend, send email, update slots
                fetch("/api/paystack/vendor-verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ reference: ref })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setTicketId(ref);
                        setSubmitted(true); // Now show the green screen
                        fetchVendorCount(); // Refresh the slot count!
                    } else {
                        setError("Payment verification issue. If you were debited, please contact support.");
                    }
                })
                .catch(() => setError("Network error during verification."))
                .finally(() => {
                    setIsVerifying(false);
                    // Clean the URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                });
            }
        }
    }, [fetchVendorCount]);

    useEffect(() => {
        fetchVendorCount();
    }, [fetchVendorCount]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.businessName || !formData.contactPerson || !formData.phone || !formData.email || !formData.productType) {
            setError("Please fill in all required fields");
            return;
        }

        if (slotsLeft <= 0) {
            setError("Vendor booking is currently full.");
            return;
        }

        setIsSubmitting(true);

        try {
            localStorage.setItem("pendingVendorForm", JSON.stringify({
                businessName: formData.businessName,
                contactPerson: formData.contactPerson,
                phone: formData.phone,
                email: formData.email,
                productType: formData.productType
            }));

            const response = await fetch("/api/vendor-v2", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    amount: VENDOR_BOOKING_FEE
                })
            });

            const data = await response.json();

            if (!response.ok || !data.authorization_url) {
                // Friendly error if email already exists
                throw new Error(data.error || "Failed to connect to payment gateway");
            }

            window.location.href = data.authorization_url;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
            setError(errorMessage);
            setIsSubmitting(false);
        }
    };

    // ==========================================
    // UI RENDERING
    // ==========================================

    // STATE 1: Verifying Payment (Full Screen Overlay)
    if (isVerifying) {
        return (
            <main className="bg-[#050505] min-h-screen text-white flex flex-col items-center justify-center p-4">
                <Loader2 className="w-16 h-16 text-brand-orange animate-spin mb-6" />
                <h2 className="text-3xl font-black italic uppercase text-white mb-2">Verifying Payment...</h2>
                <p className="text-gray-400 text-center">Please do not close this window. We are confirming your slot and sending your receipt.</p>
            </main>
        );
    }

    // STATE 2: Success Screen (Takes over the entire screen for mobile perfection)
    if (submitted) {
        return (
            <main className="bg-[#050505] min-h-screen text-white flex items-center justify-center p-4">
                <div className="max-w-2xl w-full bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 text-center shadow-2xl">
                    <div className="text-5xl animate-bounce mb-8">
                        <CheckCircle className="w-24 h-24 text-green-400 mx-auto" />
                    </div>
                    <h1 className="font-heading text-4xl md:text-5xl font-black italic uppercase text-green-400 mb-4">Application Approved!</h1>
                    <p className="text-lg text-gray-300 mb-8">Your payment has been verified, your vendor slot is confirmed, and your receipt has been emailed.</p>
                    
                    <div className="bg-black/40 border border-white/10 rounded-xl p-6 text-left space-y-4 max-w-md mx-auto">
                        <p className="text-brand-orange font-bold uppercase mb-4 border-b border-brand-orange/20 pb-2">Official Booking Summary</p>
                        <div className="grid grid-cols-2 gap-4">
                            <p className="text-sm"><span className="text-gray-500 block mb-1">Business Name</span> <span className="text-white font-semibold">{formData.businessName}</span></p>
                            <p className="text-sm"><span className="text-gray-500 block mb-1">Contact Person</span> <span className="text-white font-semibold">{formData.contactPerson}</span></p>
                            <p className="text-sm"><span className="text-gray-500 block mb-1">Product Type</span> <span className="text-white font-semibold uppercase">{formData.productType || "Selected Package"}</span></p>
                            <p className="text-sm"><span className="text-gray-500 block mb-1">Amount Paid</span> <span className="text-green-400 font-bold">₦{VENDOR_BOOKING_FEE.toLocaleString()}</span></p>
                        </div>
                        {ticketId && (
                            <div className="mt-4 pt-4 border-t border-white/5">
                                <p className="text-sm"><span className="text-gray-500 block mb-1">Reference ID</span> <span className="text-white font-mono text-sm tracking-wider text-brand-blue">{ticketId}</span></p>
                            </div>
                        )}
                    </div>

                    <Button onClick={() => window.location.href = "/"} className="mt-10 bg-white/10 hover:bg-white/20 text-white px-8 py-6 rounded-full font-bold tracking-widest uppercase">
                        Return to Home
                    </Button>
                </div>
            </main>
        );
    }

    // STATE 3: The standard Vendor Booking Form
    return (
        <main className="bg-[#050505] min-h-screen text-white">
            {/* The rest of your exact layout remains perfectly intact below */}
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
                                    {countLoading ? (
                                        <p className="mt-2 text-sm text-gray-400">Loading available slots...</p>
                                    ) : (
                                        <>
                                            <p className={`mt-2 text-lg font-bold ${slotsLeft <= 5 ? "text-red-400" : "text-white"}`}>
                                                {slotsLeft} of {MAX_VENDORS} slots remaining
                                            </p>
                                            <progress
                                                className="mt-3 h-2 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-white/10 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-brand-orange"
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
                                            disabled={isSubmitting || slotsLeft <= 0}
                                            className={`rounded-xl border px-4 py-4 text-left transition ${isSelected ? "border-brand-orange bg-brand-orange/10 text-white" : "border-white/10 bg-black/20 text-gray-400 hover:border-brand-orange/40"}`}
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

                    <div className="bg-white/5 border border-white/10 p-8 rounded-xl relative">
                        <h3 className="text-xl font-bold uppercase mb-6 text-brand-orange">Application Form</h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200 break-words">
                                    <p className="text-sm font-semibold">{error}</p>
                                </div>
                            )}

                            <div>
                                <label className="text-xs uppercase text-gray-500 block mb-2">Business Name *</label>
                                <Input name="businessName" value={formData.businessName} onChange={handleInputChange} placeholder="Your Business Name" disabled={isSubmitting || slotsLeft <= 0} className="bg-black/50 border-white/10 text-white" />
                            </div>
                            <div>
                                <label className="text-xs uppercase text-gray-500 block mb-2">Contact Person *</label>
                                <Input name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} placeholder="Your Name" disabled={isSubmitting || slotsLeft <= 0} className="bg-black/50 border-white/10 text-white" />
                            </div>
                            <div>
                                <label className="text-xs uppercase text-gray-500 block mb-2">Email Address *</label>
                                <Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="your@email.com" disabled={isSubmitting || slotsLeft <= 0} className="bg-black/50 border-white/10 text-white" />
                            </div>
                            <div>
                                <label className="text-xs uppercase text-gray-500 block mb-2">Phone / WhatsApp *</label>
                                <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="08012345678" type="tel" disabled={isSubmitting || slotsLeft <= 0} className="bg-black/50 border-white/10 text-white" />
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
                                    <span className="font-black text-brand-orange text-xl">₦{VENDOR_BOOKING_FEE.toLocaleString()}</span>
                                </div>
                            </div>

                            <Button type="submit" disabled={isSubmitting || slotsLeft <= 0} className="w-full bg-brand-blue hover:bg-brand-blue/80 text-white py-6 text-lg font-bold uppercase tracking-widest mt-4">
                                {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</> : "PAY NOW"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
                }
                                
