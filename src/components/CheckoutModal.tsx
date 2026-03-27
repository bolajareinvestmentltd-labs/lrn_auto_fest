"use client";

import { useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Car, Users, CreditCard } from "lucide-react";

interface TicketTier {
    id: string;
    ticketType: string;
    name: string;
    presaleSinglePrice: number | null;
    presaleGroup2Price: number | null;
    presaleGroup4Price: number | null;
    onsaleSinglePrice: number | null;
    onsaleGroup2Price: number | null;
    onsaleGroup4Price: number | null;
    presaleActive: boolean;
}

type GroupSize = "SINGLE" | "GROUP_2" | "GROUP_4";
type PaymentMethod = "paystack";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    tier: TicketTier | null;
    groupSize?: GroupSize;
}

const GROUP_LABELS: Record<GroupSize, { label: string; people: number; parking: number }> = {
    SINGLE: { label: "Single", people: 1, parking: 1 },
    GROUP_2: { label: "Group of 2", people: 2, parking: 1 },
    GROUP_4: { label: "Group of 4", people: 4, parking: 2 },
};

export default function CheckoutModal({
    isOpen,
    onClose,
    tier,
    groupSize = "SINGLE",
}: CheckoutModalProps) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paystackLoaded, setPaystackLoaded] = useState(false);
    const groupInfo = GROUP_LABELS[groupSize];

    // Load Paystack script on component mount
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

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFullName("");
            setEmail("");
            setPhone("");
            setQuantity(1);
            setIsProcessing(false);
        }
    }, [isOpen]);

    if (!tier) return null;

    // Determine the correct unit price based on group size and sale period
    const PRESALE_END_DATE = "2026-03-31T23:59:59Z";
    const isPresale = tier.presaleActive && new Date() < new Date(PRESALE_END_DATE);

    const getUnitPrice = (): number => {
        const fallback = tier.presaleSinglePrice ?? 0;
        if (isPresale) {
            switch (groupSize) {
                case "GROUP_2": return tier.presaleGroup2Price ?? (fallback * 2);
                case "GROUP_4": return tier.presaleGroup4Price ?? (fallback * 4);
                default: return fallback;
            }
        }
        switch (groupSize) {
            case "GROUP_2": return tier.onsaleGroup2Price ?? ((tier.onsaleSinglePrice ?? fallback) * 2);
            case "GROUP_4": return tier.onsaleGroup4Price ?? ((tier.onsaleSinglePrice ?? fallback) * 4);
            default: return tier.onsaleSinglePrice ?? fallback;
        }
    };

    const unitPrice = getUnitPrice();
    // Pricing breakdown
    const SERVICE_CHARGE = 30;
    const VAT_PERCENTAGE = 5;

    // Calculate subtotal: (unit price × quantity) + service charge
    const ticketAmount = unitPrice * quantity;
    const subtotalWithService = ticketAmount + SERVICE_CHARGE;

    // Calculate VAT on subtotal with service charge
    const vat = Math.round(subtotalWithService * (VAT_PERCENTAGE / 100));

    // Calculate processing fee (covers Paystack charges) - applied to total before vat
    const calculateProcessingFee = (amount: number): number => {
        // 2% + ₦150 covers Paystack fees with small buffer for company
        const fee = Math.round(amount * 0.02) + 150;
        // Cap at ₦2,500 to be fair to high-value purchases
        return Math.min(fee, 2500);
    };
    const processingFee = calculateProcessingFee(subtotalWithService + vat);
    const total = subtotalWithService + vat + processingFee;
    const referenceCode = `IAF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!fullName.trim() || !email.trim() || !phone.trim()) {
            alert("Please fill in all fields");
            return;
        }

        if (!email.includes("@")) {
            alert("Please enter a valid email");
            return;
        }

        if (phone.length < 10) {
            alert("Please enter a valid phone number");
            return;
        }

        if (!paystackLoaded || !(window as unknown as Record<string, unknown>).PaystackPop) {
            alert("Payment system is loading. Please try again.");
            return;
        }

        setIsProcessing(true);

        // Use environment variable for Paystack key
        const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

        if (!paystackKey) {
            alert("Payment configuration error. Please contact support.");
            setIsProcessing(false);
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handler = ((window as unknown) as Record<string, any>).PaystackPop.setup({
            key: paystackKey,
            email: email,
            amount: total * 100, // Amount in kobo
            ref: referenceCode, // USING THE GENERATED REFERENCE CODE HERE
            currency: "NGN",
            metadata: {
                custom_fields: [
                    { display_name: "Customer Name", variable_name: "customer_name", value: fullName },
                    { display_name: "Phone", variable_name: "phone", value: phone },
                    { display_name: "Ticket Type", variable_name: "ticket_type", value: tier.name },
                    { display_name: "Group Size", variable_name: "group_size", value: groupSize },
                    { display_name: "Quantity", variable_name: "quantity", value: quantity },
                    { display_name: "Parking Passes", variable_name: "parking", value: groupInfo.parking * quantity },
                ]
            },
            onClose: () => {
                setIsProcessing(false);
            },
            // FIXED: Raw Paystack JS uses 'callback', not 'onSuccess'
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            callback: (response: any) => {
                // Redirect directly to your confirmation page with the reference
                window.location.href = `/payment-confirmation?reference=${response.reference}`;
            }
        });
        handler.openIframe();
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-md bg-[#1a1a1a] border-l border-brand-orange/30 overflow-y-auto">
                <SheetHeader className="text-center pb-4">
                    <SheetTitle className="text-2xl font-bold text-white uppercase tracking-wide">
                        Complete Your Purchase
                    </SheetTitle>
                    <p className="text-sm text-gray-400 mt-2">{tier.name}</p>
                </SheetHeader>
                <form onSubmit={handlePayment} className="space-y-4 mt-4">
                    {/* Ticket Summary */}
                    <div className="bg-brand-orange/10 border border-brand-orange/30 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center mb-3">
                            <div>
                                <p className="text-xs text-gray-400 uppercase">Ticket Type</p>
                                <p className="text-lg font-bold text-white">{tier.name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase">Package Price{isPresale ? " (Pre-sale)" : ""}</p>
                                <p className="text-lg font-bold text-brand-orange">
                                    ₦{unitPrice.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Group & Parking Info */}
                        <div className="flex gap-4 pt-3 border-t border-white/10">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <Users className="w-4 h-4 text-brand-blue" />
                                <span>{groupInfo.label} ({groupInfo.people} person{groupInfo.people > 1 ? "s" : ""})</span>
                            </div>
                            {tier.ticketType.includes("VIP") && (
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <Car className="w-4 h-4 text-brand-orange" />
                                    <span>{groupInfo.parking} parking</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Full Name */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="name"
                            className="text-xs uppercase tracking-wider text-gray-500"
                        >
                            Full Name
                        </Label>
                        <Input
                            id="name"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
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
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={isProcessing}
                            className="bg-white/5 border-white/10 text-white focus:border-brand-orange"
                            placeholder="e.g. 08012345678"
                        />
                    </div>

                    {/* Quantity & Total */}
                    <div className="flex gap-4 mt-6">
                        <div className="w-1/3 space-y-2">
                            <Label className="text-xs uppercase tracking-wider text-gray-500">
                                Qty
                            </Label>
                            <Input
                                type="number"
                                min={1}
                                max={10}
                                value={quantity}
                                onChange={(e) =>
                                    setQuantity(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))
                                }
                                disabled={isProcessing}
                                className="bg-white/5 border-white/10 text-white text-center focus:border-brand-orange"
                            />
                        </div>
                        <div className="w-2/3 bg-white/5 border border-white/10 rounded-md flex flex-col justify-center items-center p-3">
                            <div className="w-full space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Ticket Amount</span>
                                    <span className="text-white">₦{ticketAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Service Charge</span>
                                    <span className="text-white">₦{SERVICE_CHARGE.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">VAT (5)</span>
                                    <span className="text-white">₦{vat.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Processing Fee</span>
                                    <span className="text-gray-300">₦{processingFee.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-white/10">
                                    <span className="text-xs text-gray-500 uppercase">Total</span>
                                    <span className="text-xl font-bold text-brand-orange">
                                        ₦{total.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pay Button */}
                    <Button
                        type="submit"
                        disabled={isProcessing || !fullName || !email || !phone}
                        className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold h-12 text-lg uppercase tracking-wide mt-6"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Pay Now <Lock className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>

                    <p className="text-xs text-center text-gray-600">
                        Secured by Paystack. Non-refundable.
                    </p>
                </form>
            </SheetContent>
        </Sheet>
    );
        }
                        
