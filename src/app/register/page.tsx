"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Music, Car, Zap, Star, CheckCircle2, XCircle, ExternalLink } from "lucide-react";

interface CategorySlots {
    performer: { max: number; registered: number };
    dragRace: { max: number; registered: number };
    driftChampionship: { max: number; registered: number };
    guest: { max: number; registered: number };
}

interface Category {
    id: string;
    name: string;
    description: string;
    maxSlots: number;
    icon: React.ReactNode;
    color: string;
    googleFormUrl: string;
    email: string;
}

export default function RegisterPage() {
    const [fetchingSlots, setFetchingSlots] = useState(true);
    const [slots, setSlots] = useState<CategorySlots>({
        performer: { max: 15, registered: 0 },
        dragRace: { max: 10, registered: 0 },
        driftChampionship: { max: 5, registered: 0 },
        guest: { max: 6, registered: 0 },
    });

    // Google Form URLs for each category - Replace these with your actual Google Form URLs
    const categories: Category[] = [
        {
            id: "performer",
            name: "Performer",
            description: "Music artists, DJs, and live performers",
            maxSlots: 15,
            icon: <Music className="w-8 h-8" />,
            color: "from-purple-500 to-pink-500",
            googleFormUrl: "https://forms.gle/performerICS30", // Replace with actual form URL
            email: "performers@ilorincarshow.com",
        },
        {
            id: "dragRace",
            name: "Drag Race",
            description: "Compete in our high-speed drag racing event",
            maxSlots: 10,
            icon: <Car className="w-8 h-8" />,
            color: "from-red-500 to-orange-500",
            googleFormUrl: "https://forms.gle/dragraceICS30", // Replace with actual form URL
            email: "dragrace@ilorincarshow.com",
        },
        {
            id: "driftChampionship",
            name: "Drift Championship",
            description: "Show off your drifting skills in the championship",
            maxSlots: 5,
            icon: <Zap className="w-8 h-8" />,
            color: "from-blue-500 to-cyan-500",
            googleFormUrl: "https://forms.gle/driftICS30", // Replace with actual form URL
            email: "drift@ilorincarshow.com",
        },
        {
            id: "guest",
            name: "Guest",
            description: "Special guest appearance at the event",
            maxSlots: 6,
            icon: <Star className="w-8 h-8" />,
            color: "from-yellow-500 to-amber-500",
            googleFormUrl: "https://forms.gle/guestICS30", // Replace with actual form URL
            email: "guests@ilorincarshow.com",
        },
    ];

    // Fetch current slot counts
    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const response = await fetch("/api/registration/slots");
                if (response.ok) {
                    const data = await response.json();
                    setSlots(data);
                }
            } catch (error) {
                console.error("Failed to fetch slots:", error);
            } finally {
                setFetchingSlots(false);
            }
        };
        fetchSlots();
    }, []);

    const getCategorySlots = (categoryId: string) => {
        return slots[categoryId as keyof CategorySlots];
    };

    const isCategoryFull = (categoryId: string) => {
        const categorySlots = getCategorySlots(categoryId);
        return categorySlots.registered >= categorySlots.max;
    };

    const getAvailableSlots = (categoryId: string) => {
        const categorySlots = getCategorySlots(categoryId);
        return categorySlots.max - categorySlots.registered;
    };

    const handleRegisterClick = (category: Category) => {
        // Open Google Form in new tab
        window.open(category.googleFormUrl, "_blank");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <Link href="/">
                        <Image
                            src="/iaf_logo.jpeg"
                            alt="Ilorin Car Show Logo"
                            width={100}
                            height={100}
                            className="mx-auto mb-4 object-contain"
                        />
                    </Link>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                        Event Registration
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Choose your category and register for Ilorin Car Show 3.0
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        Registration opens via Google Forms for each category
                    </p>
                </motion.div>

                {/* Category Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    <h2 className="text-xl font-semibold text-white mb-6 text-center">
                        Select Your Category to Register
                    </h2>

                    {fetchingSlots ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {categories.map((category, index) => {
                                const isFull = isCategoryFull(category.id);
                                const availableSlots = getAvailableSlots(category.id);

                                return (
                                    <motion.div
                                        key={category.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                    >
                                        <div
                                            className={`w-full p-6 rounded-xl border-2 transition-all duration-300 ${isFull
                                                    ? "bg-gray-800/50 border-gray-700 opacity-60"
                                                    : "bg-gray-800/50 border-gray-600 hover:border-gray-400 hover:bg-gray-800"
                                                }`}
                                        >
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                                <div className={`p-3 rounded-full bg-gradient-to-r ${category.color} text-white flex-shrink-0`}>
                                                    {category.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <h3 className="text-xl font-bold text-white">
                                                            {category.name}
                                                        </h3>
                                                        {isFull ? (
                                                            <span className="flex items-center gap-1 text-red-400 text-sm">
                                                                <XCircle className="w-4 h-4" /> Registration Closed
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1 text-green-400 text-sm">
                                                                <CheckCircle2 className="w-4 h-4" /> {availableSlots} slots left
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-400 mb-2">
                                                        {category.description}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Contact: <a href={`mailto:${category.email}`} className="text-brand-blue hover:underline">{category.email}</a>
                                                    </p>
                                                </div>
                                                <div className="w-full sm:w-auto">
                                                    <Button
                                                        onClick={() => handleRegisterClick(category)}
                                                        disabled={isFull}
                                                        className={`w-full sm:w-auto ${isFull
                                                                ? "bg-gray-600 cursor-not-allowed"
                                                                : `bg-gradient-to-r ${category.color} hover:opacity-90`
                                                            } text-white font-bold px-6 py-3 rounded-lg`}
                                                    >
                                                        {isFull ? (
                                                            "Closed"
                                                        ) : (
                                                            <>
                                                                Register Now
                                                                <ExternalLink className="w-4 h-4 ml-2" />
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>

                {/* Info Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 mb-8"
                >
                    <h3 className="text-lg font-semibold text-white mb-4">Registration Information</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>Each category has limited slots - register early to secure your spot</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>Registration is via Google Forms for secure data collection</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>You will receive a confirmation email after successful registration</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>For questions, contact the category-specific email provided above</span>
                        </li>
                    </ul>
                </motion.div>

                {/* Back to Home */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-8"
                >
                    <Link href="/">
                        <Button variant="ghost" className="text-gray-400 hover:text-white">
                            ← Back to Home
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
