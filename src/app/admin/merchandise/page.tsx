"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    ShoppingBag,
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    ArrowLeft,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Package,
    Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";

interface MerchItem {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    stock: number;
    isActive: boolean;
    type: "CAP" | "SHORT_SLEEVE" | "LONG_SLEEVE" | "OTHER";
}

interface MerchOrder {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    itemName: string;
    size: string | null;
    quantity: number;
    totalAmount: number;
    status: string;
    createdAt: string;
}

const MERCH_TYPES = [
    { value: "CAP", label: "Cap" },
    { value: "SHORT_SLEEVE", label: "Short Sleeve T-Shirt" },
    { value: "LONG_SLEEVE", label: "Long Sleeve T-Shirt" },
    { value: "OTHER", label: "Other" },
];

export default function MerchandiseManagement() {
    const router = useRouter();
    const [items, setItems] = useState<MerchItem[]>([]);
    const [orders, setOrders] = useState<MerchOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingItem, setEditingItem] = useState<MerchItem | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [activeTab, setActiveTab] = useState<"items" | "orders">("items");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Check authentication
    useEffect(() => {
        const auth = sessionStorage.getItem("iaf_admin_auth");
        if (auth !== "true") {
            router.push("/admin");
        }
    }, [router]);

    const fetchData = useCallback(async () => {
        try {
            const [itemsRes, ordersRes] = await Promise.all([
                fetch("/api/admin/merchandise"),
                fetch("/api/admin/merchandise/orders"),
            ]);

            const itemsData = await itemsRes.json();
            const ordersData = await ordersRes.json();

            if (itemsData.success) setItems(itemsData.items);
            if (ordersData.success) setOrders(ordersData.orders);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCreate = () => {
        setIsCreating(true);
        setEditingItem({
            id: "",
            name: "",
            description: "",
            price: 0,
            imageUrl: "/images/merch/placeholder.jpg",
            stock: 100,
            isActive: true,
            type: "OTHER",
        });
    };

    const handleEdit = (item: MerchItem) => {
        setIsCreating(false);
        setEditingItem({ ...item });
    };

    const handleSave = async () => {
        if (!editingItem) return;

        setSaving(true);
        setMessage(null);

        try {
            const url = isCreating ? "/api/admin/merchandise" : `/api/admin/merchandise/${editingItem.id}`;
            const method = isCreating ? "POST" : "PUT";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingItem),
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: "success", text: isCreating ? "Item created!" : "Item updated!" });
                setEditingItem(null);
                fetchData();
            } else {
                setMessage({ type: "error", text: data.error || "Failed to save" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to save item" });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this merchandise item?")) return;

        try {
            const response = await fetch(`/api/admin/merchandise/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: "success", text: "Item deleted!" });
                fetchData();
            } else {
                setMessage({ type: "error", text: data.error || "Failed to delete" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to delete item" });
        }
    };

    const handleMarkPickedUp = async (orderId: string) => {
        try {
            const response = await fetch(`/api/admin/merchandise/orders/${orderId}/pickup`, {
                method: "POST",
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: "success", text: "Marked as picked up!" });
                fetchData();
            } else {
                setMessage({ type: "error", text: data.error || "Failed to update" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to update order" });
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
                                <ShoppingBag className="w-8 h-8 text-purple-500" />
                                Merchandise
                            </h1>
                            <p className="text-gray-400 mt-1">Manage products and orders</p>
                        </div>
                    </div>
                    {activeTab === "items" && (
                        <Button onClick={handleCreate} className="bg-purple-600 hover:bg-purple-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Item
                        </Button>
                    )}
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
                        {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {message.text}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab("items")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            activeTab === "items"
                                ? "bg-purple-600 text-white"
                                : "bg-white/10 text-gray-400 hover:bg-white/20"
                        }`}
                    >
                        <Package className="w-4 h-4 inline mr-2" />
                        Products ({items.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            activeTab === "orders"
                                ? "bg-purple-600 text-white"
                                : "bg-white/10 text-gray-400 hover:bg-white/20"
                        }`}
                    >
                        <ShoppingBag className="w-4 h-4 inline mr-2" />
                        Orders ({orders.length})
                    </button>
                </div>

                {/* Edit Modal */}
                {editingItem && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-slate-800 border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">
                                    {isCreating ? "Add New Item" : "Edit Item"}
                                </h2>
                                <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-white/10 rounded-lg">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <Label className="text-white">Name *</Label>
                                    <Input
                                        value={editingItem.name}
                                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                        placeholder="IAF 2026 Cap"
                                        className="mt-1 bg-white/5 border-white/20 text-white"
                                    />
                                </div>

                                <div>
                                    <Label className="text-white">Type</Label>
                                    <select
                                        value={editingItem.type}
                                        onChange={(e) =>
                                            setEditingItem({ ...editingItem, type: e.target.value as MerchItem["type"] })
                                        }
                                        className="mt-1 w-full bg-white/5 border border-white/20 text-white rounded-lg px-4 py-2"
                                    >
                                        {MERCH_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <Label className="text-white">Description</Label>
                                    <textarea
                                        value={editingItem.description}
                                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                                        placeholder="Premium quality cap..."
                                        rows={3}
                                        className="mt-1 w-full bg-white/5 border border-white/20 text-white rounded-lg p-3 resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-white">Price (₦) *</Label>
                                        <Input
                                            type="number"
                                            value={editingItem.price}
                                            onChange={(e) =>
                                                setEditingItem({ ...editingItem, price: parseInt(e.target.value) || 0 })
                                            }
                                            className="mt-1 bg-white/5 border-white/20 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-white">Stock</Label>
                                        <Input
                                            type="number"
                                            value={editingItem.stock}
                                            onChange={(e) =>
                                                setEditingItem({ ...editingItem, stock: parseInt(e.target.value) || 0 })
                                            }
                                            className="mt-1 bg-white/5 border-white/20 text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-white">Image URL</Label>
                                    <Input
                                        value={editingItem.imageUrl}
                                        onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                                        placeholder="/images/merch/cap.jpg"
                                        className="mt-1 bg-white/5 border-white/20 text-white"
                                    />
                                    {editingItem.imageUrl && (
                                        <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden bg-white/10">
                                            <Image
                                                src={editingItem.imageUrl}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = "/images/merch/placeholder.jpg";
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setEditingItem({ ...editingItem, isActive: !editingItem.isActive })}
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            editingItem.isActive ? "bg-green-500" : "bg-gray-600"
                                        }`}
                                    >
                                        <div
                                            className={`w-5 h-5 bg-white rounded-full transition-transform ${
                                                editingItem.isActive ? "translate-x-6" : "translate-x-0.5"
                                            }`}
                                        />
                                    </button>
                                    <Label className="text-white">Active (visible to customers)</Label>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        onClick={handleSave}
                                        disabled={saving || !editingItem.name || !editingItem.price}
                                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                                    >
                                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                        {isCreating ? "Create Item" : "Save Changes"}
                                    </Button>
                                    <Button
                                        onClick={() => setEditingItem(null)}
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

                {/* Items Grid */}
                {activeTab === "items" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                                <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900">
                                    <Image
                                        src={item.imageUrl || "/images/merch/placeholder.jpg"}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = "/images/merch/placeholder.jpg";
                                        }}
                                    />
                                    <span
                                        className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-medium ${
                                            item.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                                        }`}
                                    >
                                        {item.isActive ? "Active" : "Hidden"}
                                    </span>
                                </div>

                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-white">{item.name}</h3>
                                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">{item.description}</p>

                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-2xl font-bold text-purple-400">{formatCurrency(item.price)}</span>
                                        <span className="text-sm text-gray-500">Stock: {item.stock}</span>
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                        <Button
                                            onClick={() => handleEdit(item)}
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 border-white/20 text-white hover:bg-white/10"
                                        >
                                            <Edit2 className="w-4 h-4 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(item.id)}
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

                        {items.length === 0 && (
                            <div className="col-span-full text-center py-12">
                                <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-400">No merchandise items yet</p>
                                <Button onClick={handleCreate} className="mt-4 bg-purple-600 hover:bg-purple-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add First Item
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Orders Table */}
                {activeTab === "orders" && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Order #</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Customer</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Item</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-white/5">
                                            <td className="px-4 py-4 text-sm text-white font-mono">{order.orderNumber}</td>
                                            <td className="px-4 py-4">
                                                <p className="text-sm text-white">{order.customerName}</p>
                                                <p className="text-xs text-gray-500">{order.customerEmail}</p>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-white">
                                                {order.itemName}
                                                {order.size && ` (${order.size})`} x{order.quantity}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-white font-semibold">
                                                {formatCurrency(order.totalAmount)}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        order.status === "PICKED_UP"
                                                            ? "bg-green-500/20 text-green-400"
                                                            : order.status === "PAID"
                                                            ? "bg-blue-500/20 text-blue-400"
                                                            : "bg-yellow-500/20 text-yellow-400"
                                                    }`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                {order.status === "PAID" && (
                                                    <Button
                                                        onClick={() => handleMarkPickedUp(order.id)}
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4 mr-1" />
                                                        Mark Picked Up
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {orders.length === 0 && (
                            <div className="text-center py-12">
                                <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-400">No merchandise orders yet</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
