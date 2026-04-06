'use client';

import Hero from '@/components/Hero';
import Experience from '@/components/Experience';
import Sponsors from '@/components/Sponsors';
import SocialProof from '@/components/SocialProof';

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <Hero />
      <Experience />
      <Sponsors />
      <SocialProof />
    </div>
  );
}
