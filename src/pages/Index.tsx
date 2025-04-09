import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Landing from "@/components/Landing";

const Index = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/tools/job-application-tracker/dashboard");
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10">
        <Header />
        <Landing onStart={handleStart} />
      </div>
    </div>
  );
};

export default Index;
