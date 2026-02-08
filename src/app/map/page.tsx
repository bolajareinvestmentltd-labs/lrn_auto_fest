"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
    Car,
    Utensils,
    Star,
    ParkingCircle,
    Music,
    Camera,
    Ticket,
    ShieldCheck,
    Coffee,
    Trophy,
    MapPin,
    X,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    Navigation,
    Bath,
    Accessibility,
    Phone,
    Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Venue {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
    x: number;
    y: number;
    color: string;
    category: 'attraction' | 'food' | 'facility' | 'parking' | 'vip';
    details?: string[];
}

const venues: Venue[] = [
    // Main Attractions
    {
        id: 'main-stage',
        name: 'Main Stage',
        description: 'Live performances & car reveals',
        icon: Music,
        x: 50, y: 30,
        color: 'from-purple-500 to-pink-500',
        category: 'attraction',
        details: ['Opening Ceremony - 11:00 AM', 'Supercar Reveal - 2:00 PM', 'Awards - 6:00 PM', 'Live Concert - 8:00 PM']
    },
    {
        id: 'classic-cars',
        name: 'Classic Cars Zone',
        description: 'Vintage & classic automobile display',
        icon: Car,
        x: 25, y: 45,
        color: 'from-amber-500 to-orange-500',
        category: 'attraction',
        details: ['50+ Classic Cars', 'Photo Opportunities', 'Meet the Owners', 'History Tours Every Hour']
    },
    {
        id: 'supercars',
        name: 'Supercar Exhibition',
        description: 'Lamborghini, Ferrari, McLaren & more',
        icon: Trophy,
        x: 75, y: 45,
        color: 'from-red-500 to-pink-500',
        category: 'attraction',
        details: ['Ferrari F8', 'Lamborghini Huracán', 'McLaren 720S', 'Porsche 911 GT3', 'Photo Sessions Available']
    },
    {
        id: 'drift-arena',
        name: 'Drift Arena',
        description: 'Live drifting demonstrations',
        icon: Car,
        x: 50, y: 70,
        color: 'from-blue-500 to-cyan-500',
        category: 'attraction',
        details: ['Shows at 12PM, 2PM, 4PM', 'Professional Drivers', 'Smoke & Sound Effects', 'VIP Front Row Access']
    },
    {
        id: 'photo-booth',
        name: 'Photo Experience',
        description: '360° photo booth with cars',
        icon: Camera,
        x: 35, y: 25,
        color: 'from-pink-500 to-rose-500',
        category: 'attraction',
        details: ['360° Camera Booth', 'Green Screen Studio', 'Instant Prints', 'Social Media Sharing']
    },

    // Food & Drinks
    {
        id: 'food-court',
        name: 'Food Court',
        description: 'Local & international cuisine',
        icon: Utensils,
        x: 15, y: 60,
        color: 'from-green-500 to-emerald-500',
        category: 'food',
        details: ['Suya & Grills', 'Pizza & Burgers', 'Jollof Rice', 'Ice Cream', 'Vegetarian Options']
    },
    {
        id: 'coffee-lounge',
        name: 'Coffee Lounge',
        description: 'Premium coffee & refreshments',
        icon: Coffee,
        x: 85, y: 25,
        color: 'from-amber-600 to-yellow-500',
        category: 'food',
        details: ['Espresso Bar', 'Fresh Smoothies', 'Pastries', 'Shaded Seating']
    },

    // VIP Areas
    {
        id: 'vip-lounge',
        name: 'VIP Lounge',
        description: 'Exclusive area for VIP ticket holders',
        icon: Star,
        x: 65, y: 20,
        color: 'from-yellow-400 to-amber-500',
        category: 'vip',
        details: ['Air Conditioned', 'Premium Open Bar', 'Gourmet Catering', 'Private Car Viewing', 'Meet & Greet with Drivers']
    },
    {
        id: 'vip-parking',
        name: 'VIP Parking',
        description: 'Reserved parking for VIP guests',
        icon: ParkingCircle,
        x: 80, y: 85,
        color: 'from-yellow-500 to-orange-500',
        category: 'vip',
        details: ['Shaded Parking', 'Security Monitored', 'Close to VIP Entrance', 'Valet Service']
    },

    // Facilities
    {
        id: 'main-entrance',
        name: 'Main Entrance',
        description: 'Ticket scanning & entry',
        icon: Ticket,
        x: 50, y: 95,
        color: 'from-indigo-500 to-purple-500',
        category: 'facility',
        details: ['QR Code Scanning', 'Wristband Distribution', 'Event Map Available', 'Information Desk']
    },
    {
        id: 'parking-a',
        name: 'Parking Zone A',
        description: 'General parking area',
        icon: ParkingCircle,
        x: 20, y: 85,
        color: 'from-slate-500 to-gray-500',
        category: 'parking',
        details: ['200 Spaces', 'Security Patrols', '5 Min Walk to Entrance']
    },
    {
        id: 'parking-b',
        name: 'Parking Zone B',
        description: 'Overflow parking',
        icon: ParkingCircle,
        x: 10, y: 70,
        color: 'from-slate-500 to-gray-500',
        category: 'parking',
        details: ['150 Spaces', 'Shuttle Available', '10 Min Walk']
    },
    {
        id: 'first-aid',
        name: 'First Aid Station',
        description: 'Medical assistance',
        icon: Heart,
        x: 40, y: 55,
        color: 'from-red-500 to-red-600',
        category: 'facility',
        details: ['Certified Medics', 'Free Water', 'Rest Area', 'Emergency Response']
    },
    {
        id: 'restrooms-1',
        name: 'Restrooms',
        description: 'Public facilities',
        icon: Bath,
        x: 30, y: 75,
        color: 'from-blue-400 to-blue-500',
        category: 'facility',
        details: ['Clean Facilities', 'Accessible Options', 'Baby Changing']
    },
    {
        id: 'restrooms-2',
        name: 'Restrooms',
        description: 'Public facilities',
        icon: Bath,
        x: 70, y: 60,
        color: 'from-blue-400 to-blue-500',
        category: 'facility',
        details: ['Clean Facilities', 'Accessible Options']
    },
    {
        id: 'security',
        name: 'Security Post',
        description: 'Lost & found, assistance',
        icon: ShieldCheck,
        x: 55, y: 50,
        color: 'from-slate-600 to-slate-700',
        category: 'facility',
        details: ['24/7 Security', 'Lost & Found', 'Emergency Contact']
    },
    {
        id: 'info-booth',
        name: 'Information',
        description: 'Help desk & maps',
        icon: Phone,
        x: 45, y: 85,
        color: 'from-teal-500 to-cyan-500',
        category: 'facility',
        details: ['Event Information', 'Free Maps', 'Phone Charging', 'Wheelchair Rental']
    },
    {
        id: 'accessibility',
        name: 'Accessible Entry',
        description: 'Wheelchair accessible',
        icon: Accessibility,
        x: 60, y: 90,
        color: 'from-blue-500 to-indigo-500',
        category: 'facility',
        details: ['Ramp Access', 'Wheelchair Assistance', 'Priority Entry']
    },
];

const categoryFilters = [
    { id: 'all', label: 'All', icon: MapPin, color: 'bg-white/20' },
    { id: 'attraction', label: 'Attractions', icon: Star, color: 'bg-purple-500' },
    { id: 'food', label: 'Food & Drinks', icon: Utensils, color: 'bg-green-500' },
    { id: 'vip', label: 'VIP Areas', icon: Trophy, color: 'bg-amber-500' },
    { id: 'facility', label: 'Facilities', icon: ShieldCheck, color: 'bg-blue-500' },
    { id: 'parking', label: 'Parking', icon: ParkingCircle, color: 'bg-slate-500' },
];

export default function InteractiveMap() {
    const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const mapRef = useRef<HTMLDivElement>(null);

    const filteredVenues = venues.filter(
        v => activeFilter === 'all' || v.category === activeFilter
    );

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
    const handleReset = () => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Event Map
                            </h1>
                            <p className="text-gray-400 text-sm">Ilorin Auto Festival 2026</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleZoomOut}
                                className="bg-white/10 border-white/20 hover:bg-white/20"
                            >
                                <ZoomOut className="w-4 h-4" />
                            </Button>
                            <span className="px-3 py-1 bg-white/10 rounded-lg text-sm font-mono">
                                {Math.round(zoom * 100)}%
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleZoomIn}
                                className="bg-white/10 border-white/20 hover:bg-white/20"
                            >
                                <ZoomIn className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleReset}
                                className="bg-white/10 border-white/20 hover:bg-white/20"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Category Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {categoryFilters.map(filter => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeFilter === filter.id
                                    ? `${filter.color} text-white shadow-lg`
                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                    }`}
                            >
                                <filter.icon className="w-4 h-4" />
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Map Container */}
            <main className="relative">
                <div
                    ref={mapRef}
                    className="relative w-full h-[calc(100vh-140px)] overflow-hidden cursor-grab active:cursor-grabbing"
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                    onMouseMove={(e) => {
                        if (isDragging) {
                            setPosition(prev => ({
                                x: prev.x + e.movementX,
                                y: prev.y + e.movementY
                            }));
                        }
                    }}
                >
                    {/* Map Background */}
                    <div
                        className="absolute inset-0 transition-transform duration-100"
                        style={{
                            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`
                        }}
                    >
                        {/* Ground/Grass texture */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-green-900/30 to-emerald-900/40" />

                        {/* Paths/Roads */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {/* Main paths */}
                            <path d="M50 95 L50 30" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" strokeDasharray="2,1" fill="none" />
                            <path d="M20 45 L80 45" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" strokeDasharray="2,1" fill="none" />
                            <path d="M25 45 L25 85" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" strokeDasharray="2,1" fill="none" />
                            <path d="M75 45 L75 85" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" strokeDasharray="2,1" fill="none" />
                            <path d="M35 30 L65 30" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" strokeDasharray="2,1" fill="none" />
                            {/* Drift Arena circle */}
                            <circle cx="50" cy="70" r="12" stroke="rgba(59,130,246,0.4)" strokeWidth="0.5" fill="rgba(59,130,246,0.1)" />
                        </svg>

                        {/* Venue Markers */}
                        {filteredVenues.map((venue) => (
                            <motion.button
                                key={venue.id}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                                style={{ left: `${venue.x}%`, top: `${venue.y}%` }}
                                onClick={() => setSelectedVenue(venue)}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileHover={{ scale: 1.2, zIndex: 50 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                {/* Pulse effect for attractions */}
                                {venue.category === 'attraction' && (
                                    <span className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping" />
                                )}

                                {/* Marker */}
                                <div className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${venue.color} flex items-center justify-center shadow-lg border-2 border-white/30`}>
                                    <venue.icon className="w-6 h-6 text-white" />
                                </div>

                                {/* Label */}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="px-2 py-1 bg-black/80 rounded-lg text-xs font-medium">
                                        {venue.name}
                                    </span>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                        <h4 className="text-sm font-semibold mb-3 text-gray-300">Quick Legend</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                                <span>Attractions</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" />
                                <span>Food</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500" />
                                <span>VIP</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                                <span>Facilities</span>
                            </div>
                        </div>
                    </div>

                    {/* You Are Here indicator */}
                    <div className="absolute bottom-4 right-4">
                        <Button
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                            onClick={() => {
                                setPosition({ x: 0, y: 0 });
                                setZoom(1);
                            }}
                        >
                            <Navigation className="w-4 h-4 mr-2" />
                            Main Entrance
                        </Button>
                    </div>
                </div>
            </main>

            {/* Venue Detail Modal */}
            <AnimatePresence>
                {selectedVenue && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                            onClick={() => setSelectedVenue(null)}
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, y: 100, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.9 }}
                            className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-0 md:inset-0 md:flex md:items-center md:justify-center"
                        >
                            <div className="bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden max-w-lg w-full shadow-2xl">
                                {/* Header */}
                                <div className={`bg-gradient-to-r ${selectedVenue.color} p-6`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                                <selectedVenue.icon className="w-8 h-8 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-white">{selectedVenue.name}</h3>
                                                <p className="text-white/80">{selectedVenue.description}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedVenue(null)}
                                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {selectedVenue.details && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                                What&apos;s Here
                                            </h4>
                                            <ul className="space-y-2">
                                                {selectedVenue.details.map((detail, i) => (
                                                    <li key={i} className="flex items-center gap-3 text-gray-300">
                                                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                                                        {detail}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="mt-6 flex gap-3">
                                        <Button
                                            className={`flex-1 bg-gradient-to-r ${selectedVenue.color}`}
                                            onClick={() => setSelectedVenue(null)}
                                        >
                                            <Navigation className="w-4 h-4 mr-2" />
                                            Get Directions
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="bg-white/10 border-white/20"
                                            onClick={() => setSelectedVenue(null)}
                                        >
                                            Close
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
