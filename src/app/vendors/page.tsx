"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, CheckCircle2, Download } from "lucide-react";
import html5QRCode from "qrcode";

const VENDOR_BOOKING_FEE = 103500;
const MAX_VENDORS = 10;
const ALLOWED_PRODUCT_TYPES = ["food", "drink", "eatables"];

interface PaymentSuccess {
  reference: string;
  ticketId: string;
}

interface FormData {
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  productType: string;
}

export default function VendorsPage() {
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    contactPerson: "",
    phone: "",
    email: "",
    productType: "",
  });

  const [paymentSuccess, setPaymentSuccess] = useState<PaymentSuccess | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedVendors, setConfirmedVendors] = useState(0);
  const [countLoading, setCountLoading] = useState(true);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  const slotsLeft = Math.max(MAX_VENDORS - confirmedVendors, 0);

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => {
      setPaystackLoaded(true);
    };
    script.onerror = () => {
      setError("Failed to load Paystack. Please refresh the page.");
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Fetch vendor count on mount
  useEffect(() => {
    const fetchVendorCount = async () => {
      try {
        const response = await fetch("/api/vendors");
        if (!response.ok) {
          throw new Error("Failed to fetch vendor slots");
        }
        const data = await response.json();
        setConfirmedVendors(data.count || 0);
      } catch (error) {
        console.error("Failed to load vendor count:", error);
      } finally {
        setCountLoading(false);
      }
    };

    fetchVendorCount();
  }, []);

  // Generate QR code when payment succeeds
  useEffect(() => {
    if (paymentSuccess && qrCanvasRef.current) {
      html5QRCode.toCanvas(
        qrCanvasRef.current,
        JSON.stringify({
          ticketId: paymentSuccess.ticketId,
          reference: paymentSuccess.reference,
        }),
        { width: 256, margin: 1 }
      );
    }
  }, [paymentSuccess]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const generateTicketId = (): string => {
    return `VND-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.businessName.trim()) {
      setError("Please enter your business name");
      return;
    }
    if (!formData.contactPerson.trim()) {
      setError("Please enter contact person name");
      return;
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    if (!formData.phone || formData.phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    if (!formData.productType) {
      setError("Please select a product type");
      return;
    }

    if (slotsLeft <= 0) {
      setError("Vendor booking is currently full.");
      return;
    }

    if (
      !paystackLoaded ||
      !(window as unknown as Record<string, unknown>).PaystackPop
    ) {
      setError("Payment system is loading. Please try again.");
      return;
    }

    setIsProcessing(true);

    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!paystackKey) {
      setError("Payment configuration error. Please contact support.");
      setIsProcessing(false);
      return;
    }

    const ticketId = generateTicketId();
    const referenceCode = `VND-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = ((window as unknown) as Record<string, any>).PaystackPop.setup({
      key: paystackKey,
      email: formData.email,
      amount: VENDOR_BOOKING_FEE * 100, // Amount in kobo
      ref: referenceCode,
      currency: "NGN",
      metadata: {
        custom_fields: [
          {
            display_name: "Business Name",
            variable_name: "business_name",
            value: formData.businessName,
          },
          {
            display_name: "Contact Person",
            variable_name: "contact_person",
            value: formData.contactPerson,
          },
          { display_name: "Phone", variable_name: "phone", value: formData.phone },
          {
            display_name: "Product Type",
            variable_name: "product_type",
            value: formData.productType,
          },
        ],
      },
      onClose: () => {
        setIsProcessing(false);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback: async (response: any) => {
        // Zero-redirect strategy: handle success on this same page
        try {
          const apiResponse = await fetch("/api/vendors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ticketId,
              businessName: formData.businessName,
              contactPerson: formData.contactPerson,
              email: formData.email,
              phone: formData.phone,
              productType: formData.productType,
              paymentReference: response.reference,
              amount: VENDOR_BOOKING_FEE,
            }),
          });

          if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            setError(
              errorData.error || "Failed to complete vendor registration"
            );
            setIsProcessing(false);
            return;
          }

          // Set success state to show confirmation UI on this page
          setPaymentSuccess({
            reference: response.reference,
            ticketId,
          });

          // Reset form
          setFormData({
            businessName: "",
            contactPerson: "",
            phone: "",
            email: "",
            productType: "",
          });
        } catch (err) {
          console.error("Error processing vendor registration:", err);
          setError("Failed to process registration. Please contact support.");
        } finally {
          setIsProcessing(false);
        }
      },
    });

    handler.openIframe();
  };

  // Success UI
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-[#050505] py-20">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="Ilorin Car Show Logo"
                width={120}
                height={120}
                className="mx-auto mb-4 h-24 w-24 object-contain"
              />
            </Link>
            <h1 className="text-4xl font-bold text-white">Vendors</h1>
          </div>

          {/* Success Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-2 border-green-500/50 rounded-2xl p-8 shadow-2xl"
          >
            <div className="text-center mb-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">
                Registration Successful! ✨
              </h2>
              <p className="text-gray-300">
                Your vendor booth has been confirmed for Ilorin Car Show 3.0
              </p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-8">
              <div className="bg-white p-4 rounded-lg">
                <canvas ref={qrCanvasRef} className="w-64 h-64" />
              </div>
            </div>

            {/* Ticket ID */}
            <div className="bg-white/5 border border-brand-orange/30 rounded-lg p-6 mb-8">
              <p className="text-xs text-gray-400 uppercase mb-2">
                Your Ticket ID
              </p>
              <p className="text-2xl font-mono font-bold text-brand-orange break-all">
                {paymentSuccess.ticketId}
              </p>
              <p className="text-xs text-gray-500 mt-3">
                Reference: {paymentSuccess.reference}
              </p>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-white mb-4">
                📋 What's Next?
              </h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold">1.</span>
                  <span>Screenshot or save your ticket ID for check-in</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold">2.</span>
                  <span>Check your email for booth details and setup information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold">3.</span>
                  <span>Arrive 30 minutes early on event day for final setup</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  if (qrCanvasRef.current) {
                    const link = document.createElement("a");
                    link.href = qrCanvasRef.current.toDataURL();
                    link.download = `vendor-ticket-${paymentSuccess.ticketId}.png`;
                    link.click();
                  }
                }}
                className="flex-1 bg-brand-orange hover:bg-orange-600 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Save QR Code
              </Button>
              <Button
                onClick={() => setPaymentSuccess(null)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-lg"
              >
                Register Another Booth
              </Button>
            </div>

            {/* Footer Info */}
            <p className="text-xs text-center text-gray-500 mt-6">
              A confirmation email has been sent to your registered email address
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Checkout Form UI
  return (
    <div className="min-h-screen bg-[#050505] py-20">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Ilorin Car Show Logo"
              width={120}
              height={120}
              className="mx-auto mb-4 h-24 w-24 object-contain"
            />
          </Link>
          <h1 className="text-4xl font-bold text-white">Vendor Registration</h1>
          <p className="text-gray-400 mt-2">
            Secure your booth for Ilorin Car Show 3.0
          </p>
        </div>

        {/* Checkout Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-2 border-brand-orange/30 rounded-2xl p-8 shadow-2xl"
        >
          {/* Availability Info */}
          {!countLoading && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-300">
                <span className="text-blue-400 font-bold">{slotsLeft}</span> booth
                {slotsLeft !== 1 ? "s" : ""} available out of {MAX_VENDORS}
              </p>
            </div>
          )}

          {/* Price Info */}
          <div className="bg-brand-orange/10 border border-brand-orange/30 rounded-lg p-4 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400 uppercase">Booth Type</p>
                <p className="text-lg font-bold text-white">
                  Food / Drink / Eatables Vendor Slot
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase">Price</p>
                <p className="text-2xl font-bold text-brand-orange">
                  ₦{VENDOR_BOOKING_FEE.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 text-red-300 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handlePayment} className="space-y-5">
            {/* Business Name */}
            <div className="space-y-2">
              <Label
                htmlFor="businessName"
                className="text-xs uppercase tracking-wider text-gray-500"
              >
                Business Name
              </Label>
              <Input
                id="businessName"
                name="businessName"
                required
                value={formData.businessName}
                onChange={handleInputChange}
                disabled={isProcessing}
                className="bg-white/5 border-white/10 text-white focus:border-brand-orange"
                placeholder="e.g. Adewale Foods"
              />
            </div>

            {/* Contact Person */}
            <div className="space-y-2">
              <Label
                htmlFor="contactPerson"
                className="text-xs uppercase tracking-wider text-gray-500"
              >
                Contact Person Name
              </Label>
              <Input
                id="contactPerson"
                name="contactPerson"
                required
                value={formData.contactPerson}
                onChange={handleInputChange}
                disabled={isProcessing}
                className="bg-white/5 border-white/10 text-white focus:border-brand-orange"
                placeholder="e.g. Adewale Johnson"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs uppercase tracking-wider text-gray-500"
              >
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                disabled={isProcessing}
                className="bg-white/5 border-white/10 text-white focus:border-brand-orange"
                placeholder="e.g. wale@example.com"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-xs uppercase tracking-wider text-gray-500"
              >
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isProcessing}
                className="bg-white/5 border-white/10 text-white focus:border-brand-orange"
                placeholder="e.g. 08012345678"
              />
            </div>

            {/* Product Type */}
            <div className="space-y-2">
              <Label
                htmlFor="productType"
                className="text-xs uppercase tracking-wider text-gray-500"
              >
                Product Type
              </Label>
              <select
                id="productType"
                name="productType"
                required
                value={formData.productType}
                onChange={handleInputChange}
                disabled={isProcessing}
                className="w-full bg-white/5 border border-white/10 rounded-md text-white px-3 py-2 focus:border-brand-orange focus:outline-none"
              >
                <option value="">Select a product type</option>
                {ALLOWED_PRODUCT_TYPES.map((type) => (
                  <option key={type} value={type} className="bg-[#1a1a2e]">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Pay Button */}
            <Button
              type="submit"
              disabled={isProcessing || !paystackLoaded || slotsLeft <= 0}
              className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold h-12 text-lg uppercase tracking-wide mt-8"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Processing...
                </>
              ) : (
                <>
                  Complete Payment <Lock className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            <p className="text-xs text-center text-gray-600">
              Secured by Paystack. Non-refundable.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
