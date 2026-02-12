"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    Ticket,
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    ArrowLeft,
    Loader2,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface TicketType {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    available: number;
    totalQuantity: number;
    features: string[];
    color: string;
    isActive: boolean;
}

const DEFAULT_COLORS = [
    { name: "Bronze", value: "#CD7F32" },
    { name: "Silver", value: "#C0C0C0" },
    { name: "Gold", value: "#FFD700" },
    { name: "Diamond", value: "#B9F2FF" },
    { name: "Orange", value: "#FF6B00" },
    { name: "Blue", value: "#0066FF" },
];

export default function TicketManagement() {
    const router = useRouter();
    const [tickets, setTickets] = useState<TicketType[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingTicket, setEditingTicket] = useState<TicketType | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [newFeature, setNewFeature] = useState("");

    // Check authentication
    useEffect(() => {
        const auth = sessionStorage.getItem("iaf_admin_auth");
        if (auth !== "true") {
            router.push("/admin");
        }
    }, [router]);

    const fetchTickets = useCallback(async () => {
        try {
            const response = await fetch("/api/admin/tickets");
            const data = await response.json();
            if (data.success) {
                setTickets(data.tickets);
            }
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const handleCreate = () => {
        setIsCreating(true);
        setEditingTicket({
            id: "",
            name: "",
            description: "",
            price: 0,
            originalPrice: 0,
            available: 100,
            totalQuantity: 100,
            features: [],
            color: "#FF6B00",
            isActive: true,
        });
    };

    const handleEdit = (ticket: TicketType) => {
        setIsCreating(false);
        setEditingTicket({ ...ticket });
    };

    const handleSave = async () => {
        if (!editingTicket) return;

        setSaving(true);
        setMessage(null);

        try {
            const url = isCreating ? "/api/admin/tickets" : `/api/admin/tickets/${editingTicket.id}`;
            const method = isCreating ? "POST" : "PUT";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingTicket),
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: "success", text: isCreating ? "Ticket created!" : "Ticket updated!" });
                setEditingTicket(null);
                fetchTickets();
            } else {
                setMessage({ type: "error", text: data.error || "Failed to save" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to save ticket" });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this ticket type?")) return;

        try {
            const response = await fetch(`/api/admin/tickets/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: "success", text: "Ticket deleted!" });
                fetchTickets();
            } else {
                setMessage({ type: "error", text: data.error || "Failed to delete" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to delete ticket" });
        }
    };

    const addFeature = () => {
        if (newFeature.trim() && editingTicket) {
            setEditingTicket({
                ...editingTicket,
                features: [...editingTicket.features, newFeature.trim()],
            });
            setNewFeature("");
        }
    };

    const removeFeature = (index: number) => {
        if (editingTicket) {
            setEditingTicket({
                ...editingTicket,
                features: editingTicket.features.filter((_, i) => i !== index),
            });
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/dashboard"
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                <Ticket className="w-8 h-8 text-orange-500" />
                                Ticket Management
                            </h1>
                            <p className="text-gray-400 mt-1">Create, edit, and manage ticket types</p>
                        </div>
                    </div>
                    <Button
                        onClick={handleCreate}
                        className="bg-orange-600 hover:bg-orange-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Ticket Type
                    </Button>
                </div>

                {/* Message */}
                {message && (
                    <div
                        className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                            message.type === "success"
                                ? "bg-green-500/20 border border-green-500/30 text-green-400"
                                : "bg-red-500/20 border border-red-500/30 text-red-400"
                        }`}
                    >
                        {message.type === "success" ? (
                            <CheckCircle2 className="w-5 h-5" />
                        ) : (
                            <AlertCircle className="w-5 h-5" />
                        )}
                        {message.text}
                    </div>
                )}

                {/* Edit Modal */}
                {editingTicket && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-slate-800 border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">
                                    {isCreating ? "Create New Ticket" : "Edit Ticket"}
                                </h2>
                                <button
                                    onClick={() => setEditingTicket(null)}
                                    className="p-2 hover:bg-white/10 rounded-lg"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="space-y-5">
                                {/* Name */}
                                <div>
                                    <Label className="text-white">Ticket Name *</Label>
                                    <Input
                                        value={editingTicket.name}
                                        onChange={(e) =>
                                            setEditingTicket({ ...editingTicket, name: e.target.value })
                                        }
                                        placeholder="e.g., Gold Pass"
                                        className="mt-1 bg-white/5 border-white/20 text-white"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <Label className="text-white">Description</Label>
                                    <textarea
                                        value={editingTicket.description}
                                        onChange={(e) =>
                                            setEditingTicket({ ...editingTicket, description: e.target.value })
                                        }
                                        placeholder="Premium access with exclusive perks..."
                                        rows={3}
                                        className="mt-1 w-full bg-white/5 border border-white/20 text-white rounded-lg p-3 resize-none"
                                    />
                                </div>

                                {/* Prices */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-white">Current Price (₦) *</Label>
                                        <Input
                                            type="number"
                                            value={editingTicket.price}
                                            onChange={(e) =>
                                                setEditingTicket({
                                                    ...editingTicket,
                                                    price: parseInt(e.target.value) || 0,
                                                })
                                            }
                                            className="mt-1 bg-white/5 border-white/20 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-white">Original Price (₦)</Label>
                                        <Input
                                            type="number"
                                            value={editingTicket.originalPrice}
                                            onChange={(e) =>
                                                setEditingTicket({
                                                    ...editingTicket,
                                                    originalPrice: parseInt(e.target.value) || 0,
                                                })
                                            }
                                            placeholder="For showing discount"
                                            className="mt-1 bg-white/5 border-white/20 text-white"
                                        />
                                    </div>
                                </div>

                                {/* Quantity */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-white">Available Quantity *</Label>
                                        <Input
                                            type="number"
                                            value={editingTicket.available}
                                            onChange={(e) =>
                                                setEditingTicket({
                                                    ...editingTicket,
                                                    available: parseInt(e.target.value) || 0,
                                                })
                                            }
                                            className="mt-1 bg-white/5 border-white/20 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-white">Total Quantity</Label>
                                        <Input
                                            type="number"
                                            value={editingTicket.totalQuantity}
                                            onChange={(e) =>
                                                setEditingTicket({
                                                    ...editingTicket,
                                                    totalQuantity: parseInt(e.target.value) || 0,
                                                })
                                            }
                                            className="mt-1 bg-white/5 border-white/20 text-white"
                                        />
                                    </div>
                                </div>

                                {/* Color */}
                                <div>
                                    <Label className="text-white">Ticket Color</Label>
                                    <div className="flex gap-3 mt-2">
                                        {DEFAULT_COLORS.map((color) => (
                                            <button
                                                key={color.value}
                                                onClick={() =>
                                                    setEditingTicket({ ...editingTicket, color: color.value })
                                                }
                                                className={`w-10 h-10 rounded-lg border-2 transition-all ${
                                                    editingTicket.color === color.value
                                                        ? "border-white scale-110"
                                                        : "border-transparent"
                                                }`}
                                                style={{ backgroundColor: color.value }}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Features */}
                                <div>
                                    <Label className="text-white">Features</Label>
                                    <div className="flex gap-2 mt-2">
                                        <Input
                                            value={newFeature}
                                            onChange={(e) => setNewFeature(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                                            placeholder="Add a feature..."
                                            className="bg-white/5 border-white/20 text-white"
                                        />
                                        <Button onClick={addFeature} variant="outline" className="border-white/20">
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {editingTicket.features.map((feature, i) => (
                                            <span
                                                key={i}
                                                className="flex items-center gap-1 px-3 py-1 bg-white/10 rounded-full text-sm text-white"
                                            >
                                                {feature}
                                                <button
                                                    onClick={() => removeFeature(i)}
                                                    className="ml-1 hover:text-red-400"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Active Toggle */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() =>
                                            setEditingTicket({ ...editingTicket, isActive: !editingTicket.isActive })
                                        }
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            editingTicket.isActive ? "bg-green-500" : "bg-gray-600"
                                        }`}
                                    >
                                        <div
                                            className={`w-5 h-5 bg-white rounded-full transition-transform ${
                                                editingTicket.isActive ? "translate-x-6" : "translate-x-0.5"
                                            }`}
                                        />
                                    </button>
                                    <Label className="text-white">Active (visible to customers)</Label>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        onClick={handleSave}
                                        disabled={saving || !editingTicket.name || !editingTicket.price}
                                        className="flex-1 bg-orange-600 hover:bg-orange-700"
                                    >
                                        {saving ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4 mr-2" />
                                        )}
                                        {isCreating ? "Create Ticket" : "Save Changes"}
                                    </Button>
                                    <Button
                                        onClick={() => setEditingTicket(null)}
                                        variant="outline"
                                        className="border-white/20 text-white hover:bg-white/10"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tickets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                        >
                            {/* Color Bar */}
                            <div className="h-2" style={{ backgroundColor: ticket.color }} />

                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{ticket.name}</h3>
                                        <p className="text-gray-400 text-sm mt-1">{ticket.description}</p>
                                    </div>
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${
                                            ticket.isActive
                                                ? "bg-green-500/20 text-green-400"
                                                : "bg-red-500/20 text-red-400"
                                        }`}
                                    >
                                        {ticket.isActive ? "Active" : "Hidden"}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Price:</span>
                                        <span className="text-white font-semibold">{formatCurrency(ticket.price)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Available:</span>
                                        <span className="text-white">
                                            {ticket.available} / {ticket.totalQuantity}
                                        </span>
                                    </div>
                                </div>

                                {ticket.features.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {ticket.features.slice(0, 3).map((f, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-0.5 bg-white/10 rounded text-xs text-gray-300"
                                            >
                                                {f}
                                            </span>
                                        ))}
                                        {ticket.features.length > 3 && (
                                            <span className="text-xs text-gray-500">
                                                +{ticket.features.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => handleEdit(ticket)}
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 border-white/20 text-white hover:bg-white/10"
                                    >
                                        <Edit2 className="w-4 h-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(ticket.id)}
                                        variant="outline"
                                        size="sm"
                                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {tickets.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <Ticket className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400">No ticket types yet</p>
                            <Button onClick={handleCreate} className="mt-4 bg-orange-600 hover:bg-orange-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Create First Ticket
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
