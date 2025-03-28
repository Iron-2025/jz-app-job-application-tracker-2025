
import React, { useState } from "react";
import Header from "@/components/Header";
import Landing from "@/components/Landing";
import Dashboard from "@/components/Dashboard";
import { Toaster } from "@/components/ui/sonner";

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  const handleStart = () => {
    setShowDashboard(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen pb-16">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10">
        <Header />
        
        {showDashboard ? (
          <Dashboard />
        ) : (
          <Landing onStart={handleStart} />
        )}
      </div>
    </div>
  );
};

export default Index;
