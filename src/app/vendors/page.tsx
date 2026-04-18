```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, CheckCircle, Store, AlertTriangle, CheckCircle2, Download } from "lucide-react";
import html5QRCode from "qrcode";

const VENDOR_BOOKING_FEE = 103500;
const MAX_VENDORS = 10;
const ALLOWED_PRODUCT_TYPES = ["food", "drink", "eatables"];

interface PaymentSuccess {
  reference: string;
  ticketId: string;
  qrCode: string;
}

interface FormData {
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  productType: string;
}

export default function VendorPage() {
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
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const [ticketId, setTicketId] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const [confirmedVendors, setConfirmedVendors] = useState(0);
  const [countLoading, setCountLoading] = useState(true);

  const slotsLeft = Math.max(MAX_VENDORS - confirmedVendors, 0);

  const getTotal = () => VENDOR_BOOKING_FEE;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => {
      setPaystackLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
  }, [submitted]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.businessName || !formData.contactPerson || !formData.phone || !formData.email || !formData.productType) {
      alert("Please fill in all required fields");
      return;
    }

    if (!formData.email.includes("@")) {
      alert("Please enter a valid email");
      return;
    }

    if (slotsLeft <= 0) {
      alert("Vendor booking is currently full.");
      return;
    }

    if (!paystackLoaded || !(window as unknown as Record<string, unknown>).PaystackPop) {
      alert("Payment system is loading. Please try again.");
      return;
    }

    setIsSubmitting(true);

    const generateTicketId = () => {
      return `VND-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    };

    const newTicketId = generateTicketId();
    const totalAmount = getTotal();

    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

    if (!paystackKey) {
      alert("Payment configuration error. Please contact support.");
      setIsSubmitting(false);
      return;
    }

    // eslint-disable-next-line @