"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CheckInReminder() {
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    const lastCheckIn = localStorage.getItem("lastCheckIn");
    const today = new Date().toDateString();
    
    if (lastCheckIn !== today) {
      const timer = setTimeout(() => {
        setShowReminder(true);
      }, 300000); // Show after 5 minutes
      
      return () => clearTimeout(timer);
    }
  }, []);

  if (!showReminder) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-2xl font-bold mb-2">How are you feeling today?</h2>
        <p className="text-gray-600 mb-6">
          Taking a moment to check in can help your mental health
        </p>
        <div className="space-y-3">
          <Link 
            href="/checkin" 
            className="block w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-center"
          >
            Do Check-In Now
          </Link>
          <button 
            className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={() => setShowReminder(false)}
          >
            Remind Me Later
          </button>
        </div>
      </div>
    </div>
  );
} 