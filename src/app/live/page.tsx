"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const dynamic = 'force-dynamic';

import {
    Users,
    Car,
    Clock,
    Sparkles,
    TrendingUp,
    MapPin,
    Star,
    Zap,
    Trophy,
    Camera,
    Music,
    PartyPopper
} from "lucide-react";

interface LiveStats {
    totalAttendees: number;
    checkedIn: number;
    vipGuests: number;
    carsOnDisplay: number;
    parkingUsed: number;
}

interface Announcement {
    id: number;
    message: string;
    type: 'info' | 'vip' | 'alert' | 'sponsor';
    time: string;
}

interface SocialPost {
    id: number;
    username: string;
    content: string;
    likes: number;
    time: string;
}

export default function LiveDashboard() {
    const [stats, setStats] = useState<LiveStats>({
        totalAttendees: 5000,
        checkedIn: 0,
        vipGuests: 0,
        carsOnDisplay: 50,
        parkingUsed: 0
    });

    const [currentTime, setCurrentTime] = useState(new Date());
    const [announcements, setAnnouncements] = useState<Announcement[]>([
        { id: 1, message: "🎉 Welcome to Ilorin Auto Festival 2026!", type: 'info', time: '10:00 AM' },
        { id: 2, message: "🚗 First car reveal in 30 minutes at Main Stage!", type: 'alert', time: '10:15 AM' },
        { id: 3, message: "⭐ VIP Lounge now open - Complimentary drinks available", type: 'vip', time: '10:30 AM' },
        { id: 4, message: "🏆 Sponsored by Premium Motors - Visit Booth A1", type: 'sponsor', time: '10:45 AM' },
    ]);

    const [socialPosts, setSocialPosts] = useState<SocialPost[]>([
        { id: 1, username: "@car_lover_ng", content: "This festival is INSANE! The Lamborghini section is 🔥 #IAF2026", likes: 234, time: "2m ago" },
        { id: 2, username: "@ilorin_vibes", content: "VIP treatment is top notch! Best event in Kwara State 💯", likes: 189, time: "5m ago" },
        { id: 3, username: "@auto_enthusiast", content: "Just saw the new Tesla Cybertruck in person! Mind blown 🤯", likes: 456, time: "8m ago" },
        { id: 4, username: "@naija_wheels", content: "The sound systems at this event are CRAZY! #IAF2026", likes: 312, time: "12m ago" },
    ]);

    const [activePostIndex, setActivePostIndex] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());

            // Simulate check-ins
            setStats(prev => {
                const newCheckedIn = Math.min(prev.checkedIn + Math.floor(Math.random() * 5), prev.totalAttendees);
                const newVip = Math.min(prev.vipGuests + (Math.random() > 0.7 ? 1 : 0), 500);
                const newParking = Math.min(prev.parkingUsed + (Math.random() > 0.5 ? 1 : 0), 300);

                // Celebration at milestones
                if (newCheckedIn % 1000 === 0 && newCheckedIn > 0 && newCheckedIn !== prev.checkedIn) {
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 3000);
                }

                return {
                    ...prev,
                    checkedIn: newCheckedIn,
                    vipGuests: newVip,
                    parkingUsed: newParking
                };
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    // Rotate social posts
    useEffect(() => {
        const interval = setInterval(() => {
            setActivePostIndex(prev => (prev + 1) % socialPosts.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [socialPosts.length]);

    // Fetch real stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/gate-stats');
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setStats(prev => ({
                            ...prev,
                            checkedIn: data.stats.scannedTickets,
                            totalAttendees: data.stats.totalTickets || prev.totalAttendees
                        }));
                    }
                }
            } catch (error) {
                console.log('Using simulated stats');
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    const scheduleItems = [
        { time: "10:00 AM", event: "Gates Open", icon: MapPin, active: true },
        { time: "11:00 AM", event: "Opening Ceremony", icon: PartyPopper, active: false },
        { time: "12:00 PM", event: "Classic Cars Parade", icon: Car, active: false },
        { time: "2:00 PM", event: "Supercar Reveal", icon: Sparkles, active: false },
        { time: "4:00 PM", event: "Drift Competition", icon: Zap, active: false },
        { time: "6:00 PM", event: "Awards Ceremony", icon: Trophy, active: false },
        { time: "8:00 PM", event: "Live Concert", icon: Music, active: false },
    ];

    const sponsors = [
        "Flow FM 97.3", "Kwara State Government"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            {/* Confetti Effect */}
            <AnimatePresence>
                {showConfetti && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 pointer-events-none z-50"
                    >
                        {[...Array(50)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-3 h-3 rounded-full"
                                style={{
                                    background: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][Math.floor(Math.random() * 5)],
                                    left: `${Math.random() * 100}%`,
                                }}
                                initial={{ y: -20, opacity: 1 }}
                                animate={{
                                    y: typeof window !== 'undefined' ? window.innerHeight + 20 : 800,
                                    opacity: 0,
                                    rotate: Math.random() * 360
                                }}
                                transition={{
                                    duration: 2 + Math.random() * 2,
                                    ease: "easeOut"
                                }}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="relative z-10 py-6 px-8 border-b border-white/10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-75" />
                            <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-xl">
                                <h1 className="text-2xl font-bold tracking-tight">IAF 2026</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full border border-green-500/50">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span className="text-green-400 font-semibold">LIVE</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-sm text-gray-400">Current Time</p>
                            <p className="text-3xl font-bold font-mono">
                                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-400">Date</p>
                            <p className="text-xl font-semibold">February 1, 2026</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-8 py-8">
                {/* Big Stats */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {/* Main Counter */}
                    <motion.div
                        className="col-span-2 bg-gradient-to-br from-purple-600/30 to-pink-600/30 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-purple-500/30 rounded-xl">
                                <Users className="w-8 h-8 text-purple-300" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-300">Attendees Checked In</h2>
                        </div>
                        <div className="flex items-end gap-4">
                            <motion.span
                                key={stats.checkedIn}
                                initial={{ scale: 1.2, color: '#22c55e' }}
                                animate={{ scale: 1, color: '#ffffff' }}
                                className="text-7xl font-bold"
                            >
                                {stats.checkedIn.toLocaleString()}
                            </motion.span>
                            <span className="text-3xl text-gray-400 mb-2">
                                / {stats.totalAttendees.toLocaleString()}
                            </span>
                        </div>
                        <div className="mt-4">
                            <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(stats.checkedIn / stats.totalAttendees) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                            <p className="text-sm text-gray-400 mt-2">
                                {Math.round((stats.checkedIn / stats.totalAttendees) * 100)}% capacity
                            </p>
                        </div>
                    </motion.div>

                    {/* VIP Counter */}
                    <motion.div
                        className="bg-gradient-to-br from-amber-600/30 to-orange-600/30 backdrop-blur-xl rounded-3xl p-6 border border-amber-500/20"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <Star className="w-6 h-6 text-amber-400" />
                            <span className="text-gray-300">VIP Guests</span>
                        </div>
                        <p className="text-5xl font-bold text-amber-400">{stats.vipGuests}</p>
                        <p className="text-sm text-gray-400 mt-2">Premium Experience</p>
                    </motion.div>

                    {/* Cars Counter */}
                    <motion.div
                        className="bg-gradient-to-br from-blue-600/30 to-cyan-600/30 backdrop-blur-xl rounded-3xl p-6 border border-blue-500/20"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <Car className="w-6 h-6 text-blue-400" />
                            <span className="text-gray-300">Cars on Display</span>
                        </div>
                        <p className="text-5xl font-bold text-blue-400">{stats.carsOnDisplay}</p>
                        <p className="text-sm text-gray-400 mt-2">Exotic Collection</p>
                    </motion.div>
                </div>

                {/* Middle Section */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    {/* Schedule */}
                    <div className="col-span-1 bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
                        <div className="flex items-center gap-3 mb-6">
                            <Clock className="w-6 h-6 text-purple-400" />
                            <h3 className="text-xl font-semibold">Today&apos;s Schedule</h3>
                        </div>
                        <div className="space-y-3">
                            {scheduleItems.map((item, i) => (
                                <motion.div
                                    key={i}
                                    className={`flex items-center gap-4 p-3 rounded-xl transition-all ${item.active
                                            ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-500/50'
                                            : 'hover:bg-white/5'
                                        }`}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <item.icon className={`w-5 h-5 ${item.active ? 'text-purple-400' : 'text-gray-500'}`} />
                                    <span className={`font-mono text-sm ${item.active ? 'text-purple-300' : 'text-gray-500'}`}>
                                        {item.time}
                                    </span>
                                    <span className={item.active ? 'text-white font-medium' : 'text-gray-400'}>
                                        {item.event}
                                    </span>
                                    {item.active && (
                                        <span className="ml-auto text-xs bg-purple-500 px-2 py-1 rounded-full">NOW</span>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Social Wall */}
                    <div className="col-span-2 bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
                        <div className="flex items-center gap-3 mb-6">
                            <Camera className="w-6 h-6 text-pink-400" />
                            <h3 className="text-xl font-semibold">Social Wall</h3>
                            <span className="text-sm text-gray-400 ml-auto">#IAF2026</span>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activePostIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl font-bold">
                                        {socialPosts[activePostIndex].username[1].toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-semibold text-purple-300">
                                                {socialPosts[activePostIndex].username}
                                            </span>
                                            <span className="text-gray-500 text-sm">
                                                {socialPosts[activePostIndex].time}
                                            </span>
                                        </div>
                                        <p className="text-xl leading-relaxed">
                                            {socialPosts[activePostIndex].content}
                                        </p>
                                        <div className="flex items-center gap-2 mt-4 text-pink-400">
                                            <span>❤️</span>
                                            <span>{socialPosts[activePostIndex].likes} likes</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Post indicators */}
                        <div className="flex justify-center gap-2 mt-4">
                            {socialPosts.map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition-all ${i === activePostIndex ? 'bg-pink-500 w-6' : 'bg-white/30'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Announcements Ticker */}
                <div className="bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-purple-600/30 backdrop-blur-xl rounded-2xl p-4 border border-white/10 mb-8 overflow-hidden">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg shrink-0">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                            <span className="font-semibold">LIVE UPDATES</span>
                        </div>
                        <div className="overflow-hidden flex-1">
                            <motion.div
                                className="flex gap-12 whitespace-nowrap"
                                animate={{ x: [0, -1000] }}
                                transition={{
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            >
                                {[...announcements, ...announcements].map((ann, i) => (
                                    <span key={i} className="inline-flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${ann.type === 'vip' ? 'bg-amber-400' :
                                                ann.type === 'alert' ? 'bg-red-400' :
                                                    ann.type === 'sponsor' ? 'bg-blue-400' : 'bg-green-400'
                                            }`} />
                                        {ann.message}
                                    </span>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Sponsors Carousel */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <p className="text-center text-gray-400 mb-4">Proudly Sponsored By</p>
                    <div className="flex justify-center items-center gap-12">
                        {sponsors.map((sponsor, i) => (
                            <motion.div
                                key={i}
                                className="text-xl font-bold text-gray-300 opacity-60 hover:opacity-100 transition-opacity"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 0.6, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                {sponsor}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
