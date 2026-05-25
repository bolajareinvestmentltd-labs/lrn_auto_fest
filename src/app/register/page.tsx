"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Music, Car, Zap, CheckCircle2, XCircle, ExternalLink, Instagram, Twitter, X } from "lucide-react";
import { getChampionsByCategory, type Champion } from "@/data/champions";

interface CategorySlots {
    driftChampionship: { max: number; registered: number };
    dragRace: { max: number; registered: number };
    bestBuild: { max: number; registered: number };
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
    // 🔴 GLOBAL TOGGLE: Set to true to open registrations, false to close them.
    const GLOBAL_REGISTRATION_OPEN = false;

    const [fetchingSlots, setFetchingSlots] = useState(true);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [showClosedModal, setShowClosedModal] = useState(false); // NEW STATE FOR POP-UP
    
    const [slots, setSlots] = useState<CategorySlots>({
        driftChampionship: { max: 10, registered: 0 },
        dragRace: { max: 10, registered: 0 },
        bestBuild: { max: 10, registered: 0 },
    });

    const GOOGLE_FORM_URL = "https://forms.gle/v8S8esJF5Pv2Q1cU8";

    const categories: Category[] = [
        {
            id: "driftChampionship",
            name: "Drift Championship",
            description: "STAND A CHANCE TO COMPETE AGAINST TOP DRIFTERS",
            maxSlots: 10,
            icon: <Zap className="w-8 h-8" />,
            color: "from-blue-500 to-cyan-500",
            googleFormUrl: GOOGLE_FORM_URL,
            email: "contact@ilorinautomotivefestival.com.ng",
        },
        {
            id: "dragRace",
            name: "Drag Race",
            description: "",
            maxSlots: 10,
            icon: <Car className="w-8 h-8" />,
            color: "from-red-500 to-orange-500",
            googleFormUrl: GOOGLE_FORM_URL,
            email: "info@ilorinautomotivefestival.com.ng",
        },
        {
            id: "bestBuild",
            name: "Best Build",
            description: "",
            maxSlots: 10,
            icon: <Car className="w-8 h-8" />,
            color: "from-purple-500 to-pink-500",
            googleFormUrl: GOOGLE_FORM_URL,
            email: "support@ilorinautomotivefestival.com.ng",
        },
    ];

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
        const categorySlots = slots[categoryId as keyof CategorySlots];
        return categorySlots || { max: 10, registered: 0 }; 
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
        // 🚨 IF GLOBALLY CLOSED, SHOW THE POP-UP AND STOP
        if (!GLOBAL_REGISTRATION_OPEN) {
            setShowClosedModal(true);
            return;
        }

        // If category is full, do nothing (or we could show a sold out modal here later)
        if (isCategoryFull(category.id)) return;

        if (category.id === "driftChampionship") {
            setSelectedCategoryId(category.id);
        } else {
            window.open(category.googleFormUrl, "_blank");
        }
    };

    const handleProceedToForm = (category: Category) => {
        setSelectedCategoryId(null);
        window.open(category.googleFormUrl, "_blank");
    };

    const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
    const selectedChampions = selectedCategory ? getChampionsByCategory(selectedCategory.id) : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-brand-blue/20 to-brand-orange/20 py-12 px-4 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-blue/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-brand-orange/25 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-brand-blue/20 rounded-full blur-3xl" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <Link href="/">
                        <Image
                            src="/images/logo.png"
                            alt="Ilorin Car Show Logo"
                            width={100}
                            height={100}
                            className="mx-auto mb-4 object-contain"
                        />
                    </Link>
                    {!GLOBAL_REGISTRATION_OPEN && (
                         <div className="mt-6 inline-block bg-red-500/20 border border-red-500/50 text-red-400 px-6 py-2 rounded-full font-bold tracking-widest text-sm">
                             REGISTRATIONS ARE CURRENTLY CLOSED
                         </div>
                    )}
                </motion.div>

                <div className="space-y-6">
                    {categories.map((category, index) => {
                        const isFull = isCategoryFull(category.id);
                        const availableSlots = getAvailableSlots(category.id);
                        const isDisabled = !GLOBAL_REGISTRATION_OPEN || isFull;

                        return (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                            >
                                <div
                                    onClick={() => handleRegisterClick(category)}
                                    className={`w-full p-6 rounded-xl border-2 transition-all duration-300 ${isDisabled
                                        ? "bg-white/5 border-white/20 opacity-80 cursor-pointer" // Changed to pointer so click registers
                                        : "bg-gradient-to-r from-white/10 to-white/5 border-white/30 hover:border-brand-orange hover:bg-gradient-to-r hover:from-brand-orange/20 hover:to-brand-orange/10 hover:shadow-[0_0_30px_rgba(255,69,0,0.3)] cursor-pointer"
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
                                                
                                                {!GLOBAL_REGISTRATION_OPEN ? (
                                                    <span className="flex items-center gap-1 text-red-500 font-bold text-sm tracking-widest">
                                                        <XCircle className="w-4 h-4" /> CLOSED
                                                    </span>
                                                ) : isFull ? (
                                                    <span className="flex items-center gap-1 text-red-500 font-bold text-sm tracking-widest">
                                                        <XCircle className="w-4 h-4" /> 10/10 COMPLETED
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-green-400 text-sm">
                                                        <CheckCircle2 className="w-4 h-4" /> {availableSlots} slots left
                                                    </span>
                                                )}
                                            </div>
                                            {category.description && (
                                                <p className="text-sm text-gray-400 mb-2">
                                                    {category.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="w-full sm:w-auto">
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    handleRegisterClick(category);
                                                }}
                                                // Removed disabled attribute so click triggers the modal
                                                className={`w-full sm:w-auto transform transition-all duration-300 ${isDisabled
                                                    ? "bg-gray-800 text-gray-400 border border-gray-600 hover:bg-gray-700"
                                                    : `hover:scale-105 bg-gradient-to-r ${category.color} hover:opacity-100 hover:shadow-[0_0_25px_rgba(255,69,0,0.4)] text-white`
                                                    } font-bold px-6 py-3 rounded-lg`}
                                            >
                                                {!GLOBAL_REGISTRATION_OPEN ? (
                                                    "CLOSED"
                                                ) : isFull ? (
                                                    "SOLD OUT"
                                                ) : (
                                                    <>
                                                        REGISTER
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

            {/* 🔴 NEW: REGISTRATION CLOSED POP-UP MODAL */}
            <AnimatePresence>
                {showClosedModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowClosedModal(false)}
                            className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 max-w-sm w-full p-8 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-orange to-red-500" />
                                
                                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                                    <XCircle className="w-8 h-8 text-red-500" />
                                </div>
                                
                                <h2 className="text-2xl font-bold text-white mb-2">Registration Closed</h2>
                                <p className="text-gray-400 mb-8 text-sm">
                                    We are no longer accepting new registrations for this event. Stay tuned for future updates!
                                </p>
                                
                                <Button 
                                    onClick={() => setShowClosedModal(false)}
                                    className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold"
                                >
                                    Close
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Champions Modal (Still functional for when registration is open) */}
            <AnimatePresence>
                {selectedCategoryId && selectedCategory && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCategoryId(null)}
                            className="fixed inset-0 bg-black/80 z-40"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
                        >
                            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 max-w-4xl w-full my-auto">
                                <div className={`bg-gradient-to-r ${selectedCategory.color} p-6 rounded-t-2xl`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h2 className="text-3xl font-bold text-white mb-2">{selectedCategory.name}</h2>
                                            <p className="text-white/90">{selectedCategory.description}</p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedCategoryId(null)}
                                            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                                            aria-label="Close modal"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                        {selectedChampions.map((champion) => (
                                            <motion.div
                                                key={champion.id}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="flex flex-col items-center"
                                            >
                                                <div className={`w-full h-48 bg-gradient-to-br ${selectedCategory.color} rounded-lg overflow-hidden mb-4 flex items-center justify-center border-2 border-white/20`}>
                                                    {champion.image ? (
                                                        <Image
                                                            src={champion.image}
                                                            alt={champion.name}
                                                            width={300}
                                                            height={200}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-white text-3xl font-bold">
                                                            {champion.name.split(' ')[0].charAt(0)}{champion.name.split(' ')[1]?.charAt(0) || ''}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="w-full text-center">
                                                    <h4 className="font-bold text-white text-lg mb-1">
                                                        {champion.name}
                                                    </h4>
                                                    <p className={`text-sm bg-gradient-to-r ${selectedCategory.color} bg-clip-text text-transparent font-semibold mb-3`}>
                                                        {champion.title}
                                                    </p>
                                                    <p className="text-sm text-gray-300 mb-4">
                                                        {champion.bio}
                                                    </p>

                                                    <div className="flex justify-center gap-3">
                                                        {champion.instagram && (
                                                            <a
                                                                href={`https://instagram.com/${champion.instagram.replace('@', '')}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-gray-400 hover:text-pink-500 transition-colors bg-gray-800 p-2 rounded-lg hover:bg-gray-700"
                                                                title="Instagram"
                                                            >
                                                                <Instagram className="w-5 h-5" />
                                                            </a>
                                                        )}
                                                        {champion.twitter && (
                                                            <a
                                                                href={`https://twitter.com/${champion.twitter.replace('@', '')}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-gray-400 hover:text-blue-400 transition-colors bg-gray-800 p-2 rounded-lg hover:bg-gray-700"
                                                                title="Twitter"
                                                            >
                                                                <Twitter className="w-5 h-5" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="flex gap-4 justify-center pt-6 border-t border-gray-700">
                                        <Button
                                            onClick={() => setSelectedCategoryId(null)}
                                            variant="ghost"
                                            className="text-gray-400 hover:text-white"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={() => handleProceedToForm(selectedCategory)}
                                            className={`bg-gradient-to-r ${selectedCategory.color} text-white font-bold px-8`}
                                        >
                                            Register
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
                }
