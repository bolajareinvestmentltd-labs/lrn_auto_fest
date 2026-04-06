"use client";

import EmailBulkSender from "@/components/EmailBulkSender";
import { useEffect, useState } from "react";

export default function EmailCampaignPage() {
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    // Add auth check here if needed
    // const checkAuth = async () => {
    //   const res = await fetch('/api/admin/check-auth');
    //   setIsAuthorized(res.ok);
    // };
    // checkAuth();
  }, []);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h1>
          <p className="text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <EmailBulkSender />;
}
