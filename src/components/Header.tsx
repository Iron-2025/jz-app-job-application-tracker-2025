
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const isDashboard = location.pathname.includes("/dashboard");

  return (
    <header className="mb-8 flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold text-primary">TrackMyJobs</h1>
        <p className="text-muted-foreground">Keep track of your job applications in one place</p>
      </div>
      
      {isDashboard && (
        <Link to="/tools/job-application-tracker/">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Home className="h-4 w-4" />
            Home
          </Button>
        </Link>
      )}
    </header>
  );
};

export default Header;
