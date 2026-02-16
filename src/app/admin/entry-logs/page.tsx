"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Loader2,
    RefreshCw,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Clock,
    Users,
    Store,
    Filter,
    Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EntryLog {
    id: string;
    ticketId: string;
    accessType: "ATTENDEE" | "VENDOR";
    ticketType: string;
    paymentMethod: string;
    entryTime: string;
    entryStatus: "SUCCESS" | "BLOCKED" | "ALREADY_USED" | "INVALID";
    entryGate: string | null;
    blockedReason: string | null;
}

interface Stats {
    total: number;
    success: number;
    blocked: number;
    alreadyUsed: number;
    invalid: number;
    attendees: number;
    vendors: number;
    cashEntries: number;
    onlineEntries: number;
}

export default function EntryLogsPage() {
    const router = useRouter();
    const [logs, setLogs] = useState<EntryLog[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "success" | "failed">("all");

    // Check authentication
    useEffect(() => {
        const auth = sessionStorage.getItem("iaf_admin_auth");
        if (auth !== "true") {
            router.push("/admin");
        }
    }, [router]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/entry-logs?filter=${filter}`);
            if (response.ok) {
                const data = await response.json();
                setLogs(data.logs || []);
                setStats(data.stats || null);
            }
        } catch (error) {
            console.error("Failed to fetch entry logs:", error);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchData();
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const exportLogs = () => {
        const headers = ["Ticket ID", "Access Type", "Ticket Type", "Payment Method", "Entry Time", "Status", "Gate", "Reason"];
        const rows = logs.map(log => [
            log.ticketId,
            log.accessType,
            log.ticketType,
            log.paymentMethod,
            new Date(log.entryTime).toLocaleString(),
            log.entryStatus,
            log.entryGate || "N/A",
            log.blockedReason || ""
        ]);

        const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `IAF2026_Entry_Logs_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "SUCCESS": return "bg-green-500/20 text-green-400 border-green-500/30";
            case "BLOCKED": return "bg-red-500/20 text-red-400 border-red-500/30";
            case "ALREADY_USED": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
            case "INVALID": return "bg-red-500/20 text-red-400 border-red-500/30";
            default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "SUCCESS": return <CheckCircle2 className="w-4 h-4" />;
            case "BLOCKED": return <XCircle className="w-4 h-4" />;
            case "ALREADY_USED": return <AlertTriangle className="w-4 h-4" />;
            case "INVALID": return <XCircle className="w-4 h-4" />;
            default: return null;
        }
    };

    if (loading && !logs.length) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/dashboard"
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Clock className="w-6 h-6 text-blue-400" />
                                Entry Logs
                            </h1>
                            <p className="text-sm text-gray-400">Real-time access logging</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={fetchData}
                            variant="outline"
                            size="sm"
                            className="border-white/20 text-white hover:bg-white/10"
                            disabled={loading}
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                        <Button
                            onClick={exportLogs}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-xs text-gray-400">Total Entries</p>
                            <p className="text-2xl font-bold text-white">{stats.total}</p>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                            <p className="text-xs text-green-400">Successful</p>
                            <p className="text-2xl font-bold text-green-400">{stats.success}</p>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                            <p className="text-xs text-red-400">Blocked/Invalid</p>
                            <p className="text-2xl font-bold text-red-400">{stats.blocked + stats.invalid}</p>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                            <p className="text-xs text-blue-400">Attendees</p>
                            <p className="text-2xl font-bold text-blue-400">{stats.attendees}</p>
                        </div>
                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                            <p className="text-xs text-purple-400">Vendors</p>
                            <p className="text-2xl font-bold text-purple-400">{stats.vendors}</p>
                        </div>
                    </div>
                )}

                {/* Filter */}
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        id="entryFilter"
                        aria-label="Filter entries"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as typeof filter)}
                        className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm"
                    >
                        <option value="all">All Entries</option>
                        <option value="success">Successful Only</option>
                        <option value="failed">Failed Only</option>
                    </select>
                </div>

                {/* Logs Table */}
                <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Time</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Ticket ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Access</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Payment</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Reason</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                            No entry logs found
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-white/5">
                                            <td className="px-4 py-3 text-sm text-gray-300">
                                                {new Date(log.entryTime).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-mono text-white">
                                                {log.ticketId}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-300">
                                                {log.ticketType.replace("VIP_", "").replace("_", " ")}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="flex items-center gap-1.5 text-sm text-gray-300">
                                                    {log.accessType === "VENDOR" ? (
                                                        <Store className="w-3.5 h-3.5 text-purple-400" />
                                                    ) : (
                                                        <Users className="w-3.5 h-3.5 text-blue-400" />
                                                    )}
                                                    {log.accessType}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-300">
                                                <span className={log.paymentMethod === "CASH" ? "text-green-400" : "text-blue-400"}>
                                                    {log.paymentMethod}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(log.entryStatus)}`}>
                                                    {getStatusIcon(log.entryStatus)}
                                                    {log.entryStatus.replace("_", " ")}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {log.blockedReason || "-"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
