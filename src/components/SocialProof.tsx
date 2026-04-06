"use client";

export default function SocialProof() {
    return (
        <section className="py-24 bg-gradient-to-r from-brand-orange/10 via-black to-brand-blue/10 border-y border-white/10">
            <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center">
                
                {/* "Over" */}
                <p className="font-sans font-semibold text-white/50 text-sm md:text-base uppercase tracking-[0.5em] mb-4">
                    Over
                </p>
                
                {/* "17,000" */}
                <div className="font-heading text-8xl md:text-[10rem] text-brand-orange mb-2 leading-none drop-shadow-[0_0_30px_rgba(255,90,0,0.3)]">
                    17,000
                </div>
                
                {/* "SPECTATORS" */}
                <h3 className="font-heading text-4xl md:text-6xl text-white uppercase tracking-widest mb-6">
                    SPECTATORS
                </h3>
                
                {/* "Since 2024." */}
                <p className="font-sans font-light text-white/40 text-sm md:text-lg tracking-[0.3em] uppercase">
                    Since 2024.
                </p>

            </div>
        </section>
    );
}
