import { Metadata } from 'next';
import { ChevronDown, Clock, MapPin, Shield, Users, Car, Phone } from 'lucide-react';

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
        answer: "Ilorin Car Show 3.0 is scheduled for;<br/>Thursday, May 28 2026<br/>Starts: 2pm<br/>(Gates open 1pm)",
        icon: <Clock className="w-5 h-5" />
      },
      {
        question: "Venue?",
        answer: 'Metropolitan Square, Asadam road, Ilorin, Kwara State. <a href="https://www.google.com/maps/dir/?api=1&destination=8.4799,4.5418&travelmode=driving" target="_blank" rel="noopener noreferrer" class="text-brand-blue hover:underline">View on Google Maps ↗</a>',
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
    title: "Parking & Transportation",
    items: [
      {
        question: "Is parking included with my ticket?",
        answer: "VIP parking access for VIP ticket holders.<br/>Designated parking spots for Regular ticket holders.<br/><br/>ALL SUPERBIKES GETS VIP PARKING ACCESS.",
        icon: <Car className="w-5 h-5" />
      }
    ]
  },
  {
    title: "Safety & Security",
    items: [
      {
        question: "What security measures are in place?",
        answer: "Maximum Safety and First aid measures are in place.<br/>(Trained personnel's deployed)",
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
            Can't find your answer? <a href="/contact" className="text-brand-orange hover:underline">Contact us</a>.
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
        <div className="pl-14 text-neutral-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.answer }}>
        </div>
      </div>
    </details>
  );
}
