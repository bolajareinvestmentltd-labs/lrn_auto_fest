"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function VendorsPage() {
  const [showComingSoonModal, setShowComingSoonModal] = useState(true);

  return (
    <div className="min-h-screen bg-[#050505] py-20">
      <div className="max-w-5xl mx-auto px-4 text-center">
        {/* Header */}
        <div className="mb-12">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Ilorin Car Show Logo"
              width={120}
              height={120}
              className="mx-auto mb-4 h-24 w-24 object-contain"
            />
          </Link>
          <h1 className="text-4xl font-bold text-white">Vendors</h1>
        </div>
      </div>

      {/* Coming Soon Modal */}
      <AnimatePresence>
        {showComingSoonModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowComingSoonModal(false)}
              className="fixed inset-0 bg-black/80 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setShowComingSoonModal(false)}
            >
              <div
                className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-2 border-brand-orange/50 rounded-2xl p-8 max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="text-5xl">⏰</div>
                  <button
                    onClick={() => setShowComingSoonModal(false)}
                    className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest">Coming Soon!</h3>
                  <p className="text-gray-300 mb-6">🏪 Vendor registration and booth options will be available soon!</p>
                  <p className="text-brand-orange text-sm font-semibold mb-6">Stay tuned for updates!</p>
                  <Button
                    onClick={() => setShowComingSoonModal(false)}
                    className="bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-6 py-2 rounded-full w-full"
                  >
                    Got It
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

const boothOptions = [
    {
        id: "food",
        icon: UtensilsCrossed,
        title: "Food & Drinks",
        price: 50000,
        duration: "Full Event Day",
        description: "Serve food, drinks, and beverages to festival attendees.",
        perks: ["4x4m space", "Table & Chairs", "Electricity", "Water supply"],
    },
    {
        id: "merch",
        icon: ShoppingBag,
        title: "Merchandise",
        price: 80000,
        duration: "Full Event Day",
        description: "Sell branded merchandise, apparel, or automotive products.",
        perks: ["3x3m space", "Display rack", "Signage setup", "Security"],
    },
    {
        id: "corporate",
        icon: Trophy,
        title: "Corporate Brand",
        price: 250000,
        duration: "Premium Package",
        description: "Premium branding location with VIP amenities and parking.",
        perks: ["5x5m prime space", "Branding rights", "VIP parking", "Dedicated support"],
    },
];

export default function VendorPage() {
    const [selectedBooth, setSelectedBooth] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        brandName: "",
        contactName: "",
        email: "",
        phone: "",
        productType: "",
        additionalInfo: "",
    });

    const selectedBoothData = boothOptions.find(b => b.id === selectedBooth);
    const amount = selectedBoothData?.price || 0;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null);
    };

    const validateForm = () => {
        if (!formData.brandName || !formData.contactName || !formData.email || !formData.phone || !formData.productType) {
            setError("Please fill in all required fields");
            return false;
        }
        if (!selectedBooth) {
            setError("Please select a booth type");
            return false;
        }
        return true;
    };

    const handlePayment = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            // Check if Paystack is loaded
            if (typeof (window as any).PaystackPop === "undefined") {
                throw new Error("Payment system is loading. Please try again.");
            }

            const handler = (window as any).PaystackPop.setup({
                key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
                email: formData.email,
                amount: amount * 100, // Convert to kobo
                currency: "NGN",
                ref: `VND-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                onClose: () => {
                    setIsSubmitting(false);
                },
                onSuccess: async (response: any) => {
                    try {
                        // Send vendor data to backend
                        const res = await fetch("/api/vendors", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                brandName: formData.brandName,
                                contactName: formData.contactName,
                                email: formData.email,
                                phone: formData.phone,
                                boothType: selectedBooth,
                                productType: formData.productType,
                                additionalInfo: formData.additionalInfo,
                                ticketId: response.reference,
                                paymentReference: response.reference,
                                amount: amount,
                                status: "approved",
                            }),
                        });

                        if (res.ok) {
                            // Redirect to confirmation page
                            window.location.href = `/vendor-payment-confirmation?reference=${response.reference}`;
                        } else {
                            setError("Failed to save vendor data. Please contact support.");
                            setIsSubmitting(false);
                        }
                    } catch (err) {
                        setError("Error processing vendor registration");
                        setIsSubmitting(false);
                    }
                },
            });

            handler.openIframe();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Payment failed");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#050505] min-h-screen">
            {/* Hero Banner */}
            <section className="relative py-20 bg-gradient-to-b from-gray-900 to-[#050505]">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-orange/10 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <Link href="/" className="inline-block mb-6">
                            <Image
                                src="/images/logo.png"
                                alt="Ilorin Car Show Logo"
                                width={80}
                                height={80}
                                className="mx-auto object-contain"
                            />
                        </Link>

                        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-4">
                            Become a <span className="text-brand-orange">Vendor</span>
                        </h1>

                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Join thousands of vendors at the Ilorin Automotive Festival 2026!<br />
                            Food, drinks, merchandise, and more welcome.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
                        {/* Booth Selection */}
                        <div className="lg:col-span-2">
                            <h2 className="font-heading text-2xl text-white uppercase tracking-widest mb-8">
                                Step 1: Select Your Booth
                            </h2>

                            <div className="space-y-4">
                                {boothOptions.map((booth, i) => (
                                    <motion.button
                                        key={booth.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        onClick={() => setSelectedBooth(booth.id)}
                                        className={`w-full text-left transition-all duration-300 rounded-xl border-2 p-6 ${
                                            selectedBooth === booth.id
                                                ? "border-brand-orange bg-brand-orange/10"
                                                : "border-white/10 bg-white/5 hover:border-white/30"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4 flex-1">
                                                <booth.icon className={`w-6 h-6 shrink-0 mt-1 ${
                                                    selectedBooth === booth.id ? "text-brand-orange" : "text-gray-400"
                                                }`} />
                                                <div>
                                                    <h3 className="text-lg font-bold text-white">{booth.title}</h3>
                                                    <p className="text-gray-400 text-sm mt-1">{booth.description}</p>
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {booth.perks.map((perk, j) => (
                                                            <span key={j} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded">
                                                                {perk}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-brand-orange text-2xl font-bold">
                                                    ₦{booth.price.toLocaleString()}
                                                </div>
                                                <div className="text-xs text-gray-400">{booth.duration}</div>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Application Form */}
                        <div>
                            <h2 className="font-heading text-2xl text-white uppercase tracking-widest mb-8">
                                Step 2: Your Details
                            </h2>

                            <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10">
                                <CardContent className="p-6">
                                    <form className="space-y-4">
                                        <div>
                                            <label className="block text-xs uppercase text-gray-400 mb-2 tracking-widest">
                                                Brand Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="brandName"
                                                value={formData.brandName}
                                                onChange={handleInputChange}
                                                placeholder="Your business name"
                                                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs uppercase text-gray-400 mb-2 tracking-widest">
                                                Contact Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="contactName"
                                                value={formData.contactName}
                                                onChange={handleInputChange}
                                                placeholder="Your full name"
                                                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs uppercase text-gray-400 mb-2 tracking-widest">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="your@email.com"
                                                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs uppercase text-gray-400 mb-2 tracking-widest">
                                                Phone *
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="08012345678"
                                                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs uppercase text-gray-400 mb-2 tracking-widest">
                                                Product Type *
                                            </label>
                                            <input
                                                type="text"
                                                name="productType"
                                                value={formData.productType}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Shawarma, T-shirts"
                                                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs uppercase text-gray-400 mb-2 tracking-widest">
                                                Additional Info (Optional)
                                            </label>
                                            <textarea
                                                name="additionalInfo"
                                                value={formData.additionalInfo}
                                                onChange={handleInputChange}
                                                placeholder="Tell us about your business..."
                                                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange resize-none h-20"
                                            />
                                        </div>

                                        {error && (
                                            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex gap-2">
                                                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                                <span className="text-sm text-red-300">{error}</span>
                                            </div>
                                        )}

                                        {selectedBoothData && (
                                            <div className="space-y-4">
                                                <div className="bg-brand-orange/10 border border-brand-orange/30 rounded-lg p-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-300">Booth Fee:</span>
                                                        <span className="text-white font-bold text-lg">
                                                            ₦{amount.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                <Button
                                                    type="button"
                                                    onClick={handlePayment}
                                                    disabled={isSubmitting}
                                                    className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 rounded-lg uppercase tracking-widest disabled:opacity-50"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        `Pay ₦${amount.toLocaleString()} & Submit`
                                                    )}
                                                </Button>
                                            </div>
                                        )}
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Loaded Script */}
                    <script src="https://js.paystack.co/v1/inline.js"></script>
                </div>
            </section>

            {/* Back to Home */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center py-12"
            >
                <Link href="/">
                    <Button variant="ghost" className="text-gray-400 hover:text-white">
                        ← Back to Home
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
}