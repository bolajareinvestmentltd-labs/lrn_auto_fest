"use client";
import Image from "next/image";

const sponsors = [
    {
        name: "Flow FM 97.3",
        logo: "/sponsors/flow-fm.svg",
        category: "media"
    },
    {
        name: "Kwara State Government",
        logo: "/sponsors/kwara-gov.svg",
        category: "government"
    }
];

export default function Sponsors() {
    return (
        <section className="py-16 bg-black/50 border-y border-white/10">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h3 className="text-white/80 text-sm font-sans uppercase tracking-widest mb-2">
                        Powered By
                    </h3>
                    <h2 className="font-heading text-3xl md:text-4xl font-bold text-white uppercase italic">
                        Official <span className="text-brand-blue">Partners</span>
                    </h2>
                </div>

                {/* Sponsors Grid - 2 Main Partners */}
                <div className="grid grid-cols-2 gap-8 md:gap-12 max-w-2xl mx-auto">
                    {sponsors.map((sponsor, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-center h-24 md:h-28 bg-white/5 border border-white/10 rounded-lg hover:border-brand-blue/30 hover:bg-white/10 transition-all duration-300 p-4"
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src={sponsor.logo}
                                    alt={sponsor.name}
                                    fill
                                    className="object-contain"
                                    onError={(e) => {
                                        // Fallback: show text if image fails to load
                                        e.currentTarget.style.display = "none";
                                    }}
                                />
                                {/* Fallback text if image doesn't exist */}
                                <div className="absolute inset-0 flex items-center justify-center text-white/40 text-xs text-center px-2">
                                    {sponsor.name}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to Action for More Sponsors */}
                <div className="text-center mt-12">
                    <p className="text-white/60 text-sm mb-4">
                        Interested in sponsoring the festival?
                    </p>
                    <a
                        href="mailto:info@iaf2026.com"
                        className="inline-block px-6 py-2 border border-brand-blue text-brand-blue hover:bg-brand-blue/10 rounded-full transition-all text-sm font-semibold uppercase"
                    >
                        Become a Sponsor
                    </a>
                </div>
            </div>
        </section>
    );
}
