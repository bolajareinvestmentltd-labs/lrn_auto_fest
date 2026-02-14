import { NextResponse } from "next/server";

// Category slot limits
const CATEGORY_LIMITS = {
    PERFORMER: 15,
    DRAG_RACE: 10,
    DRIFT_CHAMPIONSHIP: 5,
    GUEST: 6,
};

// Note: Registration is now handled via Google Forms
// This API returns static slot info for display purposes
export async function GET() {
    try {
        // Return slot information
        // Note: Actual registration tracking is via Google Forms
        return NextResponse.json({
            performer: {
                max: CATEGORY_LIMITS.PERFORMER,
                registered: 0, // Update manually or integrate with Google Sheets
            },
            dragRace: {
                max: CATEGORY_LIMITS.DRAG_RACE,
                registered: 0,
            },
            driftChampionship: {
                max: CATEGORY_LIMITS.DRIFT_CHAMPIONSHIP,
                registered: 0,
            },
            guest: {
                max: CATEGORY_LIMITS.GUEST,
                registered: 0,
            },
        });
    } catch (error) {
        console.error("Failed to fetch registration slots:", error);
        return NextResponse.json(
            { error: "Failed to fetch registration slots" },
            { status: 500 }
        );
    }
}
