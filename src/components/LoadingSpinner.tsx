"use client";
import Image from "next/image";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[999]">
      <div className="flex flex-col items-center gap-6">
        {/* Logo Spinner */}
        <div className="relative w-24 h-24">
          <Image
            src="/iaf_logo.jpeg"
            alt="Loading"
            width={96}
            height={96}
            className="animate-spin object-contain"
          />
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h3 className="text-white font-heading text-lg mb-2">Loading Festival</h3>
          <div className="flex items-center justify-center gap-1">
            <span className="w-2 h-2 bg-brand-orange rounded-full animate-bounce" style={{ animationDelay: "0s" }}></span>
            <span className="w-2 h-2 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
            <span className="w-2 h-2 bg-brand-orange rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
          </div>
        </div>
      </div>
    </div>
  );
}
