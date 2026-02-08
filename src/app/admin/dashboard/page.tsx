"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import {
    Ticket,
    Users,
    DollarSign,
    Download,
    QrCode,
    Car,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    XCircle,
    TrendingUp,
    Calendar,
    LogOut,
    BarChart3,
    Home
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SalesData {
    tier: string;
    sold: number;
    revenue: number;
    available: number;
}

interface OrderData {
    id: string;
    ticketId: string;
    customerName: string;
    email: string;
    tier: string;
    groupSize: string;
    amount: number;
    status: string;
    createdAt: string;
    qrCode?: string;
}

interface DashboardStats {
    totalSales: number;
    totalRevenue: number;
    totalAttendees: number;
    parkingPasses: number;
    salesByTier: SalesData[];
    recentOrders: OrderData[];
}

// Mock data for development
const MOCK_STATS: DashboardStats = {
    totalSales: 247,
    totalRevenue: 4850000,
    totalAttendees: 412,
    parkingPasses: 198,
    salesByTier: [
        { tier: "Bronze", sold: 120, revenue: 1080000, available: 380 },
        { tier: "Silver", sold: 65, revenue: 1365000, available: 135 },
        { tier: "Gold", sold: 42, revenue: 1344000, available: 58 },
        { tier: "Diamond", sold: 20, revenue: 1061000, available: 30 },
    ],
    recentOrders: [
        { id: "1", ticketId: "IAF26-GOLD-001", customerName: "Aisha Mohammed", email: "aisha@email.com", tier: "Gold", groupSize: "group2", amount: 60000, status: "COMPLETED", createdAt: "2026-01-31T14:30:00Z" },
        { id: "2", ticketId: "IAF26-SILVER-002", customerName: "Ibrahim Yusuf", email: "ibrahim@email.com", tier: "Silver", groupSize: "single", amount: 21000, status: "COMPLETED", createdAt: "2026-01-31T12:15:00Z" },
        { id: "3", ticketId: "IAF26-DIAMOND-003", customerName: "Fatima Bello", email: "fatima@email.com", tier: "Diamond", groupSize: "group2", amount: 105000, status: "COMPLETED", createdAt: "2026-01-31T10:00:00Z" },
        { id: "4", ticketId: "IAF26-BRONZE-004", customerName: "Chukwudi Okonkwo", email: "chukwudi@email.com", tier: "Bronze", groupSize: "group4", amount: 27000, status: "PENDING", createdAt: "2026-01-30T18:45:00Z" },
        { id: "5", ticketId: "IAF26-SILVER-005", customerName: "Blessing Adeyemi", email: "blessing@email.com", tier: "Silver", groupSize: "group4", amount: 78000, status: "COMPLETED", createdAt: "2026-01-30T16:20:00Z" },
    ]
};

const TIER_COLORS: Record<string, string> = {
    Bronze: "bg-amber-600",
    Silver: "bg-gray-400",
    Gold: "bg-yellow-500",
    Diamond: "bg-cyan-400",
};

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats>(MOCK_STATS);
    const [loading, setLoading] = useState(false);
    const [scanResult, setScanResult] = useState<{ valid: boolean; message: string } | null>(null);
    const [manualCode, setManualCode] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication
    useEffect(() => {
        const auth = sessionStorage.getItem("iaf_admin_auth");
        if (auth !== "true") {
            router.push("/admin");
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    const refreshData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/stats');
            const result = await response.json();

            if (result.success && result.data) {
                setStats(result.data);
            } else {
                setStats(MOCK_STATS);
            }
        } catch (error) {
            console.error("Failed to refresh data:", error);
            setStats(MOCK_STATS);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            refreshData();
        }
    }, [isAuthenticated, refreshData]);

    const handleQRScan = (code: string) => {
        const pattern = /^IAF26-(BRONZE|SILVER|GOLD|DIAMOND)-\d+-[A-Z0-9]+$/;

        if (pattern.test(code)) {
            setScanResult({ valid: true, message: `✅ Valid ticket: ${code}` });
        } else {
            setScanResult({ valid: false, message: `❌ Invalid ticket code` });
        }

        setTimeout(() => setScanResult(null), 3000);
    };

    const exportToExcel = () => {
        const headers = ["Ticket ID", "Customer Name", "Email", "Tier", "Group Size", "Amount", "Status", "Date"];
        const rows = stats.recentOrders.map(order => [
            order.ticketId,
            order.customerName,
            order.email,
            order.tier,
            order.groupSize,
            order.amount,
            order.status,
            new Date(order.createdAt).toLocaleDateString()
        ]);

        const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `IAF2026_Attendees_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleLogout = () => {
        sessionStorage.removeItem("iaf_admin_auth");
        sessionStorage.removeItem("iaf_admin_user");
        router.push("/admin");
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 z-50 hidden lg:block">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <Image
                            src="/iaf_logo.jpeg"
                            alt="IAF 2026"
                            width={50}
                            height={50}
                            className="rounded-xl"
                        />
                        <div>
                            <h1 className="text-white font-bold">IAF 2026</h1>
                            <p className="text-xs text-gray-400">Admin Panel</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 bg-purple-500/20 text-purple-300 rounded-xl">
                            <BarChart3 className="w-5 h-5" />
                            Dashboard
                        </Link>
                        <Link href="/gate" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-xl transition-colors">
                            <QrCode className="w-5 h-5" />
                            Gate Check-In
                        </Link>
                        <Link href="/live" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-xl transition-colors">
                            <Users className="w-5 h-5" />
                            Live Dashboard
                        </Link>
                        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-xl transition-colors">
                            <Home className="w-5 h-5" />
                            View Website
                        </Link>
                    </nav>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                        <p className="text-gray-400 mt-1">Welcome back, Administrator</p>
                    </div>
                    <div className="flex gap-3 mt-4 md:mt-0">
                        <button
                            onClick={refreshData}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <button
                            onClick={exportToExcel}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-xl text-white transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Sales"
                        value={stats.totalSales}
                        icon={<Ticket className="w-6 h-6" />}
                        color="from-orange-500 to-red-500"
                    />
                    <StatCard
                        title="Total Revenue"
                        value={formatCurrency(stats.totalRevenue)}
                        icon={<DollarSign className="w-6 h-6" />}
                        color="from-green-500 to-emerald-500"
                    />
                    <StatCard
                        title="Total Attendees"
                        value={stats.totalAttendees}
                        icon={<Users className="w-6 h-6" />}
                        color="from-blue-500 to-cyan-500"
                    />
                    <StatCard
                        title="Parking Passes"
                        value={stats.parkingPasses}
                        icon={<Car className="w-6 h-6" />}
                        color="from-purple-500 to-pink-500"
                    />
                </div>

                {/* Sales by Tier + QR Scanner */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-orange-400" />
                            Sales by Tier
                        </h2>
                        <div className="space-y-4">
                            {stats.salesByTier.map((tier) => (
                                <div key={tier.tier} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white font-medium">{tier.tier}</span>
                                        <span className="text-gray-400">
                                            {tier.sold} sold • {formatCurrency(tier.revenue)}
                                        </span>
                                    </div>
                                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${TIER_COLORS[tier.tier]} rounded-full transition-all`}
                                            style={{ width: `${(tier.sold / (tier.sold + tier.available)) * 100}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {tier.available} remaining
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <QrCode className="w-5 h-5 text-blue-400" />
                            Quick Verify
                        </h2>

                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={manualCode}
                                    onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                                    placeholder="Enter ticket code..."
                                    className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <button
                                    onClick={() => {
                                        if (manualCode) {
                                            handleQRScan(manualCode);
                                            setManualCode("");
                                        }
                                    }}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-semibold transition-all"
                                >
                                    Verify
                                </button>
                            </div>

                            {scanResult && (
                                <div className={`p-4 rounded-xl flex items-center gap-3 ${scanResult.valid
                                    ? 'bg-green-500/20 border border-green-500/50'
                                    : 'bg-red-500/20 border border-red-500/50'
                                    }`}>
                                    {scanResult.valid ? (
                                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                                    ) : (
                                        <XCircle className="w-6 h-6 text-red-500" />
                                    )}
                                    <span className={scanResult.valid ? 'text-green-400' : 'text-red-400'}>
                                        {scanResult.message}
                                    </span>
                                </div>
                            )}

                            <div className="pt-4 border-t border-white/10">
                                <Link href="/gate" className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition-colors">
                                    <QrCode className="w-5 h-5" />
                                    Open Full Gate Scanner
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-orange-400" />
                        Recent Orders
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Ticket ID</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Customer</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Tier</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Group</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Amount</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-3 px-4">
                                            <code className="text-xs text-blue-400">{order.ticketId}</code>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="text-white text-sm">{order.customerName}</p>
                                                <p className="text-gray-500 text-xs">{order.email}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium text-white ${TIER_COLORS[order.tier]}`}>
                                                {order.tier}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-300 text-sm capitalize">
                                            {order.groupSize.replace('group', 'Group ')}
                                        </td>
                                        <td className="py-3 px-4 text-white text-sm font-medium">
                                            {formatCurrency(order.amount)}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${order.status === 'COMPLETED'
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {order.status === 'COMPLETED' ? (
                                                    <CheckCircle2 className="w-3 h-3" />
                                                ) : (
                                                    <AlertCircle className="w-3 h-3" />
                                                )}
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-400 text-sm">
                                            {new Date(order.createdAt).toLocaleDateString('en-NG', {
                                                day: 'numeric',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile Logout */}
                <div className="lg:hidden mt-8">
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </main>
        </div>
    );
}

function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) {
    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-400 text-sm">{title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
