"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { 
  NavigationMenu, 
  NavigationMenuList, 
  NavigationMenuItem 
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [showComingSoonModal, setShowComingSoonModal] = useState<string | null>(null);

  const STORE_URL = "https://cusecho.store/";

  return (
    <>
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="/images/logo.png"
              alt="IAF 2026"
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
                  <a href={STORE_URL} target="_blank" rel="noopener noreferrer" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors px-3 py-2 text-sm tracking-widest uppercase">Tickets/Merch</a>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/vip" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors px-3 py-2 text-sm tracking-widest uppercase">VIP</Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/vendors" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors px-3 py-2 text-sm tracking-widest uppercase">Vendors</Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <button onClick={() => setShowComingSoonModal('logistics')} className="font-sans font-medium text-white/80 hover:text-blue-400 transition-colors px-3 py-2 text-sm tracking-widest uppercase">Logistics</button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/gallery" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors px-3 py-2 text-sm tracking-widest uppercase">Gallery</Link>
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
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Action Button - Right Side */}
          <div className="hidden md:block">
            <Button asChild className="bg-brand-orange hover:bg-orange-600 text-white font-sans font-semibold text-xs uppercase tracking-widest px-5">
              <a href={STORE_URL} target="_blank" rel="noopener noreferrer">Get Tickets/Merch</a>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden ml-auto">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="text-white text-2xl p-0">☰</Button>
              </SheetTrigger>
              <SheetContent className="bg-[#050505] text-white border-l border-white/10">
                <nav className="flex flex-col space-y-4 mt-8">
                  <Link href="/register" className="text-sm tracking-widest uppercase">Performer</Link>
                  <a href={STORE_URL} target="_blank" rel="noopener noreferrer" className="text-sm tracking-widest uppercase">🎟️ Tickets/Merch</a>
                  <Link href="/vip" className="text-sm tracking-widest uppercase">VIP Packages</Link>
                  <Link href="/vendors" className="text-sm tracking-widest uppercase">Vendors</Link>
                  <button onClick={() => setShowComingSoonModal('logistics')} className="text-sm tracking-widest uppercase text-left">🚌 Logistics</button>
                  <Link href="/gallery" className="text-sm tracking-widest uppercase">Gallery</Link>
                  <Link href="/live" className="text-sm tracking-widest uppercase flex items-center gap-2">Live Dashboard</Link>
                  <hr className="border-white/20 my-2" />
                  <Button asChild className="w-full bg-brand-orange text-white text-xs uppercase tracking-widest">
                    <a href={STORE_URL} target="_blank" rel="noopener noreferrer">Get Tickets/Merch</a>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Coming Soon Modal (Now only for Logistics) */}
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
              className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-2 border-brand-orange/50 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
            >
              <div className="text-5xl mb-4">⏰</div>
              <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest">Coming Soon!</h3>
              <p className="text-gray-300 mb-6">🚌 Logistics information and shuttle routes will be available soon!</p>
              <Button onClick={() => setShowComingSoonModal(null)} className="bg-brand-orange text-white rounded-full">Got It</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
