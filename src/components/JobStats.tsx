
import React from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { JobApplication, JobStatus } from "@/types/job";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, subDays, isWithin, parseISO } from "date-fns";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface JobStatsProps {
  applications: JobApplication[];
}

const JobStats: React.FC<JobStatsProps> = ({ applications }) => {
  // Skip rendering if no applications exist
  if (!applications.length) {
    return (
      <Card className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border shadow-md">
        <CardHeader>
          <CardTitle className="gradient-heading">Track Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Add some job applications to see your progress statistics.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate status distribution for pie chart
  const statusCounts = applications.reduce<Record<JobStatus, number>>((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {
    "Applied": 0,
    "Interviewing": 0,
    "Offer": 0,
    "Rejected": 0,
    "Follow-up": 0
  });

  const pieData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count
  }));

  // Define colors for each status
  const COLORS = {
    "Applied": "#3b82f6", // blue
    "Interviewing": "#8b5cf6", // purple
    "Offer": "#22c55e", // green
    "Rejected": "#ef4444", // red
    "Follow-up": "#f59e0b" // amber
  };

  // Calculate applications per week data
  const today = new Date();
  const fourWeeksAgo = subDays(today, 28);
  
  // Group applications by week
  const last4Weeks = Array.from({ length: 4 }, (_, i) => {
    const endDate = subDays(today, i * 7);
    const startDate = subDays(endDate, 6);
    const weekApplications = applications.filter(app => {
      const appDate = parseISO(app.dateApplied);
      return appDate >= startDate && appDate <= endDate;
    });
    
    return {
      name: `Week ${4-i}`,
      count: weekApplications.length,
      tooltip: `${format(startDate, "MMM d")} - ${format(endDate, "MMM d")}`,
    };
  }).reverse();

  return (
    <Card className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border shadow-md">
      <CardHeader>
        <CardTitle className="gradient-heading">Track Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="status">
          <TabsList className="mb-4">
            <TabsTrigger value="status">Status Distribution</TabsTrigger>
            <TabsTrigger value="timeline">Application Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="space-y-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[entry.name as JobStatus] || "#8884d8"} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-md">
                          <div className="font-bold">{data.name}</div>
                          <div>Count: {data.value}</div>
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-2">
              This chart shows the distribution of your job applications by status.
            </p>
          </TabsContent>

          <TabsContent value="timeline">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last4Weeks}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-md">
                            <div className="font-bold">{data.tooltip}</div>
                            <div>Applications: {data.count}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-2">
              This chart shows the number of applications you've submitted over the last 4 weeks.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default JobStats;
