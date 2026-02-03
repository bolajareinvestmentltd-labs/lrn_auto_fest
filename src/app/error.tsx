'use client';

export const revalidate = false;

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Page error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* Error Icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>

                {/* Error Message */}
                <h1 className="text-3xl font-bold text-white mb-2">
                    Oops! Something went wrong
                </h1>
                <p className="text-neutral-400 mb-8">
                    We encountered an unexpected error. Don&apos;t worry, our team has been notified.
                </p>

                {/* Error Details (development only) */}
                {process.env.NODE_ENV === 'development' && error.message && (
                    <div className="mb-6 p-4 bg-red-500/10 rounded-lg border border-red-500/20 text-left">
                        <p className="text-red-400 text-sm font-mono break-all">
                            {error.message}
                        </p>
                        {error.digest && (
                            <p className="text-red-400/60 text-xs mt-2">
                                Error ID: {error.digest}
                            </p>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        onClick={reset}
                        className="bg-brand-orange hover:bg-orange-600 text-white font-semibold px-6 py-3"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                    </Button>
                    <Link href="/">
                        <Button
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10 font-semibold px-6 py-3 w-full sm:w-auto"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Go Home
                        </Button>
                    </Link>
                </div>

                {/* Support Link */}
                <p className="mt-8 text-neutral-500 text-sm">
                    Need help?{' '}
                    <Link href="/contact" className="text-brand-blue hover:underline">
                        Contact Support
                    </Link>
                </p>
            </div>
        </div>
    );
}
