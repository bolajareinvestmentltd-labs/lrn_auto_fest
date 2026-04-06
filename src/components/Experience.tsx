"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Flag, Zap, Flame, Sparkles } from "lucide-react";

const features = [
  { title: "Drift Championship", icon: Trophy },
  { title: "Drag Race", icon: Flag },
  { title: "Keke Race", icon: Zap },
  { title: "Stunts", icon: Flame, desc: "High-adrenaline action and performances." },
  { title: "Exhibition & lots more", icon: Sparkles, desc: "Showcases, displays, and endless surprises." }
];

export default function Experience() {
  return (
    <section className="py-24 bg-[#050505] relative z-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-fluid-section text-white uppercase tracking-widest">
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
                <h3 className="font-heading text-2xl text-white mb-2 uppercase tracking-widest">{item.title}</h3>
                {item.desc && <p className="font-sans font-light text-gray-400 text-sm leading-relaxed">{item.desc}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
