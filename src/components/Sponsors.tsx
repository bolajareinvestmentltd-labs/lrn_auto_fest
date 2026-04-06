"use client";
import Image from "next/image";

const sponsors = [
    {
        name: "Kwara State Government",
        logo: "/sponsors/kwara-gov.jpeg",
        instagram: "https://instagram.com/YOUR_LINK_HERE"
    },
    {
        name: "Kwara State Sports Commission",
        logo: "/sponsors/kwara-sports.jpeg",
        instagram: "https://instagram.com/YOUR_LINK_HERE"
    },
    {
        name: "Flow fm",
        logo: "/sponsors/flow-fm.jpeg",
        instagram: "https://instagram.com/YOUR_LINK_HERE"
    },
    {
        name: "AutoFest International",
        logo: "/sponsors/autofest.PNG",
        instagram: "https://instagram.com/YOUR_LINK_HERE"
    },
    {
        name: "Kwara Bikers MC",
        logo: "/sponsors/kwara-bikers.PNG",
        instagram: "https://instagram.com/YOUR_LINK_HERE"
    },
    {
        name: "Cusecho",
        logo: "/sponsors/cusecho.PNG",
        instagram: "https://instagram.com/YOUR_LINK_HERE"
    },
    {
        name: "Bohemian Analytics",
        logo: "/sponsors/bohemian.PNG",
        instagram: "https://instagram.com/YOUR_LINK_HERE"
    },
    {
        name: "Mohammed Lexus",
        logo: "/sponsors/mohammed-lexus.PNG",
        instagram: "https://instagram.com/YOUR_LINK_HERE"
    },
    {
        name: "Khaz Customs",
        logo: "/sponsors/khaz-customs.jpeg",
        instagram: "https://instagram.com/YOUR_LINK_HERE"
    }
];

export default function Sponsors() {
    return (
        <section className="py-16 bg-black/50 border-y border-white/10">
            <div className="container mx-auto px-4">
                
                {/* Updated Heading */}
                <div className="text-center mb-12">
                    <h2 className="font-heading text-fluid-section text-white uppercase tracking-widest">
                        Supported <span className="text-brand-blue">By</span>
                    </h2>
                </div>

                {/* Sponsors Grid - 9 Partners with White Backgrounds */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
                    {sponsors.map((sponsor, i) => (
                        <a
                            key={i}
                            href={sponsor.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center h-28 md:h-32 bg-white rounded-xl hover:scale-105 hover:shadow-[0_0_20px_rgba(0,195,255,0.4)] transition-all duration-300 p-6 group"
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src={sponsor.logo}
                                    alt={sponsor.name}
                                    width={200}
                                    height={128}
                                    className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                                    onError={(e) => {
                                        // Fallback: show text if image fails to load
                                        e.currentTarget.style.display = "none";
                                    }}
                                />
                                {/* Fallback text if image doesn't exist (Updated to dark text for white bg) */}
                                <div className="absolute inset-0 flex items-center justify-center text-slate-800 text-xs font-bold text-center px-2 opacity-0 transition-opacity">
                                    {sponsor.name}
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Call to Action for More Sponsors */}
                <div className="text-center mt-16">
                    <p className="font-sans font-light text-white/50 text-sm tracking-widest uppercase mb-4">
                        Interested in sponsoring the festival?
                    </p>
                    <a
                        href="mailto:info@iaf2026.com"
                        className="inline-block px-8 py-3 border border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white rounded-full transition-all text-sm font-heading font-semibold uppercase tracking-widest"
                    >
                        Become a Sponsor
                    </a>
                </div>
            </div>
        </section>
    );
}
