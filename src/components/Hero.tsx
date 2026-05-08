"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CountdownTimer from "./CountdownTimer";
import { Calendar, MapPin, ExternalLink, Zap, Flame, Trophy, Music, Volume2, VolumeX } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";

// Event configuration
const EVENT_DATE = "2026-05-28T09:00:00";
const PRESALE_END_DATE = "2026-03-31T23:59:59";
const EVENT_VENUE = "Metropolitan Square, Asadam Road, Ilorin, Kwara State";
const VENUE_COORDS = "8.4799,4.5418";
const STORE_URL = "https://cusecho.store/ilorinautomotivefestival";

export default function Hero() {
  const isPresaleActive = new Date() < new Date(PRESALE_END_DATE);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [titleIndex, setTitleIndex] = useState(-1);
  const [selectedVideo, setSelectedVideo] = useState<string>("");
  const [showComingSoonModal, setShowComingSoonModal] = useState<string | null>(null);
  
  // MUST start true for mobile browsers to allow autoplay
  const [isMuted, setIsMuted] = useState(true); 

  useEffect(() => {
    const videos = ["/videos/hero-video-primary.mp4", "/videos/hero-video-secondary.mp4"];
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    setSelectedVideo(randomVideo);
  }, []);

  useEffect(() => {
    setTitleIndex(-1);
    const timer1 = setTimeout(() => setTitleIndex(0), 500);
    const timer2 = setTimeout(() => setTitleIndex(1), 1200);
    const timer3 = setTimeout(() => setTitleIndex(2), 1900);
    const timer4 = setTimeout(() => setTitleIndex(3), 2600);
    return () => {
      [timer1, timer2, timer3, timer4].forEach(clearTimeout);
    };
  }, []);

  // Function to handle the sound toggle
  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-black">
      <div className="absolute inset-0 bg-[url('/images/hero-fallback.svg')] bg-cover bg-center z-0" />
      
      {/* Video will now always play safely */}
      {selectedVideo && (
        <video
          key={selectedVideo}
          ref={videoRef}
          autoPlay
          loop
          playsInline
          muted={isMuted}
          className="absolute top-0 left-0 w-full h-full object-cover z-[1] opacity-60"
        >
          <source src={selectedVideo} type="video/mp4" />
        </video>
      )}

      {/* Invisible overlay - tap background to mute/unmute sound */}
      <div 
        onClick={toggleSound} 
        className="absolute inset-0 z-10 cursor-pointer" 
        title={isMuted ? "Tap to unmute" : "Tap to mute"}
      />

      {/* Subtle Sound Indicator so users know to tap */}
      <div className="absolute bottom-6 right-6 z-20 pointer-events-none text-white/50 flex items-center gap-2 bg-black/40 px-3 py-2 rounded-full border border-white/10 backdrop-blur-sm">
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-brand-orange" />}
        <span className="text-[10px] uppercase tracking-widest">{isMuted ? "Tap for sound" : "Sound On"}</span>
      </div>

      {isPresaleActive && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="absolute top-0 left-0 right-0 z-30 bg-brand-orange py-2 text-center pointer-events-none"
        >
          <p className="font-sans font-semibold text-white text-xs tracking-widest uppercase">
            🎟️ EARLY BIRD ENDS MARCH 31, 2026 — Prices Increase April 1st!
          </p>
        </motion.div>
      )}

      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-16 pointer-events-none">
        {/* Added pointer-events-auto to individual elements so background clicks still register */}
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mb-1 pointer-events-auto">
          <Image src="/images/logo.png" alt="IAF 2026" width={260} height={260} priority className="mx-auto h-48 w-48 sm:h-64 sm:w-64 lg:h-72 lg:w-72 object-contain" />
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-accent text-white/70 text-lg mb-4 italic tracking-widest">
          Presents
        </motion.p>

        <div className="font-heading font-black italic text-fluid-hero text-white uppercase">
          <AnimatePresence>
            {titleIndex >= 0 && <motion.span key="i" initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }}>Ilorin </motion.span>}
            {titleIndex >= 1 && <motion.span key="c" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-orange">Car Show </motion.span>}
            {titleIndex >= 2 && <motion.span key="3" initial={{ opacity: 0, scale: 2 }} animate={{ opacity: 1, scale: 1 }}>3.0</motion.span>}
          </AnimatePresence>
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-accent mt-2 text-brand-orange text-base sm:text-2xl italic">
          [The Reborn Edition]
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 mb-6 pointer-events-auto">
          <div className="flex flex-col items-center"><Zap className="w-6 h-6 text-blue-400 mb-2" /><p className="text-white/80 text-xs uppercase font-semibold">Drift</p></div>
          <div className="flex flex-col items-center"><Trophy className="w-6 h-6 text-yellow-400 mb-2" /><p className="text-white/80 text-xs uppercase font-semibold">Keke Race</p></div>
          <div className="flex flex-col items-center"><Flame className="w-6 h-6 text-red-400 mb-2" /><p className="text-white/80 text-xs uppercase font-semibold">Drag Race</p></div>
          <div className="flex flex-col items-center"><Music className="w-6 h-6 text-purple-400 mb-2" /><p className="text-white/80 text-xs uppercase font-semibold">Stunts</p></div>
        </div>

        <motion.div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center text-white/80 font-semibold pointer-events-auto">
          <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-brand-orange" /><span>May 30, 2026</span></div>
          <span className="hidden sm:block opacity-40">|</span>
          <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-brand-blue" /><span className="font-light">{EVENT_VENUE}</span></div>
        </motion.div>

        <div className="mt-8 pointer-events-auto">
          <p className="text-white/50 text-[10px] uppercase tracking-[0.35em] mb-3">Countdown to Event</p>
          <CountdownTimer targetDate={EVENT_DATE} />
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 flex flex-wrap gap-4 justify-center items-center pointer-events-auto">
          <Button asChild size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-8 py-6 rounded-full uppercase z-30 relative">
            <Link href="/register">🎤 Register</Link>
          </Button>

          <Button asChild size="lg" className="bg-brand-orange hover:bg-orange-600 text-white font-bold px-8 py-6 rounded-full uppercase shadow-xl z-30 relative">
            <a href={STORE_URL} target="_blank" rel="noopener noreferrer">🎟️ Get Tickets/Merch</a>
          </Button>

          <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold px-8 py-6 rounded-full uppercase z-30 relative">
            <Link href="/vendors">🏪 Vendors</Link>
          </Button>

          <Button variant="outline" onClick={() => setShowComingSoonModal('logistics')} size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 rounded-full uppercase z-30 relative">
            🚌 Logistics
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showComingSoonModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowComingSoonModal(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={(e) => e.stopPropagation()} className="bg-gray-900 border border-brand-orange rounded-2xl p-8 max-w-md w-full text-center">
              <div className="text-5xl mb-4">⏰</div>
              <h3 className="text-2xl font-bold text-white mb-2 uppercase">Coming Soon!</h3>
              <p className="text-gray-400 mb-6">Logistics information and shuttle routes will be available soon!</p>
              <Button onClick={() => setShowComingSoonModal(null)} className="bg-brand-orange text-white w-full">Got It</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
      }
