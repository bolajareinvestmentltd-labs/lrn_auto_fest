"use client";
import Link from "next/link";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-black border-t border-white/10 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div>
                        <Link href="/">
                            <h3 className="font-heading text-xl text-white font-bold mb-4 uppercase hover:text-brand-orange transition-colors">
                                IAF 2026
                            </h3>
                        </Link>
                        <p className="text-white/60 text-sm">
                            The Biggest Auto Experience in Northern Nigeria. May 30, 2026.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4 uppercase text-sm">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-white/60 hover:text-brand-blue transition-colors text-sm">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/tickets" className="text-white/60 hover:text-brand-blue transition-colors text-sm">
                                    Tickets
                                </Link>
                            </li>
                            <li>
                                <Link href="/vip" className="text-white/60 hover:text-brand-blue transition-colors text-sm">
                                    VIP Packages
                                </Link>
                            </li>
                            <li>
                                <Link href="/vendors" className="text-white/60 hover:text-brand-blue transition-colors text-sm">
                                    Vendor Booking
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Info Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4 uppercase text-sm">Info</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/gallery" className="text-white/60 hover:text-brand-blue transition-colors text-sm">
                                    Gallery
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-white/60 hover:text-brand-blue transition-colors text-sm">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-white/60 hover:text-brand-blue transition-colors text-sm">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq#refund-policy" className="text-white/60 hover:text-brand-blue transition-colors text-sm">
                                    Refund Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-white mb-4 uppercase text-sm">Contact</h4>
                        <div className="space-y-3">
                            <a
                                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '234XXXXXXXXXX'}`}
                                className="flex items-center gap-2 text-white/60 hover:text-brand-blue transition-colors text-sm"
                            >
                                <Phone className="w-4 h-4" />
                                {process.env.NEXT_PUBLIC_CONTACT_PHONE || '+234 XXX XXX XXXX'}
                            </a>
                            <a
                                href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@ilorinautofest.com'}`}
                                className="flex items-center gap-2 text-white/60 hover:text-brand-blue transition-colors text-sm"
                            >
                                <Mail className="w-4 h-4" />
                                {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@ilorinautofest.com'}
                            </a>
                            <div className="flex items-start gap-2 text-white/60 text-sm">
                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p>Metropolitan Square</p>
                                    <p>Asadam Road, Ilorin</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 pt-8">
                    {/* Socials */}
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-white/60 text-sm">Follow Us</p>
                        <div className="flex gap-4">
                            <a
                                href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/ilorinautofest'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-blue/20 transition-all"
                                title="Instagram"
                            >
                                <Instagram className="w-5 h-5 text-brand-blue" />
                            </a>
                            <a
                                href={process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/ilorinautofest'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-blue/20 transition-all"
                                title="Facebook"
                            >
                                <span className="text-brand-blue font-bold">f</span>
                            </a>
                            <a
                                href={process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/ilorinautofest'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-blue/20 transition-all"
                                title="Twitter/X"
                            >
                                <span className="text-brand-blue font-bold">𝕏</span>
                            </a>
                            <a
                                href={process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://youtube.com/@ilorinautomotivefestival'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-blue/20 transition-all"
                                title="YouTube"
                            >
                                <span className="text-brand-blue font-bold">▶</span>
                            </a>
                            <a
                                href={process.env.NEXT_PUBLIC_TIKTOK_URL || 'https://tiktok.com/@ilorin_carshow'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-blue/20 transition-all"
                                title="TikTok"
                            >
                                <span className="text-brand-blue font-bold text-sm">♪</span>
                            </a>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="text-center text-white/40 text-xs">
                        <p>
                            © 2026 Ilorin Automotive Festival. All rights reserved.
                        </p>
                        <p className="mt-2">
                            Designed & Developed with <span className="text-brand-orange">❤️</span> by{' '}
                            <a
                                href="https://jareschoicelabs.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-blue hover:text-brand-orange transition-colors font-semibold"
                            >
                                Jare&apos;s Choice Labs
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
