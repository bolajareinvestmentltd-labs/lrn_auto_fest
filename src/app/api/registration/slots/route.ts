import { NextResponse } from "next/server";

// Category slot limits
const CATEGORY_LIMITS = {
    DRIFT_CHAMPIONSHIP: 10,
    DRAG_RACE: 10,
    BEST_BUILD: 10,
};

// Note: Registration is now handled via Google Forms
// This API returns static slot info for display purposes
export async function GET() {
    try {
        // Return slot information
        // Note: Actual registration tracking is via Google Forms
        return NextResponse.json({
            driftChampionship: {
                max: CATEGORY_LIMITS.DRIFT_CHAMPIONSHIP,
                registered: 0, // Update manually or integrate with Google Sheets
            },
            dragRace: {
                max: CATEGORY_LIMITS.DRAG_RACE,
                registered: 0,
            },
            bestBuild: {
                max: CATEGORY_LIMITS.BEST_BUILD,
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
