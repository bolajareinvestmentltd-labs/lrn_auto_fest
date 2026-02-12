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
import { Loader2, Lock, ShoppingBag, CreditCard, Check } from "lucide-react";

interface MerchItem {
    id: string;
    name: string;
    price: number;
    description?: string;
}

interface MerchandiseCheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: MerchItem | null;
}

const SIZES = ["S", "M", "L", "XL", "XXL"];

export default function MerchandiseCheckoutModal({
    isOpen,
    onClose,
    item,
}: MerchandiseCheckoutModalProps) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [size, setSize] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Determine if this item needs size selection
    const needsSize = item?.id.includes("sleeve") || item?.name.toLowerCase().includes("shirt");

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFullName("");
            setEmail("");
            setPhone("");
            setQuantity(1);
            setSize(null);
            setError(null);
        }
    }, [isOpen]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const totalPrice = (item?.price || 0) * quantity;

    const validateForm = () => {
        if (!fullName.trim()) {
            setError("Please enter your full name");
            return false;
        }
        if (!email.trim() || !email.includes("@")) {
            setError("Please enter a valid email address");
            return false;
        }
        if (!phone.trim() || phone.length < 10) {
            setError("Please enter a valid phone number");
            return false;
        }
        if (needsSize && !size) {
            setError("Please select a size");
            return false;
        }
        return true;
    };

    const handlePayment = async () => {
        if (!validateForm() || !item) return;

        setIsProcessing(true);
        setError(null);

        try {
            const response = await fetch("/api/merchandise/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    merchItemId: item.id,
                    quantity,
                    size: size || undefined,
                    customerName: fullName.trim(),
                    customerEmail: email.trim().toLowerCase(),
                    customerPhone: phone.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to initialize payment");
            }

            // Redirect to Paystack
            if (data.authorization_url) {
                window.location.href = data.authorization_url;
            } else {
                throw new Error("No payment URL received");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            setIsProcessing(false);
        }
    };

    if (!item) return null;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent
                side="right"
                className="w-full sm:max-w-lg bg-[#0a0a0a] border-l border-white/10 overflow-y-auto"
            >
                <SheetHeader className="pb-6 border-b border-white/10">
                    <SheetTitle className="text-2xl font-bold text-white flex items-center gap-2">
                        <ShoppingBag className="w-6 h-6 text-brand-orange" />
                        Checkout
                    </SheetTitle>
                </SheetHeader>

                <div className="py-6 space-y-6">
                    {/* Item Summary */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-2">{item.name}</h3>
                        <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                        
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Unit Price:</span>
                            <span className="text-xl font-bold text-brand-orange">
                                {formatPrice(item.price)}
                            </span>
                        </div>
                    </div>

                    {/* Size Selection (for shirts) */}
                    {needsSize && (
                        <div className="space-y-2">
                            <Label className="text-white">Select Size *</Label>
                            <div className="grid grid-cols-5 gap-2">
                                {SIZES.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setSize(s)}
                                        className={`py-3 rounded-lg font-semibold transition-all ${
                                            size === s
                                                ? "bg-brand-orange text-white"
                                                : "bg-white/10 text-white hover:bg-white/20"
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity */}
                    <div className="space-y-2">
                        <Label className="text-white">Quantity</Label>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors text-xl"
                            >
                                -
                            </button>
                            <span className="text-2xl font-bold text-white w-12 text-center">
                                {quantity}
                            </span>
                            <button
                                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                className="w-10 h-10 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors text-xl"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-4 pt-4 border-t border-white/10">
                        <h4 className="text-white font-semibold">Your Information</h4>
                        
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-gray-300">Full Name *</Label>
                            <Input
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="John Doe"
                                className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-300">Email Address *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
                                className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-gray-300">Phone Number *</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+234 812 345 6789"
                                className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                            />
                        </div>
                    </div>

                    {/* Total */}
                    <div className="bg-gradient-to-r from-brand-orange/20 to-brand-blue/20 rounded-xl p-4 border border-brand-orange/30">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300 font-medium">Total Amount:</span>
                            <span className="text-3xl font-black text-white">
                                {formatPrice(totalPrice)}
                            </span>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Pay Button */}
                    <Button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-6 text-lg"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CreditCard className="w-5 h-5 mr-2" />
                                Pay {formatPrice(totalPrice)}
                            </>
                        )}
                    </Button>

                    {/* Security Note */}
                    <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                        <Lock className="w-4 h-4" />
                        <span>Secured by Paystack</span>
                    </div>

                    {/* Pickup Info */}
                    <div className="bg-brand-blue/10 border border-brand-blue/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-brand-blue mt-0.5" />
                            <div>
                                <p className="text-white font-medium">Pickup at Event</p>
                                <p className="text-gray-400 text-sm">
                                    Collect your merchandise at the IAF 2026 merchandise booth on May 30th.
                                    You'll receive a pickup code via email.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
