import React, { useState } from "react";
import { JobApplication, JobStatus } from "@/types/job";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, BellRing, AlertCircle } from "lucide-react";
import { format, parseISO, isAfter, isBefore, addDays } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";

interface JobApplicationListProps {
  applications: JobApplication[];
  onUpdateApplication: (application: JobApplication) => void;
  onDeleteApplication: (id: string) => void;
}

const getStatusClass = (status: JobStatus): string => {
  switch (status) {
    case "Applied":
      return "status-applied";
    case "Interviewing":
      return "status-interviewing";
    case "Offer":
      return "status-offer";
    case "Rejected":
      return "status-rejected";
    case "Follow-up":
      return "status-follow-up";
    default:
      return "";
  }
};

const getFollowUpStatus = (followUpDate: string | undefined): string => {
  if (!followUpDate) return "";
  
  const today = new Date();
  const followUp = parseISO(followUpDate);
  
  if (isBefore(followUp, today)) {
    return "follow-up-overdue";
  } else if (isBefore(followUp, addDays(today, 3))) {
    return "follow-up-soon";
  }
  return "";
};

const ReminderBadge = ({ followUpDate }: { followUpDate?: string }) => {
  if (!followUpDate) return null;

  const today = new Date();
  const followUp = parseISO(followUpDate);

  if (isBefore(followUp, today)) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <AlertCircle className="h-4 w-4" /> Overdue
      </Badge>
    );
  }

  if (isBefore(followUp, addDays(today, 3))) {
    return (
      <Badge variant="default" className="flex items-center gap-1">
        <BellRing className="h-4 w-4" /> Follow-up Soon
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="flex items-center gap-1">
      <Bell className="h-4 w-4" /> Follow-up
    </Badge>
  );
};

const JobApplicationList: React.FC<JobApplicationListProps> = ({
  applications,
  onUpdateApplication,
  onDeleteApplication,
}) => {
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredApplications = applications.filter(app => 
    app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (application: JobApplication) => {
    setEditingApplication({
      ...application,
      dateApplied: application.dateApplied,
      followUpDate: application.followUpDate
    });
  };

  const handleSaveEdit = () => {
    if (editingApplication) {
      onUpdateApplication(editingApplication);
      setEditingApplication(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingApplication(null);
  };

  const handleDelete = (id: string) => {
    onDeleteApplication(id);
    setOpenDeleteDialog(null);
  };

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "MMM d, yyyy");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Applications {applications.length > 0 && `(${applications.length})`}</h2>
        <Input
          placeholder="Search company or role"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {applications.length === 0 ? (
        <Alert>
          <AlertDescription>
            No job applications yet. Add your first application using the form above.
          </AlertDescription>
        </Alert>
      ) : filteredApplications.length === 0 ? (
        <Alert>
          <AlertDescription>
            No job applications match your search.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredApplications.map((application) => {
            const isEditing = editingApplication?.id === application.id;
            
            return (
              <Card key={application.id} className="overflow-hidden">
                {isEditing ? (
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-companyName">Company Name</Label>
                          <Input
                            id="edit-companyName"
                            value={editingApplication.companyName}
                            onChange={(e) => setEditingApplication({
                              ...editingApplication,
                              companyName: e.target.value
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-role">Role</Label>
                          <Input
                            id="edit-role"
                            value={editingApplication.role}
                            onChange={(e) => setEditingApplication({
                              ...editingApplication,
                              role: e.target.value
                            })}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-dateApplied">Date Applied</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id="edit-dateApplied"
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {editingApplication.dateApplied 
                                  ? formatDate(editingApplication.dateApplied)
                                  : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={editingApplication.dateApplied ? parseISO(editingApplication.dateApplied) : undefined}
                                onSelect={(date) => setEditingApplication({
                                  ...editingApplication,
                                  dateApplied: date ? date.toISOString() : new Date().toISOString()
                                })}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="edit-status">Status</Label>
                          <Select 
                            value={editingApplication.status}
                            onValueChange={(value: JobStatus) => setEditingApplication({
                              ...editingApplication,
                              status: value
                            })}
                          >
                            <SelectTrigger id="edit-status">
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

                      {editingApplication.status === "Follow-up" && (
                        <div className="space-y-2">
                          <Label htmlFor="edit-followUpDate">Follow-up Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id="edit-followUpDate"
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {editingApplication.followUpDate 
                                  ? formatDate(editingApplication.followUpDate)
                                  : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={editingApplication.followUpDate ? parseISO(editingApplication.followUpDate) : undefined}
                                onSelect={(date) => setEditingApplication({
                                  ...editingApplication,
                                  followUpDate: date ? date.toISOString() : undefined
                                })}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="edit-notes">Notes</Label>
                        <Textarea
                          id="edit-notes"
                          value={editingApplication.notes || ""}
                          onChange={(e) => setEditingApplication({
                            ...editingApplication,
                            notes: e.target.value
                          })}
                          placeholder="Add any notes about this application"
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancelEdit}
                          className="flex items-center"
                        >
                          <X className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                        <Button
                          type="button"
                          onClick={handleSaveEdit}
                          className="flex items-center"
                        >
                          <Check className="mr-2 h-4 w-4" /> Save
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                ) : (
                  <>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{application.companyName}</CardTitle>
                          <div className="text-muted-foreground mt-1">{application.role}</div>
                        </div>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEdit(application)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Dialog open={openDeleteDialog === application.id} onOpenChange={() => setOpenDeleteDialog(null)}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setOpenDeleteDialog(application.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirm Deletion</DialogTitle>
                              </DialogHeader>
                              <p>Are you sure you want to delete this job application for {application.companyName}?</p>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setOpenDeleteDialog(null)}>Cancel</Button>
                                <Button variant="destructive" onClick={() => handleDelete(application.id)}>Delete</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={getStatusClass(application.status)}>
                          {application.status}
                        </Badge>
                        <Badge variant="outline">
                          Applied: {formatDate(application.dateApplied)}
                        </Badge>
                        {application.followUpDate && (
                          <ReminderBadge followUpDate={application.followUpDate} />
                        )}
                      </div>
                      {application.notes && (
                        <div className="mt-2 text-sm text-muted-foreground bg-muted p-3 rounded-md">
                          {application.notes}
                        </div>
                      )}
                    </CardContent>
                  </>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobApplicationList;
