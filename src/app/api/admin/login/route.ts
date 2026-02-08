import { NextRequest, NextResponse } from "next/server";
import { registerToken, verifyAdminAuth } from "@/lib/admin-auth";

// Admin credentials should be in environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "iaf_admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "IAF2026@admin";

function generateToken(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";
    for (let i = 0; i < 64; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: "Username and password are required" },
                { status: 400 }
            );
        }

        if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        const token = generateToken();
        registerToken(token);

        return NextResponse.json({ token, success: true });
    } catch {
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}

// Verify token endpoint
export async function GET(request: NextRequest) {
    if (!verifyAdminAuth(request)) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true });
}
