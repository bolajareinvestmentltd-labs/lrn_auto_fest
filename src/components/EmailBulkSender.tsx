"use client";

import { useState } from "react";
import {
  Mail,
  Send,
  Calendar,
  Users,
  Eye,
  Settings,
  AlertCircle,
  CheckCircle2,
  Clock,
  BarChart3,
  FileText,
  Target,
  Zap,
  Instagram,
  Linkedin,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";

interface EmailTemplate {
  id: string;
  name: string;
  type: "newsletter" | "promotion" | "announcement";
  subject: string;
  preview: string;
  icon: React.ReactNode;
}

interface RecipientSegment {
  id: string;
  name: string;
  count: number;
  color: string;
}

export default function EmailBulkSender() {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  
  // Email Configuration
  const [emailService, setEmailService] = useState<"sendgrid" | "resend">("resend");
  const [customDomain, setCustomDomain] = useState<string | null>(null);
  const [fromEmail, setFromEmail] = useState("");
  const [fromName, setFromName] = useState("Ilorin Auto Festival");

  // Available custom domains
  const customDomains = [
    { id: "default", name: "Default (noreply@festival.com)", value: "noreply@festival.com" },
    { id: "marketing", name: "Marketing (marketing@ilorinautofest.com)", value: "marketing@ilorinautofest.com" },
    { id: "support", name: "Support (support@ilorinautofest.com)", value: "support@ilorinautofest.com" },
    { id: "events", name: "Events (events@ilorinautofest.com)", value: "events@ilorinautofest.com" },
  ];

  // Email Templates
  const emailTemplates: EmailTemplate[] = [
    {
      id: "newsletter",
      name: "Festival Newsletter",
      type: "newsletter",
      subject: "Ilorin Auto Fest 2026 - Latest Updates & Exclusive News",
      preview: "Stay updated with festival highlights, special offers, and behind-the-scenes content...",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: "promotion",
      name: "Limited Time Promotion",
      type: "promotion",
      subject: "🎉 48-Hour Flash Sale - VIP Tickets at Special Prices!",
      preview: "Don't miss this exclusive offer! Get VIP access at incredible discounted rates...",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      id: "vip-exclusive",
      name: "VIP Exclusive Offer",
      type: "promotion",
      subject: "Exclusive VIP Perks - Premium Experience Awaits",
      preview: "Experience the festival like never before with exclusive VIP benefits and perks...",
      icon: <Target className="w-5 h-5" />,
    },
    {
      id: "announcement",
      name: "Event Announcement",
      type: "announcement",
      subject: "Exciting Announcement - New Performers & Experiences Added!",
      preview: "We're thrilled to announce new additions to the Ilorin Auto Festival lineup...",
      icon: <AlertCircle className="w-5 h-5" />,
    },
  ];

  // Recipient Segments
  const recipientSegments: RecipientSegment[] = [
    { id: "all-subscribers", name: "All Subscribers", count: 12500, color: "from-blue-500 to-blue-600" },
    { id: "vip-buyers", name: "VIP Ticket Holders", count: 3420, color: "from-orange-500 to-orange-600" },
    { id: "regular-buyers", name: "Regular Ticket Holders", count: 8100, color: "from-green-500 to-green-600" },
    { id: "newsletter-only", name: "Newsletter Subscribers", count: 5200, color: "from-purple-500 to-purple-600" },
    { id: "abandoned-cart", name: "Abandoned Cart", count: 890, color: "from-red-500 to-red-600" },
    { id: "vendors", name: "Vendors & Partners", count: 42, color: "from-yellow-500 to-yellow-600" },
  ];

  const handleSegmentToggle = (segmentId: string) => {
    setSelectedSegments((prev) =>
      prev.includes(segmentId) ? prev.filter((id) => id !== segmentId) : [...prev, segmentId]
    );
  };

  const getTotalRecipients = () => {
    const uniqueIds = new Set<string>();
    selectedSegments.forEach((segmentId) => {
      uniqueIds.add(segmentId);
    });
    return recipientSegments
      .filter((seg) => uniqueIds.has(seg.id))
      .reduce((sum, seg) => sum + seg.count, 0);
  };

  const handleSendEmail = async () => {
    if (!selectedTemplate || selectedSegments.length === 0) {
      alert("Please select a template and at least one recipient segment");
      return;
    }

    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 5000);
    }, 2000);
  };

  const steps = [
    { number: 1, label: "Template", description: "Choose email type" },
    { number: 2, label: "Configuration", description: "Set sender details" },
    { number: 3, label: "Recipients", description: "Select audience" },
    { number: 4, label: "Schedule", description: "Set send time" },
    { number: 5, label: "Review", description: "Confirm & send" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mail className="w-8 h-8 text-brand-orange" />
            <h1 className="text-4xl font-bold text-white uppercase tracking-widest">Bulk Email Campaign</h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Create and send targeted email campaigns to your audience segments with beautiful templates and scheduling.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step, idx) => (
              <motion.div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                      activeStep >= step.number
                        ? "bg-brand-orange text-black shadow-lg shadow-orange-500/50"
                        : "bg-white/10 text-gray-400"
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {step.number}
                  </motion.div>
                  <span
                    className={`mt-2 text-xs uppercase tracking-wider font-semibold ${
                      activeStep >= step.number ? "text-brand-orange" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-4 transition-all ${
                      activeStep > step.number ? "bg-brand-orange" : "bg-white/10"
                    }`}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Stats */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              {/* Selected Segments Box */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-brand-orange" />
                    Selected Recipients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-brand-orange mb-2">{getTotalRecipients().toLocaleString()}</div>
                  <p className="text-sm text-gray-400">{selectedSegments.length} segment(s) selected</p>
                </CardContent>
              </Card>

              {/* Email Stats */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-brand-blue" />
                    Estimated Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Open Rate</span>
                      <span className="text-white font-semibold">~24%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-brand-blue h-2 rounded-full" style={{ width: "24%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Click Rate</span>
                      <span className="text-white font-semibold">~8%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-brand-orange h-2 rounded-full" style={{ width: "8%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Bounce Rate</span>
                      <span className="text-white font-semibold">~2%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: "2%" }} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Send Status */}
              {sendSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-400 font-semibold">Campaign Sent!</p>
                    <p className="text-xs text-green-300/70">Your email campaign has been queued for delivery.</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Right Content - Form */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              {/* Step 1: Template Selection */}
              {activeStep >= 1 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Email Template</h2>
                    <FileText className="w-6 h-6 text-brand-orange" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {emailTemplates.map((template) => (
                      <motion.div
                        key={template.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                          selectedTemplate === template.id
                            ? "border-brand-orange bg-brand-orange/10"
                            : "border-white/10 bg-white/5 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="text-brand-orange">{template.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white text-sm">{template.name}</h3>
                            <span className="text-xs text-gray-400 uppercase tracking-wider">{template.type}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 line-clamp-2">{template.subject}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Email Configuration */}
              {activeStep >= 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Configuration</h2>
                    <Settings className="w-6 h-6 text-brand-orange" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email Service Provider */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-3">Email Service</label>
                      <div className="space-y-2">
                        {["sendgrid", "resend"].map((service) => (
                          <motion.label
                            key={service}
                            whileHover={{ scale: 1.02 }}
                            className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              emailService === service
                                ? "border-brand-orange bg-brand-orange/10"
                                : "border-white/10 bg-white/5"
                            }`}
                          >
                            <input
                              type="radio"
                              name="email-service"
                              value={service}
                              checked={emailService as string === service}
                              onChange={(e) => setEmailService(e.target.value as "sendgrid" | "resend")}
                              className="w-4 h-4"
                            />
                            <span className="ml-3 text-white font-semibold capitalize">{service}</span>
                          </motion.label>
                        ))}
                      </div>
                    </div>

                    {/* Custom Domain */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-3">Send From Domain</label>
                      <select
                        value={customDomain || "default"}
                        onChange={(e) => {
                          const selected = customDomains.find((d) => d.id === e.target.value);
                          if (selected) {
                            setCustomDomain(selected.id);
                            setFromEmail(selected.value);
                          }
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-orange"
                      >
                        {customDomains.map((domain) => (
                          <option key={domain.id} value={domain.id}>
                            {domain.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Sender Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">From Name</label>
                      <input
                        type="text"
                        value={fromName}
                        onChange={(e) => setFromName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-orange"
                        placeholder="Your Name/Organization"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">From Email</label>
                      <input
                        type="email"
                        value={fromEmail}
                        disabled
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-gray-400 focus:outline-none cursor-not-allowed opacity-60"
                      />
                    </div>
                  </div>

                  <div className="bg-brand-blue/10 border border-brand-blue/30 rounded-lg p-4 flex items-start gap-3">
                    <Mail className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-brand-blue font-semibold">Email Configuration</p>
                      <p className="text-blue-200/70 text-xs mt-1">
                        Emails will be sent as: {fromName} &lt;{fromEmail}&gt; via {emailService.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Recipient Selection */}
              {activeStep >= 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Select Recipients</h2>
                    <Target className="w-6 h-6 text-brand-orange" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {recipientSegments.map((segment) => (
                      <motion.div
                        key={segment.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleSegmentToggle(segment.id)}
                        className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                          selectedSegments.includes(segment.id)
                            ? "border-brand-orange bg-brand-orange/10"
                            : "border-white/10 bg-white/5 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-white text-sm">{segment.name}</h3>
                            <p className="text-xs text-gray-400 mt-1">{segment.count.toLocaleString()} recipients</p>
                          </div>
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                              selectedSegments.includes(segment.id)
                                ? "border-brand-orange bg-brand-orange"
                                : "border-white/20"
                            }`}
                          >
                            {selectedSegments.includes(segment.id) && (
                              <CheckCircle2 className="w-4 h-4 text-black" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Schedule */}
              {activeStep >= 4 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Schedule Send</h2>
                    <Calendar className="w-6 h-6 text-brand-orange" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Send Date</label>
                      <input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-orange"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Send Time</label>
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-orange"
                      />
                    </div>
                  </div>

                  <div className="bg-brand-blue/10 border border-brand-blue/30 rounded-lg p-4 flex items-start gap-3">
                    <Clock className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-brand-blue font-semibold">Scheduled Send</p>
                      <p className="text-blue-200/70 text-xs mt-1">Your campaign will be sent automatically at the scheduled time.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Review & Send */}
              {activeStep >= 5 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Review Campaign</h2>
                    <Eye className="w-6 h-6 text-brand-orange" />
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs uppercase text-gray-500 tracking-wider mb-1">Template</p>
                        <p className="text-white font-semibold">
                          {emailTemplates.find((t) => t.id === selectedTemplate)?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-gray-500 tracking-wider mb-1">Recipients</p>
                        <p className="text-white font-semibold">{getTotalRecipients().toLocaleString()} people</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs uppercase text-gray-500 tracking-wider mb-2">Segments</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedSegments.map((segId) => {
                            const seg = recipientSegments.find((s) => s.id === segId);
                            return (
                              <span key={segId} className="px-3 py-1 bg-brand-orange/20 text-brand-orange rounded-full text-xs">
                                {seg?.name}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Send Button */}
                  <Button
                    onClick={handleSendEmail}
                    disabled={isSending}
                    className="w-full h-14 bg-brand-orange hover:bg-orange-600 text-black font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 text-lg"
                  >
                    {isSending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Campaign Now
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                  disabled={activeStep === 1}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white h-12 rounded-lg uppercase tracking-widest"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setActiveStep(Math.min(5, activeStep + 1))}
                  disabled={
                    (activeStep === 1 && !selectedTemplate) ||
                    (activeStep === 3 && selectedSegments.length === 0) ||
                    activeStep === 5
                  }
                  className="flex-1 bg-brand-blue hover:bg-blue-600 text-white h-12 rounded-lg uppercase tracking-widest"
                >
                  Next
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Professional Footer */}
      <footer className="mt-16 border-t border-white/10 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="font-heading text-lg text-white font-bold mb-3 uppercase tracking-widest">
                Ilorin Auto Festival
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The Biggest Automotive Experience in Ilorin. May 30, 2026
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4 uppercase text-xs tracking-widest">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-gray-400 hover:text-brand-blue transition-colors text-sm">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/tickets" className="text-gray-400 hover:text-brand-blue transition-colors text-sm">
                    Get Tickets
                  </a>
                </li>
                <li>
                  <a href="/vendors" className="text-gray-400 hover:text-brand-blue transition-colors text-sm">
                    Vendors
                  </a>
                </li>
                <li>
                  <a href="/vip" className="text-gray-400 hover:text-brand-blue transition-colors text-sm">
                    VIP Packages
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-white mb-4 uppercase text-xs tracking-widest">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/faq" className="text-gray-400 hover:text-brand-blue transition-colors text-sm">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="mailto:contact@ilorinautomotivefestival.com.ng" className="text-gray-400 hover:text-brand-blue transition-colors text-sm">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-400 hover:text-brand-blue transition-colors text-sm">
                    Get in Touch
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact & Social */}
            <div>
              <h4 className="font-semibold text-white mb-4 uppercase text-xs tracking-widest">Connect</h4>
              <div className="space-y-3">
                <a
                  href="mailto:contact@ilorinautomotivefestival.com.ng"
                  className="flex items-center gap-2 text-gray-400 hover:text-brand-blue transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  contact@festival.com
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 pt-8">
            {/* Social Links */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-400 text-sm">Follow Us On Social Media</p>
              <div className="flex gap-3">
                <a
                  href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/ilorinautofest"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-blue/20 hover:text-brand-blue transition-all"
                  title="Instagram"
                >
                  <Instagram className="w-5 h-5 text-gray-300 hover:text-brand-blue" />
                </a>
                <a
                  href={process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com/ilorinautofest"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-blue/20 transition-all"
                  title="Facebook"
                >
                  <span className="text-gray-300 font-bold text-lg hover:text-brand-blue">f</span>
                </a>
                <a
                  href={process.env.NEXT_PUBLIC_TWITTER_URL || "https://twitter.com/ilorinautofest"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-blue/20 transition-all"
                  title="Twitter/X"
                >
                  <span className="text-gray-300 font-bold hover:text-brand-blue">𝕏</span>
                </a>
                <a
                  href={process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://youtube.com/@ilorinautomotivefestival"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-blue/20 transition-all"
                  title="YouTube"
                >
                  <span className="text-gray-300 font-bold text-lg hover:text-brand-blue">▶</span>
                </a>
                <a
                  href={process.env.NEXT_PUBLIC_TIKTOK_URL || "https://tiktok.com/@ilorin_carshow"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-blue/20 transition-all"
                  title="TikTok"
                >
                  <span className="text-gray-300 font-bold hover:text-brand-blue">♪</span>
                </a>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center text-gray-500 text-xs space-y-2">
              <p>
                © 2026 Ilorin Automotive Festival. All rights reserved.
              </p>
              <p>
                Built with <span className="text-brand-orange">❤️</span> for automotive enthusiasts everywhere
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
