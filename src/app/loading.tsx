import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
            <div className="text-center">
                {/* Animated Logo/Loader */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                    {/* Outer ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-brand-orange/20 animate-pulse" />
                    {/* Spinning ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-orange animate-spin" />
                    {/* Inner content */}
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-brand-blue/20 to-brand-orange/20 flex items-center justify-center">
                        <span className="text-2xl font-black text-white">IAF</span>
                    </div>
                </div>

                {/* Loading Text */}
                <div className="flex items-center justify-center gap-2 text-white">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-lg">Loading...</span>
                </div>

                {/* Animated dots */}
                <div className="flex justify-center gap-1 mt-4">
                    <span
                        className="w-2 h-2 bg-brand-orange rounded-full animate-bounce"
                        style={{ animationDelay: '0s' }}
                    />
                    <span
                        className="w-2 h-2 bg-brand-blue rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                    />
                    <span
                        className="w-2 h-2 bg-brand-orange rounded-full animate-bounce"
                        style={{ animationDelay: '0.4s' }}
                    />
                </div>
            </div>
        </div>
    );
}
