"use client";

import { motion } from "framer-motion";
import { Clock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ComingSoonProps {
  title: string;
  description: string;
  releaseDate?: string;
}

export default function ComingSoon({ title, description, releaseDate = "Soon" }: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        {/* Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="flex justify-center mb-8"
        >
          <div className="p-6 rounded-full bg-brand-orange/10 border border-brand-orange/30">
            <Clock className="w-12 h-12 text-brand-orange" />
          </div>
        </motion.div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-heading text-white uppercase tracking-widest mb-4">
          Coming <span className="text-brand-orange">Soon</span>
        </h1>

        {/* Subtitle */}
        <h2 className="text-3xl font-bold text-white mb-4 tracking-wide">{title}</h2>

        {/* Description */}
        <p className="text-gray-400 text-lg mb-8 leading-relaxed">{description}</p>

        {/* Release Date */}
        <div className="bg-brand-orange/10 border border-brand-orange/30 rounded-lg px-6 py-4 mb-12 inline-block">
          <p className="text-brand-orange font-semibold">
            Expected Release: <span className="font-bold">{releaseDate}</span>
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="bg-brand-blue hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-full uppercase tracking-widest flex items-center gap-2">
              Back to Home
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <a href="mailto:contact@ilorinautomotivefestival.com.ng">
            <Button className="bg-brand-orange hover:bg-orange-600 text-black font-bold px-8 py-3 rounded-full uppercase tracking-widest flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Notify Me
            </Button>
          </a>
        </div>

        {/* Footer Note */}
        <p className="text-gray-500 text-sm mt-12">
          Follow us on social media for launch updates
        </p>
      </motion.div>
    </div>
  );
}
