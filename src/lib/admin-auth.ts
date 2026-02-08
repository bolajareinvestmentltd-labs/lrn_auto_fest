import { NextRequest, NextResponse } from "next/server";

// Simple admin authentication check
// In production, replace with proper JWT verification
const activeTokens = new Set<string>();

export function registerToken(token: string): void {
    activeTokens.add(token);
    // Auto-expire after 24 hours
    setTimeout(() => activeTokens.delete(token), 24 * 60 * 60 * 1000);
}

export function verifyAdminAuth(request: NextRequest): boolean {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return false;

    const token = authHeader.replace("Bearer ", "");
    return activeTokens.has(token);
}

export function unauthorizedResponse(): NextResponse {
    return NextResponse.json(
        { error: "Unauthorized. Please login to access this resource." },
        { status: 401 }
    );
}
