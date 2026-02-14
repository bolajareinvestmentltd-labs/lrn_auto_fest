"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle2, Home, PartyPopper } from "lucide-react";

interface RegistrationData {
  category: string;
  name: string;
  assignedCategory?: string;
}

export default function RegistrationSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);

  // Get registration data from localStorage
  useEffect(() => {
    const data = localStorage.getItem("registrationSuccess");
    if (data) {
      setRegistrationData(JSON.parse(data));
      localStorage.removeItem("registrationSuccess");
    }
  }, []);

  // Countdown and redirect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      performer: "Performer",
      dragRace: "Drag Race",
      driftChampionship: "Drift Championship",
      guest: "Guest",
    };
    return names[category] || category;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full text-center">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -top-4 -left-4"
            >
              <PartyPopper className="w-8 h-8 text-yellow-400" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute -top-4 -right-4"
            >
              <PartyPopper className="w-8 h-8 text-yellow-400 transform scale-x-[-1]" />
            </motion.div>
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-16 h-16 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Image
            src="/iaf_logo.jpeg"
            alt="Ilorin Car Show Logo"
            width={80}
            height={80}
            className="mx-auto mb-6 object-contain"
          />
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Registration Successful! 🎉
          </h1>
          
          {registrationData && (
            <div className="bg-gray-800/50 rounded-xl p-6 mb-6 border border-gray-700">
              <p className="text-gray-300 mb-2">
                Welcome, <span className="text-white font-semibold">{registrationData.name}</span>!
              </p>
              <p className="text-gray-300">
                You have registered as a{" "}
                <span className="text-brand-orange font-bold">
                  {getCategoryName(registrationData.assignedCategory || registrationData.category)}
                </span>
              </p>
              {registrationData.assignedCategory && 
               registrationData.assignedCategory !== registrationData.category && (
                <p className="text-yellow-400 text-sm mt-2">
                  Note: Your selected category was full, so you&apos;ve been assigned to the Guest category.
                </p>
              )}
            </div>
          )}

          <p className="text-gray-400 mb-2">
            We&apos;ve sent a confirmation email with more details.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            See you at Ilorin Car Show 3.0 - The Ribbon Edition!
          </p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <p className="text-gray-400 text-sm">
            Redirecting to home in{" "}
            <span className="text-brand-orange font-bold text-lg">{countdown}</span>
            {" "}seconds...
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/">
            <Button
              size="lg"
              className="bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-8 py-6 rounded-full"
            >
              <Home className="w-5 h-5 mr-2" />
              Return Back Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
