
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { JobApplication, JobStatus } from "@/types/job";

interface JobApplicationFormProps {
  onAddApplication: (application: JobApplication) => void;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ onAddApplication }) => {
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [dateApplied, setDateApplied] = useState<Date | undefined>(new Date());
  const [status, setStatus] = useState<JobStatus>("Applied");
  const [followUpDate, setFollowUpDate] = useState<Date | undefined>(undefined);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyName || !role || !dateApplied || !status) {
      // Show error or validation message
      return;
    }

    const newApplication: JobApplication = {
      id: uuidv4(),
      companyName,
      role,
      dateApplied: dateApplied.toISOString(),
      status,
      followUpDate: followUpDate ? followUpDate.toISOString() : undefined,
      notes: notes || undefined,
    };

    onAddApplication(newApplication);
    
    // Clear form
    setCompanyName("");
    setRole("");
    setDateApplied(new Date());
    setStatus("Applied");
    setFollowUpDate(undefined);
    setNotes("");
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add New Application</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Input
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Enter job role"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateApplied">Date Applied *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateApplied && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateApplied ? format(dateApplied, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateApplied}
                    onSelect={setDateApplied}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select 
                value={status}
                onValueChange={(value: JobStatus) => setStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Interviewing">Interviewing</SelectItem>
                  <SelectItem value="Offer">Offer</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Follow-up">Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {status === "Follow-up" && (
            <div className="space-y-2">
              <Label htmlFor="followUpDate">Follow-up Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !followUpDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {followUpDate ? format(followUpDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={followUpDate}
                    onSelect={setFollowUpDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes or details about this application"
              className="min-h-[100px]"
            />
          </div>

          <Button type="submit" className="w-full">Add Application</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobApplicationForm;
