"use client";
import { motion } from "framer-motion";
import { Zap, Flame, Trophy } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    id: "drift",
    title: "Drift Championship",
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    description: "Battle for the championship title",
  },
  {
    id: "drag",
    title: "Drag Race",
    icon: Flame,
    color: "from-red-500 to-orange-500",
    description: "High-speed racing competition",
  },
  {
    id: "best-build",
    title: "Best Build",
    icon: Trophy,
    color: "from-purple-500 to-pink-500",
    description: "Showcase your custom build",
  },
];

export default function EventCategories() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#0a0a0a] to-[#050505] relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-fluid-section text-white uppercase tracking-widest">
            Event <span className="text-brand-orange">Categories</span>
          </h2>
          <p className="font-sans font-light text-gray-400 mt-4 max-w-2xl mx-auto text-sm sm:text-base tracking-wide">
            Choose your competition level and prove yourself at Ilorin Auto Festival
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group"
              >
                <Link href="/register">
                  <div className="relative p-8 rounded-2xl border border-white/10 bg-white/5 hover:border-brand-orange/50 hover:bg-white/10 transition-all duration-300 cursor-pointer hover:-translate-y-2 h-full flex flex-col items-center text-center">
                    {/* Icon Container */}
                    <div
                      className={`w-20 h-20 rounded-full bg-gradient-to-r ${category.color} p-0.5 mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center">
                        <Icon className="w-10 h-10 text-white group-hover:text-brand-orange transition-colors" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-heading text-2xl text-white uppercase tracking-widest mb-2 group-hover:text-brand-orange transition-colors">
                      {category.title}
                    </h3>

                    {/* Description */}
                    <p className="font-sans font-light text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                      {category.description}
                    </p>

                    {/* Hover indicator */}
                    <div className="mt-4 text-brand-orange text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Learn More →
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
