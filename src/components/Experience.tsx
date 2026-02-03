"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Zap, Car, Mic, Crown, Utensils } from "lucide-react";

const features = [
  { title: "Drift King", icon: Trophy, desc: "Battle for the Ilorin title." },
  { title: "Bike Stunts", icon: Zap, desc: "High-adrenaline stunts." },
  { title: "Exotic Cars", icon: Car, desc: "Supercars up close." },
  { title: "Music", icon: Mic, desc: "Top Afrobeats artists." },
  { title: "VIP Lounge", icon: Crown, desc: "Exclusive premium access." },
  { title: "Food Court", icon: Utensils, desc: "Gourmet vendors." }
];

export default function Experience() {
  return (
    <section className="py-24 bg-[#050505] relative z-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white uppercase italic">
            Experience <span className="text-brand-blue">Highlights</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((item, i) => (
            <Card key={i} className="bg-white/5 border-white/10 hover:border-brand-blue/50 transition-all hover:-translate-y-2">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="p-4 rounded-full bg-white/5 mb-6 text-brand-orange">
                  <item.icon className="w-10 h-10" />
                </div>
                <h3 className="font-heading text-xl text-white mb-2 uppercase">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
