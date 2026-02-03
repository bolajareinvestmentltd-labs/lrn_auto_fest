"use client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle } from "lucide-react";

interface BoothType {
    id: string;
    name: string;
    emoji: string;
    price: number;
    description: string;
}

const BOOTH_TYPES: BoothType[] = [
    { id: "food", name: "Food & Drinks", emoji: "🍔", price: 50000, description: "4x4m space, table & chairs, electricity" },
    { id: "merch", name: "Merchandise", emoji: "🎁", price: 80000, description: "3x3m space, display rack, signage" },
    { id: "corporate", name: "Corporate Brand", emoji: "🏆", price: 250000, description: "5x5m prime location, branding, VIP parking" }
];

export default function VendorPage() {
    const [formData, setFormData] = useState({
        brandName: "",
        contactName: "",
        phone: "",
        email: "",
        productType: "",
        message: ""
    });
    const [selectedBooth, setSelectedBooth] = useState<BoothType | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [paystackLoaded, setPaystackLoaded] = useState(false);
    const [ticketId, setTicketId] = useState("");

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

    // Calculate processing fee for vendors
    const calculateProcessingFee = (amount: number): number => {
        // 2% + ₦150 covers Paystack fees with small buffer
        const fee = Math.round(amount * 0.02) + 150;
        // Cap at ₦2,500 to be fair
        return Math.min(fee, 2500);
    };

    const processingFee = selectedBooth ? calculateProcessingFee(selectedBooth.price) : 0;
    const totalAmount = selectedBooth ? selectedBooth.price + processingFee : 0;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.brandName || !formData.contactName || !formData.phone || !formData.email || !selectedBooth) {
            alert("Please fill in all required fields and select a booth type");
            return;
        }

        if (!formData.email.includes("@")) {
            alert("Please enter a valid email");
            return;
        }

        if (!paystackLoaded || !(window as any).PaystackPop) {
            alert("Payment system is loading. Please try again.");
            return;
        }

        setIsSubmitting(true);

        const generateTicketId = () => {
            return `VND-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        };

        const newTicketId = generateTicketId();

        // Use environment variable for Paystack key
        const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_858607a04052382e73797962635921e549646549";

        const handler = (window as any).PaystackPop.setup({
            key: paystackKey,
            email: formData.email,
            amount: totalAmount * 100, // Amount in kobo (includes processing fee)
            ref: newTicketId,
            currency: "NGN",
            onClose: () => {
                setIsSubmitting(false);
                alert("Payment cancelled. Your application was not submitted.");
            },
            onSuccess: async (transaction: any) => {
                try {
                    // Save vendor application to database
                    const response = await fetch("/api/vendors", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            brandName: formData.brandName,
                            contactName: formData.contactName,
                            phone: formData.phone,
                            email: formData.email,
                            boothType: selectedBooth.id,
                            productType: formData.productType,
                            additionalInfo: formData.message,
                            ticketId: newTicketId,
                            paymentReference: transaction.reference,
                            amount: selectedBooth.price,
                            status: "approved" // Auto-approved
                        })
                    });

                    if (response.ok) {
                        setTicketId(newTicketId);
                        setSubmitted(true);
                        setFormData({
                            brandName: "",
                            contactName: "",
                            phone: "",
                            email: "",
                            productType: "",
                            message: ""
                        });
                        setSelectedBooth(null);
                    } else {
                        throw new Error("Failed to save vendor application");
                    }
                } catch (error) {
                    console.error("Error:", error);
                    alert("Payment verified but failed to save application. Please contact support.");
                } finally {
                    setIsSubmitting(false);
                }
            }
        });
        handler.openIframe();
    };

    return (
        <main className="bg-[#050505] min-h-screen text-white">
            <Navbar />

            <div className="container mx-auto px-4 py-32">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="font-heading text-4xl md:text-6xl font-black italic uppercase">
                        Become a <span className="text-brand-blue">Vendor</span>
                    </h1>
                    <p className="text-gray-400 mt-6 text-lg">
                        Showcase your brand to thousands of automotive enthusiasts.
                        Limited spots available for food, merchandise, and car parts.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* PRICING INFO */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-heading uppercase text-brand-orange">Booth Prices</h3>

                        {BOOTH_TYPES.map((booth) => (
                            <Card
                                key={booth.id}
                                onClick={() => setSelectedBooth(booth)}
                                className={`cursor-pointer border-2 transition ${selectedBooth?.id === booth.id
                                    ? "border-brand-orange bg-brand-orange/10"
                                    : "border-white/10 bg-white/5 hover:border-brand-orange/50"
                                    }`}
                            >
                                <CardHeader>
                                    <CardTitle className="text-white">
                                        {booth.emoji} {booth.name}
                                        {selectedBooth?.id === booth.id && (
                                            <span className="ml-2 text-sm text-brand-orange">✓ Selected</span>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-gray-300 space-y-2">
                                    <p className="text-2xl font-bold text-brand-orange">₦{booth.price.toLocaleString()}</p>
                                    <p className="text-xs text-gray-400 mt-2">Includes: {booth.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* APPLICATION FORM */}
                    <div className="bg-white/5 border border-white/10 p-8 rounded-xl">
                        <h3 className="text-xl font-bold uppercase mb-6 text-brand-orange">Application Form</h3>

                        {submitted ? (
                            <div className="text-center space-y-6 py-8">
                                <div className="text-5xl animate-bounce"><CheckCircle className="w-16 h-16 text-green-400 mx-auto" /></div>
                                <div>
                                    <p className="text-xl font-bold text-green-400 mb-2">✅ Application Approved!</p>
                                    <p className="text-sm text-gray-300 mb-4">Your payment has been verified and your booth is confirmed.</p>
                                </div>

                                <div className="bg-brand-orange/10 border border-brand-orange/50 p-4 rounded-lg">
                                    <p className="text-xs text-gray-500 uppercase mb-1">Your Confirmation Ticket ID</p>
                                    <p className="text-lg font-mono font-bold text-brand-orange break-all">{ticketId}</p>
                                    <p className="text-xs text-gray-400 mt-3">📧 Confirmation email sent to your registered email address with full details and invoice.</p>
                                </div>

                                <div className="bg-blue-500/10 border border-brand-blue/30 p-3 rounded-lg text-left">
                                    <p className="text-xs text-gray-400">💡 <strong>Next Steps:</strong></p>
                                    <ul className="text-xs text-gray-400 mt-2 space-y-1">
                                        <li>✓ Check email for receipt and booth details</li>
                                        <li>✓ Your booth is auto-approved and confirmed</li>
                                        <li>✓ Setup details will be sent 2 weeks before event</li>
                                        <li>✓ Admin team will contact you if needed</li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs uppercase text-gray-500 block mb-2">Brand Name *</label>
                                    <Input
                                        name="brandName"
                                        value={formData.brandName}
                                        onChange={handleInputChange}
                                        placeholder="Your Brand Name"
                                        disabled={isSubmitting}
                                        className="bg-black/50 border-white/10 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs uppercase text-gray-500 block mb-2">Contact Name *</label>
                                    <Input
                                        name="contactName"
                                        value={formData.contactName}
                                        onChange={handleInputChange}
                                        placeholder="Your Name"
                                        disabled={isSubmitting}
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
                                        disabled={isSubmitting}
                                        className="bg-black/50 border-white/10 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs uppercase text-gray-500 block mb-2">Phone Number *</label>
                                    <Input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="08012345678"
                                        type="tel"
                                        disabled={isSubmitting}
                                        className="bg-black/50 border-white/10 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs uppercase text-gray-500 block mb-2">Product Type *</label>
                                    <Input
                                        name="productType"
                                        value={formData.productType}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Shawarma, Car Accessories, Merchandise"
                                        disabled={isSubmitting}
                                        className="bg-black/50 border-white/10 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs uppercase text-gray-500 block mb-2">Additional Info</label>
                                    <Textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        placeholder="Tell us about your brand or services (optional)"
                                        disabled={isSubmitting}
                                        className="bg-black/50 border-white/10 text-white h-20"
                                    />
                                </div>

                                {selectedBooth && (
                                    <div className="bg-brand-orange/10 border border-brand-orange/50 p-4 rounded-lg space-y-3">
                                        <p className="text-xs text-gray-400">💰 Selected Booth</p>
                                        <p className="text-lg font-bold text-brand-orange">{selectedBooth.emoji} {selectedBooth.name}</p>
                                        
                                        {/* Price Breakdown */}
                                        <div className="space-y-1 text-sm bg-black/30 p-3 rounded">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Booth Price:</span>
                                                <span className="text-white">₦{selectedBooth.price.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Processing Fee:</span>
                                                <span className="text-gray-300">₦{processingFee.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between pt-2 border-t border-white/10">
                                                <span className="font-semibold text-gray-300">Total:</span>
                                                <span className="text-lg font-bold text-brand-orange">₦{totalAmount.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !selectedBooth}
                                    className="w-full bg-brand-orange hover:bg-orange-600 disabled:opacity-50 text-white font-bold uppercase h-11"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Processing Payment...
                                        </>
                                    ) : (
                                        `Pay ₦${selectedBooth ? totalAmount.toLocaleString() : "0"} & Submit`
                                    )}
                                </Button>

                                <p className="text-[10px] text-center text-gray-500 uppercase">
                                    🔒 Secure payment powered by Paystack. Your booth will be auto-approved once payment is verified.
                                </p>
                            </form>
                        )}
                    </div>
                </div>

                {/* FAQs */}
                <div className="max-w-3xl mx-auto mt-20 pt-20 border-t border-white/10">
                    <h2 className="text-3xl font-heading uppercase mb-8 text-center">FAQs</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-bold text-brand-orange mb-2">Do I need prior experience?</h4>
                            <p className="text-gray-400 text-sm">No! We welcome new vendors. Just show passion for your product.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-brand-orange mb-2">What's the event date?</h4>
                            <p className="text-gray-400 text-sm">May 30, 2026 at Metropolitan Square, Asadam Road, Ilorin.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-brand-orange mb-2">Do you provide electricity?</h4>
                            <p className="text-gray-400 text-sm">Yes! All premium booths include electricity. Basic booths on request.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-brand-orange mb-2">Can I cancel my booking?</h4>
                            <p className="text-gray-400 text-sm">Cancellations accepted up to 2 weeks before the event with 50% refund.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
