"use client";
import { useState, useEffect, useCallback, useSyncExternalStore } from "react";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

interface CountdownTimerProps {
    targetDate: string;
    className?: string;
}

// Client-side subscription for hydration safety
const emptySubscribe = () => () => { };
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function CountdownTimer({ targetDate, className = "" }: CountdownTimerProps) {
    const isClient = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    const calculateTimeLeft = useCallback((): TimeLeft => {
        const difference = new Date(targetDate).getTime() - new Date().getTime();

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }, [targetDate]);

    // Handle countdown timer using interval subscription pattern
    useEffect(() => {
        if (!isClient) return;

        // Use interval for all updates including first render
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Trigger first update immediately via microtask
        Promise.resolve().then(() => {
            setTimeLeft(calculateTimeLeft());
        });

        return () => clearInterval(timer);
    }, [isClient, calculateTimeLeft]);

    // Render placeholder on server (SSR hydration fix)
    if (!isClient) {
        return (
            <div className={`flex gap-3 md:gap-4 justify-center ${className}`}>
                {["Days", "Hours", "Mins", "Secs"].map((label) => (
                    <div key={label} className="flex flex-col items-center">
                        <div className="relative">
                            <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/20 rounded-lg px-3 py-2 md:px-5 md:py-3 min-w-[60px] md:min-w-[80px] backdrop-blur-sm">
                                <span className="text-2xl md:text-4xl font-bold text-white font-mono">--</span>
                            </div>
                        </div>
                        <span className="text-[10px] md:text-xs text-white/60 uppercase tracking-wider mt-2 font-semibold">
                            {label}
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    const timeUnits = [
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Mins", value: timeLeft.minutes },
        { label: "Secs", value: timeLeft.seconds },
    ];

    return (
        <div className={`flex gap-3 md:gap-4 justify-center ${className}`}>
            {timeUnits.map((unit) => (
                <div key={unit.label} className="flex flex-col items-center">
                    <div className="relative">
                        <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/20 rounded-lg px-3 py-2 md:px-5 md:py-3 min-w-[60px] md:min-w-[80px] backdrop-blur-sm">
                            <span className="text-2xl md:text-4xl font-bold text-white font-mono">
                                {String(unit.value).padStart(2, "0")}
                            </span>
                        </div>
                        {/* Glowing effect */}
                        <div className="absolute inset-0 bg-brand-orange/20 rounded-lg blur-xl -z-10" />
                    </div>
                    <span className="text-[10px] md:text-xs text-white/60 uppercase tracking-wider mt-2 font-semibold">
                        {unit.label}
                    </span>
                </div>
            ))}
        </div>
    );
}
