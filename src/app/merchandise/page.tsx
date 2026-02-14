'use client';

import Merchandise from '@/components/Merchandise';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export default function MerchandisePage() {
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
                                src="/iaf_logo.jpeg"
                                alt="Ilorin Car Show Logo"
                                width={80}
                                height={80}
                                className="mx-auto object-contain"
                            />
                        </Link>

                        <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full px-4 py-2 mb-6">
                            <ShoppingBag className="w-4 h-4 text-brand-orange" />
                            <span className="text-brand-orange text-sm font-semibold">Official Merch Store</span>
                        </div>

                        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-4">
                            Get Your <span className="text-brand-orange">Merchandise</span>
                        </h1>

                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Rep the Ilorin Car Show 3.0 in style! Limited edition gear available for pre-order.
                            Pick up at the event on May 30, 2026.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Merchandise Component */}
            <Merchandise />

            {/* Back to Home */}
            <section className="py-12 bg-[#050505]">
                <div className="container mx-auto px-4 text-center">
                    <Link href="/">
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
