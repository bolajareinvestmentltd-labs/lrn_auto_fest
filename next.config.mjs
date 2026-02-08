import path from 'path';
import { fileURLToPath } from 'url';
import { realpathSync } from 'fs';

// Fix for Windows path casing mismatch: VS Code may open LRN_AUTO_FESTIVAL (uppercase)
// but filesystem is lrn_auto_festival (lowercase). This causes webpack to create
// duplicate React module entries.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the REAL filesystem path (with correct casing) using realpathSync
let REAL_ROOT;
try {
    REAL_ROOT = realpathSync.native(__dirname);
} catch {
    REAL_ROOT = __dirname;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    reactStrictMode: false,

    webpack: (config, { isServer, webpack }) => {
        const nodeModulesPath = path.join(REAL_ROOT, 'node_modules');

        // Set context to the real path
        config.context = REAL_ROOT;

        // Configure snapshot
        config.snapshot = {
            ...(config.snapshot || {}),
            managedPaths: [nodeModulesPath],
        };

        // CLIENT-SIDE ONLY: Alias React to Next.js's compiled React
        // This ensures client uses the SAME React as server (Next.js internal)
        if (!isServer) {
            const nextPath = path.join(nodeModulesPath, 'next');
            const nextReactPath = path.join(nextPath, 'dist', 'compiled', 'react');
            const nextReactDomPath = path.join(nextPath, 'dist', 'compiled', 'react-dom');
            const nextSchedulerPath = path.join(nextPath, 'dist', 'compiled', 'scheduler');

            config.resolve.alias = {
                ...config.resolve.alias,
                'react': nextReactPath,
                'react-dom': nextReactDomPath,
                'react/jsx-runtime': path.join(nextReactPath, 'jsx-runtime'),
                'react/jsx-dev-runtime': path.join(nextReactPath, 'jsx-dev-runtime'),
                'react-dom/client': path.join(nextReactDomPath, 'client'),
                'scheduler': nextSchedulerPath,
            };
        }

        // Module resolution
        config.resolve.modules = [
            nodeModulesPath,
            'node_modules',
        ];

        config.resolve.symlinks = false;
        config.resolve.cacheWithContext = true;

        // Also fix the resolver
        config.resolveLoader = {
            ...config.resolveLoader,
            modules: [nodeModulesPath, 'node_modules'],
        };

        return config;
    },
};

export default nextConfig;

