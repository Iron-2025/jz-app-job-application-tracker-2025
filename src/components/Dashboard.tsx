
import React, { useState, useEffect } from "react";
import { JobApplication } from "@/types/job";
import JobApplicationForm from "./JobApplicationForm";
import JobApplicationList from "./JobApplicationList";
import { saveApplications, getApplications } from "@/services/localStorage";
import { toast } from "@/components/ui/sonner";
import { parseISO, isBefore, addDays, format } from "date-fns";
import { BellRing, AlertCircle } from "lucide-react";

const Dashboard: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);

  useEffect(() => {
    const savedApplications = getApplications();
    setApplications(savedApplications);
    
    // Check for follow-up reminders when component mounts
    checkFollowUpReminders(savedApplications);
  }, []);

  // Function to check follow-up dates and display toast notifications
  const checkFollowUpReminders = (apps: JobApplication[]) => {
    const today = new Date();
    
    apps.forEach(app => {
      if (app.followUpDate) {
        const followUpDate = parseISO(app.followUpDate);
        
        // Check if follow-up date is in the past (overdue)
        if (isBefore(followUpDate, today)) {
          toast.error(`Overdue follow-up for ${app.companyName}`, {
            description: `You were supposed to follow up on ${format(followUpDate, "MMM d, yyyy")}`,
            icon: <AlertCircle className="h-4 w-4" />,
            duration: 5000
          });
        } 
        // Check if follow-up date is within the next 3 days
        else if (isBefore(followUpDate, addDays(today, 3))) {
          toast(`Follow-up soon for ${app.companyName}`, {
            description: `Follow-up date is on ${format(followUpDate, "MMM d, yyyy")}`,
            icon: <BellRing className="h-4 w-4" />,
            duration: 5000
          });
        }
      }
    });
  };

  const handleAddApplication = (application: JobApplication) => {
    const updatedApplications = [...applications, application];
    setApplications(updatedApplications);
    saveApplications(updatedApplications);
    toast.success("Application added successfully");
  };

  const handleUpdateApplication = (updatedApplication: JobApplication) => {
    const updatedApplications = applications.map(app => 
      app.id === updatedApplication.id ? updatedApplication : app
    );
    setApplications(updatedApplications);
    saveApplications(updatedApplications);
    toast.success("Application updated successfully");
    
    // If a follow-up date was added or modified, check for reminders
    if (updatedApplication.followUpDate) {
      checkFollowUpReminders([updatedApplication]);
    }
  };

  const handleDeleteApplication = (id: string) => {
    const updatedApplications = applications.filter(app => app.id !== id);
    setApplications(updatedApplications);
    saveApplications(updatedApplications);
    toast.success("Application deleted successfully");
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <JobApplicationForm onAddApplication={handleAddApplication} />
      <JobApplicationList 
        applications={applications}
        onUpdateApplication={handleUpdateApplication}
        onDeleteApplication={handleDeleteApplication}
      />
    </div>
  );
};

export default Dashboard;
