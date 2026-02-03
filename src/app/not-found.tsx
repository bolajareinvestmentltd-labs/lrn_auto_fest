import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* 404 Number */}
                <div className="relative mb-6">
                    <h1 className="text-[150px] font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-orange opacity-20 leading-none">
                        404
                    </h1>
                </div>

                {/* Message */}
                <h2 className="text-2xl font-bold text-white mb-3">
                    Page Not Found
                </h2>
                <p className="text-neutral-400 mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    Let&apos;s get you back on track!
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="bg-brand-orange hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
                    >
                        🏠 Go Home
                    </Link>
                    <Link
                        href="/tickets"
                        className="border border-brand-blue text-brand-blue hover:bg-brand-blue/10 font-semibold px-6 py-3 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
                    >
                        🎟️ Buy Tickets
                    </Link>
                </div>

                {/* Quick Links */}
                <div className="mt-10 pt-8 border-t border-white/10">
                    <p className="text-neutral-500 text-sm mb-4">Quick Links</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link
                            href="/vip"
                            className="text-neutral-400 hover:text-brand-orange transition-colors text-sm"
                        >
                            VIP Packages
                        </Link>
                        <span className="text-neutral-600">•</span>
                        <Link
                            href="/vendors"
                            className="text-neutral-400 hover:text-brand-blue transition-colors text-sm"
                        >
                            Vendors
                        </Link>
                        <span className="text-neutral-600">•</span>
                        <Link
                            href="/gallery"
                            className="text-neutral-400 hover:text-brand-orange transition-colors text-sm"
                        >
                            Gallery
                        </Link>
                        <span className="text-neutral-600">•</span>
                        <Link
                            href="/faq"
                            className="text-neutral-400 hover:text-brand-blue transition-colors text-sm"
                        >
                            FAQ
                        </Link>
                        <span className="text-neutral-600">•</span>
                        <Link
                            href="/contact"
                            className="text-neutral-400 hover:text-brand-orange transition-colors text-sm"
                        >
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
