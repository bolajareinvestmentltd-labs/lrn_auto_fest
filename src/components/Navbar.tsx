"use client";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [showComingSoonModal, setShowComingSoonModal] = useState<string | null>(null);
  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        {/* Logo - Left Side */}
        <Link href="/" className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity" aria-label="IAF 2026 Home">
          <Image
            src="/images/logo.png"
            alt="Ilorin Automotive Festival"
            width={60}
            height={60}
            priority
            className="h-16 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 flex-1 justify-center">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-6">
              <NavigationMenuItem>
                <Link href="/register" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors px-3 py-2 text-sm tracking-widest uppercase">Performer</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <button onClick={() => setShowComingSoonModal('tickets')} className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors px-3 py-2 text-sm tracking-widest uppercase">Tickets</button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/vip" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors px-3 py-2 text-sm tracking-widest uppercase">VIP</Link>
              </NavigationMenuItem>
              <NavigationMenuItem><Link href="/vendors" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors px-3 py-2 text-sm tracking-widest uppercase">Vendors</Link>
              <NavigationMenuItem>
                <button onClick={() => setShowComingSoonModal('merch')} className="font-sans font-medium text-white/80 hover:text-brand-orange transition-colors px-3 py-2 text-sm tracking-widest uppercase">Merch</button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <button onClick={() => setShowComingSoonModal('logistics')} className="font-sans font-medium text-white/80 hover:text-blue-400 transition-colors px-3 py-2 text-sm tracking-widest uppercase">Logistics</button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/gallery" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors px-3 py-2 text-sm tracking-widest uppercase">Gallery</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/map" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors px-3 py-2 text-sm tracking-widest uppercase">Map</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/live" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors px-3 py-2 text-sm tracking-widest uppercase flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Live
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/faq" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors px-3 py-2 text-sm tracking-widest uppercase">FAQ</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors px-3 py-2 text-sm tracking-widest uppercase">Contact</Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Buy Tickets Button - Right Side */}
        <div className="hidden md:block">
          <Button onClick={() => setShowComingSoonModal('tickets')} className="bg-brand-orange hover:bg-orange-600 text-white font-sans font-semibold text-xs uppercase tracking-widest px-5">Get Tickets</Button>
        </div>

        {/* Mobile Navigation - Logo Menu Drawer */}
        <div className="md:hidden ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="text-white text-2xl p-0 h-auto w-auto" aria-label="Open menu">☰</Button>
            </SheetTrigger>
            <SheetContent className="bg-[#050505] text-white border-l border-white/10">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link href="/register" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors text-sm tracking-widest uppercase">Performer</Link>
                <button onClick={() => setShowComingSoonModal('tickets')} className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors text-sm tracking-widest uppercase text-left">Tickets</button>
                <Link href="/vip" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors text-sm tracking-widest uppercase">VIP Packages</Link>
                <Link href="/vendors" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors text-sm tracking-widest uppercase text-left">Vendors</Link>
                <button onClick={() => setShowComingSoonModal('merch')} className="font-sans font-medium text-white/80 hover:text-brand-orange transition-colors text-sm tracking-widest uppercase text-left">Merchandise</button>
                <button onClick={() => setShowComingSoonModal('logistics')} className="font-sans font-medium text-white/80 hover:text-blue-400 transition-colors text-sm tracking-widest uppercase text-left">🚌 Logistics</button>
                <Link href="/gallery" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors text-sm tracking-widest uppercase">Gallery</Link>
                <Link href="/map" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors text-sm tracking-widest uppercase">Event Map</Link>
                <Link href="/live" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors text-sm tracking-widest uppercase flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Live Dashboard
                </Link>
                <Link href="/faq" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors text-sm tracking-widest uppercase">FAQ</Link>
                <Link href="/contact" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors text-sm tracking-widest uppercase">Contact</Link>
                <hr className="border-white/20 my-2" />
                <Link href="/gate" className="font-sans font-medium text-amber-400 hover:text-amber-300 transition-colors text-sm tracking-widest uppercase flex items-center gap-2">
                  🎫 Gate Check-In (Staff)
                </Link>
                <Link href="/admin" className="font-sans font-medium text-amber-400 hover:text-amber-300 transition-colors text-sm tracking-widest uppercase flex items-center gap-2">
                  ⚙️ Admin Dashboard
                </Link>
                <Button onClick={() => setShowComingSoonModal('tickets')} className="w-full bg-brand-orange hover:bg-orange-600 text-white font-sans font-semibold text-xs uppercase tracking-widest mt-6">
                  Get Tickets
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Coming Soon Modal */}
      <AnimatePresence>
        {showComingSoonModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowComingSoonModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-2 border-brand-orange/50 rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center">
                <div className="text-5xl mb-4">⏰</div>
                <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest">Coming Soon!</h3>
                <p className="text-gray-300 mb-6">
                  {showComingSoonModal === 'tickets' && "🎟️ Ticket sales will be available soon!"}
                  {showComingSoonModal === 'merch' && "🛍️ Our merchandise store is coming soon!"}
                  {showComingSoonModal === 'logistics' && "🚌 Logistics information will be available soon!"}
                  {showComingSoonModal === 'vendors' && "🏪 Vendor registration and booth options will be available soon!"}
                </p>
                <p className="text-brand-orange text-sm font-semibold mb-6">Stay tuned for updates!</p>
                <Button
                  onClick={() => setShowComingSoonModal(null)}
                  className="bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-6 py-2 rounded-full"
                >
                  Got It
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
