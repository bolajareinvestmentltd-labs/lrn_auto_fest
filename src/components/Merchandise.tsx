"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, ShoppingBag, CreditCard, Sparkles } from "lucide-react";
import Image from "next/image";
import MerchandiseCheckoutModal from "./MerchandiseCheckoutModal";

interface MerchItem {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    badge?: string;
}

// Main carousel items
const MERCHANDISE: MerchItem[] = [
    {
        id: "cap",
        name: "ICS 3.0 Official Cap",
        price: 5000,
        description: "Premium quality cap with embroidered Ilorin Car Show logo. Adjustable strap for perfect fit.",
        image: "/images/merch/cap.PNG",
        badge: "Popular",
    },
    {
        id: "short-sleeve",
        name: "Short Sleeve T-Shirt",
        price: 15000,
        description: "Comfortable cotton blend t-shirt with bold ICS 3.0 graphic print. Available in multiple sizes.",
        image: "/images/merch/short-sleeve.PNG",
    },
    {
        id: "long-sleeve",
        name: "Long Sleeve T-Shirt",
        price: 22000,
        description: "Premium long sleeve shirt with exclusive Ribbon Edition artwork. Perfect for cooler evenings.",
        image: "/images/merch/long-sleeve.PNG",
        badge: "Premium",
    },
];

// Promotional banner images
const PROMO_IMAGES = [
    {
        id: "promo1",
        image: "/images/merch/IMG_6778(1).PNG",
        alt: "Ilorin Car Show 3.0 Merchandise Collection",
    },
    {
        id: "promo2",
        image: "/images/merch/IMG_6779.PNG",
        alt: "The Ribbon Edition Official Gear",
    },
    {
        id: "promo3",
        image: "/images/merch/short-sleeve2.PNG",
        alt: "Limited Edition Festival Apparel",
    },
];

export default function Merchandise() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MerchItem | null>(null);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % MERCHANDISE.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + MERCHANDISE.length) % MERCHANDISE.length);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleBuyNow = (item: MerchItem) => {
        setSelectedItem(item);
        setIsCheckoutOpen(true);
    };

    const currentItem = MERCHANDISE[currentIndex];

    return (
        <section id="merchandise" className="py-24 bg-gradient-to-b from-[#050505] to-[#0a0a0a] relative">
            {/* Background accent */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full px-4 py-2 mb-6"
                    >
                        <ShoppingBag className="w-4 h-4 text-brand-orange" />
                        <span className="text-brand-orange text-sm font-semibold">Official Merch</span>
                    </motion.div>
                    
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="font-heading text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter"
                    >
                        Festival <span className="text-brand-orange">Merchandise</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 mt-4 max-w-lg mx-auto"
                    >
                        Rep the festival in style. Limited edition gear available for pre-order.
                    </motion.p>
                </div>

                {/* Carousel Container */}
                <div className="max-w-4xl mx-auto">
                    <div className="relative">
                        {/* Main Carousel */}
                        <div className="overflow-hidden rounded-2xl">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 overflow-hidden">
                                        <CardContent className="p-0">
                                            <div className="grid md:grid-cols-2 gap-0">
                                                {/* Image */}
                                                <div className="relative aspect-square md:aspect-auto md:h-[400px] bg-gradient-to-br from-gray-800 to-gray-900">
                                                    <Image
                                                        src={currentItem.image}
                                                        alt={currentItem.name}
                                                        fill
                                                        className="object-cover"
                                                        onError={(e) => {
                                                            // Fallback to placeholder if image not found
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = "/images/merch/placeholder.jpg";
                                                        }}
                                                    />
                                                    {currentItem.badge && (
                                                        <div className="absolute top-4 left-4 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                                                            {currentItem.badge}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Details */}
                                                <div className="p-8 flex flex-col justify-center">
                                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                                        {currentItem.name}
                                                    </h3>
                                                    <p className="text-gray-400 mb-6">
                                                        {currentItem.description}
                                                    </p>
                                                    
                                                    <div className="mb-6">
                                                        <span className="text-3xl md:text-4xl font-black text-brand-orange">
                                                            {formatPrice(currentItem.price)}
                                                        </span>
                                                    </div>

                                                    <Button
                                                        onClick={() => handleBuyNow(currentItem)}
                                                        className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-6 text-lg group"
                                                    >
                                                        <CreditCard className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                                        Buy Now
                                                    </Button>

                                                    <p className="text-gray-500 text-sm mt-4 text-center">
                                                        Secure payment via Paystack
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 border border-white/20 hover:border-white/40"
                            aria-label="Previous item"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 border border-white/20 hover:border-white/40"
                            aria-label="Next item"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-3 mt-8">
                        {MERCHANDISE.map((item, index) => (
                            <button
                                key={item.id}
                                onClick={() => goToSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    index === currentIndex
                                        ? "bg-brand-orange w-8"
                                        : "bg-white/30 hover:bg-white/50"
                                }`}
                                aria-label={`Go to ${item.name}`}
                            />
                        ))}
                    </div>

                    {/* Quick Preview Thumbnails */}
                    <div className="flex justify-center gap-4 mt-8">
                        {MERCHANDISE.map((item, index) => (
                            <button
                                key={item.id}
                                onClick={() => goToSlide(index)}
                                aria-label={`View ${item.name}`}
                                title={item.name}
                                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                                    index === currentIndex
                                        ? "border-brand-orange scale-110"
                                        : "border-white/20 opacity-60 hover:opacity-100"
                                }`}
                            >
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "/images/merch/placeholder.jpg";
                                    }}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Promotional Gallery Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-20"
                >
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2 mb-4">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-400 text-sm font-semibold">Collection Preview</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white">
                            The Ribbon Edition Collection
                        </h3>
                        <p className="text-gray-400 mt-2">Limited edition gear - Get yours before they&apos;re gone!</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {PROMO_IMAGES.map((promo, index) => (
                            <motion.div
                                key={promo.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * index }}
                                className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group cursor-pointer"
                            >
                                <Image
                                    src={promo.image}
                                    alt={promo.alt}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "/images/merch/placeholder.jpg";
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <p className="text-white font-semibold text-sm">{promo.alt}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Checkout Modal */}
            <MerchandiseCheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                item={selectedItem}
            />
        </section>
    );
}
