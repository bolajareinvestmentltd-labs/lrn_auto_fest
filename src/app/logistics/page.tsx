"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Zap, DollarSign, Clock } from "lucide-react";

const pickupRoutes = [
    {
        icon: MapPin,
        location: "University of Ilorin (Unilorin Campus)",
        price: "₦3,000",
        trip: "Round Trip",
    },
    {
        icon: MapPin,
        location: "KWASU, Malete",
        price: "₦5,000",
        trip: "Round Trip",
    },
    {
        icon: MapPin,
        location: "Kwara Poly / UITH Axis",
        price: "₦3,000",
        trip: "Round Trip",
    },
    {
        icon: MapPin,
        location: "Geri Alimi / Mandate / Adeta Axis",
        price: "₦3,000",
        trip: "Round Trip",
    },
];

const features = [
    {
        icon: Zap,
        title: "Fast Booking",
        description: "Secure your logistics in minutes with our online booking system.",
    },
    {
        icon: Clock,
        title: "Scheduled Service",
        description: "Fixed pickup times with advance notice via WhatsApp.",
    },
    {
        icon: MapPin,
        title: "Multiple Routes",
        description: "Convenient pickups from locations across Ilorin.",
    },
    {
        icon: DollarSign,
        title: "Affordable Prices",
        description: "FREE for the first 50 successful bookings!",
    },
];

export default function LogisticsPage() {
    return (
        <div className="bg-[#050505] min-h-screen">
            {/* Hero Banner */}
            <section className="relative py-20 bg-gradient-to-b from-gray-900 to-[#050505]">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-blue/10 rounded-full blur-3xl" />
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
                            Event <span className="text-brand-blue">Logistics</span>
                        </h1>

                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Convenient pickup and drop-off transportation from multiple locations across Ilorin.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 border-b border-white/10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card className="bg-white/5 border-white/10 hover:border-brand-blue/50 transition-all">
                                    <CardContent className="p-6 text-center">
                                        <feature.icon className="w-8 h-8 text-brand-blue mx-auto mb-4" />
                                        <h3 className="font-heading text-lg text-white mb-2 uppercase">{feature.title}</h3>
                                        <p className="text-gray-400 text-sm">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pickup Routes */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="font-heading text-4xl text-white uppercase tracking-widest mb-4">
                            Pickup <span className="text-brand-blue">Routes</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Choose your preferred pickup location. All routes include round-trip transportation to the event venue.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
                        {pickupRoutes.map((route, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 hover:border-brand-blue/50 transition-all h-full">
                                    <CardContent className="p-8">
                                        <div className="flex items-start gap-4 mb-4">
                                            <route.icon className="w-6 h-6 text-brand-blue shrink-0 mt-1" />
                                            <h3 className="text-lg font-bold text-white">{route.location}</h3>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400">Price:</span>
                                                <span className="text-brand-orange font-bold text-lg">{route.price}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400">Type:</span>
                                                <span className="text-white font-semibold">{route.trip}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 italic pt-2 border-t border-white/10">
                                                FREE for the first 50 successful bookings
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Important Info */}
                    <div className="bg-brand-blue/10 border border-brand-blue/30 rounded-xl p-8 max-w-4xl mx-auto">
                        <h3 className="text-xl font-bold text-brand-blue mb-4 uppercase">Important Information</h3>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex gap-3">
                                <span className="text-brand-blue font-bold">✓</span>
                                <span>Booking closes 48 hours before the event</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-brand-blue font-bold">✓</span>
                                <span>Pickup and drop-off times will be communicated via WhatsApp</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-brand-blue font-bold">✓</span>
                                <span>Late arrival forfeits your seat</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-brand-blue font-bold">✓</span>
                                <span>One Ticket ID equals one logistics seat</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-brand-blue font-bold">✓</span>
                                <span>Logistics bookings are non-transferable</span>
                            </li>
                        </ul>
                    </div>
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
