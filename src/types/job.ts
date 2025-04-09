
export type JobStatus = "Applied" | "Interviewing" | "Offer" | "Rejected" | "Follow-up";

export interface JobApplication {
  id: string;
  companyName: string;
  role: string;
  dateApplied: string;
  status: JobStatus;
  followUpDate?: string;
  notes?: string;
}
