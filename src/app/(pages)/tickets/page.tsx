"use client";
import Tickets from "@/components/Tickets";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function TicketsPage() {
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
              Secure Your <span className="text-brand-orange">Tickets</span>
            </h1>

            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Multiple ticket tiers to fit every budget.<br />
              Presale ends March 31. Lock in early pricing now!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tickets Component - Full Page Version */}
      <Tickets />

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
