"use client";

import { useState, useEffect, useRef } from 'react';

export const dynamic = 'force-dynamic';

import {
    QrCode,
    CheckCircle2,
    XCircle,
    Camera,
    Keyboard,
    Users,
    Car,
    Ticket,
    Clock,
    AlertTriangle,
    Volume2,
    VolumeX
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TicketInfo {
    ticketCode: string;
    customerName: string;
    email: string;
    tier: string;
    groupSize: string;
    parkingPasses: number;
    scanStatus: 'PENDING' | 'SCANNED' | 'USED';
    scannedAt?: string;
}

interface ScanResult {
    success: boolean;
    message: string;
    ticket?: TicketInfo;
    error?: string;
}

export default function GateCheckInPage() {
    const [manualCode, setManualCode] = useState('');
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
    const [stats, setStats] = useState({ scanned: 0, total: 0, parkingUsed: 0 });
    const [soundEnabled, setSoundEnabled] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sound effects
    const playSound = (type: 'success' | 'error') => {
        if (!soundEnabled) return;
        const audio = new Audio(type === 'success' ? '/sounds/success.mp3' : '/sounds/error.mp3');
        audio.play().catch(() => { }); // Ignore if sound files don't exist
    };

    // Auto-focus input for barcode scanner
    useEffect(() => {
        inputRef.current?.focus();
        const handleKeyDown = () => inputRef.current?.focus();
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Fetch gate stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/gate-stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };
        fetchStats();
        const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const validateTicket = async (code: string) => {
        if (!code.trim()) return;

        setIsProcessing(true);
        setScanResult(null);

        try {
            const response = await fetch('/api/admin/verify-ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketCode: code.trim() })
            });

            const result = await response.json();

            if (result.success) {
                playSound('success');
                setScanResult({
                    success: true,
                    message: '✅ VALID TICKET - ALLOW ENTRY',
                    ticket: result.ticket
                });
            } else {
                playSound('error');
                setScanResult({
                    success: false,
                    message: result.error || '❌ INVALID TICKET',
                    error: result.error
                });
            }

            // Add to history
            setScanHistory(prev => [{
                success: result.success,
                message: result.success ? 'Valid' : result.error,
                ticket: result.ticket
            }, ...prev.slice(0, 9)]);

            // Refresh stats
            const statsRes = await fetch('/api/admin/gate-stats');
            if (statsRes.ok) {
                setStats(await statsRes.json());
            }

        } catch (error) {
            playSound('error');
            setScanResult({
                success: false,
                message: '❌ NETWORK ERROR',
                error: 'Could not connect to server'
            });
        } finally {
            setIsProcessing(false);
            setManualCode('');
            inputRef.current?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        validateTicket(manualCode);
    };

    // Handle barcode scanner input (usually sends Enter after code)
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            validateTicket(manualCode);
        }
    };

    const getTierColor = (tier: string) => {
        switch (tier?.toUpperCase()) {
            case 'VIP_DIAMOND': return 'from-cyan-400 to-blue-500';
            case 'VIP_GOLD': return 'from-yellow-400 to-orange-500';
            case 'VIP_SILVER': return 'from-gray-300 to-gray-500';
            case 'VIP_BRONZE': return 'from-amber-500 to-amber-700';
            default: return 'from-green-400 to-emerald-600';
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Header */}
            <div className="bg-black border-b border-white/10 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <QrCode className="w-8 h-8 text-brand-orange" />
                        <div>
                            <h1 className="text-xl font-bold">Gate Check-In</h1>
                            <p className="text-sm text-neutral-400">IAF 2026 Entry System</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        {/* Sound Toggle */}
                        <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                            title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
                        >
                            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-neutral-500" />}
                        </button>
                        {/* Live Stats */}
                        <div className="flex gap-4 text-sm">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-400">{stats.scanned}</p>
                                <p className="text-neutral-500">Checked In</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-brand-blue">{stats.total}</p>
                                <p className="text-neutral-500">Total Tickets</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-brand-orange">{stats.parkingUsed}</p>
                                <p className="text-neutral-500">Parking Used</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Scanner Section */}
                    <div className="lg:col-span-2">
                        {/* Scan Input */}
                        <div className="bg-black/50 border border-white/10 rounded-2xl p-8 mb-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Keyboard className="w-6 h-6 text-brand-blue" />
                                <h2 className="text-lg font-semibold">Scan or Enter Ticket Code</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="flex gap-4">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={manualCode}
                                    onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Scan QR or type ticket code..."
                                    className="flex-1 px-6 py-4 bg-white/5 border border-white/20 rounded-xl text-xl font-mono tracking-wider focus:outline-none focus:border-brand-orange transition-colors"
                                    autoComplete="off"
                                    autoFocus
                                />
                                <Button
                                    type="submit"
                                    disabled={isProcessing || !manualCode.trim()}
                                    className="px-8 py-4 bg-brand-orange hover:bg-orange-600 text-white font-bold text-lg"
                                >
                                    {isProcessing ? 'Checking...' : 'Verify'}
                                </Button>
                            </form>

                            <p className="mt-4 text-sm text-neutral-500">
                                💡 Use a barcode scanner or type the ticket code manually
                            </p>
                        </div>

                        {/* Scan Result */}
                        {scanResult && (
                            <div className={`rounded-2xl p-8 mb-6 border-2 ${scanResult.success
                                    ? 'bg-green-500/10 border-green-500'
                                    : 'bg-red-500/10 border-red-500'
                                }`}>
                                <div className="flex items-start gap-6">
                                    {scanResult.success ? (
                                        <CheckCircle2 className="w-16 h-16 text-green-400 flex-shrink-0" />
                                    ) : (
                                        <XCircle className="w-16 h-16 text-red-400 flex-shrink-0" />
                                    )}

                                    <div className="flex-1">
                                        <h3 className={`text-2xl font-bold ${scanResult.success ? 'text-green-400' : 'text-red-400'}`}>
                                            {scanResult.message}
                                        </h3>

                                        {scanResult.ticket && (
                                            <div className="mt-4 grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-neutral-400 text-sm">Customer</p>
                                                    <p className="text-white font-semibold text-lg">{scanResult.ticket.customerName}</p>
                                                </div>
                                                <div>
                                                    <p className="text-neutral-400 text-sm">Ticket Tier</p>
                                                    <p className={`font-bold text-lg bg-gradient-to-r ${getTierColor(scanResult.ticket.tier)} bg-clip-text text-transparent`}>
                                                        {scanResult.ticket.tier?.replace('VIP_', '').replace('_', ' ')}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-neutral-400 text-sm">Group Size</p>
                                                    <p className="text-white font-semibold flex items-center gap-2">
                                                        <Users className="w-4 h-4" />
                                                        {scanResult.ticket.groupSize?.replace('_', ' ')}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-neutral-400 text-sm">Parking Passes</p>
                                                    <p className="text-white font-semibold flex items-center gap-2">
                                                        <Car className="w-4 h-4" />
                                                        {scanResult.ticket.parkingPasses} pass(es)
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {scanResult.error && !scanResult.success && (
                                            <p className="mt-2 text-red-300">{scanResult.error}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Instructions */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                Quick Guide
                            </h3>
                            <ul className="space-y-2 text-sm text-neutral-400">
                                <li>✅ <span className="text-green-400">Green = Valid</span> - Allow entry and direct to appropriate area</li>
                                <li>❌ <span className="text-red-400">Red = Invalid</span> - Do not allow entry, escalate to supervisor</li>
                                <li>🎫 VIP tickets should be directed to VIP entrance</li>
                                <li>🚗 Check parking passes and direct to VIP parking if applicable</li>
                                <li>🔄 Each ticket can only be scanned ONCE</li>
                            </ul>
                        </div>
                    </div>

                    {/* Recent Scans */}
                    <div className="bg-black/50 border border-white/10 rounded-2xl p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-brand-blue" />
                            Recent Scans
                        </h2>

                        {scanHistory.length === 0 ? (
                            <p className="text-neutral-500 text-center py-8">No scans yet</p>
                        ) : (
                            <div className="space-y-3">
                                {scanHistory.map((scan, index) => (
                                    <div
                                        key={index}
                                        className={`p-3 rounded-lg border ${scan.success
                                                ? 'bg-green-500/10 border-green-500/30'
                                                : 'bg-red-500/10 border-red-500/30'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {scan.success ? (
                                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                            ) : (
                                                <XCircle className="w-4 h-4 text-red-400" />
                                            )}
                                            <span className="font-medium text-sm">
                                                {scan.ticket?.customerName || 'Unknown'}
                                            </span>
                                        </div>
                                        {scan.ticket && (
                                            <p className="text-xs text-neutral-400 mt-1 ml-6">
                                                {scan.ticket.tier?.replace('VIP_', '')} • {scan.ticket.groupSize}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
