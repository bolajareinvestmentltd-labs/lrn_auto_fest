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
import { Loader2, Lock, Car, Users, CreditCard, Building2, Copy, CheckCircle } from "lucide-react";

interface TicketTier {
    id: string;
    ticketType: string;
    name: string;
    presaleSinglePrice: number;
}

type GroupSize = "SINGLE" | "GROUP_2" | "GROUP_4";
type PaymentMethod = "paystack" | "bank_transfer";

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

// Bank transfer details
const BANK_DETAILS = {
    bankName: "First Bank of Nigeria",
    accountNumber: "3012345678",
    accountName: "Ilorin Automotive Festival",
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
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("paystack");
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [transferSubmitted, setTransferSubmitted] = useState(false);

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
            setPaymentMethod("paystack");
            setTransferSubmitted(false);
        }
    }, [isOpen]);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    if (!tier) return null;

    // Calculate processing fee (covers Paystack charges)
    // Paystack charges: 1.5% + ₦100 for local cards (capped at ₦2,000)
    // We add a small buffer to cover all scenarios
    const subtotal = tier.presaleSinglePrice * quantity;
    const calculateProcessingFee = (amount: number): number => {
        // 2% + ₦150 covers Paystack fees with small buffer for company
        const fee = Math.round(amount * 0.02) + 150;
        // Cap at ₦2,500 to be fair to high-value purchases
        return Math.min(fee, 2500);
    };
    const processingFee = paymentMethod === "paystack" ? calculateProcessingFee(subtotal) : 0;
    const total = subtotal + processingFee;
    const referenceCode = `IAF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const handleBankTransferSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName.trim() || !email.trim() || !phone.trim()) {
            alert("Please fill in all fields");
            return;
        }

        setIsProcessing(true);

        try {
            // Register the pending transfer
            const response = await fetch('/api/paystack/initialize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    amount: total,
                    ticketTierId: tier.id,
                    ticketType: tier.name,
                    customerName: fullName,
                    phone,
                    quantity,
                    groupSize,
                    paymentMethod: 'bank_transfer',
                    reference: referenceCode,
                })
            });

            if (response.ok) {
                setTransferSubmitted(true);
            }
        } catch (error) {
            console.error("Failed to register transfer:", error);
        } finally {
            setIsProcessing(false);
        }
    };

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

        if (!paystackLoaded || !(window as any).PaystackPop) {
            alert("Payment system is loading. Please try again.");
            return;
        }

        setIsProcessing(true);

        // Use environment variable for Paystack key
        const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_858607a04052382e73797962635921e549646549";

        const handler = (window as any).PaystackPop.setup({
            key: paystackKey,
            email: email,
            amount: total * 100, // Amount in kobo
            ref: `IAF-${Date.now()}-${Math.random().toString(36).substring(7)}`,
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
            callback_url: `${window.location.origin}/payment-confirmation`,
            onClose: () => {
                setIsProcessing(false);
            },
            onSuccess: (transaction: any) => {
                // Redirect to confirmation page
                window.location.href = `/payment-confirmation?reference=${transaction.reference}`;
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

                <form onSubmit={paymentMethod === "paystack" ? handlePayment : handleBankTransferSubmit} className="space-y-4 mt-4">
                    {/* Payment Method Selector */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <button
                            type="button"
                            onClick={() => setPaymentMethod("paystack")}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${paymentMethod === "paystack"
                                ? "bg-brand-orange/20 border-brand-orange text-white"
                                : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30"
                                }`}
                        >
                            <CreditCard className="w-5 h-5" />
                            <span className="text-sm font-medium">Card / Bank</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setPaymentMethod("bank_transfer")}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${paymentMethod === "bank_transfer"
                                ? "bg-brand-blue/20 border-brand-blue text-white"
                                : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30"
                                }`}
                        >
                            <Building2 className="w-5 h-5" />
                            <span className="text-sm font-medium">Direct Transfer</span>
                        </button>
                    </div>

                    {/* Ticket Summary */}
                    <div className="bg-brand-orange/10 border border-brand-orange/30 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center mb-3">
                            <div>
                                <p className="text-xs text-gray-400 uppercase">Ticket Type</p>
                                <p className="text-lg font-bold text-white">{tier.name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase">Package Price</p>
                                <p className="text-lg font-bold text-brand-orange">
                                    ₦{tier.presaleSinglePrice.toLocaleString()}
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
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="text-white">₦{subtotal.toLocaleString()}</span>
                                </div>
                                {paymentMethod === "paystack" && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Processing Fee</span>
                                        <span className="text-gray-300">₦{processingFee.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-2 border-t border-white/10">
                                    <span className="text-xs text-gray-500 uppercase">Total</span>
                                    <span className="text-xl font-bold text-brand-orange">
                                        ₦{total.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bank Transfer Details */}
                    {paymentMethod === "bank_transfer" && !transferSubmitted && (
                        <div className="bg-brand-blue/10 border border-brand-blue/30 rounded-lg p-4 mt-4 space-y-3">
                            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-brand-blue" />
                                Bank Transfer Details
                            </h4>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center bg-white/5 rounded p-2">
                                    <div>
                                        <p className="text-xs text-gray-500">Bank Name</p>
                                        <p className="text-white font-medium">{BANK_DETAILS.bankName}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard(BANK_DETAILS.bankName, 'bank')}
                                        className="p-1.5 hover:bg-white/10 rounded transition-colors"
                                    >
                                        {copiedField === 'bank' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                                    </button>
                                </div>

                                <div className="flex justify-between items-center bg-white/5 rounded p-2">
                                    <div>
                                        <p className="text-xs text-gray-500">Account Number</p>
                                        <p className="text-white font-mono font-bold text-lg">{BANK_DETAILS.accountNumber}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard(BANK_DETAILS.accountNumber, 'account')}
                                        className="p-1.5 hover:bg-white/10 rounded transition-colors"
                                    >
                                        {copiedField === 'account' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                                    </button>
                                </div>

                                <div className="flex justify-between items-center bg-white/5 rounded p-2">
                                    <div>
                                        <p className="text-xs text-gray-500">Account Name</p>
                                        <p className="text-white font-medium">{BANK_DETAILS.accountName}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard(BANK_DETAILS.accountName, 'name')}
                                        className="p-1.5 hover:bg-white/10 rounded transition-colors"
                                    >
                                        {copiedField === 'name' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2 mt-3">
                                <p className="text-xs text-yellow-400">
                                    <strong>Important:</strong> Use this as your payment reference: <span className="font-mono bg-black/30 px-1 rounded">{referenceCode}</span>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Transfer Submitted Success */}
                    {transferSubmitted && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mt-4 text-center">
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                            <h4 className="text-lg font-bold text-white mb-2">Transfer Details Saved!</h4>
                            <p className="text-sm text-gray-400 mb-3">
                                Please complete your bank transfer of <span className="text-green-400 font-bold">₦{total.toLocaleString()}</span> using the reference code:
                            </p>
                            <p className="font-mono text-lg text-brand-orange bg-black/30 p-2 rounded">{referenceCode}</p>
                            <p className="text-xs text-gray-500 mt-3">
                                Your ticket will be sent via email once payment is confirmed (usually within 24 hours).
                            </p>
                        </div>
                    )}

                    {/* Pay Button */}
                    {!transferSubmitted && (
                        <Button
                            type="submit"
                            disabled={isProcessing || !fullName || !email || !phone}
                            className={`w-full ${paymentMethod === "paystack" ? "bg-brand-orange hover:bg-orange-600" : "bg-brand-blue hover:bg-blue-600"} text-white font-bold h-12 text-lg uppercase tracking-wide mt-6`}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                    Processing...
                                </>
                            ) : paymentMethod === "paystack" ? (
                                <>
                                    Pay Now <Lock className="w-4 h-4 ml-2" />
                                </>
                            ) : (
                                <>
                                    Confirm Transfer Details <CheckCircle className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    )}

                    {transferSubmitted && (
                        <Button
                            type="button"
                            onClick={onClose}
                            className="w-full bg-white/10 hover:bg-white/20 text-white font-bold h-12 text-lg uppercase tracking-wide mt-6"
                        >
                            Close
                        </Button>
                    )}

                    <p className="text-xs text-center text-gray-600">
                        {paymentMethod === "paystack"
                            ? "Secured by Paystack. Non-refundable."
                            : "Manual verification may take up to 24 hours."}
                    </p>
                </form>
            </SheetContent>
        </Sheet>
    );
}
