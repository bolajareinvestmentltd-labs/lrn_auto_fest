"use client";

export default function SocialProof() {
    return (
        <section className="py-20 bg-gradient-to-r from-brand-orange/10 via-black to-brand-blue/10 border-y border-white/10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {/* Attendees */}
                    <div className="flex flex-col items-center">
                        <div className="font-heading text-6xl md:text-8xl text-brand-orange mb-1 leading-none">
                            5,000+
                        </div>
                        <p className="font-sans font-semibold text-white/80 uppercase tracking-[0.2em] text-xs sm:text-sm">
                            Attendees Expected
                        </p>
                        <p className="font-sans font-light text-white/40 text-xs mt-2 tracking-wide">
                            From all walks of automotive culture
                        </p>
                    </div>

                    {/* Events */}
                    <div className="flex flex-col items-center">
                        <div className="font-heading text-6xl md:text-8xl text-brand-blue mb-1 leading-none">
                            6
                        </div>
                        <p className="font-sans font-semibold text-white/80 uppercase tracking-[0.2em] text-xs sm:text-sm">
                            Experience Zones
                        </p>
                        <p className="font-sans font-light text-white/40 text-xs mt-2 tracking-wide">
                            From drift to live performances
                        </p>
                    </div>

                    {/* Awards */}
                    <div className="flex flex-col items-center">
                        <div className="font-heading text-6xl md:text-8xl text-brand-orange mb-1 leading-none">
                            ₦M
                        </div>
                        <p className="font-sans font-semibold text-white/80 uppercase tracking-[0.2em] text-xs sm:text-sm">
                            Prize Money
                        </p>
                        <p className="font-sans font-light text-white/40 text-xs mt-2 tracking-wide">
                            For winners and champions
                        </p>
                    </div>
                </div>

                {/* Testimonial */}
                <div className="mt-20 max-w-3xl mx-auto">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center backdrop-blur-sm">
                        <p className="font-sans font-light text-white/90 text-base sm:text-lg italic mb-6 leading-relaxed tracking-wide">
                            &ldquo;The Ilorin Automotive Festival 2026 is a celebration of everything automotive in Nigeria.
                            From drift legends to exotic supercars, this event brings the entire community together.&rdquo;
                        </p>
                        <div>
                            <p className="font-sans font-semibold text-brand-blue uppercase tracking-widest text-xs sm:text-sm">Festival Organizer</p>
                            <p className="font-sans font-light text-white/40 text-xs tracking-wider mt-1">Ilorin Automotive Community</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
