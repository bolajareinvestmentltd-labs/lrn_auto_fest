"use client";

import { Instagram, ExternalLink } from 'lucide-react';
import Image from 'next/image';

// Social media platforms with brand colors and links
const SOCIAL_HANDLES = [
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@ilorin_carshow',
    url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/ilorin_carshow',
    description: 'Behind-the-scenes, car spotlights & event updates',
    icon: '📸',
    gradient: 'from-purple-600 via-pink-500 to-orange-400',
    hoverBg: 'hover:bg-gradient-to-r hover:from-purple-600/20 hover:via-pink-500/20 hover:to-orange-400/20',
    borderColor: 'hover:border-pink-500/50',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    handle: '@ilorin_carshow',
    url: process.env.NEXT_PUBLIC_TIKTOK_URL || 'https://tiktok.com/@ilorin_carshow',
    description: 'Drift clips, car reveals & viral moments',
    icon: '🎵',
    gradient: 'from-black via-pink-500 to-cyan-400',
    hoverBg: 'hover:bg-gradient-to-r hover:from-black/20 hover:via-pink-500/20 hover:to-cyan-400/20',
    borderColor: 'hover:border-cyan-400/50',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    handle: 'Ilorin Car Show',
    url: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/ilorincarshow',
    description: 'Community updates, event discussions & announcements',
    icon: '👥',
    gradient: 'from-blue-600 to-blue-400',
    hoverBg: 'hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-blue-400/20',
    borderColor: 'hover:border-blue-500/50',
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    handle: '@ilorin_carshow',
    url: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/ilorin_carshow',
    description: 'Live event updates, news & conversations',
    icon: '𝕏',
    gradient: 'from-gray-700 to-gray-500',
    hoverBg: 'hover:bg-gradient-to-r hover:from-gray-700/20 hover:to-gray-500/20',
    borderColor: 'hover:border-gray-400/50',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    handle: '@ilorincarshow',
    url: process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://youtube.com/@ilorincarshow',
    description: 'Full event recaps, drift highlights & car reviews',
    icon: '▶️',
    gradient: 'from-red-600 to-red-400',
    hoverBg: 'hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-400/20',
    borderColor: 'hover:border-red-500/50',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    handle: 'Join our channel',
    url: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '234XXXXXXXXXX'}`,
    description: 'Direct updates, ticket support & event reminders',
    icon: '💬',
    gradient: 'from-green-600 to-green-400',
    hoverBg: 'hover:bg-gradient-to-r hover:from-green-600/20 hover:to-green-400/20',
    borderColor: 'hover:border-green-500/50',
  },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#050505] py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6">
          <Image
            src="/images/logo.png"
            alt="Ilorin Car Show 3.0 Logo"
            width={120}
            height={120}
            className="mx-auto mb-4 h-24 w-24 sm:h-28 sm:w-28 object-contain"
          />
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-3 uppercase tracking-tight">
            Connect With <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-orange">Us</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Follow Ilorin Car Show 3.0 on all platforms. Stay updated with the latest on cars, drift, lifestyle & everything automotive.
          </p>
        </div>

        {/* Social Media Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {SOCIAL_HANDLES.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex flex-col justify-between p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 ${social.hoverBg} ${social.borderColor} hover:scale-[1.03] hover:shadow-xl`}
            >
              {/* Top: Icon & Platform */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{social.icon}</span>
                  <div>
                    <p className="text-white font-bold text-lg">{social.name}</p>
                    <p className={`text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r ${social.gradient}`}>
                      {social.handle}
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-white/30 group-hover:text-white/70 transition-colors" />
              </div>

              {/* Description */}
              <p className="text-neutral-400 text-sm leading-relaxed">
                {social.description}
              </p>

              {/* Bottom CTA */}
              <div className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r ${social.gradient}`}>
                Follow on {social.name} →
              </div>
            </a>
          ))}
        </div>

        {/* Stats Banner */}
        <div className="mt-16 p-8 bg-gradient-to-r from-brand-orange/10 to-brand-blue/10 border border-white/10 rounded-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-brand-orange">5,000+</p>
              <p className="text-neutral-400 text-sm">Expected Attendees</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-brand-blue">50+</p>
              <p className="text-neutral-400 text-sm">Exotic Cars</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-brand-orange">3</p>
              <p className="text-neutral-400 text-sm">Successful Editions</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-brand-blue">6</p>
              <p className="text-neutral-400 text-sm">Experience Zones</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to be part of Ilorin Car Show 3.0?</h3>
          <p className="text-neutral-400 mb-6">Don&apos;t miss the biggest automotive event in Kwara State!</p>
          <a
            href="/tickets"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold rounded-lg transition-colors"
          >
            Get Your Tickets Now
          </a>
        </div>
      </div>
    </div>
  );
}
