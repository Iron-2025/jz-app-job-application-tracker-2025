
import React, { useState, useEffect } from "react";
import { JobApplication } from "@/types/job";
import JobApplicationForm from "./JobApplicationForm";
import JobApplicationList from "./JobApplicationList";
import { saveApplications, getApplications } from "@/services/localStorage";
import { toast } from "@/components/ui/sonner";

const Dashboard: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);

  useEffect(() => {
    const savedApplications = getApplications();
    setApplications(savedApplications);
  }, []);

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
