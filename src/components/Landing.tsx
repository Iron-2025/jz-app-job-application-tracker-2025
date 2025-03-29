
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ClipboardCheck, LineChart, Bell } from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 sm:text-5xl">
          Track Your Job Applications
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
          Never lose track of your job search progress again. Stay organized, set reminders,
          and improve your chances of landing that dream job.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mt-8">
        <div className="rounded-lg p-6 shadow-md border bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-all duration-300">
          <ClipboardCheck className="h-10 w-10 text-primary mb-4" />
          <h3 className="text-lg font-medium mb-2">Stay Organized</h3>
          <p className="text-muted-foreground">
            Keep all your applications in one place with status updates and important dates.
          </p>
        </div>

        <div className="rounded-lg p-6 shadow-md border bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-all duration-300">
          <Bell className="h-10 w-10 text-primary mb-4" />
          <h3 className="text-lg font-medium mb-2">Set Reminders</h3>
          <p className="text-muted-foreground">
            Set follow-up reminders so you never miss an opportunity to check in with employers.
          </p>
        </div>

        <div className="rounded-lg p-6 shadow-md border bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-all duration-300">
          <LineChart className="h-10 w-10 text-primary mb-4" />
          <h3 className="text-lg font-medium mb-2">Track Progress</h3>
          <p className="text-muted-foreground">
            Visualize your job search journey and identify which strategies are working best.
          </p>
        </div>
      </div>

      <Button 
        size="lg" 
        onClick={onStart} 
        className="mt-8 font-medium bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 transition-all shadow-md"
      >
        Get Started <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default Landing;
