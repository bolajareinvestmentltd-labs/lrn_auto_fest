"use client";

export default function SocialProof() {
    return (
        <section className="py-20 bg-gradient-to-r from-brand-orange/10 via-black to-brand-blue/10 border-y border-white/10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {/* Attendees */}
                    <div className="flex flex-col items-center">
                        <div className="text-5xl md:text-6xl font-heading font-bold text-brand-orange mb-2">
                            5,000+
                        </div>
                        <p className="text-white/80 font-semibold uppercase tracking-wide">
                            Attendees Expected
                        </p>
                        <p className="text-white/50 text-sm mt-2">
                            From all walks of automotive culture
                        </p>
                    </div>

                    {/* Events */}
                    <div className="flex flex-col items-center">
                        <div className="text-5xl md:text-6xl font-heading font-bold text-brand-blue mb-2">
                            6
                        </div>
                        <p className="text-white/80 font-semibold uppercase tracking-wide">
                            Experience Zones
                        </p>
                        <p className="text-white/50 text-sm mt-2">
                            From drift to live performances
                        </p>
                    </div>

                    {/* Awards */}
                    <div className="flex flex-col items-center">
                        <div className="text-5xl md:text-6xl font-heading font-bold text-brand-orange mb-2">
                            ₦M
                        </div>
                        <p className="text-white/80 font-semibold uppercase tracking-wide">
                            Prize Money
                        </p>
                        <p className="text-white/50 text-sm mt-2">
                            For winners and champions
                        </p>
                    </div>
                </div>

                {/* Testimonial */}
                <div className="mt-20 max-w-3xl mx-auto">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center backdrop-blur-sm">
                        <p className="text-white text-lg italic mb-6">
                            "The Ilorin Automotive Festival 2026 is a celebration of everything automotive in Nigeria.
                            From drift legends to exotic supercars, this event brings the entire community together."
                        </p>
                        <div>
                            <p className="text-brand-blue font-bold uppercase">Festival Organizer</p>
                            <p className="text-white/60 text-sm">Ilorin Automotive Community</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
