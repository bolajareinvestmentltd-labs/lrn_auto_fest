"use client";

// ========================================
// COMING SOON DISPLAY
// ========================================
// To re-enable the full vendors page, uncomment the code below
// and remove the ComingSoon import/render

import ComingSoon from "@/components/ComingSoon";

export default function VendorPage() {
  return (
    <ComingSoon
      title="Vendor Booking & Registration"
      description="Join us as a vendor at the Ilorin Automotive Festival 2026! Food, drinks, and lifestyle vendors welcomed."
      releaseDate="April 30, 2026"
    />
  );
}

/* FULL VENDOR PAGE CODE COMMENTED OUT - Restore to re-enable
declare: Will add implementation when payment system is ready
const FullVendorPageCode = `... implementation here ...`;
*/