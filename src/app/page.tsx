'use client';

import Hero from '@/components/Hero';
import Experience from '@/components/Experience';
import Tickets from '@/components/Tickets';
import Merchandise from '@/components/Merchandise';
import Sponsors from '@/components/Sponsors';
import SocialProof from '@/components/SocialProof';

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <Hero />
      <Experience />
      <Tickets />
      <Merchandise />
      <Sponsors />
      <SocialProof />
    </div>
  );
}
