"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function VendorsPage() {
  const [showComingSoonModal, setShowComingSoonModal] = useState(true);

  return (
    <div className="min-h-screen bg-[#050505] py-20">
      <div className="max-w-5xl mx-auto px-4 text-center">
        {/* Header */}
        <div className="mb-12">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Ilorin Car Show Logo"
              width={120}
              height={120}
              className="mx-auto mb-4 h-24 w-24 object-contain"
            />
          </Link>
          <h1 className="text-4xl font-bold text-white">Vendors</h1>
        </div>
      </div>

      {/* Coming Soon Modal */}
      <AnimatePresence>
        {showComingSoonModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowComingSoonModal(false)}
              className="fixed inset-0 bg-black/80 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setShowComingSoonModal(false)}
            >
              <div
                className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-2 border-brand-orange/50 rounded-2xl p-8 max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="text-5xl">⏰</div>
                  <button
                    onClick={() => setShowComingSoonModal(false)}
                    className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest">Coming Soon!</h3>
                  <p className="text-gray-300 mb-6">🏪 Vendor registration and booth options will be available soon!</p>
                  <p className="text-brand-orange text-sm font-semibold mb-6">Stay tuned for updates!</p>
                  <Button
                    onClick={() => setShowComingSoonModal(false)}
                    className="bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-6 py-2 rounded-full w-full"
                  >
                    Got It
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}