"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CountdownTimer from "./CountdownTimer";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";

// Event configuration
const EVENT_DATE = "2026-05-30T09:00:00";
const PRESALE_END_DATE = "2026-03-31T23:59:59";
const EVENT_VENUE = "Metropolitan Square, Asadam Road, Ilorin";
const VENUE_COORDS = "8.4799,4.5418"; // Ilorin coordinates

export default function Hero() {
  // Check if presale is still active
  const isPresaleActive = new Date() < new Date(PRESALE_END_DATE);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [titleIndex, setTitleIndex] = useState(0);

  // Cycle through title animation - sequential reveal
  useEffect(() => {
    // Start from -1 (nothing visible)
    setTitleIndex(-1);

    // Reveal each part with delays
    const timer1 = setTimeout(() => setTitleIndex(0), 500);   // Show ILORIN
    const timer2 = setTimeout(() => setTitleIndex(1), 1200);  // Show CAR SHOW
    const timer3 = setTimeout(() => setTitleIndex(2), 1900);  // Show 3.0
    const timer4 = setTimeout(() => setTitleIndex(3), 2600);  // All complete

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  // Auto-play video with sound on page load
  useEffect(() => {
    const playVideoWithSound = async () => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        try {
          await videoRef.current.play();
        } catch {
          // If autoplay with sound fails, try muted first then unmute
          videoRef.current.muted = true;
          await videoRef.current.play();
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.muted = false;
            }
          }, 100);
        }
      }
    };
    playVideoWithSound();
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* 1. VIDEO BACKGROUND with fallback */}
      <div className="absolute inset-0 bg-[url('/images/hero-fallback.svg')] bg-cover bg-center z-0" />
      <video
        ref={videoRef}
        autoPlay
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-[1] opacity-60"
      >
        <source src="/hero-drift.mp4" type="video/mp4" />
      </video>

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
        {/* BIG LOGO AT TOP */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <Image
            src="/iaf_logo.jpeg"
            alt="Ilorin Car Show Logo"
            width={180}
            height={180}
            priority
            className="mx-auto h-36 w-36 sm:h-44 sm:w-44 md:h-52 md:w-52 object-contain"
          />
        </motion.div>

        {/* PRESENT text - cursive */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/80 text-xl sm:text-2xl md:text-3xl mb-4 italic"
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
        >
          Present
        </motion.p>

        {/* Animated Title - ILORIN CAR SHOW 3.0 */}
        <div className="font-heading font-black italic tracking-tighter text-white uppercase text-4xl sm:text-6xl md:text-8xl leading-tight">
          <AnimatePresence>
            {titleIndex >= 0 && (
              <motion.span
                key="ilorin"
                initial={{ opacity: 0, scale: 0.3, rotateX: -90 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  duration: 0.6
                }}
                className="inline-block"
              >
                Ilorin{" "}
              </motion.span>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {titleIndex >= 1 && (
              <motion.span
                key="carshow"
                initial={{ opacity: 0, scale: 0.3, y: 50 }}
                animate={{
                  opacity: 1,
                  scale: [1, 1.1, 1],
                  y: 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 12,
                  scale: { repeat: 2, repeatType: "reverse", duration: 0.3 }
                }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-orange inline-block"
              >
                Car Show
              </motion.span>
            )}
          </AnimatePresence>
          <br />
          <AnimatePresence>
            {titleIndex >= 2 && (
              <motion.span
                key="3.0"
                initial={{ opacity: 0, scale: 2, rotate: -10 }}
                animate={{
                  opacity: 1,
                  scale: [1, 1.2, 0.9, 1.1, 1],
                  rotate: [0, 5, -5, 3, 0],
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 10,
                  duration: 0.8
                }}
                className="inline-block"
              >
                3.0
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* The Reborn Edition */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-brand-orange font-semibold text-lg sm:text-xl md:text-2xl italic"
        >
          [The Reborn Edition]
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 mx-auto max-w-xl"
        >
          <p className="text-gray-300 font-sans text-base sm:text-xl">
            Cars • Bikes • Drift • Lifestyle
          </p>
          <p className="text-gray-300 font-sans text-base sm:text-xl mt-2">
            The Biggest Auto Experience in Northern Nigeria
          </p>
        </motion.div>

        {/* Event Date & Venue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center text-white/80"
        >
          <a
            href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Ilorin%20Car%20Show%203.0%20-%20The%20Reborn%20Edition&dates=20260530T080000Z/20260530T200000Z&details=The%20Biggest%20Auto%20Experience%20in%20Northern%20Nigeria&location=Metropolitan%20Square%2C%20Asadam%20Road%2C%20Ilorin"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-brand-orange transition-colors cursor-pointer group"
          >
            <Calendar className="w-5 h-5 text-brand-orange group-hover:scale-110 transition-transform" />
            <span className="text-sm md:text-base font-semibold group-hover:underline">May 30, 2026</span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <span className="hidden sm:block text-white/40">|</span>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${VENUE_COORDS}&travelmode=driving`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-brand-blue transition-colors cursor-pointer group"
          >
            <MapPin className="w-5 h-5 text-brand-blue group-hover:scale-110 transition-transform" />
            <span className="text-sm md:text-base group-hover:underline">{EVENT_VENUE}</span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
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

        {/* CTA Buttons - Row 1 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 flex flex-wrap gap-3 justify-center items-center"
        >
          <Link href="/register">
            <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-base px-6 py-5 rounded-full uppercase shadow-lg shadow-green-900/20">
              📝 Register
            </Button>
          </Link>
          <Link href="/tickets">
            <Button size="lg" className="bg-brand-orange hover:bg-orange-600 text-white font-bold text-base px-6 py-5 rounded-full uppercase shadow-lg shadow-orange-900/20">
              🎟️ Get Tickets
            </Button>
          </Link>
          <Link href="/vip">
            <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-base px-6 py-5 rounded-full uppercase shadow-lg">
              💎 VIP Packages
            </Button>
          </Link>
          <Link href="/vendors">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold text-base px-6 py-5 rounded-full uppercase shadow-lg shadow-blue-900/20">
              🏪 Vendor Space
            </Button>
          </Link>
          <Link href="/merchandise">
            <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-base px-6 py-5 rounded-full uppercase shadow-lg shadow-purple-900/20">
              🛍️ Get Merch
            </Button>
          </Link>
          <Link href="/logistics">
            <Button size="lg" className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-bold text-base px-6 py-5 rounded-full uppercase shadow-lg shadow-indigo-900/20">
              🚌 Logistics
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
