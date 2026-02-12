"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    ShoppingCart,
    Search,
    ArrowLeft,
    Loader2,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Eye,
    RefreshCcw,
    Mail,
    Download,
    Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    ticketType: string;
    quantity: number;
    totalAmount: number;
    status: "PENDING" | "PAID" | "CANCELLED" | "REFUNDED";
    paymentReference: string;
    createdAt: string;
    isUsed: boolean;
    usedAt: string | null;
}

const STATUS_COLORS = {
    PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    PAID: "bg-green-500/20 text-green-400 border-green-500/30",
    CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
    REFUNDED: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export default function OrderManagement() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Check authentication
    useEffect(() => {
        const auth = sessionStorage.getItem("iaf_admin_auth");
        if (auth !== "true") {
            router.push("/admin");
        }
    }, [router]);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/admin/orders");
            const data = await response.json();
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleRefund = async (orderId: string) => {
        if (!confirm("Are you sure you want to refund this order? This action cannot be undone.")) return;

        setActionLoading(true);
        try {
            const response = await fetch(`/api/admin/orders/${orderId}/refund`, {
                method: "POST",
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: "success", text: "Order refunded successfully!" });
                fetchOrders();
                setSelectedOrder(null);
            } else {
                setMessage({ type: "error", text: data.error || "Failed to refund" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to process refund" });
        } finally {
            setActionLoading(false);
        }
    };

    const handleResendEmail = async (orderId: string) => {
        setActionLoading(true);
        try {
            const response = await fetch(`/api/admin/orders/${orderId}/resend-email`, {
                method: "POST",
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: "success", text: "Confirmation email sent!" });
            } else {
                setMessage({ type: "error", text: data.error || "Failed to send email" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to send email" });
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancelOrder = async (orderId: string) => {
        if (!confirm("Are you sure you want to cancel this order?")) return;

        setActionLoading(true);
        try {
            const response = await fetch(`/api/admin/orders/${orderId}/cancel`, {
                method: "POST",
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: "success", text: "Order cancelled!" });
                fetchOrders();
                setSelectedOrder(null);
            } else {
                setMessage({ type: "error", text: data.error || "Failed to cancel" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to cancel order" });
        } finally {
            setActionLoading(false);
        }
    };

    const exportOrders = () => {
        const headers = ["Order #", "Customer", "Email", "Phone", "Ticket", "Qty", "Amount", "Status", "Date"];
        const rows = filteredOrders.map((o) => [
            o.orderNumber,
            o.customerName,
            o.customerEmail,
            o.customerPhone,
            o.ticketType,
            o.quantity,
            o.totalAmount,
            o.status,
            new Date(o.createdAt).toLocaleDateString(),
        ]);

        const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `IAF2026_Orders_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
    };

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

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
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/dashboard"
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                <ShoppingCart className="w-8 h-8 text-green-500" />
                                Order Management
                            </h1>
                            <p className="text-gray-400 mt-1">View, manage, and refund orders</p>
                        </div>
                    </div>
                    <Button onClick={exportOrders} className="bg-green-600 hover:bg-green-700">
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
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
                        <button onClick={() => setMessage(null)} className="ml-auto">
                            <XCircle className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by order #, name, or email..."
                            className="pl-10 bg-white/5 border-white/20 text-white"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-white/5 border border-white/20 text-white rounded-lg px-4 py-2"
                        >
                            <option value="all">All Status</option>
                            <option value="PAID">Paid</option>
                            <option value="PENDING">Pending</option>
                            <option value="REFUNDED">Refunded</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-gray-400 text-sm">Total Orders</p>
                        <p className="text-2xl font-bold text-white">{orders.length}</p>
                    </div>
                    <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                        <p className="text-green-400 text-sm">Paid</p>
                        <p className="text-2xl font-bold text-white">
                            {orders.filter((o) => o.status === "PAID").length}
                        </p>
                    </div>
                    <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                        <p className="text-yellow-400 text-sm">Pending</p>
                        <p className="text-2xl font-bold text-white">
                            {orders.filter((o) => o.status === "PENDING").length}
                        </p>
                    </div>
                    <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                        <p className="text-purple-400 text-sm">Refunded</p>
                        <p className="text-2xl font-bold text-white">
                            {orders.filter((o) => o.status === "REFUNDED").length}
                        </p>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                                        Order #
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                                        Customer
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                                        Ticket
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                                        Amount
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-white/5">
                                        <td className="px-4 py-4 text-sm text-white font-mono">
                                            {order.orderNumber}
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="text-sm text-white">{order.customerName}</p>
                                            <p className="text-xs text-gray-500">{order.customerEmail}</p>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-white">
                                            {order.ticketType} x{order.quantity}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-white font-semibold">
                                            {formatCurrency(order.totalAmount)}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                                    STATUS_COLORS[order.status]
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-4">
                                            <Button
                                                onClick={() => setSelectedOrder(order)}
                                                variant="ghost"
                                                size="sm"
                                                className="text-white hover:bg-white/10"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-12">
                            <ShoppingCart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400">No orders found</p>
                        </div>
                    )}
                </div>

                {/* Order Detail Modal */}
                {selectedOrder && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-slate-800 border border-white/10 rounded-2xl p-6 w-full max-w-lg">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">Order Details</h2>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-2 hover:bg-white/10 rounded-lg"
                                >
                                    <XCircle className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-white/5 rounded-xl p-4 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Order #</span>
                                        <span className="text-white font-mono">{selectedOrder.orderNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Status</span>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                                STATUS_COLORS[selectedOrder.status]
                                            }`}
                                        >
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Customer</span>
                                        <span className="text-white">{selectedOrder.customerName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Email</span>
                                        <span className="text-white">{selectedOrder.customerEmail}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Phone</span>
                                        <span className="text-white">{selectedOrder.customerPhone}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Ticket</span>
                                        <span className="text-white">
                                            {selectedOrder.ticketType} x{selectedOrder.quantity}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Amount</span>
                                        <span className="text-white font-bold">
                                            {formatCurrency(selectedOrder.totalAmount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Date</span>
                                        <span className="text-white">
                                            {new Date(selectedOrder.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    {selectedOrder.isUsed && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Checked In</span>
                                            <span className="text-green-400">
                                                {selectedOrder.usedAt
                                                    ? new Date(selectedOrder.usedAt).toLocaleString()
                                                    : "Yes"}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    {selectedOrder.status === "PAID" && (
                                        <>
                                            <Button
                                                onClick={() => handleResendEmail(selectedOrder.id)}
                                                disabled={actionLoading}
                                                variant="outline"
                                                className="border-white/20 text-white hover:bg-white/10"
                                            >
                                                <Mail className="w-4 h-4 mr-2" />
                                                Resend Confirmation Email
                                            </Button>
                                            <Button
                                                onClick={() => handleRefund(selectedOrder.id)}
                                                disabled={actionLoading}
                                                className="bg-purple-600 hover:bg-purple-700"
                                            >
                                                {actionLoading ? (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <RefreshCcw className="w-4 h-4 mr-2" />
                                                )}
                                                Process Refund
                                            </Button>
                                        </>
                                    )}
                                    {selectedOrder.status === "PENDING" && (
                                        <Button
                                            onClick={() => handleCancelOrder(selectedOrder.id)}
                                            disabled={actionLoading}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Cancel Order
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
