"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CountdownTimer from "./CountdownTimer";
import { Calendar, MapPin, Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";

// Event configuration
const EVENT_DATE = "2026-05-30T09:00:00";
const PRESALE_END_DATE = "2026-03-31T23:59:59";

export default function Hero() {
  // Check if presale is still active
  const isPresaleActive = new Date() < new Date(PRESALE_END_DATE);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* 1. VIDEO BACKGROUND with fallback */}
      <div className="absolute inset-0 bg-[url('/images/hero-fallback.svg')] bg-cover bg-center z-0" />
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-[1] opacity-60"
      >
        <source src="/hero-drift.mp4" type="video/mp4" />
      </video>

      {/* SOUND TOGGLE BUTTON */}
      <button
        onClick={toggleMute}
        className="absolute bottom-6 right-6 z-30 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 border border-white/20 hover:border-white/40"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/50 to-black/30 z-10" />

      {/* 3. EARLY BIRD BANNER */}
      {isPresaleActive && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-r from-brand-orange via-orange-500 to-brand-orange py-2 text-center"
        >
          <p className="text-white text-sm md:text-base font-bold tracking-wide">
            🎟️ EARLY BIRD ENDS MARCH 31, 2026 — Prices Increase April 1st!
          </p>
        </motion.div>
      )}

      {/* 4. CONTENT */}
      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-16 md:mt-20">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-heading font-black italic tracking-tighter text-white uppercase text-4xl sm:text-6xl md:text-8xl leading-tight"
        >
          Ilorin <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-orange">Automotive</span>
          <br /> Festival 2026
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-gray-300 font-sans mx-auto max-w-xl text-base sm:text-xl"
        >
          Cars. Bikes. Drift. Lifestyle. The Biggest Auto Experience in Ilorin.
        </motion.p>

        {/* Event Date & Venue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center text-white/80"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-orange" />
            <span className="text-sm md:text-base font-semibold">May 30, 2026</span>
          </div>
          <span className="hidden sm:block text-white/40">|</span>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-blue" />
            <span className="text-sm md:text-base">Metropolitan Square, Asadam Road, Ilorin</span>
          </div>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <p className="text-white/60 text-xs uppercase tracking-widest mb-3">Countdown to Event</p>
          <CountdownTimer targetDate={EVENT_DATE} />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/tickets">
            <Button size="lg" className="bg-brand-orange hover:bg-orange-600 text-white font-bold text-lg px-10 py-6 rounded-full uppercase shadow-lg shadow-orange-900/20">
              🎟️ Buy Tickets
            </Button>
          </Link>
          <Link href="/vip">
            <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-lg px-10 py-6 rounded-full uppercase shadow-lg">
              💎 VIP Packages
            </Button>
          </Link>
        </motion.div>

        {/* Secondary CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4"
        >
          <Link href="/vendors">
            <Button variant="outline" size="lg" className="border-brand-blue text-brand-blue hover:bg-brand-blue/10 font-bold px-8 py-4 rounded-full uppercase">
              Vendor Space →
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
