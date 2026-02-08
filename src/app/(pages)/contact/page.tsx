"use client";

import { useState } from 'react';
import { Phone, Mail, MapPin, Instagram, Send, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Send to API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to send');

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "234XXXXXXXXXX";
  const whatsappMessage = encodeURIComponent("Hi, I have a question about the Ilorin Automotive Festival 2026");

  return (
    <div className="min-h-screen bg-dark-900 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get In Touch
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Have questions about IAF 2026? We&apos;re here to help. Reach out through any of the channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* WhatsApp CTA - Primary */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 bg-green-600/20 border-2 border-green-500 rounded-2xl hover:bg-green-600/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-green-500 rounded-xl">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">Chat on WhatsApp</h3>
                  <p className="text-green-400">Fastest response • Usually within 30 mins</p>
                </div>
                <Send className="w-6 h-6 text-green-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ContactCard
                icon={<Phone className="w-6 h-6" />}
                title="Phone"
                value={process.env.NEXT_PUBLIC_CONTACT_PHONE || '+234 XXX XXX XXXX'}
                href={`tel:${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''}`}
                color="brand-orange"
              />
              <ContactCard
                icon={<Mail className="w-6 h-6" />}
                title="Email"
                value={process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@ilorinautofest.com'}
                href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@ilorinautofest.com'}`}
                color="brand-blue"
              />
              <ContactCard
                icon={<Instagram className="w-6 h-6" />}
                title="Instagram"
                value="@ilorinautofest"
                href="https://instagram.com/ilorinautofest"
                color="pink-500"
              />
              <ContactCard
                icon={<MapPin className="w-6 h-6" />}
                title="Location"
                value="Ilorin, Kwara State"
                href="https://maps.google.com/?q=Ilorin+Kwara+State+Nigeria"
                color="purple-500"
              />
            </div>

            {/* Event Details */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <h3 className="text-lg font-semibold text-white mb-4">Event Details</h3>
              <div className="space-y-3 text-neutral-400">
                <p><span className="text-white font-medium">Date:</span> May 30th, 2026</p>
                <p><span className="text-white font-medium">Venue:</span> Ilorin Metropolitan Square</p>
                <p><span className="text-white font-medium">Time:</span> 10:00 AM - 10:00 PM</p>
              </div>
            </div>

            {/* Response Time Note */}
            <div className="p-4 bg-brand-orange/10 border border-brand-orange/30 rounded-xl">
              <p className="text-sm text-brand-orange">
                <strong>Quick Tip:</strong> For the fastest response, reach out via WhatsApp.
                Email responses may take 24-48 hours during peak periods.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-400 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-400 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-neutral-400 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all"
                >
                  <option value="" className="bg-dark-900">Select a topic...</option>
                  <option value="tickets" className="bg-dark-900">Tickets & Pricing</option>
                  <option value="vendor" className="bg-dark-900">Vendor Application</option>
                  <option value="sponsorship" className="bg-dark-900">Sponsorship Inquiry</option>
                  <option value="media" className="bg-dark-900">Media & Press</option>
                  <option value="general" className="bg-dark-900">General Question</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-400 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 bg-brand-orange hover:bg-brand-orange/90 disabled:bg-brand-orange/50 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>

              {/* Status Messages */}
              {status === 'success' && (
                <div className="flex items-center gap-3 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <p className="text-green-400">Message sent successfully! We&apos;ll get back to you soon.</p>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-400">Failed to send message. Please try again or use WhatsApp.</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  value,
  href,
  color
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href: string;
  color: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
    >
      <div className={`inline-flex p-2 rounded-lg bg-${color}/20 text-${color} mb-3`}>
        {icon}
      </div>
      <h3 className="text-sm text-neutral-400 mb-1">{title}</h3>
      <p className="text-white font-medium group-hover:text-brand-orange transition-colors">{value}</p>
    </a>
  );
}
