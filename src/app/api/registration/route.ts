import { NextRequest, NextResponse } from "next/server";

// Map frontend category IDs to enum values
const CATEGORY_MAP: Record<string, string> = {
    performer: "PERFORMER",
    dragRace: "DRAG_RACE",
    driftChampionship: "DRIFT_CHAMPIONSHIP",
    guest: "GUEST",
};

// Generate a unique registration code
function generateRegistrationCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "ICS30-";
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Note: Registration is now handled via Google Forms
// This API is kept for future use if needed
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            fullName,
            email,
            phone,
            category,
        } = body;

        // Validate required fields
        if (!fullName || !email || !phone || !category) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Map category to enum value
        const categoryEnum = CATEGORY_MAP[category];
        if (!categoryEnum) {
            return NextResponse.json(
                { error: "Invalid category" },
                { status: 400 }
            );
        }

        // Generate registration code
        const registrationCode = generateRegistrationCode();

        // Return success response
        // Note: Actual registration is via Google Forms
        return NextResponse.json({
            success: true,
            registrationCode: registrationCode,
            category: category,
            assignedCategory: category,
            message: "Please complete your registration via Google Forms",
        });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Failed to process registration" },
            { status: 500 }
        );
    }
}
