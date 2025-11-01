"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { SuperAdminSidebar } from "@/components/ui/super-admin-sidebar";
import Link from "next/link";
import {
  MessageSquare,
  Zap,
  Calendar as CalendarIcon,
  TrendingUp,
  Users,
  BarChart3,
  Building2,
} from "lucide-react";


export default function SuperAdminPage() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(new Date().setDate(1)), // Start of current month
    to: new Date(), // Today
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Mock data - replace with actual API calls
  const stats = {
    totalTokens: 1245678,
    totalInterviews: 342,
    activeStudents: 89,
    totalColleges: 12,
    interviewsToday: 23,
    avgTokensPerInterview: 3642,
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <SuperAdminSidebar
      headerContent={
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-lg font-semibold">AI Interview Dashboard</h1>
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={{
                  from: dateRange.from,
                  to: dateRange.to,
                }}
                onSelect={(range) => {
                  setDateRange({
                    from: range?.from,
                    to: range?.to,
                  });
                  if (range?.from && range?.to) {
                    setIsDatePickerOpen(false);
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      }
    >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-sidebar-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Tokens Used
                  </p>
                  <p className="text-2xl font-bold">
                    {formatNumber(stats.totalTokens)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Avg: {formatNumber(stats.avgTokensPerInterview)} per interview
                  </p>
                </div>
                <Zap className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="rounded-lg border border-sidebar-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Interviews
                  </p>
                  <p className="text-2xl font-bold">{stats.totalInterviews}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.interviewsToday} today
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="rounded-lg border border-sidebar-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Students
                  </p>
                  <p className="text-2xl font-bold">{stats.activeStudents}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +12% this month
                  </p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="rounded-lg border border-sidebar-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Colleges
                  </p>
                  <p className="text-2xl font-bold">{stats.totalColleges}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Active partners
                  </p>
                </div>
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-sidebar-border bg-card p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1">Token Usage Overview</h3>
                <p className="text-sm text-muted-foreground">
                  Total tokens consumed in selected period
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">This Month</span>
                  <span className="text-lg font-semibold">{formatNumber(stats.totalTokens)}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>75% of monthly limit</span>
                  <span>1.2M / 1.6M</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-sidebar-border bg-card p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1">Interview Activity</h3>
                <p className="text-sm text-muted-foreground">
                  Recent interview statistics
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completed Today</span>
                  <span className="text-lg font-semibold">{stats.interviewsToday}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">This Week</span>
                  <span className="text-lg font-semibold">142</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">This Month</span>
                  <span className="text-lg font-semibold">{stats.totalInterviews}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center rounded-lg border border-sidebar-border bg-card p-12">
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">
                Interview Analytics
              </h2>
              <p className="text-muted-foreground mb-4">
                View detailed reports and analytics from the Reports section.
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/super-admin/reports">View Reports</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/super-admin/users">Manage Students</Link>
                </Button>
              </div>
            </div>
          </div>
    </SuperAdminSidebar>
  );
}

