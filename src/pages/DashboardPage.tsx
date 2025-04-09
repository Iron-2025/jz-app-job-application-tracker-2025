import React from "react";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";

const DashboardPage = () => {
  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10">
        <Header />
        <Dashboard />
      </div>
    </div>
  );
};

export default DashboardPage;
