
import { JobApplication } from "@/types/job";

const STORAGE_KEY = "job-applications";

export const saveApplications = (applications: JobApplication[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
};

export const getApplications = (): JobApplication[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const clearApplications = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
