"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Play, X, ChevronLeft, ChevronRight, Camera, Video } from 'lucide-react';

interface GalleryItem {
  id: number;
  type: 'image' | 'video';
  src: string;
  thumbnail: string;
  title: string;
  category: string;
}

// Gallery items - YOUR ACTUAL IMAGES
const GALLERY_ITEMS: GalleryItem[] = [
  { id: 1, type: 'image', src: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.04.jpeg', thumbnail: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.04.jpeg', title: 'Festival Vibes', category: 'crowd' },
  { id: 2, type: 'image', src: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.07(1).jpeg', thumbnail: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.07(1).jpeg', title: 'Drift Action', category: 'stunts' },
  { id: 3, type: 'image', src: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.07(2).jpeg', thumbnail: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.07(2).jpeg', title: 'Exotic Cars', category: 'vehicles' },
  { id: 4, type: 'image', src: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.07(3).jpeg', thumbnail: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.07(3).jpeg', title: 'Night Showcase', category: 'vehicles' },
  { id: 5, type: 'image', src: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.07.jpeg', thumbnail: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.07.jpeg', title: 'Burnout Masters', category: 'stunts' },
  { id: 6, type: 'image', src: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.08(1).jpeg', thumbnail: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.08(1).jpeg', title: 'VIP Experience', category: 'crowd' },
  { id: 7, type: 'image', src: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.08(2).jpeg', thumbnail: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.08(2).jpeg', title: 'Car Display', category: 'vehicles' },
  { id: 8, type: 'image', src: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.08(3).jpeg', thumbnail: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.08(3).jpeg', title: 'Tire Smoke', category: 'stunts' },
  { id: 9, type: 'image', src: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.08(4).jpeg', thumbnail: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.08(4).jpeg', title: 'Crowd Energy', category: 'crowd' },
  { id: 10, type: 'image', src: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.08.jpeg', thumbnail: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.08.jpeg', title: 'Modified Beasts', category: 'vehicles' },
  { id: 11, type: 'image', src: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.09(1).jpeg', thumbnail: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.09(1).jpeg', title: 'Precision Drift', category: 'stunts' },
  { id: 12, type: 'image', src: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.09(2).jpeg', thumbnail: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.09(2).jpeg', title: 'Electric Atmosphere', category: 'crowd' },
  { id: 13, type: 'image', src: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.09.jpeg', thumbnail: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.09.jpeg', title: 'Classic Lineup', category: 'vehicles' },
  { id: 14, type: 'image', src: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.10.jpeg', thumbnail: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.10.jpeg', title: 'Stunt Show', category: 'stunts' },
  { id: 15, type: 'image', src: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.11.jpeg', thumbnail: '/images/gallery/WhatsApp Image 2026-01-30 at 21.18.11.jpeg', title: 'IAF Memories', category: 'crowd' },
];

const CATEGORIES = ['all', 'crowd', 'stunts', 'vehicles'];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredItems = activeCategory === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeCategory);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-dark-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Gallery & Recap
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Celebrating the best of automotive culture in Ilorin. Relive the excitement from previous editions.
          </p>
        </div>

        {/* Featured Video */}
        <div className="mb-12">
          <div className="relative aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <a
                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 px-8 py-4 bg-brand-orange/90 hover:bg-brand-orange rounded-full transition-all transform hover:scale-105"
              >
                <Play className="w-8 h-8 text-white fill-white" />
                <span className="text-white font-bold text-lg">Watch Recap Video</span>
              </a>
            </div>
            <div className="absolute bottom-6 left-6 z-20">
              <span className="text-sm text-white/60 uppercase tracking-wider">Previous Edition</span>
              <h2 className="text-2xl font-bold text-white">IAF 2025 Highlights</h2>
            </div>
            {/* Placeholder background */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 to-brand-blue/20" />
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <Video className="w-32 h-32 text-white" />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full font-medium transition-all capitalize ${activeCategory === category
                  ? 'bg-brand-orange text-white'
                  : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                }`}
            >
              {category === 'all' ? 'All Photos' : category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => openLightbox(index)}
              className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-brand-orange/50 transition-all hover:scale-[1.02]"
            >
              {/* Actual Image */}
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-medium text-sm drop-shadow-lg">{item.title}</p>
                <p className="text-white/70 text-xs capitalize">{item.category}</p>
              </div>

              {/* Video indicator */}
              {item.type === 'video' && (
                <div className="absolute top-3 right-3 bg-brand-orange rounded-full p-1.5">
                  <Play className="w-4 h-4 text-white fill-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Stats Banner */}
        <div className="mt-12 p-8 bg-gradient-to-r from-brand-orange/20 to-brand-blue/20 border border-white/10 rounded-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-brand-orange">15+</p>
              <p className="text-neutral-400 text-sm">Gallery Photos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-brand-blue">5,000+</p>
              <p className="text-neutral-400 text-sm">Past Attendees</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-brand-orange">50+</p>
              <p className="text-neutral-400 text-sm">Exotic Cars</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-brand-blue">3</p>
              <p className="text-neutral-400 text-sm">Successful Editions</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to be part of IAF 2026?</h3>
          <p className="text-neutral-400 mb-6">Don&apos;t miss the biggest automotive event in Kwara State!</p>
          <a
            href="/tickets"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold rounded-lg transition-colors"
          >
            Get Your Tickets Now
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={goToPrevious}
            className="absolute left-4 p-2 text-white/60 hover:text-white transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 p-2 text-white/60 hover:text-white transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          <div className="max-w-5xl max-h-[80vh] mx-4 relative">
            {filteredItems[currentIndex]?.type === 'video' ? (
              <iframe
                src={filteredItems[currentIndex].src}
                title={filteredItems[currentIndex].title}
                className="w-full aspect-video rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="relative w-full h-[70vh]">
                <Image
                  src={filteredItems[currentIndex]?.src || ''}
                  alt={filteredItems[currentIndex]?.title || ''}
                  fill
                  className="object-contain rounded-lg"
                  sizes="90vw"
                  priority
                />
              </div>
            )}
            <p className="text-center mt-4 text-white font-medium">
              {filteredItems[currentIndex]?.title}
            </p>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {currentIndex + 1} / {filteredItems.length}
          </div>
        </div>
      )}
    </div>
  );
}
