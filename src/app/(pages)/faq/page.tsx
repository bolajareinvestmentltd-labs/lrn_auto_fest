import { Metadata } from 'next';
import { ChevronDown, Clock, MapPin, Ticket, Shield, RefreshCw, Users, Car, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'FAQ | IAF 2026',
  description: 'Frequently asked questions about the Ilorin Automotive Festival 2026',
};

interface FAQItem {
  question: string;
  answer: string;
  icon: React.ReactNode;
}

const FAQ_CATEGORIES: { title: string; items: FAQItem[] }[] = [
  {
    title: "Event Information",
    items: [
      {
        question: "What are the event dates and times?",
        answer: "The Ilorin Automotive Festival 2026 takes place on May 30th, 2026. Gates open at 10:00 AM, with main events running from 12:00 PM to 10:00 PM. VIP guests have early access from 9:00 AM.",
        icon: <Clock className="w-5 h-5" />
      },
      {
        question: "Where is the event located?",
        answer: "The festival will be held at the Ilorin Metropolitan Square, Ilorin, Kwara State, Nigeria. The venue is easily accessible from major roads and has ample parking space.",
        icon: <MapPin className="w-5 h-5" />
      },
      {
        question: "Is there an age restriction?",
        answer: "The event is open to all ages. However, children under 12 must be accompanied by an adult. Some vehicle experience zones may have minimum age requirements of 18+ for safety reasons.",
        icon: <Users className="w-5 h-5" />
      }
    ]
  },
  {
    title: "Tickets & Pricing",
    items: [
      {
        question: "What ticket tiers are available?",
        answer: "We offer 4 VIP tiers: Bronze (₦7,500), Silver (₦21,000), Gold (₦32,000), and Diamond (₦55,000) for presale singles. Each tier offers different benefits including viewing zones, merchandise, meet & greets, and exclusive experiences. Group packages are also available for 2 or 4 people.",
        icon: <Ticket className="w-5 h-5" />
      },
      {
        question: "What's included with each ticket?",
        answer: "Bronze: General admission + event access. Silver: Priority viewing + event t-shirt + refreshment voucher. Gold: Premium viewing + merch bundle + drivers' meet & greet + complimentary drinks. Diamond: Front-row access + full merch bundle + exclusive VIP lounge + ride-along experience + unlimited premium bar.",
        icon: <Ticket className="w-5 h-5" />
      },
      {
        question: "How does group pricing work?",
        answer: "Group of 2: Save up to ₦1,000 per person. Group of 4: Save up to ₦1,500 per person. Group tickets include shared parking passes (1 pass for groups of 2, 2 passes for groups of 4).",
        icon: <Users className="w-5 h-5" />
      }
    ]
  },
  {
    title: "Parking & Transportation",
    items: [
      {
        question: "Is parking included with my ticket?",
        answer: "Yes! All ticket purchases include parking passes. Single tickets and Group of 2 tickets include 1 parking pass. Group of 4 tickets include 2 parking passes. VIP tiers (Gold & Diamond) get dedicated VIP parking closest to the venue.",
        icon: <Car className="w-5 h-5" />
      },
      {
        question: "Where should I park?",
        answer: "Regular attendees: Main parking lot (5-minute walk to venue). VIP attendees: VIP parking lot adjacent to venue entrance. Follow signs on arrival. Parking attendants will guide you based on your ticket tier.",
        icon: <MapPin className="w-5 h-5" />
      }
    ]
  },
  {
    title: "Refunds & Changes",
    items: [
      {
        question: "What is the refund policy?",
        answer: "Full refund: Up to 30 days before the event. 50% refund: 15-29 days before the event. No refund: Less than 15 days before the event. In case of event cancellation, full refunds will be processed automatically.",
        icon: <RefreshCw className="w-5 h-5" />
      },
      {
        question: "Can I upgrade my ticket?",
        answer: "Yes! You can upgrade your ticket to a higher tier at any time before the event by paying the price difference. Contact us via WhatsApp or email with your original ticket ID to process an upgrade.",
        icon: <Ticket className="w-5 h-5" />
      },
      {
        question: "Can I transfer my ticket to someone else?",
        answer: "Tickets are transferable. Email us at tickets@iaf2026.com with your ticket ID and the new attendee's details at least 48 hours before the event.",
        icon: <Users className="w-5 h-5" />
      }
    ]
  },
  {
    title: "Safety & Security",
    items: [
      {
        question: "What security measures are in place?",
        answer: "Professional security personnel will be present throughout the venue. Bag checks at entry, CCTV monitoring, designated first aid stations, and trained medical staff on standby. Emergency exits are clearly marked.",
        icon: <Shield className="w-5 h-5" />
      },
      {
        question: "What items are prohibited?",
        answer: "No outside food/drinks, weapons, illegal substances, professional cameras (without press pass), drones, glass containers, or large bags. Small purses and clear bags are permitted.",
        icon: <Shield className="w-5 h-5" />
      },
      {
        question: "Is there medical assistance available?",
        answer: "Yes, we have multiple first aid stations and medical personnel on-site throughout the event. In case of emergency, alert any staff member or security personnel immediately.",
        icon: <Phone className="w-5 h-5" />
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-dark-900 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Everything you need to know about the Ilorin Automotive Festival 2026.
            Can&apos;t find your answer? <a href="/contact" className="text-brand-orange hover:underline">Contact us</a>.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-10">
          {FAQ_CATEGORIES.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-brand-orange/20 flex items-center justify-center text-brand-orange text-sm font-bold">
                  {categoryIndex + 1}
                </span>
                {category.title}
              </h2>

              <div className="space-y-4">
                {category.items.map((item, itemIndex) => (
                  <FAQAccordion key={itemIndex} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 p-8 bg-gradient-to-r from-brand-orange/20 to-brand-blue/20 border border-white/10 rounded-2xl text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Still have questions?</h3>
          <p className="text-neutral-400 mb-6">
            Our team is ready to help you with any other questions you might have.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/2348012345678?text=Hi%2C%20I%20have%20a%20question%20about%20IAF%202026"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors"
            >
              <Phone className="w-5 h-5" />
              Contact Form
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQAccordion({ item }: { item: FAQItem }) {
  return (
    <details className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      <summary className="flex items-center gap-4 p-5 cursor-pointer list-none hover:bg-white/5 transition-colors">
        <span className="p-2 bg-brand-orange/20 rounded-lg text-brand-orange">
          {item.icon}
        </span>
        <span className="flex-1 text-white font-medium text-left">{item.question}</span>
        <ChevronDown className="w-5 h-5 text-neutral-400 group-open:rotate-180 transition-transform" />
      </summary>
      <div className="px-5 pb-5 pt-0">
        <div className="pl-14 text-neutral-400 leading-relaxed">
          {item.answer}
        </div>
      </div>
    </details>
  );
}
